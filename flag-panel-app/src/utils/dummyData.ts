import { Flag, FlagType, FlagStatus } from '@/pages/flagging-panel/types';

// Dummy data extracted from Flag_Panel_Final_UI copy.html - exact format as in HTML
export const dummyFlagsData: Flag[] = [
  {
    id: 1, // Will be converted to string format in the component
    type: "LOST",
    identifier: "WT-001",
    sku: "S1-XYZ123",
    details: {
      qty: 2,
      boxId: "B1"
    },
    createdAt: Math.floor(new Date("2025-09-06").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 2,
    type: "EXCESS",
    identifier: "CRATE-E-01",
    sku: "S9-DEF789",
    details: {
      qty: 10,
      isRecoveryCandidate: true,
      recoveryQty: 7
    },
    createdAt: Math.floor(new Date("2025-09-06").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 3,
    type: "EXCESS",
    identifier: "CRATE-E-02",
    sku: "S10-GHI456",
    details: {
      qty: 5,
      isRecoveryCandidate: false
    },
    createdAt: Math.floor(new Date("2025-09-07").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 4,
    type: "DAMAGED",
    identifier: "CRATE-D-01",
    sku: "S5-MNO111",
    details: {
      qty: 3
    },
    createdAt: Math.floor(new Date("2025-09-08").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 5,
    type: "BATCH_DISCREPANCY",
    identifier: "WT-002",
    sku: "S2-ABC456",
    details: {
      expected: "B-OLD",
      found: "B-NEW"
    },
    createdAt: Math.floor(new Date("2025-09-09").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 6,
    type: "WRONG_SKU",
    identifier: "CRATE-S-01",
    sku: "SKU-WRONG",
    details: {
      foundSku: "SKU-WRONG",
      foundQty: 5
    },
    createdAt: Math.floor(new Date("2025-09-12").getTime() / 1000),
    status: "PENDING"
  },
  {
    id: 7,
    type: "EXCESS",
    identifier: "CRATE-E-03",
    sku: "S12-FINAL",
    details: {
      qty: 1
    },
    createdAt: Math.floor(new Date("2025-09-11").getTime() / 1000),
    status: "REJECTED",
    rejectionReason: "Auditor error. Recounted and found correct."
  }
];

// Helper function to filter dummy data based on filters
export const filterDummyFlags = (
  flags: Flag[],
  filters: {
    type?: string;
    status?: string;
    crateId?: string;
    date?: string;
    timeStart?: number;
    timeEnd?: number;
  }
): Flag[] => {
  return flags.filter(flag => {
    // Filter by type
    if (filters.type && filters.type !== 'ALL' && flag.type !== filters.type) {
      return false;
    }
    
    // Filter by status
    if (filters.status && flag.status !== filters.status) {
      return false;
    }
    
    // Filter by crate ID/WT ID
    if (filters.crateId && !flag.identifier.toUpperCase().includes(filters.crateId.toUpperCase())) {
      return false;
    }
    
    // Filter by date (convert createdAt timestamp to date string for comparison)
    if (filters.date) {
      const flagDate = new Date(flag.createdAt * 1000).toISOString().split('T')[0];
      if (flagDate !== filters.date) {
        return false;
      }
    }
    
    // Filter by time range
    if (filters.timeStart && flag.createdAt < filters.timeStart) {
      return false;
    }
    
    if (filters.timeEnd && flag.createdAt > filters.timeEnd) {
      return false;
    }
    
    return true;
  });
};

// Mock API responses for different operations
export const mockApiResponses = {
  getFlags: {
    status: 'success',
    data: {
      flags: dummyFlagsData,
      total: dummyFlagsData.length,
      page: 1,
      limit: 10
    },
    message: 'Flags retrieved successfully'
  },
  
  rejectFlag: {
    status: 'success',
    data: {
      flagId: '',
      status: 'REJECTED'
    },
    message: 'Flag rejected successfully'
  },
  
  resolveFlag: {
    status: 'success',
    data: {
      flagId: '',
      status: 'RESOLVED'
    },
    message: 'Flag resolved successfully'
  },
  
  checkRecoveryGon: {
    status: 'success',
    data: {
      quantity: 7,
      found: true
    },
    message: 'Recovery GON found'
  }
};

// Helper to convert numeric ID to string format like in HTML
export const formatFlagId = (id: number, type: FlagType): string => {
  const typeMap: Record<FlagType, string> = {
    'LOST': 'L',
    'EXCESS': 'E', 
    'DAMAGED': 'D',
    'BATCH_DISCREPANCY': 'B',
    'WRONG_SKU': 'S',
    'ALL': 'X'
  };
  
  const typeCode = typeMap[type] || 'X';
  return `FLAG-${typeCode}${id.toString().padStart(2, '0')}`;
};

// Helper to simulate API delay
export const simulateApiDelay = (ms = 1000): Promise<void> => {
  return new Promise(resolve => setTimeout(resolve, ms));
}; 