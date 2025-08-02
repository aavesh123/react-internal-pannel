import React, { useState, useEffect } from 'react';
import { Modal, Typography, Space, Button, Descriptions, InputNumber, Select, Table, Alert } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { ModalProps, DamageReason } from '../types';
import { validateDamageQuantities } from '../utils';
import { formatFlagId } from '@/utils/dummyData';

const { Text, Paragraph } = Typography;
const { Option } = Select;

const DamagedModal: React.FC<ModalProps> = ({
  visible,
  flag,
  onClose,
  onReject,
  onSubmit
}) => {
  const [totalQty, setTotalQty] = useState<number>(flag.details.qty || 0);
  const [reasons, setReasons] = useState<DamageReason[]>([]);
  const [validationError, setValidationError] = useState<string>('');

  useEffect(() => {
    if (visible) {
      setTotalQty(flag.details.qty || 0);
      setReasons([]);
      setValidationError('');
    }
  }, [visible, flag]);

  const addReasonRow = () => {
    setReasons([...reasons, { reason: '', quantity: 0 }]);
  };

  const removeReasonRow = (index: number) => {
    const newReasons = reasons.filter((_, i) => i !== index);
    setReasons(newReasons);
    validateQuantities(totalQty, newReasons);
  };

  const updateReason = (index: number, field: keyof DamageReason, value: string | number) => {
    const newReasons = [...reasons];
    newReasons[index] = { ...newReasons[index], [field]: value };
    setReasons(newReasons);
    validateQuantities(totalQty, newReasons);
  };

  const validateQuantities = (total: number, reasonList: DamageReason[]) => {
    if (total > 0 && reasonList.length > 0) {
      const isValid = validateDamageQuantities(reasonList, total);
      setValidationError(isValid ? '' : 'Sum of reasons must match total quantity');
    } else {
      setValidationError('');
    }
  };

  const handleSubmit = () => {
    if (reasons.length === 0) {
      setValidationError('At least one damage reason is required');
      return;
    }

    if (validationError) {
      return;
    }

    onSubmit({
      reasons,
      totalQty
    });
  };

  const columns = [
    {
      title: 'Reason',
      dataIndex: 'reason',
      key: 'reason',
      render: (_: any, record: DamageReason, index: number) => (
        <Select
          placeholder="Select reason..."
          value={record.reason}
          onChange={(value) => updateReason(index, 'reason', value)}
          style={{ width: '100%' }}
        >
          <Option value="NEAR_EXPIRY">Near Expiry</Option>
          <Option value="PHYSICAL_DAMAGE">Physical Damage</Option>
          <Option value="WATER_DAMAGE">Water Damage</Option>
          <Option value="TRANSPORT_DAMAGE">Transport Damage</Option>
          <Option value="PACKAGING_DAMAGE">Packaging Damage</Option>
        </Select>
      )
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      render: (_: any, record: DamageReason, index: number) => (
        <InputNumber
          min={1}
          value={record.quantity}
          onChange={(value) => updateReason(index, 'quantity', value || 0)}
          style={{ width: '100%' }}
        />
      )
    },
    {
      title: 'Action',
      key: 'action',
      render: (_: any, record: DamageReason, index: number) => (
        <Button
          type="text"
          danger
          icon={<DeleteOutlined />}
          onClick={() => removeReasonRow(index)}
        />
      )
    }
  ];

  const totalReasonsQty = reasons.reduce((sum, reason) => sum + (reason.quantity || 0), 0);

  return (
    <Modal
      title="Resolve Damaged Item"
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
          disabled={!!validationError || reasons.length === 0}
        >
          Approve & Process GON
        </Button>
      ]}
      width={700}
    >
      <Space direction="vertical" size="large" style={{ width: '100%' }}>
        <Descriptions column={1} size="small">
          <Descriptions.Item label="Flag ID">
            <Text strong>{formatFlagId(flag.id, flag.type)}</Text>
          </Descriptions.Item>
          <Descriptions.Item label="SKU">
            <Text strong>{flag.sku}</Text> in Crate <Text strong>{flag.identifier}</Text>
          </Descriptions.Item>
        </Descriptions>

        <div>
          <Text strong>Total Quantity to Write-Off:</Text>
          <InputNumber
            min={1}
            value={totalQty}
            onChange={(value) => {
              setTotalQty(value || 0);
              validateQuantities(value || 0, reasons);
            }}
            style={{ marginLeft: 8, width: 120 }}
          />
        </div>

        <div>
          <Text strong>Damage Reason Breakdown</Text>
          <Button
            type="dashed"
            icon={<PlusOutlined />}
            onClick={addReasonRow}
            style={{ marginLeft: 8 }}
          >
            Add Reason
          </Button>
        </div>

        {reasons.length > 0 && (
          <Table
            dataSource={reasons}
            columns={columns}
            pagination={false}
            size="small"
            rowKey={(record, index) => index?.toString() || '0'}
          />
        )}

        {validationError && (
          <Alert
            message={validationError}
            type="error"
            showIcon
            style={{ marginTop: 8 }}
          />
        )}

        {totalQty > 0 && (
          <Alert
            message={`Accounted for: ${totalReasonsQty} of ${totalQty}`}
            type={totalReasonsQty === totalQty ? 'success' : 'warning'}
            showIcon
          />
        )}
      </Space>
    </Modal>
  );
};

export default DamagedModal; 