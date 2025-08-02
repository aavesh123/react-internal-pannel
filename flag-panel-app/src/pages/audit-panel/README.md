# Audit Panel

A React component that replicates the functionality of the Flag_Panel_Final_UI.html using React, Ant Design, and actual API data.

## Features

- **Flag Management**: View, filter, and resolve audit discrepancy flags
- **Multiple Flag Types**: Support for EXCESS, LOST, DAMAGED, BATCH_DISCREPANCY, and SKU_MISMATCH flags
- **Advanced Filtering**: Filter by flag type, status, identifier, and date
- **Modal Resolution**: Different resolution workflows for each flag type
- **API Integration**: Ready for real API integration with mock data fallback

## Flag Types and Resolution Workflows

### 1. LOST Flags
- **Resolution**: Creates a "Lost" Goods Outward Note (GON) to adjust inventory
- **Process**: Simple approval workflow

### 2. EXCESS Flags
- **Resolution**: Checks for matching "Lost" GON for recovery
- **Process**: 
  - Check for recovery GON
  - If found: Recover matching quantity and inward remaining
  - If not found: Initiate fresh inward

### 3. DAMAGED Flags
- **Resolution**: Write-off damaged inventory with reason breakdown
- **Process**: 
  - Specify total quantity to write-off
  - Break down by damage reasons (Near Expiry, Physical Damage)
  - Validate total matches breakdown

### 4. BATCH_DISCREPANCY Flags
- **Resolution**: Create new batch with manufacturing and expiry dates
- **Process**: 
  - Specify new batch ID
  - Set manufacturing date
  - Set expiry date

### 5. SKU_MISMATCH Flags
- **Resolution**: Update SKU and optionally batch ID
- **Process**: 
  - Enter correct SKU
  - Optionally specify correct batch ID

## API Integration

The component uses a service layer (`auditApi.ts`) that supports both mock data and real API calls:

### Mock Data (Default)
- Uses predefined mock flags for development
- Simulates API delays
- Updates mock data on actions

### Real API
- Configure via `REACT_APP_API_BASE_URL` environment variable
- Supports authentication via Bearer tokens
- Handles error responses and unauthorized access

### API Endpoints

```typescript
// Fetch flags with filters
GET /audit/flags?type=EXCESS&status=PENDING&crateId=CRATE-001&timeStart=2025-01-06

// Reject flag
POST /audit/flags/reject
{
  "flagId": "FLAG-001",
  "reason": "Auditor counting error"
}

// Resolve flag
POST /audit/flags/resolve
{
  "flagId": "FLAG-001",
  "type": "EXCESS",
  "quantity": 10
}

// Check recovery GON
POST /audit/recovery-gon
{
  "flag_id": "FLAG-001"
}
```

## Usage

```tsx
import { AuditPanel } from './pages/audit-panel';

function App() {
  return (
    <div>
      <AuditPanel />
    </div>
  );
}
```

## Configuration

### Environment Variables
```bash
# API Base URL (optional, defaults to http://localhost:3001/api)
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### Switching Between Mock and Real API
```typescript
import { setUseMockData } from './services/auditApi';

// Use real API
const realApiService = setUseMockData(false);

// Use mock data
const mockApiService = setUseMockData(true);
```

## Styling

The component uses Ant Design components with custom styling that matches the original HTML design:
- Purple primary color scheme (#5D107F)
- Responsive layout
- Status tags with appropriate colors
- Modal dialogs for resolution workflows

## Dependencies

- React 18+
- Ant Design 5+
- Axios (for API calls)
- Day.js (for date handling)

## Development

1. Install dependencies: `npm install`
2. Start development server: `npm run dev`
3. Navigate to `/audit-panel` to view the component

## Testing

The component includes mock data for testing all flag types and resolution workflows. Each flag type has different mock data to demonstrate the various scenarios. 