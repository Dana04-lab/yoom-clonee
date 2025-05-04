'use client';

import React, { use, useState } from 'react';
import Loader from '@/components/Loader';
import MeetingRoom from '@/components/MeetingRoom';
import MeetingSetup from '@/components/MeetingSetup';
import { useGetCallById } from '@/hooks/useGetCallByid';
import { useAuth } from '@/app/context/AuthContext';
import { StreamCall, StreamTheme } from '@stream-io/video-react-sdk';

const Meeting = ({ params }: { params: Promise<{ id: string }> }) => {
  const { id } = use(params);
  const { user, isLoaded } = useAuth();
  const [isSetupComplete, setIsSetupComplete] = useState(false);
  const { call, isCallLoading } = useGetCallById(id);

  if (!isLoaded || isCallLoading || !user) return <Loader />;

  return (
    <main className="h-screen w-full">
      <StreamCall call={call}>
        <StreamTheme>
          {!isSetupComplete ? (
            <MeetingSetup setIsSetupComplete={setIsSetupComplete} />
          ) : (
            <MeetingRoom />
          )}
        </StreamTheme>
      </StreamCall>
    </main>
  );
};

export default Meeting;
