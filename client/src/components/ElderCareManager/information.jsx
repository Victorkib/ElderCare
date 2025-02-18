import { useEffect, useState } from 'react';
import {
  Award,
  Calendar,
  Clock,
  Users,
  FileText,
  Star,
  GraduationCap,
  Trophy,
  Globe,
  Share,
  Flag,
  MessageSquare,
  CalendarClock,
  MapPin,
  Phone,
  Mail,
  Brain,
  AlertCircle,
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '../ui/alert';
import {
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  LineChart,
} from 'recharts';
import { FaCertificate } from 'react-icons/fa';
import { toast } from 'react-toastify';
import apiRequest from '../../utils/api';
import { useParams } from 'react-router-dom';

const CaregiverProfile = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [userData, setUserData] = useState({});
  const { caregiverId } = useParams();

  // Sample caregiver data
  const caregiverData = {
    name: userData?.name ? userData?.name : 'Sarah Wilson, RN',
    role: userData?.specialization
      ? userData?.specialization
      : 'Senior Care Specialist',
    status: userData?.status ? userData?.status : 'On Duty',
    experience: userData?.yearsOfExperience
      ? userData?.yearsOfExperience
      : '8 years',
    rating: 4.9,
    totalReviews: 127,
    certifications: [
      {
        name: 'Registered Nurse',
        issuer: 'State Board of Nursing',
        expiry: '2026',
        issueDate: '2016', // Added issueDate
      },
      {
        name: 'CPR Certified',
        issuer: 'American Red Cross',
        expiry: '2025',
        issueDate: '2017', // Added issueDate
      },
      // Add more certifications as needed
    ],
    contact: {
      email: userData?.email
        ? userData?.email
        : 'sarah.wilson@eldercareservice.com',
      phone: userData?.phoneNumber ? userData?.phoneNumber : '(555) 234-5678',
      address: '456 Care Street, Springfield, IL',
    },
    schedule: {
      availability: 'Full-time',
      preferredHours: '7:00 AM - 3:00 PM',
      nextShift: 'Today, 7:00 AM - 3:00 PM',
    },
    patients: [
      {
        name: 'Martha Johnson',
        status: 'Primary',
        lastVisit: 'Today 8:00 AM',
        nextVisit: 'Tomorrow 7:00 AM',
      },
      {
        name: 'Robert Chen',
        status: 'Secondary',
        lastVisit: 'Yesterday',
        nextVisit: 'Feb 16, 2025',
      },
      {
        name: 'Elizabeth Taylor',
        status: 'Primary',
        lastVisit: 'Today 11:00 AM',
        nextVisit: 'Feb 15, 2025',
      },
    ],
    performance: {
      responseTime: '5 minutes',
      taskCompletion: '98%',
      patientSatisfaction: '4.9/5',
      attendanceRate: '99%',
    },
    recentActivities: [
      {
        type: 'Care Visit',
        patient: 'Martha Johnson',
        action: 'Completed morning routine and medication administration',
        time: 'Today 8:30 AM',
      },
      {
        type: 'Health Log',
        patient: 'Elizabeth Taylor',
        action: 'Updated vital signs and nutrition intake',
        time: 'Today 11:30 AM',
      },
      {
        type: 'Emergency Response',
        patient: 'Robert Chen',
        action: 'Responded to fall alert - False alarm',
        time: 'Yesterday 2:15 PM',
      },
    ],
    upcomingTasks: [
      {
        type: 'Medication',
        patient: 'Martha Johnson',
        time: 'Tomorrow 7:00 AM',
        priority: 'High',
      },
      {
        type: "Doctor's Appointment",
        patient: 'Elizabeth Taylor',
        time: 'Feb 15, 2025 10:00 AM',
        priority: 'Medium',
      },
      {
        type: 'Physical Therapy',
        patient: 'Robert Chen',
        time: 'Feb 16, 2025 2:00 PM',
        priority: 'Medium',
      },
    ],
    skills: [
      { name: 'Medication Management', level: 95 },
      { name: 'Vital Signs Monitoring', level: 90 },
      { name: 'Emergency Response', level: 85 },
    ],
    metrics: {
      monthlyVisits: 124,
      hoursLogged: 168,
      incidentReports: 0,
      completedTasks: 246,
    },
    // Additional data
    professionalSummary: `Dedicated and compassionate Registered Nurse with 8+ years of specialized experience in elderly care and dementia management. Known for developing personalized care plans and maintaining strong relationships with patients and their families. Consistently receives high satisfaction ratings for exceptional care delivery and emergency response capabilities.`,

    education: [
      {
        degree: 'Bachelor of Science in Nursing',
        institution: 'University of Illinois',
        year: '2016',
        honors: 'Cum Laude',
      },
      {
        degree: 'Associate Degree in Healthcare Administration',
        institution: 'Springfield Community College',
        year: '2014',
      },
    ],

    awards: [
      {
        title: 'Caregiver of the Year',
        year: '2024',
        issuer: 'Elder Care Services Inc.',
      },
      {
        title: 'Excellence in Patient Care',
        year: '2023',
        issuer: 'National Nursing Association',
      },
    ],

    specializations: [
      {
        area: 'Dementia Care',
        level: 'Advanced',
        hoursCompleted: 500,
      },
      {
        area: 'Palliative Care',
        level: 'Intermediate',
        hoursCompleted: 300,
      },
      {
        area: 'Emergency Response',
        level: 'Expert',
        hoursCompleted: 450,
      },
    ],

    monthlyPerformance: [
      {
        month: 'Jan',
        patientSatisfaction: 4.8,
        taskCompletion: 97,
        responseTime: 4.5,
      },
      {
        month: 'Feb',
        patientSatisfaction: 4.9,
        taskCompletion: 98,
        responseTime: 4.2,
      },
      {
        month: 'Mar',
        patientSatisfaction: 4.9,
        taskCompletion: 99,
        responseTime: 4.0,
      },
      {
        month: 'Apr',
        patientSatisfaction: 5.0,
        taskCompletion: 100,
        responseTime: 3.8,
      },
    ],

    continuingEducation: [
      {
        course: 'Advanced Wound Care Management',
        completionDate: 'Jan 2025',
        creditHours: 20,
      },
      {
        course: 'Emergency Response in Elder Care',
        completionDate: 'Dec 2024',
        creditHours: 15,
      },
    ],

    languages: [
      { language: 'English', proficiency: 'Native' },
      { language: 'Spanish', proficiency: 'Intermediate' },
    ],
  };

  //fetch logged in user data
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await apiRequest.get(
          `/caregivers/getSingle/${caregiverId}`
        );
        if (response.status) {
          console.log(response.data);
          setUserData(response.data);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || 'Error fetching data!');
      }
    };
    fetchUserData();
  }, []);
  const formattedMonthlyPerformance = caregiverData?.monthlyPerformance.map(
    (item) => ({
      ...item,
      month: String(item.month),
    })
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 mt-11">
      <div className="max-w-7xl mx-auto">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mb-6 md:mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="relative mx-auto md:mx-0">
                <img
                  src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTrNLN0aOzoLrt2GOhcq9zzgyccqyJ5EtdfjQ&s"
                  alt="Profile"
                  className="rounded-full w-24 h-24 object-cover border-4 border-blue-100"
                />
                <span className="absolute bottom-0 right-0 w-6 h-6 bg-green-500 border-4 border-white rounded-full"></span>
              </div>
              <div className="text-center md:text-left">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-2 md:gap-4">
                  <h1 className="text-xl md:text-2xl font-bold text-gray-900">
                    {caregiverData.name}
                  </h1>
                  <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                    {caregiverData.role}
                  </span>
                </div>
                <div className="flex items-center justify-center md:justify-start mt-2">
                  <div className="flex items-center text-yellow-500">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-current" />
                    ))}
                  </div>
                  <span className="ml-2 text-gray-600">
                    {caregiverData.rating} ({caregiverData.totalReviews}{' '}
                    reviews)
                  </span>
                </div>
                <p className="mt-2 text-gray-600 max-w-2xl">
                  {caregiverData.professionalSummary}
                </p>
              </div>
            </div>
            <div className="flex flex-row md:flex-col justify-center gap-3">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center text-sm">
                <MessageSquare className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Message</span>
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center text-sm">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">Schedule</span>
              </button>
              <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 flex items-center text-sm">
                <FileText className="w-4 h-4 mr-2" />
                <span className="hidden md:inline">View Full Profile</span>
              </button>
            </div>
          </div>

          {/* Status Cards */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mt-6 md:mt-8">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-blue-600" />
                <div className="ml-3">
                  <p className="text-sm text-blue-600 font-medium">Status</p>
                  <p className="text-base md:text-lg font-semibold text-blue-800">
                    {caregiverData.status}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Users className="w-5 h-5 text-green-600" />
                <div className="ml-3">
                  <p className="text-sm text-green-600 font-medium">
                    Active Patients
                  </p>
                  <p className="text-base md:text-lg font-semibold text-green-800">
                    {caregiverData.patients.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Award className="w-5 h-5 text-purple-600" />
                <div className="ml-3">
                  <p className="text-sm text-purple-600 font-medium">
                    Experience
                  </p>
                  <p className="text-base md:text-lg font-semibold text-purple-800">
                    {caregiverData.experience}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-orange-50 p-4 rounded-lg">
              <div className="flex items-center">
                <Star className="w-5 h-5 text-orange-600" />
                <div className="ml-3">
                  <p className="text-sm text-orange-600 font-medium">Rating</p>
                  <p className="text-base md:text-lg font-semibold text-orange-800">
                    {caregiverData.rating}/5.0
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-md mb-6 md:mb-8 overflow-x-auto">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-4 md:px-6" aria-label="Tabs">
              {[
                'overview',
                'patients',
                'schedule',
                'performance',
                'qualifications',
              ].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`py-4 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8">
          {/* Left Column */}
          <div className="lg:col-span-8 space-y-6 md:space-y-8">
            {/* Professional Summary */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <FileText className="w-5 h-5 mr-2 text-blue-600" />
                Professional Summary
              </h2>
              <p className="text-gray-600 leading-relaxed">
                {caregiverData.professionalSummary}
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="px-3 py-1 bg-blue-50 text-blue-800 rounded-full text-sm">
                  {caregiverData.experience} Experience
                </span>
                <span className="px-3 py-1 bg-green-50 text-green-800 rounded-full text-sm">
                  {caregiverData.rating}/5.0 Rating
                </span>
                <span className="px-3 py-1 bg-purple-50 text-purple-800 rounded-full text-sm">
                  {caregiverData.patients.length} Active Patients
                </span>
              </div>
            </div>

            {/* Recent Activities */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-blue-600" />
                Recent Activities
              </h2>
              <div className="space-y-4">
                {caregiverData.recentActivities.map((activity, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          {activity.type}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {activity.patient}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {activity.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      {activity.action}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming Tasks */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <Calendar className="w-5 h-5 mr-2 text-blue-600" />
                Upcoming Tasks
              </h2>
              <div className="space-y-4">
                {caregiverData.upcomingTasks.map((task, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          {task.type}
                        </h3>
                        <p className="text-sm text-gray-600">{task.patient}</p>
                      </div>
                      <span
                        className={`text-sm ${
                          task.priority === 'High'
                            ? 'text-red-600'
                            : 'text-yellow-600'
                        }`}
                      >
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">{task.time}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Metrics Overview */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                Metrics Overview
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-600 font-medium">
                    Monthly Visits
                  </p>
                  <p className="text-lg font-semibold text-blue-800">
                    {caregiverData.metrics.monthlyVisits}
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-600 font-medium">
                    Hours Logged
                  </p>
                  <p className="text-lg font-semibold text-green-800">
                    {caregiverData.metrics.hoursLogged}
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-600 font-medium">
                    Incident Reports
                  </p>
                  <p className="text-lg font-semibold text-purple-800">
                    {caregiverData.metrics.incidentReports}
                  </p>
                </div>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-600 font-medium">
                    Completed Tasks
                  </p>
                  <p className="text-lg font-semibold text-orange-800">
                    {caregiverData.metrics.completedTasks}
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <LineChart className="w-5 h-5 mr-2 text-blue-600" />
                Performance Trends
              </h2>
              <div className="h-80">
                {caregiverData?.monthlyPerformance &&
                caregiverData?.monthlyPerformance.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={formattedMonthlyPerformance}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="patientSatisfaction"
                        stroke="#3B82F6"
                        name="Patient Satisfaction"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="taskCompletion"
                        stroke="#10B981"
                        name="Task Completion %"
                        strokeWidth={2}
                      />
                      <Line
                        type="monotone"
                        dataKey="responseTime"
                        stroke="#F59E0B"
                        name="Response Time (min)"
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <p className="text-gray-600">
                    No performance data available.
                  </p>
                )}
              </div>
            </div>

            {/* Active Patients */}
            <div className="bg-white rounded-xl shadow-lg p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <Users className="w-5 h-5 mr-2 text-blue-600" />
                Active Patients
              </h2>
              <div className="space-y-4">
                {caregiverData.patients.map((patient, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-2">
                      <div>
                        <h3 className="font-medium text-blue-800">
                          {patient.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          Status: {patient.status}
                        </p>
                      </div>
                      <span className="text-sm text-gray-500">
                        {patient.nextVisit}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mt-2">
                      Last Visit: {patient.lastVisit}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Education & Awards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                  <GraduationCap className="w-5 h-5 mr-2 text-blue-600" />
                  Education
                </h2>
                <div className="space-y-4">
                  {caregiverData.education.map((edu, index) => (
                    <div
                      key={index}
                      className="border-l-2 border-blue-200 pl-4"
                    >
                      <h3 className="font-medium">{edu.degree}</h3>
                      <p className="text-sm text-gray-600">{edu.institution}</p>
                      <p className="text-sm text-gray-500">
                        {edu.year} {edu.honors && `- ${edu.honors}`}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                  <Trophy className="w-5 h-5 mr-2 text-blue-600" />
                  Awards & Recognition
                </h2>
                <div className="space-y-4">
                  {caregiverData.awards.map((award, index) => (
                    <div key={index} className="bg-yellow-50 p-4 rounded-lg">
                      <h3 className="font-medium text-yellow-800">
                        {award.title}
                      </h3>
                      <p className="text-sm text-yellow-600">{award.issuer}</p>
                      <p className="text-sm text-yellow-700 mt-1">
                        {award.year}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Specializations */}
            <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
              <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                <Brain className="w-5 h-5 mr-2 text-blue-600" />
                Specializations
              </h2>
              <div className="grid grid-cols-1 gap-4">
                {caregiverData.specializations.map((spec, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                      <div>
                        <h3 className="font-medium text-lg">{spec.area}</h3>
                        <p className="text-sm text-gray-600">
                          Level: {spec.level}
                        </p>
                      </div>
                      <div className="w-full md:w-auto text-left md:text-right">
                        <p className="text-sm text-gray-600">
                          {spec.hoursCompleted} hours completed
                        </p>
                        <div className="w-full md:w-32 h-2 bg-gray-200 rounded-full mt-2">
                          <div
                            className="h-2 bg-blue-600 rounded-full"
                            style={{
                              width: `${(spec.hoursCompleted / 500) * 100}%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4">
            <div className="space-y-6 md:space-y-8 lg:sticky lg:top-8">
              {/* Skills Assessment */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                  <Award className="w-5 h-5 mr-2 text-blue-600" />
                  Skills & Expertise
                </h2>
                <div className="space-y-4">
                  {caregiverData.skills.map((skill, index) => (
                    <div key={index}>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm font-medium">
                          {skill.name}
                        </span>
                        <span className="text-sm text-gray-600">
                          {skill.level}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Certifications */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6 flex items-center">
                  <FaCertificate className="w-5 h-5 mr-2 text-blue-600" />
                  Certifications
                </h2>
                <div className="space-y-4">
                  {caregiverData.certifications.map((cert, index) => (
                    <div
                      key={index}
                      className="flex items-start p-4 bg-gray-50 rounded-lg"
                    >
                      <FaCertificate className="w-5 h-5 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                      <div>
                        <p className="font-medium">{cert.name}</p>
                        <p className="text-sm text-gray-600">
                          Issued: {cert.issueDate}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Contact Information */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4">
                  Contact Information
                </h2>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <Mail className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div className="flex-1 break-words">
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-medium">
                        {caregiverData.contact.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <Phone className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Phone</p>
                      <p className="font-medium">
                        {caregiverData.contact.phone}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <MapPin className="w-5 h-5 text-gray-400 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="text-sm text-gray-600">Address</p>
                      <p className="font-medium">
                        {caregiverData.contact.address}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Schedule */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                  <CalendarClock className="w-5 h-5 mr-2 text-blue-600" />
                  Schedule
                </h2>
                <div className="space-y-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="font-medium text-blue-800">Next Shift</h3>
                    <p className="text-sm text-blue-600 mt-1">
                      {caregiverData.schedule.nextShift}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Availability</p>
                    <p className="font-medium">
                      {caregiverData.schedule.availability}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Preferred Hours</p>
                    <p className="font-medium">
                      {caregiverData.schedule.preferredHours}
                    </p>
                  </div>
                </div>
              </div>

              {/* Languages */}
              <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
                <h2 className="text-lg md:text-xl font-semibold mb-4 flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-blue-600" />
                  Languages
                </h2>
                <div className="space-y-3">
                  {caregiverData.languages.map((lang, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center bg-gray-50 p-3 rounded-lg"
                    >
                      <span className="font-medium">{lang.language}</span>
                      <span className="text-sm text-gray-600">
                        {lang.proficiency}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency Contact Alert */}
              <Alert className="bg-red-50 border-red-200">
                <AlertCircle className="w-4 h-4 text-red-600" />
                <AlertTitle className="text-red-800">
                  Emergency Contact
                </AlertTitle>
                <AlertDescription className="text-red-700">
                  Available 24/7 for urgent patient needs
                  <div className="mt-2 font-medium">
                    Hotline: (555) 911-CARE
                  </div>
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-4 md:p-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center">
                <FileText className="w-4 h-4 mr-2" />
                Download Profile
              </button>
              <button className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 flex items-center justify-center">
                <Share className="w-4 h-4 mr-2" />
                Share Profile
              </button>
            </div>
            <button className="px-4 py-2 text-gray-600 hover:text-gray-800 flex items-center justify-center">
              <Flag className="w-4 h-4 mr-2" />
              Report an Issue
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverProfile;
