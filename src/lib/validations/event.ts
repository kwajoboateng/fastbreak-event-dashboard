import { z } from 'zod'

export const venueSchema = z.object({
  venue_name: z.string().min(1, 'Venue name is required'),
})

export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  date: z.string().min(1, 'Event date is required'),
  sport_type: z.string().min(1, 'Sport type is required'),
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, 'At least one venue is required'),
})

export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid('Invalid event ID'),
})

export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type VenueInput = z.infer<typeof venueSchema>
