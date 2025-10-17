'use client'

import { EventWithVenues } from '@/types/database'
import { EventCard } from './EventCard'

interface EventsGridProps {
  events: EventWithVenues[]
}

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
