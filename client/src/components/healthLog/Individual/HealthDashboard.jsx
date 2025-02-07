import { useEffect, useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import {
  //   AlertTriangle,
  //   Check,
  //   Clock,
  //   Activity,
  //   Calendar,
  //   PlusCircle,
  Download,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Phone,
  Mic,
  Volume2,
  Languages,
  FileText,
  TrendingUp,
  HeartPulse,
  Pill,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '../../ui/card';
import { useParams } from 'react-router-dom';
import apiRequest from '../../../utils/api';

const HealthDashboard = () => {
  const { elderId } = useParams();
  const [timeframe, setTimeframe] = useState('week');
  const [isRecording, setIsRecording] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteText, setNoteText] = useState('');

  // State for dynamic data
  const [patientData, setPatientData] = useState({
    name: 'Loading...',
    roomNumber: '',
    primaryCaregiver: '',
    emergencyContacts: [],
  });

  const [patientProfile, setPatientProfile] = useState({
    medicalConditions: [],
    medications: [],
  });

  // Fetch patient data on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        // Fetch patient profile
        const profileResponse = await apiRequest.get(
          `/elders/${elderId}/profile`
        );
        setPatientData({
          name: profileResponse.data.name,
          roomNumber: profileResponse.data.roomNumber,
          primaryCaregiver: 'Sarah Johnson', // Placeholder until added to backend
          emergencyContacts: profileResponse.data.emergencyContacts,
        });

        // Fetch medical profile
        const medicalProfileResponse = await apiRequest.get(
          `/elders/${elderId}/medical-profile`
        );
        setPatientProfile({
          medicalConditions: medicalProfileResponse.data.medicalConditions,
          medications: medicalProfileResponse.data.medications.map((med) => ({
            name: med,
            dosage: '500mg', // Placeholder
            frequency: 'Daily', // Placeholder
          })),
        });

        // Fetch blood pressure trends
        // const bloodPressureResponse = await apiRequest.get(
        //   `/elderHealthLog/${elderId}/blood-pressure?timeframe=${timeframe}`
        // );
        // setHealthMetrics((prev) => ({
        //   ...prev,
        //   bloodPressure: bloodPressureResponse.data,
        // }));

        // Fetch recent alerts
        // const alertsResponse = await apiRequest.get(
        //   `/elderHealthLog/${elderId}/recent-alerts`
        // );
        // setRecentAlerts(alertsResponse.data);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (elderId) {
      fetchPatientData();
    }
  }, [elderId, timeframe]);

  // Consolidated Patient Data
  //   const patientData = {
  //     name: 'John Smith',
  //     age: 75,
  //     roomNumber: '203',
  //     primaryCaregiver: 'Sarah Johnson',
  //     emergencyContacts: [
  //       { name: 'Mary Smith', relation: 'Daughter', phone: '(555) 123-4567' },
  //       { name: 'James Smith', relation: 'Son', phone: '(555) 765-4321' },
  //     ],
  //   };

  // Comprehensive Health Metrics
  const healthMetrics = {
    bloodPressure: [
      { date: '2025-01-01', value: '120/80', notes: 'Normal reading' },
      { date: '2025-01-15', value: '125/85', notes: 'Slight elevation' },
      { date: '2025-01-29', value: '118/79', notes: 'Back to normal range' },
    ],
    weight: [
      { date: '2025-01-01', value: '68 kg' },
      { date: '2025-01-15', value: '67 kg' },
      { date: '2025-01-29', value: '68 kg' },
    ],
    medication: [
      { date: '2024-03-20', adherence: 100, count: 3 },
      { date: '2024-03-21', adherence: 85, count: 4 },
      { date: '2024-03-22', adherence: 90, count: 3 },
    ],
  };

  const recentAlerts = [
    {
      date: '2025-01-29',
      type: 'Blood Pressure',
      message: 'Above normal range',
    },
    {
      date: '2025-01-28',
      type: 'Medication',
      message: 'Missed evening dose',
    },
  ];

  //   const upcomingTasks = [
  //     {
  //       id: 1,
  //       type: 'medication',
  //       name: 'Blood Pressure Med',
  //       time: '09:00',
  //       status: 'pending',
  //     },
  //     {
  //       id: 2,
  //       type: 'appointment',
  //       name: 'Dr. Smith Checkup',
  //       time: '14:30',
  //       status: 'confirmed',
  //     },
  //     {
  //       id: 3,
  //       type: 'daily-care',
  //       name: 'Physical Exercise',
  //       time: '11:00',
  //       status: 'missed',
  //     },
  //   ];

  const handleAddNote = (date) => {
    setSelectedDate(date);
    setShowNoteModal(true);
  };

  const saveNote = () => {
    // Placeholder for note saving logic
    console.log(`Saving note for ${selectedDate}: ${noteText}`);
    setShowNoteModal(false);
    setNoteText('');
  };

  const bloodPressureChartData = healthMetrics.bloodPressure.map((bp) => ({
    date: bp.date,
    systolic: parseInt(bp.value.split('/')[0]),
    diastolic: parseInt(bp.value.split('/')[1]),
  }));

  // Added from ElderlyCareDashboard
  //   const patientProfile = {
  //     medicalConditions: [
  //       'Hypertension',
  //       'Diabetes Type 2',
  //       'Early Stage Dementia',
  //     ],
  //     medications: [
  //       { name: 'Metformin', dosage: '500mg', frequency: 'Twice daily' },
  //       { name: 'Lisinopril', dosage: '10mg', frequency: 'Once daily' },
  //       { name: 'Donepezil', dosage: '5mg', frequency: 'Evening' },
  //     ],
  //   };

  return (
    <div className="health-dashboard p-6 space-y-6 mt-14">
      {/* Dashboard Header */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold">
            {patientData.name}
            {`'`}s Health Dashboard
          </h1>
          <p className="text-gray-500">
            Room {patientData.roomNumber} | Primary Caregiver:{' '}
            {patientData.primaryCaregiver}
          </p>
        </div>
        <div className="flex gap-4">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
            className="px-3 py-2 border rounded-lg"
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50">
            <Download size={20} />
            Export Data
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            <Plus size={20} />
            New Health Log
          </button>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Emergency Contacts */}
        <Card>
          <CardHeader>
            <CardTitle>Emergency Contacts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {patientData.emergencyContacts.map((contact, index) => (
                <div key={index} className="flex items-start gap-3">
                  <Phone className="text-gray-400" size={20} />
                  <div>
                    <p className="font-medium">{contact.name}</p>
                    <p className="text-sm text-gray-500">{contact.relation}</p>
                    <p className="text-sm text-blue-600">{contact.phone}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentAlerts.map((alert, index) => (
                <div key={index} className="flex items-start gap-3">
                  <AlertCircle className="text-red-500" size={20} />
                  <div>
                    <p className="font-medium">{alert.type}</p>
                    <p className="text-sm text-gray-500">{alert.message}</p>
                    <p className="text-sm text-gray-400">{alert.date}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <button
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50"
                onClick={() => setIsRecording(!isRecording)}
              >
                {isRecording ? <Volume2 size={24} /> : <Mic size={24} />}
                <span className="text-sm">Voice Note</span>
              </button>
              <button
                className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50"
                onClick={() =>
                  handleAddNote(new Date().toISOString().split('T')[0])
                }
              >
                <FileText size={24} />
                <span className="text-sm">Add Note</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
                <TrendingUp size={24} />
                <span className="text-sm">View Trends</span>
              </button>
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
                <Languages size={24} />
                <span className="text-sm">Translate</span>
              </button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {' '}
        {/* Medical Conditions */}
        <Card>
          <CardHeader>
            <CardTitle>Medical Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {patientProfile.medicalConditions.map((condition, index) => (
              <div key={index} className="flex items-center mb-2">
                <HeartPulse className="mr-3 text-blue-500" size={20} />
                <span>{condition}</span>
              </div>
            ))}
          </CardContent>
        </Card>
        {/* Medications */}
        <Card>
          <CardHeader>
            <CardTitle>Current Medications</CardTitle>
          </CardHeader>
          <CardContent>
            {patientProfile.medications.map((med, index) => (
              <div key={index} className="flex items-center mb-2">
                <Pill className="mr-3 text-purple-500" size={20} />
                <div>
                  <p className="font-medium">{med.name}</p>
                  <p className="text-sm text-gray-600">
                    {med.dosage} - {med.frequency}
                  </p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Health Metrics Sections */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Blood Pressure Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Blood Pressure Trends</CardTitle>
            <CardDescription>
              Systolic and Diastolic Pressure Over Time
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart
                data={bloodPressureChartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="systolic"
                  stroke="#8884d8"
                  name="Systolic"
                />
                <Line
                  type="monotone"
                  dataKey="diastolic"
                  stroke="#82ca9d"
                  name="Diastolic"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Medication Adherence */}
        <Card>
          <CardHeader>
            <CardTitle>Medication Adherence</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={healthMetrics.medication}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="adherence" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Health Log Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Health Log Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {healthMetrics.bloodPressure.map((entry, index) => (
              <div key={index} className="flex items-start gap-4 relative">
                <div className="min-w-[100px] text-sm text-gray-500">
                  {entry.date}
                </div>
                <div className="flex-1 bg-gray-50 p-4 rounded-lg">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-medium">Blood Pressure Reading</p>
                      <p className="text-lg">{entry.value}</p>
                      <p className="text-sm text-gray-500 mt-2">
                        {entry.notes}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 hover:bg-gray-200 rounded">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Note Modal */}
      {showNoteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg w-96">
            <h3 className="text-lg font-semibold mb-4">
              Add Note for {selectedDate}
            </h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              className="w-full h-32 p-2 border rounded-lg mb-4"
              placeholder="Enter your note here..."
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setShowNoteModal(false)}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={saveNote}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HealthDashboard;
