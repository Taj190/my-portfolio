import { createAuthClient, supabase} from "../lib/db";
// to insert tha data it is for public
export const contactController = {
    async submitContactForm(name, email, phone, message) {
      // Insert the contact form data into the 'contact' table
      const { data, error } = await supabase 
        .from('contact')
        .insert([{ name, email, phone_number: phone, message }]);
  
      if (error) {
        return { error };
      }
  
      return { data };
    }
  };


// to get the docs it is for admin 
  export const contactGetController = {
    async getContacts(page, limit, client) {
      const offset = (page - 1) * limit;
  
      const { data, error, count } = await client
        .from("contact")
        .select("*", { count: "exact" })
        .range(offset, offset + limit - 1);
  
      return { data, count, error };
    },
  };

  // to update the docs it is for admin again
  export const contactEditController = {
    async editContact(id, updatedData, client) {
    
      const { data, error } = await client
        .from("contact")
        .update(updatedData)
        .eq("id", id) 
        .select("*")
        .single(); 
       
        if (error) {
          return { error: error.message };
        }
    
        // Optionally, format or sanitize the response before sending back
        return { data: { id: data.id, name: data.name, email: data.email } };
    },
  };

  // to delete the docs ..

  export const contactDeleteController = {
    async deleteContact(id, client) {
      const { data, error } = await client
        .from("contact")
        .delete()
        .eq("id", id) // Match the contact by ID
        .single(); // Ensure only one row is deleted
      return { data, error };
    },
  };
  
  
  
  