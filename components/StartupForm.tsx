"use client"

import { useState, useActionState } from 'react'
import { Input } from './ui/input'
import { Textarea } from './ui/textarea'
import { Button } from './ui/button'
import { Send } from 'lucide-react'
import { formSchema } from './validation'
import { z } from 'zod'
import { useToast } from '@/hooks/use-toast'
import { useRouter } from 'next/navigation'
import {createPitch} from '../lib/action'

const StartupForm = () => {
  const [errors, setErrors] = useState<Record<string, string>>({})
  const { toast } = useToast()
  const  router  = useRouter()

  const handleFormSubmit = async (prev:any, formData: FormData) => {
    // Clear errors on new submission
    setErrors({})

    // Build your form values
    const formValue = { 
      title: formData.get("title") as string,
      description: formData.get("description") as string,
      category: formData.get("category") as string,
      link: formData.get("link") as string,
      pitch: formData.get("pitch") as string,
    }

    try {
      // Validate the form using Zod asynchronously
      await formSchema.parseAsync(formValue)
      console.log("Form value is valid:", formValue)
     const result = await createPitch(prev, formData)
     console.log(result)

      if(result.status === 'SUCCESS') {
        toast({
          title: 'Success',
          description: 'Your startup pitch has been created successfully',
        })
        router.push(`/startup/${result._id}`)
      }
      return result;
     // Continue with further actions (e.g., sending data to your server)
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Use Zod’s flatten() to extract field errors.
        const fieldErrors = error.flatten().fieldErrors
        const formattedErrors: Record<string, string> = {}
        for (const key in fieldErrors) {
          if (fieldErrors[key]?.length) {
            formattedErrors[key] = fieldErrors[key]![0]
          }
        }
        setErrors(formattedErrors)

        toast({
          title: 'Error',
          description: 'Please check your inputs and try again',
          variant: "destructive"
        })

        return { ...prev, error: "Validation failed", status: "ERROR"};
      }

      toast({
        title: 'Error',
        description: 'An unexpected error has occured',
        variant: "destructive"
      })

      return {... prev, error: "An unexpected error has occured", status:"ERROR"}
    }
  }
  const [state, formAction,isPending ] = useActionState(handleFormSubmit, {error:",status:INITIAL"})


  return (
    <form action={formAction} className='startup-form'>
      <div>
        <label htmlFor="title" className='startup-form_label'>Title</label>
        <Input 
          id='title'
          name='title'
          className='startup-form_input'
          required
          placeholder='Startup Title'
        />
        {errors.title && <p className='startup-form_error'>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className='startup-form_label'>Description</label>
        <Textarea 
          id='description'
          name='description'
          className='startup-form_textarea'
          required
          placeholder='Startup Description'
        />
        {errors.description && <p className='startup-form_error'>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className='startup-form_label'>Category</label>
        <Input 
          id='category'
          name='category'
          className='startup-form_input'
          required
          placeholder='Startup Category (Tech, Religion, Education ...)'
        />
        {errors.category && <p className='startup-form_error'>{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="link" className='startup-form_label'>Image URL</label>
        <Input 
          id='link'
          name='link'
          className='startup-form_input'
          required
          placeholder='Startup Image URL'
        />
        {errors.link && <p className='startup-form_error'>{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
        <Textarea 
          id='pitch'
          name='pitch'
          placeholder='Briefly describe your Idea and what problem it solves'
          className='startup-form_textarea h-[200px] overflow-hidden'
        />
        {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
      </div>

      <Button type='submit' className='startup-form_btn text-white-100'>
        {!isPending ? 'Submit' : 'Submitting...' }
        <Send className='size-6 ml-2'/>
      </Button>
    </form>
  )
}

export default StartupForm
