'use client';

import {
  DeviceSettings,
  useCall,
  VideoPreview,
} from '@stream-io/video-react-sdk';
import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';

const MeetingSetup = ({
  setIsSetupComplete,
}: {
  setIsSetupComplete: (value: boolean) => void;
}) => {
  const [isMicCamToggledOn, setIsMicCamToggledOn] = useState(false);
  const call = useCall();

  if (!call) {
    throw new Error('useCall must be used within StreamCall component');
  }

  useEffect(() => {
    if (isMicCamToggledOn) {
      call.camera.disable();
      call.microphone.disable();
    } else {
      call.camera.enable();
      call.microphone.enable();
    }
  }, [isMicCamToggledOn, call]);

  const handleJoin = async () => {
    try {
      await call.join();
      setIsSetupComplete(true);
    } catch (error) {
      console.error('Қосылу кезінде қате:', error);
    }
  };

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-6 text-white">
      <h1 className="text-2xl font-bold">Орнату</h1>
      <VideoPreview />

      <div className="flex items-center justify-center gap-3">
        <label className="flex items-center gap-2 font-medium">
          <input
            type="checkbox"
            checked={isMicCamToggledOn}
            onChange={(e) => setIsMicCamToggledOn(e.target.checked)}
          />
          Микрофонмен қосылыңыз және камераны өшіріңіз
        </label>
        <DeviceSettings />
      </div>

      <Button
        className="rounded-md bg-green-300 px-4 py-2.5 text-black font-semibold"
        onClick={handleJoin}
      >
        Бастау
      </Button>
    </div>
  );
};

export default MeetingSetup;
