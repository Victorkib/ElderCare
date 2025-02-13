import React, { useState } from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Card,
  Avatar,
  Tag,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  UserOutlined,
} from '@ant-design/icons';
import moment from 'moment';

const { Option } = Select;
const { TextArea } = Input;

const CaregiverManagement = () => {
  const [caregivers, setCaregivers] = useState([]);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingCaregiver, setEditingCaregiver] = useState(null);
  const [form] = Form.useForm();

  const showModal = (caregiver = null) => {
    setEditingCaregiver(caregiver);
    if (caregiver) {
      form.setFieldsValue({
        ...caregiver,
        schedule: caregiver.schedule ? moment(caregiver.schedule) : null,
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const updatedCaregivers = [...caregivers];
      if (editingCaregiver) {
        const index = updatedCaregivers.findIndex(
          (c) => c.id === editingCaregiver.id
        );
        updatedCaregivers[index] = { ...editingCaregiver, ...values };
      } else {
        updatedCaregivers.push({ ...values, id: Date.now() });
      }
      setCaregivers(updatedCaregivers);
      setIsModalVisible(false);
      form.resetFields();
    });
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const deleteCaregiver = (id) => {
    setCaregivers(caregivers.filter((c) => c.id !== id));
  };

  const columns = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <Avatar icon={<UserOutlined />} style={{ marginRight: 8 }} />
          <span>{text}</span>
        </div>
      ),
    },
    {
      title: 'Specialization',
      dataIndex: 'specialization',
      key: 'specialization',
      render: (text) => <Tag color="blue">{text}</Tag>,
    },
    {
      title: 'Schedule',
      dataIndex: 'schedule',
      key: 'schedule',
      render: (text) =>
        text ? moment(text).format('YYYY-MM-DD HH:mm') : 'Not Scheduled',
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (text, record) => (
        <span>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
          />
          <Button
            type="link"
            icon={<DeleteOutlined />}
            onClick={() => deleteCaregiver(record.id)}
          />
        </span>
      ),
    },
  ];

  return (
    <Card
      title="Caregiver Management"
      extra={
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => showModal()}
        >
          Add Caregiver
        </Button>
      }
    >
      <Table dataSource={caregivers} columns={columns} rowKey="id" />
      <Modal
        title={editingCaregiver ? 'Edit Caregiver' : 'Add Caregiver'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Name"
            rules={[
              { required: true, message: 'Please input the caregiver name!' },
            ]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="specialization"
            label="Specialization"
            rules={[
              {
                required: true,
                message: 'Please input the caregiver specialization!',
              },
            ]}
          >
            <Select>
              <Option value="Nursing">Nursing</Option>
              <Option value="Physical Therapy">Physical Therapy</Option>
              <Option value="Personal Care">Personal Care</Option>
              <Option value="Companionship">Companionship</Option>
            </Select>
          </Form.Item>
          <Form.Item name="schedule" label="Schedule">
            <DatePicker showTime format="YYYY-MM-DD HH:mm" />
          </Form.Item>
          <Form.Item name="notes" label="Notes">
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </Modal>
    </Card>
  );
};

export default CaregiverManagement;
