/**
 * @fileoverview Event timeline component.
 * Renders dated tasks counted back from the event date,
 * with overdue highlighting and short-notice notices.
 */

import { useMemo } from 'react';
import PropTypes from 'prop-types';
import { generateTimeline, formatTaskDate, countOverdueTasks } from '../utils/timeline.js';

/**
 * Displays the event planning timeline.
 *
 * @param {object} props
 * @param {Date}   props.eventDate - Target event date.
 * @param {string} props.eventType - 'wedding' | 'birthday' | 'community'
 * @returns {JSX.Element}
 */
export default function Timeline({ eventDate, eventType }) {
  const timeline = useMemo(
    () => generateTimeline(eventDate, eventType),
    [eventDate, eventType]
  );

  const overdueCount = useMemo(() => countOverdueTasks(timeline), [timeline]);
  const isShortNotice = timeline.some((t) => t.compressed);

  return (
    <section
      id="timeline-section"
      className="glass-card"
      aria-labelledby="timeline-heading"
    >
      <h2 id="timeline-heading" className="section-title">
        <span aria-hidden="true">📅</span> Planning Timeline
      </h2>

      {isShortNotice && (
        <div className="notice-banner notice-warning" role="alert">
          <span aria-hidden="true">⚡</span>{' '}
          <strong>Short notice!</strong> Your event is fewer than 4 weeks away. Some tasks
          are already overdue — prioritise immediately.
        </div>
      )}

      {overdueCount > 0 && !isShortNotice && (
        <div className="notice-banner notice-warning" role="alert">
          <span aria-hidden="true">⚠️</span>{' '}
          <strong>{overdueCount} task{overdueCount !== 1 ? 's are' : ' is'} overdue.</strong>{' '}
          Address these as soon as possible.
        </div>
      )}

      <ol className="timeline-list" aria-label="Event planning tasks in chronological order">
        {timeline.map((item, idx) => (
          <li
            key={`${item.week}-${idx}`}
            className={`timeline-item ${item.overdue ? 'timeline-overdue' : ''} ${
              item.week === 'Day of Event' ? 'timeline-event-day' : ''
            }`}
          >
            <div className="timeline-connector" aria-hidden="true">
              <span className="timeline-dot" />
            </div>
            <div className="timeline-content">
              <div className="timeline-meta">
                <span className="timeline-week">{item.week}</span>
                <time
                  className="timeline-date"
                  dateTime={item.date.toISOString().split('T')[0]}
                >
                  {formatTaskDate(item.date)}
                </time>
                {item.overdue && (
                  <span className="badge badge-overdue" aria-label="Overdue task">
                    Overdue
                  </span>
                )}
                {item.compressed && !item.overdue && (
                  <span className="badge badge-urgent" aria-label="Urgent task">
                    Urgent
                  </span>
                )}
              </div>
              <p className="timeline-task">{item.task}</p>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}

Timeline.propTypes = {
  eventDate: PropTypes.instanceOf(Date).isRequired,
  eventType: PropTypes.string.isRequired,
};
