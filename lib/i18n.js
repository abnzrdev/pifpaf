const ru = {
  common: { dashboard: 'Кабинет', signIn: 'Войти', signOut: 'Выйти', close: 'Закрыть', refresh: 'Обновить', refreshing: 'Обновление…' },
  logo: { home: 'PifPaf AI — на главную', badge: 'для авторов' },
  landing: {
    headline: ['Ваши Reels.', 'Все результаты', 'в одном месте.'],
    description: 'Добавляйте Reels и следите за просмотрами и результатами в едином пространстве автора.',
    cta: 'В пространство автора', note: 'Ваш контент — всё в одном месте ✨', collage: 'Коллаж из историй автора', views: 'просмотров',
  },
  login: { eyebrow: 'С возвращением ✨', title: 'Войти в пространство автора', description: 'Все Reels и их результаты — без лишних таблиц.', email: 'Email', password: 'Пароль', pending: 'Входим…', submit: 'Войти', error: 'Неверный email или пароль.', demo: 'Демо', empty: 'Пустой кабинет', imageAlt: 'Автор улыбается на улице', imageCopy: ['Ваши истории.', 'Одно спокойное пространство.'] },
  dashboard: { welcome: 'С возвращением', title: 'Пространство автора', description: 'Следите за результатами Reels и храните всё в одном месте.', totals: 'Итоги по Reels', totalReels: 'Всего Reels', totalViews: 'Всего просмотров', bestReel: 'Лучший Reel', yourReels: 'Ваши Reels', reelsDescription: 'Все сохранённые Reels в одном месте.', addAnother: 'Добавить ещё Reel', added: 'Reel добавлен в пространство автора', growth: 'Добавляйте Reels, чтобы видеть развитие своей истории.' },
  reel: { untitled: 'Reel без названия', views: 'Просмотры', likes: 'Лайки', comments: 'Комментарии', date: 'Опубликовано' },
  import: { firstTitle: 'Добавьте первый Reel ✨', modalTitle: 'Добавить Reel', fetchingTitle: 'Получаем данные Reel ✨', description: 'Вставьте ссылку на публичный Instagram Reel.', fetchingDescription: 'PifPaf получает актуальные публичные данные из Instagram.', inputLabel: 'Ссылка на Instagram Reel', fetch: 'Получить данные Reel', fetching: 'Получаем данные Reel…', privacy: 'Используются только публичные данные Reel.', badge: 'Добавить ещё Reel ✨', found: 'Ссылка на Reel найдена', metrics: 'Получаем просмотры и дату', cover: 'Загружаем обложку', wait: 'Обычно это занимает несколько секунд.' },
}

const en = {
  common: { dashboard: 'Dashboard', signIn: 'Sign in', signOut: 'Sign out', close: 'Close', refresh: 'Refresh', refreshing: 'Refreshing…' },
  logo: { home: 'PifPaf AI home', badge: 'for creators' },
  landing: { headline: ['Your Reels.', 'All your results', 'in one place.'], description: 'Add your Reels and track views and performance in one simple creator space.', cta: 'Enter Creator Space', note: 'Your posts — all in one place ✨', collage: 'Creator lifestyle collage', views: 'views' },
  login: { eyebrow: 'Welcome back ✨', title: 'Enter your Creator Space', description: 'Track every Reel without the spreadsheet shuffle.', email: 'Email', password: 'Password', pending: 'Signing in…', submit: 'Sign in', error: 'Email or password is incorrect.', demo: 'Demo', empty: 'Empty state', imageAlt: 'Creator smiling outdoors', imageCopy: ['Your stories.', 'One calm space.'] },
  dashboard: { welcome: 'Welcome back', title: 'Your Creator Space', description: 'See how your Reels are performing and keep everything together.', totals: 'Reel totals', totalReels: 'Total Reels', totalViews: 'Total Views', bestReel: 'Best Reel', yourReels: 'Your Reels', reelsDescription: 'All your saved Reels in one place.', addAnother: 'Add Another Reel', added: 'Reel added to your Creator Space', growth: 'Keep adding Reels to track your growth and storytelling.' },
  reel: { untitled: 'Untitled Reel', views: 'Views', likes: 'Likes', comments: 'Comments', date: 'Published' },
  import: { firstTitle: 'Add your first Reel ✨', modalTitle: 'Add a new Reel', fetchingTitle: 'Fetching your Reel ✨', description: 'Paste a public Instagram Reel link to begin.', fetchingDescription: 'PifPaf is collecting the latest public data from Instagram.', inputLabel: 'Instagram Reel URL', fetch: 'Fetch Reel Data', fetching: 'Fetching Reel Data…', privacy: 'Only public Reel information is accessed.', badge: 'Add another Reel ✨', found: 'Reel link found', metrics: 'Fetching views and date', cover: 'Loading cover image', wait: 'This usually takes a few seconds.' },
}

const messages = { ru, en }

const ruErrors = new Map([
  ['Enter a valid public Instagram Reel URL.', 'Введите корректную ссылку на публичный Instagram Reel.'],
  ['We could not find public data for this Reel. It may be private or deleted.', 'Публичные данные Reel не найдены. Возможно, он закрыт или удалён.'],
  ['Instagram data could not be fetched right now. Please try again.', 'Сейчас не удалось получить данные Instagram. Попробуйте ещё раз.'],
  ['The data service is busy. Please wait a moment and try again.', 'Сервис данных занят. Подождите немного и попробуйте ещё раз.'],
  ['Fetching this Reel took too long. Please try again.', 'Получение данных Reel заняло слишком много времени. Попробуйте ещё раз.'],
  ['Reel data could not be saved right now. Please try again.', 'Сейчас не удалось сохранить данные Reel. Попробуйте ещё раз.'],
  ['Your session expired. Please sign in again.', 'Сессия истекла. Войдите снова.'],
  ['That Reel is no longer available.', 'Этот Reel больше недоступен.'],
])

export function normalizeLocale(value) {
  return value === 'en' ? 'en' : 'ru'
}

export function getMessages(locale) {
  return messages[normalizeLocale(locale)]
}

export function translateError(message, locale) {
  return normalizeLocale(locale) === 'ru' ? ruErrors.get(message) ?? message : message
}
