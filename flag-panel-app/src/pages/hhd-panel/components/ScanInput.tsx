import React, { useState, useEffect } from 'react';
import { Input, Button, Space, Alert } from 'antd';
import { ScanOutlined } from '@ant-design/icons';
import { ScanInputProps } from '../types';

export const ScanInput: React.FC<ScanInputProps> = ({
  value,
  onChange,
  placeholder,
  autoFocus = true,
  onConfirm,
  error
}) => {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleConfirm();
    }
  };

  const handleConfirm = () => {
    if (inputValue.trim()) {
      onConfirm();
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    onChange(newValue);
  };

  return (
    <div style={{ width: '100%' }}>
      <Space.Compact style={{ width: '100%' }}>
        <Input
          value={inputValue}
          onChange={handleInputChange}
          onKeyPress={handleKeyPress}
          placeholder={placeholder}
          autoFocus={autoFocus}
          size="large"
          style={{ flex: 1 }}
        />
        <Button
          type="primary"
          icon={<ScanOutlined />}
          onClick={handleConfirm}
          size="large"
          disabled={!inputValue.trim()}
        >
          Confirm
        </Button>
      </Space.Compact>
      
      {error && (
        <Alert
          message={error}
          type="error"
          showIcon
          style={{ marginTop: 8 }}
        />
      )}
    </div>
  );
}; 