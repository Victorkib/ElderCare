import { useEffect, useState } from 'react';
import {
  Settings,
  User,
  Bell,
  Shield,
  Key,
  Phone,
  Mail,
  Clock,
  LogOut,
  Briefcase,
  Globe,
} from 'lucide-react';
import './AccountSettings.scss';
import apiRequest from '../../utils/api';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { TailSpin } from 'react-loader-spinner';
import ConfirmationDialog from './ConfirmationDialog';
import { Star } from '@mui/icons-material';
import { FaTools } from 'react-icons/fa';

const AccountSettings = () => {
  const [activeTab, setActiveTab] = useState('profile');
  const [userRole] = useState('caregiver');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emergencyAlertsEnabled, setEmergencyAlertsEnabled] = useState(true);
  const [timezone, setTimezone] = useState('UTC');
  const navigate = useNavigate();
  const [currentPass, setCurrentPass] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);

  // Confirmation dialog states
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);
  const [showPasswordConfirm, setShowPasswordConfirm] = useState(false);

  // Add these state variables at the top of the component with other useState declarations
  const [userDetails, setUserDetails] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    profession: '',
  });
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [isFormDirty, setIsFormDirty] = useState(false);

  // Add these functions before the return statement
  const fetchUserDetails = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get('/getUserProfile');
      const { firstName, lastName, phoneNumber, profession, timezone } =
        response.data;
      setUserDetails({ firstName, lastName, phoneNumber, profession });
      setTimezone(timezone ? timezone : 'UTC');
    } catch (error) {
      console.error('Error fetching user details:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to load user details'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
    setIsFormDirty(true);
  };

  const validateForm = () => {
    const phoneRegex = /^\+?[\d\s-]{10,}$/;

    if (!userDetails?.firstName?.trim()) {
      toast.error('First name is required');
      return false;
    }

    if (!userDetails?.lastName?.trim()) {
      toast.error('Last name is required');
      return false;
    }

    if (!userDetails?.profession?.trim()) {
      toast.error('Please enter a valid profession');
      return false;
    }

    if (
      userDetails?.phoneNumber &&
      !phoneRegex?.test(userDetails?.phoneNumber)
    ) {
      toast.error('Please enter a valid phone number');
      return false;
    }

    return true;
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setShowUpdateConfirm(true);
  };

  const confirmUpdateProfile = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.patch(
        '/updateUserProfile',
        userDetails
      );
      if (response.status) {
        toast.success('Profile updated successfully');
        setIsFormDirty(false);
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error?.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
      setShowUpdateConfirm(false);
    }
  };

  const handleTimezoneChange = (e) => {
    setTimezone(e.target.value);
    setIsFormDirty(true);
  };

  // Add useEffect for initial data fetch
  useEffect(() => {
    fetchUserDetails();
  }, []);

  // eslint-disable-next-line react/prop-types
  const TabButton = ({ value, icon: Icon, label }) => (
    <button
      className={`tab-button ${activeTab === value ? 'active' : ''}`}
      onClick={() => setActiveTab(value)}
    >
      <Icon className="tab-icon" />
      {label}
    </button>
  );

  // eslint-disable-next-line react/prop-types
  const Card = ({ title, description, children, variant }) => (
    <div className={`card ${variant || ''}`}>
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        {description && <p className="card-description">{description}</p>}
      </div>
      <div className="card-content">{children}</div>
    </div>
  );

  // eslint-disable-next-line react/prop-types
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

  const handleLogout = async () => {
    setLoading(true);
    try {
      localStorage.removeItem('authToken');
      Cookies.remove('authToken');
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      console.log('Error occured, ', error);
      toast.error(error?.response?.data?.message || 'Error logging out.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e) => {
    e.preventDefault();

    if (newPass !== confirmPass) {
      toast.error('New passwords do not match!');
      return;
    }

    setShowPasswordConfirm(true);
  };

  const confirmPasswordUpdate = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.patch('/updatePassword', {
        currentPassword: currentPass,
        newPassword: newPass,
      });

      toast.success(response.data.message || 'Password updated successfully!');
      setCurrentPass('');
      setNewPass('');
      setConfirmPass('');
      handleLogout();
    } catch (error) {
      console.error('Error updating password:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to update password'
      );
    } finally {
      setLoading(false);
      setShowPasswordConfirm(false);
    }
  };

  const handleDeactivate = async () => {
    setShowDeactivateConfirm(true);
  };

  const confirmDeactivate = async () => {
    setLoading(true);
    try {
      await apiRequest.delete('/deactivate');
      toast.success('Account successfully deactivated.');
      window.location.href = '/logout';
    } catch (error) {
      console.error('Error deactivating account:', error);
      toast.error(
        error?.response?.data?.message || 'Failed to deactivate account'
      );
    } finally {
      setLoading(false);
      setShowDeactivateConfirm(false);
    }
  };

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
              <form onSubmit={handleUpdateProfile}>
                <div className="p-2">
                  <div className="form-grid">
                    <div className="form-group">
                      <label>Update First Name</label>
                      <input
                        type="text"
                        name="firstName"
                        value={userDetails.firstName}
                        onChange={handleInputChange}
                        placeholder={
                          userDetails.firstName
                            ? userDetails.firstName
                            : 'Enter first name'
                        }
                        required
                      />
                    </div>
                    <div className="form-group">
                      <label>Update Last Name</label>
                      <input
                        type="text"
                        name="lastName"
                        value={userDetails.lastName}
                        onChange={handleInputChange}
                        placeholder={
                          userDetails.lastName
                            ? userDetails.lastName
                            : 'Enter last name'
                        }
                        required
                      />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input type="text" value={userRole} disabled />
                  </div>

                  <div className="form-grid">
                    <div className="input-icon-group">
                      <Phone className="input-icon" />
                      <input
                        type="tel"
                        name="phoneNumber"
                        value={userDetails.phoneNumber}
                        onChange={handleInputChange}
                        placeholder={
                          userDetails.phoneNumber
                            ? userDetails.phoneNumber
                            : 'Phone number'
                        }
                      />
                    </div>
                    <div className="input-icon-group">
                      <FaTools className="input-icon" />
                      <input
                        type="text"
                        name="profession"
                        value={userDetails.profession}
                        onChange={handleInputChange}
                        placeholder={
                          userDetails.profession
                            ? userDetails.profession
                            : 'profession '
                        }
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="p-4">
                  <div className="select-group">
                    <Clock className="select-icon" />
                    <select value={timezone} onChange={handleTimezoneChange}>
                      <option value="UTC">UTC</option>
                      <option value="EST">Eastern Time</option>
                      <option value="PST">Pacific Time</option>
                    </select>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    type="submit"
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300 disabled:opacity-50"
                    disabled={!isFormDirty}
                  >
                    Save Changes
                  </button>
                </div>
              </form>

              <ConfirmationDialog
                isOpen={showUpdateConfirm}
                onClose={() => setShowUpdateConfirm(false)}
                onConfirm={confirmUpdateProfile}
                title="Confirm Profile Update"
                description="Are you sure you want to update your profile information?"
                confirmText="Update Profile"
              />
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
              <div>
                <form
                  className="flex flex-col space-y-4 bg-white p-6 rounded-lg shadow-md"
                  onSubmit={handleUpdatePassword}
                >
                  <input
                    type="password"
                    placeholder="Current password"
                    value={currentPass}
                    onChange={(e) => setCurrentPass(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    value={newPass}
                    onChange={(e) => setNewPass(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={confirmPass}
                    onChange={(e) => setConfirmPass(e.target.value)}
                    className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    className="bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                    type="submit"
                  >
                    Update Password
                  </button>
                </form>
              </div>

              <Card
                title="Danger Zone"
                description="Irreversible account actions"
                variant="danger"
              >
                <button className="button danger" onClick={handleDeactivate}>
                  <LogOut className="button-icon" />
                  Deactivate Account
                </button>
              </Card>
            </div>
          )}
        </div>
      </div>
      <ConfirmationDialog
        isOpen={showLogoutConfirm}
        onClose={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogout}
        title="Confirm Logout"
        description="Are you sure you want to log out of your account?"
        confirmText="Logout"
      />

      <ConfirmationDialog
        isOpen={showPasswordConfirm}
        onClose={() => setShowPasswordConfirm(false)}
        onConfirm={confirmPasswordUpdate}
        title="Confirm Password Update"
        description="Are you sure you want to update your password? You will be logged out after the change."
        confirmText="Update Password"
      />

      <ConfirmationDialog
        isOpen={showDeactivateConfirm}
        onClose={() => setShowDeactivateConfirm(false)}
        onConfirm={confirmDeactivate}
        title="Deactivate Account"
        description="Are you sure you want to deactivate your account? This action cannot be undone."
        confirmText="Deactivate"
        variant="destructive"
      />

      <ToastContainer />
      {loading && (
        <div className="loader-overlay">
          <TailSpin
            height="100"
            width="100"
            color="#4fa94d"
            ariaLabel="loading"
            visible={true}
          />
        </div>
      )}
    </div>
  );
};

export default AccountSettings;
