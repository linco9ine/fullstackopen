import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('renders title', () => {
  const blog = {
    title: 'What is HTTP',
    author: 'wikipedia',
    url: 'https://en.wikipedia.org/wiki/HTTP',
  }

  render(<Blog blog={blog} />)

  const element = screen.getByText(blog.title, { exact: false })
})

test('clicking the button shows more information about the blog', async () => {
  const blog = {
    title: 'What is HTTP',
    author: 'wikipedia',
    url: 'https://en.wikipedia.org/wiki/HTTP',
    likes: 6,
    user: { name: 'John' }
  }

  render(<Blog blog={blog} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  screen.getByText(blog.url)
  screen.getByText(`likes ${blog.likes}`)
  screen.getByText(blog.user.name)

})

test('clicking the "like" button twice calls event handler twice', async () => {
  const blog = {
    title: 'What is HTTP',
    author: 'wikipedia',
    url: 'https://en.wikipedia.org/wiki/HTTP',
    likes: 6,
    user: { name: 'John' }
  }

  const mockHandler = vi.fn()

  render(<Blog blog={blog} handdleUpdate={mockHandler} />)

  const user = userEvent.setup()
  const button = screen.getByText('view')
  await user.click(button)

  const likeButton = screen.getByText('like')
  await user.click(likeButton)
  await user.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
})



