import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

function Modal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const modalContent = show ? (
    <div className='fixed flex top-0 left-0 right-0 z-50 w-full p-4 md:inset-0 max-h-full bg-gray-600/75'>
      <div class='relative w-full max-w-lg max-h-full m-auto'>
        <div class='relative bg-white rounded-lg shadow px-5 py-7'>
          <header className='flex justify-end'>
            <button type='button' onClick={onClose}>
              Cerrar
            </button>
          </header>
          <main className='modal-content'>{children}</main>
        </div>
      </div>
    </div>
  ) : null

  if (isBrowser) {
    return ReactDOM.createPortal(
      modalContent,
      document.getElementById('modal-root')
    )
  } else {
    return null
  }
}

export default Modal
