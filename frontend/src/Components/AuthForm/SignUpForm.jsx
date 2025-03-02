import React from 'react'
import { Link } from 'react-router-dom'
import { InputField } from './InputField'
import PersonIcon from '@mui/icons-material/Person'
import EmailIcon from '@mui/icons-material/Email'
import HttpsIcon from '@mui/icons-material/Https'

export const SignUpForm = () => {

    const [ formData, setFormData ] = useState({
        "username": '',
        "email": '',
        "password": '',
    })

    return (
        // <div className='flex items-center justify-center w-1/2 h-1/2 bg-white border-3 shadow-xl '>
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
                <div 
                    className='b'
                >
                    <InputField 
                        label={"Username:"} 
                        placeholder={"Enter your username"}
                        icon={<PersonIcon sx={{ fontSize:18}}/>}
                        type={"text"}
                        id={"username"}
                        value={formData.username}
                        setFormData={setFormData}
                    />
                    <InputField 
                        label={"Email:"} 
                        placeholder={"Enter your email"}
                        icon={<EmailIcon sx={{ fontSize:18}}/>}
                        type={"email"}
                        id={"email"}
                        value={formData.email}
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
                    <InputField 
                        label={"Confirm Password:"} 
                        placeholder={"Re-enter your password"}
                        icon={<HttpsIcon sx={{ fontSize:18}}/>}
                        type={"password"} 
                        id={"confirmPassword"}
                        value={formData.confirmPassword}
                        setFormData={setFormData}
                    />

                    <div 
                        className=''
                    >
                        <button
                            className='w-full bg-primary hover:bg-h-primary text-white font-medium py-2 px-4 rounded-md shadow-sm transition duration-150 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 flex items-center justify-center'
                        >
                            Sign Up
                        </button>

                        <p className='pt-2'>
                            Already have an account? <Link to={"/signin"} className='nunderline'> Sign in </Link> 
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}