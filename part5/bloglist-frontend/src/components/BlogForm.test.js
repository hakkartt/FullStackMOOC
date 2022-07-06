import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import BlogForm from './BlogForm'
import userEvent from '@testing-library/user-event'

test('Check that the form calls the event handler it received as props with the right details when a new blog is created', async () => {

  const createBlogMock = jest.fn()
  const content = render(<BlogForm createBlog={createBlogMock} />).container

  const titleInput = content.querySelector('#title')
  const authorInput = content.querySelector('#author')
  const urlInput = content.querySelector('#url')
  const button = screen.getByText('create')

  const title = 'testtitle'
  for (let i = 0; i < title.length; i++) {
    userEvent.type(titleInput, title[i])
  }
  const author = 'testauthor'
  for (let i = 0; i < author.length; i++) {
    userEvent.type(authorInput, author[i])
  }
  const url = 'testurl'
  for (let i = 0; i < url.length; i++) {
    userEvent.type(urlInput, url[i])
  }

  const user = userEvent.setup()
  await user.click(button)

  expect(createBlogMock.mock.calls).toHaveLength(1)
  expect(createBlogMock.mock.calls[0][0].title).toBe('testtitle')
  expect(createBlogMock.mock.calls[0][0].author).toBe('testauthor')
  expect(createBlogMock.mock.calls[0][0].url).toBe('testurl')
  expect(createBlogMock.mock.calls[0][0].likes).toBe(0)
})