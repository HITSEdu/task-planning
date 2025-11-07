'use client'

import { FormEvent, useState } from 'react'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export default function SignUpPage() {
  const router = useRouter()
  const [error, setError] = useState<string | null>(null)

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const formData = new FormData(e.currentTarget)

    const {
      data: usernameData,
      error: usernameError
    } = await authClient.isUsernameAvailable({
      username: formData.get('username') as string,
    })

    if (usernameError || !usernameData?.available) {
      setError('Username is not available')
    } else {

      const res = await authClient.signUp.email({
        name: formData.get('name') as string,
        email: formData.get('email') as string,
        password: formData.get('password') as string,
        username: formData.get('username') as string,
      })


      if (res.error) {
        setError(res.error.message || 'Something went wrong.')
      } else {
        router.push('/dashboard')
      }
    }
  }

  return (
    <main className="max-w-md mx-auto p-6 space-y-4 text-white">
      <h1 className="text-2xl font-bold">Sign Up</h1>

      {error && <p className="text-red-500">{error}</p>}

      <form
        onSubmit={handleSubmit}
        className="space-y-4"
      >
        <input
          name="name"
          placeholder="Full Name"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="username"
          type="username"
          placeholder="Username"
          required
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          required
          minLength={8}
          className="w-full rounded-md bg-neutral-900 border border-neutral-700 px-3 py-2"
        />
        <button
          type="submit"
          className="w-full bg-white text-black font-medium rounded-md px-4 py-2 hover:bg-gray-200"
        >
          Create Account
        </button>
      </form>
    </main>
  )
}