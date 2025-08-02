// Flag Types
export type FlagType = 'LOST' | 'DAMAGED' | 'EXCESS' | 'BATCH_DISCREPANCY' | 'WRONG_SKU';
export type FlagStatus = 'PENDING' | 'RESOLVED' | 'REJECTED';

// Main Flag Interface
export interface Flag {
  id: number;
  type: FlagType;
  identifier: string;
  sku: string;
  details: FlagDetails;
  createdAt: number;
  status: FlagStatus;
  rejectionReason?: string;
}

// Flag Details based on type
export interface FlagDetails {
  // Common fields
  qty?: number;
  boxId?: string;
  
  // LOST specific
  lostQty?: number;
  
  // EXCESS specific
  isRecoveryCandidate?: boolean;
  recoveryQty?: number;
  
  // DAMAGED specific
  damagedQty?: number;
  
  // BATCH_DISCREPANCY specific
  expected?: string;
  found?: string;
  expectedBatch?: BatchInfo;
  foundBatch?: BatchInfo;
  
  // WRONG_SKU specific
  foundSku?: string;
  foundQty?: number;
}

// Batch Information
export interface BatchInfo {
  batchId: string;
  mrp: number;
  mfgDate: number;
  expiryDate: number;
}

// Filter State
export interface FilterState {
  type?: FlagType;
  status?: FlagStatus;
  crateId?: string;
  date?: string;
  timeStart?: number;
  timeEnd?: number;
}

// API Response Types
export interface ApiResponse<T = any> {
  status: 'success' | 'error';
  message: string;
  data: T;
}

export interface FlagsResponse {
  flags: Flag[];
}

// Resolution Data Types
export interface LostResolutionData {
  // No additional data needed for LOST resolution
  readonly _type: 'lost';
}

export interface DamagedResolutionData {
  reasons: DamageReason[];
  totalQty: number;
}

export interface DamageReason {
  reason: string;
  quantity: number;
}

export interface ExcessResolutionData {
  quantity: number;
  recoveryQty?: number;
  freshInwardQty?: number;
}

export interface BatchDiscrepancyResolutionData {
  batchResolution: {
    type: 'CREATE' | 'UPDATE';
    newBatchId: string;
    mfgDate: number;
    expiryDate: number;
    remarks?: string;
  };
}

export interface SkuMismatchResolutionData {
  product_sku: string;
  batch_id?: string;
}

// Modal Props
export interface ModalProps {
  visible: boolean;
  flag: Flag;
  onClose: () => void;
  onReject: () => void;
  onSubmit: (data: any) => void;
}

export interface RejectModalProps {
  visible: boolean;
  flag: Flag;
  onClose: () => void;
  onSubmit: (reason: string) => void;
}

// Component Props
export interface FilterBarProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  onApplyFilters: () => void;
}

// API Hook Types
export interface UseApiReturn {
  getFlags: (filters: FilterState) => Promise<ApiResponse<FlagsResponse>>;
  rejectFlag: (flagId: number, reason: string) => Promise<ApiResponse>;
  resolveFlag: (flagId: number, data: any) => Promise<ApiResponse>;
  checkRecoveryGon: (flagId: number) => Promise<ApiResponse<{ quantity: number }>>;
} 