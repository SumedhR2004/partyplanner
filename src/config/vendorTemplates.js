/**
 * @fileoverview Default vendor checklist templates per event type.
 *
 * Each template is an array of checklist items with a stable id,
 * display label, and optional category grouping.
 * Items start unchecked; state is managed separately in localStorage.
 */

/**
 * @typedef {Object} ChecklistItem
 * @property {string} id    - Stable unique ID for localStorage keying.
 * @property {string} label - Display text for the checklist item.
 * @property {string} group - Logical group / category heading.
 */

/**
 * Vendor checklist templates for each supported event type.
 * @type {Record<string, ChecklistItem[]>}
 */
export const VENDOR_TEMPLATES = {
  wedding: [
    // Venue & Logistics
    { id: 'w-venue-booked', label: 'Book ceremony venue', group: 'Venue & Logistics' },
    { id: 'w-reception-booked', label: 'Book reception venue', group: 'Venue & Logistics' },
    { id: 'w-parking', label: 'Arrange parking / valet', group: 'Venue & Logistics' },
    { id: 'w-transport', label: 'Book guest transportation', group: 'Venue & Logistics' },
    // Catering
    { id: 'w-caterer', label: 'Hire caterer & confirm menu', group: 'Catering' },
    { id: 'w-cake', label: 'Order wedding cake', group: 'Catering' },
    { id: 'w-bar', label: 'Arrange beverages & bar service', group: 'Catering' },
    // Décor & Flowers
    { id: 'w-florist', label: 'Book florist & confirm arrangements', group: 'Décor' },
    { id: 'w-decorator', label: 'Hire decorator', group: 'Décor' },
    { id: 'w-lighting', label: 'Arrange lighting design', group: 'Décor' },
    // Entertainment
    { id: 'w-dj', label: 'Book DJ or live band', group: 'Entertainment' },
    { id: 'w-mc', label: 'Confirm MC / emcee', group: 'Entertainment' },
    // Photography
    { id: 'w-photographer', label: 'Book photographer', group: 'Photography' },
    { id: 'w-videographer', label: 'Book videographer', group: 'Photography' },
    // Attire
    { id: 'w-bridal', label: 'Bridal outfit finalised', group: 'Attire' },
    { id: 'w-groom', label: "Groom's outfit finalised", group: 'Attire' },
    // Admin
    { id: 'w-invites', label: 'Send invitations', group: 'Administration' },
    { id: 'w-rsvp', label: 'Collect RSVPs', group: 'Administration' },
    { id: 'w-insurance', label: 'Get event insurance', group: 'Administration' },
  ],

  birthday: [
    { id: 'b-venue', label: 'Book venue or confirm home setup', group: 'Venue' },
    { id: 'b-caterer', label: 'Arrange catering or food order', group: 'Catering' },
    { id: 'b-cake', label: 'Order birthday cake', group: 'Catering' },
    { id: 'b-beverages', label: 'Arrange beverages', group: 'Catering' },
    { id: 'b-decorator', label: 'Hire decorator or DIY décor plan', group: 'Décor' },
    { id: 'b-balloons', label: 'Order balloons & theme items', group: 'Décor' },
    { id: 'b-entertainment', label: 'Book entertainment (DJ / games / magician)', group: 'Entertainment' },
    { id: 'b-photographer', label: 'Arrange photographer or photo booth', group: 'Photography' },
    { id: 'b-invites', label: 'Send invitations (digital or physical)', group: 'Administration' },
    { id: 'b-favours', label: 'Arrange party favours / return gifts', group: 'Extras' },
    { id: 'b-playlist', label: 'Curate music playlist', group: 'Entertainment' },
    { id: 'b-activities', label: 'Plan activities / games', group: 'Entertainment' },
  ],

  community: [
    { id: 'c-venue', label: 'Book community hall or outdoor space', group: 'Venue & Permits' },
    { id: 'c-permit', label: 'Obtain necessary permits / licences', group: 'Venue & Permits' },
    { id: 'c-safety', label: 'Arrange security & first-aid', group: 'Venue & Permits' },
    { id: 'c-catering', label: 'Arrange food stalls or catering', group: 'Catering' },
    { id: 'c-water', label: 'Arrange water & sanitation facilities', group: 'Catering' },
    { id: 'c-stage', label: 'Set up stage & sound system', group: 'Entertainment' },
    { id: 'c-performers', label: 'Book performers or speakers', group: 'Entertainment' },
    { id: 'c-volunteers', label: 'Recruit & brief volunteers', group: 'Operations' },
    { id: 'c-signage', label: 'Create and place signage', group: 'Operations' },
    { id: 'c-promotion', label: 'Promote event (social media / flyers)', group: 'Marketing' },
    { id: 'c-photographer', label: 'Arrange event photographer', group: 'Photography' },
    { id: 'c-cleanup', label: 'Plan post-event cleanup crew', group: 'Operations' },
    { id: 'c-feedback', label: 'Prepare attendee feedback forms', group: 'Operations' },
  ],
};
