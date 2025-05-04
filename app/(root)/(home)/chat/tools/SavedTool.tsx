'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BsEmojiSmile, BsPaperclip, BsImage, BsThreeDotsVertical } from 'react-icons/bs';
import dynamic from 'next/dynamic';
import { sendTextMessage, uploadFile, listenToSavedItems, deleteSavedItem } from '@/lib/upload';
import { useAuth } from '@/app/context/AuthContext';

const Picker = dynamic(() => import('emoji-picker-react'), { ssr: false });

interface MessageItem {
  id: string;
  text: string;
}

const SavedTools: React.FC = () => {
  const { user } = useAuth();
  const userId = user?.uid || 'guest';

  const [message, setMessage] = useState('');
  const [showEmoji, setShowEmoji] = useState(false);
  const [messages, setMessages] = useState<MessageItem[]>([]);
  const [dropdownOpenId, setDropdownOpenId] = useState<string | null>(null);
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [filePreview, setFilePreview] = useState<{ name: string; url: string; type: string } | null>(null);
  const [bookmarks, setBookmarks] = useState<MessageItem[]>([]);
  const [reminders, setReminders] = useState<MessageItem[]>([]);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const unsubscribe = listenToSavedItems(userId, (items) => {
      const formatted = items.map((item) => ({
        id: item.id,
        text: item.content || item.name || 'Файл',
      }));
      setMessages(formatted);
    });
    return () => unsubscribe();
  }, [userId]);

  const handleEmojiClick = (emojiData: any) => {
    setMessage((prev) => prev + emojiData.emoji);
  };

  const handleSendText = async () => {
    if (message.trim()) {
      try {
        const finalMessage = replyTo ? `↩️ ${replyTo}\n${message}` : message;
        await sendTextMessage(finalMessage, userId);
        setMessage('');
        setReplyTo(null);
      } catch (error) {
        console.error('Хабарлама жіберу қатесі:', error);
      }
    } else if (filePreview) {
      const { name, url, type } = filePreview;
      const formatted = type === 'image' ? `🖼️ [${name}](${url})` : `📎 [${name}](${url})`;
      await sendTextMessage(formatted, userId);
      setFilePreview(null);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadFile(file, userId, 'file');
      setFilePreview({ name: result.name, url: result.url, type: 'file' });
    }
  };

  const handlePhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const result = await uploadFile(file, userId, 'image');
      setFilePreview({ name: result.name, url: result.url, type: 'image' });
    }
  };

  const handleDropdownAction = async (action: string, item: MessageItem) => {
    setDropdownOpenId(null);
    switch (action.trim()) {
      case 'reply':
        setReplyTo(item.text);
        break;
      case 'edit':
        setMessage(item.text);
        await deleteSavedItem(item.id);
        break;
      case 'copy':
        await navigator.clipboard.writeText(item.text);
        break;
      case 'bookmark':
        setBookmarks((prev) => [...prev, item]);
        break;
      case 'remind':
        setReminders((prev) => [...prev, item]);
        break;
      case 'delete':
        await deleteSavedItem(item.id);
        break;
    }
  };

  return (
    <div className="p-6 border rounded-md bg-white shadow w-full max-w-3xl mx-auto min-h-[500px]">
      <h3 className="text-2xl font-bold mb-4 text-black">Сақталғандар</h3>

      <p className="text-sm text-gray-600 mb-2">
        Сіз → <span className="font-medium text-gray-900">{user?.displayName || 'Аноним қолданушы'}</span>
      </p>

      {replyTo && (
        <div className="text-sm text-blue-600 mb-2">
          Жауап беру: <span className="font-semibold">{replyTo}</span>
        </div>
      )}

      {filePreview && (
        <div className="mb-2 text-sm text-gray-800">
          Таңдалған {filePreview.type === 'image' ? 'сурет' : 'файл'}: <a href={filePreview.url} target="_blank" rel="noreferrer" className="text-blue-600 underline">{filePreview.name}</a>
        </div>
      )}

      <div className="flex items-center gap-3 mb-2">
        <button onClick={() => setShowEmoji(!showEmoji)} title="Эмодзи">
          <BsEmojiSmile className="text-xl text-gray-700" />
        </button>

        <label>
          <BsImage className="text-xl text-gray-700 cursor-pointer" />
          <input type="file" accept="image/*" hidden ref={imageInputRef} onChange={handlePhotoChange} />
        </label>

        <label>
          <BsPaperclip className="text-xl text-gray-700 cursor-pointer" />
          <input type="file" hidden ref={fileInputRef} onChange={handleFileChange} />
        </label>
      </div>

      {showEmoji && (
        <div className="mb-2">
          <Picker onEmojiClick={handleEmojiClick} />
        </div>
      )}

      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Хабарлама жазу..."
          className="flex-1 p-3 border rounded-md text-black"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          onClick={handleSendText}
          className="px-5 py-3 bg-blue-600 text-white rounded-md"
        >
          Жіберу
        </button>
      </div>

      <div className="space-y-4">
        {messages.map((item) => (
          <div
            key={item.id}
            className="relative group border p-3 rounded-md bg-gray-100 hover:bg-gray-50"
          >
            <p className="text-black whitespace-pre-line">{item.text}</p>
            <button
              onClick={() => setDropdownOpenId(dropdownOpenId === item.id ? null : item.id)}
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
            >
              <BsThreeDotsVertical />
            </button>
            {dropdownOpenId === item.id && (
              <div className="absolute right-3 top-9 z-10 w-48 bg-white border rounded-md shadow-md">
                {[
                  ['reply', 'Жауап беру'],
                  ['copy', 'Көшіру'],
                  ['bookmark', 'Бетбелгіге қосу'],
                  ['remind', 'Еске салу'],
                  ['delete', 'Өшіру'],
                ].map(([action, label]) => (
                  <button
                    key={action}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDropdownAction(action, item);
                    }}
                    className="block w-full px-4 py-2 text-left text-sm hover:bg-gray-100 text-black"
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedTools;