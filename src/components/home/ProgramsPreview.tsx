import Link from 'next/link'

const programs = [
  {
    tag: 'EMPLOYMENT',
    badgeColor: 'bg-primary text-on-primary',
    heightClass: 'h-64',
    title: 'Economic & Career Empowerment',
    description:
      'Job fairs, resume optimization labs, credential bridging, and vocational career pathways connecting talent directly with GTA employers.',
    linkText: 'View Job Fairs',
    href: '/programs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuACc7_GpM4qWV-q9cFIMh7Oi-pNqmcJr7Iygh7E5ggfVPNOsyyvzrcW-g3a9WgzJzU5aqP9B_nmIGXXbMynmeqnvCRU7fpXPgDG0le86yB6hCsrpVX0hG3yfwy9gleuOndZyin5oHErg9vpD4MRr-_7RDVu685Yyvj5tDUIo41AM2YCahf_G2DVSLYsmPjWbWuD-eFted3HA6gQweM3sQCreXhCdkh8oTuObU_yr8uniPwlRB0VqKcl',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'Employment & Economic Empowerment Career Coaching in Toronto',
  },
  {
    tag: 'SETTLEMENT',
    badgeColor: 'bg-secondary text-on-secondary',
    heightClass: 'h-48',
    title: 'Newcomer & Community Support',
    description:
      'Language exchange circles, housing stabilization navigation, and culturally informed transition advisory for arriving immigrants.',
    linkText: 'Settlement Support',
    href: '/programs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA2RrZ7HsX2bPoKAiKGm2VbNyCDh3fYsefPWwftb6SJuWIZ6bQdX4MvoBQPMUW3AGPdtsuPEJsUJFR0RJ5OXdk8RZY6tHGRF2oLQfVnzGYKMI0Zxc1NTgZ_2cxrvaQ-FlICtteO8qgdLqSLGkvCF09WllPjdFg20C5B-9jngM0hfyk-tPlPEzokqzEg_A_rIV4GBBmQwWs0-vta72_iVkWPgy-jqPJY9VA3zXFEQLYLn7tm7zg2C5o4',
    fallback: '/images/tcip-community-workshop.jpg',
    alt: 'Newcomer Settlement Advisory session in Toronto',
  },
  {
    tag: 'YOUTH STEM',
    badgeColor: 'bg-primary text-on-primary',
    heightClass: 'h-56',
    title: 'Youth Development & Tech Academy',
    description:
      'Digital media skills, coding workshops, creative production labs, and one-on-one professional mentorship for secondary school youth.',
    linkText: 'Youth Programs',
    href: '/programs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuC_7RVFoi93bMoaJgefaksDMdhPnyYxfzBcL4Zt6oJujq2g5jjOUqv34l85vdGG3ehfaE5VNcwHeJQ5QBEkDVIodyJUlM-7EF-FrTKWgYIFZxRLpjbEFZLuusOZwczoksgMMPlqiSXyO2EXrWH4u41xnkBs62_z3mNfsMjyeMMDilLv3qdIsLXc0MXYIptaazj25zsNZ7tYfwPZG6t2AKsadOx5nHnOPWDrQw_aHix7WaOq07Qsx-w4',
    fallback: '/images/tcip-youth-leadership.jpg',
    alt: 'Youth STEM and Leadership coding workshop in Toronto',
  },
  {
    tag: 'HEALTH & CARE',
    badgeColor: 'bg-tertiary-container text-on-tertiary-container',
    heightClass: 'h-48',
    title: 'Women & Family Health Advocacy',
    description:
      'Preventative dental screenings, maternal wellness circles, nutrition access, and civic rights advocacy forums for racialized families.',
    linkText: 'Health Clinics',
    href: '/programs',
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDb5iJpKC8QuCoByvRk8jPm5R44Gcxjh1xHXw28Yz9w3p43R-Lc-raS7lgRb_zYf11488Jr0Q05goHrRjevJ4UsxXOAqhuw-ab4SjW1y69hfMU5cWchy8roKYbxLSyngsd8Hz4T78lIR5sOvXmdmFLX3XxeTTUQYUz5Y4zHOq-1qJkd63uE9b3L4nDoSUHoG0hT_7cpos1GKShHt-DihGT9vFbDA1EghKIdZuCPWHR5fs0ZwEdKpYQv',
    fallback: '/images/tcip-hero-community.jpg',
    alt: 'Women, Family & Community Health wellness clinic in Scarborough',
  },
]

export default function ProgramsPreview() {
  return (
    <section className="w-full bg-surface-container-low py-space-3xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Header */}
        <div className="max-w-2xl mb-space-2xl">
          <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
            AREAS OF IMPACT
          </span>
          <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
            Tailored Programs That Build Self-Sufficiency
          </h2>
          <p className="font-body-md text-body-md text-on-surface-variant mt-2">
            From first arrival to leadership roles, our programs provide direct pathways to stability, economic power, and long-term security.
          </p>
        </div>

        {/* 4 Columns with Visual Hierarchy & Varied Card Heights */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-gutter-desktop">
          {programs.map((prog) => (
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
                  className="inline-flex items-center text-primary font-label-md text-label-md hover:underline gap-1 group"
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

      </div>
    </section>
  )
}
