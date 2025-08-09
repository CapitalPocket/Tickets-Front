'use client';
import Invoices from '@/app/ui/invoices';
import React, { useState } from 'react';

const Page = () => {

  const [park, setPark] = useState<'PN' | 'AP' | null>(null);

  return (
    <div className="h-full flex flex-col items-center justify-center bg-gray-100">
      <h1 className="text-2xl font-bold my-[2.5%] text-center">Informes de los parques</h1>
      <div className="flex-grow w-full max-w-6xl mx-auto mt-8">
        <Invoices park="Parque Norte" />
      </div>
    </div>
  );
};

export default Page