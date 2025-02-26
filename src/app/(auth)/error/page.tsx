import React from 'react'
import { useRouter } from 'next/router'

'use client'

export default function ErrorPage() {
  const router = useRouter()

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center bg-gray-100 text-gray-800 p-5">
      <h1 className="text-4xl mb-4">Oops! Something went wrong</h1>
      <p className="text-xl mb-8">We are sorry for the inconvenience. Please try again later.</p>
      <button 
        className="px-6 py-3 text-lg text-white bg-blue-500 rounded hover:bg-blue-600"
        onClick={() => router.push('/')}
      >
        Go to Homepage
      </button>
    </div>
  )
}
