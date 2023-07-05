import { useState, useEffect } from 'react'
import ReactDOM from 'react-dom'

function Modal({ show, onClose, children }) {
  const [isBrowser, setIsBrowser] = useState(false)

  useEffect(() => {
    setIsBrowser(true)
  }, [])

  const modalContent = show ? (
    <>
      <div className='fixed flex max-h-[655px] top-0 left-0 right-0 bottom-0 z-40 w-full md:w-[530px] m-auto'>
        <div className='relative w-full max-w-lg max-h-full m-auto'>
          <div className='relative bg-white rounded-lg shadow px-5 py-7'>
            <header className='flex justify-end'>
              <button type='button' onClick={onClose}>
                Cerrar
              </button>
            </header>
            <main className='modal-content'>{children}</main>
          </div>
        </div>
      </div>
      <div
        className='fixed top-0 left-0 right-0 z-30 w-full p-4 md:inset-0 max-h-full h-full bg-gray-600/75'
        onClick={onClose}
      ></div>
    </>
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
