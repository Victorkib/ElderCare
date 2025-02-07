import { useState } from 'react';
import {
  Calendar,
  Clock,
  User,
  Pill,
  Calendar as CalendarIcon,
  Phone,
  Heart,
  Activity,
  AlertCircle,
  Car,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

const ElderlyCareForm = () => {
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    roomNumber: '',
    emergencyContact: '',
    emergencyPhone: '',
    medicalConditions: '',
    allergies: '',

    // Medication Schedule
    medications: [
      {
        name: '',
        dosage: '',
        frequency: '',
        timing: '',
        specialInstructions: '',
      },
    ],

    // Appointments
    appointments: [
      {
        title: '',
        date: '',
        time: '',
        provider: '',
        location: '',
        notes: '',
      },
    ],

    // Daily Care Routines
    dailyRoutines: [
      {
        activity: '',
        preferredTime: '',
        assistance: '',
        notes: '',
      },
    ],
  });

  const handleInputChange = (section, index, field, value) => {
    setFormData((prev) => {
      if (Array.isArray(prev[section])) {
        const newArray = [...prev[section]];
        newArray[index] = { ...newArray[index], [field]: value };
        return { ...prev, [section]: newArray };
      }
      return { ...prev, [field]: value };
    });
  };

  const addItem = (section) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [
        ...prev[section],
        section === 'medications'
          ? {
              name: '',
              dosage: '',
              frequency: '',
              timing: '',
              specialInstructions: '',
            }
          : section === 'appointments'
          ? {
              title: '',
              date: '',
              time: '',
              provider: '',
              location: '',
              notes: '',
            }
          : {
              activity: '',
              preferredTime: '',
              assistance: '',
              notes: '',
            },
      ],
    }));
  };

  const removeItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto p-4 mt-10">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <User className="w-6 h-6" />
            Elderly Care Management System
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 mb-6">
            {['personal', 'medications', 'appointments', 'routines'].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-lg flex items-center gap-2 ${
                    activeTab === tab
                      ? 'bg-blue-500 text-white'
                      : 'bg-gray-100 hover:bg-gray-200'
                  }`}
                >
                  {tab === 'personal' && <User className="w-4 h-4" />}
                  {tab === 'medications' && <Pill className="w-4 h-4" />}
                  {tab === 'appointments' && (
                    <CalendarIcon className="w-4 h-4" />
                  )}
                  {tab === 'routines' && <Activity className="w-4 h-4" />}
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              )
            )}
          </div>

          {activeTab === 'personal' && (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1">
                  First Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.firstName}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'firstName',
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Last Name
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.lastName}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'lastName',
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  className="w-full p-2 border rounded"
                  value={formData.dateOfBirth}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'dateOfBirth',
                      e.target.value
                    )
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">
                  Room Number
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded"
                  value={formData.roomNumber}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'roomNumber',
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Medical Conditions
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="3"
                  value={formData.medicalConditions}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'medicalConditions',
                      e.target.value
                    )
                  }
                />
              </div>
              <div className="col-span-2">
                <label className="block text-sm font-medium mb-1">
                  Allergies
                </label>
                <textarea
                  className="w-full p-2 border rounded"
                  rows="2"
                  value={formData.allergies}
                  onChange={(e) =>
                    handleInputChange(
                      'personal',
                      null,
                      'allergies',
                      e.target.value
                    )
                  }
                />
              </div>
            </div>
          )}

          {activeTab === 'medications' && (
            <div>
              {formData.medications.map((med, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Medication Name
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={med.name}
                        onChange={(e) =>
                          handleInputChange(
                            'medications',
                            index,
                            'name',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Dosage
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={med.dosage}
                        onChange={(e) =>
                          handleInputChange(
                            'medications',
                            index,
                            'dosage',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Frequency
                      </label>
                      <select
                        className="w-full p-2 border rounded"
                        value={med.frequency}
                        onChange={(e) =>
                          handleInputChange(
                            'medications',
                            index,
                            'frequency',
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Frequency</option>
                        <option value="daily">Daily</option>
                        <option value="twice-daily">Twice Daily</option>
                        <option value="weekly">Weekly</option>
                        <option value="as-needed">As Needed</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Timing
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded"
                        value={med.timing}
                        onChange={(e) =>
                          handleInputChange(
                            'medications',
                            index,
                            'timing',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium mb-1">
                        Special Instructions
                      </label>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={med.specialInstructions}
                        onChange={(e) =>
                          handleInputChange(
                            'medications',
                            index,
                            'specialInstructions',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem('medications', index)}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Remove Medication
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem('medications')}
                className="w-full p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                Add New Medication
              </button>
            </div>
          )}

          {activeTab === 'appointments' && (
            <div>
              {formData.appointments.map((apt, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Appointment Title
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={apt.title}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'title',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Provider
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={apt.provider}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'provider',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Date
                      </label>
                      <input
                        type="date"
                        className="w-full p-2 border rounded"
                        value={apt.date}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'date',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Time
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded"
                        value={apt.time}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'time',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Location
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={apt.location}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'location',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Notes
                      </label>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={apt.notes}
                        onChange={(e) =>
                          handleInputChange(
                            'appointments',
                            index,
                            'notes',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem('appointments', index)}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Remove Appointment
                  </button>
                </div>
              ))}
              <button
                onClick={() => addItem('appointments')}
                className="w-full p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                Add New Appointment
              </button>
            </div>
          )}

          {activeTab === 'routines' && (
            <div>
              {formData.dailyRoutines.map((routine, index) => (
                <div key={index} className="mb-6 p-4 border rounded-lg">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Activity
                      </label>
                      <input
                        type="text"
                        className="w-full p-2 border rounded"
                        value={routine.activity}
                        onChange={(e) =>
                          handleInputChange(
                            'dailyRoutines',
                            index,
                            'activity',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Preferred Time
                      </label>
                      <input
                        type="time"
                        className="w-full p-2 border rounded"
                        value={routine.preferredTime}
                        onChange={(e) =>
                          handleInputChange(
                            'dailyRoutines',
                            index,
                            'preferredTime',
                            e.target.value
                          )
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Assistance Required
                      </label>
                      <select
                        className="w-full p-2 border rounded"
                        value={routine.assistance}
                        onChange={(e) =>
                          handleInputChange(
                            'dailyRoutines',
                            index,
                            'assistance',
                            e.target.value
                          )
                        }
                      >
                        <option value="">Select Assistance Level</option>
                        <option value="none">No Assistance</option>
                        <option value="minimal">Minimal Assistance</option>
                        <option value="moderate">Moderate Assistance</option>
                        <option value="full">Full Assistance</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1">
                        Notes
                      </label>
                      <textarea
                        className="w-full p-2 border rounded"
                        value={routine.notes}
                        onChange={(e) =>
                          handleInputChange(
                            'dailyRoutines',
                            index,
                            'notes',
                            e.target.value
                          )
                        }
                      />
                    </div>
                  </div>
                  <button
                    onClick={() => removeItem('dailyRoutines', index)}
                    className="mt-2 px-3 py-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                  >
                    Remove Routine
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => addItem('dailyRoutines')}
                className="w-full p-2 bg-green-100 text-green-600 rounded hover:bg-green-200"
              >
                Add New Routine
              </button>
            </div>
          )}
        </CardContent>
        <div className="mt-8 flex justify-end gap-4">
          <button
            type="button"
            onClick={() =>
              setFormData({
                firstName: '',
                lastName: '',
                dateOfBirth: '',
                roomNumber: '',
                emergencyContact: '',
                emergencyPhone: '',
                medicalConditions: '',
                allergies: '',
                medications: [
                  {
                    name: '',
                    dosage: '',
                    frequency: '',
                    timing: '',
                    specialInstructions: '',
                  },
                ],
                appointments: [
                  {
                    title: '',
                    date: '',
                    time: '',
                    provider: '',
                    location: '',
                    notes: '',
                  },
                ],
                dailyRoutines: [
                  {
                    activity: '',
                    preferredTime: '',
                    assistance: '',
                    notes: '',
                  },
                ],
              })
            }
            className="px-6 py-2 bg-gray-100 text-gray-600 rounded hover:bg-gray-200"
          >
            Reset Form
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save Elderly Care Plan
          </button>
        </div>
      </Card>
    </div>
  );
};

export default ElderlyCareForm;
