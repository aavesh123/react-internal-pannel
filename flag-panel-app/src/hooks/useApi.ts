import { useCallback } from 'react';
import { ApiResponse, FilterState, FlagsResponse } from '../pages/flagging-panel/types';
import { dummyFlagsData, filterDummyFlags, mockApiResponses, simulateApiDelay } from '@/utils/dummyData';

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

// Generic API call function with dummy data fallback
const apiCall = async <T>(
  endpoint: string, 
  options: RequestInit = {},
  useDummyFallback = true
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
    console.warn('API call failed, using dummy data:', error);
    
    if (!useDummyFallback) {
      throw error;
    }
    
    // Simulate API delay
    await simulateApiDelay(500);
    
    // Return dummy response based on endpoint
    if (endpoint.includes('/audit/flags')) {
      return {
        status: 'success',
        message: 'Using dummy data (API unavailable)',
        data: {
          flags: dummyFlagsData,
          total: dummyFlagsData.length,
          page: 1,
          limit: 10
        } as T
      };
    }
    
    // For other endpoints, return generic success
    return {
      status: 'success',
      message: 'Operation completed (using dummy data - API unavailable)',
      data: {} as T
    };
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
    
    try {
      return await apiCall<FlagsResponse>(endpoint);
    } catch (error) {
      // If API fails, use dummy data with filtering
      console.warn('API failed, using filtered dummy data:', error);
      
      await simulateApiDelay(500);
      
      const filteredFlags = filterDummyFlags(dummyFlagsData, filters);
      
      return {
        status: 'success',
        message: 'Using dummy data (API unavailable)',
        data: {
          flags: filteredFlags
        }
      };
    }
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