import Container from '@/components/ui/Container'
import SectionHeading from '@/components/ui/SectionHeading'

const pillars = [
  {
    number: '01',
    title: 'Rooted in Local Neighborhood Realities',
    description:
      'We tailor our programs directly to the lived experiences and needs of Toronto communities, ensuring relevant, responsive, and respectful initiatives.',
  },
  {
    number: '02',
    title: 'Practical Skills & Immediate Application',
    description:
      'From resume workshops to digital skills and youth mentorship, our programs focus on actionable, real-world tools that unlock tangible opportunities.',
  },
  {
    number: '03',
    title: 'Accountable, Transparent & Funder-Ready',
    description:
      'We hold ourselves to rigorous standards of organizational integrity, financial stewardship, and measurable community outcomes.',
  },
  {
    number: '04',
    title: 'Sustainable Generational Pathways',
    description:
      'By empowering youth and supporting families, we foster lifelong leadership habits that uplift entire neighborhoods for generations to come.',
  },
]

export default function WhyBridge() {
  return (
    <section className="section-py bg-white dark:bg-dark-bg border-y border-border-soft dark:border-dark-border transition-colors duration-200" aria-labelledby="why-tcip-heading">
      <Container>

        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <SectionHeading
            align="center"
            eyebrow="Why TCIP"
            title="A Community-First Approach to Lasting Change"
            subtitle="We believe meaningful improvement happens when residents, youth, and newcomers are equipped with direct resources, mentorship, and opportunities to lead."
            id="why-tcip-heading"
          />
        </div>

        {/* Pillars grid */}
        <div className="grid sm:grid-cols-2 gap-5 sm:gap-6">
          {pillars.map((pillar) => (
            <div
              key={pillar.number}
              className="relative p-6 sm:p-7 rounded-2xl bg-brand-cream dark:bg-dark-card border border-border-soft dark:border-dark-border
                         hover:border-brand-green hover:shadow-card transition-all duration-200 group"
            >
              {/* Number watermark */}
              <span className="text-5xl sm:text-6xl font-black text-brand-black/10 dark:text-white/10 absolute top-5 right-6 leading-none select-none group-hover:text-brand-green/20 transition-colors">
                {pillar.number}
              </span>

              {/* Content */}
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <span className="h-1 w-6 rounded-full bg-brand-green" />
                  <span className="h-1 w-1 rounded-full bg-brand-red" />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-brand-black dark:text-dark-text-primary mb-2">
                  {pillar.title}
                </h3>
                <p className="text-text-secondary dark:text-dark-text-secondary text-xs sm:text-sm leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </div>
          ))}
        </div>

      </Container>
    </section>
  )
}
