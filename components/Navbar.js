import React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
// rfc -> react function component - extensions

export default function Navbar({ user }) {
  const router = useRouter()
  const pathname = router.pathname

  const border = 'border-l border-t border-r'
  const margin = '-mb-px'
  console.log(pathname)

  return (
    <nav className='flex md:justify-between items-center py-4 flex-wrap justify-center gap-3'>
      <p className='text-2xl font-bold text-grey-800'>Contabilidad Personal</p>
      <ul className='flex border-b'>
        <li className={`${pathname === '/' && margin} mr-1`}>
          <Link href='/'>
            <a
              className={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold ${
                pathname === '/' && border
              }`}
              href='#'
            >
              Inicio
            </a>
          </Link>
        </li>
        <li className={`${pathname === '/todo' && margin} mr-1`}>
          <Link href='/todo'>
            <a
              className={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold ${
                pathname === '/todo' && border
              }`}
              href='#'
            >
              Anotaciones
            </a>
          </Link>
        </li>
        <li className='mr-1'>
          {user && (
            <a
              href='/api/logout'
              className={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold`}
            >
              Cerrar Sesión
            </a>
          )}

          {!user && (
            <a
              href='/api/login'
              className={`bg-white inline-block py-2 px-4 text-blue-500 hover:text-blue-800 font-semibold`}
            >
              Iniciar Sesión
            </a>
          )}
        </li>
      </ul>
    </nav>
  )
}
