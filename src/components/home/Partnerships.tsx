import Image from 'next/image'
import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function Partnerships() {
  let dbPartners: Array<{
    id: string
    name: string
    logoUrl: string | null
    websiteUrl: string | null
    description: string | null
  }> = []

  try {
    dbPartners = await prisma.partner.findMany({
      where: { published: true },
      orderBy: [{ displayOrder: 'asc' }, { createdAt: 'desc' }],
    })
  } catch (err) {
    console.error('[Partnerships Component] DB query error:', (err as Error)?.message)
  }

  return (
    <section className="w-full bg-surface-container-low py-space-2xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop text-center">
        <span className="font-eyebrow-bold text-eyebrow-bold text-on-surface-variant uppercase tracking-widest block mb-2">
          COLLABORATIVE ECOSYSTEM
        </span>
        <h2 className="font-headline-md text-headline-md text-on-surface">
          Stronger Through Partnership
        </h2>
        <p className="font-body-sm text-body-sm text-on-surface-variant max-w-xl mx-auto mt-2 mb-space-xl">
          Collaborating with local organizations, community networks, and supporters to expand community access and resources across Toronto.
        </p>

        {dbPartners.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-gutter items-center">
            {dbPartners.map((partner) => {
              const cardContent = (
                <div className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow group border border-outline-variant/30 min-h-[140px] h-full">
                  {partner.logoUrl ? (
                    <div className="relative w-16 h-12 mb-2 flex items-center justify-center">
                      <Image
                        src={partner.logoUrl}
                        alt={partner.name}
                        fill
                        className="object-contain"
                      />
                    </div>
                  ) : (
                    <div className="w-12 h-12 rounded-xl bg-surface-container flex items-center justify-center text-on-surface-variant group-hover:text-primary transition-colors mb-2">
                      <span className="material-symbols-outlined text-2xl">
                        handshake
                      </span>
                    </div>
                  )}
                  <span className="font-label-md text-label-md font-bold text-on-surface text-center line-clamp-1">
                    {partner.name}
                  </span>
                  {partner.description && (
                    <span className="font-label-sm text-label-sm text-on-surface-variant text-center mt-0.5 line-clamp-1">
                      {partner.description}
                    </span>
                  )}
                </div>
              )

              return partner.websiteUrl ? (
                <a
                  key={partner.id}
                  href={partner.websiteUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="block h-full transition-transform hover:-translate-y-0.5"
                  title={`Visit ${partner.name}`}
                >
                  {cardContent}
                </a>
              ) : (
                <div key={partner.id} className="h-full">
                  {cardContent}
                </div>
              )
            })}
          </div>
        ) : (
          <div className="max-w-md mx-auto pt-2 flex justify-center">
            <Link
              href="/#contact"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-95 transition-all shadow-xs"
            >
              <span>Partner With TCIP</span>
              <span className="material-symbols-outlined text-lg">arrow_forward</span>
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
