import { notFound } from 'next/navigation'
import { getEventById, deleteEventAction } from '@/app/actions/events'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, Calendar, MapPin, Edit, Trash2 } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface EventDetailsPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EventDetailsPage({ params }: EventDetailsPageProps) {
  const { id } = await params
  const result = await getEventById(id)
  
  if (!result.success || !result.data) {
    notFound()
  }

  const event = result.data
  const eventDate = new Date(event.date)
  const formattedDate = format(eventDate, 'EEEE, MMMM dd, yyyy')
  const formattedTime = format(eventDate, 'h:mm a')

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/dashboard">
          <Button variant="outline" className="mb-4 cursor-pointer">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-3xl font-bold text-[#404E3B] mb-2">
                {event.name}
              </CardTitle>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="text-sm">
                  {event.sport_type}
                </Badge>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href={`/events/${event.id}/edit`}>
                <Button variant="outline" className="cursor-pointer">
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </Link>
              <form action={deleteEventAction.bind(null, event.id)}>
                <Button variant="destructive" type="submit" className="cursor-pointer">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete
                </Button>
              </form>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="flex items-center text-lg">
                <Calendar className="h-5 w-5 mr-3 text-[#6C8480]" />
                <div>
                  <div className="font-medium">{formattedDate}</div>
                  <div className="text-[#6C8480]">{formattedTime}</div>
                </div>
              </div>
            </div>
          </div>

          {event.venues && event.venues.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-[#404E3B] mb-3 flex items-center">
                <MapPin className="h-5 w-5 mr-2" />
                Venues ({event.venues.length})
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {event.venues.map((venue) => (
                  <div
                    key={venue.id}
                    className="p-3 bg-[#E6E6E6] rounded-lg border border-[#6C8480]"
                  >
                    <div className="font-medium text-[#404E3B]">
                      {venue.venue_name}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {event.description && (
            <div>
              <h3 className="text-lg font-semibold text-[#404E3B] mb-3">
                Description
              </h3>
              <div className="prose max-w-none">
                <p className="text-[#6C8480] whitespace-pre-wrap">
                  {event.description}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
