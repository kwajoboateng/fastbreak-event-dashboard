/**
 * Core event entity representing a sports event.
 * This is the main entity in the application.
 */
export interface Event {
  id: string // UUID primary key
  name: string // Event name (required)
  date: string // ISO date string (required)
  sport_type: string // Type of sport (required)
  description?: string // Optional event description
  created_by: string // UUID of the user who created the event
  created_at: string // ISO timestamp of creation
  updated_at: string // ISO timestamp of last update
}

/**
 * Venue entity representing a location where an event takes place.
 * Events can have multiple venues (one-to-many relationship).
 */
export interface EventVenue {
  id: string // UUID primary key
  event_id: string // Foreign key to events table
  venue_name: string // Name of the venue (required)
  created_at: string // ISO timestamp of creation
}

/**
 * Extended event interface that includes associated venues.
 * This is the primary interface used throughout the application
 * for displaying events with their venue information.
 */
export interface EventWithVenues extends Event {
  venues: EventVenue[] // Array of associated venues
}

/**
 * Supabase database type definitions.
 * This provides type safety for all database operations.
 * 
 * The structure matches the actual Supabase database schema:
 * - events: Main events table
 * - event_venues: Venues associated with events
 * 
 * Each table has Row, Insert, and Update types:
 * - Row: Complete record as returned from database
 * - Insert: Fields required for creating new records
 * - Update: Fields that can be updated (all optional)
 */
export interface Database {
  public: {
    Tables: {
      events: {
        Row: Event
        Insert: Omit<Event, 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Omit<Event, 'id' | 'created_at' | 'updated_at'>>
      }
      event_venues: {
        Row: EventVenue
        Insert: Omit<EventVenue, 'id' | 'created_at'>
        Update: Partial<Omit<EventVenue, 'id' | 'created_at'>>
      }
    }
  }
}
