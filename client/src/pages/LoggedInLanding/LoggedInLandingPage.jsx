import { useState } from 'react';
import { useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

const LoggedInLandingPage = () => {
  const navigate = useNavigate();

  const loggedInUser = useSelector((store) => store.user.user);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Sample data for demonstration purposes

  const elderlyUsers = [
    {
      id: 1,
      name: 'Alice Smith',
      lastHealthLog: '2023-10-01',
      nextAppointment: '2023-10-15',
      healthStatus: 'Stable',
    },
    {
      id: 2,
      name: 'Bob Johnson',
      lastHealthLog: '2023-09-28',
      nextAppointment: '2023-10-10',
      healthStatus: 'Needs Attention',
    },
  ];

  const reminders = [
    { id: 1, task: 'Take medication', time: '08:00 AM', status: 'Pending' },
    {
      id: 2,
      task: 'Doctor appointment',
      time: '10:00 AM',
      status: 'Completed',
    },
  ];

  const healthLogs = [
    { id: 1, date: '2023-10-01', bloodPressure: '120/80', weight: '70 kg' },
    { id: 2, date: '2023-09-28', bloodPressure: '130/85', weight: '71 kg' },
  ];

  const emergencyContacts = [
    {
      id: 1,
      name: 'Dr. Jane Doe',
      relationship: 'Primary Care Physician',
      phone: '+1 (555) 123-4567',
    },
    {
      id: 2,
      name: 'John Smith',
      relationship: 'Family Member',
      phone: '+1 (555) 987-6543',
    },
    {
      id: 3,
      name: 'Emergency Services',
      relationship: 'Emergency',
      phone: '911',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-14">
      {/* Header Section */}
      <header className="bg-white shadow-md p-4 rounded-lg mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Elderly Care Management System
          </h1>
          <p className="text-gray-600">
            Welcome back, {loggedInUser.firstName} ({loggedInUser.profession})
          </p>
        </div>
        <Link to="/accountSettings">
          <img
            src={
              loggedInUser.profile ? loggedInUser.profile : '/userProfile.avif'
            }
            alt="Profile"
            className="w-12 h-12 rounded-full"
          />
        </Link>
      </header>

      {/* Quick Actions Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <button
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          onClick={() => navigate('/elderReg')}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Register New Elderly
          </h2>
          <p className="text-gray-600">Add a new elderly user to the system.</p>
        </button>
        <button
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          onClick={() => navigate('/addHealthLog')}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Add Health Log
          </h2>
          <p className="text-gray-600">
            Log new health data for an elderly user.
          </p>
        </button>
        <button
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          onClick={() => navigate('/caregiver')}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Manage Care Team
          </h2>
          <p className="text-gray-600">
            Update the Elderly Care Management team.
          </p>
        </button>
        <button
          className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
          onClick={() => navigate('/scheduler')}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Set Reminder
          </h2>
          <p className="text-gray-600">
            Create a new task or medication reminder.
          </p>
        </button>
      </div>

      {/* Main Content Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Elderly Users Overview */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Elderly Users
          </h2>

          {/* Loading State */}
          {isLoading ? (
            <div className="flex justify-center items-center py-6">
              <span className="text-gray-500">Loading...</span>
            </div>
          ) : (
            <ul>
              {elderlyUsers.length > 0 ? (
                <li key={elderlyUsers[0].id} className="mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-700">
                      {elderlyUsers[0].name}
                    </span>
                    <span
                      className={`text-sm ${
                        elderlyUsers[0].healthStatus === 'Stable'
                          ? 'text-green-500'
                          : 'text-red-500'
                      }`}
                    >
                      {elderlyUsers[0].healthStatus}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500">
                    Last Health Log: {elderlyUsers[0].lastHealthLog}
                  </div>
                  <div className="text-sm text-gray-500">
                    Next Appointment: {elderlyUsers[0].nextAppointment}
                  </div>
                </li>
              ) : (
                <li className="text-sm text-gray-500">
                  No elderly users available.{' '}
                  <span className="text-blue-600 cursor-pointer">
                    Add new users
                  </span>
                  .
                </li>
              )}
            </ul>
          )}

          {/* Error State */}
          {error && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded">
              Something went wrong while fetching the users. Please try again.
            </div>
          )}

          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => navigate('/organizedElders')}
          >
            View All Elderly Users
          </button>
        </div>

        {/* Reminders Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Reminders
          </h2>
          <ul>
            {reminders.map((reminder) => (
              <li key={reminder.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{reminder.task}</span>
                  <span className="text-sm text-gray-500">{reminder.time}</span>
                </div>
                <div
                  className={`text-sm ${
                    reminder.status === 'Completed'
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {reminder.status}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => navigate('/scheduler')}
          >
            Add New Reminder
          </button>
        </div>

        {/* Health Logs Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Health Logs
          </h2>
          <ul>
            {healthLogs.map((log) => (
              <li key={log.id} className="mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-700">{log.date}</span>
                  <span className="text-sm text-gray-500">
                    Blood Pressure: {log.bloodPressure}
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  Weight: {log.weight}
                </div>
              </li>
            ))}
          </ul>
          <button
            className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
            onClick={() => navigate('/addHealthLog')}
          >
            Add New Health Log
          </button>
        </div>
      </div>

      {/* Emergency Contacts Section */}
      <div className="mt-6 bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          Emergency Contacts
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {emergencyContacts.map((contact) => (
            <div key={contact.id} className="bg-gray-50 p-4 rounded-lg">
              <h3 className="text-lg font-medium text-gray-700">
                {contact.name}
              </h3>
              <p className="text-sm text-gray-500">{contact.relationship}</p>
              <p className="text-sm text-gray-500">Phone: {contact.phone}</p>
            </div>
          ))}
        </div>
        <button
          className="mt-4 w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
          onClick={() => navigate('/manage-contacts')}
        >
          Manage Emergency Contacts
        </button>
      </div>

      {/* Footer Section */}
      <footer className="mt-6 text-center text-gray-600">
        <p>&copy; 2023 Elderly Care Management System. All rights reserved.</p>
      </footer>
    </div>
  );
};

export default LoggedInLandingPage;
