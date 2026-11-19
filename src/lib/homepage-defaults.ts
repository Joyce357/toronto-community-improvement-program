// ─── Homepage Content: types + built-in defaults ────────────────────────────
// Pure data (no DB access). Defaults mirror the live homepage copy/images so
// that an empty or missing admin record renders safely without broken UI.

export interface HomepageSlide {
  imageUrl: string
  caption: string
}

export interface PeopleCardContent {
  heading: string
  subtitle: string
  description: string
  imageUrl: string
  imageAlt: string
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
    imageAlt: string
  }
  featuredProgramIds: string[]
  impact: {
    badge: string
    heading: string
    description: string
    imageUrl: string
    imageAlt: string
  }
  founder: {
    heading: string
    name: string
    bio: string
    imageUrl: string
    imageAlt: string
  }
  people: {
    volunteers: PeopleCardContent
    advocates: PeopleCardContent
  }
  galleryItemIds: string[]
  featuredStoryId: string
  featuredEventId: string
  /** Legacy combined field kept read-compatible with older saved records. */
  featuredEvent?: {
    type: '' | 'event' | 'story'
    id: string
  }
  cta: {
    heading: string
    text: string
    buttonLabel: string
    buttonHref: string
  }
  contact: {
    imageUrl: string
    imageAlt: string
    caption: string
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
    imageAlt: 'Toronto Community Improvement Program community photo',
  },
  featuredProgramIds: [],
  impact: {
    badge: 'GRASSROOTS INITIATIVE',
    heading: 'Community-Led Action',
    description:
      'Initiatives developed in dialogue with community members, youth, newcomers, and families living in Toronto neighborhoods.',
    imageUrl: '/images/tcip-hero-community.jpg',
    imageAlt: 'TCIP community participants and organizers in Toronto',
  },
  founder: {
    heading: 'Founder & Community Leadership',
    name: 'Adaikpoh Dumebi',
    bio:
      'Guided by lived experience and a commitment to advocacy, education, and community empowerment for Black immigrants, newcomers, and families in Toronto.',
    imageUrl: '/images/tcip-community-workshop.jpg',
    imageAlt: 'TCIP community leadership and founder engagement',
  },
  people: {
    volunteers: {
      heading: 'Volunteers & Peer Mentors',
      subtitle: 'Community Volunteers',
      description:
        'Dedicated community members and youth mentors who contribute their time, skills, and energy to support community workshops, events, and neighbor-to-neighbor aid.',
      imageUrl: '/images/tcip-hero-community.jpg',
      imageAlt: 'Community volunteers and peer mentors in Toronto',
    },
    advocates: {
      heading: 'Community Advocates & Supporters',
      subtitle: 'Local Collaborators',
      description:
        'Working hand-in-hand with neighborhood advocates, community organizations, and civic allies to build safe, welcoming spaces where everyone can thrive.',
      imageUrl: '/images/tcip-youth-leadership.jpg',
      imageAlt: 'Community advocates and partners collaborating',
    },
  },
  galleryItemIds: [],
  featuredStoryId: '',
  featuredEventId: '',
  cta: {
    heading: 'Be Part of the Change',
    text:
      'Whether giving your time as a volunteer, exploring community partnerships, or supporting our work through donations, your participation strengthens Toronto communities.',
    buttonLabel: '',
    buttonHref: '',
  },
  contact: {
    imageUrl: '/images/tcip-community-workshop.jpg',
    imageAlt: 'TCIP Community Workshop in Toronto',
    caption: 'Community Gathering • Toronto, ON',
  },
}
