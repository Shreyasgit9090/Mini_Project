import React from 'react'

import ReactDOM from 'react-dom/client'

import App from './App.jsx'

import './index.css'

import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(

    document.getElementById('root')

).render(

    <React.StrictMode>

        {/* GLOBAL TOAST SYSTEM */}

        <Toaster

            position="top-right"

            reverseOrder={false}

            toastOptions={{

                duration: 3500,

                style: {

                    background: '#0f172a',

                    color: '#f8fafc',

                    border:
                        '1px solid rgba(255,255,255,0.08)',

                    borderRadius: '18px',

                    padding: '16px',

                    fontSize: '15px',

                    backdropFilter: 'blur(12px)',

                    boxShadow:
                        '0 10px 40px rgba(0,0,0,0.45)'
                },

                success: {

                    iconTheme: {

                        primary: '#10b981',

                        secondary: '#ffffff'
                    }
                },

                error: {

                    iconTheme: {

                        primary: '#ef4444',

                        secondary: '#ffffff'
                    }
                }
            }}
        />

        <App />

    </React.StrictMode>
)