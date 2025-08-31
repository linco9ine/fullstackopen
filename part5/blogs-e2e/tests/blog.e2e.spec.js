const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./helper')

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('http://localhost:3003/api/testing/reset')
    await request.post('http://localhost:3003/api/users', {
      data: {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }
    })

    await page.goto('http://localhost:5173')
  })

  test('Login form is shown', async ({ page }) => {
    await expect(page.getByText('log in to application')).toBeVisible()
    await expect(page.getByText('username')).toBeVisible()
    await expect(page.getByText('password')).toBeVisible()
    await expect(page.getByRole('textbox')).toHaveCount(2)
    await expect(page.getByRole('button', { name: 'login' })).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      const credentials = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }

      await loginWith(page, credentials.username, credentials.password)

      await expect(page.getByText(`${credentials.name} logged in`)).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      const incorrectCredentials = {
        name: 'Matti Luukkainen',
        username: 'fullstash',
        password: 'Hel2025'
      }

      await loginWith(page, incorrectCredentials.username, incorrectCredentials.password)

      await expect(page.getByText(`${incorrectCredentials.name} logged in`)).not.toBeVisible()
      await expect(page.getByText('invalid username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      const credentials = {
        name: 'Matti Luukkainen',
        username: 'mluukkai',
        password: 'salainen'
      }

      const blog = {
        title: 'what Is HTTP?',
        author: 'wikipedia',
        url: 'https://en.wikipedia.org/wiki/HTTP'
      }

      await loginWith(page, credentials.username, credentials.password)
      await createBlog(page, blog)
    })

    test('a new blog can be created', async ({ page }) => {
      await expect(page.getByText('a new blog what Is HTTP? by wikipedia added')).toBeVisible()
      await expect(page.getByText('what Is HTTP? wikipedia')).toBeVisible()
      await expect(page.getByRole('button', { name: 'view' })).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('likes 0')).toBeVisible()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
    })

    test('the user who added the blog can delete the blog', async ({ page }) => {
      page.once('dialog', async (dialog) => {
        expect(dialog.message()).toBe('Remove blog what Is HTTP? by wikipedia')
        await dialog.accept()
      })

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'remove' }).click()

      await expect(page.getByText('https://en.wikipedia.org/wiki/HTTP', { exact: true })).toHaveCount(0)
    })

    test('only the user who added the blog sees the delete blog button', async ({ page, request }) => {
      await page.getByRole('button', { name: 'logout' }).click()
      
      const user = {
        name: 'john luck',
        username: 'john',
        password: 'johnluck1234'
      }

      await request.post('http://localhost:3003/api/users', { data: { ...user } })
      await loginWith(page, user.username, user.password)
      await page.getByRole('button', { name: 'view' }).click()
      const blog = page.locator('div').filter({ hasText: /^Matti Luukkainen$/ })
      await expect(blog.getByRole('button', { name: 'remove' })).toHaveCount(0)
    })

    test('blogs are arranged in order of likes, with the blog with the most likes first', async ({ page }) => {
      const MemoizationBlog = {
        title: 'What Is Memoization?',
        author: 'wikipedia',
        url: 'https://en.wikipedia.org/wiki/Memoization'
      }

      const gRPCBlog = {
        title: 'What Is gRPC?',
        author: 'wikipedia',
        url: 'https://en.wikipedia.org/wiki/GRPC'
      }

      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()

      await createBlog(page, MemoizationBlog)
      await createBlog(page, gRPCBlog)

      const Memoization = page.locator('div').filter({ hasText: /^What Is Memoization\? wikipedia/ })

      await Memoization.getByRole('button', { name: 'view' }).click()
      await Memoization.getByRole('button', { name: 'like' }).click()
      await Memoization.getByRole('button', { name: 'like' }).click()

      const gRPC = page.locator('div').filter({ hasText: /^What Is gRPC\? wikipedia/ })

      await gRPC.getByRole('button', { name: 'view' }).click()
      await gRPC.getByRole('button', { name: 'like' }).click()
      await gRPC.getByRole('button', { name: 'like' }).click()
      await gRPC.getByRole('button', { name: 'like' }).click()

      const divs = await page.getByText('likes').all()

      await expect(divs[0]).toHaveText('likes 3like')
      await expect(divs[1]).toHaveText('likes 2like')
      await expect(divs[2]).toHaveText('likes 1like')
    })
  })
})



