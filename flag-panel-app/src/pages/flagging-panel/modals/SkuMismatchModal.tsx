import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Descriptions, Form, Input, Alert, Divider } from 'antd';
import { ModalProps } from '../types';
import { formatFlagId } from '@/utils/dummyData';

const { Text, Paragraph } = Typography;

const SkuMismatchModal: React.FC<ModalProps> = ({
  visible,
  flag,
  onClose,
  onReject,
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
      
      if (!values.actualSku?.trim()) {
        setValidationError('Actual SKU is mandatory');
        return;
      }

      setValidationError('');

      onSubmit({
        product_sku: values.actualSku.trim(),
        batch_id: values.actualBatch?.trim() || undefined
      });
    } catch (error) {
      console.error('Form validation failed:', error);
    }
  };

  return (
    <Modal
      title="Resolve SKU Mismatch"
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
          Approve SKU Updation
        </Button>
      ]}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Flag ID">
            <Text strong>{formatFlagId(flag.id, flag.type)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Current SKU (Found)">
            <Text strong>{flag.details.foundSku || flag.sku}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Found Quantity">
            <Text strong>{flag.details.foundQty || 'N/A'}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        <div>
          <Text strong>SKU Correction</Text>
          <Form
            form={form}
            layout="vertical"
            style={{ marginTop: 16 }}
          >
            <Form.Item
              name="actualSku"
              label="Actual SKU (Mandatory)"
              rules={[
                { required: true, message: 'Actual SKU is required' },
                { min: 1, message: 'Actual SKU cannot be empty' }
              ]}
            >
              <Input 
                placeholder="Enter the correct SKU"
                maxLength={50}
              />
            </Form.Item>

            <Form.Item
              name="actualBatch"
              label="Actual Batch ID (Optional)"
            >
              <Input 
                placeholder="Enter batch ID if applicable"
                maxLength={50}
              />
            </Form.Item>
          </Form>
        </div>

        {validationError && (
          <Alert
            message={validationError}
            type="error"
            showIcon
          />
        )}

        <Paragraph style={{ margin: 0, fontSize: '12px', color: '#666' }}>
          This will update the SKU information for identifier {flag.identifier} from {flag.details.foundSku || flag.sku} to the actual SKU.
        </Paragraph>
      </Space>
    </Modal>
  );
};

export default SkuMismatchModal; 