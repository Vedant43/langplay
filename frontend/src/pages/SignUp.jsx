import React from 'react'
import { SignUpForm } from '../Components/AuthForm/SignUpForm'
import { Container } from '../Components/container/Container'

export const SignUp = () => {
  return (
      <Container className='relative flex items-center justify-center min-h-screen'>
        <div className='fixed h-screen w-full inset-0 bg-black opacity-60'></div>
        <div className="z-10 w-full max-w-md">
          <SignUpForm />
        </div>
      </Container>
  )
}

