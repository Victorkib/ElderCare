import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import {
  Form,
  Input,
  TimePicker,
  DatePicker,
  Select,
  Button,
  Space,
  Tag,
} from 'antd';
import { PlusCircle, X } from 'lucide-react';
import { format } from 'date-fns';

const { RangePicker: TimeRangePicker } = TimePicker;

const MedicationInput = ({ value = [], onChange }) => {
  const [isAddingMed, setIsAddingMed] = useState(false);
  const [form] = Form.useForm();

  const frequencyOptions = [
    { value: 'once_daily', label: 'Once Daily' },
    { value: 'twice_daily', label: 'Twice Daily' },
    { value: 'thrice_daily', label: 'Three Times Daily' },
    { value: 'every_other_day', label: 'Every Other Day' },
    { value: 'weekly', label: 'Weekly' },
    { value: 'as_needed', label: 'As Needed' },
    { value: 'custom', label: 'Custom' },
  ];

  const handleAddMedication = async () => {
    try {
      // Validate and get form values
      const medData = await form.validateFields();
      const newMedication = {
        ...medData,
        id: uuidv4(), // Generate a unique ID using uuid
        timeSlots:
          medData.timeSlots?.map((time) => format(time, 'HH:mm')) || [],
        refillDate: medData.refillDate?.format('YYYY-MM-DD') || null,
      };

      // Update the parent form's medications array
      onChange([...value, newMedication]);
      setIsAddingMed(false);
      form.resetFields();
    } catch (error) {
      console.error('Validation failed:', error);
    }
  };

  const handleRemoveMedication = (medId) => {
    onChange(value.filter((med) => med.id !== medId));
  };

  return (
    <div className="space-y-4">
      {/* Display existing medications */}
      <div className="space-y-2">
        {value.map((med) => (
          <div
            key={med.id}
            className="flex items-center gap-2 p-3 bg-gray-50 rounded-md"
          >
            <div className="flex-1">
              <div className="font-medium">
                {med.name} - {med.dosage}
              </div>
              <div className="text-sm text-gray-600">
                {med.frequency} | Times: {med.timeSlots.join(', ')}
              </div>
              <div className="mt-1 flex flex-wrap gap-1">
                {med.sideEffects.map((effect, i) => (
                  <Tag
                    key={i}
                    className="bg-red-50 text-red-700 px-2 py-1 text-xs rounded"
                  >
                    {effect}
                  </Tag>
                ))}
              </div>
            </div>
            <Button
              type="text"
              size="small"
              onClick={() => handleRemoveMedication(med.id)}
              className="text-red-500 hover:text-red-700"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}
      </div>

      {/* Add new medication form */}
      {isAddingMed ? (
        <div className="border rounded-lg p-4 bg-white">
          <Form form={form} layout="vertical" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="name"
                label="Medication Name"
                rules={[
                  { required: true, message: 'Please enter medication name' },
                ]}
              >
                <Input placeholder="Enter medication name" />
              </Form.Item>

              <Form.Item
                name="dosage"
                label="Dosage"
                rules={[{ required: true, message: 'Please enter dosage' }]}
              >
                <Input placeholder="e.g., 10mg" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item
                name="frequency"
                label="Frequency"
                rules={[{ required: true, message: 'Please select frequency' }]}
              >
                <Select options={frequencyOptions} />
              </Form.Item>

              <Form.Item
                name="timeSlots"
                label="Time Slots"
                rules={[
                  { required: true, message: 'Please select time slots' },
                ]}
              >
                <TimeRangePicker className="w-full" format="HH:mm" />
              </Form.Item>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Form.Item name="refillDate" label="Next Refill Date">
                <DatePicker className="w-full" />
              </Form.Item>

              <Form.Item name="sideEffects" label="Known Side Effects">
                <Select
                  mode="tags"
                  placeholder="Type and press enter to add side effects"
                  className="w-full"
                />
              </Form.Item>
            </div>

            <Form.Item name="notes" label="Additional Notes">
              <Input.TextArea
                rows={2}
                placeholder="Enter any additional notes or instructions"
              />
            </Form.Item>

            <Space>
              <Button
                type="primary"
                onClick={handleAddMedication} // Use onClick instead of htmlType="submit"
                className="bg-blue-500 text-white hover:bg-blue-600"
              >
                Add Medication
              </Button>
              <Button onClick={() => setIsAddingMed(false)}>Cancel</Button>
            </Space>
          </Form>
        </div>
      ) : (
        <Button
          onClick={() => setIsAddingMed(true)}
          className="w-full bg-gray-50 hover:bg-gray-100 border-dashed border-2 text-gray-600"
        >
          <PlusCircle className="h-4 w-4 mr-2" />
          Add New Medication
        </Button>
      )}
    </div>
  );
};

export default MedicationInput;
