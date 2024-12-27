import { useState } from 'react';
import {
  Calendar,
  Clock,
  Plus,
  Search,
  FileText,
  Activity,
  Weight,
  Heart,
  Utensils,
} from 'lucide-react';
import './HealthLogInterface.scss';

const HealthLogInterface = () => {
  const [activeTab, setActiveTab] = useState('new');
  const [logFormData, setLogFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString().slice(0, 5),
    category: 'vital-signs',
    bloodPressure: { systolic: '', diastolic: '' },
    weight: '',
    heartRate: '',
    meal: { type: 'breakfast', description: '', calories: '' },
    medication: { name: '', dosage: '', taken: false },
    notes: '',
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Submitted health log:', logFormData);
    // Add API call here
  };

  return (
    <div className="health-log-container">
      <div className="health-log-card fade-in">
        <div className="health-log-tabs">
          <button
            className={`${activeTab === 'new' ? 'active' : ''}`}
            onClick={() => setActiveTab('new')}
          >
            <Plus size={20} />
            New Log
          </button>
          <button
            className={`${activeTab === 'history' ? 'active' : ''}`}
            onClick={() => setActiveTab('history')}
          >
            <FileText size={20} />
            History
          </button>
        </div>

        {activeTab === 'new' ? (
          <form onSubmit={handleSubmit} className="health-log-form">
            <div className="grid">
              <div className="form-group">
                <div className="flex space-x-4">
                  <div className="flex-1">
                    <label>Date</label>
                    <div className="input-group">
                      <Calendar size={20} />
                      <input
                        type="date"
                        value={logFormData.date}
                        onChange={(e) =>
                          setLogFormData({
                            ...logFormData,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                  <div className="flex-1">
                    <label>Time</label>
                    <div className="input-group">
                      <Clock size={20} />
                      <input
                        type="time"
                        value={logFormData.time}
                        onChange={(e) =>
                          setLogFormData({
                            ...logFormData,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label>Category</label>
                  <div className="input-group">
                    <select
                      value={logFormData.category}
                      onChange={(e) =>
                        setLogFormData({
                          ...logFormData,
                          category: e.target.value,
                        })
                      }
                    >
                      <option value="vital-signs">Vital Signs</option>
                      <option value="meals">Meals</option>
                      <option value="medication">Medication</option>
                      <option value="activity">Activity</option>
                    </select>
                  </div>
                </div>

                {logFormData.category === 'vital-signs' && (
                  <div className="form-group">
                    <label>Blood Pressure (mmHg)</label>
                    <div className="blood-pressure-group">
                      <div className="input-group">
                        <Heart size={20} />
                        <input
                          type="number"
                          placeholder="Systolic"
                          value={logFormData.bloodPressure.systolic}
                          onChange={(e) =>
                            setLogFormData({
                              ...logFormData,
                              bloodPressure: {
                                ...logFormData.bloodPressure,
                                systolic: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                      <span className="separator">/</span>
                      <input
                        type="number"
                        placeholder="Diastolic"
                        value={logFormData.bloodPressure.diastolic}
                        onChange={(e) =>
                          setLogFormData({
                            ...logFormData,
                            bloodPressure: {
                              ...logFormData.bloodPressure,
                              diastolic: e.target.value,
                            },
                          })
                        }
                      />
                    </div>

                    <div className="form-group">
                      <label>Weight (kg)</label>
                      <div className="input-group">
                        <Weight size={20} />
                        <input
                          type="number"
                          step="0.1"
                          value={logFormData.weight}
                          onChange={(e) =>
                            setLogFormData({
                              ...logFormData,
                              weight: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Heart Rate (bpm)</label>
                      <div className="input-group">
                        <Activity size={20} />
                        <input
                          type="number"
                          value={logFormData.heartRate}
                          onChange={(e) =>
                            setLogFormData({
                              ...logFormData,
                              heartRate: e.target.value,
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}

                {logFormData.category === 'meals' && (
                  <div className="form-group">
                    <label>Meal Type</label>
                    <div className="input-group">
                      <Utensils size={20} />
                      <select
                        value={logFormData.meal.type}
                        onChange={(e) =>
                          setLogFormData({
                            ...logFormData,
                            meal: { ...logFormData.meal, type: e.target.value },
                          })
                        }
                      >
                        <option value="breakfast">Breakfast</option>
                        <option value="lunch">Lunch</option>
                        <option value="dinner">Dinner</option>
                        <option value="snack">Snack</option>
                      </select>
                    </div>

                    <div className="form-group">
                      <label>Description</label>
                      <div className="input-group">
                        <textarea
                          value={logFormData.meal.description}
                          onChange={(e) =>
                            setLogFormData({
                              ...logFormData,
                              meal: {
                                ...logFormData.meal,
                                description: e.target.value,
                              },
                            })
                          }
                          rows={3}
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Estimated Calories</label>
                      <div className="input-group">
                        <input
                          type="number"
                          value={logFormData.meal.calories}
                          onChange={(e) =>
                            setLogFormData({
                              ...logFormData,
                              meal: {
                                ...logFormData.meal,
                                calories: e.target.value,
                              },
                            })
                          }
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label>Additional Notes</label>
                <div className="input-group">
                  <textarea
                    value={logFormData.notes}
                    onChange={(e) =>
                      setLogFormData({ ...logFormData, notes: e.target.value })
                    }
                    rows={5}
                    placeholder="Enter any additional observations or notes..."
                  />
                </div>
              </div>
            </div>

            <div className="health-log-actions">
              <button
                type="button"
                className="secondary"
                onClick={() =>
                  setLogFormData({
                    date: new Date().toISOString().split('T')[0],
                    time: new Date().toLocaleTimeString().slice(0, 5),
                    category: 'vital-signs',
                    bloodPressure: { systolic: '', diastolic: '' },
                    weight: '',
                    heartRate: '',
                    meal: { type: 'breakfast', description: '', calories: '' },
                    medication: { name: '', dosage: '', taken: false },
                    notes: '',
                  })
                }
              >
                Reset
              </button>
              <button type="submit" className="primary">
                Save Log
              </button>
            </div>
          </form>
        ) : (
          <div className="health-log-history">
            <div className="search-box">
              <Search size={20} />
              <input type="text" placeholder="Search health logs..." />
            </div>
            <div className="text-center text-gray-500">
              Health log history will be displayed here
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HealthLogInterface;
