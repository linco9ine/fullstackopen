import {  render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import BlogForm from './BlogForm'

test('the form calls the callback function it receives as props with the correct data', async () => {
  const blog = {
    title: 'What is HTTP',
    author: 'wikipedia',
    url: 'https://en.wikipedia.org/wiki/HTTP'
  }

  const mockCreateBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogForm createBlog={mockCreateBlog} setShowBlogForm={vi.fn()}/>)

  await user.type(screen.getByPlaceholderText('title'), blog.title)
  await user.type(screen.getByPlaceholderText('author'), blog.author)
  await user.type(screen.getByPlaceholderText('url'), blog.url)

  await user.click(screen.getByText('create'))

  expect(mockCreateBlog).toHaveBeenCalledWith(blog)
})
