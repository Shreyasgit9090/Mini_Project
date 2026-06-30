import React from 'react'

import { NavLink, useNavigate } from 'react-router-dom'

import {
  LayoutDashboard,
  Activity,
  Lightbulb,
  User,
  Settings,
  LogOut,
  BrainCircuit
} from 'lucide-react'

const navItems = [

  {
    path: '/dashboard',
    icon: LayoutDashboard,
    label: 'Dashboard'
  },

  {
    path: '/activity',
    icon: Activity,
    label: 'Activity'
  },

  {
    path: '/profile',
    icon: User,
    label: 'Profile'
  },

  {
    path: '/settings',
    icon: Settings,
    label: 'Settings'
  }
]

export default function Sidebar() {

  const navigate = useNavigate()

  const handleLogout = () => {

    localStorage.removeItem('user')

    navigate('/login')
  }

  return (

    <div className='w-64 h-full bg-slate-950/60 backdrop-blur-xl border-r border-slate-800 flex flex-col'>

      {/* LOGO */}

      <div className='p-6 flex items-center gap-4'>

        <div className='w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-400 to-cyan-500 flex items-center justify-center shadow-lg'>

          <BrainCircuit className='w-7 h-7 text-black' />

        </div>

        <div>

          <h1 className='text-2xl font-black bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent'>

            Companion AI

          </h1>

          <p className='text-xs text-slate-400'>

            Emotion Companion

          </p>

        </div>

      </div>

      {/* NAVIGATION */}

      <div className='flex-1 px-4 py-8 space-y-3'>

        {

          navItems.map((item) => (

            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>

                `flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 text-sm font-semibold

                ${isActive

                  ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20'

                  : 'text-slate-400 hover:bg-slate-800/50 hover:text-slate-200'
                }`
              }
            >

              <item.icon className='w-5 h-5' />

              {item.label}

            </NavLink>

          ))
        }

      </div>

      {/* LOGOUT */}

      <div className='p-4 border-t border-slate-800'>

        <button
          onClick={handleLogout}
          className='flex items-center gap-4 px-5 py-4 w-full rounded-2xl text-slate-400 hover:bg-red-500/10 hover:text-red-400 transition-all duration-300 text-sm font-semibold'
        >

          <LogOut className='w-5 h-5' />

          Logout

        </button>

      </div>

    </div>
  )
}