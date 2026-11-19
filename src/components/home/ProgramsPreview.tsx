import Link from 'next/link'

const featuredPrograms = [
  {
    tag: 'EMPLOYMENT',
    badgeColor: 'bg-primary text-on-primary',
    heightClass: 'h-64',
    title: 'Employment & Economic Empowerment',
    description:
      'Job readiness workshops, resume coaching, career navigation, and job fairs connecting job seekers with meaningful employment opportunities.',
    linkText: 'Explore Employment',
    href: '/programs',
    image: '/images/tcip-hero-community.jpg',
    alt: 'Employment and economic empowerment initiatives at TCIP',
  },
  {
    tag: 'NEWCOMERS',
    badgeColor: 'bg-secondary text-on-secondary',
    heightClass: 'h-48',
    title: 'Newcomer & Community Support',
    description:
      'Welcoming support, orientation navigation, community resources, and cultural connection programs designed to help arriving individuals and families settle with confidence.',
    linkText: 'Settlement Support',
    href: '/programs',
    image: '/images/tcip-community-workshop.jpg',
    alt: 'Newcomer settlement and community support in Toronto',
  },
  {
    tag: 'YOUTH',
    badgeColor: 'bg-primary text-on-primary',
    heightClass: 'h-56',
    title: 'Youth Development',
    description:
      'Positive mentorship, skill building, summer camps, and creative leadership activities that empower young people to discover their strengths and thrive.',
    linkText: 'Youth Programs',
    href: '/programs',
    image: '/images/tcip-youth-leadership.jpg',
    alt: 'Youth development and leadership activities at TCIP',
  },
  {
    tag: 'HEALTH & CARE',
    badgeColor: 'bg-tertiary-container text-on-tertiary-container',
    heightClass: 'h-48',
    title: 'Health & Wellness',
    description:
      'Community health awareness, preventative dental care access initiatives, wellness information, and family health education forums.',
    linkText: 'Health Initiatives',
    href: '/programs',
    image: '/images/tcip-community-workshop.jpg',
    alt: 'Community health and wellness support in Toronto',
  },
]

export interface FeaturedProgramInput {
  id: string
  title: string
  slug: string
  category: string
  shortDescription: string
  imageUrl: string | null
}

const CARD_BADGES = [
  'bg-primary text-on-primary',
  'bg-secondary text-on-secondary',
  'bg-tertiary-container text-on-tertiary-container',
]
const CARD_HEIGHTS = ['h-64', 'h-56', 'h-48']

export default function ProgramsPreview({ programs }: { programs?: FeaturedProgramInput[] }) {
  const cards =
    programs && programs.length > 0
      ? programs.map((p, i) => ({
          tag: p.category,
          badgeColor: CARD_BADGES[i % CARD_BADGES.length],
          heightClass: CARD_HEIGHTS[i % CARD_HEIGHTS.length],
          title: p.title,
          description: p.shortDescription,
          linkText: 'Learn More',
          href: `/programs/${p.slug}`,
          image: p.imageUrl || '/images/tcip-hero-community.jpg',
          alt: p.title,
        }))
      : featuredPrograms

  return (
    <section id="programs" className="w-full bg-surface-container-low py-space-3xl scroll-mt-20 border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="max-w-2xl mb-space-2xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            APPROVED FOCUS AREAS
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Community-Centered Programs &amp; Initiatives
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            Supporting Black immigrants, newcomers, youth, women, and families through practical skills, community connection, and responsive advocacy.
          </p>
        </div>

        {/* 4 Columns with Visual Hierarchy & Varied Card Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          {cards.map((prog) => (
            <div
              key={prog.title}
              className="bg-surface-container-lowest rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-all duration-300 border border-outline-variant/30"
            >
              <div>
                <div className={`${prog.heightClass} w-full rounded-2xl overflow-hidden mb-6 relative bg-surface-container`}>
                  <img
                    src={prog.image}
                    alt={prog.alt}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <span
                    className={`absolute top-3 left-3 ${prog.badgeColor} font-eyebrow-bold text-eyebrow-bold px-3 py-1 rounded-full uppercase shadow-xs`}
                  >
                    {prog.tag}
                  </span>
                </div>
                <h3 className="font-title-md text-title-md text-on-surface font-bold">
                  {prog.title}
                </h3>
                <p className="font-body-sm text-body-sm text-on-surface-variant mt-3 leading-relaxed">
                  {prog.description}
                </p>
              </div>

              <div className="pt-6">
                <Link
                  href={prog.href}
                  className="inline-flex items-center text-primary font-label-md text-label-md hover:underline gap-1 group font-semibold"
                >
                  <span>{prog.linkText}</span>
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">
                    arrow_forward
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Additional Approved Focus Areas Bar */}
        <div className="mt-space-xl p-6 rounded-2xl bg-surface-container border border-outline-variant/30 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-label-md text-label-md text-on-surface font-bold">
              Also Supporting:
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-semibold border border-outline-variant/30">
              Women &amp; Family Empowerment
            </span>
            <span className="inline-flex items-center px-3 py-1 rounded-full bg-surface-container-lowest text-primary text-xs font-semibold border border-outline-variant/30">
              Advocacy, Culture &amp; Community Development
            </span>
          </div>
          <Link
            href="/programs"
            className="text-primary hover:text-primary-container font-label-md text-label-md font-bold whitespace-nowrap inline-flex items-center gap-1"
          >
            <span>View All Programs</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

      </div>
    </section>
  )
}
