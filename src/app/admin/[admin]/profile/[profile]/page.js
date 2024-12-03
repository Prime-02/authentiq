'use client'
import { useGlobalState } from '@/app/GlobalStateProvider'
import Settings from '@/components/reusables/dynamicSettings/Settings'
import React from 'react'

const page = () => {
    const {formData, adminToken} =  useGlobalState()
    const routeId = formData.adminEmail
  return (
    <div>
      <Settings prop="admin" route={`/admin/${routeId}/profile`} token={adminToken}/>
    </div>
  );
}

export default page