import { message } from 'antd';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export const showToast = (type: ToastType, content: string, duration = 3) => {
  switch (type) {
    case 'success':
      message.success(content, duration);
      break;
    case 'error':
      message.error(content, duration);
      break;
    case 'warning':
      message.warning(content, duration);
      break;
    case 'info':
      message.info(content, duration);
      break;
    default:
      message.info(content, duration);
  }
};

// Convenience functions for common toast messages
export const showSuccessToast = (content: string) => showToast('success', content);
export const showErrorToast = (content: string) => showToast('error', content);
export const showWarningToast = (content: string) => showToast('warning', content);
export const showInfoToast = (content: string) => showToast('info', content);

// Standard toast messages
export const TOAST_MESSAGES = {
  OPERATION_SUCCESS: 'Operation completed successfully',
  OPERATION_FAILED: 'Operation failed. Please try again.',
  VALIDATION_ERROR: 'Please check your input and try again.',
  NETWORK_ERROR: 'Network connection failed. Please check your internet.',
  UNAUTHORIZED: 'You are not authorized to perform this action.',
  NOT_FOUND: 'The requested resource was not found.',
  SERVER_ERROR: 'Server error occurred. Please try again later.',
  REQUIRED_FIELD: 'This field is required.',
  INVALID_INPUT: 'Please enter valid information.',
  LOADING_FAILED: 'Failed to load data. Please refresh the page.',
  SAVE_SUCCESS: 'Data saved successfully.',
  DELETE_SUCCESS: 'Item deleted successfully.',
  UPDATE_SUCCESS: 'Data updated successfully.',
  FLAG_RESOLVED: 'Flag resolved successfully.',
  FLAG_REJECTED: 'Flag rejected successfully.',
  FLAG_FETCH_ERROR: 'Failed to fetch flags.',
  FLAG_RESOLVE_ERROR: 'Failed to resolve flag.',
  FLAG_REJECT_ERROR: 'Failed to reject flag.',
  RECOVERY_CHECK_ERROR: 'Failed to check recovery GON.',
  QUANTITY_MISMATCH: 'Quantity mismatch detected.',
  BATCH_CREATION_ERROR: 'Failed to create new batch.',
  SKU_UPDATE_ERROR: 'Failed to update SKU information.',
  DAMAGE_PROCESSING_ERROR: 'Failed to process damage information.',
  EXCESS_PROCESSING_ERROR: 'Failed to process excess information.',
  LOST_PROCESSING_ERROR: 'Failed to process lost information.',
} as const; 