import React, { useState } from 'react'
import { BentoImg } from '../index'
import Image from 'next/image'

const BentoBox = () => {
  return (
      <div className='flex w-full items-center justify-center mb-10'>
        {
          BentoImg.map((img, ind) => (
            <div className={` overflow-hidden rounded-xl `} key={ind}>
              <Image src={img.img} className={` hover:scale-110 transition duration-300`} alt={`image ${ind + 1}`} loading='lazy'/> 
            </div>
          ))
        }
    </div>
  )
}

export default BentoBox
