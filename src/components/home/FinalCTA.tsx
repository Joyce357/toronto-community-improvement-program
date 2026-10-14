import Container from '@/components/ui/Container'
import Button from '@/components/ui/Button'

export default function FinalCTA() {
  return (
    <section
      className="section-py bg-tcip-stone border-t border-tcip-border relative overflow-hidden"
      aria-labelledby="final-cta-heading"
    >
      <Container>
        <div className="max-w-4xl mx-auto rounded-3xl bg-white border border-tcip-border p-8 sm:p-14 text-center relative overflow-hidden shadow-card">
          {/* Subtle decorative circles */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full bg-tcip-sage/50 pointer-events-none" aria-hidden="true" />
          <div className="absolute -bottom-12 -left-12 w-48 h-48 rounded-full bg-tcip-sage/50 pointer-events-none" aria-hidden="true" />

          {/* Eyebrow */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-tcip-offwhite border border-tcip-border text-tcip-charcoal text-xs font-bold uppercase tracking-wider mb-5 shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-tcip-green" />
            Together Across Toronto
            <span className="w-1.5 h-1.5 rounded-full bg-tcip-red" />
          </div>

          {/* Heading */}
          <h2
            id="final-cta-heading"
            className="text-tcip-charcoal text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight text-balance mb-4 tracking-tight"
          >
            Building a Stronger, More Inclusive <span className="text-tcip-green">Toronto</span> — Together
          </h2>

          {/* Supporting text */}
          <p className="text-tcip-muted text-sm sm:text-base leading-relaxed mb-8 max-w-xl mx-auto">
            Whether you volunteer your time, collaborate as a community partner, or support our programs,
            you help create direct pathways of opportunity for Toronto youth, newcomers, and families.
          </p>

          {/* CTAs */}
          <div className="flex flex-wrap justify-center items-center gap-3 sm:gap-4 relative z-10">
            <Button href="/get-involved" variant="primary" size="lg" className="font-bold shadow-xs">
              Get Involved Today
            </Button>
            <Button href="/contact" variant="secondary" size="lg" className="font-bold">
              Contact Our Team
            </Button>
          </div>

          {/* Organization Domain */}
          <p className="text-tcip-muted/70 text-xs mt-6 font-semibold tracking-wider uppercase">
            torontocip.com
          </p>
        </div>
      </Container>
    </section>
  )
}
