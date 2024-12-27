import { useState } from 'react';
import './HealthLogs.scss';

const HealthLogs = () => {
  const [activeTab, setActiveTab] = useState('log-data');
  const [healthLogs, setHealthLogs] = useState([]);

  const handleLogSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const log = {
      date: formData.get('date'),
      time: formData.get('time'),
      activity: formData.get('activity'),
      meal: formData.get('meal'),
      observations: formData.get('observations'),
      bloodPressure: formData.get('bloodPressure'),
      weight: formData.get('weight'),
    };
    setHealthLogs([...healthLogs, log]);
    e.target.reset();
  };

  return (
    <div className="health-logs-container">
      <header className="health-logs-header">
        <h1>Elderly Health Logs</h1>
        <p>Track daily activities, meals, and health observations with ease.</p>
      </header>

      <div className="tabs">
        <button
          className={`tab ${activeTab === 'log-data' ? 'active' : ''}`}
          onClick={() => setActiveTab('log-data')}
        >
          Log Health Data
        </button>
        <button
          className={`tab ${activeTab === 'view-logs' ? 'active' : ''}`}
          onClick={() => setActiveTab('view-logs')}
        >
          View Health Logs
        </button>
      </div>

      {activeTab === 'log-data' && (
        <div className="tab-content log-data">
          <h2>Log Health Data</h2>
          <form onSubmit={handleLogSubmit}>
            <div className="form-group">
              <label>Date:</label>
              <input type="date" name="date" required />
            </div>
            <div className="form-group">
              <label>Time:</label>
              <input type="time" name="time" required />
            </div>
            <div className="form-group">
              <label>Activity:</label>
              <input
                type="text"
                name="activity"
                placeholder="E.g., Morning walk"
              />
            </div>
            <div className="form-group">
              <label>Meal:</label>
              <input
                type="text"
                name="meal"
                placeholder="E.g., Breakfast: Oatmeal"
              />
            </div>
            <div className="form-group">
              <label>Observations:</label>
              <textarea
                name="observations"
                rows="3"
                placeholder="E.g., Feeling energetic, slight cough"
              ></textarea>
            </div>
            <div className="form-group">
              <label>Blood Pressure (mmHg):</label>
              <input
                type="text"
                name="bloodPressure"
                placeholder="E.g., 120/80"
              />
            </div>
            <div className="form-group">
              <label>Weight (kg):</label>
              <input type="number" name="weight" placeholder="E.g., 70" />
            </div>
            <button type="submit" className="btn-primary">
              Submit Log
            </button>
          </form>
        </div>
      )}

      {activeTab === 'view-logs' && (
        <div className="tab-content view-logs">
          <h2>Health Logs</h2>
          {healthLogs.length > 0 ? (
            <div className="logs-list">
              {healthLogs.map((log, index) => (
                <div className="log-card" key={index}>
                  <h3>{log.date}</h3>
                  <p>
                    <strong>Time:</strong> {log.time}
                  </p>
                  <p>
                    <strong>Activity:</strong> {log.activity}
                  </p>
                  <p>
                    <strong>Meal:</strong> {log.meal}
                  </p>
                  <p>
                    <strong>Observations:</strong> {log.observations}
                  </p>
                  <p>
                    <strong>Blood Pressure:</strong> {log.bloodPressure}
                  </p>
                  <p>
                    <strong>Weight:</strong> {log.weight} kg
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p>No logs recorded yet.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default HealthLogs;
