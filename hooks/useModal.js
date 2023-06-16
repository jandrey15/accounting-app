import { useState } from 'react'

export function useModal() {
  const [showModal, setModal] = useState(false)

  const openModal = () => {
    console.log('open')
    setModal(true)
  }

  const closeModal = () => {
    console.log('close')
    setModal(false)
  }

  return { openModal, closeModal, showModal }
}
