import React, {useEffect} from 'react'

const MessageBox = ({message}) => {
  return (
    <div className='w-[80%] h-15 flex justify-center items-center bg-[#585858d7] backdrop-blur-md rounded-lg absolute bottom-[15%] left-1/2 -translate-x-1/2 z-50'>
      <h1 className='font-syne text-white  text-md'>{message}</h1>
    </div>
  )
}

export default MessageBox