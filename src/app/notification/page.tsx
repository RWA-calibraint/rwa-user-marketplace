'use client';
import { useRouter } from 'next/navigation';

import ComingSoon from '../homepage/ComingSoon';

export default function Notification() {
  const router = useRouter();

  return <ComingSoon onGoHome={() => router.push('/')} />;
}
