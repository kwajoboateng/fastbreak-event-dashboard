'use client'

import { EventWithVenues } from '@/types/database'
import { EventCard } from './EventCard'

/**
 * Props for the EventsGrid component
 */
interface EventsGridProps {
  events: EventWithVenues[]
}

/**
 * EventsGrid component displays a responsive grid of event cards.
 * 
 * Features:
 * - Responsive grid layout (1-5 columns based on screen size)
 * - Empty state with helpful message when no events exist
 * - Renders EventCard components for each event
 * - Uses CSS Grid for optimal layout control
 * 
 * Responsive breakpoints:
 * - Mobile: 1 column
 * - Tablet (md): 2 columns
 * - Desktop (lg): 3 columns
 * - Large desktop (xl): 4 columns
 * - Extra large (2xl): 5 columns
 * 
 * @param events - Array of events to display in the grid
 * @returns JSX element with responsive grid of event cards
 */
export function EventsGrid({ events }: EventsGridProps) {
  if (events.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No events found</div>
        <p className="text-gray-400 mt-2">Create your first event to get started!</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  )
}
