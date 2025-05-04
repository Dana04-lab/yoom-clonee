'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { signOut } from 'firebase/auth';
import { useAuth } from '@/app/context/AuthContext';
import { auth } from '@/app/firebase';
import MobileNav from './MobileNav';

const Navbar = () => {
  const { user } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'Қолданушы';

  const handleLogout = async () => {
    await signOut(auth);
    window.location.reload();
  };

  return (
    <nav className="flex-between fixed z-50 w-full bg-[#1C1F2E] px-6 py-4 lg:px-10 shadow-lg">
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/icons/logo.svg"
          width={32}
          height={32}
          alt="LinkUp logo"
          className="rounded-full"
        />
        <p className="text-[26px] font-extrabold text-white max-sm:hidden">
          LinkUp
        </p>
      </Link>

      <div className="flex items-center gap-4">
        {user ? (
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="flex items-center gap-2 focus:outline-none"
            >
              {user.photoURL ? (
                <Image
                  src={user.photoURL}
                  width={36}
                  height={36}
                  alt="avatar"
                  className="rounded-full"
                />
              ) : (
                <div className="w-9 h-9 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-3 w-[220px] bg-white rounded-xl shadow-lg p-4 z-50 text-black border border-black">
                <p className="text-sm font-bold">{displayName}</p>
                <p className="text-xs text-black mb-4">{user.email}</p>
                <hr className="border-black/50 my-2" />
                <Link href="/account" className="text-black hover:underline text-sm">
                  Профиль
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left text-red-500 hover:text-red-600 mt-2"
                >
                  Шығу
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link
            href="/sign-in"
            className=" text-white px-4 py-2 rounded  transition"
          >
            Кіру
          </Link>
        )}

        <MobileNav />
      </div>
    </nav>
  );
};

export default Navbar;
