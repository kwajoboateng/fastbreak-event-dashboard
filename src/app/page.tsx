import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Calendar, Users, MapPin, Search } from 'lucide-react'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#E6E6E6] to-[#BAC8B1]">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-6xl font-bold text-[#404E3B] mb-6">
            Game
            <span className="text-[#7B9669]">Sync</span>
          </h1>
          <p className="text-xl text-[#6C8480] mb-8 max-w-2xl mx-auto">
            Create, manage, and discover sports events with multiple venues. 
            Perfect for organizing tournaments, leagues, and sporting activities.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/login">
              <Button variant="outline" size="lg" className="text-lg px-8 py-3 cursor-pointer">
                Sign In
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="text-center">
            <CardHeader>
              <Calendar className="h-12 w-12 text-[#7B9669] mx-auto mb-4" />
              <CardTitle>Event Management</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Create and manage sports events with detailed information including dates, times, and descriptions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <MapPin className="h-12 w-12 text-[#6C8480] mx-auto mb-4" />
              <CardTitle>Multiple Venues</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Support for events with multiple venues, perfect for tournaments and multi-location competitions.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Search className="h-12 w-12 text-[#404E3B] mx-auto mb-4" />
              <CardTitle>Search & Filter</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Find events quickly with powerful search and filtering by sport type and event name.
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center">
            <CardHeader>
              <Users className="h-12 w-12 text-[#BAC8B1] mx-auto mb-4" />
              <CardTitle>User Friendly</CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Intuitive interface with responsive design that works perfectly on all devices.
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        <div className="text-center">
          <h2 className="text-3xl font-bold text-[#404E3B] mb-4">
            Ready to get started?
          </h2>
          <p className="text-lg text-[#6C8480] mb-8">
            Sign up now to start creating and managing your sports events.
          </p>
          <Link href="/login?mode=signup">
            <Button size="lg" className="text-lg px-8 py-3 cursor-pointer">
              Get Started
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}