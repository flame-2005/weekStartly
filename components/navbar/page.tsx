import React, { useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import { Calendar, LogIn, LogOut, User, Menu, X, Sparkles } from 'lucide-react'

const Navbar = () => {
  const { data: session, status } = useSession()
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const handleAuthAction = () => {
    if (session) {
      signOut()
    } else {
      signIn('google')
    }
  }

  return (
    <div className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 shadow-xl border-b border-blue-500/20">
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo and Brand */}
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm border border-white/30">
              <Calendar className="w-6 h-6 text-white" />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-white text-2xl font-bold tracking-tight">
                Weekendly
              </h1>
              <p className="text-blue-100 text-sm font-medium flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Your personalized weekend planner
              </p>
            </div>

            {/* Mobile brand */}
            <div className="sm:hidden">
              <h1 className="text-white text-xl font-bold">Weekendly</h1>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {/* User Avatar (when signed in) */}
            {session && (
              <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-center">
                <span className="text-white font-medium">
                  Welcome, {session.user?.name?.split(' ')[0] || 'Buddy'}
                </span>
              </div>
            )}

            {/* Single Auth Button */}
            <button
              onClick={handleAuthAction}
              disabled={status === 'loading'}
              className="flex items-center space-x-2 bg-white/20 hover:bg-white/30 
                       backdrop-blur-sm border border-white/30 text-white px-6 py-3 
                       rounded-full transition-all duration-200 font-medium
                       hover:scale-105 hover:shadow-lg hover:shadow-white/10
                       disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {status === 'loading' ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Loading...</span>
                </>
              ) : session ? (
                <>
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </>
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg bg-white/20 hover:bg-white/30 backdrop-blur-sm 
                       border border-white/30 transition-colors duration-200"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-white" />
              ) : (
                <Menu className="w-5 h-5 text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-white/20 py-4">
            <div className="space-y-4">
              {/* Mobile Welcome Message (when signed in) */}
              {session && (
                <div className="bg-white/10 backdrop-blur-sm border border-white/30 rounded-xl px-4 py-3 text-center">
                  <span className="text-white font-medium">
                    Welcome, {session.user?.name?.split(' ')[0] || 'Buddy'}
                  </span>
                </div>
              )}

              {/* Mobile Auth Button */}
              <button
                onClick={handleAuthAction}
                disabled={status === 'loading'}
                className="w-full flex items-center justify-center space-x-2 
                         bg-white/20 hover:bg-white/30 backdrop-blur-sm border border-white/30 
                         text-white px-6 py-4 rounded-xl transition-all duration-200 font-medium
                         disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {status === 'loading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Loading...</span>
                  </>
                ) : session ? (
                  <>
                    <LogOut className="w-5 h-5" />
                    <span>Sign Out</span>
                  </>
                ) : (
                  <>
                    <LogIn className="w-5 h-5" />
                    <span>Sign In with Google</span>
                  </>
                )}
              </button>

              {/* Mobile App Description */}
              <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/20">
                <p className="text-blue-100 text-sm text-center">
                  Plan your perfect weekends with personalized event scheduling
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Decorative bottom border */}
      <div className="h-1 bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
    </div>
  )
}

export default Navbar