'use client'

import React from 'react';
import CallList from '@/components/CallList';
const Upcoming = () => {
  return (
    <section className="flex size-full flex-col gap-10 text-white p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Жоспарланған кездесулер</h1>

      </div>

      <CallList type="upcoming" />
    </section>
  );
};

export default Upcoming;
