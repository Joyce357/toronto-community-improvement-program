'use client'

import { useState, Suspense } from 'react'
import { signIn } from 'next-auth/react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Button from '@/components/ui/Button'

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
      {/* Card */}
      <div className="bg-brand-warm-white dark:bg-dark-card rounded-3xl shadow-2xl overflow-hidden border border-border-soft dark:border-dark-border transition-colors duration-200">
        {/* Header */}
        <div className="bg-brand-navy dark:bg-dark-surface px-8 py-8 text-center border-b border-brand-navy-dark dark:border-dark-border">
          <div className="inline-flex items-center gap-2.5 mx-auto bg-white/95 rounded-2xl px-4 py-2 shadow-sm mb-4">
            <div className="w-8 h-8 rounded-xl bg-brand-navy text-white font-extrabold text-xs flex items-center justify-center tracking-wider">
              <span className="text-brand-gold mr-0.5">T</span>CIP
            </div>
            <span className="font-extrabold text-brand-navy text-base tracking-tight">
              TCIP Admin
            </span>
          </div>
          <h1 className="text-brand-warm-white text-lg font-bold">Admin Portal</h1>
          <p className="text-brand-gold text-xs mt-0.5 font-semibold tracking-wider uppercase">Toronto Community Improvement Program</p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5" noValidate>
          {error && (
            <div
              className="bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-sm px-4 py-3 rounded-xl"
              role="alert"
            >
              {error}
            </div>
          )}

          <div>
            <label htmlFor="email" className="block text-sm font-bold text-brand-navy dark:text-dark-text-primary mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoComplete="email"
              className="w-full px-4 py-3 border border-border-soft dark:border-dark-border rounded-xl text-text-primary dark:text-dark-text-primary text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent
                         transition-all duration-200 placeholder:text-text-secondary/60 dark:placeholder:text-dark-text-secondary/50 bg-white dark:bg-dark-surface"
              placeholder="admin@torontocip.com"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-bold text-brand-navy dark:text-dark-text-primary mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              className="w-full px-4 py-3 border border-border-soft dark:border-dark-border rounded-xl text-text-primary dark:text-dark-text-primary text-sm
                         focus:outline-none focus:ring-2 focus:ring-brand-cyan focus:border-transparent
                         transition-all duration-200 placeholder:text-text-secondary/60 dark:placeholder:text-dark-text-secondary/50 bg-white dark:bg-dark-surface"
              placeholder="Enter your password"
            />
          </div>

          <Button
            type="submit"
            variant="environmental"
            disabled={loading}
            className="w-full justify-center shadow-md cursor-pointer"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </Button>
        </form>

        {/* Footer */}
        <div className="px-8 pb-8 text-center border-t border-border-soft/60 dark:border-dark-border pt-4">
          <Link
            href="/"
            className="text-xs text-brand-green dark:text-brand-cyan hover:text-brand-navy dark:hover:text-dark-text-primary font-semibold transition-colors"
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
    <div className="min-h-screen bg-brand-navy-dark flex items-center justify-center px-4 relative overflow-hidden">
      {/* Decorative ambient glows */}
      <div className="absolute -top-24 -right-24 w-96 h-96 bg-brand-cyan/15 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />
      <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-brand-green/20 rounded-full blur-3xl pointer-events-none" aria-hidden="true" />

      <Suspense fallback={
        <div className="w-full max-w-md bg-brand-warm-white dark:bg-dark-card p-8 rounded-3xl text-center">
          <p className="text-brand-navy dark:text-dark-text-primary font-bold">Loading Admin Portal…</p>
        </div>
      }>
        <LoginForm />
      </Suspense>
    </div>
  )
}
