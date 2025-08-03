# HHD Audit Panel

A React-based audit panel for handheld device (HHD) warehouse operations, built with Ant Design and following the workflow defined in the rules file.

## Features

### Core Functionality
- Work Task Management: Start, track, and complete audit work tasks
- Rack Scanning: Scan and verify rack barcodes
- Box Scanning: Scan individual box barcodes for audit
- Item Verification: Verify EAN codes and item details
- Quantity Auditing: Record physical counts, damaged quantities, and discrepancies
- Crate Management: Handle excess and damaged items through crate workflow
- Progress Tracking: Visual step-by-step progress indicator

### Workflow Steps
1. Start Task: Begin audit work task
2. Scan Rack: Scan and confirm rack barcode
3. Scan Box: Scan individual box barcodes
4. Item Details: Verify item information and record audit data
5. Complete Rack: Finish rack audit and move to next rack

## API Integration

### Base Configuration
- API Base URL: https://sandbox.purplle.com/wms/api/v1/dc-be
- Headers: user_id, warehouse_id, Content-Type: application/json

### Endpoints
- GET /audit/work-task - Fetch current work task
- POST /audit/work-task/start - Start audit task
- POST /audit/work-order/start - Start work order for rack
- POST /audit/work-order/box/scan - Scan box barcode
- POST /audit/work-order/box/confirm - Confirm box audit data
- POST /audit/work-order/submit - Submit completed work order

## Usage

### Development Mode
The panel currently uses mock data for development. Set useMockData = true in HhdPanel.tsx to use mock data.

### Production Mode
Set useMockData = false to use real API endpoints. Ensure proper authentication headers are configured.

## Components

- TaskInfoHeader: Displays work task information and current status
- ScanInput: Barcode scanning input with validation
- BoxDetails: Item details form with EAN verification
- CompletionActions: Rack completion and skip actions

## File Structure
```
src/pages/hhd-panel/
├── index.ts                 # Main export
├── HhdPanel.tsx            # Main component
├── types.ts                # TypeScript interfaces
├── README.md               # Documentation
└── components/
    ├── ScanInput.tsx       # Barcode input component
    ├── BoxDetails.tsx      # Item details form
    ├── TaskInfoHeader.tsx  # Task information display
    └── CompletionActions.tsx # Rack completion actions
``` 