export default function TeamLeadership() {
  const peoplePillars = [
    {
      badge: 'LEADERSHIP',
      role: 'Founder & Community Leadership',
      name: 'Adaikpoh Dumebi, Founder',
      description:
        'Guided by lived experience and a commitment to advocacy, education, and community empowerment for Black immigrants, newcomers, and families in Toronto.',
      feature: 'Community Stewardship & Vision',
      icon: 'verified',
      image: '/images/tcip-community-workshop.jpg',
      alt: 'TCIP community leadership and founder engagement',
    },
    {
      badge: 'VOLUNTEERS',
      role: 'Volunteers & Peer Mentors',
      name: 'Community Volunteers',
      description:
        'Dedicated community members and youth mentors who contribute their time, skills, and energy to support community workshops, events, and neighbor-to-neighbor aid.',
      feature: 'Grassroots Community Action',
      icon: 'volunteer_activism',
      image: '/images/tcip-hero-community.jpg',
      alt: 'Community volunteers and peer mentors in Toronto',
    },
    {
      badge: 'COLLABORATORS',
      role: 'Community Advocates & Supporters',
      name: 'Local Collaborators',
      description:
        'Working hand-in-hand with neighborhood advocates, community organizations, and civic allies to build safe, welcoming spaces where everyone can thrive.',
      feature: 'Civic Connection & Belonging',
      icon: 'groups',
      image: '/images/tcip-youth-leadership.jpg',
      alt: 'Community advocates and partners collaborating',
    },
  ]

  return (
    <section className="w-full bg-surface-bright py-space-3xl border-b border-outline-variant/30">
      <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-space-2xl gap-4">
          <div>
            <span className="font-eyebrow-bold text-eyebrow-bold text-primary uppercase tracking-widest block mb-2">
              COMMUNITY ENGAGEMENT
            </span>
            <h2 className="font-headline-lg text-headline-lg-mobile md:text-headline-lg text-on-surface">
              Our People
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            A committed community of organizers, volunteers, and local advocates working together to strengthen Toronto neighborhoods.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter-desktop">
          {peoplePillars.map((pillar) => (
            <div
              key={pillar.role}
              className="bg-surface-container-low rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-md transition-shadow group border border-outline-variant/30"
            >
              <div>
                <div className="w-full h-72 rounded-2xl overflow-hidden mb-6 relative bg-surface-container">
                  <img
                    src={pillar.image}
                    alt={pillar.alt}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <span className="absolute top-4 left-4 bg-surface-container-lowest/95 backdrop-blur-md px-3 py-1 rounded-full font-eyebrow-bold text-eyebrow-bold text-primary shadow-xs">
                    {pillar.badge}
                  </span>
                </div>
                <h3 className="font-headline-sm text-headline-sm text-on-surface">
                  {pillar.role}
                </h3>
                <p className="font-label-md text-label-md text-primary mb-3 font-semibold">
                  {pillar.name}
                </p>
                <p className="font-body-sm text-body-sm text-on-surface-variant leading-relaxed">
                  {pillar.description}
                </p>
              </div>

              <div className="pt-6 mt-6 border-t border-outline-variant/30 flex items-center gap-2 text-on-surface-variant font-label-sm text-label-sm">
                <span className="material-symbols-outlined text-base text-primary">
                  {pillar.icon}
                </span>
                <span>{pillar.feature}</span>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}
