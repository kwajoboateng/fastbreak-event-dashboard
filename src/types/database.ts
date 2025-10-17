export interface Event {
  id: string
  name: string
  date: string
  sport_type: string
  description?: string
  created_by: string
  created_at: string
  updated_at: string
}

export interface EventVenue {
  id: string
  event_id: string
  venue_name: string
  created_at: string
}

export interface EventWithVenues extends Event {
  venues: EventVenue[]
}

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
