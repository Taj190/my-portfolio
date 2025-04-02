import { contactController, contactDeleteController, contactEditController, contactGetController } from "../../../../controller/contact";
import { authMiddleware, validateContact } from "../../../../middleware/contact";

export async function POST(req) {
    const body = await req.json();
  
    // Validate input data
    const validation = validateContact(body);
    if (!validation.valid) {
      return new Response(JSON.stringify({ errors: validation.errors }), { status: 400 });
    }
  
    const { name, email, phone_number, message } = body;
  
    // Call the controller to handle the contact form submission
    const { data, error } = await contactController.submitContactForm(name, email, phone_number, message);
  
    if (error) {
      return new Response(JSON.stringify({ error: error.message }), { status: 400 });
    }
  
    return new Response(JSON.stringify({ message: "Contact submitted successfully!" }), { status: 200 });
  }
// to display all the docs only admin can have this auth
  export async function GET(req) {
    const url = new URL(req.url);
    const page = parseInt(url.searchParams.get("page")) || 1;
    const limit = parseInt(process.env.NEXT_PUBLIC_CONTACT_LIMIT) || 10;
  
    // Use middleware to get the client
    const { client, error } = await authMiddleware(req);
  
    if (error) {
      return new Response(JSON.stringify({ error }), { status: 401 });
    }
  
    // Call controller with client
    const { data, count, error: fetchError } = await contactGetController.getContacts(
      page, 
      limit,
      client
    );
  
    if (fetchError) {
      return new Response(JSON.stringify({ error: fetchError.message }), { status: 400 });
    }
  
    return new Response(JSON.stringify(data), { status: 200 });
  }

  // to edit docs if needed 
export async function PUT(req) {
  const { client, error } = await authMiddleware(req);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  // Parse JSON body
  const { id, name, email, phone_number, message } = await req.json();

  // Validate required fields
  if (!id || !name || !email || !message) {
    return new Response(JSON.stringify({ error: "Missing required fields" }), { status: 400 });
  }

 // Validate the contact data
 const { valid, errors } = validateContact({ name, email, phone_number, message });

 if (!valid) {
   return new Response(JSON.stringify({ errors }), { status: 400 });
 }


  // Call the controller to update the contact
  const { data, error: updateError } = await contactEditController.editContact(
    id,
    { name, email, phone_number, message },
    client
  );

  if (updateError) {
    return new Response(JSON.stringify({ error: updateError.message }), { status: 400 });
  }

  return new Response(JSON.stringify(data), { status: 200 });
}

// to delete the docs if needed ..
export async function DELETE(req) {
  const { client, error } = await authMiddleware(req);

  if (error) {
    return new Response(JSON.stringify({ error }), { status: 401 });
  }

  // Parse the request body to get the ID
  const { id } = await req.json();

  // Check if the ID exists
  if (!id) {
    return new Response(JSON.stringify({ error: "ID is required" }), { status: 400 });
  }

  // Call the controller to delete the contact
  const { data, error: deleteError } = await contactDeleteController.deleteContact(id, client);

  if (deleteError) {
    return new Response(JSON.stringify({ error: deleteError.message }), { status: 400 });
  }

  return new Response(JSON.stringify({
    success: true,
    message: "Contact deleted successfully",}), { status: 200 });
}




  
