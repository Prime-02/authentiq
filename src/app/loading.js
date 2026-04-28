import { Loader } from 'lucide-react'
import React from 'react'

const loading = () => {
  return (
    <div className='w-full h-screen flex justify-center items-center'>
        <Loader/>
    </div>
  )
}

export default loading