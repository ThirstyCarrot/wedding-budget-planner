// sample-data.js
// Pre-populated realistic wedding data to provide couples with an immediate, inspiring blueprint.

const DEFAULT_CATEGORIES = [
  { id: 'venue-catering', name: 'Venue & Catering', icon: '🏰', color: '#B38A58' },
  { id: 'photo-video', name: 'Photography & Video', icon: '📸', color: '#916A7E' },
  { id: 'attire-beauty', name: 'Attire, Rings & Beauty', icon: '👗', color: '#68827A' },
  { id: 'floral-decor', name: 'Floral & Decor', icon: '💐', color: '#889868' },
  { id: 'entertainment', name: 'Music & Entertainment', icon: '🎷', color: '#A06B52' },
  { id: 'stationery', name: 'Stationery & Invites', icon: '💌', color: '#768599' },
  { id: 'cake-dessert', name: 'Cake & Desserts', icon: '🎂', color: '#B57E70' },
  { id: 'officiant-legal', name: 'Officiant & Legal', icon: '📜', color: '#7C748C' },
  { id: 'favors-transport', name: 'Transport & Favors', icon: '🚗', color: '#647D8A' },
  { id: 'contingency', name: 'Honeymoon & Cushion', icon: '✈️', color: '#A3805B' }
];

if (typeof window !== 'undefined') {
  window.DEFAULT_CATEGORIES = DEFAULT_CATEGORIES;
}

const DEFAULT_WEDDING_DATA = {
  coupleNames: 'Sophia & Liam',
  weddingDate: '2027-06-19',
  hasTargetBudget: false,
  targetBudget: 36000,
  currentSavings: 12000,
  paycheckCadence: 'bi-weekly', // 'weekly', 'bi-weekly', 'semi-monthly', 'monthly'
  nextPayDate: '2026-10-09',
  plannedSavingsPerPaycheck: 1200,
  incomeMode: 'dual',
  partner1Name: 'Sophia',
  partner1Cadence: 'bi-weekly',
  partner1NextPayDate: '2026-10-09',
  partner1Savings: 650,
  partner2Name: 'Liam',
  partner2Cadence: 'semi-monthly',
  partner2NextPayDate: '2026-10-15',
  partner2Savings: 600,
  safetyCushion: 1000,
  expenses: [
    {
      id: 'exp-1',
      categoryId: 'venue-catering',
      name: 'Grand Garden Estate Venue Rental',
      vendor: 'Rosewood Gardens Estate',
      notes: 'Includes ceremony lawn, ballroom, tables, chairs, and bridal suite.',
      estimatedCost: 8000,
      actualCost: 8000,
      milestones: [
        { id: 'm-1-1', title: 'Booking Deposit (35%)', amount: 2800, dueDate: '2026-10-20', isPaid: true, paidDate: '2026-09-15' },
        { id: 'm-1-2', title: 'Mid-term Installment (35%)', amount: 2800, dueDate: '2027-02-15', isPaid: false, paidDate: null },
        { id: 'm-1-3', title: 'Final Balance (30%)', amount: 2400, dueDate: '2027-05-19', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-2',
      categoryId: 'venue-catering',
      name: 'Full Service Plated Catering & Bar',
      vendor: 'Artisan Culinary Co.',
      notes: '110 guests @ $75/head + cocktail hour appetizers & open bar.',
      estimatedCost: 10500,
      actualCost: 10250,
      milestones: [
        { id: 'm-2-1', title: 'Catering Retainer', amount: 2000, dueDate: '2026-11-05', isPaid: false, paidDate: null },
        { id: 'm-2-2', title: '50% Headcount Payment', amount: 4500, dueDate: '2027-03-20', isPaid: false, paidDate: null },
        { id: 'm-2-3', title: 'Final Headcount & Bar Balance', amount: 3750, dueDate: '2027-06-01', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-3',
      categoryId: 'photo-video',
      name: '8-Hour Photography & Highlight Film',
      vendor: 'Luminary Wedding Visuals',
      notes: 'Includes 2 lead photographers, drone coverage, 500+ edited gallery, and 6-minute film.',
      estimatedCost: 4500,
      actualCost: 4200,
      milestones: [
        { id: 'm-3-1', title: 'Date Reservation Deposit', amount: 1200, dueDate: '2026-10-30', isPaid: false, paidDate: null },
        { id: 'm-3-2', title: 'Final Photography Balance', amount: 3000, dueDate: '2027-05-28', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-4',
      categoryId: 'attire-beauty',
      name: 'Wedding Gown, Veil & Alterations',
      vendor: 'Blanc Atelier Bridal',
      notes: 'A-line lace gown with custom cathedral veil + 3 alteration sessions.',
      estimatedCost: 2400,
      actualCost: 2200,
      milestones: [
        { id: 'm-4-1', title: 'Gown Order Deposit (50%)', amount: 1000, dueDate: '2026-10-15', isPaid: true, paidDate: '2026-09-10' },
        { id: 'm-4-2', title: 'Final Fitting & Delivery', amount: 1200, dueDate: '2027-04-15', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-5',
      categoryId: 'attire-beauty',
      name: 'Groom Custom Tuxedo & Shoes',
      vendor: 'Indochino / Allen Edmonds',
      notes: 'Midnight navy wool tuxedo + tailored shirt and leather oxfords.',
      estimatedCost: 750,
      actualCost: 680,
      milestones: [
        { id: 'm-5-1', title: 'Suit Purchase & Fitting', amount: 680, dueDate: '2027-04-01', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-6',
      categoryId: 'attire-beauty',
      name: 'Wedding Bands (Both)',
      vendor: 'Brilliant Earth',
      notes: '14k yellow gold comfort band & diamond eternity band.',
      estimatedCost: 1800,
      actualCost: 1750,
      milestones: [
        { id: 'm-6-1', title: 'Ring Fabrication & Sizing', amount: 1750, dueDate: '2027-03-01', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-7',
      categoryId: 'floral-decor',
      name: 'Ceremony Arch, Bouquets & Tablescapes',
      vendor: 'Wildflower Botanical Studio',
      notes: 'Lush greenery, garden roses, 8 bridesmaid bouquets, 10 table centerpieces.',
      estimatedCost: 3200,
      actualCost: 3100,
      milestones: [
        { id: 'm-7-1', title: 'Florist Date Retainer (25%)', amount: 775, dueDate: '2026-11-25', isPaid: false, paidDate: null },
        { id: 'm-7-2', title: 'Final Floral Balance', amount: 2325, dueDate: '2027-05-15', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-8',
      categoryId: 'entertainment',
      name: 'Live Ceremony Musician & Reception DJ',
      vendor: 'Cadence Entertainment Collective',
      notes: 'Acoustic guitar for aisle walk + cocktail & 5-hour high energy reception DJ with uplighting.',
      estimatedCost: 2200,
      actualCost: 2100,
      milestones: [
        { id: 'm-8-1', title: 'DJ Booking Deposit', amount: 500, dueDate: '2026-11-15', isPaid: false, paidDate: null },
        { id: 'm-8-2', title: 'Final DJ Balance', amount: 1600, dueDate: '2027-06-05', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-9',
      categoryId: 'stationery',
      name: 'Invitations, Save the Dates & Day-of Paper',
      vendor: 'Minted & Letterpress Co.',
      notes: 'Gold foil invitations, wax seal detail, menu cards, seating chart board.',
      estimatedCost: 1100,
      actualCost: 980,
      milestones: [
        { id: 'm-9-1', title: 'Save the Dates & Printing', amount: 480, dueDate: '2026-11-01', isPaid: false, paidDate: null },
        { id: 'm-9-2', title: 'Invitations & Day-of Signs', amount: 500, dueDate: '2027-02-01', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-10',
      categoryId: 'attire-beauty',
      name: 'Bridal Hair & Makeup Artist',
      vendor: 'Glow Bridal Artistry',
      notes: 'Bride hair + airbrush makeup including trial session + 3 bridesmaids.',
      estimatedCost: 1200,
      actualCost: 1150,
      milestones: [
        { id: 'm-10-1', title: 'Trial & Deposit', amount: 350, dueDate: '2027-01-20', isPaid: false, paidDate: null },
        { id: 'm-10-2', title: 'Day-of Beauty Balance', amount: 800, dueDate: '2027-06-10', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-11',
      categoryId: 'cake-dessert',
      name: 'Tiered Wedding Cake & Macaron Tower',
      vendor: 'Sweet Violet Patisserie',
      notes: '3-tier vanilla almond cake with raspberry filling + mini dessert bar.',
      estimatedCost: 850,
      actualCost: 820,
      milestones: [
        { id: 'm-11-1', title: 'Tasting & Cake Deposit', amount: 250, dueDate: '2027-02-20', isPaid: false, paidDate: null },
        { id: 'm-11-2', title: 'Final Cake Balance', amount: 570, dueDate: '2027-06-01', isPaid: false, paidDate: null }
      ]
    },
    {
      id: 'exp-12',
      categoryId: 'officiant-legal',
      name: 'Ceremony Officiant & Marriage License',
      vendor: 'Rev. Daniel Bennett + County Clerk',
      notes: 'Custom ceremony script, rehearsal coordination, county license fees.',
      estimatedCost: 600,
      actualCost: 550,
      milestones: [
        { id: 'm-12-1', title: 'Officiant Retainer & License Fee', amount: 550, dueDate: '2027-05-01', isPaid: false, paidDate: null }
      ]
    }
  ]
};

if (typeof window !== 'undefined') {
  window.DEFAULT_WEDDING_DATA = DEFAULT_WEDDING_DATA;
}
