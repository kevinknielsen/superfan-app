'use client';
export const dynamic = 'force-dynamic';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { usePrivy, useLogin } from '@privy-io/react-auth';

export default function InvitePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { ready, authenticated, user } = usePrivy();
  const login = useLogin();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [inviteData, setInviteData] = useState<{
    projectName: string;
    role: string;
    inviterName: string;
  } | null>(null);
  const [checking, setChecking] = useState(true);

  const token = searchParams?.get('token') || '';
  const projectId = searchParams?.get('project_id') || '';

  useEffect(() => {
    if (!ready) return;
    if (!authenticated) {
      login(); // Show Privy login modal
      setChecking(false);
      return;
    }
    if (!token || !projectId) {
      setError('Invalid invite link');
      setLoading(false);
      setChecking(false);
      return;
    }

    const verifyInvite = async () => {
      try {
        const supabase = createClient();
        
        // Get invite details
        const { data: teamMember, error: teamError } = await supabase
          .from('team_members')
          .select(`
            *,
            projects:project_id (
              name,
              creator:creator_id (
                name
              )
            )
          `)
          .eq('invite_token', token)
          .single();

        if (teamError || !teamMember) {
          setError('Invalid or expired invite');
          setLoading(false);
          setChecking(false);
          return;
        }

        setInviteData({
          projectName: teamMember.projects.name,
          role: teamMember.role,
          inviterName: teamMember.projects.creator.name
        });
        setLoading(false);
        setChecking(false);
      } catch (err) {
        console.error('Error verifying invite:', err);
        setError('Failed to verify invite');
        setLoading(false);
        setChecking(false);
      }
    };

    verifyInvite();
  }, [ready, authenticated, login, token, projectId]);

  const handleAcceptInvite = async () => {
    if (!user) {
      await login();
      return;
    }

    try {
      setLoading(true);
      const supabase = createClient();

      // Update team member status
      const { error: updateError } = await supabase
        .from('team_members')
        .update({ 
          status: 'accepted',
          wallet_address: user.wallet?.address
        })
        .eq('invite_token', token);

      if (updateError) throw updateError;

      // Redirect to project page
      router.push(`/projects/${projectId}`);
    } catch (err) {
      console.error('Error accepting invite:', err);
      setError('Failed to accept invite');
      setLoading(false);
    }
  };

  if (checking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Checking your invite...</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-4 text-gray-600">Verifying your invite...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-red-600">Error</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">{error}</p>
            <Button 
              className="mt-4 w-full"
              onClick={() => router.push('/')}
            >
              Return Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Project Invitation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-600">
              {inviteData?.inviterName} has invited you to join their project:
            </p>
            <div className="bg-gray-50 p-4 rounded-lg">
              <h3 className="font-medium">{inviteData?.projectName}</h3>
              <p className="text-sm text-gray-500">Role: {inviteData?.role}</p>
            </div>
            <Button 
              className="w-full"
              onClick={handleAcceptInvite}
              disabled={loading}
            >
              {user ? 'Accept Invitation' : 'Connect Wallet to Accept'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 