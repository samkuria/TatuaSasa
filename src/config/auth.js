import { supabase } from './supabaseClient'
 
export async function signUp(email, password, fullName) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: fullName } },
  })
  if (error) throw error
  return data   // session will be null until email is confirmed
}
 
export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  return data   // data.session.access_token is what you send to FastAPI
}
 
export async function signOut() {
  const { error } = await supabase.auth.signOut()
  if (error) throw error
}