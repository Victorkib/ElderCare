import { useState } from 'react';
import './Scheduler.scss';

const Scheduler = () => {
  const [activeTab, setActiveTab] = useState('medications');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'medications':
        return (
          <div className="tab-content">
            <h3>Add Medication</h3>
            <form>
              <label>
                Medication Name:
                <input type="text" placeholder="Enter medication name" />
              </label>
              <label>
                Dosage:
                <input type="text" placeholder="Enter dosage details" />
              </label>
              <label>
                Time:
                <input type="time" />
              </label>
              <button type="submit" className="btn-primary">
                Add Medication
              </button>
            </form>
          </div>
        );
      case 'appointments':
        return (
          <div className="tab-content">
            <h3>Schedule Appointment</h3>
            <form>
              <label>
                Appointment Title:
                <input type="text" placeholder="Enter appointment title" />
              </label>
              <label>
                Date:
                <input type="date" />
              </label>
              <label>
                Time:
                <input type="time" />
              </label>
              <button type="submit" className="btn-primary">
                Add Appointment
              </button>
            </form>
          </div>
        );
      case 'daily-care':
        return (
          <div className="tab-content">
            <h3>Daily Care Routine</h3>
            <form>
              <label>
                Task Name:
                <input type="text" placeholder="Enter task name" />
              </label>
              <label>
                Description:
                <textarea placeholder="Enter task description"></textarea>
              </label>
              <label>
                Time:
                <input type="time" />
              </label>
              <button type="submit" className="btn-primary">
                Add Task
              </button>
            </form>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="scheduler-container">
      <header className="scheduler-header">
        <h1>Care Scheduler</h1>
      </header>
      <div className="tabs">
        <button
          className={`tab ${activeTab === 'medications' ? 'active' : ''}`}
          onClick={() => setActiveTab('medications')}
        >
          Medications
        </button>
        <button
          className={`tab ${activeTab === 'appointments' ? 'active' : ''}`}
          onClick={() => setActiveTab('appointments')}
        >
          Appointments
        </button>
        <button
          className={`tab ${activeTab === 'daily-care' ? 'active' : ''}`}
          onClick={() => setActiveTab('daily-care')}
        >
          Daily Care
        </button>
      </div>
      <div className="tab-content-wrapper">{renderTabContent()}</div>
    </div>
  );
};

export default Scheduler;
