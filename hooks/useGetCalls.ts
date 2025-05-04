import { Call, useStreamVideoClient } from "@stream-io/video-react-sdk";
import { useEffect, useState } from "react";
import { useAuth } from '@/app/context/AuthContext';

export const useGetCalls = () => {
  const [calls, setCalls] = useState<Call[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const client = useStreamVideoClient();
  const { user } = useAuth();

  useEffect(() => {
    const loadCalls = async () => {
      if (!client || !user || !user.uid) {
        console.warn("Client немесе user дайын емес");
        return;
      }

      setIsLoading(true);
      try {
        const { calls } = await client.queryCalls({
          sort: [{ field: 'starts_at', direction: -1 }],
          filter_conditions: {
            // Stream Video API тек осы өрістерді таниды
            $or: [
              { 'created_by.id': user.uid },
              { members: { $in: [user.uid] } },
            ],
          },
        });

        setCalls(calls);
      } catch (error) {
        console.error("Қоңырауларды жүктеу қатесі:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCalls();
  }, [client, user?.uid]);

  const now = new Date();

  const endedCalls = calls.filter((call) => {
    const startsAt = call.state?.startsAt;
    const endedAt = call.state?.endedAt;
    return (startsAt && new Date(startsAt) < now) || !!endedAt;
  });

  const upcomingCalls = calls.filter((call) => {
    const startsAt = call.state?.startsAt;
    return startsAt && new Date(startsAt) > now;
  });

  return {
    endedCalls,
    upcomingCalls,
    callRecordings: calls,
    isLoading,
  };
};
