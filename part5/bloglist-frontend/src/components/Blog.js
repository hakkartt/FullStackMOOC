import React, { useState } from 'react'

const Blog = ({ blog, addLikes, deleteBlog, user }) => {

  const [visible, setVisibility] = useState(false)

  const hideWhenVisible = { display : visible ? 'none' : ''}
  const showWhenVisible = { display : visible ? '' : 'none'}

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
      <div style={hideWhenVisible}>
        {blog.title}
        <button onClick={() => setVisibility(true)}>view</button>
      </div>
      <div style={showWhenVisible}>
        {blog.title} <button onClick={() => setVisibility(false)}>hide</button><br/>
        url: {blog.url}<br/>
        likes: {blog.likes}    <button onClick={() => addLikes(blog)}>like</button><br/>
        author: {blog.author}<br/>
        {deleteButton()}
      </div>
    </div>
  )
}

export default Blog