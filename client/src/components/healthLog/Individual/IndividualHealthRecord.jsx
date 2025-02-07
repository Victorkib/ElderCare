import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
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
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../../ui/card';

const IndividualHealthRecord = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isRecording, setIsRecording] = useState(false);

  // Sample data - would come from API in real app
  const patientData = {
    name: 'John Smith',
    age: 75,
    roomNumber: '203',
    primaryCaregiver: 'Sarah Johnson',
    emergencyContacts: [
      { name: 'Mary Smith', relation: 'Daughter', phone: '(555) 123-4567' },
      { name: 'James Smith', relation: 'Son', phone: '(555) 765-4321' },
    ],
  };

  const healthMetrics = {
    bloodPressure: [
      { date: '2025-01-01', value: '120/80', notes: 'Normal reading' },
      { date: '2025-01-15', value: '125/85', notes: 'Slight elevation' },
      { date: '2025-01-29', value: '118/79', notes: 'Back to normal range' },
    ],
    weight: [
      { date: '2025-01-01', value: '165 lbs' },
      { date: '2025-01-15', value: '163 lbs' },
      { date: '2025-01-29', value: '164 lbs' },
    ],
  };

  const chartData = healthMetrics.bloodPressure.map((bp) => ({
    date: bp.date,
    systolic: parseInt(bp.value.split('/')[0]),
    diastolic: parseInt(bp.value.split('/')[1]),
  }));

  const recentAlerts = [
    {
      date: '2025-01-29',
      type: 'Blood Pressure',
      message: 'Above normal range',
    },
    { date: '2025-01-28', type: 'Medication', message: 'Missed evening dose' },
  ];

  return (
    <div className="p-6 space-y-6 mt-14">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold">
            {patientData.name}'s Health Record
          </h1>
          <p className="text-gray-500">
            Room {patientData.roomNumber} | Primary Caregiver:{' '}
            {patientData.primaryCaregiver}
          </p>
        </div>
        <div className="flex gap-4">
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

      {/* Quick Actions and Alerts */}
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
              <button className="flex flex-col items-center gap-2 p-4 border rounded-lg hover:bg-gray-50">
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

      {/* Health Metrics Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Blood Pressure Trends</CardTitle>
          <CardDescription>
            Systolic and Diastolic Pressure Over Time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            className="w-full h-full flex justify-center items-center"
            style={{ height: '300px' }}
          >
            <LineChart
              width={1000}
              height={300}
              data={chartData}
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
          </div>
        </CardContent>
      </Card>

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
    </div>
  );
};

export default IndividualHealthRecord;
