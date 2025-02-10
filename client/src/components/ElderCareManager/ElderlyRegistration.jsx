import { useState } from 'react';
import {
  ChevronRight,
  ChevronLeft,
  User,
  Heart,
  Phone,
  Home,
  AlertCircle,
  Plus,
  Trash2,
  Upload,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import UploadWidget from '../uploadWidget/UploadWidget';
import apiRequest from '../../utils/api';
import { TailSpin } from 'react-loader-spinner';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const ElderlyRegistration = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    photo: '',
    primaryLanguage: '',
    otherLanguages: [],
    religion: '',
    dietaryRestrictions: [],

    // Medical Information
    bloodType: '',
    allergies: [],
    chronicConditions: [],
    medications: [],
    mobilityStatus: '',
    cognitiveStatus: '',
    specialNeeds: [],

    // Contact Information
    roomNumber: '',
    previousAddress: '',
    emergencyContacts: [
      {
        name: '',
        relationship: '',
        phone: '',
        email: '',
        address: '',
        isLegalGuardian: false,
      },
    ],

    // Care Preferences
    preferredDailySchedule: {
      wakeTime: '',
      bedTime: '',
      mealTimes: [],
      activityPreferences: [],
    },
    personalCarePreferences: {
      bathing: '',
      dressing: '',
      grooming: '',
    },

    // Medical History
    previousHospitalizations: [],
    surgicalHistory: [],
    familyHistory: [],

    // Documents
    insuranceInfo: {
      provider: '',
      policyNumber: '',
      documents: [],
    },
    legalDocuments: [],
    medicalDocuments: [],
  });

  // Handle successful uploads for different document types
  const handlePhotoUpload = (url) => {
    setFormData((prev) => ({ ...prev, photo: url }));
  };

  const handleInsuranceUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      insuranceInfo: {
        ...prev.insuranceInfo,
        documents: [...prev.insuranceInfo.documents, url],
      },
    }));
  };

  const handleLegalUpload = (url) => {
    setFormData((prev) => ({
      ...prev,
      legalDocuments: [...prev.legalDocuments, url],
    }));
  };
  const totalSteps = 6;

  const handleNext = () => {
    setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleInputChange = (section, field, value) => {
    setFormData((prev) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value,
      },
    }));
  };

  const addListItem = (section, field) => {
    setFormData((prev) => ({
      ...prev,
      [section]: [...prev[section], ''],
    }));
  };

  const removeListItem = (section, index) => {
    setFormData((prev) => ({
      ...prev,
      [section]: prev[section].filter((_, i) => i !== index),
    }));
  };

  const renderStepIndicator = () => (
    <div className="flex justify-between items-center mb-8">
      {[1, 2, 3, 4, 5, 6].map((step) => (
        <div
          key={step}
          className={`flex items-center ${step !== 6 ? 'flex-1' : ''}`}
        >
          <div
            className={`w-8 h-8 rounded-full flex items-center justify-center 
              ${
                currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-200'
              }`}
          >
            {step}
          </div>
          {step !== 6 && (
            <div
              className={`flex-1 h-1 mx-2 
                ${currentStep > step ? 'bg-blue-600' : 'bg-gray-200'}`}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderPersonalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">First Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.firstName}
            onChange={(e) =>
              setFormData({ ...formData, firstName: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Last Name</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.lastName}
            onChange={(e) =>
              setFormData({ ...formData, lastName: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full p-2 border rounded-lg"
            value={formData.dateOfBirth}
            onChange={(e) =>
              setFormData({ ...formData, dateOfBirth: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Gender</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.gender}
            onChange={(e) =>
              setFormData({ ...formData, gender: e.target.value })
            }
          >
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
            <option value="other">Other</option>
            <option value="prefer-not-to-say">Prefer not to say</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Profile Photo</label>
        <div className="flex items-center gap-4">
          <div className="w-32 h-32 border-2 border-dashed rounded-lg flex items-center justify-center">
            {formData.photo ? (
              <img
                src={formData.photo}
                alt="Profile"
                className="w-full h-full object-cover rounded-lg"
              />
            ) : (
              <Upload className="text-gray-400" size={24} />
            )}
          </div>
          <UploadWidget
            uwConfig={{
              cloudName: 'victorkib',
              uploadPreset: 'estate',
              multiple: false,
              maxImageFileSize: 2000000,
              folder: 'avatars',
            }}
            onUploadSuccess={handlePhotoUpload}
            setLoading={setLoading}
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">
          Dietary Restrictions
        </label>
        {formData.dietaryRestrictions.map((restriction, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              value={restriction}
              onChange={(e) => {
                const newRestrictions = [...formData.dietaryRestrictions];
                newRestrictions[index] = e.target.value;
                setFormData({
                  ...formData,
                  dietaryRestrictions: newRestrictions,
                });
              }}
            />
            <button
              onClick={() => removeListItem('dietaryRestrictions', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem('dietaryRestrictions')}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Dietary Restriction
        </button>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Primary Language
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.primaryLanguage}
            onChange={(e) =>
              setFormData({ ...formData, primaryLanguage: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Religion</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.religion}
            onChange={(e) =>
              setFormData({ ...formData, religion: e.target.value })
            }
          />
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Other Languages</label>
        {formData.otherLanguages.map((language, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              value={language}
              onChange={(e) => {
                const newLanguages = [...formData.otherLanguages];
                newLanguages[index] = e.target.value;
                setFormData({ ...formData, otherLanguages: newLanguages });
              }}
            />
            <button
              onClick={() => removeListItem('otherLanguages', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem('otherLanguages')}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Language
        </button>
      </div>
    </div>
  );

  const renderMedicalInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Blood Type</label>
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.bloodType}
            onChange={(e) =>
              setFormData({ ...formData, bloodType: e.target.value })
            }
          >
            <option value="">Select Blood Type</option>
            <option value="A+">A+</option>
            <option value="A-">A-</option>
            <option value="B+">B+</option>
            <option value="B-">B-</option>
            <option value="AB+">AB+</option>
            <option value="AB-">AB-</option>
            <option value="O+">O+</option>
            <option value="O-">O-</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Mobility Status
          </label>
          <select
            className="w-full p-2 border rounded-lg"
            value={formData.mobilityStatus}
            onChange={(e) =>
              setFormData({ ...formData, mobilityStatus: e.target.value })
            }
          >
            <option value="">Select Mobility Status</option>
            <option value="independent">Independent</option>
            <option value="requires-walker">Requires Walker</option>
            <option value="requires-wheelchair">Requires Wheelchair</option>
            <option value="bed-ridden">Bed Ridden</option>
          </select>
        </div>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Current Medications</label>
        {formData.medications.map((medication, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              value={medication}
              onChange={(e) => {
                const newMedications = [...formData.medications];
                newMedications[index] = e.target.value;
                setFormData({ ...formData, medications: newMedications });
              }}
              placeholder="Medication name, dosage, frequency"
            />
            <button
              onClick={() => removeListItem('medications', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem('medications')}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Medication
        </button>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Chronic Conditions</label>
        {formData.chronicConditions.map((condition, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              value={condition}
              onChange={(e) => {
                const newConditions = [...formData.chronicConditions];
                newConditions[index] = e.target.value;
                setFormData({ ...formData, chronicConditions: newConditions });
              }}
            />
            <button
              onClick={() => removeListItem('chronicConditions', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem('chronicConditions')}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Chronic Condition
        </button>
      </div>
      <div>
        <label className="block text-sm font-medium mb-2">
          Cognitive Status
        </label>
        <select
          className="w-full p-2 border rounded-lg"
          value={formData.cognitiveStatus}
          onChange={(e) =>
            setFormData({ ...formData, cognitiveStatus: e.target.value })
          }
        >
          <option value="">Select Cognitive Status</option>
          <option value="normal">Normal</option>
          <option value="mild-impairment">Mild Cognitive Impairment</option>
          <option value="moderate-impairment">Moderate Impairment</option>
          <option value="severe-impairment">Severe Impairment</option>
        </select>
      </div>

      <div className="space-y-4">
        <label className="block text-sm font-medium">Special Needs</label>
        {formData.specialNeeds.map((need, index) => (
          <div key={index} className="flex gap-2">
            <input
              type="text"
              className="flex-1 p-2 border rounded-lg"
              value={need}
              onChange={(e) => {
                const newNeeds = [...formData.specialNeeds];
                newNeeds[index] = e.target.value;
                setFormData({ ...formData, specialNeeds: newNeeds });
              }}
            />
            <button
              onClick={() => removeListItem('specialNeeds', index)}
              className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
            >
              <Trash2 size={20} />
            </button>
          </div>
        ))}
        <button
          onClick={() => addListItem('specialNeeds')}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Special Need
        </button>
      </div>
    </div>
  );

  const renderContactInfo = () => (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium mb-2">Room Number</label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.roomNumber}
            onChange={(e) =>
              setFormData({ ...formData, roomNumber: e.target.value })
            }
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Previous Address
          </label>
          <input
            type="text"
            className="w-full p-2 border rounded-lg"
            value={formData.previousAddress}
            onChange={(e) =>
              setFormData({ ...formData, previousAddress: e.target.value })
            }
          />
        </div>
      </div>
      <div className="space-y-4">
        <label className="block text-sm font-medium">Emergency Contacts</label>
        {formData.emergencyContacts.map((contact, index) => (
          <Card key={index} className="p-4">
            {/* Previous emergency contact fields... */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Name</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index] = { ...contact, name: e.target.value };
                    setFormData({
                      ...formData,
                      emergencyContacts: newContacts,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Relationship
                </label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-lg"
                  value={contact.relationship}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index] = {
                      ...contact,
                      relationship: e.target.value,
                    };
                    setFormData({
                      ...formData,
                      emergencyContacts: newContacts,
                    });
                  }}
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Phone</label>
                <input
                  type="tel"
                  className="w-full p-2 border rounded-lg"
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index] = { ...contact, phone: e.target.value };
                    setFormData({
                      ...formData,
                      emergencyContacts: newContacts,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full p-2 border rounded-lg"
                  value={contact.email}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index] = { ...contact, email: e.target.value };
                    setFormData({
                      ...formData,
                      emergencyContacts: newContacts,
                    });
                  }}
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">
                  Legal Guardian?
                </label>
                <input
                  type="checkbox"
                  className="w-4 h-4 mr-2"
                  checked={contact.isLegalGuardian}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index] = {
                      ...contact,
                      isLegalGuardian: e.target.checked,
                    };
                    setFormData({
                      ...formData,
                      emergencyContacts: newContacts,
                    });
                  }}
                />
                <span className="text-sm">
                  Yes, this person is a legal guardian
                </span>
              </div>
            </div>
          </Card>
        ))}
        <button
          onClick={() => {
            const newContacts = [
              ...formData.emergencyContacts,
              {
                name: '',
                relationship: '',
                phone: '',
                email: '',
                address: '',
                isLegalGuardian: false,
              },
            ];
            setFormData({ ...formData, emergencyContacts: newContacts });
          }}
          className="flex items-center gap-2 text-blue-600"
        >
          <Plus size={20} />
          Add Emergency Contact
        </button>
      </div>
    </div>
  );

  const renderCarePreferences = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Daily Schedule Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Wake Time
              </label>
              <input
                type="time"
                className="w-full p-2 border rounded-lg"
                value={formData.preferredDailySchedule.wakeTime}
                onChange={(e) =>
                  handleInputChange(
                    'preferredDailySchedule',
                    'wakeTime',
                    e.target.value
                  )
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Bed Time</label>
              <input
                type="time"
                className="w-full p-2 border rounded-lg"
                value={formData.preferredDailySchedule.bedTime}
                onChange={(e) =>
                  handleInputChange(
                    'preferredDailySchedule',
                    'bedTime',
                    e.target.value
                  )
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Preferred Activities
            </label>
            {formData.preferredDailySchedule.activityPreferences.map(
              (activity, index) => (
                <div key={index} className="flex gap-2 mb-2">
                  <input
                    type="text"
                    className="flex-1 p-2 border rounded-lg"
                    value={activity}
                    onChange={(e) => {
                      const newActivities = [
                        ...formData.preferredDailySchedule.activityPreferences,
                      ];
                      newActivities[index] = e.target.value;
                      handleInputChange(
                        'preferredDailySchedule',
                        'activityPreferences',
                        newActivities
                      );
                    }}
                  />
                  <button
                    onClick={() => {
                      const newActivities =
                        formData.preferredDailySchedule.activityPreferences.filter(
                          (_, i) => i !== index
                        );
                      handleInputChange(
                        'preferredDailySchedule',
                        'activityPreferences',
                        newActivities
                      );
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            )}
            <button
              onClick={() => {
                const newActivities = [
                  ...formData.preferredDailySchedule.activityPreferences,
                  '',
                ];
                handleInputChange(
                  'preferredDailySchedule',
                  'activityPreferences',
                  newActivities
                );
              }}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus size={20} />
              Add Activity
            </button>
          </div>
          <div className="space-y-4">
            <label className="block text-sm font-medium mb-2">Meal Times</label>
            {formData.preferredDailySchedule.mealTimes.map(
              (mealTime, index) => (
                <div key={index} className="flex gap-2">
                  <input
                    type="time"
                    className="flex-1 p-2 border rounded-lg"
                    value={mealTime}
                    onChange={(e) => {
                      const newMealTimes = [
                        ...formData.preferredDailySchedule.mealTimes,
                      ];
                      newMealTimes[index] = e.target.value;
                      handleInputChange(
                        'preferredDailySchedule',
                        'mealTimes',
                        newMealTimes
                      );
                    }}
                  />
                  <button
                    onClick={() => {
                      const newMealTimes =
                        formData.preferredDailySchedule.mealTimes.filter(
                          (_, i) => i !== index
                        );
                      handleInputChange(
                        'preferredDailySchedule',
                        'mealTimes',
                        newMealTimes
                      );
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              )
            )}
            <button
              onClick={() => {
                const newMealTimes = [
                  ...formData.preferredDailySchedule.mealTimes,
                  '',
                ];
                handleInputChange(
                  'preferredDailySchedule',
                  'mealTimes',
                  newMealTimes
                );
              }}
              className="flex items-center gap-2 text-blue-600"
            >
              <Plus size={20} />
              Add Meal Time
            </button>

            <div>
              <label className="block text-sm font-medium mb-2">
                Grooming Preferences
              </label>
              <textarea
                className="w-full p-2 border rounded-lg"
                value={formData.personalCarePreferences.grooming}
                onChange={(e) =>
                  handleInputChange(
                    'personalCarePreferences',
                    'grooming',
                    e.target.value
                  )
                }
                placeholder="Preferred grooming routine, specific products, assistance needed, etc."
                rows={3}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Personal Care Preferences</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">
              Bathing Preferences
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={formData.personalCarePreferences.bathing}
              onChange={(e) =>
                handleInputChange(
                  'personalCarePreferences',
                  'bathing',
                  e.target.value
                )
              }
              placeholder="Preferred time, temperature, assistance needed, etc."
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Dressing Preferences
            </label>
            <textarea
              className="w-full p-2 border rounded-lg"
              value={formData.personalCarePreferences.dressing}
              onChange={(e) =>
                handleInputChange(
                  'personalCarePreferences',
                  'dressing',
                  e.target.value
                )
              }
              placeholder="Preferred clothing types, assistance needed, etc."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderMedicalHistory = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Previous Hospitalizations</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.previousHospitalizations.map((hospitalization, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                value={hospitalization}
                onChange={(e) => {
                  const newHospitalizations = [
                    ...formData.previousHospitalizations,
                  ];
                  newHospitalizations[index] = e.target.value;
                  setFormData({
                    ...formData,
                    previousHospitalizations: newHospitalizations,
                  });
                }}
                placeholder="Date, reason, hospital name"
              />
              <button
                onClick={() =>
                  removeListItem('previousHospitalizations', index)
                }
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem('previousHospitalizations')}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={20} />
            Add Hospitalization Record
          </button>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Surgical History</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.surgicalHistory.map((surgery, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                value={surgery}
                onChange={(e) => {
                  const newSurgeries = [...formData.surgicalHistory];
                  newSurgeries[index] = e.target.value;
                  setFormData({ ...formData, surgicalHistory: newSurgeries });
                }}
                placeholder="Date, procedure, hospital"
              />
              <button
                onClick={() => removeListItem('surgicalHistory', index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem('surgicalHistory')}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={20} />
            Add Surgery Record
          </button>
        </CardContent>
      </Card>

      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Family Medical History</CardTitle>
        </CardHeader>
        <CardContent>
          {formData.familyHistory.map((history, index) => (
            <div key={index} className="flex gap-2 mb-2">
              <input
                type="text"
                className="flex-1 p-2 border rounded-lg"
                value={history}
                onChange={(e) => {
                  const newHistory = [...formData.familyHistory];
                  newHistory[index] = e.target.value;
                  setFormData({ ...formData, familyHistory: newHistory });
                }}
                placeholder="Condition, relationship, age of onset"
              />
              <button
                onClick={() => removeListItem('familyHistory', index)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))}
          <button
            onClick={() => addListItem('familyHistory')}
            className="flex items-center gap-2 text-blue-600"
          >
            <Plus size={20} />
            Add Family History
          </button>
        </CardContent>
      </Card>
    </div>
  );

  const renderDocuments = () => (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Insurance Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Insurance Provider
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.insuranceInfo.provider}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    insuranceInfo: {
                      ...prev.insuranceInfo,
                      provider: e.target.value,
                    },
                  }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                Policy Number
              </label>
              <input
                type="text"
                className="w-full p-2 border rounded-lg"
                value={formData.insuranceInfo.policyNumber}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    insuranceInfo: {
                      ...prev.insuranceInfo,
                      policyNumber: e.target.value,
                    },
                  }))
                }
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2">
              Upload Insurance Documents
            </label>
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'estate',
                multiple: true,
                folder: 'insurance',
              }}
              onUploadSuccess={handleInsuranceUpload}
              setLoading={setLoading}
            />
            {formData.insuranceInfo.documents.map((doc, index) => (
              <div key={index} className="text-sm text-blue-600 mt-2">
                Document {index + 1} uploaded
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Legal Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'estate',
                multiple: true,
                folder: 'legal',
              }}
              onUploadSuccess={handleLegalUpload}
              setLoading={setLoading}
            />
            {formData.legalDocuments.map((doc, index) => (
              <div key={index} className="text-sm text-blue-600 mt-2">
                Document {index + 1} uploaded successfully
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Upload power of attorney, living will, or other legal documents
            </p>
          </div>
        </CardContent>
      </Card>
      <Card className="mt-4">
        <CardHeader>
          <CardTitle>Medical Documents</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <UploadWidget
              uwConfig={{
                cloudName: 'victorkib',
                uploadPreset: 'estate',
                multiple: true,
                folder: 'medical',
              }}
              onUploadSuccess={(url) => {
                setFormData((prev) => ({
                  ...prev,
                  medicalDocuments: [...prev.medicalDocuments, url],
                }));
              }}
              setLoading={setLoading}
            />
            {formData.medicalDocuments.map((doc, index) => (
              <div key={index} className="text-sm text-blue-600 mt-2">
                Medical Document {index + 1} uploaded successfully
              </div>
            ))}
            <p className="text-sm text-gray-500">
              Upload medical records, test results, or other health-related
              documents
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderPersonalInfo();
      case 2:
        return renderMedicalInfo();
      case 3:
        return renderContactInfo();
      case 4:
        return renderCarePreferences();
      case 5:
        return renderMedicalHistory();
      case 6:
        return renderDocuments();
      default:
        return null;
    }
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);

      // Format the data for submission
      const submissionData = {
        ...formData,
        // Add any additional formatting if needed
      };

      // Make the API call
      const response = await apiRequest.post(
        '/elders/register',
        submissionData
      );

      if (response.status === 200 || response.status === 201) {
        toast.success('Registration successful!');
        navigate('/organizedElders');
        // Add any additional success handling (e.g., redirect)
      } else {
        throw new Error('Registration failed');
      }
    } catch (error) {
      console.error('Registration error:', error);
      toast.error(
        error.response.data.error || error.message || 'Registration Failed!'
      );
      alert('Failed to register. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 mt-14">
      <Card>
        <CardHeader>
          <CardTitle>Elderly Resident Registration</CardTitle>
          <CardDescription>
            Please fill out all information to register a new resident
          </CardDescription>
        </CardHeader>
        <CardContent>
          {renderStepIndicator()}
          {renderCurrentStep()}
          <div className="flex justify-between mt-8">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg 
                ${
                  currentStep === 1
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
                }`}
            >
              <ChevronLeft size={20} />
              Previous
            </button>
            {currentStep === totalSteps ? (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                disabled={loading}
              >
                {loading ? 'Submitting...' : 'Submit Registration'}
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
                <ChevronRight size={20} />
              </button>
            )}
          </div>
        </CardContent>
      </Card>

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

      <ToastContainer />
    </div>
  );
};

export default ElderlyRegistration;
