import { useState, useEffect } from "react";
import { supabase } from '../config/supabaseClient'; 
import './technician-dashboard.css';

// Available categories (Must match StaffDashboard options)
const CATEGORIES = [
  { id: 'computer', label: 'Computer issues' },
  { id: 'network', label: 'Network & Wi-Fi' },
  { id: 'hardware', label: 'Hardware / Peripherals' },
  { id: 'software', label: 'Software / System Access' }
];

export default function TechnicianDashboard() {
  // --- STATE ---
  const [userName, setUserName] = useState(""); 
  const [isNewlyPromoted, setIsNewlyPromoted] = useState(true); 
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  
  // Production-ready empty states for real data
  const [jobs, setJobs] = useState([]);
  const [solvedJobs, setSolvedJobs] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  
  const [selectedId, setSelectedId] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const hasJobs = jobs.length > 0;
  const selectedJob = jobs.find((j) => j.id === selectedId) || jobs[0];

  // --- Fetch User Data ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (user) {
        const fullName = user.user_metadata?.full_name || "Technician";
        const firstName = fullName.split(' ')[0];
        setUserName(firstName);
        
        // TODO for backend wiring: 
        // 1. Check if user has already set specialties in your users table to flip setIsNewlyPromoted
        // 2. Fetch active jobs assigned to this user id
        // 3. Fetch solved jobs for this user id
        // 4. Fetch leaderboard stats
      }
    };

    fetchUser();
  }, []);

  // --- HANDLERS ---
  const handleSpecialtyToggle = (categoryId) => {
    setSelectedSpecialties(prev => 
      prev.includes(categoryId) 
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const completeOnboarding = async () => {
    // TODO: Send selectedSpecialties to your Supabase database here
    setIsNewlyPromoted(false);
  };

  const acceptJob = async (id) => {
    // Optimistic UI update
    setJobs(jobs.map(j => j.id === id ? { ...j, stage: 'working' } : j));
    // TODO: Update the ticket status to 'working' in your Supabase tickets table
  };

  return (
    <div className="tech-container">
      
      {/* === ONBOARDING MODAL === */}
      {isNewlyPromoted && (
        <div className="modal-overlay">
          <div className="onboarding-modal">
            <h2>Congratulations, {userName}! 🎉</h2>
            <p>
              An administrator has promoted your account to <strong>ICT Officer</strong>. 
              To ensure our automated system routes the right tickets to you, please select your areas of expertise below.
            </p>
            
            <div className="specialty-grid">
              {CATEGORIES.map(category => (
                <label key={category.id} className="specialty-label">
                  <input 
                    type="checkbox" 
                    checked={selectedSpecialties.includes(category.id)}
                    onChange={() => handleSpecialtyToggle(category.id)}
                  />
                  {category.label}
                </label>
              ))}
            </div>

            <button 
              className="btn-primary" 
              onClick={completeOnboarding}
              disabled={selectedSpecialties.length === 0}
            >
              {selectedSpecialties.length === 0 ? "Select at least one specialty" : "Complete Setup & Enter Workspace"}
            </button>
          </div>
        </div>
      )}
      {/* ========================================================== */}

      <article className="tech-article">
        <header className="tech-header">
          <div>
            <h1>Technician Workspace</h1>
            <p>
              {hasJobs 
                ? "Manage and resolve your assigned tickets." 
                : "Your queue is currently clear."}
            </p>
          </div>
          <button 
            className="status-toggle"
            onClick={() => setIsActive(!isActive)}
          >
            <span className={`status-dot ${isActive ? 'active' : ''}`}></span>
            {isActive ? "Status: Active" : "Status: Away"}
          </button>
        </header>

        {/* Real Production Empty State */}
        {!hasJobs ? (
          <div className="tech-empty-state">
            <h2 style={{color: '#064732', marginBottom: '10px'}}>No tickets assigned yet</h2>
            <p style={{color: '#666', margin: 0}}>
              Stay active. The automated system will assign tickets here based on your specialties and available queue.
            </p>
          </div>
        ) : (
          <div className="tech-grid">
            <div className="tech-queue">
              <div className="queue-title">Your Active Queue ({jobs.length})</div>
              {jobs.map((job) => (
                <button
                  key={job.id}
                  onClick={() => setSelectedId(job.id)}
                  className={`queue-btn ${job.id === selectedJob?.id ? "selected" : ""}`}
                >
                  {job.title}
                </button>
              ))}
            </div>
            
            <div style={{padding: '30px'}}>
              <h2 style={{margin: '0 0 5px 0', color: '#333'}}>{selectedJob.title}</h2>
              <p style={{margin: '0 0 20px 0', color: '#666', fontSize: '14px'}}>{selectedJob.ticket}</p>
              
              <div style={{background: '#f4f7f6', padding: '20px', borderRadius: '6px', marginBottom: '20px'}}>
                <strong style={{display: 'block', marginBottom: '5px', fontSize: '12px', textTransform: 'uppercase', color: '#888'}}>
                  Reported by {selectedJob.staffName}
                </strong>
                <p style={{margin: 0}}>{selectedJob.description}</p>
              </div>

              {selectedJob.stage === 'pending' && (
                <button className="btn-primary" onClick={() => acceptJob(selectedJob.id)}>
                  Accept Ticket & Begin Work
                </button>
              )}
              {selectedJob.stage === 'working' && (
                <div style={{padding: '15px', border: '1px solid #057840', borderRadius: '6px', color: '#057840', background: '#e6f4ea', fontWeight: 'bold'}}>
                  Ticket Accepted. You are actively working on this issue.
                </div>
              )}
            </div>
          </div>
        )}

        <div className="panels-grid">
          <div className="tech-panel">
            <h3>Your Recent Resolutions</h3>
            {solvedJobs.length === 0 ? (
              <p style={{color: '#888', fontSize: '14px', margin: 0}}>You haven't resolved any tickets yet.</p>
            ) : (
              solvedJobs.map(s => (
                <div key={s.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px'}}>
                  <span>{s.title}</span>
                  <span style={{color: '#888'}}>{s.when}</span>
                </div>
              ))
            )}
          </div>

          <div className="tech-panel">
            <h3>Leaderboard (Top ICT Officers)</h3>
            {leaderboard.length === 0 ? (
              <p style={{color: '#888', fontSize: '14px', margin: 0}}>Leaderboard data is currently unavailable.</p>
            ) : (
              leaderboard.map((l, i) => (
                <div key={l.id} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: i % 2 === 0 ? '#f9f9f9' : 'white', fontSize: '14px'}}>
                  <strong>{i + 1}. {l.name}</strong>
                  <span style={{color: '#666'}}>{l.count} resolved</span>
                </div>
              ))
            )}
          </div>
        </div>
      </article>
    </div>
  );
}