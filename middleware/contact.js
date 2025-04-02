import { createAuthClient } from "../lib/db";

export async function authMiddleware(req) {
  const token = req.headers.get("authorization")?.split("Bearer ")[1];
  
  if (!token) {
    return { error: "Unauthorized: No token provided", client: null };
  }

  const client = createAuthClient(token);
  return { client, error: null };
}


export function validateContact(req) {
    const errors = [];
    const { name, email, phone_number, message } = req;
  
    // Name validation (at least 3 characters)
    if (!name || name.trim().length < 3) {
      errors.push("Name must be at least 3 characters long.");
    }
  
    // Email validation (basic regex check)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push("Invalid email format.");
    }
  
    // Phone number validation (length must be at least 9 digits)
    if (!phone_number || phone_number.length < 9) {
      errors.push("Phone number must be at least 9 digits long.");
    }
  
    // Message sanitization and length check (max 300 words)
    if (!message) {
      errors.push("Message is required.");
    } else {
      const wordCount = message.trim().split(/\s+/).length;
      if (wordCount > 50) {
        errors.push("Message cannot exceed 50 words.");
      }
    }
  
    // Return errors if any
    if (errors.length > 0) {
      return { valid: false, errors };
    }
  
    return { valid: true };
  }
  