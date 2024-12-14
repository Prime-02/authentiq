import React from 'react'

const layout = ({children}) => {
  return (
    <div className='min-h-screen pt-20 w-full overflow-x-hidden'>
        {children}
    </div>
  )
}

export default layout