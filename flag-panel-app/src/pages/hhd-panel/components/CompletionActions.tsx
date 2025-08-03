import React from 'react';
import { Card, Button, Space, Modal, Typography } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import { CompletionActionsProps } from '../types';

const { Text } = Typography;

export const CompletionActions: React.FC<CompletionActionsProps> = ({
  onCompleteRack,
  onSkipRack,
  loading = false
}) => {
  const [skipModalVisible, setSkipModalVisible] = React.useState(false);

  const handleSkipRack = () => {
    setSkipModalVisible(true);
  };

  const confirmSkipRack = () => {
    onSkipRack();
    setSkipModalVisible(false);
  };

  return (
    <>
      <Card title="Rack Actions" style={{ marginBottom: 16 }}>
        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button
            type="primary"
            icon={<CheckCircleOutlined />}
            onClick={onCompleteRack}
            loading={loading}
            size="large"
            style={{ width: '100%' }}
          >
            Complete Rack Audit
          </Button>
          
          <Button
            danger
            icon={<CloseCircleOutlined />}
            onClick={handleSkipRack}
            disabled={loading}
            size="large"
            style={{ width: '100%' }}
          >
            Skip This Rack
          </Button>
        </Space>
      </Card>

      <Modal
        title={
          <Space>
            <ExclamationCircleOutlined style={{ color: '#faad14' }} />
            <span>Skip Rack Confirmation</span>
          </Space>
        }
        open={skipModalVisible}
        onOk={confirmSkipRack}
        onCancel={() => setSkipModalVisible(false)}
        okText="Yes, Skip Rack"
        cancelText="Cancel"
        okButtonProps={{ danger: true }}
      >
        <Text>
          Are you sure you want to skip this rack? All items for this rack will be flagged as 'UNAUDITED' for supervisor review.
        </Text>
      </Modal>
    </>
  );
}; 