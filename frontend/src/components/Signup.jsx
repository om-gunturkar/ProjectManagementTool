import { UserPlus, User,Mail,Lock } from 'lucide-react'
import React, { useState } from 'react'
import {Inputwrapper} from '../assets/dummy'

import { MESSAGE_SUCCESS } from '../assets/dummy'
import { MESSAGE_ERROR } from '../assets/dummy'
import axios from 'axios'
import { BUTTONCLASSES } from '../assets/dummy'

const API_URL = "http://localhost:4000"
const INITIAL_FORM = { name: "", email: "", password: "" }


const SignUp = ( {onSwitchMode}) => {

  const [formData,setFormData]=useState(INITIAL_FORM);
  const [loading,setLoading]=useState(false);
  const [message,setMessage]=useState({text: "", type:""});

const handleSubmit = async (e)=>{
  e.preventDefault()
  setLoading(true)
  setMessage({text:"",type:""})

  try {
    const {data} = await axios.post(`${API_URL}/api/user/register`,formData)
    console.log("Signup Successfull",data)
    setMessage({text:"registration successful! you can now log in",type:"success"})
    setFormData(INITIAL_FORM)
  } catch (err) {
    console.log("Signup error",err)
    setMessage({text:err.response?.data?.message || "An Error Occured. Please Try Again Later",type:"error"})
  }finally{
    setLoading(false)
  }
}
const FIELDS = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email", icon: Mail },
    { name: "password", type: "password", placeholder: "Password", icon: Lock },
]
  return (
    <div className='max-w-md w-full bg-white shadow-lg border border-purple-100 rounded-xl p-8'>
      <div className='mb-6 text-center'>
        {/* Changed gradient colors here */}
        <div className='w-16 h-16 bg-gradient-to-br from-blue-500 to-green-500 rounded-full mx-auto flex items-center justify-center mb-4'>
          <UserPlus className='w-8 h-8 text-white' />
        </div>
        <h2 className='text-2xl font-bold text-gray-800'>
          Create Account
        </h2>
        <p className='text-gray-500 text-sm mt-1'>Join TaskFlow to manage your tasks</p>
      </div>

      {message.text &&(
        <div className={message.type === 'success' ? MESSAGE_SUCCESS : MESSAGE_ERROR}>
          {message.text}
        </div>
      )}

      <form action="" onSubmit={handleSubmit} className='space-y-4'>
        {FIELDS.map(({name,type,placeholder,icon:Icon})=>(
          <div key={name} className={Inputwrapper}>
            {/* Changed icon color here */}
            <Icon className='text-blue-500 w-5 mr-2 '/>

            <input type={type} placeholder={placeholder} value={formData[name]} onChange={(e)=>setFormData({...formData,[name]:e.target.value})}  className='w-full focus:outline-none text-sm text-gray-700' required/>
          </div>
        ))}

        {/* Updated BUTTONCLASSES to match the gradient in the login button */}
        <button type='submit' className="w-full py-2 px-4 rounded-lg text-white font-semibold flex items-center justify-center space-x-2 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-offset-2 bg-gradient-to-br from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600 focus:ring-blue-500" disabled={loading}>
          {loading ? "Signing Up ..." : <><UserPlus className='w-4 h-4'/>Sign Up</>}
        </button>
      </form>

      <p className='text-center text-sm text-gray-600 mt-6'>
        Already Have An Account ?
        {/* Changed link color here */}
        <button onClick={onSwitchMode} className='text-blue-600 hover:text-blue-700 hover:underline font-medium transition-colors'>Login</button>

      </p>
    </div>
  )
}

export default SignUp