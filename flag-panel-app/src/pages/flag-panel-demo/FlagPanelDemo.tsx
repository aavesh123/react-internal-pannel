import React, { useState } from 'react';
import { Card, Typography, Space, Button, message } from 'antd';
import { FlagPanel, Flag } from '../../components/flag-panel';

const { Title, Paragraph } = Typography;

// Sample data for demonstration
const sampleFlags: Flag[] = [
  {
    id: '1',
    name: 'New User Dashboard',
    description: 'Enable the new user dashboard with enhanced analytics and personalized recommendations.',
    enabled: true,
    category: 'feature',
    environment: 'production',
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-20T14:45:00Z',
    owner: 'John Doe',
    tags: ['urgent', 'new'],
  },
  {
    id: '2',
    name: 'Dark Mode',
    description: 'Enable dark mode theme across the application for better user experience.',
    enabled: false,
    category: 'feature',
    environment: 'staging',
    createdAt: '2024-01-10T09:15:00Z',
    updatedAt: '2024-01-18T16:20:00Z',
    owner: 'Jane Smith',
    tags: ['ui', 'enhancement'],
  },
  {
    id: '3',
    name: 'A/B Testing Framework',
    description: 'Enable the A/B testing framework for running experiments and measuring user behavior.',
    enabled: true,
    category: 'experiment',
    environment: 'development',
    createdAt: '2024-01-05T11:00:00Z',
    updatedAt: '2024-01-12T13:30:00Z',
    owner: 'Mike Johnson',
    tags: ['analytics', 'experiment'],
  },
  {
    id: '4',
    name: 'Maintenance Mode',
    description: 'Enable maintenance mode to restrict access during system updates.',
    enabled: false,
    category: 'maintenance',
    environment: 'production',
    createdAt: '2024-01-08T08:00:00Z',
    updatedAt: '2024-01-08T08:00:00Z',
    owner: 'Admin Team',
    tags: ['maintenance', 'deprecated'],
  },
  {
    id: '5',
    name: 'Enhanced Security',
    description: 'Enable enhanced security features including 2FA and session management.',
    enabled: true,
    category: 'security',
    environment: 'production',
    createdAt: '2024-01-03T15:45:00Z',
    updatedAt: '2024-01-15T10:15:00Z',
    owner: 'Security Team',
    tags: ['security', 'urgent'],
  },
];

export const FlagPanelDemo: React.FC = () => {
  const [flags, setFlags] = useState<Flag[]>(sampleFlags);
  const [loading, setLoading] = useState(false);

  const handleFlagToggle = (flagId: string, enabled: boolean) => {
    setFlags(prevFlags =>
      prevFlags.map(flag =>
        flag.id === flagId
          ? { ...flag, enabled, updatedAt: new Date().toISOString() }
          : flag
      )
    );
    message.success(`Flag ${enabled ? 'enabled' : 'disabled'} successfully`);
  };

  const handleFlagCreate = (newFlag: Omit<Flag, 'id' | 'createdAt' | 'updatedAt'>) => {
    const flag: Flag = {
      ...newFlag,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setFlags(prevFlags => [...prevFlags, flag]);
  };

  const handleFlagEdit = (flagId: string, updates: Partial<Flag>) => {
    setFlags(prevFlags =>
      prevFlags.map(flag =>
        flag.id === flagId
          ? { ...flag, ...updates, updatedAt: new Date().toISOString() }
          : flag
      )
    );
  };

  const handleFlagDelete = (flagId: string) => {
    setFlags(prevFlags => prevFlags.filter(flag => flag.id !== flagId));
  };

  const simulateLoading = () => {
    setLoading(true);
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <div style={{ padding: '24px' }}>
      <Card>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Title level={2}>Flag Panel Demo</Title>
            <Paragraph>
              This demo showcases the FlagPanel component with sample feature flags. 
              You can toggle flags, create new ones, edit existing flags, and delete them.
            </Paragraph>
          </div>

          <Space>
            <Button onClick={simulateLoading}>
              Simulate Loading
            </Button>
            <Button onClick={() => setFlags(sampleFlags)}>
              Reset to Sample Data
            </Button>
          </Space>

          <FlagPanel
            flags={flags}
            onFlagToggle={handleFlagToggle}
            onFlagCreate={handleFlagCreate}
            onFlagEdit={handleFlagEdit}
            onFlagDelete={handleFlagDelete}
            loading={loading}
            title="Feature Flags Management"
            showCreateButton={true}
            showSearch={true}
            showCategories={true}
          />
        </Space>
      </Card>
    </div>
  );
}; 