import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('renders content', () => {

  let container
  const addLikesMock = jest.fn()
  const deleteBlogMock = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'testtitle',
      author: 'testauthor',
      url: 'testurl',
      likes: 0
    }
    const user = {
      username: 'testuser'
    }
    container = render(
      <Blog blog={blog} addLikes={addLikesMock} deleteBlog={deleteBlogMock} user={user} />
    ).container
  })

  test('By default, render only title and author', () => {
    expect(container.querySelector('.defaultContent')).toHaveTextContent('testtitle by testauthor')
    expect(container.querySelector('.togglableContent')).toHaveStyle('display: none')
  })

  test('After click on button, render also url and likes', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('view')
    await user.click(button)
    expect(container.querySelector('.defaultContent')).toHaveStyle('display: none')
    expect(container.querySelector('.togglableContent')).toHaveTextContent('testtitle')
    expect(container.querySelector('.togglableContent')).toHaveTextContent('url: testurl')
    expect(container.querySelector('.togglableContent')).toHaveTextContent('likes: 0')
    expect(container.querySelector('.togglableContent')).toHaveTextContent('author: testauthor')
  })

  test('Clicking like button twice results in two requests to event handler function of the component', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    expect(addLikesMock.mock.calls).toHaveLength(1)
    await user.click(button)
    expect(addLikesMock.mock.calls).toHaveLength(2)
  })

})