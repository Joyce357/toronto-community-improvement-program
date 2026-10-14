export default function TeamLeadership() {
  const team = [
    {
      badge: 'LEADERSHIP',
      role: 'Executive Director & Founder',
      name: 'Adaikpoh Dumebi',
      description:
        "Guiding TCIP's civic advocacy, grassroots expansion, institutional partnerships, and newcomer support frameworks across Ontario.",
      feature: 'Civic Advocacy & Strategic Governance',
      icon: 'verified',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuCNXS_xiAk999NklA4qDmi9jMm2pj-sxjyzkDkddmGW3nsw8utWB8jSkO-kZcEnotB9TsXBiJiiLuWMn06o84QPPB8jnT-B2MQXZg15pLKGaIY6yXLfszSUvBUJ1M1a-aaqSp2_KopYAWiPwnuMd_zKu47QvnO04plWz6Xiim0EPs_GL9BQxZjgoX3PRVPhQYM85sKRyILIacy-CQUMzvD2PyAAifF7XOmKwRUKD5R8yhhoxXAT37EK',
      fallback: '/images/tcip-community-workshop.jpg',
      alt: 'Executive Leadership of TCIP',
    },
    {
      badge: 'NAVIGATORS',
      role: 'Community Case Managers',
      name: 'Settlement & Intake Division',
      description:
        'Providing personalized guidance, emergency housing navigation, credential equivalency referrals, and culturally responsive settlement advocacy.',
      feature: 'Multilingual Intake & Housing Access',
      icon: 'support_agent',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuDeyo6IAM_I63VcMLKGMCD7BJJzETwJZajh1sMrQqr55FSO8Z_vgTeZkVrESPMcBHXFyEdgekEEYF5JqIlywLLKiEHDpX2xszz6n4CfTlY5FVhJRHCw4lWd_uEfU0jU4BCqnayyBRC1HlsYsI-pHEUC9E_hwe2x4j3NTZBY_10Bygm71b5ht_gaRCCw0fgHEX8fVbl4x3hicKjhZOe2U2ZM5MXRlBXBZbP_2RpGTCf43oV9t-DlpK-v',
      fallback: '/images/tcip-hero-community.jpg',
      alt: 'Community Case Managers and settlement advisors',
    },
    {
      badge: 'OUTREACH',
      role: 'Youth Mentors & Workers',
      name: 'Community Engagement Corps',
      description:
        'Facilitating technology bootcamps, job readiness labs, creative media workshops, and peer-to-peer mentorship circles across 18 GTA schools.',
      feature: 'Youth Leadership & Tech Labs',
      icon: 'hub',
      image:
        'https://lh3.googleusercontent.com/aida-public/AB6AXuAVb3u6v9GDBxCt0rv7muYDsKzTxRa5LX9e16-kAwJvsEuqO_K3k-1lIoT65BASld5BY0cNwBbrVmebS3LEmSrj_aQY0OBmaLXo80KUaIFhU4KNS3MxO6ZTMX3dG__VAaT4aV87PTfAU9HQpZXkB6Z4yOt5qcpk13aCzcUyhJv_giUZ4F1xk9BfX8kxfCbiHwXYyY4royo5WFBkArIYzoBTZcIl877BFfDe2lDst_6MkUKvupEcDPA-',
      fallback: '/images/tcip-youth-leadership.jpg',
      alt: 'Youth Mentors and outreach coordinators',
    },
  ]

  return (
    <section className="w-full bg-surface-bright py-space-3xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-4">
          <div>
            <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
              GRASSROOTS STEWARDSHIP
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Our Team &amp; Community Leadership
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            A dedicated team of professionals, outreach workers, and community advocates passionate about making a difference.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          {team.map((member) => (
            <div
              key={member.role}
              className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/30"
            >
              <div>
                <div className="w-full h-72 rounded-2xl overflow-hidden mb-6 relative bg-surface-container">
                  <img
                    src={member.image}
                    alt={member.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold text-primary shadow-xs">
                    {member.badge}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {member.role}
                </h3>
                <p className="font-label-md text-label-md text-primary mb-3">
                  {member.name}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {member.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-base text-primary">
                  {member.icon}
                </span>
                <span>{member.feature}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
