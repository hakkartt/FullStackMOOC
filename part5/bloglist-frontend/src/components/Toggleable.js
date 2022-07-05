import React, { useState, useImperativeHandle, forwardRef } from 'react'

const Togglable = forwardRef((props, ref) => {

  const [visible, setVisibility] = useState(false)

  const hideWhenVisible = { display : visible ? 'none' : ''}
  const showWhenVisible = { display : visible ? '' : 'none'}

  const toggleVisibility = () => {
    setVisibility(!visible)
  }

  useImperativeHandle(ref, () => {
    return { toggleVisibility }
  })

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{props.buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {props.children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  )
})

export default Togglable