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
      href: sitePages.teams.path,
      label: sitePages.teams.labelKey,
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
    <nav className="flex gap-8 items-center justify-center">
      {links.filter(el => el.condition).map((link) => (
        <Link
          key={link.href}
          href={link.href}
          className={`transition-colors hover:text-primary ${
            pathname === link.href 
              ? 'text-primary font-semibold' 
              : 'text-muted-foreground'
          }`}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  )
}