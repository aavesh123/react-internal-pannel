import { Flag } from './types';

// Format flag details based on type
export const formatFlagDetails = (flag: Flag): string => {
  const { type, details } = flag;
  
  switch (type) {
    case 'LOST':
      return `Qty: ${details.qty || details.lostQty || 'N/A'}`;
    
    case 'DAMAGED':
      return `Qty: ${details.qty || details.damagedQty || 'N/A'}`;
    
    case 'EXCESS':
      return `Qty: ${details.qty || 'N/A'}`;
    
    case 'BATCH_DISCREPANCY':
      return `Expected: ${details.expected || 'N/A'}, Found: ${details.found || 'N/A'}`;
    
    case 'WRONG_SKU':
      return `Found Qty: ${details.foundQty || 'N/A'}`;
    
    default:
      return `Qty: ${details.qty || 'N/A'}`;
  }
};

// Format timestamp to readable date
export const formatDate = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp * 1000); // Convert Unix timestamp to milliseconds
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
};

// Format timestamp to readable date and time
export const formatDateTime = (timestamp: number): string => {
  if (!timestamp) return 'N/A';
  
  const date = new Date(timestamp * 1000);
  return date.toLocaleString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
};

// Convert date string to Unix timestamp
export const dateToTimestamp = (dateString: string): number => {
  if (!dateString) return 0;
  
  const date = new Date(dateString);
  return Math.floor(date.getTime() / 1000);
};

// Validate damage reasons sum equals total
export const validateDamageQuantities = (
  reasons: Array<{ quantity: number }>, 
  totalQty: number
): boolean => {
  const sum = reasons.reduce((acc, reason) => acc + (reason.quantity || 0), 0);
  return sum === totalQty;
};

// Get flag type display name
export const getFlagTypeDisplayName = (type: string): string => {
  return type.replace(/_/g, ' ');
};

// Get status display name
export const getStatusDisplayName = (status: string): string => {
  return status.replace(/_/g, ' ');
};

// Format quantity with units
export const formatQuantity = (qty: number | undefined): string => {
  if (qty === undefined || qty === null) return 'N/A';
  return `${qty} units`;
};

// Format batch information
export const formatBatchInfo = (batchInfo: any): string => {
  if (!batchInfo) return 'N/A';
  
  return `Batch: ${batchInfo.batchId || 'N/A'}, MRP: ${batchInfo.mrp || 'N/A'}`;
};

// Validate required fields
export const validateRequiredFields = (data: any, requiredFields: string[]): string[] => {
  const errors: string[] = [];
  
  requiredFields.forEach(field => {
    if (!data[field] || (typeof data[field] === 'string' && data[field].trim() === '')) {
      errors.push(`${field} is required`);
    }
  });
  
  return errors;
};

// Debounce function for search inputs
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}; 