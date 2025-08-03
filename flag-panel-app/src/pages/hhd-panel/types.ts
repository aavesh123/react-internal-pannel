// HHD Panel Types
export interface WorkTask {
  workTaskId: string;
  auditorId: string;
  assignedRacks: string[];
  status: 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface WorkOrder {
  workOrderId: string;
  rackId: string;
  status: 'FREE' | 'AUDITING_IN_PROGRESS' | 'AUDIT_COMPLETE';
  boxes: BoxItem[];
}

export interface BoxItem {
  boxCode: string;
  sku: string;
  description: string;
  eanCode: string;
  batch: string;
  mrp: number;
  mfgDate: string;
  expiryDate: string;
  expectedQty: number;
  eanScanRequired: boolean;
  auditedStatus: 'PENDING' | 'COMPLETE' | 'COMPLETE_WITH_DISCREPANCY' | 'NOT_FOUND_WRONG_SKU' | null;
}

export interface BoxDetails {
  boxCode: string;
  sku: string;
  description: string;
  eanCode: string;
  batch: string;
  mrp: number;
  mfgDate: string;
  expiryDate: string;
  expectedQty: number;
  eanScanRequired: boolean;
  imageUrl?: string;
}

export interface AuditStep {
  id: string;
  title: string;
  description: string;
}

export interface ScanInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  autoFocus?: boolean;
  onConfirm: () => void;
  error?: string;
}

export interface TaskInfoHeaderProps {
  workTask: WorkTask | null;
  currentRack: string | null;
}

export interface BoxDetailsProps {
  boxDetails: BoxDetails | null;
  onEanVerify: (ean: string) => boolean;
  onSubmit: (data: BoxAuditData) => void;
  loading?: boolean;
}

export interface BoxAuditData {
  eanCode: string;
  qtyLeft: number;
  mrp: number;
  mfgDate: string;
  expiryDate: string;
  damagedQty: number;
  crate?: string;
}

export interface CompletionActionsProps {
  onCompleteRack: () => void;
  onSkipRack: () => void;
  loading?: boolean;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface StartTaskResponse {
  workOrderId: string;
  rackId: string;
}

export interface ScanBoxResponse {
  boxDetails: BoxDetails;
}

export interface ConfirmBoxResponse {
  success: boolean;
  message: string;
}

export interface SubmitWorkOrderResponse {
  success: boolean;
  message: string;
} 