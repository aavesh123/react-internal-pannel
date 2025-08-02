import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Descriptions, Alert, Divider } from 'antd';
import { ModalProps } from '../types';
import { formatFlagId } from '@/utils/dummyData';

const { Text, Paragraph } = Typography;

interface ExcessModalProps extends ModalProps {
  onCheckRecovery: () => Promise<number>;
}

const ExcessModal: React.FC<ExcessModalProps> = ({
  visible,
  flag,
  onClose,
  onReject,
  onSubmit,
  onCheckRecovery
}) => {
  const [recoveryQty, setRecoveryQty] = useState<number>(0);
  const [isCheckingRecovery, setIsCheckingRecovery] = useState(false);
  const [recoveryChecked, setRecoveryChecked] = useState(false);
  const [isRecoveryCandidate, setIsRecoveryCandidate] = useState(false);

  useEffect(() => {
    if (visible) {
      setRecoveryQty(0);
      setIsCheckingRecovery(false);
      setRecoveryChecked(false);
      setIsRecoveryCandidate(flag.details.isRecoveryCandidate || false);
    }
  }, [visible, flag]);

  const handleCheckRecovery = async () => {
    setIsCheckingRecovery(true);
    try {
      const qty = await onCheckRecovery();
      setRecoveryQty(qty);
      setIsRecoveryCandidate(qty > 0);
      setRecoveryChecked(true);
    } catch (error) {
      console.error('Failed to check recovery:', error);
    } finally {
      setIsCheckingRecovery(false);
    }
  };

  const handleSubmit = () => {
    const totalQty = flag.details.qty || 0;
    const freshInwardQty = totalQty - recoveryQty;
    
    onSubmit({
      quantity: totalQty,
      recoveryQty,
      freshInwardQty
    });
  };

  const totalQty = flag.details.qty || 0;
  const freshInwardQty = totalQty - recoveryQty;

  return (
    <Modal
      title="Resolve Excess Item"
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
          disabled={!recoveryChecked}
        >
          {isRecoveryCandidate ? 'Approve Recovery & Inward' : 'Initiate Fresh Inward'}
        </Button>
      ]}
      width={600}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Flag ID">
            <Text strong>{formatFlagId(flag.id, flag.type)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Found SKU">
            <Text strong>{flag.sku}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="Excess Quantity">
            <Text strong>{totalQty}</Text> units in Crate <Text strong>{flag.identifier}</Text>
          </Descriptions.Item>
        </Descriptions>

        <Divider />

        {!recoveryChecked ? (
          <div>
            <Paragraph>Check for a matching "Lost" GON to recover this stock.</Paragraph>
            <Button 
              type="primary"
              onClick={handleCheckRecovery}
              loading={isCheckingRecovery}
            >
              Check for Recovery GON
            </Button>
          </div>
        ) : isRecoveryCandidate ? (
          <Alert
            message="Recovery Found!"
            description={
              <div>
                <p>This stock matches a "Lost" GON. Approving will:</p>
                <ul>
                  <li>Recover <strong>{recoveryQty}</strong> qty.</li>
                  {freshInwardQty > 0 && (
                    <li>Initiate a fresh inward for the remaining <strong>{freshInwardQty}</strong> qty.</li>
                  )}
                </ul>
              </div>
            }
            type="success"
            showIcon
          />
        ) : (
          <Alert
            message="No Recovery Found!"
            description="Please inward this stock as a fresh inward."
            type="warning"
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default ExcessModal; 