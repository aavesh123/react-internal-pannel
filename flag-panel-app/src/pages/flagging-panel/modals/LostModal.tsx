import React from 'react';
import { Modal, Typography, Space, Button, Descriptions } from 'antd';
import { ModalProps } from '../types';

const { Text, Paragraph } = Typography;

const LostModal: React.FC<ModalProps> = ({
  visible,
  flag,
  onClose,
  onReject,
  onSubmit
}) => {
  const handleSubmit = () => {
    onSubmit({}); // No additional data needed for LOST resolution
  };

  return (
    <Modal
      title="Resolve Lost Item"
      open={visible}
      onCancel={onClose}
      footer={[
        <Button key="reject" danger onClick={onReject}>
          Reject Flag
        </Button>,
        <Button key="submit" type="primary" onClick={handleSubmit}>
          Approve & Create 'Lost' GON
        </Button>
      ]}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Flag ID">
            <Text strong>{flag.id}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="SKU">
            <Text strong>{flag.sku}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Quantity Lost">
            <Text strong>{flag.details.qty || flag.details.lostQty || 'N/A'}</Text> units from Box{' '}
            <Text strong>{flag.details.boxId || 'N/A'}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Paragraph style={{ margin: 0 }}>
          Approving will create a "Lost" Goods Outward Note (GON) to adjust inventory.
        </Paragraph>
      </Space>
    </Modal>
  );
};

export default LostModal; 