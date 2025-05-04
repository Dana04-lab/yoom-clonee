'use client'

import tokenProvider from '@/actions/stream.actions'
import { useAuth } from '@/app/context/AuthContext'
import Loader from '@/components/Loader'
import {
  StreamVideoClient,
  StreamVideo,
} from '@stream-io/video-react-sdk'
import { ReactNode, useEffect, useState } from 'react'

const apiKey = process.env.NEXT_PUBLIC_STREAM_API_KEY as string

const StreamVideoProvider = ({ children }: { children: ReactNode }) => {
  const [videoClient, setVideoClient] = useState<StreamVideoClient>()
  const { user } = useAuth()

  useEffect(() => {
    if (!user || !apiKey) return

    const client = new StreamVideoClient({
      apiKey,
      user: {
        id: user.uid,
        name: user.displayName || user.email || user.uid,
        image: user.photoURL || undefined,
      },
      tokenProvider: async () => await tokenProvider(user.uid),
    })

    setVideoClient(client)
  }, [user])

  if (!videoClient) return <Loader />

  return <StreamVideo client={videoClient}>{children}</StreamVideo>
}

export default StreamVideoProvider
