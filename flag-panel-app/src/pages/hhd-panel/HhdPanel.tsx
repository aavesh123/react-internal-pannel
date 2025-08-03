import React, { useState, useEffect } from 'react';
import { Card, Typography, Steps, Button, message, Spin, Alert, Space, Modal } from 'antd';
import { 
  PlayCircleOutlined, 
  BarcodeOutlined, 
  CheckCircleOutlined, 
  FileTextOutlined,
  TrophyOutlined,
  HomeOutlined
} from '@ant-design/icons';
import { TaskInfoHeader } from './components/TaskInfoHeader';
import { ScanInput } from './components/ScanInput';
import { BoxDetails } from './components/BoxDetails';
import { CompletionActions } from './components/CompletionActions';
import { 
  WorkTask, 
  BoxDetails as BoxDetailsType, 
  BoxAuditData, 
  AuditStep 
} from './types';

const { Title, Text } = Typography;

// API Configuration
const API_BASE_URL = 'https://sandbox.purplle.com/wms/api/v1/dc-be';

// Mock data for development
const mockWorkTask: WorkTask = {
  workTaskId: 'WT-001',
  auditorId: 'Alex (A-1138)',
  assignedRacks: ['R1', 'R3'],
  status: 'ASSIGNED'
};

const mockBoxDetails: BoxDetailsType = {
  boxCode: 'B1',
  sku: 'S1-XYZ123',
  description: 'Paracetamol 500mg Film-Coated Tablets, 15 per strip. This is an effective pain reliever and fever reducer suitable for adults and children over 12.',
  eanCode: '1234567890123',
  batch: 'BATCH-X',
  mrp: 150.00,
  mfgDate: '2024-01-15',
  expiryDate: '2026-01-31',
  expectedQty: 12,
  eanScanRequired: true,
  imageUrl: 'https://via.placeholder.com/120x120?text=SKU'
};

const auditSteps: AuditStep[] = [
  { id: 'start-task', title: 'Start Task', description: 'Begin audit work task' },
  { id: 'scan-rack', title: 'Scan Rack', description: 'Scan rack barcode' },
  { id: 'scan-box', title: 'Scan Box', description: 'Scan box barcode' },
  { id: 'item-details', title: 'Item Details', description: 'Verify item details' },
  { id: 'complete-rack', title: 'Complete Rack', description: 'Finish rack audit' }
];

export const HhdPanel: React.FC = () => {
  // State management
  const [currentStep, setCurrentStep] = useState<string>('start-task');
  const [workTask, setWorkTask] = useState<WorkTask | null>(null);
  const [currentRack, setCurrentRack] = useState<string | null>(null);
  const [currentBox, setCurrentBox] = useState<string>('');
  const [boxDetails, setBoxDetails] = useState<BoxDetailsType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [scanError, setScanError] = useState<string>('');

  // Mock data flag
  const useMockData = true;

  useEffect(() => {
    fetchCurrentTask();
  }, []);

  const fetchCurrentTask = async () => {
    setLoading(true);
    try {
      if (useMockData) {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWorkTask(mockWorkTask);
      } else {
        const response = await fetch(`${API_BASE_URL}/audit/work-task`, {
          headers: {
            'Content-Type': 'application/json',
            'user_id': 'test-user',
            'warehouse_id': 'test-warehouse'
          }
        });
        const data = await response.json();
        setWorkTask(data);
      }
    } catch (err) {
      setError('Failed to fetch current task');
      message.error('Failed to fetch current task');
    } finally {
      setLoading(false);
    }
  };

  const handleStartTask = async () => {
    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setWorkTask(prev => prev ? { ...prev, status: 'IN_PROGRESS' } : null);
        setCurrentRack(workTask?.assignedRacks[0] || null);
        setCurrentStep('scan-rack');
        message.success('Audit task started successfully');
      } else {
        const response = await fetch(`${API_BASE_URL}/audit/work-task/start`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user_id': 'test-user',
            'warehouse_id': 'test-warehouse'
          },
          body: JSON.stringify({
            work_task_id: workTask?.workTaskId
          })
        });
        const data = await response.json();
        setCurrentRack(data.rackId);
        setCurrentStep('scan-rack');
        message.success('Audit task started successfully');
      }
    } catch (err) {
      message.error('Failed to start audit task');
    } finally {
      setLoading(false);
    }
  };

  const handleRackScan = async () => {
    if (!currentBox.trim()) {
      setScanError('Please scan a rack barcode');
      return;
    }

    if (currentBox.toUpperCase() !== currentRack?.toUpperCase()) {
      setScanError(`Wrong rack! Expected ${currentRack}, scanned ${currentBox}`);
      return;
    }

    setScanError('');
    setCurrentStep('scan-box');
    message.success(`Rack ${currentBox} confirmed`);
  };

  const handleBoxScan = async () => {
    if (!currentBox.trim()) {
      setScanError('Please scan a box barcode');
      return;
    }

    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setBoxDetails(mockBoxDetails);
        setCurrentStep('item-details');
        message.success(`Box ${currentBox} scanned successfully`);
      } else {
        const response = await fetch(`${API_BASE_URL}/audit/work-order/box/scan`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user_id': 'test-user',
            'warehouse_id': 'test-warehouse'
          },
          body: JSON.stringify({
            workTaskId: workTask?.workTaskId,
            workOrderId: currentRack,
            boxCode: currentBox
          })
        });
        const data = await response.json();
        setBoxDetails(data.boxDetails);
        setCurrentStep('item-details');
        message.success(`Box ${currentBox} scanned successfully`);
      }
    } catch (err) {
      setScanError('Failed to scan box');
      message.error('Failed to scan box');
    } finally {
      setLoading(false);
    }
  };

  const handleEanVerify = (ean: string): boolean => {
    return ean === boxDetails?.eanCode;
  };

  const handleBoxSubmit = async (data: BoxAuditData) => {
    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success('Box audit completed successfully');
        setCurrentStep('scan-box');
        setCurrentBox('');
        setBoxDetails(null);
      } else {
        const response = await fetch(`${API_BASE_URL}/audit/work-order/box/confirm`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user_id': 'test-user',
            'warehouse_id': 'test-warehouse'
          },
          body: JSON.stringify({
            boxCode: currentBox,
            workTaskId: workTask?.workTaskId,
            workOrderId: currentRack,
            ...data
          })
        });
        const result = await response.json();
        if (result.success) {
          message.success('Box audit completed successfully');
          setCurrentStep('scan-box');
          setCurrentBox('');
          setBoxDetails(null);
        } else {
          message.error(result.message || 'Failed to submit box audit');
        }
      }
    } catch (err) {
      message.error('Failed to submit box audit');
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteRack = async () => {
    setLoading(true);
    try {
      if (useMockData) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        message.success(`Rack ${currentRack} audit completed`);
        // Move to next rack or complete task
        const currentRackIndex = workTask?.assignedRacks.indexOf(currentRack || '') || -1;
        const nextRackIndex = currentRackIndex + 1;
        
        if (nextRackIndex < (workTask?.assignedRacks.length || 0)) {
          setCurrentRack(workTask?.assignedRacks[nextRackIndex] || null);
          setCurrentStep('scan-rack');
        } else {
          setCurrentStep('start-task');
          setWorkTask(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
          setCurrentRack(null);
          message.success('All racks completed! Work task finished.');
        }
      } else {
        const response = await fetch(`${API_BASE_URL}/audit/work-order/submit`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'user_id': 'test-user',
            'warehouse_id': 'test-warehouse'
          },
          body: JSON.stringify({
            workTaskId: workTask?.workTaskId,
            workOrderId: currentRack
          })
        });
        const result = await response.json();
        if (result.success) {
          message.success(`Rack ${currentRack} audit completed`);
          setCurrentStep('scan-rack');
        } else {
          message.error(result.message || 'Failed to complete rack');
        }
      }
    } catch (err) {
      message.error('Failed to complete rack');
    } finally {
      setLoading(false);
    }
  };

  const handleSkipRack = async () => {
    setLoading(true);
    try {
      message.warning(`Rack ${currentRack} skipped`);
      // Move to next rack
      const currentRackIndex = workTask?.assignedRacks.indexOf(currentRack || '') || -1;
      const nextRackIndex = currentRackIndex + 1;
      
      if (nextRackIndex < (workTask?.assignedRacks.length || 0)) {
        setCurrentRack(workTask?.assignedRacks[nextRackIndex] || null);
        setCurrentStep('scan-rack');
      } else {
        setCurrentStep('start-task');
        setWorkTask(prev => prev ? { ...prev, status: 'COMPLETED' } : null);
        setCurrentRack(null);
        message.success('All racks completed! Work task finished.');
      }
    } catch (err) {
      message.error('Failed to skip rack');
    } finally {
      setLoading(false);
    }
  };

  const handleHomeClick = () => {
    Modal.confirm({
      title: 'Exit Audit?',
      content: 'Progress will be lost. Are you sure you want to exit?',
      onOk: () => {
        setCurrentStep('start-task');
        setCurrentRack(null);
        setCurrentBox('');
        setBoxDetails(null);
        setWorkTask(prev => prev ? { ...prev, status: 'ASSIGNED' } : null);
        message.info('Returned to start screen');
      }
    });
  };

  const getCurrentStepIndex = () => {
    return auditSteps.findIndex(step => step.id === currentStep);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 'start-task':
        return (
          <Card title="Start Audit Task" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <TaskInfoHeader workTask={workTask} currentRack={currentRack} />
              
              {error && (
                <Alert message={error} type="error" showIcon />
              )}
              
              <Button
                type="primary"
                icon={<PlayCircleOutlined />}
                onClick={handleStartTask}
                loading={loading}
                size="large"
                style={{ width: '100%' }}
                disabled={!workTask || workTask.status !== 'ASSIGNED'}
              >
                Start Audit
              </Button>
            </Space>
          </Card>
        );

      case 'scan-rack':
        return (
          <Card title={`Scan Rack: ${currentRack}`} style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <TaskInfoHeader workTask={workTask} currentRack={currentRack} />
              
              <div>
                <Text strong>Proceed to Audit Rack: </Text>
                <Text strong style={{ color: '#1890ff' }}>{currentRack}</Text>
              </div>
              
              <ScanInput
                value={currentBox}
                onChange={setCurrentBox}
                placeholder="Scan rack barcode..."
                onConfirm={handleRackScan}
                error={scanError}
              />
              
              <CompletionActions
                onCompleteRack={() => setCurrentStep('complete-rack')}
                onSkipRack={handleSkipRack}
                loading={loading}
              />
            </Space>
          </Card>
        );

      case 'scan-box':
        return (
          <Card title={`Rack ${currentRack} - Scan Box`} style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <TaskInfoHeader workTask={workTask} currentRack={currentRack} />
              
              <div>
                <Text strong>Scan next box in rack </Text>
                <Text strong style={{ color: '#1890ff' }}>{currentRack}</Text>
              </div>
              
              <ScanInput
                value={currentBox}
                onChange={setCurrentBox}
                placeholder="Scan box barcode..."
                onConfirm={handleBoxScan}
                error={scanError}
              />
              
              <CompletionActions
                onCompleteRack={() => setCurrentStep('complete-rack')}
                onSkipRack={handleSkipRack}
                loading={loading}
              />
            </Space>
          </Card>
        );

      case 'item-details':
        return (
          <div>
            <TaskInfoHeader workTask={workTask} currentRack={currentRack} />
            
            <BoxDetails
              boxDetails={boxDetails}
              onEanVerify={handleEanVerify}
              onSubmit={handleBoxSubmit}
              loading={loading}
            />
          </div>
        );

      case 'complete-rack':
        return (
          <Card title="Complete Rack Audit" style={{ marginBottom: 16 }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
              <TaskInfoHeader workTask={workTask} currentRack={currentRack} />
              
              <Alert
                message="Complete Rack Audit"
                description={`Are you sure you want to complete the audit for rack ${currentRack}?`}
                type="info"
                showIcon
              />
              
              <Space>
                <Button
                  type="primary"
                  onClick={handleCompleteRack}
                  loading={loading}
                >
                  Yes, Complete Rack
                </Button>
                <Button
                  onClick={() => setCurrentStep('scan-box')}
                >
                  No, Continue Auditing
                </Button>
              </Space>
            </Space>
          </Card>
        );

      default:
        return <div>Unknown step</div>;
    }
  };

  if (loading && currentStep === 'start-task') {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>Loading work task...</Text>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '24px',
        padding: '16px',
        backgroundColor: '#5D107F',
        color: 'white',
        borderRadius: '8px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <HomeOutlined 
            style={{ fontSize: '24px', marginRight: '12px', cursor: 'pointer' }}
            onClick={handleHomeClick}
          />
          <Title level={3} style={{ color: 'white', margin: 0 }}>
            HHD Audit Panel
          </Title>
        </div>
        <div>
          <Text style={{ color: 'white' }}>
            {workTask ? `WT: ${workTask.workTaskId}` : 'No Task'}
          </Text>
        </div>
      </div>

      {/* Progress Steps */}
      <Card style={{ marginBottom: '24px' }}>
        <Steps
          current={getCurrentStepIndex()}
          items={auditSteps.map(step => ({
            title: step.title,
            description: step.description,
            icon: step.id === 'start-task' ? <PlayCircleOutlined /> :
                  step.id === 'scan-rack' ? <BarcodeOutlined /> :
                  step.id === 'scan-box' ? <BarcodeOutlined /> :
                  step.id === 'item-details' ? <FileTextOutlined /> :
                  <TrophyOutlined />
          }))}
        />
      </Card>

      {/* Step Content */}
      {renderStepContent()}
    </div>
  );
}; 