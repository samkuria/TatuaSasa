import { supabase } from './supabaseClient'

const API_BASE = 'http://localhost:8000'

async function authHeader() {
  const { data: { session } } = await supabase.auth.getSession()
  return { Authorization: `Bearer ${session.access_token}` }
}

export async function listDepartments() {
  const { data, error } = await supabase.from('departments').select('*').order('name')
  if (error) throw error
  return data
}

export async function listSupervisors() {
  const res = await fetch(`${API_BASE}/admin/supervisors`, { headers: await authHeader() })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to load supervisors')
  return res.json()
}

export async function createSupervisor({ email, password, fullName, department }) {
  const res = await fetch(`${API_BASE}/admin/supervisors`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...(await authHeader()) },
    body: JSON.stringify({ email, password, full_name: fullName, department }),
  })
  if (!res.ok) throw new Error((await res.json()).detail || 'Failed to create supervisor')
  return res.json()
}