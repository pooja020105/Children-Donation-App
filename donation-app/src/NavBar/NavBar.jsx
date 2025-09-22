import React from 'react'

function NavBar() {
  return (
    <div className="flex justify-between items-center px-12 py-5 bg-gray-100 shadow-md sticky top-0 z-50">
      <div className="text-2xl font-bold">Dream Support</div>
      <ul className="flex gap-8 font-bold">
        <li><a href="home" className="hover:text-orange-500">Home</a></li>
        <li><a href="donate" className="hover:text-orange-500">Donate</a></li>
        <li><a href="viewchildren" className="hover:text-orange-500">View Children</a></li>
        <li><a href="organisation" className="hover:text-orange-500">Organisation</a></li>
      </ul>
    </div>
  )
}
export default NavBar
