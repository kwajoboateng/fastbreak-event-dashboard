'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { EventWithVenues } from '@/types/database'
import { Calendar, MapPin } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'

interface EventCardProps {
  event: EventWithVenues
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date)
  const formattedDate = format(eventDate, 'MMM dd, yyyy')
  const formattedTime = format(eventDate, 'h:mm a')

  return (
    <Link href={`/events/${event.id}`}>
      <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:scale-105 bg-[#BAC8B1] border-[#6C8480]">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-start justify-between">
              <h3 className="font-semibold text-lg text-[#404E3B] line-clamp-2 group-hover:text-[#7B9669] transition-colors">
                {event.name}
              </h3>
              <Badge variant="secondary" className="ml-2 flex-shrink-0">
                {event.sport_type}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center text-sm text-[#6C8480]">
                <Calendar className="h-4 w-4 mr-2" />
                <span>{formattedDate} at {formattedTime}</span>
              </div>
              
              {event.venues && event.venues.length > 0 && (
                <div className="flex items-start text-sm text-[#6C8480]">
                  <MapPin className="h-4 w-4 mr-2 mt-0.5 flex-shrink-0" />
                  <div className="space-y-1">
                    {event.venues.slice(0, 2).map((venue) => (
                      <div key={venue.id} className="line-clamp-1">
                        {venue.venue_name}
                      </div>
                    ))}
                    {event.venues.length > 2 && (
                      <div className="text-xs text-[#404E3B]">
                        +{event.venues.length - 2} more venue{event.venues.length - 2 !== 1 ? 's' : ''}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
            
            {event.description && (
              <p className="text-sm text-[#6C8480] line-clamp-2">
                {event.description}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}
