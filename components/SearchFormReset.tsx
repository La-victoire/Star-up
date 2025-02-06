"use client"
import { X } from 'lucide-react';
import Link from 'next/link';
import React from 'react'

const SearchFormReset = () => {

const reset = () => {
    const form = document.querySelector(".search-form") as 
    HTMLFormElement;

    if (form) form.reset();
  }

  return (
    <div>
      <button type='reset' onClick={reset}>
        <Link href="/" className='text-white search-btn'>
        <X className='size-5'/>
        </Link>
      </button>
    </div>
  )
}

export default SearchFormReset