import React from 'react'
import { useNavigate } from 'react-router-dom'
import {Container } from '../Components/container/Container'
import { SignInForm } from '../Components/AuthForm/SignInForm'

export const SignIn = () => {

  const navigate = useNavigate()

  const closeSignIn = () => {
    navigate('/')
  }

  return (
    <Container 
      className='relative flex items-center justify-center min-h-screen'
    >
        <div 
          className='fixed h-screen w-full inset-0 bg-black opacity-60'
          onClick={closeSignIn}
        >
        </div>
        <div 
          className="z-10 w-full max-w-md"
        >
            <SignInForm />
        </div>
    </Container>
  )
}

