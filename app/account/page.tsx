'use client';

import { useAuth } from '@/app/context/AuthContext';
import { auth, storage } from '@/app/firebase';
import { updateEmail, updatePassword, updateProfile } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes, deleteObject } from 'firebase/storage';
import { useState, useRef } from 'react';
import { reauthenticate } from '../firebas/reauthenticate';
import Image from 'next/image';
import { HiTrash, HiPencil, HiEye } from 'react-icons/hi';
import { useRouter } from 'next/navigation';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

const AccountPage = () => {
  const { user } = useAuth();
  const router = useRouter();

  const [name, setName] = useState(user?.displayName || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [photoURL, setPhotoURL] = useState(user?.photoURL || '');
  const [showPhotoOptions, setShowPhotoOptions] = useState(false);
  const [showPhotoModal, setShowPhotoModal] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpdate = async () => {
    try {
      if (!auth.currentUser) return;
      await reauthenticate(password);

      await updateProfile(auth.currentUser, {
        displayName: name,
        photoURL: photoURL || null,
      });

      if (email !== user?.email) {
        await updateEmail(auth.currentUser, email);
      }

      if (password.length >= 6) {
        await updatePassword(auth.currentUser, password);
      }

      setMessage('✅ Өзгерістер сәтті сақталды!');
    } catch (error: any) {
      setMessage(`❌ Қате: ${error.message}`);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !auth.currentUser) return;

    const imageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    await uploadBytes(imageRef, file);
    const downloadURL = await getDownloadURL(imageRef);
    setPhotoURL(downloadURL);
    await updateProfile(auth.currentUser, { photoURL: downloadURL });
  };

  const handleDeletePhoto = async () => {
    if (!auth.currentUser) return;
    const imageRef = ref(storage, `avatars/${auth.currentUser.uid}`);
    try {
      await deleteObject(imageRef);
      await updateProfile(auth.currentUser, { photoURL: '' });
      setPhotoURL('');
    } catch (err) {
      console.error('Delete failed', err);
    }
  };

  return (
    <div className="max-w-xl mx-auto mt-16 px-6 py-10 text-white">
      <div className="flex justify-end">
        <button
          onClick={() => router.push('/')}
          className="text-white text-xl hover:text-red-500 transition-colors"
          title="Жабу"
        >
          ×
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Аккаунт баптаулары</h1>

      <div className="flex justify-center mb-4 relative">
        <Image
          src={photoURL || '/icons/default-avatar.png'}
          alt="Аватар"
          width={100}
          height={100}
          className="rounded-full object-cover border border-white"
        />
        <button
          onClick={() => setShowPhotoOptions(!showPhotoOptions)}
          className="absolute right-0 top-0 p-1 bg-dark-2 rounded-full border border-white"
        >
          <HiPencil className="w-5 h-5 text-white" />
        </button>

        {showPhotoOptions && (
          <div className="absolute top-24 bg-[#1C1F2E] p-4 rounded-xl w-52 shadow-lg flex flex-col gap-3 z-50 border border-white">
            <button onClick={() => setShowPhotoModal(true)} className="flex items-center gap-2 text-white">
              <HiEye /> Фотоны ашу
            </button>
            <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-2 text-white">
              <HiPencil /> Фотоны өзгерту
            </button>
            <button onClick={handleDeletePhoto} className="flex items-center gap-2 text-red-500">
              <HiTrash /> Фотоны өшіру
            </button>
          </div>
        )}

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleImageUpload}
          accept="image/*"
        />
      </div>

      <div className="flex flex-col gap-5">
        <label>
          Аты-жөні:
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-blue-100 text-black"
          />
        </label>

        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full p-2 rounded bg-blue-100 text-black"
          />
        </label>

        <label>
          Құпиясөз (6+ символ):
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Жаңарту қажет болса ғана"
              className="mt-1 w-full p-2 pr-10 rounded bg-blue-100 text-black"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-600"
            >
              {showPassword ? <EyeSlashIcon className="w-5 h-5" /> : <EyeIcon className="w-5 h-5" />}
            </button>
          </div>
        </label>

        <button
          onClick={handleUpdate}
          className="bg-blue-600 hover:bg-blue-700 px-5 py-2 rounded text-white"
        >
          Өзгерістерді сақтау
        </button>

        {message && <p className="text-sm mt-2">{message}</p>}
      </div>

      {/* Фото модал */}
      {showPhotoModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-[#1C1F2E] p-4 rounded-lg border border-white max-w-[80%]">
            <div className="flex justify-end">
              <button onClick={() => setShowPhotoModal(false)} className="text-white text-xl">×</button>
            </div>
            <Image
              src={photoURL}
              alt="Толық аватар"
              width={300}
              height={300}
              className="rounded-lg object-contain mx-auto"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
