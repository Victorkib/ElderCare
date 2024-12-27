// CareAnalytics.jsx
import { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import {
  AlertTriangle,
  Check,
  Clock,
  Activity,
  Calendar,
  PlusCircle,
} from 'lucide-react';
import './CareAnalytics.scss';

const Card = ({ title, description, icon: Icon, children, className = '' }) => (
  <div className={`analytics-card ${className}`}>
    <div className="card-header">
      <div className="card-title">
        {Icon && <Icon className="card-icon" />}
        <h3>{title}</h3>
      </div>
      {description && <p className="card-description">{description}</p>}
    </div>
    <div className="card-content">{children}</div>
  </div>
);

const CareAnalytics = () => {
  const [timeframe, setTimeframe] = useState('week');
  const [selectedPatient, setSelectedPatient] = useState('John Doe');
  const [showNoteModal, setShowNoteModal] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [noteText, setNoteText] = useState('');

  const medicationData = [
    { date: '2024-03-20', adherence: 100, count: 3 },
    { date: '2024-03-21', adherence: 85, count: 4 },
    { date: '2024-03-22', adherence: 90, count: 3 },
    { date: '2024-03-23', adherence: 95, count: 4 },
    { date: '2024-03-24', adherence: 80, count: 3 },
  ];

  const upcomingTasks = [
    {
      id: 1,
      type: 'medication',
      name: 'Blood Pressure Med',
      time: '09:00',
      status: 'pending',
    },
    {
      id: 2,
      type: 'appointment',
      name: 'Dr. Smith Checkup',
      time: '14:30',
      status: 'confirmed',
    },
    {
      id: 3,
      type: 'daily-care',
      name: 'Physical Exercise',
      time: '11:00',
      status: 'missed',
    },
  ];

  const healthMetrics = {
    bp: [
      { time: '08:00', value: '120/80' },
      { time: '20:00', value: '118/75' },
    ],
    weight: '68kg',
    lastMeal: '2 hours ago',
    sleepHours: '7.5',
    symptoms: ['Mild fatigue', 'Good appetite'],
    mood: 'Content',
  };

  const handleAddNote = (date) => {
    setSelectedDate(date);
    setShowNoteModal(true);
  };

  const saveNote = () => {
    // Save note logic here
    setShowNoteModal(false);
    setNoteText('');
  };

  return (
    <div className="care-analytics">
      <div className="analytics-header">
        <div className="header-info">
          <h1>Care Analytics Dashboard</h1>
          <p>Patient: {selectedPatient}</p>
        </div>
        <div className="header-controls">
          <select
            value={timeframe}
            onChange={(e) => setTimeframe(e.target.value)}
          >
            <option value="day">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
      </div>

      <div className="analytics-grid">
        <Card
          title="Medication Adherence"
          icon={Activity}
          className="adherence-card"
        >
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={medicationData}>
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="adherence" stroke="#2563eb" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card title="Today's Schedule" icon={Clock} className="schedule-card">
          <div className="schedule-list">
            {upcomingTasks.map((task) => (
              <div key={task.id} className={`schedule-item ${task.status}`}>
                <div className="task-info">
                  <p className="task-name">{task.name}</p>
                  <p className="task-time">{task.time}</p>
                </div>
                <div className="task-status">
                  {task.status === 'pending' && <AlertTriangle />}
                  {task.status === 'confirmed' && <Check />}
                  {task.status === 'missed' && <AlertTriangle />}
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card title="Health Metrics" icon={Activity} className="metrics-card">
          <div className="metrics-grid">
            <div className="metric-item">
              <h4>Blood Pressure</h4>
              <div className="bp-readings">
                {healthMetrics.bp.map((reading, i) => (
                  <div key={i} className="bp-reading">
                    <span>{reading.value}</span>
                    <small>@ {reading.time}</small>
                  </div>
                ))}
              </div>
            </div>
            <div className="metric-item">
              <h4>Weight</h4>
              <p>{healthMetrics.weight}</p>
            </div>
            <div className="metric-item">
              <h4>Last Meal</h4>
              <p>{healthMetrics.lastMeal}</p>
            </div>
            <div className="metric-item">
              <h4>Sleep Duration</h4>
              <p>{healthMetrics.sleepHours} hours</p>
            </div>
            <div className="metric-item">
              <h4>Current Symptoms</h4>
              <ul className="symptoms-list">
                {healthMetrics.symptoms.map((symptom, i) => (
                  <li key={i}>{symptom}</li>
                ))}
              </ul>
            </div>
            <div className="metric-item">
              <h4>Mood</h4>
              <p>{healthMetrics.mood}</p>
            </div>
          </div>
        </Card>
      </div>

      <Card
        title="Care History"
        icon={Calendar}
        description="Recent activities and health events"
        className="history-card"
      >
        <div className="history-list">
          {medicationData.map((day, index) => (
            <div key={index} className="history-item">
              <div className="history-info">
                <p className="history-date">Day: {day.date}</p>
                <p className="history-meds">Medications taken: {day.count}</p>
              </div>
              <div className="history-status">
                <div
                  className={`adherence-badge ${
                    day.adherence >= 90
                      ? 'high'
                      : day.adherence >= 70
                      ? 'medium'
                      : 'low'
                  }`}
                >
                  {day.adherence}% adherence
                </div>
                <button
                  className="note-button"
                  onClick={() => handleAddNote(day.date)}
                >
                  <PlusCircle />
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

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
    </div>
  );
};

export default CareAnalytics;
