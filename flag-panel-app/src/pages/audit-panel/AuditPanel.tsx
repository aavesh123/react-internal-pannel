import React, { useState, useEffect } from 'react';
import {
  Card,
  Typography,
  Space,
  Row,
  Col,
  Select,
  Input,
  DatePicker,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  InputNumber,
  message,
  Spin,
  Alert,
  Divider,
  Tooltip,
} from 'antd';
import {
  SearchOutlined,
  FilterOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  ExclamationCircleOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import dayjs from 'dayjs';
import { auditApiService, AuditFlag, FilterState } from '../../services/auditApi';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

interface ModalState {
  visible: boolean;
  type: string;
  flag: AuditFlag | null;
}

export const AuditPanel: React.FC = () => {
  const [flags, setFlags] = useState<AuditFlag[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    flagType: '',
    status: '',
    identifier: '',
    date: '',
  });
  const [modalState, setModalState] = useState<ModalState>({
    visible: false,
    type: '',
    flag: null,
  });
  const [rejectModalVisible, setRejectModalVisible] = useState(false);
  const [currentFlagId, setCurrentFlagId] = useState<string>('');
  const [recoveryData, setRecoveryData] = useState<any>(null);

  // Forms
  const [rejectForm] = Form.useForm();
  const [excessForm] = Form.useForm();
  const [damagedForm] = Form.useForm();
  const [batchForm] = Form.useForm();
  const [skuForm] = Form.useForm();

  useEffect(() => {
    fetchFlags();
  }, []);

  const fetchFlags = async (customFilters?: FilterState) => {
    setLoading(true);
    try {
      const filtersToUse = customFilters || filters;
      const response = await auditApiService.fetchFlags(filtersToUse);
      setFlags(response.flags);
    } catch (error) {
      message.error('Failed to fetch flags');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = () => {
    fetchFlags();
  };

  const handleResetFilters = () => {
    const clearedFilters = {
      flagType: '',
      status: '',
      identifier: '',
      date: '',
    };
    setFilters(clearedFilters);
    // Fetch flags with cleared filters immediately
    fetchFlags(clearedFilters);
  };

  const openModal = (type: string, flag: AuditFlag) => {
    setModalState({ visible: true, type, flag });
    setCurrentFlagId(flag.id);
  };

  const closeModal = () => {
    setModalState({ visible: false, type: '', flag: null });
    setRejectModalVisible(false);
    setRecoveryData(null);
    // Reset forms
    rejectForm.resetFields();
    excessForm.resetFields();
    damagedForm.resetFields();
    batchForm.resetFields();
    skuForm.resetFields();
  };

  const openRejectModal = () => {
    setRejectModalVisible(true);
  };

  const handleRejectFlag = async (values: { reason: string }) => {
    try {
      await auditApiService.rejectFlag(currentFlagId, values.reason);
      closeModal();
      fetchFlags();
    } catch (error) {
      message.error('Failed to reject flag');
    }
  };

  const handleCheckRecoveryGon = async () => {
    try {
      const recovery = await auditApiService.checkRecoveryGon(currentFlagId);
      setRecoveryData(recovery);
    } catch (error) {
      message.error('Failed to check recovery GON');
    }
  };

  const handleResolveFlag = async (type: string, values: any) => {
    try {
      await auditApiService.resolveFlag(currentFlagId, { type, ...values });
      closeModal();
      fetchFlags();
    } catch (error) {
      message.error('Failed to resolve flag');
    }
  };

  const formatDetails = (flag: AuditFlag) => {
    switch (flag.type) {
      case 'SKU_MISMATCH':
        return `Found Qty: ${flag.details.foundQty || 'N/A'}`;
      case 'BATCH_DISCREPANCY':
        return `Expected: ${flag.details.expected}, Found: ${flag.details.found}`;
      default:
        return `Qty: ${flag.details.qty || 'N/A'}`;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'RESOLVED':
        return 'success';
      case 'REJECTED':
        return 'error';
      default:
        return 'default';
    }
  };

  const columns = [
    {
      title: 'Flag ID',
      dataIndex: 'id',
      key: 'id',
      width: 120,
    },
    {
      title: 'Type',
      dataIndex: 'type',
      key: 'type',
      width: 150,
      render: (type: string) => type.replace(/_/g, ' '),
    },
    {
      title: 'Identifier',
      dataIndex: 'identifier',
      key: 'identifier',
      width: 150,
    },
    {
      title: 'SKU',
      dataIndex: 'sku',
      key: 'sku',
      width: 120,
    },
    {
      title: 'Details',
      key: 'details',
      width: 200,
      render: (_: any, record: AuditFlag) => formatDetails(record),
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      width: 120,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: string) => (
        <Tag color={getStatusColor(status)}>
          {status.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: AuditFlag) => {
        if (record.status === 'PENDING') {
          return (
            <Button
              type="primary"
              size="small"
              onClick={() => openModal(record.type.toLowerCase().replace(/_/g, '-'), record)}
            >
              Resolve
            </Button>
          );
        } else if (record.status === 'REJECTED') {
          return (
            <Tooltip title={record.rejectionReason || 'N/A'}>
              <Text type="secondary">Reason: {record.rejectionReason || 'N/A'}</Text>
            </Tooltip>
          );
        }
        return <Text type="secondary">Processed</Text>;
      },
    },
  ];

  const renderModalContent = () => {
    if (!modalState.flag) return null;

    const flag = modalState.flag;

    switch (modalState.type) {
      case 'lost':
        return (
          <div>
            <Paragraph>
              <Text strong>Flag ID:</Text> {flag.id}
            </Paragraph>
            <Paragraph>
              <Text strong>SKU:</Text> {flag.sku}
            </Paragraph>
            <Paragraph>
              <Text strong>Quantity Lost:</Text> <Text strong>{flag.details.qty}</Text> units from Box <Text strong>{flag.details.boxId}</Text>
            </Paragraph>
            <Paragraph>
              Approving will create a "Lost" Goods Outward Note (GON) to adjust inventory.
            </Paragraph>
          </div>
        );

      case 'excess':
        return (
          <div>
            <Paragraph>
              <Text strong>Flag ID:</Text> {flag.id}
            </Paragraph>
            <Paragraph>
              <Text strong>Found SKU:</Text> {flag.sku}
            </Paragraph>
            <Paragraph>
              <Text strong>Excess Quantity:</Text> <Text strong>{flag.details.qty}</Text> units in Crate <Text strong>{flag.identifier}</Text>
            </Paragraph>
            <Divider />
            
            {!recoveryData && (
              <div>
                <Paragraph>Check for a matching "Lost" GON to recover this stock.</Paragraph>
                <Button onClick={handleCheckRecoveryGon} loading={loading}>
                  Check for Recovery GON
                </Button>
              </div>
            )}

            {recoveryData && recoveryData.isRecoveryCandidate && (
              <Alert
                message="Recovery Found!"
                description={
                  <div>
                    <p>This stock matches a "Lost" GON. Approving will:</p>
                    <ul>
                      <li>Recover <strong>{recoveryData.recoveryQty}</strong> qty.</li>
                      {flag.details.qty - recoveryData.recoveryQty > 0 && (
                        <li>Initiate a fresh inward for the remaining <strong>{flag.details.qty - recoveryData.recoveryQty}</strong> qty.</li>
                      )}
                    </ul>
                  </div>
                }
                type="success"
                showIcon
              />
            )}

            {recoveryData && !recoveryData.isRecoveryCandidate && (
              <Alert
                message="No Recovery Found!"
                description="Please inward this stock as a fresh inward."
                type="error"
                showIcon
              />
            )}
          </div>
        );

      case 'damaged':
        return (
          <div>
            <Paragraph>
              <Text strong>Flag ID:</Text> {flag.id}
            </Paragraph>
            <Paragraph>
              <Text strong>SKU:</Text> {flag.sku} in Crate <Text strong>{flag.identifier}</Text>
            </Paragraph>
            
            <Form form={damagedForm} layout="vertical">
              <Form.Item
                label="Total Quantity to Write-Off"
                name="totalQty"
                initialValue={flag.details.qty}
                rules={[{ required: true, message: 'Please enter total quantity' }]}
              >
                <InputNumber min={1} style={{ width: '100%' }} />
              </Form.Item>
            </Form>

            <Divider />
            <Title level={5}>Damage Reason Breakdown</Title>
            <DamagedReasonsForm form={damagedForm} totalQty={flag.details.qty} />
          </div>
        );

      case 'batch-discrepancy':
        return (
          <div>
            <Paragraph>
              <Text strong>Flag ID:</Text> {flag.id}
            </Paragraph>
            <Paragraph>
              <Text strong>SKU:</Text> {flag.sku}
            </Paragraph>
            <Paragraph>
              <Text strong>Expected:</Text> {flag.details.expected} | <Text strong>Found:</Text> {flag.details.found}
            </Paragraph>
            
            <Divider />
            <Title level={5}>New Batch Creation</Title>
            
            <Form form={batchForm} layout="vertical">
              <Form.Item
                label="Batch ID to Create"
                name="batchId"
                initialValue={flag.details.found}
                rules={[{ required: true, message: 'Batch ID is required' }]}
              >
                <Input placeholder="Confirm or edit batch ID to create..." />
              </Form.Item>
              <Form.Item
                label="Manufacturing Date"
                name="mfgDate"
                rules={[{ required: true, message: 'Manufacturing date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
              <Form.Item
                label="Expiry Date"
                name="expDate"
                rules={[{ required: true, message: 'Expiry date is required' }]}
              >
                <DatePicker style={{ width: '100%' }} format="DD-MM-YYYY" />
              </Form.Item>
            </Form>
          </div>
        );

      case 'sku-mismatch':
        return (
          <div>
            <Paragraph>
              <Text strong>Flag ID:</Text> {flag.id}
            </Paragraph>
            <Paragraph>
              <Text strong>Current SKU (Found):</Text> {flag.details.foundSku}
            </Paragraph>
            
            <Divider />
            
            <Form form={skuForm} layout="vertical">
              <Form.Item
                label="Actual SKU"
                name="actualSku"
                rules={[{ required: true, message: 'Actual SKU is required' }]}
              >
                <Input placeholder="Enter the correct SKU" />
              </Form.Item>
              <Form.Item
                label="Actual Batch ID"
                name="actualBatchId"
              >
                <Input placeholder="Enter batch ID if applicable" />
              </Form.Item>
            </Form>
          </div>
        );

      default:
        return null;
    }
  };

  const getModalTitle = () => {
    if (!modalState.flag) return '';
    
    const titles = {
      'lost': 'Resolve Lost Item',
      'excess': 'Resolve Excess Item',
      'damaged': 'Resolve Damaged Item',
      'batch-discrepancy': 'Resolve Batch Discrepancy',
      'sku-mismatch': 'Resolve SKU Mismatch',
    };
    
    return titles[modalState.type as keyof typeof titles] || '';
  };

  const handleModalOk = () => {
    switch (modalState.type) {
      case 'lost':
        handleResolveFlag('LOST', {});
        break;
      case 'excess':
        excessForm.validateFields().then(values => {
          handleResolveFlag('EXCESS', values);
        });
        break;
      case 'damaged':
        damagedForm.validateFields().then(values => {
          handleResolveFlag('DAMAGED', values);
        });
        break;
      case 'batch-discrepancy':
        batchForm.validateFields().then(values => {
          handleResolveFlag('BATCH_DISCREPANCY', {
            batchResolution: {
              type: 'CREATE',
              newBatchId: values.batchId,
              mfgDate: values.mfgDate?.format('DD-MM-YYYY'),
              expiryDate: values.expDate?.format('DD-MM-YYYY'),
            }
          });
        });
        break;
      case 'sku-mismatch':
        skuForm.validateFields().then(values => {
          handleResolveFlag('SKU_MISMATCH', {
            product_sku: values.actualSku,
            batch_id: values.actualBatchId,
          });
        });
        break;
    }
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={2} style={{ textAlign: 'center', color: '#5D107F' }}>
            Audit Discrepancy Flags
          </Title>

          {/* Filters */}
          <Card size="small" style={{ border: '1px solid #dee2e6' }}>
            <Row gutter={[16, 16]} align="bottom">
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong style={{ fontSize: '0.8em', color: '#495057' }}>Flag Type</Text>
                  <Select
                    value={filters.flagType}
                    onChange={(value) => setFilters(prev => ({ ...prev, flagType: value }))}
                    placeholder="All Types"
                    style={{ width: '100%', marginTop: 4 }}
                  >
                    <Option value="">All Types</Option>
                    <Option value="EXCESS">Excess</Option>
                    <Option value="LOST">Lost</Option>
                    <Option value="DAMAGED">Damaged</Option>
                    <Option value="BATCH_DISCREPANCY">Batch Discrepancy</Option>
                    <Option value="SKU_MISMATCH">SKU Mismatch</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong style={{ fontSize: '0.8em', color: '#495057' }}>Flag Status</Text>
                  <Select
                    value={filters.status}
                    onChange={(value) => setFilters(prev => ({ ...prev, status: value }))}
                    placeholder="All Statuses"
                    style={{ width: '100%', marginTop: 4 }}
                  >
                    <Option value="">All Statuses</Option>
                    <Option value="PENDING">Pending</Option>
                    <Option value="RESOLVED">Resolved</Option>
                    <Option value="REJECTED">Rejected</Option>
                  </Select>
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong style={{ fontSize: '0.8em', color: '#495057' }}>Crate ID / WT ID</Text>
                  <Input
                    value={filters.identifier}
                    onChange={(e) => setFilters(prev => ({ ...prev, identifier: e.target.value }))}
                    placeholder="Enter ID..."
                    style={{ marginTop: 4 }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <div>
                  <Text strong style={{ fontSize: '0.8em', color: '#495057' }}>Date</Text>
                  <DatePicker
                    value={filters.date ? dayjs(filters.date) : null}
                    onChange={(date) => setFilters(prev => ({ ...prev, date: date?.format('YYYY-MM-DD') || '' }))}
                    style={{ width: '100%', marginTop: 4 }}
                  />
                </div>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Space>
                  <Button type="primary" onClick={handleFilter} icon={<FilterOutlined />}>
                    Filter
                  </Button>
                  <Button onClick={handleResetFilters}>
                    Reset
                  </Button>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Table */}
          <Table
            columns={columns}
            dataSource={flags}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showQuickJumper: true,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total} items`,
            }}
            scroll={{ x: 1200 }}
          />
        </Space>
      </Card>

      {/* Resolution Modal */}
      <Modal
        title={getModalTitle()}
        open={modalState.visible}
        onCancel={closeModal}
        footer={[
          <Button key="reject" danger onClick={openRejectModal}>
            Reject Flag
          </Button>,
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="submit" type="primary" onClick={handleModalOk}>
            {modalState.type === 'excess' && recoveryData?.isRecoveryCandidate 
              ? 'Approve Recovery & Inward'
              : modalState.type === 'excess' && recoveryData && !recoveryData.isRecoveryCandidate
              ? 'Initiate Fresh Inward'
              : modalState.type === 'sku-mismatch'
              ? 'Approve SKU Updation'
              : modalState.type === 'batch-discrepancy'
              ? 'Submit'
              : modalState.type === 'damaged'
              ? 'Approve & Process GON'
              : 'Approve'
            }
          </Button>,
        ]}
        width={650}
      >
        {renderModalContent()}
      </Modal>

      {/* Reject Modal */}
      <Modal
        title="Confirm Flag Rejection"
        open={rejectModalVisible}
        onCancel={closeModal}
        footer={[
          <Button key="cancel" onClick={closeModal}>
            Cancel
          </Button>,
          <Button key="submit" danger onClick={() => rejectForm.submit()}>
            Confirm Rejection
          </Button>,
        ]}
        width={500}
      >
        <Paragraph>
          You are about to reject Flag ID: <Text strong>{currentFlagId}</Text>.
        </Paragraph>
        <Form form={rejectForm} onFinish={handleRejectFlag} layout="vertical">
          <Form.Item
            label="Reason for Rejection (Mandatory)"
            name="reason"
            rules={[{ required: true, message: 'Please provide a reason for rejection' }]}
          >
            <TextArea
              rows={3}
              placeholder="e.g., Auditor counting error, issue resolved on floor."
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

// Damaged Reasons Form Component
interface DamagedReasonsFormProps {
  form: any;
  totalQty: number;
}

const DamagedReasonsForm: React.FC<DamagedReasonsFormProps> = ({ form, totalQty }) => {
  const [reasons, setReasons] = useState([{ reason: '', quantity: 0 }]);

  const addReason = () => {
    setReasons([...reasons, { reason: '', quantity: 0 }]);
  };

  const removeReason = (index: number) => {
    setReasons(reasons.filter((_, i) => i !== index));
  };

  const updateReason = (index: number, field: string, value: any) => {
    const newReasons = [...reasons];
    newReasons[index] = { ...newReasons[index], [field]: value };
    setReasons(newReasons);
    
    // Update form value
    form.setFieldsValue({ damageReasons: newReasons });
  };

  const getTotalQuantity = () => {
    return reasons.reduce((sum, r) => sum + (r.quantity || 0), 0);
  };

  const isValid = getTotalQuantity() === totalQty;

  return (
    <div>
      <Table
        dataSource={reasons}
        pagination={false}
        size="small"
        columns={[
          {
            title: 'Reason',
            dataIndex: 'reason',
            key: 'reason',
            render: (_, record, index) => (
              <Select
                value={record.reason}
                onChange={(value) => updateReason(index, 'reason', value)}
                placeholder="Reason..."
                style={{ width: '100%' }}
              >
                <Option value="NEAR_EXPIRY">Near Expiry</Option>
                <Option value="PHYSICAL_DAMAGE">Physical Damage</Option>
              </Select>
            ),
          },
          {
            title: 'Quantity',
            dataIndex: 'quantity',
            key: 'quantity',
            render: (_, record, index) => (
              <InputNumber
                value={record.quantity}
                onChange={(value) => updateReason(index, 'quantity', value)}
                min={1}
                placeholder="Qty"
                style={{ width: '100%' }}
              />
            ),
          },
          {
            title: 'Action',
            key: 'action',
            render: (_, record, index) => (
              <Button
                type="text"
                danger
                size="small"
                onClick={() => removeReason(index)}
              >
                X
              </Button>
            ),
          },
        ]}
      />
      
      <Button onClick={addReason} style={{ marginTop: 8 }}>
        + Add Reason
      </Button>
      
      <div style={{ marginTop: 10, fontWeight: 600 }}>
        <Text type={isValid ? 'success' : 'danger'}>
          Accounted for: {getTotalQuantity()} of {totalQty}
        </Text>
      </div>
    </div>
  );
}; 