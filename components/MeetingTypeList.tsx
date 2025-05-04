'use client';

import React, { useState } from 'react';
import HomeCard from './HomeCard';
import { useRouter } from 'next/navigation';
import MeetingModal from './MeetingModal';
import { Call, useStreamVideoClient } from '@stream-io/video-react-sdk';
import { useAuth } from '@/app/context/AuthContext';
import { toast } from 'sonner';
import { Textarea } from './ui/textarea';
import { Input } from './ui/input';
import ReactDatePicker from 'react-datepicker';

const MeetingTypeList = () => {
  const router = useRouter();
  const [meetingState, setMeetingState] = useState<
    'isScheduleMeeting' | 'isJoiningMeeting' | 'isInstantMeeting' | undefined
  >();

  const { user } = useAuth();
  const client = useStreamVideoClient();

  const [values, setValues] = useState({
    dateTime: new Date(),
    description: '',
    link: '',
  });

  const [callDetails, setCallDetails] = useState<Call>();

  const createMeeting = async () => {
    if (!client || !user) return;

    try {
      if (!values.dateTime) {
        toast('Күні мен уақытын таңдаңыз', {
          description: 'Кездесуді бастау үшін уақыт пен күнді көрсету қажет.',
        });
        return;
      }

      const id = crypto.randomUUID();
      const call = client.call('default', id);

      if (!call) throw new Error('Кездесуді құру сәтсіз аяқталды');

      const startsAt = values.dateTime.toISOString();
      const description = values.description || 'Жедел кездесу';

      await call.getOrCreate({
        data: {
          starts_at: startsAt,
          custom: { description },
        },
      });

      setCallDetails(call);

      toast('Кездесу құрылды', {
        description: values.description
          ? 'Сілтемені достарыңызбен бөлісіңіз.'
          : 'Сіз бірден қоңырауға өтесіз.',
      });

      // ❗ InstantMeeting болса ғана бірден conference ашу
      if (!values.description && meetingState === 'isInstantMeeting') {
        setTimeout(() => {
          router.push(`/meeting/${call.id}`);
        }, 500);
      }
    } catch (error) {
      console.error(error);
      toast.error('Қате орын алды', {
        description: 'Кездесуді құру кезінде бірнәрсе дұрыс болмады.',
      });
    }
  };

  const meetingLink = `${process.env.NEXT_PUBLIC_BASE_URL}/meeting/${callDetails?.id}`;

  return (
    <section className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-4">
      <HomeCard
        img="/icons/add-meeting.svg"
        title="Жаңа Кездесу"
        description="Жедел кездесуді бастаңыз"
        handleClick={() => setMeetingState('isInstantMeeting')}
        className="bg-pink-300"
      />
      <HomeCard
        img="/icons/schedule.svg"
        title="Кездесу Кестесі"
        description="Кездесуді жоспарлаңыз"
        handleClick={() => setMeetingState('isScheduleMeeting')}
        className="bg-purple-400"
      />
      <HomeCard
        img="/icons/recordings.svg"
        title="Жазбаларды Қарау"
        description="Жазбаларыңызды қарап шығыңыз"
        handleClick={() => router.push('/recordings')}
        className="bg-amber-200"
      />
      <HomeCard
        img="/icons/join-meeting.svg"
        title="Бірлескен Отырыс"
        description="Шақыру сілтемесі арқылы"
        handleClick={() => setMeetingState('isJoiningMeeting')}
        className="bg-blue-300"
      />

      {!callDetails ? (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Жиналыс Құру"
          handleClick={createMeeting}
        >
          <div className="flex flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-100">
              Сипаттама қосыңыз
            </label>
            <Textarea
              className="focus-visible:ring-0 focus-visible:ring-offset-0"
              onChange={(e) => {
                setValues({ ...values, description: e.target.value });
              }}
            />
          </div>
          <div className="flex w-full flex-col gap-2.5">
            <label className="text-base text-normal leading-[22px] text-sky-200">
              Күн мен Уақытты таңдаңыз
            </label>
            <ReactDatePicker
              selected={values.dateTime}
              onChange={(date) => setValues({ ...values, dateTime: date! })}
              showTimeSelect
              timeFormat="HH:mm"
              timeIntervals={15}
              timeCaption="time"
              dateFormat="MMMM d, yyyy h:mm aa"
              className="w-full rounded p-2 focus:outline-none"
            />
          </div>
        </MeetingModal>
      ) : (
        <MeetingModal
          isOpen={meetingState === 'isScheduleMeeting'}
          onClose={() => setMeetingState(undefined)}
          title="Жиналыс Құрылды"
          className="text-center"
          handleClick={() => {
            navigator.clipboard.writeText(meetingLink);
            toast('Сілтеме көшірілді', {
              description: 'Жиналыс сілтемесі буферге көшірілді.',
            });
          }}
          image="/icons/checked.svg"
          buttonIcon="/icons/copy.svg"
          buttonText="Жиналыс Сілтемесін Көшіру"
        />
      )}

      <MeetingModal
        isOpen={meetingState === 'isInstantMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Жедел Кездесуді бастаңыз"
        className="text-center"
        buttonText="Кездесуді бастаңыз"
        handleClick={createMeeting}
      />

      <MeetingModal
        isOpen={meetingState === 'isJoiningMeeting'}
        onClose={() => setMeetingState(undefined)}
        title="Сілтемені мына жерге теріңіз"
        className="text-center"
        buttonText="Жиналысқа Қосылыңыз"
        handleClick={() => router.push(values.link)}
      >
        <Input
          placeholder="Кездесу Сілтемесі"
          className="border-none bg-[#252A41] focus-visible:ring-0 focus-visible:ring-offset-0"
          onChange={(e) => setValues({ ...values, link: e.target.value })}
        />
      </MeetingModal>
    </section>
  );
};

export default MeetingTypeList;