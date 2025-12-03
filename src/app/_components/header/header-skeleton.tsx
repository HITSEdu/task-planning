import Link from 'next/link'
import { ModeToggle } from '@/app/_components/header/mode-toggle'
import { sitePages } from '@/app/config/site.config'
import { Skeleton } from '@/components/ui/skeleton'

export default function HeaderSkeleton() {
  return (
    <header className="flex items-center justify-between w-full px-6 py-4 shadow-md">
      <div className="text-2xl font-bold tracking-tight">
        <Link href={sitePages.home.path}>{sitePages.home.labelKey}</Link>
      </div>
      {/* <div className="flex gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-32" />
      </div> */}
      <div className="flex gap-8">
        <div className="flex items-center justify-between gap-2">
          <ModeToggle />
        </div>
      </div>
    </header>
  )
}