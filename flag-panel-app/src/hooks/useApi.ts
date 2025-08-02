import { useCallback } from 'react';
import { ApiResponse, FilterState, FlagsResponse } from '../pages/flagging-panel/types';

const API_BASE_URL = 'https://sandbox.purplle.com/wms/api/v1/dc-be';

// Get authentication headers
const getHeaders = () => {
  // In a real app, these would come from auth context or localStorage
  const userId = localStorage.getItem('user_id') || '101';
  const warehouseId = localStorage.getItem('warehouse_id') || '7';
  
  return {
    'user_id': userId,
    'warehouse_id': warehouseId,
    'Content-Type': 'application/json'
  };
};

// Generic API call function
const apiCall = async <T>(
  endpoint: string, 
  options: RequestInit = {}
): Promise<ApiResponse<T>> => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: getHeaders(),
      ...options
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

export const useApi = () => {
  // Get flags with filters
  const getFlags = useCallback(async (filters: FilterState): Promise<ApiResponse<FlagsResponse>> => {
    const queryParams = new URLSearchParams();
    
    if (filters.type) queryParams.append('type', filters.type);
    if (filters.status) queryParams.append('status', filters.status);
    if (filters.crateId) queryParams.append('crateId', filters.crateId);
    if (filters.timeStart) queryParams.append('timeStart', filters.timeStart.toString());
    if (filters.timeEnd) queryParams.append('timeEnd', filters.timeEnd.toString());

    const queryString = queryParams.toString();
    const endpoint = `/audit/flags${queryString ? `?${queryString}` : ''}`;
    
    return apiCall<FlagsResponse>(endpoint);
  }, []);

  // Reject flag
  const rejectFlag = useCallback(async (flagId: number, reason: string): Promise<ApiResponse> => {
    return apiCall('/audit/flags/reject', {
      method: 'POST',
      body: JSON.stringify({
        flagId,
        reason
      })
    });
  }, []);

  // Resolve flag
  const resolveFlag = useCallback(async (flagId: number, data: any): Promise<ApiResponse> => {
    return apiCall('/audit/flags/resolve', {
      method: 'POST',
      body: JSON.stringify({
        flagId,
        ...data
      })
    });
  }, []);

  // Check recovery GON
  const checkRecoveryGon = useCallback(async (flagId: number): Promise<ApiResponse<{ quantity: number }>> => {
    return apiCall<{ quantity: number }>('/audit/recovery-gon', {
      method: 'POST',
      body: JSON.stringify({
        flag_id: flagId
      })
    });
  }, []);

  return {
    getFlags,
    rejectFlag,
    resolveFlag,
    checkRecoveryGon
  };
}; 