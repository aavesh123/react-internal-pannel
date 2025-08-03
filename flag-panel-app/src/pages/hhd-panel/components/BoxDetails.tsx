import React, { useState } from 'react';
import { Card, Typography, Row, Col, Input, InputNumber, DatePicker, Button, Space, Alert, Image, Collapse } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, EyeOutlined } from '@ant-design/icons';
import { BoxDetailsProps, BoxAuditData } from '../types';
import dayjs from 'dayjs';

const { Title, Text, Paragraph } = Typography;
const { TextArea } = Input;
const { Panel } = Collapse;

export const BoxDetails: React.FC<BoxDetailsProps> = ({
  boxDetails,
  onEanVerify,
  onSubmit,
  loading = false
}) => {
  const [formData, setFormData] = useState<BoxAuditData>({
    eanCode: '',
    qtyLeft: 0,
    mrp: 0,
    mfgDate: '',
    expiryDate: '',
    damagedQty: 0,
    crate: ''
  });
  const [eanVerification, setEanVerification] = useState<'pending' | 'success' | 'fail'>('pending');
  const [showCrateSection, setShowCrateSection] = useState(false);
  const [descriptionExpanded, setDescriptionExpanded] = useState(false);

  React.useEffect(() => {
    if (boxDetails) {
      setFormData({
        eanCode: boxDetails.eanCode,
        qtyLeft: boxDetails.expectedQty,
        mrp: boxDetails.mrp,
        mfgDate: boxDetails.mfgDate,
        expiryDate: boxDetails.expiryDate,
        damagedQty: 0,
        crate: ''
      });
      setEanVerification('pending');
      setShowCrateSection(false);
    }
  }, [boxDetails]);

  const handleEanVerify = () => {
    if (formData.eanCode.trim()) {
      const isValid = onEanVerify(formData.eanCode);
      setEanVerification(isValid ? 'success' : 'fail');
    }
  };

  const handleSubmit = () => {
    if (!formData.eanCode.trim()) {
      return;
    }

    const goodQty = formData.qtyLeft - formData.damagedQty;
    const excessQty = goodQty - (boxDetails?.expectedQty || 0);
    const needsCrate = excessQty > 0 || formData.damagedQty > 0;

    if (needsCrate && !showCrateSection) {
      setShowCrateSection(true);
      return;
    }

    onSubmit(formData);
  };

  const getEanVerificationIcon = () => {
    switch (eanVerification) {
      case 'success':
        return <CheckCircleOutlined style={{ color: '#52c41a' }} />;
      case 'fail':
        return <CloseCircleOutlined style={{ color: '#ff4d4f' }} />;
      default:
        return null;
    }
  };

  if (!boxDetails) {
    return (
      <Card>
        <Text type="secondary">No box details available</Text>
      </Card>
    );
  }

  const goodQty = formData.qtyLeft - formData.damagedQty;
  const excessQty = goodQty - boxDetails.expectedQty;
  const needsCrate = excessQty > 0 || formData.damagedQty > 0;

  return (
    <Card title={`Box: ${boxDetails.boxCode}`} style={{ marginBottom: 16 }}>
      <Row gutter={[16, 16]}>
        <Col span={16}>
          <Space direction="vertical" size="middle" style={{ width: '100%' }}>
            {/* Item Information */}
            <div>
              <Text strong>SKU:</Text> {boxDetails.sku}
            </div>
            
            <div>
              <Text strong>Description:</Text>
              <Paragraph
                ellipsis={{
                  rows: descriptionExpanded ? 0 : 2,
                  expandable: true,
                  symbol: descriptionExpanded ? 'Show less' : 'Show more',
                }}
                style={{ margin: '4px 0' }}
              >
                {boxDetails.description}
              </Paragraph>
            </div>

            <div>
              <Text strong>Batch:</Text> {boxDetails.batch}
            </div>

            <div>
              <Text strong>Expected Qty:</Text> {boxDetails.expectedQty}
            </div>

            {/* EAN Verification */}
            <div>
              <Text strong>EAN Code:</Text>
              <Space style={{ marginLeft: 8 }}>
                <Input
                  value={formData.eanCode}
                  onChange={(e) => setFormData({ ...formData, eanCode: e.target.value })}
                  placeholder="Scan EAN..."
                  style={{ width: 200 }}
                  suffix={getEanVerificationIcon()}
                />
                <Button onClick={handleEanVerify} disabled={!formData.eanCode.trim()}>
                  Verify
                </Button>
              </Space>
            </div>

            {/* Quantity Inputs */}
            <Row gutter={16}>
              <Col span={12}>
                <Text strong>Physical Count Qty:</Text>
                <InputNumber
                  value={formData.qtyLeft}
                  onChange={(value) => setFormData({ ...formData, qtyLeft: value || 0 })}
                  min={0}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
              <Col span={12}>
                <Text strong>Damaged Qty:</Text>
                <InputNumber
                  value={formData.damagedQty}
                  onChange={(value) => setFormData({ ...formData, damagedQty: value || 0 })}
                  min={0}
                  max={formData.qtyLeft}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
            </Row>

            {/* MRP and Dates */}
            <Row gutter={16}>
              <Col span={8}>
                <Text strong>MRP (₹):</Text>
                <InputNumber
                  value={formData.mrp}
                  onChange={(value) => setFormData({ ...formData, mrp: value || 0 })}
                  min={0}
                  step={0.01}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
              <Col span={8}>
                <Text strong>Mfg Date:</Text>
                <DatePicker
                  value={formData.mfgDate ? dayjs(formData.mfgDate) : null}
                  onChange={(date) => setFormData({ ...formData, mfgDate: date?.format('YYYY-MM-DD') || '' })}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
              <Col span={8}>
                <Text strong>Exp Date:</Text>
                <DatePicker
                  value={formData.expiryDate ? dayjs(formData.expiryDate) : null}
                  onChange={(date) => setFormData({ ...formData, expiryDate: date?.format('YYYY-MM-DD') || '' })}
                  style={{ width: '100%', marginTop: 4 }}
                />
              </Col>
            </Row>

            {/* Crate Section */}
            {showCrateSection && (
              <Alert
                message="Discrepancy Detected"
                description={
                  <div>
                    {excessQty > 0 && <div>Excess: {excessQty} units</div>}
                    {formData.damagedQty > 0 && <div>Damaged: {formData.damagedQty} units</div>}
                    <div style={{ marginTop: 8 }}>
                      <Text strong>Scan Crate ID:</Text>
                      <Input
                        value={formData.crate}
                        onChange={(e) => setFormData({ ...formData, crate: e.target.value })}
                        placeholder="Scan crate..."
                        style={{ marginTop: 4 }}
                      />
                    </div>
                  </div>
                }
                type="warning"
                showIcon
              />
            )}

            {/* Submit Button */}
            <Button
              type="primary"
              onClick={handleSubmit}
              loading={loading}
              disabled={!formData.eanCode.trim() || formData.qtyLeft < formData.damagedQty}
              style={{ width: '100%' }}
            >
              {showCrateSection ? 'Confirm to Crate' : 'Submit'}
            </Button>
          </Space>
        </Col>

        <Col span={8}>
          {/* Item Image */}
          <div style={{ textAlign: 'center' }}>
            <Image
              width={120}
              height={120}
              src={boxDetails.imageUrl || 'https://via.placeholder.com/120x120?text=SKU'}
              alt="SKU Image"
              fallback="https://via.placeholder.com/120x120?text=No+Image"
              style={{ border: '1px solid #d9d9d9', borderRadius: 6 }}
            />
          </div>
        </Col>
      </Row>
    </Card>
  );
}; 