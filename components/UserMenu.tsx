'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signOut } from 'firebase/auth';
import Image from 'next/image';
import { useAuth } from '@/app/context/AuthContext';
import { auth } from '@/app/firebase';

const UserMenu = () => {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  if (!user) return null;

  const displayName = user.displayName || 'Аты жоқ';
  const email = user.email;

  const handleSignOut = async () => {
    await signOut(auth);
    router.push('/sign-in'); // ✅ Автоматты бағыттау
  };

  return (
    <div className="relative">
      <button onClick={() => setOpen(!open)} className="flex items-center gap-2">
        {user.photoURL ? (
          <Image src={user.photoURL} width={36} height={36} alt="avatar" className="rounded-full" />
        ) : (
          <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
            {displayName.charAt(0)}
          </div>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-3 w-[220px] bg-dark-2 rounded-xl shadow-lg p-4 z-50 text-white">
          <p className="text-sm font-bold">{displayName}</p>
          <p className="text-xs text-gray-400 mb-4">{email}</p>
          <button
            onClick={handleSignOut}
            className="w-full text-left text-red-500 hover:text-red-600 mt-2"
          >
            Шығу
          </button>
        </div>
      )}
    </div>
  );
};

export default UserMenu;
