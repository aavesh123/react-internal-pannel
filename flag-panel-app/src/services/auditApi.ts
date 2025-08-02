import axios from 'axios';

// Types
export interface AuditFlag {
  id: string;
  type: 'EXCESS' | 'LOST' | 'DAMAGED' | 'BATCH_DISCREPANCY' | 'SKU_MISMATCH';
  identifier: string;
  sku: string;
  details: any;
  date: string;
  status: 'PENDING' | 'RESOLVED' | 'REJECTED';
  rejectionReason?: string;
}

export interface FilterState {
  flagType: string;
  status: string;
  identifier: string;
  date: string;
}

// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor for authentication
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      localStorage.removeItem('authToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Mock data for development
const mockFlags: AuditFlag[] = [
  {
    id: "FLAG-L01",
    type: "LOST",
    identifier: "WT-001",
    sku: "S1-XYZ123",
    details: { qty: 2, boxId: "B1" },
    date: "2025-01-06",
    status: "PENDING"
  },
  {
    id: "FLAG-E01",
    type: "EXCESS",
    identifier: "CRATE-E-01",
    sku: "S9-DEF789",
    details: { qty: 10, isRecoveryCandidate: true, recoveryQty: 7 },
    date: "2025-01-06",
    status: "PENDING"
  },
  {
    id: "FLAG-E02",
    type: "EXCESS",
    identifier: "CRATE-E-02",
    sku: "S10-GHI456",
    details: { qty: 5, isRecoveryCandidate: false },
    date: "2025-01-07",
    status: "PENDING"
  },
  {
    id: "FLAG-D01",
    type: "DAMAGED",
    identifier: "CRATE-D-01",
    sku: "S5-MNO111",
    details: { qty: 3 },
    date: "2025-01-08",
    status: "PENDING"
  },
  {
    id: "FLAG-B01",
    type: "BATCH_DISCREPANCY",
    identifier: "WT-002",
    sku: "S2-ABC456",
    details: { expected: "B-OLD", found: "B-NEW" },
    date: "2025-01-09",
    status: "PENDING"
  },
  {
    id: "FLAG-S01",
    type: "SKU_MISMATCH",
    identifier: "CRATE-S-01",
    sku: "SKU-WRONG",
    details: { foundSku: "SKU-WRONG", foundQty: 5 },
    date: "2025-01-12",
    status: "PENDING"
  },
  {
    id: "FLAG-X01",
    type: "EXCESS",
    identifier: "CRATE-E-03",
    sku: "S12-FINAL",
    details: { qty: 1 },
    date: "2025-01-11",
    status: "REJECTED",
    rejectionReason: "Auditor error. Recounted and found correct."
  },
];

// API Service Class
export class AuditApiService {
  private useMockData: boolean;

  constructor(useMockData = true) {
    this.useMockData = useMockData;
  }

  // Fetch flags with filters
  async fetchFlags(filters: FilterState): Promise<{ flags: AuditFlag[] }> {
    if (this.useMockData) {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Apply filters to mock data
      let filteredFlags = mockFlags;
      
      if (filters.flagType) {
        filteredFlags = filteredFlags.filter(f => f.type === filters.flagType);
      }
      if (filters.status) {
        filteredFlags = filteredFlags.filter(f => f.status === filters.status);
      }
      if (filters.identifier) {
        filteredFlags = filteredFlags.filter(f => 
          f.identifier.toUpperCase().includes(filters.identifier.toUpperCase())
        );
      }
      if (filters.date) {
        filteredFlags = filteredFlags.filter(f => f.date === filters.date);
      }

      return { flags: filteredFlags };
    }

    // Real API call
    try {
      const params = new URLSearchParams();
      if (filters.flagType) params.append('type', filters.flagType);
      if (filters.status) params.append('status', filters.status);
      if (filters.identifier) params.append('crateId', filters.identifier);
      if (filters.date) params.append('timeStart', filters.date);

      const response = await apiClient.get(`/audit/flags?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching flags:', error);
      throw new Error('Failed to fetch flags');
    }
  }

  // Reject a flag
  async rejectFlag(flagId: string, reason: string): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update mock data
      const flagIndex = mockFlags.findIndex(f => f.id === flagId);
      if (flagIndex !== -1) {
        mockFlags[flagIndex].status = 'REJECTED';
        mockFlags[flagIndex].rejectionReason = reason;
      }
      return;
    }

    try {
      await apiClient.post('/audit/flags/reject', {
        flagId,
        reason
      });
    } catch (error) {
      console.error('Error rejecting flag:', error);
      throw new Error('Failed to reject flag');
    }
  }

  // Resolve a flag
  async resolveFlag(flagId: string, resolutionData: any): Promise<void> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 500));
      // Update mock data
      const flagIndex = mockFlags.findIndex(f => f.id === flagId);
      if (flagIndex !== -1) {
        mockFlags[flagIndex].status = 'RESOLVED';
      }
      return;
    }

    try {
      await apiClient.post('/audit/flags/resolve', {
        flagId,
        ...resolutionData
      });
    } catch (error) {
      console.error('Error resolving flag:', error);
      throw new Error('Failed to resolve flag');
    }
  }

  // Check for recovery GON
  async checkRecoveryGon(flagId: string): Promise<{ isRecoveryCandidate: boolean; recoveryQty?: number }> {
    if (this.useMockData) {
      await new Promise(resolve => setTimeout(resolve, 300));
      // Mock response based on flag ID
      if (flagId === "FLAG-E01") {
        return { isRecoveryCandidate: true, recoveryQty: 7 };
      }
      return { isRecoveryCandidate: false };
    }

    try {
      const response = await apiClient.post('/audit/recovery-gon', {
        flag_id: flagId
      });
      return response.data;
    } catch (error) {
      console.error('Error checking recovery GON:', error);
      throw new Error('Failed to check recovery GON');
    }
  }
}

// Export default instance
export const auditApiService = new AuditApiService(true); // Use mock data by default

// Export function to switch between mock and real API
export const setUseMockData = (useMock: boolean) => {
  return new AuditApiService(useMock);
}; 