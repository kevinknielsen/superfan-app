// Follow this setup guide to integrate the Deno runtime into your Next.js app:
// https://deno.com/manual@v1.36.4/runtime/manual/getting_started/setup_your_environment

// This imports the Supabase client
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { corsHeaders } from "../_shared/cors.ts";

interface EmailData {
  to: string;
  name: string;
  role: string;
  inviteLink: string;
}

serve(async (req) => {
  // Handle CORS
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { to, name, role, inviteLink } = await req.json() as EmailData;

    if (!to || !name || !role || !inviteLink) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields' }),
        { 
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        }
      );
    }

    // Compose the email
    const subject = `${name}, you're invited to join a project on Superfan`;
    const html = `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>You've been invited to collaborate!</h2>
        <p>Hi ${name},</p>
        <p>You've been invited to join a project on Superfan as a ${role}.</p>
        <p>Click the button below to accept the invitation and get started:</p>
        <a href="${inviteLink}" 
           style="display: inline-block; 
                  background-color: #000; 
                  color: #fff; 
                  padding: 12px 24px; 
                  text-decoration: none; 
                  border-radius: 4px; 
                  margin: 16px 0;">
          Accept Invitation
        </a>
        <p>If you didn't expect this invitation, you can safely ignore this email.</p>
        <p>Best regards,<br>The Superfan Team</p>
      </div>
    `;

    // Call the Supabase Email API with detailed logging
    const { SUPABASE_SERVICE_ROLE_KEY } = Deno.env.toObject();
    console.log('Sending email with:', { to, subject, html });
    console.log('Using service role key present:', !!SUPABASE_SERVICE_ROLE_KEY);

    const response = await fetch(
      `https://cmaeiypdgbxcgxhfmtyq.functions.supabase.co/email/send`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        },
        body: JSON.stringify({
          to,
          subject,
          html,
        }),
      }
    );

    console.log('Email API response status:', response.status);
    const responseBody = await response.text();
    console.log('Email API response body:', responseBody);

    if (!response.ok) {
      return new Response(
        JSON.stringify({ error: `Failed to send email: ${responseBody}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error sending invite email:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
}); 