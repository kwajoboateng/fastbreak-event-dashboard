'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useForm, useFieldArray, Controller } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateEventSchema, UpdateEventInput } from '@/lib/validations/event'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { getEventById, updateEvent } from '@/app/actions/events'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { Plus, X, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { EventWithVenues } from '@/types/database'

interface EditEventPageProps {
  params: Promise<{
    id: string
  }>
}

export default function EditEventPage({ params }: EditEventPageProps) {
  const { id } = use(params)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)
  const [event, setEvent] = useState<EventWithVenues | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<UpdateEventInput>({
    resolver: zodResolver(updateEventSchema),
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'venues',
  })

  const loadEvent = useCallback(async () => {
    try {
      const result = await getEventById(id)
      if (result.success && result.data) {
        setEvent(result.data)
        reset({
          id: result.data.id,
          name: result.data.name,
          date: new Date(result.data.date).toISOString().slice(0, 16),
          sport_type: result.data.sport_type,
          description: result.data.description || '',
          venues: result.data.venues.map(venue => ({ venue_name: venue.venue_name })),
        })
      } else {
        toast.error('Failed to load event')
        router.push('/dashboard')
      }
    } catch {
      toast.error('Failed to load event')
      router.push('/dashboard')
    } finally {
      setIsLoadingData(false)
    }
  }, [id, reset, router])

  useEffect(() => {
    loadEvent()
  }, [loadEvent])

  const onSubmit = async (data: UpdateEventInput) => {
    setIsLoading(true)
    try {
      const result = await updateEvent(id, data)
      if (result.success) {
        toast.success('Event updated successfully!')
        router.push(`/events/${id}`)
      } else {
        toast.error(result.error)
      }
    } catch {
      toast.error('An unexpected error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoadingData) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#7B9669] mx-auto"></div>
          <p className="mt-2 text-[#6C8480]">Loading event...</p>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="text-center py-12">
        <p className="text-[#6C8480]">Event not found</p>
        <Link href="/dashboard">
          <Button className="mt-4 cursor-pointer">Back to Dashboard</Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href={`/events/${id}`}>
          <Button variant="outline" className="mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Event
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Edit Event</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                placeholder="Enter event name"
                {...register('name')}
                disabled={isLoading}
                className="cursor-text"
              />
              {errors.name && (
                <p className="text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="date">Date & Time *</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  {...register('date')}
                  disabled={isLoading}
                  className="cursor-pointer"
                />
                {errors.date && (
                  <p className="text-sm text-red-600">{errors.date.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="sport_type">Sport Type *</Label>
                <Controller
                  name="sport_type"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value} disabled={isLoading}>
                      <SelectTrigger className="cursor-pointer">
                        <SelectValue placeholder="Select sport type" />
                      </SelectTrigger>
                      <SelectContent>
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
                  )}
                />
                {errors.sport_type && (
                  <p className="text-sm text-red-600">{errors.sport_type.message}</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                placeholder="Enter event description (optional)"
                rows={4}
                {...register('description')}
                disabled={isLoading}
                className="cursor-text"
              />
              {errors.description && (
                <p className="text-sm text-red-600">{errors.description.message}</p>
              )}
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label>Venues *</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ venue_name: '' })}
                  disabled={isLoading}
                  className="cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Venue
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <div className="flex-1">
                    <Input
                      placeholder="Enter venue name"
                      {...register(`venues.${index}.venue_name`)}
                      disabled={isLoading}
                      className="cursor-text"
                    />
                    {errors.venues?.[index]?.venue_name && (
                      <p className="text-sm text-red-600">
                        {errors.venues[index]?.venue_name?.message}
                      </p>
                    )}
                  </div>
                  {fields.length > 1 && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => remove(index)}
                      disabled={isLoading}
                      className="cursor-pointer"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}

              {errors.venues && typeof errors.venues === 'object' && 'message' in errors.venues && (
                <p className="text-sm text-red-600">{errors.venues.message}</p>
              )}
            </div>

            <div className="flex justify-end space-x-4">
              <Link href={`/events/${id}`}>
                <Button type="button" variant="outline" disabled={isLoading} className="cursor-pointer">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" disabled={isLoading} className="cursor-pointer">
                {isLoading ? 'Updating...' : 'Update Event'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
