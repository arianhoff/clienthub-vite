import { useState, useEffect, createContext, useContext } from 'react'
import { supabase } from '../lib/supabase'

const AuthContext = createContext({})

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [organization, setOrganization] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      if (session?.user) {
        fetchProfile(session.user.id)
      } else {
        setLoading(false)
      }
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        if (session?.user) {
          await fetchProfile(session.user.id)
        } else {
          setProfile(null)
          setOrganization(null)
          setLoading(false)
        }
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  async function fetchProfile(userId) {
    try {
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*, organizations(*)')
        .eq('id', userId)
        .single()

      setProfile(profileData)
      setOrganization(profileData?.organizations)
    } catch (error) {
      console.error('Error fetching profile:', error)
    } finally {
      setLoading(false)
    }
  }

  async function signUp(email, password, fullName, orgName, orgSlug) {
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Create organization
    const trialEndsAt = new Date()
    trialEndsAt.setDate(trialEndsAt.getDate() + 14)

    const { data: org, error: orgError } = await supabase
      .from('organizations')
      .insert({
        name: orgName,
        slug: orgSlug,
        plan: 'freelance',
        subscription_status: 'trial',
        trial_ends_at: trialEndsAt.toISOString(),
      })
      .select()
      .single()

    if (orgError) throw orgError

    // Update profile
    const { error: profileError } = await supabase
      .from('profiles')
      .update({
        organization_id: org.id,
        role: 'admin',
        full_name: fullName,
      })
      .eq('id', authData.user.id)

    if (profileError) throw profileError

    return { user: authData.user, organization: org }
  }

  async function signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  }

  async function signOut() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
    setUser(null)
    setProfile(null)
    setOrganization(null)
  }

  const value = {
    user,
    profile,
    organization,
    loading,
    signUp,
    signIn,
    signOut,
    refreshProfile: () => user && fetchProfile(user.id),
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
