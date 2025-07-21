import React, { useState,useRef, useEffect } from 'react'
import {useNavigate} from 'react-router-dom'
import { ChevronDown, Compass,Settings, LogOut } from 'lucide-react';


const Navbar = ({user={},onLogout}) => {
    const menuref=useRef(null)
    const [menuOpen, setMenuOpen]=useState(false)
    const navigate = useNavigate();

    useEffect(()=>{
        const handleClickOutside=(event)=>{
            if(menuref.current && !menuref.current.contains(event.target)){
                setMenuOpen(false)
            }
        }
        document.addEventListener("mousedown",handleClickOutside)
        return ()=>document.removeEventListener("mousedown",handleClickOutside)
    },[])

    const handleMenuToggle = ()=>setMenuOpen((prev)=>!prev)
    const handleLogout = () =>{
        setMenuOpen(false)
        onLogout();
    }
  return (
    <header className='sticky top-0 z-50 bg-gray-900 backdrop-blur-md shadow-sm border-b border-gray-200 font-sans'>

        <div className='flex item-center justify-between px-4 py-3 md:px-6 w-full mx-auto'>
            {/*Logo*/}
            <div className='flex items-center gap-2 cursor-pointer group'
            onClick={()=>navigate('/')}>
                {/* LOGO */}
                <div className='relative w-10 h-10 flex items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 via-green-500 to-teal-500 shadow-lg group-hover:shadow-green-300/50 group-hover:scale-105 transaction-all duration-300'>
                    <Compass className='w-6 h-6 text-white'/>
                    <div className='absolute -bottom-1 -middle-1 w-3 h-3 bg-white rounded-full shadow-me animate-ping'/>
                </div>

                {/* Brand Name */}
                <span className='text-2xl font-extrabold bg-gradient-to-r from-blue-500 via-green-500 to-teal-500 bg-clip-text text-transparent tracking-wide'>FocusFlow
                </span>
            </div>

            {/* Right Side */}
            <div className='flex items-center gap-4'>
            <button className='p-2 text-white hover:text-blue-300 transition-colors duration-300 hover:bg-gray-700 rounded-xl' onClick={()=>navigate('/profile')}>
                <Settings className='w-5 h-5'/>
            </button>
            
            {/* User Dropdown Meny */}
            <div ref={menuref} className='relative'>
                <button onClick={handleMenuToggle} className='flex items-center gap-2 px-3 py-2 rounded-full cursor-pointer hover:bg-gray-800 transition-colors duration-300 border border-transparent hover:border-blue-500'>
                    <div className="relative">
                        {user.avatar ? (
                            <img src={user.avatar} alt="Avatar" className='w-9 h-9 rounded-full shadow-sm' />
                        ): (
                            <div className="w-8 h-8 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-green-600 text-white font-semibold shadow-md ">
                                {user.name?.[0]?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div className='absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 rounded-full border-2 border-white animate-pulse'/>
                    </div>

                    <div className="text-left hidden md:block">
                        <p className='text-sm font-medium text-gray-200'>{user.name}</p>
                        <p className='text-xs text-gray-400 font-normal '>{user.email}</p>
                    </div>

                    <ChevronDown className={`w-4 h-4 text-green-500 transition-transform duration-300 ${menuOpen ? 'rotate-180':""}`}/>
                </button>

                {menuOpen &&(
                    <ul className='absolute top-14 right-0 w-56 bg-gray-800 rounded-2xl shadow-xl border border-blue-500 c-50 overflow-hidden animate-fadeIn'>
                        <li className='p-2'>
                            <button onClick={()=> {
                                setMenuOpen(false)
                                navigate('/profile')
                            }}
                            className='w-full px-4 py-2.5 text-left hover:bg-gray-700 rounded-xl text-sm text-gray-200 transition-colors flex items-center gap-2 group' role='menuitem'>
                                <Settings className='w-4 h-4 text-gray-200'/>Profile Setting
                            </button>
                        </li>

                        <li className='p-2'>
                            {/* FIX APPLIED HERE: Ensure 'className' prop is a single string */}
                            <button onClick={handleLogout} className='flex w-full items-center gap-2 rounded-lg px-4 py-2.5 text-sm hover:bg-gray-700 text-red-600' role='menuitem' >
                                <LogOut className='w-4 h-4'/>Logout
                            </button>
                        </li>
                    </ul>
                )}
            </div>
            </div>
        </div>
    </header>
  )
}

export default Navbar