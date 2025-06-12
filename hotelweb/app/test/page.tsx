'use client';
import React from 'react'
import toast from 'react-hot-toast';

const page = () => {
    const notify = () => toast.success('Here is your toast.');
  return (
    <div>
       <button onClick={notify}>Make me a toast</button>
    </div>
  )
}

export default page
