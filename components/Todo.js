import React from 'react'

export default function Todo({ todo }) {
  return (
    <li>
      <input type='checkbox' name='completed' id='completed' />
      <p>{todo.fields.description}</p>
    </li>
  )
}
