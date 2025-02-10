import { useState, useEffect } from 'react';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Chart } from 'react-google-charts';
import {
  Modal,
  Button,
  Form,
  Table,
  Badge,
  Alert,
  Spinner,
} from 'react-bootstrap';

// Initialize calendar localizer
const localizer = momentLocalizer(moment);

const CaregiverManagementDashboard = () => {
  const [caregivers, setCaregivers] = useState([
    { id: 1, name: 'Alice Johnson', role: 'Caregiver', status: 'Active' },
    { id: 2, name: 'Bob Smith', role: 'Nurse', status: 'Inactive' },
    { id: 3, name: 'Carol Lee', role: 'Doctor', status: 'Active' },
  ]);
  const [selectedCaregiver, setSelectedCaregiver] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'Caregiver',
    status: 'Active',
  });
  const [events, setEvents] = useState([
    { title: 'Meeting with Bob', start: new Date(), end: new Date() },
    { title: 'Shift with Alice', start: new Date(), end: new Date() },
  ]);
  const [tasks, setTasks] = useState([
    {
      id: 1,
      description: 'Prepare medication',
      assignedTo: 'Alice Johnson',
      status: 'Pending',
    },
    {
      id: 2,
      description: 'Check vitals',
      assignedTo: 'Bob Smith',
      status: 'Completed',
    },
  ]);
  const [performanceData, setPerformanceData] = useState([
    { name: 'Alice Johnson', tasksCompleted: 12 },
    { name: 'Bob Smith', tasksCompleted: 8 },
    { name: 'Carol Lee', tasksCompleted: 15 },
  ]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch caregivers from the backend
  useEffect(() => {
    // fetchCaregivers();
    // fetchSchedule();
    // fetchTasks();
    // fetchPerformanceData();
  }, []);

  const fetchCaregivers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/caregivers');
      setCaregivers(response.data);
    } catch (err) {
      setError('Failed to fetch caregivers');
    } finally {
      setLoading(false);
    }
  };

  const fetchSchedule = async () => {
    try {
      const response = await axios.get('/api/schedule');
      setEvents(response.data);
    } catch (err) {
      setError('Failed to fetch schedule');
    }
  };

  const fetchTasks = async () => {
    try {
      const response = await axios.get('/api/tasks');
      setTasks(response.data);
    } catch (err) {
      setError('Failed to fetch tasks');
    }
  };

  const fetchPerformanceData = async () => {
    try {
      const response = await axios.get('/api/performance');
      setPerformanceData(response.data);
    } catch (err) {
      setError('Failed to fetch performance data');
    }
  };

  const handleAddCaregiver = async () => {
    try {
      await axios.post('/api/caregivers', formData);
      fetchCaregivers();
      setShowModal(false);
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'Caregiver',
        status: 'Active',
      });
    } catch (err) {
      setError('Failed to add caregiver');
    }
  };

  const handleEditCaregiver = async (id) => {
    try {
      await axios.put(`/api/caregivers/${id}`, formData);
      fetchCaregivers();
      setShowModal(false);
    } catch (err) {
      setError('Failed to update caregiver');
    }
  };

  const handleDeleteCaregiver = async (id) => {
    try {
      await axios.delete(`/api/caregivers/${id}`);
      fetchCaregivers();
    } catch (err) {
      setError('Failed to delete caregiver');
    }
  };

  const handleTaskCompletion = async (taskId) => {
    try {
      await axios.put(`/api/tasks/${taskId}`, { status: 'Completed' });
      fetchTasks();
    } catch (err) {
      setError('Failed to update task status');
    }
  };

  const handleEmergencyAlert = async (caregiverId) => {
    try {
      const caregiver = caregivers.find((c) => c.id === caregiverId);
      await axios.post('/api/emergency', {
        message: `Emergency alert for ${caregiver.name}`,
        contact: caregiver.phone,
      });
      alert('Emergency alert sent!');
    } catch (err) {
      setError('Failed to send emergency alert');
    }
  };

  return (
    <div className="container-fluid p-4 mt-11">
      {error && <Alert variant="danger">{error}</Alert>}

      <div className="row">
        {/* Caregiver List */}
        <div className="col-md-4">
          <h3>Caregivers</h3>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            Add Caregiver
          </Button>
          {loading ? (
            <Spinner animation="border" />
          ) : (
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Role</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {caregivers.map((caregiver) => (
                  <tr key={caregiver.id}>
                    <td>{caregiver.name}</td>
                    <td>{caregiver.role}</td>
                    <td>
                      <Badge
                        variant={
                          caregiver.status === 'Active' ? 'success' : 'danger'
                        }
                      >
                        {caregiver.status}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => {
                          setSelectedCaregiver(caregiver);
                          setFormData(caregiver);
                          setShowModal(true);
                        }}
                      >
                        Edit
                      </Button>{' '}
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteCaregiver(caregiver.id)}
                      >
                        Delete
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </div>

        {/* Schedule Calendar */}
        <div className="col-md-8">
          <h3>Caregiver Schedule</h3>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 500 }}
          />
        </div>
      </div>

      {/* Task Management */}
      <div className="row mt-4">
        <div className="col-md-6">
          <h3>Task Assignment</h3>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th>Task</th>
                <th>Assigned To</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td>{task.description}</td>
                  <td>{task.assignedTo}</td>
                  <td>
                    <Badge
                      variant={
                        task.status === 'Completed' ? 'success' : 'warning'
                      }
                    >
                      {task.status}
                    </Badge>
                  </td>
                  <td>
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleTaskCompletion(task.id)}
                    >
                      Mark Complete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>

        {/* Performance Analytics */}
        <div className="col-md-6">
          <h3>Caregiver Performance</h3>
          <Chart
            width={'100%'}
            height={'300px'}
            chartType="BarChart"
            loader={<div>Loading Chart...</div>}
            data={[
              ['Caregiver', 'Tasks Completed'],
              ...performanceData.map((data) => [
                data.name,
                data.tasksCompleted,
              ]),
            ]}
            options={{
              title: 'Tasks Completed by Caregivers',
              chartArea: { width: '50%' },
              hAxis: { title: 'Tasks Completed', minValue: 0 },
              vAxis: { title: 'Caregiver' },
            }}
          />
        </div>
      </div>

      {/* Add/Edit Caregiver Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        className="mt-11 "
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {selectedCaregiver ? 'Edit Caregiver' : 'Add Caregiver'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formName">
              <Form.Label>Name</Form.Label>
              <Form.Control
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formEmail">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formPhone">
              <Form.Label>Phone</Form.Label>
              <Form.Control
                type="text"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
              />
            </Form.Group>
            <Form.Group controlId="formRole">
              <Form.Label>Role</Form.Label>
              <Form.Control
                as="select"
                value={formData.role}
                onChange={(e) =>
                  setFormData({ ...formData, role: e.target.value })
                }
              >
                <option>Caregiver</option>
                <option>Nurse</option>
                <option>Doctor</option>
              </Form.Control>
            </Form.Group>
            <Form.Group controlId="formStatus">
              <Form.Label>Status</Form.Label>
              <Form.Control
                as="select"
                value={formData.status}
                onChange={(e) =>
                  setFormData({ ...formData, status: e.target.value })
                }
              >
                <option>Active</option>
                <option>Inactive</option>
              </Form.Control>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
          <Button
            variant="primary"
            onClick={
              selectedCaregiver ? handleEditCaregiver : handleAddCaregiver
            }
          >
            {selectedCaregiver ? 'Update' : 'Add'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default CaregiverManagementDashboard;
