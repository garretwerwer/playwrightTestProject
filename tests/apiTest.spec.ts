import { test, expect, request } from '@playwright/test';
import tags from '../test-data/tags.json'


test.beforeEach( async ({ page }) => {
  // await page.route('*/**/api/tags', async route =>{
  //   await route.fulfill({ 
  //     body: JSON.stringify(tags)
  //   })
  // })
  await page.goto('https://angular.realworld.io/');
  // await page.getByText('Sign in').click()
  // await page.getByRole('textbox', {name: 'Email'}).fill('garretwerwer@gmail.com')
  // await page.getByRole('textbox', {name: 'Password'}).fill('2300309werWER!')
  // await page.getByRole('button').click()

  // const signIn = await page.waitForResponse('https://api.realworld.io/api/users/login')
  // const signInResBody = await signIn.json()
  // console.log(signInResBody)
})

test('has title', async ({ page }) => {
  await page.route('*/**/api/articles*', async route =>{
    const response = await route.fetch()
    const responseBody = await response.json()
    responseBody.articles[0].title = 'This is Mock title'
    responseBody.articles[0].description = 'This is Mock description'

    await route.fulfill({ 
      body: JSON.stringify(responseBody)
    })
  })

  await page.getByText('Global Feed').click()
  await expect(page.locator('.navbar-brand')).toHaveText('conduit')
  await expect(page.locator('app-article-list h1').first()).toContainText('This is Mock title')
  await expect(page.locator('app-article-list p').first()).toContainText('This is Mock description')

});

test('create request - delete arcticle', async ({ page, request }) => {
  
  const articleResponse = await request.post('https://api.realworld.io/api/articles/',{
    data: {"article":{"tagList":[],"title":"test article","description":"test","body":"tes"}},
  })
  expect(articleResponse.status()).toEqual(201)
  console.log(await articleResponse.body())

  const articleResponseBody = await articleResponse.json()
  const slug = articleResponseBody.article.slug
  
  await request.delete(`https://api.realworld.io/api/articles/${slug}`, 
  )
  expect(articleResponse.status()).toEqual(201)

});

test('intercept', async ({ page }) => {
  await page.getByText('Global Feed').click()
});