'use server'

import { createClient } from '@/lib/supabase/server'
import { ActionResponse, errorResponse, successResponse } from '@/lib/action-response'
import { handleActionError } from '@/lib/error-handler'
import { CreateEventInput, UpdateEventInput } from '@/lib/validations/event'
import { EventWithVenues } from '@/types/database'
import { redirect } from 'next/navigation'

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

export async function deleteEventAction(id: string): Promise<void> {
  const result = await deleteEvent(id)
  if (!result.success) {
    throw new Error(result.error)
  }
  redirect('/dashboard')
}
