import { Loader } from '@/components/Loader/Loader'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Loader/>
    </div>
  )
}

export default loading