/* eslint-disable react/prop-types */
// AccountSettings.jsx
import { useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Phone,
  Mail,
  Clock,
  //   Heart,
  LogOut,
} from 'lucide-react';
import './AccountSettings.scss';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userRole] = useState('caregiver');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [timezone, setTimezone] = useState('UTC');

  const TabButton = ({ value, icon: Icon, label }) => (
    <button
      className={`tab-button ${activeTab === value ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      <Icon className="tab-icon" />
      {label}
    </button>
  );

  const Card = ({ title, description, children, variant }) => (
    <div className={`card ${variant || ''}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
      <div className="card-content">{children}</div>
    </div>
  );

  const Toggle = ({ checked, onChange }) => (
    <label className="toggle">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className="toggle-slider" />
    </label>
  );

  return (
    <div className="account-settings">
      <div className="header">
        <Settings className="header-icon" />
        <div>
          <h1>Account Settings</h1>
          <p>Manage your account preferences and settings</p>
        </div>
      </div>

      <div className="tabs-container">
        <div className="tabs-list">
          <TabButton value="profile" icon={User} label="Profile" />
          <TabButton value="notifications" icon={Bell} label="Notifications" />
          <TabButton value="privacy" icon={Shield} label="Privacy" />
          <TabButton value="security" icon={Key} label="Security" />
        </div>

        <div className="tab-content">
          {activeTab === 'profile' && (
            <div className="tab-panel">
              <Card
                title="Personal Information"
                description="Update your personal details"
              >
                <div className="form-grid">
                  <div className="form-group">
                    <label>First Name</label>
                    <input type="text" placeholder="Enter first name" />
                  </div>
                  <div className="form-group">
                    <label>Last Name</label>
                    <input type="text" placeholder="Enter last name" />
                  </div>
                </div>

                <div className="form-group">
                  <label>Role</label>
                  <input type="text" value={userRole} disabled />
                </div>

                <div className="form-grid">
                  <div className="input-icon-group">
                    <Phone className="input-icon" />
                    <input type="tel" placeholder="Phone number" />
                  </div>
                  <div className="input-icon-group">
                    <Mail className="input-icon" />
                    <input type="email" placeholder="Email address" />
                  </div>
                </div>
              </Card>

              <Card
                title="Time Zone Settings"
                description="Set your preferred time zone"
              >
                <div className="select-group">
                  <Clock className="select-icon" />
                  <select
                    value={timezone}
                    onChange={(e) => setTimezone(e.target.value)}
                  >
                    <option value="UTC">UTC</option>
                    <option value="EST">Eastern Time</option>
                    <option value="PST">Pacific Time</option>
                  </select>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'notifications' && (
            <Card
              title="Notification Preferences"
              description="Manage notifications"
            >
              <div className="notification-item">
                <div>
                  <h4>General Notifications</h4>
                  <p>Receive updates about daily tasks and reminders</p>
                </div>
                <Toggle
                  checked={notificationsEnabled}
                  onChange={setNotificationsEnabled}
                />
              </div>

              <div className="notification-item">
                <div>
                  <h4>Emergency Alerts</h4>
                  <p>Get immediate notifications for emergencies</p>
                </div>
                <Toggle
                  checked={emergencyAlertsEnabled}
                  onChange={setEmergencyAlertsEnabled}
                />
              </div>
            </Card>
          )}
          {activeTab === 'privacy' && (
            <div className="tab-panel">
              <Card
                title="Data Sharing"
                description="Control your health information sharing"
              >
                <div className="privacy-section">
                  <div className="privacy-item">
                    <div>
                      <h4>Health Records Access</h4>
                      <p>
                        Allow healthcare providers to access medical history
                      </p>
                    </div>
                    <select className="privacy-select">
                      <option value="all">All Healthcare Team</option>
                      <option value="primary">Primary Doctor Only</option>
                      <option value="none">No Access</option>
                    </select>
                  </div>

                  <div className="privacy-item">
                    <div>
                      <h4>Emergency Contact Visibility</h4>
                      <p>Control who can view emergency contact information</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>

                  <div className="privacy-item">
                    <div>
                      <h4>Medication History</h4>
                      <p>
                        Share medication schedule and history with caregivers
                      </p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
              </Card>

              <Card
                title="Location Services"
                description="Manage location sharing preferences"
              >
                <div className="privacy-section">
                  <div className="privacy-item">
                    <div>
                      <h4>Emergency Location Access</h4>
                      <p>
                        Share location with emergency contacts during alerts
                      </p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>

                  <div className="privacy-item">
                    <div>
                      <h4>Caregiver Location Sharing</h4>
                      <p>Allow caregivers to view your general location</p>
                    </div>
                    <select className="privacy-select">
                      <option value="always">Always</option>
                      <option value="emergency">Emergency Only</option>
                      <option value="never">Never</option>
                    </select>
                  </div>
                </div>
              </Card>

              <Card
                title="Communication Privacy"
                description="Control messaging and communication settings"
              >
                <div className="privacy-section">
                  <div className="privacy-item">
                    <div>
                      <h4>Message Visibility</h4>
                      <p>Control who can see communication history</p>
                    </div>
                    <select className="privacy-select">
                      <option value="team">Care Team Only</option>
                      <option value="family">Family Only</option>
                      <option value="both">Both</option>
                    </select>
                  </div>

                  <div className="privacy-item">
                    <div>
                      <h4>Health Updates Sharing</h4>
                      <p>Share daily health updates with care team</p>
                    </div>
                    <Toggle checked={true} onChange={() => {}} />
                  </div>
                </div>
              </Card>
            </div>
          )}
          {activeTab === 'security' && (
            <div className="tab-panel">
              <Card title="Password" description="Change your password">
                <div className="form-stack">
                  <input type="password" placeholder="Current password" />
                  <input type="password" placeholder="New password" />
                  <input type="password" placeholder="Confirm new password" />
                  <button className="button primary">Update Password</button>
                </div>
              </Card>

              <Card
                title="Danger Zone"
                description="Irreversible account actions"
                variant="danger"
              >
                <button className="button danger">
                  <LogOut className="button-icon" />
                  Deactivate Account
                </button>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccountSettings;
