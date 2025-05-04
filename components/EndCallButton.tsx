'use client'

import { useCall, useCallStateHooks } from '@stream-io/video-react-sdk'
import { useRouter } from 'next/navigation';
import React from 'react'
import { Button } from './ui/button';

const EndCallButton = () => {
    const call = useCall();
    const router = useRouter();
    const { useLocalParticipant } = useCallStateHooks();
    const localParticipant = useLocalParticipant();

    const isMeetingOwner = localParticipant &&
    call?.state.createdBy && localParticipant.userId ===
    call.state.createdBy.id;

    if(!isMeetingOwner) return null;

  return (
<Button
  onClick={async () => {
    try {
      if (call) {
        await call.endCall();
        router.push('/');
      } else {
        console.error("Call is undefined");
      }
    } catch (err) {
      console.error("Failed to end call", err);
    }
  }}
  className='bg-red-500'
>
  Аяқтау
</Button>

  )
}

export default EndCallButton