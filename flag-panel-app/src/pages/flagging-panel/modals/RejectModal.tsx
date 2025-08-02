import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Form, Input, Alert } from 'antd';
import { RejectModalProps } from '../types';

const { Text, Paragraph } = Typography;
const { TextArea } = Input;

const RejectModal: React.FC<RejectModalProps> = ({
  visible,
  flag,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setValidationError('');
    }
  }, [visible, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      
      if (!values.reason?.trim()) {
        setValidationError('Please provide a reason for rejection');
        return;
      }

      setValidationError('');
      onSubmit(values.reason.trim());
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="Confirm Flag Rejection"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="cancel" onClick={onClose}>
          Cancel
        </Button>,
        <Button 
          key="submit" 
          danger
          onClick={handleSubmit}
        >
          Confirm Rejection
        </Button>
      ]}
      width={500}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Paragraph>
          You are about to reject Flag ID: <Text strong>{flag.id}</Text>.
        </Paragraph>

        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="reason"
            label="Reason for Rejection (Mandatory)"
            rules={[
              { required: true, message: 'Rejection reason is required' },
              { min: 10, message: 'Reason must be at least 10 characters' }
            ]}
          >
            <TextArea
              rows={3}
              placeholder="e.g., Auditor counting error, issue resolved on floor, incorrect flag generation..."
              maxLength={500}
              showCount
            />
          </Form.Item>
        </Form>

        {validationError && (
          <Alert
            message={validationError}
            type="error"
            showIcon
          />
        )}

        <Paragraph style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          This action will mark the flag as rejected and cannot be undone. Please ensure the reason is clear and accurate.
        </Paragraph>
      </Space>
    </Modal>
  );
};

export default RejectModal; 