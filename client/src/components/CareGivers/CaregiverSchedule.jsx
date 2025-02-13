import React, { useState } from 'react';
import {
  Calendar,
  Badge,
  Modal,
  Form,
  Input,
  Select,
  Button,
  Card,
  Avatar,
  Popover,
  Tag,
  Timeline,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
  ClockCircleOutlined,
} from '@ant-design/icons';
import moment from 'moment';
import './CaregiverSchedule.css'; // Custom CSS for styling

const { Option } = Select;

const CaregiverSchedule = ({ caregivers, elders }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [form] = Form.useForm();

  // Generate events from caregivers' schedules
  const events = caregivers.flatMap((caregiver) =>
    caregiver.schedule
      ? [
          {
            ...caregiver,
            date: moment(caregiver.schedule),
            title: `${caregiver.name} - ${caregiver.specialization}`,
            assignedElder: caregiver.assignedElder,
            notes: caregiver.notes,
          },
        ]
      : []
  );

  // Handle date selection (add new event)
  const onSelectDate = (value) => {
    setSelectedEvent(null);
    form.resetFields();
    setIsModalVisible(true);
  };

  // Handle event selection (edit existing event)
  const onSelectEvent = (event) => {
    setSelectedEvent(event);
    form.setFieldsValue({
      caregiver: event.id,
      elder: event.assignedElder,
      date: event.date,
      notes: event.notes,
    });
    setIsModalVisible(true);
  };

  // Save or update event
  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedCaregivers = caregivers.map((caregiver) => {
        if (caregiver.id === values.caregiver) {
          return {
            ...caregiver,
            schedule: values.date,
            assignedElder: values.elder,
            notes: values.notes,
          };
        }
        return caregiver;
      });
      setCaregivers(updatedCaregivers);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  // Cancel modal
  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  // Custom calendar cell rendering
  const dateCellRender = (value) => {
    const listData = events.filter((event) => event.date.isSame(value, 'day'));
    return (
      <ul className="events">
        {listData.map((event) => (
          <li key={event.id}>
            <Popover
              content={
                <div>
                  <p>
                    <strong>Caregiver:</strong> {event.name}
                  </p>
                  <p>
                    <strong>Elder:</strong>{' '}
                    {elders.find((elder) => elder.id === event.assignedElder)
                      ?.name || 'Unassigned'}
                  </p>
                  <p>
                    <strong>Notes:</strong> {event.notes}
                  </p>
                </div>
              }
              trigger="hover"
            >
              <Badge
                status="success"
                text={event.title}
                onClick={() => onSelectEvent(event)}
              />
            </Popover>
          </li>
        ))}
      </ul>
    );
  };

  // Timeline for upcoming events
  const upcomingEvents = events.filter((event) => event.date.isAfter(moment()));
  const timelineItems = upcomingEvents.map((event) => ({
    color: 'green',
    dot: <ClockCircleOutlined />,
    children: (
      <div>
        <p>
          <strong>{event.title}</strong>
        </p>
        <p>
          Assigned to:{' '}
          {elders.find((elder) => elder.id === event.assignedElder)?.name ||
            'Unassigned'}
        </p>
        <p>{event.date.format('YYYY-MM-DD HH:mm')}</p>
      </div>
    ),
  }));

  return (
    <div className="schedule-container">
      <Card
        title="Caregiver Schedule"
        extra={
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => onSelectDate(moment())}
          >
            Add Event
          </Button>
        }
      >
        <div className="calendar-section">
          <Calendar
            dateCellRender={dateCellRender}
            onSelect={onSelectDate}
            headerRender={({ value, onChange }) => (
              <div className="calendar-header">
                <Button
                  onClick={() => onChange(value.clone().subtract(1, 'month'))}
                >
                  Previous Month
                </Button>
                <span className="current-month">
                  {value.format('MMMM YYYY')}
                </span>
                <Button onClick={() => onChange(value.clone().add(1, 'month'))}>
                  Next Month
                </Button>
              </div>
            )}
          />
        </div>
      </Card>

      <Card title="Upcoming Events" className="upcoming-events">
        <Timeline items={timelineItems} />
      </Card>

      <Modal
        title={selectedEvent ? 'Edit Event' : 'Add Event'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleOk}>
            {selectedEvent ? 'Update' : 'Add'}
          </Button>,
        ]}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="caregiver"
            label="Caregiver"
            rules={[{ required: true, message: 'Please select a caregiver!' }]}
          >
            <Select placeholder="Select a caregiver">
              {caregivers.map((caregiver) => (
                <Option key={caregiver.id} value={caregiver.id}>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  {caregiver.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="elder"
            label="Assigned Elder"
            rules={[{ required: true, message: 'Please select an elder!' }]}
          >
            <Select placeholder="Select an elder">
              {elders.map((elder) => (
                <Option key={elder.id} value={elder.id}>
                  <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
                  {elder.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="date"
            label="Date & Time"
            rules={[
              { required: true, message: 'Please select a date and time!' },
            ]}
          >
            <DatePicker
              showTime
              format="YYYY-MM-DD HH:mm"
              style={{ width: '100%' }}
            />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <Input.TextArea rows={4} placeholder="Add notes about the event" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default CaregiverSchedule;
