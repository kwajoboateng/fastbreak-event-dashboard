'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Search, X } from 'lucide-react'
import { searchAndFilterEvents } from '@/app/actions/events'
import { EventWithVenues } from '@/types/database'
import { toast } from 'sonner'

/**
 * Props for the SearchAndFilter component
 */
interface SearchAndFilterProps {
  onEventsChange: (events: EventWithVenues[]) => void
  initialEvents: EventWithVenues[]
}

/**
 * SearchAndFilter component provides search and filtering functionality for events.
 * 
 * Features:
 * - Real-time search with debouncing (300ms delay)
 * - Sport type filtering with dropdown
 * - Clear filters functionality
 * - Optimized re-rendering using useRef to prevent unnecessary updates
 * - Loading states during search operations
 * - Error handling with toast notifications
 * 
 * Performance optimizations:
 * - Uses useRef to store stable references to props
 * - Debounced search to avoid excessive API calls
 * - useCallback for stable function references
 * 
 * @param onEventsChange - Callback function to update parent with filtered events
 * @param initialEvents - The original unfiltered list of events
 * @returns JSX element with search input, filter dropdown, and clear button
 */
export function SearchAndFilter({ onEventsChange, initialEvents }: SearchAndFilterProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [sportType, setSportType] = useState('all')
  const [isLoading, setIsLoading] = useState(false)
  
  // Use ref to store initial events to prevent unnecessary re-renders
  const initialEventsRef = useRef(initialEvents)
  const onEventsChangeRef = useRef(onEventsChange)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  
  // Update refs when props change
  useEffect(() => {
    initialEventsRef.current = initialEvents
    onEventsChangeRef.current = onEventsChange
  }, [initialEvents, onEventsChange])

  const performSearch = useCallback(async () => {
    // If no search term and sport type is 'all' or empty, show all events
    if (!searchTerm && (!sportType || sportType === 'all')) {
      onEventsChangeRef.current(initialEventsRef.current)
      return
    }

    setIsLoading(true)
    try {
      const result = await searchAndFilterEvents(
        searchTerm || undefined,
        sportType && sportType !== 'all' ? sportType : undefined
      )
      
      if (result.success) {
        onEventsChangeRef.current(result.data)
      } else {
        toast.error(result.error)
        onEventsChangeRef.current(initialEventsRef.current)
      }
    } catch {
      toast.error('Failed to search events')
      onEventsChangeRef.current(initialEventsRef.current)
    } finally {
      setIsLoading(false)
    }
  }, [searchTerm, sportType])

  // Debounced search
  useEffect(() => {
    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
    
    timeoutRef.current = setTimeout(() => {
      performSearch()
    }, 300)

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }, [performSearch])

  const clearFilters = useCallback(() => {
    // Clear any pending search timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    
    // Reset state
    setSearchTerm('')
    setSportType('all')
    
    // Immediately show all events without waiting for debounced search
    onEventsChangeRef.current(initialEventsRef.current)
  }, [])

  const hasActiveFilters = searchTerm || (sportType && sportType !== 'all')

  return (
    <div className="flex flex-col sm:flex-row gap-4 mb-8">
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#6C8480] h-4 w-4" />
        <Input
          placeholder="Search events..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 cursor-text"
          disabled={isLoading}
        />
      </div>
      
      <Select value={sportType} onValueChange={setSportType} disabled={isLoading} key={`select-${sportType}`}>
        <SelectTrigger className="w-full sm:w-48 cursor-pointer">
          <SelectValue placeholder="All Sports" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Sports</SelectItem>
          <SelectItem value="Football">Football</SelectItem>
          <SelectItem value="Basketball">Basketball</SelectItem>
          <SelectItem value="Soccer">Soccer</SelectItem>
          <SelectItem value="Tennis">Tennis</SelectItem>
          <SelectItem value="Baseball">Baseball</SelectItem>
          <SelectItem value="Hockey">Hockey</SelectItem>
          <SelectItem value="Volleyball">Volleyball</SelectItem>
          <SelectItem value="Golf">Golf</SelectItem>
          <SelectItem value="Other">Other</SelectItem>
        </SelectContent>
      </Select>

      {hasActiveFilters && (
        <Button
          variant="outline"
          onClick={clearFilters}
          disabled={isLoading}
          className="flex items-center space-x-2 cursor-pointer"
        >
          <X className="h-4 w-4" />
          <span>Clear</span>
        </Button>
      )}
    </div>
  )
}
