
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../config/supabaseClient';
import './staff-settingspanel.css';

export default function StaffSettingsPanel() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // --- NEW: Layout State ---
  const [activeSection, setActiveSection] = useState('profile');

  // --- State: Account & Profile ---
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatar, setAvatar] = useState('🧑‍💻'); 
  
  // --- State: Security ---
  const [newPassword, setNewPassword] = useState('');
  
  // --- State: Preferences ---
  const [theme, setTheme] = useState('light');
  const [language, setLanguage] = useState('en-US');

  // Load user data on mount
  useEffect(() => {
    const loadUserData = async () => {
      const { data: { user }, error } = await supabase.auth.getUser();
      
      if (user) {
        setEmail(user.email);
        setFullName(user.user_metadata?.full_name || '');
        setPhone(user.user_metadata?.phone || '');
        setAvatar(user.user_metadata?.avatar || '🧑‍💻');
        setTheme(user.user_metadata?.theme || 'light');
        setLanguage(user.user_metadata?.language || 'en-US');
      }
      setLoading(false);
    };

    loadUserData();
  }, []);

  const displayMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  // --- Handlers ---
  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaving(true);
    
    const { error } = await supabase.auth.updateUser({
      data: {
        full_name: fullName,
        phone: phone,
        avatar: avatar,
        theme: theme,
        language: language
      }
    });

    if (error) {
      displayMessage('error', error.message);
    } else {
      displayMessage('success', 'Profile and preferences updated successfully.');
    }
    setSaving(false);
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();
    if (!newPassword || newPassword.length < 6) {
      displayMessage('error', 'Password must be at least 6 characters long.');
      return;
    }

    setSaving(true);
    const { error } = await supabase.auth.updateUser({
      password: newPassword
    });

    if (error) {
      displayMessage('error', error.message);
    } else {
      displayMessage('success', 'Password updated successfully.');
      setNewPassword('');
    }
    setSaving(false);
  };

  const handleDataAction = (action) => {
    displayMessage('success', `Successfully initiated: ${action}.`);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  const handleDeleteAccount = () => {
    const confirmed = window.confirm("Are you absolutely sure? This action cannot be undone and will permanently delete your data.");
    if (confirmed) {
      displayMessage('error', 'Account deletion requires administrator approval. Please contact support.');
    }
  };

  if (loading) return <div style={{ padding: '20px', color: '#666' }}>Loading settings...</div>;

  return (
    <div>
      <h2 style={{ color: '#333', margin: '0 0 10px 0' }}>Settings</h2>
      
      {message.text && (
        <div className={`settings-alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      <div className="settings-layout">
        
        {/* --- LEFT SIDEBAR MENU --- */}
        <aside className="settings-sidebar">
          <button 
            className={`sidebar-menu-btn ${activeSection === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveSection('profile')}
          >
            Account & Profile
          </button>
          
          <button 
            className={`sidebar-menu-btn ${activeSection === 'security' ? 'active' : ''}`}
            onClick={() => setActiveSection('security')}
          >
            Security
          </button>
          
          <button 
            className={`sidebar-menu-btn ${activeSection === 'preferences' ? 'active' : ''}`}
            onClick={() => setActiveSection('preferences')}
          >
            Preferences
          </button>
          
          <button 
            className={`sidebar-menu-btn ${activeSection === 'privacy' ? 'active' : ''}`}
            onClick={() => setActiveSection('privacy')}
          >
            Privacy & Data
          </button>
          
          <div className="sidebar-divider"></div>
          
          <button 
            className={`sidebar-menu-btn ${activeSection === 'support' ? 'active' : ''}`}
            onClick={() => setActiveSection('support')}
          >
            Support & About
          </button>
          
          <button 
            className={`sidebar-menu-btn ${activeSection === 'danger' ? 'active' : ''}`}
            style={{ color: activeSection === 'danger' ? '#a40606' : '' }}
            onClick={() => setActiveSection('danger')}
          >
            Action Items
          </button>
        </aside>

        {/* --- RIGHT CONTENT AREA --- */}
        <main className="settings-content-area">
          
          {/* Section: Profile */}
          {activeSection === 'profile' && (
            <div>
              <h3>Account & Profile</h3>
              <form onSubmit={handleUpdateProfile}>
                <div className="settings-form-group">
                  <label>Avatar Selection</label>
                  <div className="avatar-selection-container">
                    {['🧑‍💻', '👩‍💻', '🤖'].map((emoji) => (
                      <div 
                        key={emoji}
                        className={`avatar-option ${avatar === emoji ? 'selected' : ''}`}
                        onClick={() => setAvatar(emoji)}
                      >
                        {emoji}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="settings-form-group">
                  <label htmlFor="email">Email Address (Cannot be changed here)</label>
                  <input type="email" id="email" value={email} disabled />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="fullName">Full Name</label>
                  <input 
                    type="text" 
                    id="fullName" 
                    value={fullName} 
                    onChange={(e) => setFullName(e.target.value)} 
                  />
                </div>

                <div className="settings-form-group">
                  <label htmlFor="phone">Phone Number</label>
                  <input 
                    type="tel" 
                    id="phone" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value)} 
                    placeholder="+254 700 000000"
                  />
                </div>

                <button type="submit" className="btn-save" disabled={saving}>
                  {saving ? 'Saving...' : 'Save Profile Changes'}
                </button>
              </form>
            </div>
          )}

          {/* Section: Security */}
          {activeSection === 'security' && (
            <div>
              <h3>Security</h3>
              <form onSubmit={handleUpdatePassword}>
                <div className="settings-form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input 
                    type="password" 
                    id="newPassword" 
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter a new secure password"
                  />
                </div>
                <button type="submit" className="btn-save" disabled={saving}>
                  Update Password
                </button>
              </form>
            </div>
          )}

          {/* Section: Preferences */}
          {activeSection === 'preferences' && (
            <div>
              <h3>Preferences & Customization</h3>
              <div className="settings-form-group">
                <label htmlFor="theme">Appearance (Theme)</label>
                <select id="theme" value={theme} onChange={(e) => setTheme(e.target.value)}>
                  <option value="light">Light Mode (Tatua Sasa Default)</option>
                  <option value="dark">Dark Mode</option>
                  <option value="system">System Default</option>
                </select>
              </div>

              <div className="settings-form-group">
                <label htmlFor="language">Language & Region</label>
                <select id="language" value={language} onChange={(e) => setLanguage(e.target.value)}>
                  <option value="en-US">English (US)</option>
                  <option value="en-UK">English (UK)</option>
                  <option value="sw-KE">Swahili (Kenya)</option>
                </select>
              </div>
              <button onClick={handleUpdateProfile} className="btn-save" disabled={saving}>
                Save Preferences
              </button>
            </div>
          )}

          {/* Section: Privacy */}
          {activeSection === 'privacy' && (
            <div>
              <h3>Privacy & Data Control</h3>
              <div className="action-row">
                <button className="btn-outline" onClick={() => handleDataAction('Download Personal Data')}>
                  Download My Data
                </button>
                <button className="btn-outline" onClick={() => handleDataAction('Clear Application Cache')}>
                  Clear Cache
                </button>
                <button className="btn-outline" onClick={() => handleDataAction('Opt-out of Analytics Tracking')}>
                  Manage Analytics Tracking
                </button>
              </div>
            </div>
          )}

          {/* Section: Support */}
          {activeSection === 'support' && (
            <div>
              <h3>Support & About</h3>
              <div className="support-links">
                <a href="#contact">Contact Support / Report a Bug</a>
                <a href="#terms">Terms of Service</a>
                <a href="#privacy">Privacy Policy</a>
              </div>
              <div className="app-info-text">
                Tatua Sasa Version 1.0.4<br />
                Built with React & Supabase
              </div>
            </div>
          )}

          {/* Section: Danger Zone */}
          {activeSection === 'danger' && (
            <div>
              <h3 style={{ color: '#a40606', borderColor: '#ffeaea' }}>Action Items</h3>
              <p style={{ color: '#555', marginBottom: '20px' }}>
                Manage your session or permanently remove your account from the system.
              </p>
              <div className="action-row" style={{ flexDirection: 'column', gap: '15px' }}>
                <button className="btn-outline" onClick={handleLogout} style={{ width: '100%' }}>
                  Sign Out of Tatua Sasa
                </button>
                <button className="btn-danger" onClick={handleDeleteAccount}>
                  Permanently Delete Account
                </button>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}