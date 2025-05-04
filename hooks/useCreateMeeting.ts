'use client'

import { useRouter } from 'next/navigation'
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk'
import { useState } from 'react'

const useCreateMeeting = (
  userId: string,
  values: { dateTime: Date; description: string }
) => {
  const router = useRouter()
  const client = useStreamVideoClient()
  const [callDetails, setCallDetails] = useState<Call>()

  const createMeeting = async () => {
    if (!client || !userId) {
      console.error('❌ Client немесе userId жоқ')
      return
    }

    try {
      const id = crypto.randomUUID()
      const call = client.call('default', id)

      if (!call) throw new Error('❌ Call құру сәтсіз аяқталды')

      const startsAt = values.dateTime?.toISOString() || new Date().toISOString()
      const description = values.description || 'Жедел кездесу'

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: {
            description,
          },
        },
      })

      setCallDetails(call)

      if (!values.description) {
        router.push(`/meeting/${call.id}`)
      }
    } catch (error) {
      console.error('❌ createMeeting қатесі:', error)
    }
  }

  return { createMeeting, callDetails }
}

export default useCreateMeeting
