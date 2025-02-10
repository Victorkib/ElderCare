import { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  Download,
  Plus,
  Clock,
  Edit2,
  Trash2,
  AlertCircle,
  Phone,
  Mic,
  Volume2,
  Languages,
  FileText,
  TrendingUp,
  Calendar,
  Activity,
  Bell,
  UserPlus,
  Filter,
  MoreVertical,
  ChevronDown,
  Heart,
  Brain,
  Thermometer,
  Camera,
  PlusCircle,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import { cn } from '../../utils/util';
import apiRequest from '../../utils/api';
import { useNavigate, useParams } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import NotesModal from './NotesModal';
import MedicationInput from '../healthLog/Individual/MedicationInput';
import { DatePicker } from 'antd';
import moment from 'moment';
import { TailSpin } from 'react-loader-spinner';
import ExportButton from '../ui/ExportButton';
import { Button } from '@mui/material';
import { MedicationLiquid, Schedule } from '@mui/icons-material';

const HealthcareDashboard = () => {
  const { elderId } = useParams();
  const [showVitalsModal, setShowVitalsModal] = useState(false);
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteText, setNoteText] = useState('');
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  // Enhanced patient data
  const [patientData, setPatientData] = useState({
    name: 'John Smith',
    age: 75,
    roomNumber: '203',
    primaryCaregiver: 'Sarah Johnson',
    insurance: 'Medicare Plus',
    admissionDate: '2025-01-15',
    allergies: ['Penicillin', 'Shellfish'],
    bloodType: 'O+',
    diagnoses: [
      { condition: 'Hypertension', since: '2020' },
      { condition: 'Type 2 Diabetes', since: '2019' },
    ],
    emergencyContacts: [
      {
        name: 'Mary Smith',
        relation: 'Daughter',
        phone: '(555) 123-4567',
        email: 'mary@email.com',
      },
      {
        name: 'James Smith',
        relation: 'Son',
        phone: '(555) 765-4321',
        email: 'james@email.com',
      },
    ],
  });

  // Enhanced health metrics with more detailed data
  const [healthMetrics, setHealthMetrics] = useState({
    bloodPressure: [
      {
        date: '2025-01-01',
        systolic: 120,
        diastolic: 80,
        pulse: 72,
        time: '08:00',
        notes: 'Morning reading',
      },
      {
        date: '2025-01-15',
        systolic: 125,
        diastolic: 85,
        pulse: 75,
        time: '08:30',
        notes: 'Slight elevation',
      },
      {
        date: '2025-01-29',
        systolic: 118,
        diastolic: 79,
        pulse: 70,
        time: '09:00',
        notes: 'Back to normal range',
      },
    ],
    weight: [
      { date: '2025-01-01', value: 165, unit: 'lbs', bmi: 24.2 },
      { date: '2025-01-15', value: 163, unit: 'lbs', bmi: 23.9 },
      { date: '2025-01-29', value: 164, unit: 'lbs', bmi: 24.0 },
    ],
    glucose: [
      { date: '2025-01-29', value: 110, time: '08:00', type: 'Fasting' },
      { date: '2025-01-29', value: 142, time: '13:00', type: 'Post-lunch' },
      { date: '2025-01-29', value: 125, time: '20:00', type: 'Evening' },
    ],
  });

  // Medication schedule with enhanced tracking
  const [medications, setMedications] = useState([
    {
      name: 'Lisinopril',
      dosage: '10mg',
      frequency: 'Once daily',
      timeSlots: ['08:00'],
      status: 'active',
      refillDate: '2025-02-15',
      sideEffects: ['Dry cough', 'Dizziness'],
      adherence: 95,
    },
    {
      name: 'Metformin',
      dosage: '500mg',
      frequency: 'Twice daily',
      timeSlots: ['08:00', '20:00'],
      status: 'active',
      refillDate: '2025-02-10',
      sideEffects: ['Nausea'],
      adherence: 92,
    },
  ]);

  // Care team with availability status
  const careTeam = [
    {
      name: 'Dr. Sarah Johnson',
      role: 'Primary Physician',
      available: true,
      nextVisit: '2025-02-05 10:00',
      contact: '555-0123',
    },
    {
      name: 'Nurse Michael Chen',
      role: 'Primary Nurse',
      available: true,
      shift: '07:00-19:00',
      contact: '555-0124',
    },
    {
      name: 'Dr. Emily Williams',
      role: 'Cardiologist',
      available: false,
      nextVisit: '2025-02-10 14:00',
      contact: '555-0125',
    },
  ];

  // Recent activities and alerts
  const recentAlerts = [
    {
      id: 1,
      date: '2025-01-29 08:15',
      type: 'Blood Pressure',
      severity: 'moderate',
      message: 'Above normal range',
      action: 'Monitoring required',
    },
    {
      id: 2,
      date: '2025-01-28 20:00',
      type: 'Medication',
      severity: 'high',
      message: 'Missed evening dose',
      action: 'Immediate attention required',
    },
  ];

  // Upcoming appointments and tasks
  const [appointments, setAppointments] = useState([]);

  const medicationData = [
    { date: '2024-03-20', adherence: 100, count: 3 },
    { date: '2024-03-21', adherence: 85, count: 4 },
    { date: '2024-03-22', adherence: 90, count: 3 },
    { date: '2024-03-23', adherence: 95, count: 4 },
    { date: '2024-03-24', adherence: 80, count: 3 },
  ];
  const fetchUserGeneralData = async () => {
    setLoading(true);
    try {
      const response = await apiRequest.get(
        `/elderHealthLog/getPatientData/${elderId}`
      );
      if (response.status) {
        const { patientData, healthMetrics, medications, appointments } =
          response.data.data;
        setPatientData(patientData);
        setHealthMetrics(healthMetrics);
        setMedications(medications);
        appointments.length > 0 && setAppointments(appointments);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'Error Fetching Data!');
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchUserGeneralData();
  }, []);

  const handleAddNote = (date) => {
    setSelectedDate(date);
    setShowNoteModal(true);
  };

  const saveNote = () => {
    // Save note logic here
    setShowNoteModal(false);
    setNoteText('');
  };

  const totalPages = Math.ceil(medications.length / itemsPerPage);
  // Get current medications
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentMedications =
    medications && medications?.slice(indexOfFirstItem, indexOfLastItem);

  const paginate = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const VitalsModal = ({ onClose, onSubmit, elderId }) => {
    const [submitStatus, setSubmitStatus] = useState(null);
    const [formData, setFormData] = useState({
      elderlyId: elderId,
      bloodPressure: '',
      weight: '',
      heartRate: '',
      glucose: '',
      oxygen: '',
      temperature: '',
      painLevel: '',
      notes: '',
      medications: [],
      logDateTime: null, // Default to null for user input
    });

    const [errors, setErrors] = useState({});

    const validateForm = () => {
      const newErrors = {};

      // Log Date & Time validation
      if (!formData.logDateTime) {
        newErrors.logDateTime = 'Date and time are required';
      } else if (moment(formData.logDateTime).isAfter(moment())) {
        newErrors.logDateTime = 'Cannot select future date/time';
      }

      // Blood Pressure validation
      if (!formData.bloodPressure) {
        newErrors.bloodPressure = 'Blood pressure is required';
      } else if (!/^\d{2,3}\/\d{2,3}$/.test(formData.bloodPressure)) {
        newErrors.bloodPressure = 'Please enter in format like 120/80';
      }

      // Weight validation
      if (!formData.weight) {
        newErrors.weight = 'Weight is required';
      } else if (formData.weight < 20 || formData.weight > 200) {
        newErrors.weight = 'Please enter a valid weight between 20-200 kg';
      }

      // (Continue validation for other fields)
      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!validateForm()) return;

      setLoading(true);
      try {
        // Send POST request using Axios
        const response = await apiRequest.post(
          '/elderHealthLog/addHealthLog',
          formData
        );

        // Callback on successful submission
        onSubmit?.(response.data);
        await fetchUserGeneralData();
        setSubmitStatus('success');

        // Close modal after a short delay
        setTimeout(() => {
          onClose();
        }, 1500);
      } catch (error) {
        console.error('Error submitting data:', error);
        setSubmitStatus('error');
      } finally {
        setLoading(false);
      }
    };

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };

    const handleDateChange = (value) => {
      setFormData((prev) => ({
        ...prev,
        logDateTime: value,
      }));
    };

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-lg p-6 w-full max-w-3xl max-h-[70vh] overflow-y-auto mt-11">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold">Record Vital Signs</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Blood Pressure */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Blood Pressure (mmHg)
                </label>
                <input
                  type="text"
                  name="bloodPressure"
                  value={formData.bloodPressure}
                  onChange={handleInputChange}
                  placeholder="e.g., 120/80"
                  className={`w-full border rounded-md p-2 ${
                    errors.bloodPressure ? 'border-red-500' : ''
                  }`}
                />
                {errors.bloodPressure && (
                  <p className="text-red-500 text-sm">{errors.bloodPressure}</p>
                )}
              </div>

              {/* Weight */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">Weight (kg)</label>
                <input
                  type="number"
                  name="weight"
                  value={formData.weight}
                  onChange={handleInputChange}
                  min={20}
                  max={200}
                  step={0.1}
                  className={`w-full border rounded-md p-2 ${
                    errors.weight ? 'border-red-500' : ''
                  }`}
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm">{errors.weight}</p>
                )}
              </div>

              {/* Heart Rate */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Heart Rate (bpm)
                </label>
                <input
                  type="number"
                  name="heartRate"
                  value={formData.heartRate}
                  onChange={handleInputChange}
                  min={40}
                  max={200}
                  className={`w-full border rounded-md p-2 ${
                    errors.heartRate ? 'border-red-500' : ''
                  }`}
                />
                {errors.heartRate && (
                  <p className="text-red-500 text-sm">{errors.heartRate}</p>
                )}
              </div>

              {/* Glucose */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Blood Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  name="glucose"
                  value={formData.glucose}
                  onChange={handleInputChange}
                  min={20}
                  max={600}
                  className={`w-full border rounded-md p-2 ${
                    errors.glucose ? 'border-red-500' : ''
                  }`}
                />
                {errors.glucose && (
                  <p className="text-red-500 text-sm">{errors.glucose}</p>
                )}
              </div>

              {/* Oxygen */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Oxygen Saturation (%)
                </label>
                <input
                  type="number"
                  name="oxygen"
                  value={formData.oxygen}
                  onChange={handleInputChange}
                  min={50}
                  max={100}
                  className={`w-full border rounded-md p-2 ${
                    errors.oxygen ? 'border-red-500' : ''
                  }`}
                />
                {errors.oxygen && (
                  <p className="text-red-500 text-sm">{errors.oxygen}</p>
                )}
              </div>

              {/* Temperature */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Temperature (°C)
                </label>
                <input
                  type="number"
                  name="temperature"
                  value={formData.temperature}
                  onChange={handleInputChange}
                  min={35}
                  max={42}
                  step={0.1}
                  className={`w-full border rounded-md p-2 ${
                    errors.temperature ? 'border-red-500' : ''
                  }`}
                />
                {errors.temperature && (
                  <p className="text-red-500 text-sm">{errors.temperature}</p>
                )}
              </div>

              {/* Pain Level */}
              <div className="space-y-2">
                <label className="block text-sm font-medium">
                  Pain Level (1-10)
                </label>
                <select
                  name="painLevel"
                  value={formData.painLevel}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="">Select pain level</option>
                  {[...Array(10)].map((_, i) => (
                    <option key={i + 1} value={i + 1}>
                      {i + 1}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Medications */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Medications Administered
              </label>
              <MedicationInput
                value={formData.medications}
                onChange={(updatedMedications) =>
                  setFormData((prev) => ({
                    ...prev,
                    medications: updatedMedications,
                  }))
                }
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={4}
                maxLength={500}
                placeholder="Enter detailed observations..."
                className={`w-full border rounded-md p-2 ${
                  errors.notes ? 'border-red-500' : ''
                }`}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formData.notes.length}/500 characters</span>
                {errors.notes && (
                  <span className="text-red-500">{errors.notes}</span>
                )}
              </div>
            </div>

            {/* Log Date & Time */}
            <div className="space-y-2">
              <label className="block text-sm font-medium">
                Log Date & Time
              </label>
              <DatePicker
                showTime
                value={formData.logDateTime}
                onChange={handleDateChange}
                className={`w-full border rounded-md p-2 ${
                  errors.logDateTime ? 'border-red-500' : ''
                }`}
              />
              {errors.logDateTime && (
                <p className="text-red-500 text-sm">{errors.logDateTime}</p>
              )}
            </div>

            {/* Submit Status Alerts */}
            {submitStatus === 'success' && (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                Vital signs recorded successfully!
              </div>
            )}
            {submitStatus === 'error' && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                Failed to record vital signs. Please try again.
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className={`px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 ${
                  loading ? 'cursor-not-allowed' : ''
                }`}
              >
                {loading ? 'Saving...' : 'Save Vitals'}
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white border-b fixed top-0 left-0 right-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold">Healthcare Dashboard</h1>
            </div>
            <div className="flex items-center gap-4">
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Bell size={20} />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Filter size={20} />
              </button>
              <div className="flex items-center gap-2">
                <img
                  src="/userProfile.avif"
                  alt="User"
                  className="w-8 h-8 rounded-full"
                />
                <ChevronDown size={16} />
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="pt-16">
        {/* Patient Header */}
        <div className="bg-white border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <div className="mb-4 sm:mb-0">
                <div className="flex items-center gap-4">
                  <img
                    src="/userProfile.avif"
                    alt={patientData.name}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h2 className="text-2xl font-bold">{patientData.name}</h2>
                    <p className="text-gray-500">
                      Room {patientData.roomNumber} | Age: {patientData.age} |
                      Blood Type: {patientData.bloodType}
                    </p>
                    <div className="flex gap-2 mt-1 flex-wrap">
                      {patientData.allergies.map((allergy) => (
                        <span
                          key={allergy}
                          className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-sm"
                        >
                          {allergy}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Buttons Section */}
              <div className="grid grid-cols-2 sm:flex sm:gap-2 sm:flex-wrap w-full sm:w-auto gap-2 p-2">
                <button className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
                  <ExportButton
                    patientData={patientData}
                    healthMetrics={healthMetrics}
                    medications={medications}
                    careTeam={careTeam}
                    recentAlerts={recentAlerts}
                  />
                </button>
                <button
                  onClick={() => setShowVitalsModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                >
                  <Plus size={20} />
                  Record Vitals
                </button>
                <button
                  onClick={() => setShowNotesModal(true)}
                  className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm"
                >
                  <FileText size={20} />
                  Add Note
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Vital Signs Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="text-red-500" />
                  Vital Signs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-sm text-gray-500">Blood Pressure</p>
                      <p className="text-xl font-bold">
                        {healthMetrics.bloodPressure[0].systolic}/
                        {healthMetrics.bloodPressure[0].diastolic}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-500">Pulse</p>
                      <p className="text-xl font-bold">
                        {healthMetrics.bloodPressure[0].pulse}
                      </p>
                    </div>
                  </div>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart
                        data={healthMetrics.bloodPressure}
                        margin={{ top: 20, right: 20, left: 0, bottom: 0 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip />
                        <Line
                          type="monotone"
                          dataKey="systolic"
                          stroke="#ef4444"
                        />
                        <Line
                          type="monotone"
                          dataKey="diastolic"
                          stroke="#3b82f6"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Medications Card */}
            <Card className="h-full flex flex-col">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="text-blue-500" />
                  Medications
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col justify-between">
                <div className="space-y-4 flex-1">
                  {currentMedications && currentMedications.length > 0 ? (
                    currentMedications.map((med, index) => (
                      <div key={index} className="p-3 bg-gray-50 rounded-lg">
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{med.name}</p>
                            <p className="text-sm text-gray-500">
                              {med.dosage} - {med.frequency}
                            </p>
                          </div>
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              med.adherence >= 90
                                ? 'bg-green-100 text-green-800'
                                : med.adherence >= 70
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-red-100 text-red-800'
                            }`}
                          >
                            {med.adherence}% adherence
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="flex gap-2">
                            {med.timeSlots.map((time) => (
                              <span
                                key={time}
                                className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm"
                              >
                                {time}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mt-2 text-sm text-gray-500">
                          Refill by: {med.refillDate}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-10">
                      <p className="text-gray-500 text-center">
                        No current medications found. Click below to manage
                        medications.
                      </p>
                      <Button
                        variant="contained"
                        startIcon={<MedicationLiquid />}
                        className="border border-gray-400 px-4 py-2 rounded-lg"
                        // onClick={() =>
                        //   navigate(`/medication-manager`, {
                        //     state: {
                        //       elderId: elderId,
                        //     },
                        //   })
                        // }
                        onClick={() => setShowVitalsModal(true)}
                      >
                        Log New Medication
                      </Button>
                    </div>
                  )}
                </div>

                {/* Pagination Controls */}
                {currentMedications && currentMedications.length > 0 && (
                  <div className="mt-6 flex items-center justify-center gap-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex gap-1">
                      {[...Array(totalPages)].map((_, index) => (
                        <button
                          key={index}
                          onClick={() => paginate(index + 1)}
                          className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                            currentPage === index + 1
                              ? 'bg-blue-100 text-blue-800'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                    </div>

                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-1 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Alerts & Tasks Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <AlertCircle className="text-yellow-500" />
                  Alerts & Tasks
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentAlerts.map((alert) => (
                    <Alert
                      key={alert.id}
                      className={`${
                        alert.severity === 'high'
                          ? 'border-red-500'
                          : alert.severity === 'moderate'
                          ? 'border-yellow-500'
                          : 'border-blue-500'
                      }`}
                    >
                      <AlertTitle className="flex items-center gap-2">
                        <Clock size={16} />
                        {alert.type}
                      </AlertTitle>
                      <AlertDescription>
                        <p>{alert.message}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {alert.date}
                        </p>
                      </AlertDescription>
                    </Alert>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Care Team Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserPlus className="text-green-500" />
                  Care Team
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {careTeam.map((member) => (
                    <div
                      key={member.name}
                      className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium">{member.name}</p>
                        <p className="text-sm text-gray-500">{member.role}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          Next visit: {member.nextVisit || 'Not scheduled'}
                        </p>
                      </div>
                      <div className="flex flex-col items-end">
                        <span
                          className={`px-2 py-1 rounded-full text-sm ${
                            member.available
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {member.available ? 'Available' : 'Unavailable'}
                        </span>
                        <button className="mt-2 text-blue-600 hover:text-blue-800">
                          Contact
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Appointments Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="text-purple-500" />
                  Upcoming Appointments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {appointments.length > 0 ? (
                    appointments.map((appointment) => (
                      <div
                        key={appointment.date + appointment.time}
                        className="p-3 bg-gray-50 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium">{appointment.type}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.provider} - {appointment.location}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-medium">{appointment.date}</p>
                            <p className="text-sm text-gray-500">
                              {appointment.time}
                            </p>
                          </div>
                        </div>
                        {appointment.notes && (
                          <p className="mt-2 text-sm text-gray-600">
                            Note: {appointment.notes}
                          </p>
                        )}
                      </div>
                    ))
                  ) : (
                    <div className="flex flex-col items-center justify-center space-y-4 py-10">
                      <p className="text-gray-500 text-center">
                        No upcoming appointments. Click below to schedule one.
                      </p>
                      <Button
                        variant="contained"
                        startIcon={<Schedule />}
                        className="border border-gray-400 px-4 py-2 rounded-lg"
                        onClick={() =>
                          navigate(`/scheduler`, {
                            state: {
                              elderId: elderId,
                            },
                          })
                        }
                      >
                        Open Schedule Manager
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Health Trends Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="text-indigo-500" />
                  Health Trends
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={healthMetrics.bloodPressure}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis />
                      <Tooltip />
                      <Area
                        type="monotone"
                        dataKey="systolic"
                        stackId="1"
                        stroke="#8884d8"
                        fill="#8884d8"
                      />
                      <Area
                        type="monotone"
                        dataKey="diastolic"
                        stackId="1"
                        stroke="#82ca9d"
                        fill="#82ca9d"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* After the dashboard grid div, add this section */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Calendar className="text-blue-500" />
                    Care History
                  </CardTitle>
                  <CardDescription>
                    Recent activities and health events
                  </CardDescription>
                </div>
                <div className="flex gap-2">
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Filter size={20} />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-lg">
                    <Download size={20} />
                  </button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {medicationData.map((day, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="space-y-1">
                      <p className="font-medium">{day.date}</p>
                      <p className="text-sm text-gray-500">
                        Medications taken: {day.count}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <div
                        className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          day.adherence >= 90
                            ? 'bg-green-100 text-green-800'
                            : day.adherence >= 70
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-red-100 text-red-800'
                        )}
                      >
                        {day.adherence}% adherence
                      </div>
                      <button
                        onClick={() => handleAddNote(day.date)}
                        className="p-2 hover:bg-white rounded-full transition-colors"
                        title="Add note"
                      >
                        <PlusCircle className="w-5 h-5 text-blue-600" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {showNoteModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Add Note for {selectedDate}</h3>
            <textarea
              value={noteText}
              onChange={(e) => setNoteText(e.target.value)}
              placeholder="Enter your note here..."
            />
            <div className="modal-actions">
              <button onClick={() => setShowNoteModal(false)}>Cancel</button>
              <button onClick={saveNote} className="save-button">
                Save Note
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Notes Modal */}

      <NotesModal
        isOpen={showNotesModal}
        onClose={() => setShowNotesModal(false)}
        elderId={elderId}
      />

      {/* Modals */}
      {showVitalsModal && (
        <VitalsModal
          onClose={() => setShowVitalsModal(false)}
          elderId={elderId}
        />
      )}
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

export default HealthcareDashboard;
