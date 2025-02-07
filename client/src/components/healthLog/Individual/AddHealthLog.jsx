import { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import {
  Button,
  Input,
  Select,
  DatePicker,
  Form,
  Card,
  Alert,
  Spin,
} from 'antd';
import apiRequest from '../../../utils/api';
import Pagination from 'react-js-pagination';
import moment from 'moment';
import './Pagination.css'; // Import custom styles for pagination
import { useNavigate } from 'react-router-dom';
import MedicationInput from './MedicationInput';

const AddHealthLog = () => {
  const [form] = Form.useForm();
  const [elderlyList, setElderlyList] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedElderly, setSelectedElderly] = useState(null);
  console.log('selectedElderly: ', selectedElderly);
  const [loading, setLoading] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [activePage, setActivePage] = useState(1);
  const itemsPerPage = 4; // Number of items per page
  const navigate = useNavigate();

  useEffect(() => {
    const fetchElderlyUsers = async () => {
      try {
        setLoading(true);
        const response = await apiRequest.get('/elders/getAllElders');
        if (!response.data) {
          throw new Error('Failed to fetch elderly users');
        }
        setElderlyList(response.data);
      } catch (error) {
        console.error('Error fetching elderly users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchElderlyUsers();
  }, []);

  const filteredElderly = elderlyList.filter((elderly) =>
    elderly.firstName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber);
  };

  const indexOfLastItem = activePage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredElderly.slice(indexOfFirstItem, indexOfLastItem);

  const handleSubmit = async (values) => {
    try {
      setLoading(true);
      const healthLogData = {
        elderlyId: selectedElderly._id,
        ...values,
        medications: values.medications || [], // Ensure medications field is included
        logDateTime: values.logDateTime.toISOString(),
      };
      const response = await apiRequest.post(
        '/elderHealthLog/addHealthLog',
        healthLogData
      );
      if (!response.data) {
        throw new Error('Failed to submit health log');
      }
      setSubmitStatus('success');
      form.resetFields();
      setSelectedElderly(null);
      navigate(`/indiv/${selectedElderly._id}`);
    } catch (error) {
      console.error('Error submitting health log:', error);
      setSubmitStatus('error');
    } finally {
      setLoading(false);
    }
  };

  const calculateAge = (birthdate) => {
    if (!birthdate) return 'N/A';
    return new Date().getFullYear() - new Date(birthdate).getFullYear();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 mt-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-1">Add Health Log</h1>
      <Card title="Step 1: Select Elderly User" className="mb-4 shadow-sm">
        <Input
          placeholder="Search by name..."
          prefix={<SearchOutlined />}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="mb-4"
        />
        {loading ? (
          <Spin tip="Loading elderly users..." />
        ) : (
          <>
            <div className="flex overflow-x-auto gap-4 pb-4">
              {currentItems.map((elderly) => (
                <Card
                  key={elderly._id}
                  onClick={() => setSelectedElderly(elderly)}
                  className={`cursor-pointer transition-all min-w-[250px] ${
                    selectedElderly?._id === elderly._id
                      ? 'border-2 border-blue-500 bg-blue-50'
                      : 'hover:border-blue-200'
                  }`}
                >
                  <h3 className="text-lg font-semibold">{elderly.firstName}</h3>
                  <p className="text-gray-600">
                    Age: {calculateAge(elderly.dateOfBirth)}
                  </p>
                  <p className="text-sm text-gray-500">
                    Last Log: {elderly.log ? elderly.log : 'No Last log Record'}
                  </p>
                </Card>
              ))}
            </div>
            <div className="mt-4 flex justify-center">
              <Pagination
                activePage={activePage}
                itemsCountPerPage={itemsPerPage}
                totalItemsCount={filteredElderly.length}
                pageRangeDisplayed={5}
                onChange={handlePageChange}
                itemClass="page-item"
                linkClass="page-link"
                prevPageText="‹"
                nextPageText="›"
              />
            </div>
          </>
        )}
      </Card>

      {selectedElderly && (
        <Card
          title={`Step 2: Log Health Data for ${selectedElderly.firstName}`}
          className="shadow-sm"
        >
          <Form form={form} layout="vertical" onFinish={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
              {/* Blood Pressure */}
              <Form.Item
                label="Blood Pressure (mmHg)"
                name="bloodPressure"
                rules={[
                  { required: true, message: 'Blood pressure is required' },
                  {
                    pattern: /^\d{2,3}\/\d{2,3}$/,
                    message: 'Please enter in format like 120/80',
                  },
                ]}
              >
                <Input placeholder="e.g., 120/80" />
              </Form.Item>
              {/* Weight */}
              <Form.Item
                label="Weight (kg)"
                name="weight"
                rules={[
                  { required: true, message: 'Weight is required' },
                  {
                    type: 'number',
                    min: 20,
                    max: 200,
                    message: 'Please enter a valid weight between 20-200 kg',
                  },
                ]}
                normalize={(value) => (value ? Number(value) : null)} // Convert string to number
              >
                <Input type="number" min={20} max={200} step={0.1} />
              </Form.Item>
              {/* Heart Rate */}
              <Form.Item
                label="Heart Rate (bpm)"
                name="heartRate"
                rules={[
                  { required: true, message: 'Heart rate is required' },
                  {
                    type: 'number',
                    min: 40,
                    max: 200,
                    message:
                      'Please enter a valid heart rate between 40-200 bpm',
                  },
                ]}
                normalize={(value) => (value ? Number(value) : null)} // Convert string to number
              >
                <Input type="number" min={40} max={200} />
              </Form.Item>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              {/* Blood Glucose */}
              <Form.Item
                label="Blood Glucose (mg/dL)"
                name="glucose"
                rules={[
                  {
                    type: 'number',
                    min: 20,
                    max: 600,
                    message:
                      'Please enter a valid glucose level between 20-600 mg/dL',
                  },
                ]}
                normalize={(value) => (value ? Number(value) : null)} // Convert string to number
              >
                <Input type="number" min={20} max={600} />
              </Form.Item>

              {/* Oxygen Saturation */}
              <Form.Item
                label="Oxygen Saturation (%)"
                name="oxygen"
                rules={[
                  {
                    type: 'number',
                    min: 50,
                    max: 100,
                    message:
                      'Please enter a valid oxygen level between 50-100%',
                  },
                ]}
                normalize={(value) => (value ? Number(value) : null)} // Convert string to number
              >
                <Input type="number" min={50} max={100} />
              </Form.Item>
              {/* Temperature */}
              <Form.Item
                label="Temperature (°C)"
                name="temperature"
                rules={[
                  {
                    type: 'number',
                    min: 35,
                    max: 42,
                    message: 'Please enter a valid temperature between 35-42°C',
                  },
                ]}
                normalize={(value) => (value ? Number(value) : null)} // Convert string to number
              >
                <Input type="number" min={35} max={42} step={0.1} />
              </Form.Item>
              <Form.Item label="Pain Level (1-10)" name="painLevel">
                <Select>
                  {[...Array(10).keys()].map((n) => (
                    <Select.Option key={n + 1} value={n + 1}>
                      {n + 1}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </div>
            {/* Notes */}
            <Form.Item
              label="Notes"
              name="notes"
              rules={[
                { required: true, message: 'Notes are required' },
                {
                  min: 10,
                  message: 'Notes should be at least 10 characters long',
                },
              ]}
            >
              <Input.TextArea
                rows={4}
                maxLength={500}
                showCount
                placeholder="Enter detailed observations..."
              />
            </Form.Item>
            {/* Replace the existing medications Form.Item with this: */}
            <Form.Item
              label="Medications Administered"
              name="medications"
              rules={[{ required: false }]}
            >
              <MedicationInput />
            </Form.Item>
            {/* Log Date & Time */}
            <Form.Item
              label="Log Date & Time"
              name="logDateTime"
              rules={[
                { required: true, message: 'Date and time are required' },
                {
                  validator: (_, value) => {
                    if (value && value.isAfter(moment())) {
                      return Promise.reject('Cannot select future date/time');
                    }
                    return Promise.resolve();
                  },
                },
              ]}
            >
              <DatePicker showTime className="w-full" />
            </Form.Item>
            <div className="flex gap-4">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                {' '}
                Submit Health Log{' '}
              </Button>
              <Button onClick={() => setSelectedElderly(null)}>Cancel</Button>
            </div>
            {submitStatus === 'success' && (
              <Alert
                message="Health log submitted successfully!"
                type="success"
                showIcon
                className="mt-4"
              />
            )}
            {submitStatus === 'error' && (
              <Alert
                message="Submission failed. Please try again."
                type="error"
                showIcon
                className="mt-4"
              />
            )}
          </Form>
        </Card>
      )}
    </div>
  );
};

export default AddHealthLog;
