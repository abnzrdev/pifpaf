import assert from 'node:assert/strict'
import test from 'node:test'

import { getMessages, normalizeLocale, translateError } from '../lib/i18n.js'

test('defaults the interface to Russian and keeps English selectable', () => {
  assert.equal(normalizeLocale(undefined), 'ru')
  assert.equal(normalizeLocale('de'), 'ru')
  assert.equal(normalizeLocale('en'), 'en')
  assert.equal(getMessages('ru').dashboard.title, 'Пространство автора')
  assert.equal(getMessages('en').dashboard.title, 'Your Creator Space')
})

test('translates known server errors without hiding unknown failures', () => {
  assert.equal(translateError('This Instagram post is not a public Reel.', 'ru'), 'Этот пост Instagram не является публичным Reel.')
  assert.equal(translateError('Enter a valid public Instagram Reel URL.', 'ru'), 'Введите корректную ссылку на публичный Instagram Reel.')
  assert.equal(translateError('Unexpected provider failure', 'ru'), 'Unexpected provider failure')
  assert.equal(translateError('Enter a valid public Instagram Reel URL.', 'en'), 'Enter a valid public Instagram Reel URL.')
})
