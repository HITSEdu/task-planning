'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { sitePages } from '@/app/config/site.config'
import { UserDTO } from '@/app/data/user/user.dto'

type NavBarProps = {
  user: UserDTO | null
}

export default function NavBar({ user }: NavBarProps) {
  const pathname = usePathname()

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