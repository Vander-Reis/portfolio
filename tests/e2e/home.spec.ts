import AxeBuilder from '@axe-core/playwright'
import { expect, type Page, test } from '@playwright/test'

/** Rola a página inteira para disparar as animações de entrada antes de auditar. */
async function revealAll(page: Page) {
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) {
      window.scrollTo(0, y)
      await new Promise((r) => setTimeout(r, 60))
    }
    window.scrollTo(0, 0)
  })
  await page.waitForTimeout(1200)
}

test.describe('home', () => {
  test('conta a narrativa e mostra todas as seções', async ({ page }) => {
    await page.goto('/')
    await expect(page.getByRole('heading', { level: 1 })).toContainText('de estagiário a sênior')
    for (const id of [
      'about',
      'cases',
      'career',
      'certifications',
      'stack',
      'principles',
      'github',
      'security',
      'contact',
    ]) {
      await expect(page.locator(`section#${id}`)).toBeAttached()
    }
  })

  test('troca para inglês mantendo a página', async ({ page }) => {
    await page.goto('/cases/legacy-modernization')
    await page.getByRole('link', { name: 'EN' }).click()
    await expect(page).toHaveURL(/\/en\/cases\/legacy-modernization$/)
    await expect(page.getByRole('heading', { level: 1 })).toContainText('Legacy modernization')
  })

  test('navega da lista para o case', async ({ page }) => {
    await page.goto('/')
    await page.locator('#cases a').first().click()
    await expect(page).toHaveURL(/\/cases\//)
    await expect(page.getByRole('img', { name: /COBOL|Modernização/ })).toBeVisible()
  })

  test('tema escuro persiste após recarregar', async ({ page }) => {
    await page.goto('/')
    await page.getByRole('button', { name: /tema escuro/i }).click()
    await page.reload()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark')
  })

  for (const path of ['/', '/en', '/cases/subscription-sync-service', '/security']) {
    test(`sem violações de acessibilidade (axe) em ${path}`, async ({ page }) => {
      await page.goto(path)
      await revealAll(page)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      expect(results.violations).toEqual([])
    })
  }
})

test.describe('contato', () => {
  test('valida no servidor e mostra erros por campo', async ({ page }) => {
    await page.goto('/#contact')
    await page.getByRole('button', { name: 'Enviar mensagem' }).click()
    await expect(page.getByText('Informe um e-mail válido.')).toBeVisible()
  })
})
