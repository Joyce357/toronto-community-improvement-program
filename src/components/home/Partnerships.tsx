export default function Partnerships() {
  const partners = [
    {
      icon: 'location_city',
      name: 'City of Toronto',
      type: 'Civic Programs',
    },
    {
      icon: 'handshake',
      name: 'United Way GTA',
      type: 'Community Partner',
    },
    {
      icon: 'account_balance',
      name: 'Toronto Foundation',
      type: 'Grant Alliance',
    },
    {
      icon: 'health_and_safety',
      name: 'TAIBU CHC',
      type: 'Health Network',
    },
    {
      icon: 'diversity_1',
      name: 'Ontario Trillium',
      type: 'Foundation',
    },
    {
      icon: 'rocket_launch',
      name: 'GTA Youth Net',
      type: 'STEM Pipeline',
    },
  ]

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
          Proudly collaborating with municipal organizations, healthcare alliances, philanthropic foundations, and civic leaders.
        </p>

        {/* 6 Clean Partner Modules */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-gutter items-center">
          {partners.map((partner) => (
            <div
              key={partner.name}
              className="bg-surface-container-lowest p-6 rounded-2xl shadow-sm flex flex-col items-center justify-center hover:shadow-md transition-shadow group border border-outline-variant/30"
            >
              <span className="material-symbols-outlined text-3xl text-on-surface-variant group-hover:text-primary transition-colors">
                {partner.icon}
              </span>
              <span className="font-label-md text-label-md font-bold text-on-surface mt-2 text-center">
                {partner.name}
              </span>
              <span className="font-label-sm text-label-sm text-on-surface-variant text-center">
                {partner.type}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
