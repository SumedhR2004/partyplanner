/**
 * @fileoverview Static fallback ideas used when the AI service is unavailable.
 * Ideas are curated per event type across 5 categories.
 */

/**
 * @typedef {Object} FallbackIdea
 * @property {string} category    - Idea category (matches AI schema).
 * @property {string} title       - Short idea title.
 * @property {string} description - Actionable idea description (≤ 80 words).
 */

/**
 * Fallback ideas library per event type.
 * @type {Record<string, FallbackIdea[]>}
 */
const FALLBACK_IDEAS_LIBRARY = {
  wedding: [
    {
      category: 'Decor',
      title: 'Marigold & Fairy Light Canopy',
      description:
        'Create a stunning entrance with a canopy of marigold garlands interwoven with warm fairy lights. Add terracotta pots filled with seasonal flowers along the aisle for a vibrant Indian aesthetic that photographs beautifully and is very cost-effective.',
    },
    {
      category: 'Food & Drinks',
      title: 'Live Street Food Stations',
      description:
        'Set up live chaat, dosa, and pani puri stations instead of a plated starter course. Guests love the interactive experience and it significantly reduces per-plate catering costs. Add a signature mocktail bar with seasonal fruit blends.',
    },
    {
      category: 'Activities',
      title: 'Henna & Photo Booth Corner',
      description:
        'Create a dedicated mehndi corner where guests can get mini henna designs as a keepsake. Pair it with a DIY photo booth stocked with fun props related to your theme. Both activities keep guests engaged during cocktail hour.',
    },
    {
      category: 'Budget-Saving Tips',
      title: 'Hire a Culinary Institute',
      description:
        'Contact local culinary institutes for catering — student chefs supervised by instructors can provide excellent food at 40–60% lower cost than established caterers. You get fresh, quality food while supporting students.',
    },
    {
      category: 'Local Experience',
      title: 'Folk Music Welcome',
      description:
        'Hire local folk musicians to welcome guests with traditional music as they arrive. This creates a warm, culturally rich atmosphere unique to your city and costs far less than a full band, typically ₹5,000–₹15,000 for a 2-hour set.',
    },
  ],

  birthday: [
    {
      category: 'Decor',
      title: 'Balloon Garland Backdrop',
      description:
        'Create an Instagram-worthy balloon garland in your chosen color palette as the main backdrop. Organic balloon arches are DIY-friendly, take 2–3 hours, and cost under ₹3,000 for materials. Add a neon LED sign with a birthday message for extra impact.',
    },
    {
      category: 'Food & Drinks',
      title: 'DIY Taco / Chaat Bar',
      description:
        'Set up a self-serve taco or chaat bar where guests assemble their own plates. Prepare the base ingredients in bulk and provide an assortment of toppings. This interactive format reduces waste, is budget-friendly, and is a crowd-pleaser for all ages.',
    },
    {
      category: 'Activities',
      title: 'Memory Jar Station',
      description:
        "Set up a decorated jar with blank cards where guests write a favorite memory or birthday wish. This doubles as a heartfelt keepsake for the birthday person and keeps guests engaged without extra cost. Add colored pens and stickers for a fun touch.",
    },
    {
      category: 'Budget-Saving Tips',
      title: 'Book a Home Baker',
      description:
        'Commission a home baker for the cake instead of a commercial bakery — you often get more personalised designs at 30–50% lower cost. Search local Facebook groups or Instagram for home bakers in your city with verified reviews.',
    },
    {
      category: 'Local Experience',
      title: 'Treasure Hunt Around the Neighborhood',
      description:
        'Design a neighborhood treasure hunt with clues tied to local landmarks. This is completely free to run, creates lasting memories, and can be themed to match the party vibe. Works brilliantly for milestone birthdays (18, 21, 30) as a nostalgic adventure.',
    },
  ],

  community: [
    {
      category: 'Decor',
      title: 'Recycled Material Installations',
      description:
        'Create eye-catching décor using recycled materials — painted tin cans as planters, banner bunting from old sarees, paper lanterns from newspaper. This reduces cost significantly, is sustainable, and can be a community craft activity in the lead-up to the event.',
    },
    {
      category: 'Food & Drinks',
      title: 'Community Potluck Stations',
      description:
        'Invite community members to contribute signature dishes for a potluck-style food area. This dramatically reduces catering costs, showcases local culinary diversity, and creates a sense of ownership and participation. Provide labelling cards for dish names and allergen info.',
    },
    {
      category: 'Activities',
      title: 'Local Talent Showcase',
      description:
        'Open a 5-minute performance slot for community members — singers, dancers, comedians, poets. This fills the entertainment schedule at zero cost, discovers local talent, and makes the event deeply personal to the community. Assign a coordinator for auditions.',
    },
    {
      category: 'Budget-Saving Tips',
      title: 'Partner with Local Businesses',
      description:
        'Approach local businesses for in-kind sponsorships — a bakery provides snacks in exchange for a banner at the event. Approach 10–15 businesses with a simple one-page sponsorship proposal. Even small contributions add up and can cover 20–30% of total costs.',
    },
    {
      category: 'Local Experience',
      title: 'Living History Corner',
      description:
        "Invite elderly community members to share stories and memories from the neighborhood's past. Set up a comfortable, decorated corner with recorded interviews playing on a screen. This is free, deeply meaningful, and creates a tangible connection between generations.",
    },
  ],
};

/**
 * Get fallback ideas for a given event type.
 * Always returns an array of exactly 5 ideas.
 * Falls back to 'birthday' ideas if the event type is unknown.
 *
 * @param {string} eventType - One of 'wedding', 'birthday', 'community'.
 * @returns {FallbackIdea[]} Array of 5 fallback idea objects.
 */
export function getFallbackIdeas(eventType) {
  return FALLBACK_IDEAS_LIBRARY[eventType] || FALLBACK_IDEAS_LIBRARY.birthday;
}
