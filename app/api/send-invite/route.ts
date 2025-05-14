import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(req: Request) {
  try {
    const { email, name, projectId, role } = await req.json();
    
    if (!email || !name || !projectId || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const supabase = createClient(cookies());

    console.log('Looking for team member:', { email, projectId });
    const { data: members, error: fetchError } = await supabase
      .from('team_members')
      .select('invite_token')
      .eq('email', email)
      .eq('project_id', projectId);

    if (fetchError) {
      console.error('Error fetching team member:', fetchError);
      return NextResponse.json(
        { error: 'Failed to fetch team member' },
        { status: 500 }
      );
    }

    const member = Array.isArray(members) && members.length > 0 ? members[0] : null;
    if (!member) {
      console.error('No team member found for given email and projectId');
      return NextResponse.json(
        { error: 'No team member found for given email and projectId' },
        { status: 404 }
      );
    }

    let inviteToken = member.invite_token;
    if (!inviteToken) {
      inviteToken = crypto.randomUUID();
      // Update the team member record with the new invite token and status
      console.log('Updating team member:', { email, projectId });
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ 
          invite_token: inviteToken,
          status: 'invited'
        })
        .match({ 
          email, 
          project_id: projectId 
        });
      if (updateError) {
        console.error('Error updating team member:', updateError);
        return NextResponse.json(
          { error: 'Failed to update team member' },
          { status: 500 }
        );
      }
    }

    // Generate the invite link
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://app.superfan.one';
    const inviteLink = `${baseUrl}/invite?token=${inviteToken}&project_id=${projectId}`;

    // Send the invite email using Resend API
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

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'Superfan <noreply@app.superfan.one>',
        to: email,
        subject,
        html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error('Error sending invite email via Resend:', data);
      return NextResponse.json(
        { error: data.error || 'Failed to send invite email' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in send-invite:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 