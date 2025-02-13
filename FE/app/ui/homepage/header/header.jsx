import React from 'react'
import Link from 'next/link'
import { MdLogout } from "react-icons/md";

const header = () => {
  return (
    
    <header className='p-4 m-5 flex justify-end'>
      <div className='inline-flex flex-col pt-1 h-12 w-28 items-center text-end'>
        <Link href="/" className='p-1 hover:bg-slate-900 rounded-full'>
          <span className='font-strong'>Admin Admin</span>
        </Link>
      <span className='text-xs text-cl3 mb-36'>Administrator</span>
      </div>
      <Link href={"/"}>
        <div className='flex items-center text-lg pl-2 mt-2 p-1 hover:bg-slate-900 rounded-full'>
          <MdLogout
            size={25}
          />
        </div>
      </Link>
    </header>
    
  )
}

export default header