import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-[400px] w-full">
      <div className="text-center flex flex-col gap-4">
        <h1 className="text-4xl font-bold text-surface-900">404</h1>
        <p className="text-surface-600">Страница не найдена</p>
        <Button asChild>
          <Link href="/">На главную</Link>
        </Button>
      </div>
    </div>
  )
}