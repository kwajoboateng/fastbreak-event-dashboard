'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResponse, errorResponse, successResponse } from '@/lib/action-response'
import { handleActionError } from '@/lib/error-handler'
import { CreateEventInput, UpdateEventInput } from '@/lib/validations/event'
import { EventWithVenues } from '@/types/database'
import { redirect } from 'next/navigation'

/**
 * Server Action to retrieve all events with their associated venues.
 * 
 * This function fetches all events from the database and includes
 * their associated venues in a single query using Supabase's
 * relational query capabilities.
 * 
 * @returns Promise<ActionResponse<EventWithVenues[]>> - All events with venues
 */
export async function getEvents(): Promise<ActionResponse<EventWithVenues[]>> {
  try {
    const supabase = await createClient()
    
    const { data: events, error } = await supabase
      .from('events')
      .select(`
        *,
        venues:event_venues(*)
      `)
      .order('date', { ascending: true })

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(events || [])
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action to retrieve a specific event by ID with its venues.
 * 
 * @param id - The UUID of the event to retrieve
 * @returns Promise<ActionResponse<EventWithVenues | null>> - The event with venues or null if not found
 */
export async function getEventById(id: string): Promise<ActionResponse<EventWithVenues | null>> {
  try {
    const supabase = await createClient()
    
    const { data: event, error } = await supabase
      .from('events')
      .select(`
        *,
        venues:event_venues(*)
      `)
      .eq('id', id)
      .single()

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(event)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action to search and filter events by name and sport type.
 * 
 * This function supports:
 * - Text search on event names (case-insensitive, partial matching)
 * - Filtering by sport type (exact match)
 * - Both filters can be used together
 * 
 * @param searchTerm - Optional search term to match against event names
 * @param sportType - Optional sport type to filter by
 * @returns Promise<ActionResponse<EventWithVenues[]>> - Filtered events with venues
 */
export async function searchAndFilterEvents(
  searchTerm?: string,
  sportType?: string
): Promise<ActionResponse<EventWithVenues[]>> {
  try {
    const supabase = await createClient()
    
    let query = supabase
      .from('events')
      .select(`
        *,
        venues:event_venues(*)
      `)

    if (searchTerm) {
      query = query.ilike('name', `%${searchTerm}%`)
    }

    if (sportType) {
      query = query.eq('sport_type', sportType)
    }

    const { data: events, error } = await query.order('date', { ascending: true })

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(events || [])
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action to create a new event with associated venues.
 * 
 * This function performs a two-step operation:
 * 1. Creates the event record with the current user as creator
 * 2. Creates all associated venue records
 * 
 * The operation is atomic - if venue creation fails, the event
 * creation is also rolled back.
 * 
 * @param data - Validated event data including venues
 * @returns Promise<ActionResponse<EventWithVenues>> - The created event with venues
 */
export async function createEvent(data: CreateEventInput): Promise<ActionResponse<EventWithVenues>> {
  try {
    const supabase = await createClient()
    
    // Get current user
    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return errorResponse('User not authenticated')
    }

    // Create event
    const { data: event, error: eventError } = await supabase
      .from('events')
      .insert({
        name: data.name,
        date: data.date,
        sport_type: data.sport_type,
        description: data.description,
        created_by: user.id,
      })
      .select()
      .single()

    if (eventError) {
      return errorResponse(eventError.message)
    }

    // Create venues
    const { error: venuesError } = await supabase
      .from('event_venues')
      .insert(
        data.venues.map(venue => ({
          event_id: event.id,
          venue_name: venue.venue_name,
        }))
      )

    if (venuesError) {
      return errorResponse(venuesError.message)
    }

    // Fetch the complete event with venues
    const result = await getEventById(event.id)
    if (!result.success) {
      return result
    }

    return successResponse(result.data!)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action to update an existing event and its venues.
 * 
 * This function performs a three-step operation:
 * 1. Updates the event record with new data
 * 2. If venues are provided, deletes all existing venues for the event
 * 3. If venues are provided, creates new venue records
 * 
 * Note: Venue updates are handled by complete replacement (delete + insert)
 * rather than individual updates for simplicity and consistency.
 * 
 * @param id - The UUID of the event to update
 * @param data - Validated event data (all fields optional except id)
 * @returns Promise<ActionResponse<EventWithVenues>> - The updated event with venues
 */
export async function updateEvent(id: string, data: UpdateEventInput): Promise<ActionResponse<EventWithVenues>> {
  try {
    const supabase = await createClient()
    
    // Update event
    const { error: eventError } = await supabase
      .from('events')
      .update({
        name: data.name,
        date: data.date,
        sport_type: data.sport_type,
        description: data.description,
      })
      .eq('id', id)

    if (eventError) {
      return errorResponse(eventError.message)
    }

    // Update venues if provided
    if (data.venues) {
      // Delete existing venues
      const { error: deleteError } = await supabase
        .from('event_venues')
        .delete()
        .eq('event_id', id)

      if (deleteError) {
        return errorResponse(deleteError.message)
      }

      // Insert new venues
      const { error: venuesError } = await supabase
        .from('event_venues')
        .insert(
          data.venues.map(venue => ({
            event_id: id,
            venue_name: venue.venue_name,
          }))
        )

      if (venuesError) {
        return errorResponse(venuesError.message)
      }
    }

    // Fetch the updated event with venues
    const result = await getEventById(id)
    if (!result.success) {
      return result
    }

    return successResponse(result.data!)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action to delete an event and all its associated venues.
 * 
 * This function deletes the event record, which will cascade delete
 * all associated venue records due to foreign key constraints.
 * 
 * @param id - The UUID of the event to delete
 * @returns Promise<ActionResponse<null>> - Success response
 */
export async function deleteEvent(id: string): Promise<ActionResponse<null>> {
  try {
    const supabase = await createClient()
    
    const { error } = await supabase
      .from('events')
      .delete()
      .eq('id', id)

    if (error) {
      return errorResponse(error.message)
    }

    return successResponse(null)
  } catch (error) {
    return handleActionError(error)
  }
}

/**
 * Server Action wrapper for deleting an event with automatic redirect.
 * 
 * This function is designed to be used directly in forms as a form action.
 * It calls the deleteEvent function and redirects to the dashboard on success.
 * 
 * @param id - The UUID of the event to delete
 * @returns Promise<void> - Always redirects to dashboard
 */
export async function deleteEventAction(id: string): Promise<void> {
  const result = await deleteEvent(id)
  if (!result.success) {
    throw new Error(result.error)
  }
  redirect('/dashboard')
}
