// Read-only verification: prints row counts and non-secret identity info.
// Never prints connection strings, passwords, or password hashes.
import { config } from 'dotenv'
import pg from 'pg'

config({ path: '.env.local' })

const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL })
const tables = [
  ['SiteSettings', 'site_settings'],
  ['Users', 'users'],
  ['Programs', 'programs'],
  ['Events', 'events'],
  ['GalleryItems', 'gallery_items'],
  ['NewsPosts', 'news_posts'],
  ['Partners', 'partners'],
  ['ContactSubmissions', 'contact_submissions'],
  ['VolunteerApplications', 'volunteer_applications'],
  ['NewsletterSubscribers', 'newsletter_subscribers'],
  ['Donations', 'donations'],
]

try {
  for (const [label, table] of tables) {
    const r = await pool.query(`select count(*)::int as n from "${table}"`)
    console.log(`${label}: ${r.rows[0].n}`)
  }
  const users = await pool.query('select email, role from users order by "createdAt"')
  console.log('User identities:', users.rows.map((u) => `${u.email} (${u.role})`).join('; ') || '(none)')
  const s = await pool.query('select id, "organizationName", "publicEmail", "seoTitle" from site_settings')
  console.log('SiteSettings rows:', JSON.stringify(s.rows))
} catch (err) {
  console.error('Verify failed:', (err.message || '').replace(/postgres(ql)?:\/\/\S+/g, '[REDACTED]'))
  process.exitCode = 1
} finally {
  await pool.end()
}

