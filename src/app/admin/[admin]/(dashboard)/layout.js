'use client'
import { useGlobalState } from '@/app/GlobalStateProvider';
import { BarChart, Database, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import React from 'react'


const layout = ({children}) => {
    const {formData} = useGlobalState()
  const routeId = formData.adminFullName.replace(/\s+/g, "_");
  return (
    <div>
      <nav className=" flex gap-x-5">
        <Link href={`/admin/${routeId}/`} className="flex gap-1 items-center">
          <p>Data</p>
          <p>
            <Database size={20} />
          </p>
        </Link>
        <Link
          href={`/admin/${routeId}/stats`}
          className="flex gap-1 items-center"
        >
          <p>stats</p>
          <p>
            <TrendingUp size={20} />
          </p>
        </Link>
        <Link
          href={`/admin/${routeId}/analitics`}
          className="flex gap-1 items-center"
        >
          <p>Analitics</p>
          <p>
            <BarChart size={20} />
          </p>
        </Link>
      </nav>
      {children}
    </div>
  );
}

export default layout