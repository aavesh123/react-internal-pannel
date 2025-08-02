import React, { useState, useEffect, useCallback } from 'react';
import { 
  Card, 
  Tabs, 
  Table, 
  Button, 
  Tag, 
  Space, 
  Modal, 
  message,
  Spin,
  Typography,
  Row,
  Col
} from 'antd';
import { 
  FilterOutlined, 
  ExclamationCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined
} from '@ant-design/icons';
import { useApi } from '@/hooks/useApi';
import { showToast } from '@/utils/toast';
import { Flag, FlagType, FlagStatus, FilterState } from './types';
import { formatFlagDetails, formatDate } from './utils';
import FilterBar from './components/FilterBar';
import LostModal from './modals/LostModal';
import DamagedModal from './modals/DamagedModal';
import ExcessModal from './modals/ExcessModal';
import BatchDiscrepancyModal from './modals/BatchDiscrepancyModal';
import SkuMismatchModal from './modals/SkuMismatchModal';
import RejectModal from './modals/RejectModal';

const { Title } = Typography;
const { TabPane } = Tabs;

const FlaggingPanel: React.FC = () => {
  // State management
  const [currentTab, setCurrentTab] = useState<FlagType>('LOST');
  const [flags, setFlags] = useState<Flag[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedFlag, setSelectedFlag] = useState<Flag | null>(null);
  const [filters, setFilters] = useState<FilterState>({});
  const [modalVisible, setModalVisible] = useState<string>('');
  const [rejectModalVisible, setRejectModalVisible] = useState(false);

  // API hooks
  const { getFlags, rejectFlag, resolveFlag, checkRecoveryGon } = useApi();

  // Fetch flags on component mount and filter changes
  useEffect(() => {
    fetchFlags();
  }, [filters]);

  // Fetch flags from API
  const fetchFlags = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getFlags(filters);
      if (response.status === 'success') {
        setFlags(response.data.flags || []);
        
        // Show notification if using dummy data
        if (response.message.includes('dummy data')) {
          showToast('warning', 'Using demo data - API unavailable');
        }
      } else {
        showToast('error', response.message || 'Failed to fetch flags');
      }
    } catch (error) {
      showToast('error', 'Network error while fetching flags');
    } finally {
      setLoading(false);
    }
  }, [filters, getFlags]);

  // Handle filter changes
  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Handle tab change
  const handleTabChange = (activeKey: string) => {
    setCurrentTab(activeKey as FlagType);
    setFilters(prev => ({ ...prev, type: activeKey as FlagType }));
  };

  // Open resolution modal
  const openResolutionModal = (flag: Flag) => {
    setSelectedFlag(flag);
    const modalMap: Record<FlagType, string> = {
      'LOST': 'lost',
      'DAMAGED': 'damaged',
      'EXCESS': 'excess',
      'BATCH_DISCREPANCY': 'batch-discrepancy',
      'WRONG_SKU': 'sku-mismatch',
      'ALL': ''
    };
    setModalVisible(modalMap[flag.type]);
  };

  // Open reject modal
  const openRejectModal = () => {
    setRejectModalVisible(true);
  };

  // Close all modals
  const closeModals = () => {
    setModalVisible('');
    setRejectModalVisible(false);
    setSelectedFlag(null);
  };

  // Handle flag rejection
  const handleRejectFlag = async (reason: string) => {
    if (!selectedFlag) return;

    try {
      const response = await rejectFlag(selectedFlag.id, reason);
      if (response.status === 'success') {
        showToast('success', 'Flag rejected successfully');
        closeModals();
        fetchFlags(); // Refresh data
      } else {
        showToast('error', response.message || 'Failed to reject flag');
      }
    } catch (error) {
      showToast('error', 'Network error while rejecting flag');
    }
  };

  // Handle flag resolution
  const handleResolveFlag = async (resolutionData: any) => {
    if (!selectedFlag) return;

    try {
      const response = await resolveFlag(selectedFlag.id, resolutionData);
      if (response.status === 'success') {
        showToast('success', 'Flag resolved successfully');
        closeModals();
        fetchFlags(); // Refresh data
      } else {
        showToast('error', response.message || 'Failed to resolve flag');
      }
    } catch (error) {
      showToast('error', 'Network error while resolving flag');
    }
  };

  // Handle recovery GON check
  const handleCheckRecoveryGon = async (): Promise<number> => {
    if (!selectedFlag) return 0;

    try {
      const response = await checkRecoveryGon(selectedFlag.id);
      if (response.status === 'success') {
        return response.data.quantity || 0;
      } else {
        showToast('error', response.message || 'Failed to check recovery GON');
        return 0;
      }
    } catch (error) {
      showToast('error', 'Network error while checking recovery GON');
      return 0;
    }
  };

  // Table columns configuration
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
      render: (type: FlagType) => (
        <Tag color={getFlagTypeColor(type)}>
          {type.replace(/_/g, ' ')}
        </Tag>
      ),
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
      width: 150,
    },
    {
      title: 'Details',
      dataIndex: 'details',
      key: 'details',
      render: (details: any, record: Flag) => formatFlagDetails(record),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (timestamp: number) => formatDate(timestamp),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status: FlagStatus) => (
        <Tag 
          icon={getStatusIcon(status)} 
          color={getStatusColor(status)}
        >
          {status.replace(/_/g, ' ')}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_: any, record: Flag) => {
        if (record.status === 'PENDING') {
          return (
            <Button 
              type="primary" 
              size="small"
              onClick={() => openResolutionModal(record)}
            >
              Resolve
            </Button>
          );
        } else if (record.status === 'REJECTED') {
          return (
            <span style={{ color: '#666', fontSize: '12px' }}>
              Reason: {record.rejectionReason || 'N/A'}
            </span>
          );
        }
        return <span style={{ color: '#52c41a' }}>Processed</span>;
      },
    },
  ];

  // Get flag type color
  const getFlagTypeColor = (type: FlagType): string => {
    const colorMap: Record<FlagType, string> = {
      'LOST': 'red',
      'DAMAGED': 'orange',
      'EXCESS': 'blue',
      'BATCH_DISCREPANCY': 'purple',
      'WRONG_SKU': 'volcano',
      'ALL': 'default'
    };
    return colorMap[type] || 'default';
  };

  // Get status color
  const getStatusColor = (status: FlagStatus): string => {
    const colorMap: Record<FlagStatus, string> = {
      'PENDING': 'processing',
      'RESOLVED': 'success',
      'REJECTED': 'error'
    };
    return colorMap[status] || 'default';
  };

  // Get status icon
  const getStatusIcon = (status: FlagStatus) => {
    const iconMap: Record<FlagStatus, React.ReactNode> = {
      'PENDING': <ExclamationCircleOutlined />,
      'RESOLVED': <CheckCircleOutlined />,
      'REJECTED': <CloseCircleOutlined />
    };
    return iconMap[status];
  };

  // Filter flags by current tab
  const filteredFlags = flags.filter(flag => 
    currentTab === 'ALL' || flag.type === currentTab
  );

  return (
    <div style={{ padding: '24px', background: '#f9f8fc', minHeight: '100vh' }}>
      <Card 
        style={{ 
          maxWidth: 1600, 
          margin: 'auto', 
          borderRadius: '8px',
          boxShadow: '0 4px 12px rgba(0,0,0,0.08)'
        }}
      >
        <Title 
          level={1} 
          style={{ 
            textAlign: 'center', 
            color: '#5D107F', 
            marginBottom: '30px',
            fontWeight: 600
          }}
        >
          Audit Discrepancy Flags
        </Title>

        {/* Filter Bar */}
        <FilterBar 
          filters={filters}
          onFilterChange={handleFilterChange}
          onApplyFilters={() => fetchFlags()}
        />

        {/* Tabs */}
        <Tabs 
          activeKey={currentTab} 
          onChange={handleTabChange}
          style={{ marginTop: '20px' }}
          items={[
            { key: 'ALL', label: 'All Flags' },
            { key: 'LOST', label: 'Lost' },
            { key: 'DAMAGED', label: 'Damaged' },
            { key: 'EXCESS', label: 'Excess' },
            { key: 'BATCH_DISCREPANCY', label: 'Batch Discrepancy' },
            { key: 'WRONG_SKU', label: 'SKU Mismatch' }
          ]}
        />

        {/* Flags Table */}
        <div style={{ marginTop: '20px' }}>
          <Spin spinning={loading}>
            <Table
              dataSource={filteredFlags}
              columns={columns}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showQuickJumper: true,
                showTotal: (total, range) => 
                  `${range[0]}-${range[1]} of ${total} flags`
              }}
              scroll={{ x: 1200 }}
              size="small"
            />
          </Spin>
        </div>

        {/* Resolution Modals */}
        {selectedFlag && (
          <>
            <LostModal
              visible={modalVisible === 'lost'}
              flag={selectedFlag}
              onClose={closeModals}
              onReject={openRejectModal}
              onSubmit={handleResolveFlag}
            />

            <DamagedModal
              visible={modalVisible === 'damaged'}
              flag={selectedFlag}
              onClose={closeModals}
              onReject={openRejectModal}
              onSubmit={handleResolveFlag}
            />

            <ExcessModal
              visible={modalVisible === 'excess'}
              flag={selectedFlag}
              onClose={closeModals}
              onReject={openRejectModal}
              onSubmit={handleResolveFlag}
              onCheckRecovery={handleCheckRecoveryGon}
            />

            <BatchDiscrepancyModal
              visible={modalVisible === 'batch-discrepancy'}
              flag={selectedFlag}
              onClose={closeModals}
              onReject={openRejectModal}
              onSubmit={handleResolveFlag}
            />

            <SkuMismatchModal
              visible={modalVisible === 'sku-mismatch'}
              flag={selectedFlag}
              onClose={closeModals}
              onReject={openRejectModal}
              onSubmit={handleResolveFlag}
            />

            <RejectModal
              visible={rejectModalVisible}
              flag={selectedFlag}
              onClose={closeModals}
              onSubmit={handleRejectFlag}
            />
          </>
        )}
      </Card>
    </div>
  );
};

export default FlaggingPanel; 