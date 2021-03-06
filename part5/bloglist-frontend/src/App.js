import React, { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import LoginForm from './components/LoginForm'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import Togglable from './components/Toggleable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [msg, setMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    blogService.getAll().then(blogs =>
      setBlogs( blogs )
    )
  }, [])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser')
    if(loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async (event) => {
    event.preventDefault()

    try {
      const user = await loginService.login({
        username, password,
      })
      window.localStorage.setItem(
        'loggedBlogAppUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
      setMsg(`Logged in ${user.username}`)
      setTimeout(() => {
        setMsg(null)
      }, 5000)
    } catch (exception){
      console.log(exception)
      setErrorMsg('Invalid username or password')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBlogAppUser')
    setUser(null)
    setMsg(
      `Logged out ${user.username}`
    )
    setTimeout(() => {
      setMsg(null)
    }, 5000)
  }

  const blogFormRef = useRef()

  const createBlog = async (blogObject) => {
    try {
      blogFormRef.current.toggleVisibility()
      const returnedBlog = await blogService.create(blogObject)
      setBlogs(blogs.concat(returnedBlog))
      setMsg(`A new blog ${returnedBlog.title} by author named ${returnedBlog.author} added`)
      setTimeout(() => {
        setMsg(null)
      }, 5000)
    } catch(error) {
      console.log(error)
      setErrorMsg('Invalid data for the blog to be created.')
      setTimeout(() => {
        setErrorMsg(null)
      }, 5000)
    }
  }

  const addLikes = async (blogObject) => {
    blogObject.likes += 1
    const returnedBlog = await blogService.update(blogObject.id, blogObject)
    setBlogs(
      blogs.map(
        blog => blog.id === blogObject.id
          ? returnedBlog
          : blog
      )
    )
  }

  const deleteBlog = async (blogObject) => {
    if (window.confirm(`Remove blog ${blogObject.title} by ${blogObject.author}?`)) {
      await blogService.remove(blogObject.id)
      setBlogs(blogs.filter(blog => blog.id !== blogObject.id))
      setMsg(`Deleted ${blogObject.title} from bloglist`)
      setTimeout(() => {
        setMsg(null)
      }, 5000)
    }
  }

  return (
    <div>
      {user === null ?
        <div>
          <Notification.Success message={msg}/>
          <Notification.Error message={errorMsg}/>
          <LoginForm
            handleLogin={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        </div> :
        <div>
          <h2>Bloglist app</h2>
          <p>This is an app to create blog entries and delete them. Additionally one can give likes to other blogs.</p>
          <div>
            <Notification.Success message={msg} />
            <Notification.Error message={errorMsg} />
            <div>{user.name} logged in <button onClick={() => handleLogout()}>logout</button>
            </div>
            <br/>
            <div>
              <Togglable buttonLabel='new blog' ref={blogFormRef}>
                <BlogForm createBlog={createBlog} user={user}/>
              </Togglable>
            </div>
            <div>
              {
                blogs
                  .sort((x, y) => y.likes - x.likes)
                  .map(blog =>
                    <Blog
                      key={blog.id}
                      blog={blog}
                      addLikes={addLikes}
                      deleteBlog={deleteBlog}
                      user={user}
                    />
                  )
              }
            </div>
            <h2>NB:</h2>
            <ul>
              <li>Please note that if you want to remove blogs from the list, you need to be logged in with a user that created the blog entry in the first place.</li>
              <li><b>If the remove button disappears after clicking the like button or does not appear immedeately after creating a new log entry, please refresh the page.</b> This is is a known bug in the implementation and is not fixed since this is only a practice application.</li>
            </ul>
          </div>
        </div>
      }
    </div>
  )
}

export default App