import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { InputField } from './InputField'
import PersonIcon from '@mui/icons-material/Person'
import HttpsIcon from '@mui/icons-material/Https'

export const SignInForm = ({}) => {

    const [ formData, setFormData ] = useState({
        "usernameOrEmail": "",
        "password": ""
    })
    const [ error, setError ] = useState(null)

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {    
            const user = await axios.post("http://localhost:3000/api/v1/user/signin", formData)
            localStorage.setItem('token', user.data.data.accessToken)
        } catch (error) {
            setError(error.response.data.details ? error.response.data.details[0].message : error.response.data.message)
        }
    }

    return (
        <div 
            className='flex items-center justify-center w-full lg:w-4/5 max-w-96 mx-auto p-8 bg-white rounded-lg shadow-2xl border border-gray-200'
        >
            <div 
                className='flex flex-col'
            >
                <h3 
                    className='flex justify-center items-center text-primary mb-4'
                >
                    Sign In
                </h3>
                <div 
                    className=''
                >
                    <InputField 
                        label={"Username or email:"} 
                        placeholder={"Enter your username or email"}
                        icon={<PersonIcon sx={{ fontSize:18}}/>}
                        type={"text"}
                        id={"usernameOrEmail"}
                        value={formData.usernameOrEmail}
                        setFormData={setFormData}
                    />      
                    <InputField 
                        label={"Password:"} 
                        placeholder={"Enter your password"}
                        icon={<HttpsIcon sx={{ fontSize:18}}/>}
                        type={"password"}
                        id={"password"}
                        value={formData.password}
                        setFormData={setFormData}
                    />
                    <div 
                        className='mt-4'
                    >
                        <button
                            className='w-full bg-primary hover:bg-h-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center'
                            type='submit'
                            onClick={(e) => handleSubmit(e)}
                        >
                            Sign Up
                        </button>

                        { (error) && <p className='text-red-400 pt-2 font-thin max-h-6 text-xs  '>{error}</p>}

                        <p 
                            className='pt-2 flex'
                        >
                            Already have an account? <Link to={"/signin"} className='nunderline'> Sign in </Link> 
                        </p>

                    </div>
                </div>
            </div>
        </div>
    )
}