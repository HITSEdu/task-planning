'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { useEffect } from 'react'

export default function DashboardPage() {
  const router = useRouter()
  const { data: session, isPending } = authClient.useSession()

  useEffect(() => {
    if (!isPending && !session?.user) {
      router.push('/sign-in')
    }
  }, [isPending, session, router])

  if (isPending)
    return <p className="text-center mt-8 text-white">Loading...</p>
  if (!session?.user)
    return <p className="text-center mt-8 text-white">Redirecting...</p>

  const { user } = session

  return (
    <div className="flex items-center justify-center mt-16">
      {/* TODO(Сделать диаграмму ганта в виде матрица для каждого проекта) */}
      {/* TODO(Выделять задачи, которые принадлежат пользователю) */}
      <p>UserName: {user.username}</p>
    </div>
  )
}