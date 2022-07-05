import React from 'react'

const Success = ({ message }) => {
  if(!message) { return null }
  return (
    <div className='success'>
      {message}
    </div>
  )
}

const Error = ({ message }) => {
  if(!message) { return null }
  return (
    <div className='error'>
      {message}
    </div>
  )
}

export default { Success, Error }