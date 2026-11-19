// ─── Homepage Content: types + built-in defaults ────────────────────────────
// Pure data (no DB access). Defaults mirror the current live homepage copy so
// that an empty / missing admin record renders exactly what visitors see today.

export interface HomepageSlide {
  imageUrl: string
  caption: string
}

export interface HomepageContent {
  hero: {
    heading: string
    text: string
    primaryLabel: string
    primaryHref: string
    secondaryLabel: string
    secondaryHref: string
    slides: HomepageSlide[]
  }
  about: {
    heading: string
    summary: string
    imageUrl: string
  }
  featuredProgramIds: string[]
  featuredEvent: {
    type: '' | 'event' | 'story'
    id: string
  }
  founder: {
    heading: string
    name: string
    bio: string
    imageUrl: string
  }
  galleryItemIds: string[]
  cta: {
    heading: string
    text: string
    buttonLabel: string
    buttonHref: string
  }
}

export const DEFAULT_HERO_HEADING =
  'Creating Opportunity. Strengthening Belonging. Empowering Communities.'

export const DEFAULT_HOMEPAGE: HomepageContent = {
  hero: {
    heading: DEFAULT_HERO_HEADING,
    text:
      'Toronto Community Improvement Program: Empowering Communities for Change. Supporting Black immigrants, newcomers, youth, women, families, and job seekers through advocacy, education, and community partnerships.',
    primaryLabel: 'Explore Our Programs',
    primaryHref: '/programs',
    secondaryLabel: 'Get Involved',
    secondaryHref: '/get-involved',
    slides: [],
  },
  about: {
    heading: 'Building Communities Where Everyone Can Thrive',
    summary:
      'Founded in 2020 by Adaikpoh Dumebi, who recognized the critical need for an organization dedicated to helping immigrants of Black descent navigate systemic barriers. Since then, TCIP has worked to empower individuals and families across the Greater Toronto Area through dedicated community programs and advocacy.',
    imageUrl: '/images/tcip-youth-leadership.jpg',
  },
  featuredProgramIds: [],
  featuredEvent: { type: '', id: '' },
  founder: {
    heading: 'Founder & Community Leadership',
    name: 'Adaikpoh Dumebi',
    bio:
      'Guided by lived experience and a commitment to advocacy, education, and community empowerment for Black immigrants, newcomers, and families in Toronto.',
    imageUrl: '/images/tcip-community-workshop.jpg',
  },
  galleryItemIds: [],
  cta: {
    heading: 'Be Part of the Change',
    text:
      'Whether giving your time as a volunteer, exploring community partnerships, or supporting our work through donations, your participation strengthens Toronto communities.',
    buttonLabel: '',
    buttonHref: '',
  },
}

