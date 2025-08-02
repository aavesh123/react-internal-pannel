import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Descriptions, Form, Input, DatePicker, Alert, Divider } from 'antd';
import { ModalProps } from '../types';
import { dateToTimestamp } from '../utils';
import { formatFlagId } from '@/utils/dummyData';

const { Text, Paragraph } = Typography;

const BatchDiscrepancyModal: React.FC<ModalProps> = ({
  visible,
  flag,
  onClose,
  onReject,
  onSubmit
}) => {
  const [form] = Form.useForm();
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  useEffect(() => {
    if (visible) {
      form.resetFields();
      setValidationErrors([]);
      // Pre-fill with found batch ID
      form.setFieldsValue({
        batchId: flag.details.found || ''
      });
    }
  }, [visible, flag, form]);

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      const errors: string[] = [];

      if (!values.batchId?.trim()) {
        errors.push('Batch ID is mandatory');
      }
      if (!values.mfgDate) {
        errors.push('Manufacturing date is mandatory');
      }
      if (!values.expDate) {
        errors.push('Expiry date is mandatory');
      }

      if (errors.length > 0) {
        setValidationErrors(errors);
        return;
      }

      setValidationErrors([]);

      onSubmit({
        batchResolution: {
          type: 'CREATE',
          newBatchId: values.batchId.trim(),
          mfgDate: dateToTimestamp(values.mfgDate),
          expiryDate: dateToTimestamp(values.expDate),
          remarks: `New batch created due to MRP/date discrepancy. Expected: ${flag.details.expected}, Found: ${flag.details.found}`
        }
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="Resolve Batch Discrepancy"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reject" danger onClick={onReject}>
          Reject Flag
        </Button>,
        <Button 
          key="submit" 
          type="primary" 
          onClick={handleSubmit}
        >
          Submit
        </Button>
      ]}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Flag ID">
            <Text strong>{formatFlagId(flag.id, flag.type)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="SKU">
            <Text strong>{flag.sku}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Expected">
            <Text strong>{flag.details.expected || 'N/A'}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Found">
            <Text strong>{flag.details.found || 'N/A'}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div>
          <Text strong>New Batch Creation</Text>
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="batchId"
              label="Batch ID to Create"
              rules={[
                { required: true, message: 'Batch ID is required' },
                { min: 1, message: 'Batch ID cannot be empty' }
              ]}
            >
              <Input 
                placeholder="Confirm or edit batch ID to create..."
                maxLength={50}
              />
            </Form.Item>

            <Form.Item
              name="mfgDate"
              label="Manufacturing Date"
              rules={[
                { required: true, message: 'Manufacturing date is required' }
              ]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD-MM-YYYY"
                placeholder="Select manufacturing date"
              />
            </Form.Item>

            <Form.Item
              name="expDate"
              label="Expiry Date"
              rules={[
                { required: true, message: 'Expiry date is required' }
              ]}
            >
              <DatePicker 
                style={{ width: '100%' }}
                format="DD-MM-YYYY"
                placeholder="Select expiry date"
              />
            </Form.Item>
          </Form>
        </div>

        {validationErrors.length > 0 && (
          <Alert
            message="Validation Errors"
            description={
              <ul style={{ margin: 0, paddingLeft: 16 }}>
                {validationErrors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            }
            type="error"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default BatchDiscrepancyModal; 