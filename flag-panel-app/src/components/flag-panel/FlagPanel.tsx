import React, { useState, useEffect } from 'react';
import {
  Card,
  Switch,
  Typography,
  Space,
  Tag,
  Input,
  Button,
  Divider,
  Row,
  Col,
  Tooltip,
  Badge,
  Alert,
  Empty,
  Spin,
  Modal,
  Form,
  Select,
  message,
} from 'antd';
import {
  FlagOutlined,
  SettingOutlined,
  SearchOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Search } = Input;
const { Option } = Select;

export interface Flag {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  category: string;
  environment: 'development' | 'staging' | 'production';
  createdAt: string;
  updatedAt: string;
  owner?: string;
  tags?: string[];
}

interface FlagPanelProps {
  flags?: Flag[];
  onFlagToggle?: (flagId: string, enabled: boolean) => void;
  onFlagCreate?: (flag: Omit<Flag, 'id' | 'createdAt' | 'updatedAt'>) => void;
  onFlagEdit?: (flagId: string, updates: Partial<Flag>) => void;
  onFlagDelete?: (flagId: string) => void;
  loading?: boolean;
  title?: string;
  showCreateButton?: boolean;
  showSearch?: boolean;
  showCategories?: boolean;
  className?: string;
}

export const FlagPanel: React.FC<FlagPanelProps> = ({
  flags = [],
  onFlagToggle,
  onFlagCreate,
  onFlagEdit,
  onFlagDelete,
  loading = false,
  title = 'Feature Flags',
  showCreateButton = true,
  showSearch = true,
  showCategories = true,
  className,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedEnvironment, setSelectedEnvironment] = useState<string>('all');
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [isEditModalVisible, setIsEditModalVisible] = useState(false);
  const [editingFlag, setEditingFlag] = useState<Flag | null>(null);
  const [createForm] = Form.useForm();
  const [editForm] = Form.useForm();

  // Get unique categories from flags
  const categories = ['all', ...Array.from(new Set(flags.map(flag => flag.category)))];
  const environments = ['all', 'development', 'staging', 'production'];

  // Filter flags based on search and filters
  const filteredFlags = flags.filter(flag => {
    const matchesSearch = flag.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         flag.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || flag.category === selectedCategory;
    const matchesEnvironment = selectedEnvironment === 'all' || flag.environment === selectedEnvironment;
    
    return matchesSearch && matchesCategory && matchesEnvironment;
  });

  const handleFlagToggle = (flagId: string, enabled: boolean) => {
    if (onFlagToggle) {
      onFlagToggle(flagId, enabled);
    }
  };

  const handleCreateFlag = (values: any) => {
    if (onFlagCreate) {
      onFlagCreate({
        name: values.name,
        description: values.description,
        enabled: values.enabled,
        category: values.category,
        environment: values.environment,
        owner: values.owner,
        tags: values.tags,
      });
      createForm.resetFields();
      setIsCreateModalVisible(false);
      message.success('Flag created successfully');
    }
  };

  const handleEditFlag = (values: any) => {
    if (onFlagEdit && editingFlag) {
      onFlagEdit(editingFlag.id, {
        name: values.name,
        description: values.description,
        enabled: values.enabled,
        category: values.category,
        environment: values.environment,
        owner: values.owner,
        tags: values.tags,
      });
      editForm.resetFields();
      setIsEditModalVisible(false);
      setEditingFlag(null);
      message.success('Flag updated successfully');
    }
  };

  const handleDeleteFlag = (flagId: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this flag?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk() {
        if (onFlagDelete) {
          onFlagDelete(flagId);
          message.success('Flag deleted successfully');
        }
      },
    });
  };

  const openEditModal = (flag: Flag) => {
    setEditingFlag(flag);
    editForm.setFieldsValue({
      name: flag.name,
      description: flag.description,
      enabled: flag.enabled,
      category: flag.category,
      environment: flag.environment,
      owner: flag.owner,
      tags: flag.tags,
    });
    setIsEditModalVisible(true);
  };

  const getEnvironmentColor = (environment: string) => {
    switch (environment) {
      case 'development':
        return 'blue';
      case 'staging':
        return 'orange';
      case 'production':
        return 'red';
      default:
        return 'default';
    }
  };

  const getStatusIcon = (enabled: boolean) => {
    return enabled ? (
      <CheckCircleOutlined style={{ color: '#52c41a' }} />
    ) : (
      <CloseCircleOutlined style={{ color: '#ff4d4f' }} />
    );
  };

  return (
    <div className={className}>
      <Card>
        <div style={{ marginBottom: 16 }}>
          <Row justify="space-between" align="middle">
            <Col>
              <Title level={3} style={{ margin: 0 }}>
                <FlagOutlined style={{ marginRight: 8 }} />
                {title}
              </Title>
            </Col>
            <Col>
              <Space>
                {showCreateButton && (
                  <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    onClick={() => setIsCreateModalVisible(true)}
                  >
                    Add Flag
                  </Button>
                )}
              </Space>
            </Col>
          </Row>
        </div>

        {showSearch && (
          <div style={{ marginBottom: 16 }}>
            <Row gutter={16}>
              <Col span={12}>
                <Search
                  placeholder="Search flags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  prefix={<SearchOutlined />}
                  allowClear
                />
              </Col>
              {showCategories && (
                <>
                  <Col span={6}>
                    <Select
                      placeholder="Category"
                      value={selectedCategory}
                      onChange={setSelectedCategory}
                      style={{ width: '100%' }}
                    >
                      {categories.map(category => (
                        <Option key={category} value={category}>
                          {category === 'all' ? 'All Categories' : category}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col span={6}>
                    <Select
                      placeholder="Environment"
                      value={selectedEnvironment}
                      onChange={setSelectedEnvironment}
                      style={{ width: '100%' }}
                    >
                      {environments.map(env => (
                        <Option key={env} value={env}>
                          {env === 'all' ? 'All Environments' : env}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                </>
              )}
            </Row>
          </div>
        )}

        <Divider />

        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <Spin size="large" />
            <div style={{ marginTop: 16 }}>
              <Text type="secondary">Loading flags...</Text>
            </div>
          </div>
        ) : filteredFlags.length === 0 ? (
          <Empty
            description="No flags found"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
          />
        ) : (
          <div>
            {filteredFlags.map((flag) => (
              <Card
                key={flag.id}
                size="small"
                style={{ marginBottom: 12 }}
                actions={[
                  <Tooltip title="Edit flag">
                    <EditOutlined onClick={() => openEditModal(flag)} />
                  </Tooltip>,
                  <Tooltip title="Delete flag">
                    <DeleteOutlined
                      style={{ color: '#ff4d4f' }}
                      onClick={() => handleDeleteFlag(flag.id)}
                    />
                  </Tooltip>,
                ]}
              >
                <Row justify="space-between" align="middle">
                  <Col flex="auto">
                    <Space direction="vertical" size="small" style={{ width: '100%' }}>
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Space>
                            {getStatusIcon(flag.enabled)}
                            <Text strong>{flag.name}</Text>
                            <Tag color={getEnvironmentColor(flag.environment)}>
                              {flag.environment}
                            </Tag>
                            <Tag color="blue">{flag.category}</Tag>
                          </Space>
                        </Col>
                        <Col>
                          <Switch
                            checked={flag.enabled}
                            onChange={(checked) => handleFlagToggle(flag.id, checked)}
                            checkedChildren="ON"
                            unCheckedChildren="OFF"
                          />
                        </Col>
                      </Row>
                      
                      <Paragraph type="secondary" style={{ margin: 0 }}>
                        {flag.description}
                      </Paragraph>
                      
                                             {flag.tags && flag.tags.length > 0 && (
                         <Space wrap>
                           {flag.tags.map((tag, index) => (
                             <Tag key={index}>
                               {tag}
                             </Tag>
                           ))}
                         </Space>
                       )}
                      
                      <Row justify="space-between" align="middle">
                        <Col>
                          <Text type="secondary" style={{ fontSize: '12px' }}>
                            Created: {new Date(flag.createdAt).toLocaleDateString()}
                          </Text>
                        </Col>
                        {flag.owner && (
                          <Col>
                            <Text type="secondary" style={{ fontSize: '12px' }}>
                              Owner: {flag.owner}
                            </Text>
                          </Col>
                        )}
                      </Row>
                    </Space>
                  </Col>
                </Row>
              </Card>
            ))}
          </div>
        )}

        <div style={{ marginTop: 16 }}>
          <Alert
            message={`${filteredFlags.length} flag${filteredFlags.length !== 1 ? 's' : ''} found`}
            type="info"
            showIcon
            icon={<InfoCircleOutlined />}
          />
        </div>
      </Card>

      {/* Create Flag Modal */}
      <Modal
        title="Create New Flag"
        open={isCreateModalVisible}
        onCancel={() => setIsCreateModalVisible(false)}
        footer={null}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
          onFinish={handleCreateFlag}
        >
          <Form.Item
            name="name"
            label="Flag Name"
            rules={[{ required: true, message: 'Please enter flag name' }]}
          >
            <Input placeholder="Enter flag name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter flag description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="feature">Feature</Option>
                  <Option value="experiment">Experiment</Option>
                  <Option value="maintenance">Maintenance</Option>
                  <Option value="security">Security</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="environment"
                label="Environment"
                rules={[{ required: true, message: 'Please select environment' }]}
              >
                <Select placeholder="Select environment">
                  <Option value="development">Development</Option>
                  <Option value="staging">Staging</Option>
                  <Option value="production">Production</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
            initialValue={false}
          >
            <Switch />
          </Form.Item>
          
          <Form.Item name="owner" label="Owner">
            <Input placeholder="Enter owner name" />
          </Form.Item>
          
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Enter tags">
              <Option value="urgent">Urgent</Option>
              <Option value="deprecated">Deprecated</Option>
              <Option value="new">New</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Create Flag
              </Button>
              <Button onClick={() => setIsCreateModalVisible(false)}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>

      {/* Edit Flag Modal */}
      <Modal
        title="Edit Flag"
        open={isEditModalVisible}
        onCancel={() => {
          setIsEditModalVisible(false);
          setEditingFlag(null);
        }}
        footer={null}
        width={600}
      >
        <Form
          form={editForm}
          layout="vertical"
          onFinish={handleEditFlag}
        >
          <Form.Item
            name="name"
            label="Flag Name"
            rules={[{ required: true, message: 'Please enter flag name' }]}
          >
            <Input placeholder="Enter flag name" />
          </Form.Item>
          
          <Form.Item
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter description' }]}
          >
            <Input.TextArea rows={3} placeholder="Enter flag description" />
          </Form.Item>
          
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select category' }]}
              >
                <Select placeholder="Select category">
                  <Option value="feature">Feature</Option>
                  <Option value="experiment">Experiment</Option>
                  <Option value="maintenance">Maintenance</Option>
                  <Option value="security">Security</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="environment"
                label="Environment"
                rules={[{ required: true, message: 'Please select environment' }]}
              >
                <Select placeholder="Select environment">
                  <Option value="development">Development</Option>
                  <Option value="staging">Staging</Option>
                  <Option value="production">Production</Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>
          
          <Form.Item
            name="enabled"
            label="Enabled"
            valuePropName="checked"
          >
            <Switch />
          </Form.Item>
          
          <Form.Item name="owner" label="Owner">
            <Input placeholder="Enter owner name" />
          </Form.Item>
          
          <Form.Item name="tags" label="Tags">
            <Select mode="tags" placeholder="Enter tags">
              <Option value="urgent">Urgent</Option>
              <Option value="deprecated">Deprecated</Option>
              <Option value="new">New</Option>
            </Select>
          </Form.Item>
          
          <Form.Item>
            <Space>
              <Button type="primary" htmlType="submit">
                Update Flag
              </Button>
              <Button onClick={() => {
                setIsEditModalVisible(false);
                setEditingFlag(null);
              }}>
                Cancel
              </Button>
            </Space>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}; 