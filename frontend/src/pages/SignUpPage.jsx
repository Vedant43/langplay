import React from 'react'
import { Container } from '../Components/container/Container'
import { useState } from 'react'
import { z } from 'zod'
import { Loader } from '../Components/AuthForm/Loader'
import avatar from "../assets/default-avatar.jpg"
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { signUpSchema } from '@vedant567/neotube-common'
import { InputField } from '../Components/AuthForm/InputField'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import HttpsIcon from '@mui/icons-material/Https'
import UserApi from "../api/user"
import { setUser } from '../Components/redux/features/authSlice'
import { useDispatch } from 'react-redux'

export const SignUpPage = () => {

    const { register, handleSubmit, setError, reset, formState: { errors }, } = useForm({
      mode: "onChange",
      resolver: zodResolver(extendedSignUpSchema)
    })
    const [ isLoading, setIsLoading ] = useState(false)
    const navigate = useNavigate()
    const dispatch = useDispatch()
  
    // const onSubmit = async (data) => {
    //       setIsLoading(true)

    //       try {
    //           const { confirmPassword, ...backendData } = data
    //           const user = await axios.post("http://localhost:3000/api/v1/user/signup", backendData)
    //           setIsLoading(false)
    //           localStorage.setItem('accessToken', user.data.data.accessToken)
    //           navigate("/")
    //       } catch (error) {
    //           console.log(error)
    //           setIsLoading(false)
    //           reset({ username: "", email:"", password: "", confirmPassword: "" }) 
    //           setError("dbError",{ type: "db", message: error.response.data.message })
    //           // yet to handle server error, can be handled by checking time for setIsLoading(true)
    //         }
    //   }

    const onSubmit = async (data) => {
      setIsLoading(true)

      UserApi.userSignUp(data)
      .then((response) => {
        setIsLoading(false)
          const { username, id } = response
          let channelName = response.newUser.channelName
          let profilePicture = response.newUser.profilePicture

          if (!profilePicture) profilePicture = avatar
          dispatch(setUser({profilePicture, channelName, username, id }))

          localStorage.setItem('accessToken', response.accessToken)   
          navigate("/") 
      })
      .catch((error) => {
        setIsLoading(false)
        reset({ username: "", email:"", password: "", confirmPassword: "" })  
        console.log(error)
      })
    
    }
  
    const closeSignUp = () => {
      navigate('/')
    }

    return (
      <Container 
        className='relative flex items-center justify-center min-h-screen'
      >
        <div 
          className='fixed h-screen w-full inset-0 bg-black opacity-60'
          onClick={closeSignUp}
        >
        </div>

        <div 
          className="z-10 w-full max-w-md"
        >
          <div 
            className='flex items-center justify-center w-full lg:w-4/5 max-w-md mx-auto p-8 bg-white rounded-lg shadow-2xl border border-gray-200'
        >

            <div 
                className='flex flex-col'
            >
                <h3 
                    className='flex justify-center items-center text-primary mb-4'
                >
                    Sign Up 
                </h3>

                {isLoading ?
                <Loader /> :
                <form 
                    onSubmit={handleSubmit(onSubmit)}
                >
                    <InputField 
                        label={"Username:"} 
                        placeholder={"Enter your username"}
                        icon={<PersonIcon sx={{ fontSize:18}}/>}
                        type={"text"}
                        id={"username"}
                        register={register}
                        errors={errors}
                    />
                    <InputField 
                        label={"Email:"} 
                        placeholder={"Enter your email"}
                        icon={<EmailIcon sx={{ fontSize:18}}/>}
                        type={"email"}
                        id={"email"}
                        register={register}
                        errors={errors}
                    />
                    <InputField 
                        label={"Password:"} 
                        placeholder={"Enter your password"}
                        icon={<HttpsIcon sx={{ fontSize:18}}/>}
                        type={"password"}
                        id={"password"}
                        register={register}
                        errors={errors}
                    />
                    <InputField 
                        label={"Confirm Password:"} 
                        placeholder={"Re-enter your password"}
                        icon={<HttpsIcon sx={{ fontSize:18}}/>}
                        type={"password"} 
                        id={"confirmPassword"}
                        register={register}
                        errors={errors}
                    />

                    <div 
                        className=''
                    >
                        <button
                            className='w-full bg-primary hover:bg-h-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center'
                        >
                            Sign Up
                        </button>

                        {errors.dbError && (
                            <p className="text-red-400 pt-1 text-xs text-center">
                                {errors.dbError.message}
                            </p>
                        )}

                        <p className='pt-2'>
                            Already have an account? <Link to={"/signin"} className='nunderline'> Sign in </Link> 
                        </p>
                    </div>
                </form>}
            </div>
        </div>
        </div>
      </Container>
  )
}

const extendedSignUpSchema = signUpSchema.extend({
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

