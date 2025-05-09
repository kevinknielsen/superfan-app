import type { NextApiRequest, NextApiResponse } from "next";
import supabase from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Validate HTTP method
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    // Query the projects table and select specific columns
    const { data, error } = await supabase.from("projects").select("*");

    if (error) {
      throw error;
    }

    // Return the data with a 200 status code
    res.status(200).json({ data });
  } catch (error: any) {
    // Handle errors and return a 500 status code
    res.status(500).json({ error: error.message || "Internal Server Error" });
  }
}
