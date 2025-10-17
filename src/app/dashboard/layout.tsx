import { createClient } from '@/lib/supabase/server'
import { signOut } from '@/app/actions/auth'
import { Button } from '@/components/ui/button'
import { LogOut, Calendar, Plus } from 'lucide-react'
import Link from 'next/link'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-[#E6E6E6]">
      <nav className="bg-[#BAC8B1] shadow-sm border-b border-[#6C8480]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link href="/dashboard" className="flex items-center space-x-2 cursor-pointer">
                <Calendar className="h-8 w-8 text-[#7B9669]" />
                <span className="text-xl font-bold text-[#404E3B]">GameSync</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link href="/events/create">
                <Button className="flex items-center space-x-2 cursor-pointer">
                  <Plus className="h-4 w-4" />
                  <span>Create Event</span>
                </Button>
              </Link>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-[#404E3B]">
                  {user?.email}
                </span>
                <form action={signOut}>
                  <Button variant="outline" size="sm" type="submit" className="cursor-pointer">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
