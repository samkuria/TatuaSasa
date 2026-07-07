import { useState } from 'react';
import './staff-dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const [showForm, setShowForm] = useState(false);
  const [tickets, setTickets] = useState([]);

  // --- NEW: Calculate stats dynamically from the tickets array ---
  const totalTickets = tickets.length;
  const pendingTickets = tickets.filter(ticket => ticket.status === 'Pending').length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === 'Resolved').length;
  // ---------------------------------------------------------------

  const handleSubmitTicket = (e) => {
    e.preventDefault(); 

    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];
    const subjectValue = e.target.subject.value;

    const newTicket = {
      id: Date.now(), 
      subject: subjectValue,
      date: formattedDate,
      status: 'Pending' 
    };

    setTickets([...tickets, newTicket]);
    setShowForm(false);
  };

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
            {/* --- NEW: Stats Cards UI --- */}
            <div className="stats-container">
              <div className="stat-card">
                <div className="stat-title">Total Sent</div>
                <div className="stat-value">{totalTickets}</div>
              </div>
              <div className="stat-card pending">
                <div className="stat-title">Pending</div>
                <div className="stat-value">{pendingTickets}</div>
              </div>
              <div className="stat-card resolved">
                <div className="stat-title">Resolved</div>
                <div className="stat-value">{resolvedTickets}</div>
              </div>
            </div>
            {/* --------------------------- */}

            <h2>My Active Tickets</h2>
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
                  {tickets.length === 0 ? (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '30px', color: '#888' }}>
                        You have no active tickets. Click "+ Raise New Ticket" to report an issue.
                      </td>
                    </tr>
                  ) : (
                    tickets.map((ticket) => (
                      <tr key={ticket.id}>
                        <td>{ticket.subject}</td>
                        <td>{ticket.date}</td>
                        <td>
                          <span className="status-badge status-pending">
                            {ticket.status}
                          </span>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        ) : (
          
          <form className="ticket-form" onSubmit={handleSubmitTicket}>
            <h2>Raise a New Ticket</h2>
            
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="subject">Ticket Subject</label>
              <input type="text" id="subject" name="subject" placeholder="e.g., Internet is down" required />
              <span className="help-text">Please keep this to a short, understandable statement.</span>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select id="category" name="category" required>
                  <option value="">Select a category...</option>
                  <option value="computer">Computer issues</option>
                  <option value="network">Network & Wi-Fi</option>
                  <option value="hardware">Hardware / Peripherals</option>
                  <option value="software">Software / System Access</option>
                </select>
              </div>
              <div className="form-group">
                <label htmlFor="priority">Priority</label>
                <select id="priority" name="priority" required>
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
                <input type="text" id="building" name="building" required />
              </div>
              <div className="form-group">
                <label htmlFor="floor">Floor</label>
                <input type="text" id="floor" name="floor" required />
              </div>
              <div className="form-group">
                <label htmlFor="room">Room Number</label>
                <input type="text" id="room" name="room" required />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label htmlFor="description">Detailed Description</label>
              <textarea id="description" name="description" rows="4" placeholder="Explain what is happening..." required></textarea>
            </div>

            <div className="form-group" style={{ marginBottom: '25px' }}>
              <label htmlFor="attachment">Attachment (Optional screenshot or photo)</label>
              <input type="file" id="attachment" name="attachment" accept="image/*" />
            </div>

            <button type="submit" className="primary-btn" style={{ width: '100%' }}>Submit Ticket</button>
          </form>
        )}

      </div>
    </div>
  );
}