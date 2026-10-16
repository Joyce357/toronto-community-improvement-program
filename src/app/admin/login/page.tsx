'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const rawCallbackUrl = searchParams.get('callbackUrl') ?? '/admin'
  const callbackUrl = rawCallbackUrl.startsWith('/admin/login') ? '/admin' : rawCallbackUrl

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (res?.error) {
        setError('Invalid email or password. Please try again.')
        setLoading(false)
        return
      }

      router.push(callbackUrl)
      router.refresh()
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md relative z-10">
      <div className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="px-8 pt-8 pb-6 text-center border-b border-gray-100">
          <div className="flex justify-center mb-3">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-gray-200 shadow-xs">
              <Image
                src="/images/tcip-logo.png"
                alt="Toronto Community Improvement Program"
                fill
                className="object-contain p-0.5"
                priority
              />
            </div>
          </div>
          <h1 className="text-xl font-bold text-gray-900 tracking-tight">Admin Portal</h1>
          <p className="text-xs text-gray-500 mt-1">Toronto Community Improvement Program (TCIP)</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-6 space-y-4" noValidate>
          {error && (
            <div
              className="bg-red-50 border border-red-200 text-red-700 text-xs px-4 py-3 rounded-xl font-medium"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all bg-white"
              placeholder="admin@torontocip.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-xs font-bold text-gray-800 uppercase tracking-wider mb-1.5">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-3.5 py-2.5 border border-gray-300 rounded-xl text-gray-900 text-sm focus:outline-none focus:ring-2 focus:ring-[#16A34A]/30 focus:border-[#16A34A] transition-all bg-white"
              placeholder="••••••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-2 py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-[#16A34A] hover:bg-[#15803D] transition-colors shadow-xs disabled:opacity-50 cursor-pointer"
          >
            {loading ? 'Signing in…' : 'Sign In to Dashboard'}
          </button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-6 text-center border-t border-gray-100 pt-4">
          <Link
            href="/"
            className="text-xs text-gray-500 hover:text-[#16A34A] font-semibold transition-colors"
          >
            ← Return to public website
          </Link>
        </div>
      </div>
    </div>
  )
}

export default function AdminLoginPage() {
  return (
    <div className="min-h-screen bg-[#F9FAFB] flex items-center justify-center px-4 relative">
      <Suspense fallback={
        <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md border border-gray-200 text-center">
          <p className="text-gray-900 font-semibold text-sm">Loading Admin Portal…</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
