import { useState, useEffect } from 'react'
import { listDepartments, listSupervisors, createSupervisor } from '../config/admin'

function randomPassword() {
  // Temp password — supervisor resets it on first login (see note below)
  return crypto.randomUUID().slice(0, 12) + 'Aa1!'
}

export default function AdminSupervisors() {
  const [departments, setDepartments] = useState([])
  const [supervisors, setSupervisors] = useState([])
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  const [form, setForm] = useState({ fullName: '', email: '', department: '' })

  async function loadData() {
    setLoading(true)
    try {
      const [depts, sups] = await Promise.all([listDepartments(), listSupervisors()])
      setDepartments(depts)
      setSupervisors(sups)
      if (depts.length && !form.department) {
        setForm((f) => ({ ...f, department: depts[0].name }))
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { loadData() }, [])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setSuccess('')
    setSubmitting(true)
    try {
      const tempPassword = randomPassword()
      await createSupervisor({
        email: form.email,
        password: tempPassword,
        fullName: form.fullName,
        department: form.department,
      })
      setSuccess(`Supervisor added. Temporary password: ${tempPassword} — share this securely and have them change it on first login.`)
      setForm({ fullName: '', email: '', department: departments[0]?.name || '' })
      await loadData()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-xl font-semibold text-slate-900">Supervisors</h1>
        <p className="text-sm text-slate-500 mt-1">
          Add a supervisor account. They can add their own skills and manage their technicians after signing in.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 bg-white border border-slate-200 rounded-lg p-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Full name</label>
            <input
              type="text"
              required
              value={form.fullName}
              onChange={(e) => setForm({ ...form, fullName: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="Jane Wanjiru"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
              placeholder="jane.wanjiru@ministry.go.ke"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Department</label>
          <select
            required
            value={form.department}
            onChange={(e) => setForm({ ...form, department: e.target.value })}
            className="w-full border border-slate-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-400"
          >
            {departments.map((d) => (
              <option key={d.id} value={d.name}>{d.name}</option>
            ))}
          </select>
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-700 bg-green-50 border border-green-200 rounded-md px-3 py-2">{success}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="bg-slate-900 text-white text-sm font-medium px-4 py-2 rounded-md disabled:opacity-50"
        >
          {submitting ? 'Adding…' : 'Add supervisor'}
        </button>
      </form>

      <div>
        <h2 className="text-sm font-medium text-slate-700 mb-2">Existing supervisors</h2>
        {loading ? (
          <p className="text-sm text-slate-400">Loading…</p>
        ) : supervisors.length === 0 ? (
          <p className="text-sm text-slate-400">No supervisors yet.</p>
        ) : (
          <div className="border border-slate-200 rounded-lg divide-y">
            {supervisors.map((s) => (
              <div key={s.id} className="flex justify-between items-center px-4 py-3">
                <div>
                  <p className="text-sm font-medium text-slate-900">{s.full_name}</p>
                  <p className="text-xs text-slate-500">{s.department}</p>
                </div>
                <span className="text-xs text-slate-400">
                  {new Date(s.created_at).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}