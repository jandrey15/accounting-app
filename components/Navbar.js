import React from 'react'
import Link from 'next/link'
// rfc -> react function component - extensions

export default function Navbar({ user }) {
  return (
    <nav className='flex justify-between items-center py-4'>
      <p className='text-2xl font-bold text-grey-800'>Personal Accounting</p>
      <ul className='flex border-b'>
        <li className='-mb-px mr-1'>
          <Link href='/'>
            <a
              className='bg-white inline-block border-l border-t border-r rounded-t py-2 px-4 text-blue-700 font-semibold'
              href='#'
            >
              Home
            </a>
          </Link>
        </li>
        <li className='mr-1'>
          <Link href='/todo'>
            <a
              className='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
              href='#'
            >
              Todo
            </a>
          </Link>
        </li>
        <li className='mr-1'>
          {user && (
            <a
              href='/api/logout'
              className='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
            >
              Logout
            </a>
          )}

          {!user && (
            <a
              href='/api/login'
              className='bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold'
            >
              Login
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}
