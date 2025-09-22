import React from 'react'
import NavBar from './NavBar/NavBar';
import './index.css'


function App() {

  return (
    <>
      <div className="min-h-screen">
        <NavBar />
        <div className="flex flex-col items-center text-center px-6">
          
          <p className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-[#DB9164] via-[#86B576] to-[#3FDA8B] bg-clip-text text-transparent mt-12">
            Make Dreams Come True
          </p>

          <p className="mt-6 text-lg md:text-xl font-semibold text-gray-600 max-w-3xl">
            Help orphaned children achieve their dreams. Connect with their stories, support their skills, 
            and celebrate their special moments.
          </p>

          <div className="flex gap-6 mt-8">
            <a href="/donate"><button className="px-8 py-3 bg-[#f57f5a] text-white text-lg rounded-md hover:bg-[#e56f4a] transition">
              Start Donating
            </button></a>
            <a href="/organisation"><button className="px-8 py-3 bg-gradient-to-r from-[#C7E2F7] to-[#CDF0E3] text-lg rounded-md hover:opacity-90 transition">
              Join as Organisation
            </button></a>
          </div>

          <p className="mt-14 text-4xl md:text-5xl font-bold">Meet Our Dreamers</p>
          <p className="mt-4 text-lg md:text-xl font-semibold text-gray-600 max-w-3xl">
            Each child has unique dreams and talents waiting to be nurtured. Your support can help turn 
            their aspirations into reality.
          </p>
        </div>
      </div>
    </>
  )
}

export default App
