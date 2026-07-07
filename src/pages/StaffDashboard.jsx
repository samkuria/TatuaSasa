import { useState } from 'react';
import './staff-dashboard.css';
import { Link, useNavigate } from 'react-router-dom';

export default function StaffDashboard() {
  const [showForm, setShowForm] = useState(false);
  
  // 1. Initialize an empty array to hold the tickets
  const [tickets, setTickets] = useState([]);

  // 2. Handle the form submission
  const handleSubmitTicket = (e) => {
    e.preventDefault(); // Stop the page from reloading

    // Automatically get today's date in YYYY-MM-DD format
    const today = new Date();
    const formattedDate = today.toISOString().split('T')[0];

    // Grab the subject the user typed from the form event
    const subjectValue = e.target.subject.value;

    // Create a new ticket object
    const newTicket = {
      id: Date.now(), // Generate a unique ID for React's mapping
      subject: subjectValue,
      date: formattedDate,
      status: 'Pending' // Default status for new tickets
    };

    // 3. Add the new ticket to our state array
    setTickets([...tickets, newTicket]);

    // 4. Close the form to return to the table view
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
                  {/* 5. Dynamically render tickets or show an empty state message */}
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