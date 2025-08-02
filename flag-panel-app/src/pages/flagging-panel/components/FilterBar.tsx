import React from 'react';
import { Row, Col, Select, Input, DatePicker, Button, Card } from 'antd';
import { FilterOutlined } from '@ant-design/icons';
import { FilterState, FilterBarProps, FlagType, FlagStatus } from '../types';

const { Option } = Select;

const FilterBar: React.FC<FilterBarProps> = ({
  filters,
  onFilterChange,
  onApplyFilters
}) => {
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    onFilterChange({
      ...filters,
      [key]: value
    });
  };

  const handleDateChange = (date: any, dateString: string | string[]) => {
    handleFilterChange('date', Array.isArray(dateString) ? dateString[0] : dateString);
  };

  const handleClearFilters = () => {
    onFilterChange({});
  };

  return (
    <Card 
      style={{ 
        marginBottom: '20px',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}
    >
      <Row gutter={[16, 16]} align="middle">
        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              fontWeight: 500,
              fontSize: '0.8em',
              color: '#495057'
            }}>
              Flag Type
            </label>
            <Select
              placeholder="All Types"
              value={filters.type || ''}
              onChange={(value) => handleFilterChange('type', value)}
              style={{ width: '100%' }}
              allowClear
            >
              <Option value="">All Types</Option>
              <Option value="EXCESS">Excess</Option>
              <Option value="LOST">Lost</Option>
              <Option value="DAMAGED">Damaged</Option>
              <Option value="BATCH_DISCREPANCY">Batch Discrepancy</Option>
              <Option value="WRONG_SKU">SKU Mismatch</Option>
            </Select>
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              fontWeight: 500,
              fontSize: '0.8em',
              color: '#495057'
            }}>
              Flag Status
            </label>
            <Select
              placeholder="All Statuses"
              value={filters.status || ''}
              onChange={(value) => handleFilterChange('status', value)}
              style={{ width: '100%' }}
              allowClear
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
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              fontWeight: 500,
              fontSize: '0.8em',
              color: '#495057'
            }}>
              Crate ID / WT ID
            </label>
            <Input
              placeholder="Enter ID..."
              value={filters.crateId || ''}
              onChange={(e) => handleFilterChange('crateId', e.target.value)}
              style={{ width: '100%' }}
            />
          </div>
        </Col>

        <Col xs={24} sm={12} md={6}>
          <div>
            <label style={{ 
              display: 'block', 
              marginBottom: '4px',
              fontWeight: 500,
              fontSize: '0.8em',
              color: '#495057'
            }}>
              Date
            </label>
            <DatePicker
              placeholder="Select date"
              value={filters.date ? new Date(filters.date) : null}
              onChange={handleDateChange}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
            />
          </div>
        </Col>

        <Col xs={24} sm={24} md={24}>
          <div style={{ 
            display: 'flex', 
            gap: '8px',
            justifyContent: 'flex-end',
            alignItems: 'center'
          }}>
            <Button 
              onClick={handleClearFilters}
              size="small"
            >
              Clear
            </Button>
            <Button 
              type="primary"
              icon={<FilterOutlined />}
              onClick={onApplyFilters}
              size="small"
            >
              Filter
            </Button>
          </div>
        </Col>
      </Row>
    </Card>
  );
};

export default FilterBar; 