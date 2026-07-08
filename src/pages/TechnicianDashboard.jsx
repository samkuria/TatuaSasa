import { useState, useEffect } from "react";
import './technician-dashboard.css';
import { supabase } from '../config/supabaseClient';

// --- MOCK DATA ---
const demoJob = {
  id: 1,
  title: "Projector HDMI not working",
  ticket: "Ticket #204 — Science Block, Lab 4",
  staffName: "Samuel",
  description: "The projector is not connecting to any laptops, it says no signal.",
  stage: "pending"
};

const initialSolved = [
  { title: "Replaced fuser unit, 2nd floor", when: "Yesterday" },
  { title: "Fixed VPN certificate error", when: "2 days ago" },
];

const leaderboard = [
  { name: "Brian K.", count: 42 },
  { name: "Amina R.", count: 33 },
];

// Available categories (Must match StaffDashboard options)
const CATEGORIES = [
  { id: 'computer', label: 'Computer issues' },
  { id: 'network', label: 'Network & Wi-Fi' },
  { id: 'hardware', label: 'Hardware / Peripherals' },
  { id: 'software', label: 'Software / System Access' }
];

export default function TechnicianDashboard() {
  // --- STATE ---
  const [userName, setUserName] = useState(""); // Start empty
  const [isNewlyPromoted, setIsNewlyPromoted] = useState(true);
  const [selectedSpecialties, setSelectedSpecialties] = useState([]);
  
  const [jobs, setJobs] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [isActive, setIsActive] = useState(false);

  const hasJobs = jobs.length > 0;
  const selectedJob = jobs.find((j) => j.id === selectedId) || jobs[0];

  // --- NEW: Fetch User Data from Supabase ---
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        // Extract the full_name we saved during sign-up
        const fullName = user.user_metadata?.full_name || "Technician";
        
        // Grab just the first name for a friendlier greeting (splits at the space)
        const firstName = fullName.split(' ')[0];
        
        setUserName(firstName);
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

  const completeOnboarding = () => {
    // In production, save selectedSpecialties to Supabase user profile here
    console.log("Saved specialties:", selectedSpecialties);
    setIsNewlyPromoted(false);
  };

  const acceptJob = (id) => {
    setJobs(jobs.map(j => j.id === id ? { ...j, stage: 'working' } : j));
  };

  return (
    <div className="tech-container">
      
      {/* === ONBOARDING MODAL (Only shows for newly promoted admins) === */}
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

        {!hasJobs ? (
          <div className="tech-empty-state">
            <h2 style={{color: '#064732', marginBottom: '10px'}}>No tickets assigned yet</h2>
            <p style={{color: '#666', marginBottom: '20px'}}>
              Stay active. The automated system will assign tickets here based on your specialties and leaderboard rank.
            </p>
            {/* DEMO BUTTON: Remove in production */}
            <button className="btn-primary" style={{width: 'auto'}} onClick={() => setJobs([demoJob])}>
              Simulate Incoming Ticket
            </button>
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
            
            {/* Simplified Workspace Area for this 2-file structure */}
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
            {initialSolved.map(s => (
              <div key={s.title} style={{display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #f0f0f0', fontSize: '14px'}}>
                <span>{s.title}</span>
                <span style={{color: '#888'}}>{s.when}</span>
              </div>
            ))}
          </div>

          <div className="tech-panel">
            <h3>Leaderboard (Top ICT Officers)</h3>
            {leaderboard.map((l, i) => (
              <div key={l.name} style={{display: 'flex', justifyContent: 'space-between', padding: '10px', background: i % 2 === 0 ? '#f9f9f9' : 'white', fontSize: '14px'}}>
                <strong>{i + 1}. {l.name}</strong>
                <span style={{color: '#666'}}>{l.count} resolved</span>
              </div>
            ))}
          </div>
        </div>
      </article>
    </div>
  );
}