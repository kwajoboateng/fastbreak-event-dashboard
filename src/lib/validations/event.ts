import { z } from 'zod'

/**
 * Validation schema for individual venue data.
 * Used in both create and update operations.
 */
export const venueSchema = z.object({
  venue_name: z.string().min(1, 'Venue name is required'),
})

/**
 * Validation schema for creating new events.
 * All fields are required except description.
 * 
 * Validation rules:
 * - name: Required, non-empty string
 * - date: Required, non-empty string (should be ISO date format)
 * - sport_type: Required, non-empty string
 * - description: Optional string
 * - venues: Required array with at least one venue
 */
export const createEventSchema = z.object({
  name: z.string().min(1, 'Event name is required'),
  date: z.string().min(1, 'Event date is required'),
  sport_type: z.string().min(1, 'Sport type is required'),
  description: z.string().optional(),
  venues: z.array(venueSchema).min(1, 'At least one venue is required'),
})

/**
 * Validation schema for updating existing events.
 * All fields are optional except id.
 * 
 * This extends the createEventSchema but makes all fields optional,
 * then adds a required id field for identifying the event to update.
 */
export const updateEventSchema = createEventSchema.partial().extend({
  id: z.string().uuid('Invalid event ID'),
})

// TypeScript types inferred from Zod schemas
// These provide type safety throughout the application
export type CreateEventInput = z.infer<typeof createEventSchema>
export type UpdateEventInput = z.infer<typeof updateEventSchema>
export type VenueInput = z.infer<typeof venueSchema>
