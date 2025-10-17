'use client'

import { useState, useEffect, useCallback } from 'react'
import { EventsGrid } from '@/components/dashboard/EventsGrid'
import { SearchAndFilter } from '@/components/dashboard/SearchAndFilter'
import { EventWithVenues } from '@/types/database'
import { getEvents } from '@/app/actions/events'
import { toast } from 'sonner'

/**
 * Dashboard page component - the main view for managing sports events.
 * 
 * This is a client component that handles:
 * - Loading and displaying all events
 * - Search and filtering functionality
 * - State management for events and loading states
 * - Error handling with toast notifications
 * 
 * Key features:
 * - Responsive grid layout for event cards
 * - Real-time search and filtering
 * - Loading states with spinner
 * - Separation of filtered events from original events for proper reset functionality
 * 
 * State management:
 * - events: Currently displayed events (may be filtered)
 * - originalEvents: Unfiltered events (used for resetting filters)
 * - isLoading: Loading state for initial data fetch
 * 
 * @returns JSX element with the complete dashboard interface
 */
export default function DashboardPage() {
  const [events, setEvents] = useState<EventWithVenues[]>([])
  const [originalEvents, setOriginalEvents] = useState<EventWithVenues[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const loadEvents = useCallback(async () => {
    setIsLoading(true)
    try {
      const result = await getEvents()
      if (result.success) {
        setEvents(result.data)
        setOriginalEvents(result.data) // Store original events separately
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('Failed to load events')
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    loadEvents()
  }, [loadEvents])

  const handleEventsChange = useCallback((newEvents: EventWithVenues[]) => {
    setEvents(newEvents)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B9669] mx-auto"></div>
          <p className="mt-2 text-[#6C8480]">Loading events...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[#404E3B]">Sports Events</h1>
        <p className="text-[#6C8480] mt-2">Manage and view all your sports events</p>
      </div>

      <SearchAndFilter 
        onEventsChange={handleEventsChange}
        initialEvents={originalEvents}
      />

      <EventsGrid events={events} />
    </div>
  )
}
