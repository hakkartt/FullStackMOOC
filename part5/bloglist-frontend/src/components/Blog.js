import React, { useState } from 'react'
import PropTypes from 'prop-types'

const Blog = ({ blog, addLikes, deleteBlog, user }) => {

  const [visible, setVisibility] = useState(false)

  const hideWhenVisible = { display : visible ? 'none' : '' }
  const showWhenVisible = { display : visible ? '' : 'none' }

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const deleteButton = () => {
    if ( blog.user && user && blog.user.username === user.username ) {
      return (<button onClick={() => deleteBlog(blog)}> remove </button>)
    }
  }

  return (
    <div style={blogStyle}>
      <div style={hideWhenVisible} className='defaultContent'>
        {blog.title} by {blog.author}
        <button id='viewButton' onClick={() => setVisibility(true)}>view</button>
      </div>
      <div style={showWhenVisible} className='togglableContent'>
        {blog.title} <button onClick={() => setVisibility(false)}>hide</button><br/>
        url: {blog.url}<br/>
        likes: {blog.likes} <button id='likeButton' onClick={() => addLikes(blog)}>like</button><br/>
        author: {blog.author}
        <br/>
        {deleteButton()}
      </div>
    </div>
  )
}

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  addLikes: PropTypes.func.isRequired,
  deleteBlog: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired
}

export default Blog