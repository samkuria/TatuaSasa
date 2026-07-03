import { useState } from 'react';
import './staff-dashboard.css';

export default function StaffDashboard() {
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="dashboard-container">
      <div className="dashboard-card">
        
        <div className="dashboard-header">
          <h1>Tatua Sasa</h1>
          <button 
            className="primary-btn" 
            onClick={() => setShowForm(!showForm)}
          >
            {showForm ? "Cancel" : "+ Raise New Ticket"}
          </button>
        </div>

        {!showForm ? (
          <div>
            <h2>My Active Tickets</h2>
            {/* NEW: Responsive wrapper added here */}
            <div className="table-responsive">
              <table className="ticket-table">
                <thead>
                  <tr>
                    <th>Subject</th>
                    <th>Date</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Projector HDMI not connecting</td>
                    <td>2026-07-02</td>
                    <td><span className="status-badge status-pending">Pending</span></td>
                  </tr>
                  <tr>
                    <td>Computer issues: won't boot</td>
                    <td>2026-07-01</td>
                    <td><span className="status-badge status-progress">In Progress</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          <form className="ticket-form">
            <h2>Raise a New Ticket</h2>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="subject">Ticket Subject</label>
              <input type="text" id="subject" placeholder="e.g., Internet is down" required />
              <span className="help-text">Please keep this to a short, understandable statement.</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" required>
                  <option value="">Select a category...</option>
                  <option value="computer">Computer issues</option>
                  <option value="network">Network & Wi-Fi</option>
                  <option value="hardware">Hardware / Peripherals</option>
                  <option value="software">Software / System Access</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select id="priority" required>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="building">Building</label>
                <input type="text" id="building" required />
              </div>
              <div className="form-group">
                <label htmlFor="floor">Floor</label>
                <input type="text" id="floor" required />
              </div>
              <div className="form-group">
                <label htmlFor="room">Room Number</label>
                <input type="text" id="room" required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="description">Detailed Description</label>
              <textarea id="description" rows="4" placeholder="Explain what is happening..." required></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="attachment">Attachment (Optional screenshot or photo)</label>
              <input type="file" id="attachment" accept="image/*" />
            </div>

            <button type="submit" className="primary-btn" style={{ width: '100%' }}>Submit Ticket</button>
          </form>
        )}

      </div>
    </div>
  );
}