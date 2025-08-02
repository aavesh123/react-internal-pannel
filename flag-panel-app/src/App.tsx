import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router';
import { Layout, Menu, Typography, Space, Card } from 'antd';
import { 
  FlagOutlined, 
  UserOutlined, 
  MobileOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import FlaggingPanel from './pages/flagging-panel';
import './App.css';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: <Link to="/">Home</Link>,
    },
    {
      key: '/flagging-panel',
      icon: <FlagOutlined />,
      label: <Link to="/flagging-panel">Flag Panel</Link>,
    },
    {
      key: '/assignment-panel',
      icon: <UserOutlined />,
      label: <Link to="/assignment-panel">Assignment Panel</Link>,
    },
    {
      key: '/hhd-panel',
      icon: <MobileOutlined />,
      label: <Link to="/hhd-panel">HHD Panel</Link>,
    },
  ];

  const HomePage: React.FC = () => (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <Card style={{ maxWidth: 800, margin: 'auto' }}>
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <Title level={1} style={{ color: '#5D107F' }}>
            DC Audit Panel System
          </Title>
          
          <Title level={3} style={{ color: '#7B2CBF' }}>
            Welcome to the Audit Management System
          </Title>
          
          <div style={{ textAlign: 'left', maxWidth: 600, margin: 'auto' }}>
            <Title level={4}>Available Panels:</Title>
            <ul style={{ fontSize: '16px', lineHeight: '2' }}>
              <li>
                <strong>Flag Panel</strong> - Resolve audit discrepancy flags with type-specific workflows
              </li>
              <li>
                <strong>Assignment Panel</strong> - Assign audit tasks to auditors (Coming Soon)
              </li>
              <li>
                <strong>HHD Panel</strong> - Handheld device audit workflow (Coming Soon)
              </li>
            </ul>
            
            <div style={{ marginTop: '24px', padding: '16px', backgroundColor: '#f5f3f7', borderRadius: '8px' }}>
              <Title level={5} style={{ color: '#5D107F' }}>Quick Start:</Title>
              <p>Click on "Flag Panel" in the sidebar to access the flag resolution system.</p>
            </div>
          </div>
        </Space>
      </Card>
    </div>
  );

  const AssignmentPanel: React.FC = () => (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <Card style={{ maxWidth: 800, margin: 'auto' }}>
        <Title level={2} style={{ color: '#5D107F' }}>
          Assignment Panel
        </Title>
        <p style={{ fontSize: '16px' }}>
          This panel is under development. It will allow supervisors to assign audit tasks to auditors.
        </p>
      </Card>
    </div>
  );

  const HhdPanel: React.FC = () => (
    <div style={{ padding: '24px', textAlign: 'center' }}>
      <Card style={{ maxWidth: 800, margin: 'auto' }}>
        <Title level={2} style={{ color: '#5D107F' }}>
          HHD Panel
        </Title>
        <p style={{ fontSize: '16px' }}>
          This panel is under development. It will provide handheld device audit workflow.
        </p>
      </Card>
    </div>
  );

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          style={{
            background: '#5D107F',
          }}
        >
          <div style={{ 
            height: '64px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontSize: '18px',
            fontWeight: 'bold'
          }}>
            DC Audit
          </div>
          <Menu
            theme="dark"
            mode="inline"
            defaultSelectedKeys={['/']}
            items={menuItems}
            style={{ background: '#5D107F' }}
          />
        </Sider>
        
        <Layout>
          <Header style={{ 
            padding: '0 24px', 
            background: '#fff',
            borderBottom: '1px solid #f0f0f0',
            display: 'flex',
            alignItems: 'center'
          }}>
            <Title level={4} style={{ margin: 0, color: '#5D107F' }}>
              DC Audit Panel System
            </Title>
          </Header>
          
          <Content style={{ 
            margin: '0',
            background: '#f9f8fc',
            minHeight: 'calc(100vh - 64px)'
          }}>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/flagging-panel" element={<FlaggingPanel />} />
              <Route path="/assignment-panel" element={<AssignmentPanel />} />
              <Route path="/hhd-panel" element={<HhdPanel />} />
            </Routes>
          </Content>
        </Layout>
      </Layout>
    </Router>
  );
};

export default App;
