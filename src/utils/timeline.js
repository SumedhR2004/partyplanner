/**
 * @fileoverview Pure timeline generation utilities.
 * No React imports. Fully unit-testable.
 */

/**
 * @typedef {Object} TimelineTask
 * @property {string}  week       - Human label like "12 weeks before".
 * @property {Date}    date       - Absolute calendar date for the task.
 * @property {string}  task       - Task description.
 * @property {boolean} overdue    - True if the task date is in the past.
 * @property {boolean} compressed - True if added due to short-notice compression.
 */

/** Number of weeks before event at which we consider it "short notice". */
const SHORT_NOTICE_WEEKS = 4;

/**
 * Milestone definitions: weeks before event → task description.
 * Used as the base schedule; compressed if event is soon.
 *
 * @type {Array<{ weeksOut: number, task: string }>}
 */
const BASE_MILESTONES = [
  { weeksOut: 12, task: 'Set budget and event date; start venue research' },
  { weeksOut: 10, task: 'Book venue and confirm capacity' },
  { weeksOut: 8, task: 'Send save-the-dates; shortlist caterers' },
  { weeksOut: 7, task: 'Book caterer and confirm menu options' },
  { weeksOut: 6, task: 'Book photographer and entertainment' },
  { weeksOut: 5, task: 'Send formal invitations; finalise décor theme' },
  { weeksOut: 4, task: 'Book decorator; finalise vendor contracts' },
  { weeksOut: 3, task: 'Follow up on RSVPs; arrange transportation' },
  { weeksOut: 2, task: 'Confirm all vendors; create day-of timeline' },
  { weeksOut: 1, task: 'Final headcount; brief all vendors' },
  { weeksOut: 0, task: 'Event day — enjoy the celebration! 🎉' },
];

/**
 * Per-event-type specialised tasks merged into the base schedule.
 * @type {Record<string, Array<{ weeksOut: number, task: string }>>}
 */
const EVENT_SPECIFIC_TASKS = {
  wedding: [
    { weeksOut: 9, task: 'Begin wedding outfit shopping and fittings' },
    { weeksOut: 3, task: 'Wedding rehearsal and rehearsal dinner' },
  ],
  birthday: [
    { weeksOut: 6, task: 'Order birthday cake and party supplies' },
    { weeksOut: 2, task: 'Plan party games and entertainment schedule' },
  ],
  community: [
    { weeksOut: 10, task: 'Apply for permits and licences' },
    { weeksOut: 4, task: 'Launch event promotion and social media campaign' },
    { weeksOut: 1, task: 'Brief volunteers and security personnel' },
  ],
};

/**
 * Add days to a date without mutating the original.
 *
 * @param {Date} date
 * @param {number} days
 * @returns {Date}
 */
function addDays(date, days) {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
}

/**
 * Format a date as a human-readable string (e.g. "Mon, 15 Jan 2025").
 *
 * @param {Date} date
 * @returns {string}
 */
export function formatTaskDate(date) {
  return date.toLocaleDateString('en-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

/**
 * Generate a dated task timeline counting back from the event date.
 *
 * Handles short-notice events by:
 *  - Including only milestones that are still in the future.
 *  - Compressing remaining tasks into the available window.
 *  - Marking any milestone date that has already passed as overdue.
 *
 * @param {Date}   eventDate  - The target event date.
 * @param {string} eventType  - One of 'wedding', 'birthday', 'community'.
 * @returns {TimelineTask[]} Tasks sorted chronologically (oldest first).
 * @throws {Error} If eventDate is not a valid Date or eventType is unsupported.
 */
export function generateTimeline(eventDate, eventType) {
  if (!(eventDate instanceof Date) || isNaN(eventDate.getTime())) {
    throw new Error('eventDate must be a valid Date object.');
  }

  const specificTasks = EVENT_SPECIFIC_TASKS[eventType];
  if (!specificTasks) {
    throw new Error(`Unsupported event type: "${eventType}".`);
  }

  const allMilestones = [...BASE_MILESTONES, ...specificTasks].sort(
    (a, b) => b.weeksOut - a.weeksOut
  );

  const now = new Date();
  const eventMs = eventDate.getTime();
  const weeksUntilEvent = (eventMs - now.getTime()) / (7 * 24 * 60 * 60 * 1000);
  const isShortNotice = weeksUntilEvent < SHORT_NOTICE_WEEKS;

  const tasks = allMilestones.map(({ weeksOut, task }) => {
    const date = addDays(eventDate, -weeksOut * 7);
    const overdue = date < now && weeksOut > 0;
    return {
      week: weeksOut === 0 ? 'Day of Event' : `${weeksOut} week${weeksOut !== 1 ? 's' : ''} before`,
      date,
      task,
      overdue,
      compressed: isShortNotice && weeksOut > 0,
    };
  });

  // Sort chronologically
  return tasks.sort((a, b) => a.date.getTime() - b.date.getTime());
}

/**
 * Return the count of overdue tasks in a timeline.
 *
 * @param {TimelineTask[]} timeline
 * @returns {number}
 */
export function countOverdueTasks(timeline) {
  return timeline.filter((t) => t.overdue).length;
}
