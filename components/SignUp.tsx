import { Input } from './ui/input'
import { Button } from './ui/button'
import React from 'react'
import { signIn } from '@/auth'
import { FiGithub } from "react-icons/fi";
import { FcGoogle } from "react-icons/fc";

const SignUp = () => {


  return (
    <>
         <form className='startup-form'>
         {/* <div>
           <label htmlFor="title" className='startup-form_label'>Username</label>
           <Input 
             id='title'
             name='title'
             className='startup-form_input'
             required
             placeholder='Enter Username '
           />
         </div>
   
         <div>
           <label htmlFor="link" className='startup-form_label'>Password</label>
           <Input 
             id='link'
             name='link'
             className='startup-form_input'
             required
             placeholder='Enter Password'
           />
         </div>

         <Button type='submit'
         onClick={async ()=>{
            'use server'
             await signIn('github', {redirectTo: "/"})
         }}
         className='startup-form_btn text-white-100'>
            Sign Up
         </Button> */}

         <Button type='button'
         onClick={async ()=>{
            'use server'
             await signIn('github', {redirectTo: "/"})
         }}
         className='startup-form_btn bg-black-100 shadow-lg backdrop-blur-lg text-[#aeaeae]'>
           <FiGithub className=" size-6 bg-transparent "/> Sign Up With Github
         </Button>   
    
         <Button type='button'
         onClick={async ()=>{
            'use server'
             await signIn('google', {redirectTo: "/"})
         }}
         className='startup-form_btn bg-opacity-20 backdrop-blur-lg text-[#aeaeae]'>
          <FcGoogle className="size-6 bg-transparent" />
          Sign Up With Google
         </Button>
       </form>

    
    </>
  )
}

export default SignUp
