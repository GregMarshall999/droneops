import type { Service, Drone } from '../types';

export const SERVICES: Service[] = [
  {
    id: 'events',
    title: 'Events & Festivals',
    description: 'Cinematic live coverage for large-scale festivals, concerts, and private events.',
    icon: 'festival',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAWNH29XxKIbKmlqk5s4xPAsMDCdh-YC_vLX7mvbrr9FvqpGeHMXl3JBRE3D_1MRxo1c14cwt0HKA46CdoicZPsurQaTX1lYCvDFdudJUkw9E5ENtaa6zGFXuq3wOX4AYj6rlSGIvq76VdvcO8HonSjknheL3mJdz2QmQcm-6kuzoyQxTBQE-bXl4DmtxtYyk_6IPaND_T8kJzOb2Uh3pg4zPVG243uf2rmEHgqM3MLGcQefHqzBWs-h8_fyrpgwxqhi5yErdHS_3-6'
  },
  {
    id: 'real-estate',
    title: 'Real Estate',
    description: '4K aerial tours and photography for premium residential and commercial listings.',
    icon: 'home_work',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC8qkIj5NLAROV5_iJw4YIl4Jcwlwrew53ZF0n-T213p5AdFQ_RoFObyx0qJFUuQC3jdew0vOozl184z85VYkLV5YYqircflGM1gPG0eWmvRbAVjcAe5WqtE-DKhtN4pZaaAFU1Pt5GuvhmnqZgNSitpaP0vZxCc6uF-X8HsBpFuALtbuU7LLY8yXAEkRegInHIvsT04OwFf4zFYJV0_vgPy6RfBnPBNpLutWNTK4llXZQGavA0zBw28vTAAnz2dQrfFH-atrSEMiDG'
  },
  {
    id: '3d-scans',
    title: '3D Scans',
    description: 'High-precision photogrammetry, LIDAR, and architectural mapping for surveying.',
    icon: 'view_in_ar',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBSOPT35GsoVLxyx7T7V9FmDy-KR-VFQgYXUS5pHE2C-BsZSkuamx5RYaTHegn8VM4w65w4WWVhFZCgyLRIDaJPXM5iSRdhtFDRDk9Np_GPSIhQSJtdTDAg3sA-u2JbAzGTc1ihqOm_HZHWQIcrjiPABDhX9RuJEd0KMKrzbvRSbF_dajuk43PlsCPmrNQ-Ie0GwJMJgRwnhEKyMxaUd7mQpKLgHhWhKs9gSuyr0g9o7Ap0DI5R4ZEUl1sN34QTHir_ufXcZRqGQ2oS'
  },
  {
    id: 'fpv',
    title: 'Sports FPV',
    description: 'High-speed FPV tracking for motorsports, cycling, and dynamic action shots.',
    icon: 'directions_bike',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA9RIKUnw03xJ-6HeuppaWp432Xh6_Vcde9O71IApplWkaIwrE3offs61V0_F2yJvbEpw9lR_G8wB5E4vtsqZXO_XzgRxuk4K81rbnUHoy-_0M4ffq50KQOgEaiSlMsFVYIA1fmo9xDVXVJ0Y1flMCDHIdMVcUJmhngrPReVTqZwbtsjL5z6t_ZutZolxMCdZY3kEMS77EVepFUVPgAolEqYs1lnMgNGHtoiSO4V-249_rcQiAzvEZ81RswUtY3WnuhntXfLPdATwJY'
  },
  {
    id: 'social',
    title: 'Social Media',
    description: 'Optimized vertical 9:16 content for TikTok, Reels, and high-engagement social campaigns.',
    icon: 'smartphone',
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAm2Ki2vZdvqgGPnVRKj65iplJlu5MqM5iEQTHSNbb0Unwbm_EcWhQAf81Et0nRFQESUpoPEDpGf7PWcMrCTLYpZYZlihzddPpYIl0b055H2GWMxN-n-mmD8lWmU_98m396MqJVzVcyJszWntmPAYBFzq_t-stZytK_YImrdHuqQkKd0tAQZCmQurIsY7rszptN-e-R9HjnxEmWleXlTeRWmPd5g4fRwbhhIftmgsnjOygl1to-p1Dx6mOiIRzyoi9Djt9-gfASiVtX'
  }
];

export const FLEET: Drone[] = [
  {
    id: 'mavic-3',
    name: 'Mavic 3 Cine',
    category: 'CINEMA',
    description: 'Compact 5.1K Apple ProRes powerhouse for versatile filmmaking.',
    price: 450,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBQo7HOeJvXhzE03-i-3-oE2N3u0Cm0lazM2FQuf3NmdSYEk_BPtGixQU41H_TTfGdU8TonrbOv4nja8SL2GcO_HBUyubUEzcCFOH2whExo0if0EaVpog3udPP0sFbXOlVUY6jqtQx-PtULwHMu5hsOKcEzhohBcXVbSRSq3miFbgSokl5DscVUY5I6LvCQSkTIN0CxNtK7TrAH0dY24qV-Bb4XcftP66hwSOYIVC7QvWlu04hugWLNWMLKsq0g07zrDhbebwS9Fnvo',
    stats: [
      { label: 'Flight Time', value: '46 mins', percentage: 85 },
      { label: 'Resolution', value: '5.1K / 50fps', percentage: 90 }
    ]
  },
  {
    id: 'fpv-x8',
    name: 'Custom FPV X8',
    category: 'SPEED',
    description: 'Heavy-lift cinema FPV rig capable of carrying RED Komodo cameras at 90mph.',
    price: 600,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuA0PRnGQ-gXV8mdK9ZdZ_wVtt51tTn5b3CZvN_O9Jeomd0zsGLav9p38Hk4yNr-FCmopzEUPZhe72-I8joJIMjjybFPuntZq-HqbEkmas7F6kDMXpkg-qfzSYnf8Oe6IyhIT-Vg3-Sx7tLZZxF4hNg6kG4Twgz4C-OMzjGP9osQp-EAuHG4HGmYFgw-kHSJNKnAlJIWDm7jbfLqyoiyiLHQ4aC4LIUBe0mF6Yp5NgpTEwH8mGEUgJ0uqDz67y_AlW9-V99lw7BsZKCU',
    stats: [
      { label: 'Speed', value: '100 mph', percentage: 98 },
      { label: 'Agility', value: 'Extreme', percentage: 100 }
    ]
  },
  {
    id: 'matrice-300',
    name: 'Matrice 300 RTK',
    category: 'SURVEY',
    description: 'The industry standard for inspection, mapping, and photogrammetry.',
    price: 850,
    imageUrl: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAGZ9PH8EgfTsUeVi5Tc0-TLHvpIbQlUWnjicnzLUKGSS64lSWniSIPO6pC6jE8_Yflv9_Ejq6fRGy2QfZTnzNcH-dKfiQ4PhP4h46DMpjAuvv5JeVJzBuYX9NK1vPxTa2wpw7ZDnmzrIJ88U5wFo0lAG2pQgxqzhU-p4XxtAnxJheWKkTl-z1vzXXTkBrFWIvKegHIe5PTQzFzNYve5Jpy8H_zy7Pi0K_ZWmnAiDApZygIN187llg0_txNyN3qR-fg_AeRSIAe2O1S',
    stats: [
      { label: 'Flight Time', value: '55 mins', percentage: 95 },
      { label: 'Payload', value: '2.7 kg', percentage: 80 }
    ]
  }
];
