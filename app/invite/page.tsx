'use client';
export const dynamic = 'force-dynamic';

import { Suspense } from 'react';
import { InvitePage } from './InvitePage';

export default function InvitePageWrapper() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <InvitePage />
    </Suspense>
  );
} 