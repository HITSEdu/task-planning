export type PageLinkType = {
  path: string;
  labelKey: string;
}

export const sitePages: Record<string, PageLinkType> = {
  login: { path: '/sign-in', labelKey: 'Войти' },
  register: { path: '/sign-up', labelKey: 'Регистрация' },
  home: { path: '/', labelKey: 'Главная' },
  teams: { path: '/teams', labelKey: 'Команды' },
  dashboard: { path: '/dashboard', labelKey: 'Dashboard' }, // TODO: /dashboard -> profile?
} as const

export type SitePageKey = keyof typeof sitePages

export type StateType<T = unknown> = {
  status?: 'success' | 'error'
  message?: string | null
  data?: T | null
}