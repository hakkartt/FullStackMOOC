import React from 'react'
import PropTypes from 'prop-types'

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

Success.propTypes = {
  message: PropTypes.string.isRequired
}

Error.propTypes = {
  message: PropTypes.string.isRequired
}

export default { Success, Error }