'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sitePages } from '@/app/config/site.config'
import { authClient } from '@/lib/auth-client'

export default function NavBar() {
  const pathname = usePathname()
  const { data: session, isPending } = authClient.useSession()

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>

  const user = session?.user

  const links = [
    {
      href: sitePages.dashboard.path,
      label: sitePages.dashboard.labelKey,
      condition: !!user
    },
    {
      href: sitePages.register.path,
      label: sitePages.register.labelKey,
      condition: !user
    },
    {
      href: sitePages.login.path,
      label: sitePages.login.labelKey,
      condition: !user
    },
  ]

  return (
    <nav className="flex gap-2 items-center justify-center">
      {links.filter(el => el.condition).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors hover:text-indigo-400 ${
            pathname === link.href ? 'text-indigo-500 font-semibold' : 'text-gray-700 dark:text-gray-300'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}