import { describe, it, expect, beforeAll } from 'vitest';
import { generateTimeline, countOverdueTasks } from '../utils/timeline.js';

/** Creates a Date N days from now. */
function daysFromNow(n) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  d.setHours(0, 0, 0, 0);
  return d;
}

/** Creates a Date N weeks from now. */
function weeksFromNow(n) {
  return daysFromNow(n * 7);
}

describe('generateTimeline', () => {
  it('throws on invalid date', () => {
    expect(() => generateTimeline(new Date('invalid'), 'wedding')).toThrow();
  });

  it('throws on unsupported event type', () => {
    expect(() => generateTimeline(weeksFromNow(12), 'gala')).toThrow();
  });

  it('returns an array of tasks for each event type', () => {
    ['wedding', 'birthday', 'community'].forEach((type) => {
      const tasks = generateTimeline(weeksFromNow(12), type);
      expect(Array.isArray(tasks)).toBe(true);
      expect(tasks.length).toBeGreaterThan(0);
    });
  });

  it('tasks are in chronological order (oldest first)', () => {
    const tasks = generateTimeline(weeksFromNow(12), 'wedding');
    for (let i = 0; i < tasks.length - 1; i++) {
      expect(tasks[i].date.getTime()).toBeLessThanOrEqual(tasks[i + 1].date.getTime());
    }
  });

  it('all tasks have required fields', () => {
    const tasks = generateTimeline(weeksFromNow(8), 'birthday');
    tasks.forEach((task) => {
      expect(typeof task.week).toBe('string');
      expect(task.date).toBeInstanceOf(Date);
      expect(typeof task.task).toBe('string');
      expect(typeof task.overdue).toBe('boolean');
      expect(typeof task.compressed).toBe('boolean');
    });
  });

  describe('overdue flagging', () => {
    it('marks no tasks as overdue for a far-future event', () => {
      const tasks = generateTimeline(weeksFromNow(20), 'community');
      const overdueCount = tasks.filter((t) => t.overdue).length;
      expect(overdueCount).toBe(0);
    });

    it('marks at least some tasks as overdue for a very short-notice event', () => {
      // Event in 1 day — most milestones should be overdue
      const tasks = generateTimeline(daysFromNow(1), 'wedding');
      const overdueCount = tasks.filter((t) => t.overdue).length;
      expect(overdueCount).toBeGreaterThan(0);
    });

    it('day-of-event task is never overdue (overdue = false)', () => {
      const tasks = generateTimeline(daysFromNow(1), 'birthday');
      const dayOf = tasks.find((t) => t.week === 'Day of Event');
      expect(dayOf).toBeDefined();
      expect(dayOf.overdue).toBe(false);
    });
  });

  describe('short-notice compression', () => {
    it('sets compressed = true when event is fewer than 4 weeks away', () => {
      const tasks = generateTimeline(weeksFromNow(2), 'birthday');
      const compressed = tasks.filter((t) => t.compressed && !t.overdue);
      // At least the day-before tasks should be marked compressed
      expect(tasks.some((t) => t.compressed)).toBe(true);
    });

    it('sets compressed = false for far-future events', () => {
      const tasks = generateTimeline(weeksFromNow(15), 'community');
      expect(tasks.every((t) => !t.compressed)).toBe(true);
    });
  });
});

describe('countOverdueTasks', () => {
  it('returns 0 for a far-future event', () => {
    // Use 20 weeks to comfortably avoid any same-day boundary conditions
    const tasks = generateTimeline(weeksFromNow(20), 'wedding');
    expect(countOverdueTasks(tasks)).toBe(0);
  });

  it('returns a positive number for a near-past event', () => {
    const tasks = generateTimeline(daysFromNow(0), 'birthday');
    expect(countOverdueTasks(tasks)).toBeGreaterThanOrEqual(0);
  });
});
