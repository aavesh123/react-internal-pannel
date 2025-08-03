import React from 'react';
import { Card, Typography, Tag, Space, Divider } from 'antd';
import { UserOutlined, BarcodeOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { TaskInfoHeaderProps } from '../types';

const { Title, Text } = Typography;

export const TaskInfoHeader: React.FC<TaskInfoHeaderProps> = ({
  workTask,
  currentRack
}) => {
  if (!workTask) {
    return (
      <Card style={{ marginBottom: 16 }}>
        <Text type="secondary">No active work task</Text>
      </Card>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ASSIGNED':
        return 'blue';
      case 'IN_PROGRESS':
        return 'orange';
      case 'COMPLETED':
        return 'green';
      default:
        return 'default';
    }
  };

  return (
    <Card style={{ marginBottom: 16 }}>
      <Space direction="vertical" size="small" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Title level={4} style={{ margin: 0 }}>
            <BarcodeOutlined style={{ marginRight: 8 }} />
            Work Task: {workTask.workTaskId}
          </Title>
          <Tag color={getStatusColor(workTask.status)}>
            {workTask.status}
          </Tag>
        </div>
        
        <Divider style={{ margin: '8px 0' }} />
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Space>
            <UserOutlined />
            <Text strong>Auditor:</Text>
            <Text>{workTask.auditorId}</Text>
          </Space>
          
          {currentRack && (
            <Space>
              <CheckCircleOutlined />
              <Text strong>Current Rack:</Text>
              <Tag color="blue">{currentRack}</Tag>
            </Space>
          )}
        </div>
        
        <div>
          <Text strong>Assigned Racks:</Text>
          <div style={{ marginTop: 4 }}>
            {workTask.assignedRacks.map((rack, index) => (
              <Tag key={rack} color={rack === currentRack ? 'blue' : 'default'}>
                {rack}
              </Tag>
            ))}
          </div>
        </div>
      </Space>
    </Card>
  );
}; 