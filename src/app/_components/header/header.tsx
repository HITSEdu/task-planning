import Link from 'next/link'
import { ModeToggle } from '@/app/_components/header/mode-toggle'
import NavBar from '@/app/_components/header/navbar'
import { sitePages } from '@/app/config/site.config'
import UserBlock from '@/app/_components/header/user-block'

export default async function Header() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 shadow-md">
      <div className="text-2xl font-bold tracking-tight">
        <Link href={sitePages.home.path}>{sitePages.home.labelKey}</Link>
      </div>
      <NavBar
      />
      <div className="flex gap-8">
        <UserBlock />
        <div className="flex items-center justify-between gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}