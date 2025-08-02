# 🚀 DC Audit Panel - Quick Reference

## 🎯 Component Generation Commands

### Assignment Panel
```bash
# Generate assignment panel with Cursor
@datatable-panel resource:audit/work-tasks table-columns:id,createdAt[Date],status[Badge],assignedToName modal-fields:workOrders[List],rackName toast:all
```

### HHD Panel
```bash
# Generate HHD panel with Cursor
@hhd-panel scan-input:boxCode[autofocus] table-columns:boxCode,sku,ean,mfg,qty footer-actions:Start WO,Skip WO,Confirm Box toast:all
```

### Flag Panel
```bash
# Generate flag panel with Cursor
@flagging-panel resource:audit/flags tabs:LOST,DAMAGED,EXCESS,WRONG_SKU,BATCH_DISCREPANCY modal-form actions:Reject[Modal],Resolve[Modal] toast:all
```

## 🔗 API Endpoints Quick Reference

### Assignment Panel APIs
- `GET /audit/work-tasks` - Fetch tasks list
- `POST /audit/assign-task` - Assign to auditor

### HHD Panel APIs
- `GET /audit/work-task` - Fetch priority task
- `POST /audit/work-task/start` - Start task
- `POST /audit/work-order/start` - Start work order
- `POST /audit/work-order/box/scan` - Scan box
- `POST /audit/work-order/box/confirm` - Confirm box
- `POST /audit/work-order/submit` - Submit work order

### Flag Panel APIs
- `GET /audit/flags` - Fetch pending flags
- `POST /audit/flags/reject` - Reject flag
- `POST /audit/flags/resolve` - Resolve flag
- `POST /audit/recovery-gon` - Fetch recovery quantity

## 🎨 UI Patterns

### Standard Modal
```typescript
<Modal isOpen={isOpen} onClose={onClose} title={title}>
  <ModalBody>{children}</ModalBody>
  <ModalFooter>
    <Button variant="secondary" onClick={onClose}>Cancel</Button>
    <Button variant="primary" onClick={onSubmit}>Submit</Button>
  </ModalFooter>
</Modal>
```

### Standard Table
```typescript
<Table>
  <TableHead>
    <TableRow>
      {columns.map(col => <TableCell key={col}>{col}</TableCell>)}
    </TableRow>
  </TableHead>
  <TableBody>
    {data.map(item => (
      <TableRow key={item.id}>
        {Object.values(item).map(val => <TableCell key={val}>{val}</TableCell>)}
      </TableRow>
    ))}
  </TableBody>
</Table>
```

### Toast Messages
```typescript
showToast('success', 'Operation completed successfully');
showToast('error', 'Operation failed. Please try again.');
showToast('warning', 'Please check your input and try again.');
```

## 🔧 Common Patterns

### API Call Pattern
```typescript
const [loading, setLoading] = useState(false);

const handleApiCall = async () => {
  setLoading(true);
  try {
    const response = await apiCall();
    if (response.status === 'success') {
      showToast('success', response.message);
    } else {
      throw new Error(response.message);
    }
  } catch (error) {
    showToast('error', error.message);
  } finally {
    setLoading(false);
  }
};
```

### Form Validation
```typescript
const validateForm = (data) => {
  const errors = {};
  if (!data.requiredField) {
    errors.requiredField = 'This field is required';
  }
  return errors;
};
```

### Loading State
```typescript
const [isLoading, setIsLoading] = useState(false);
// Use in buttons: disabled={isLoading}
// Use in components: {isLoading && <Spinner />}
```

## 📊 Data Models

### WorkTask Interface
```typescript
interface WorkTask {
  id: number;
  status: string; // 'CREATED' | 'ASSIGNED' | 'IN_PROGRESS' | 'COMPLETED'
  assignedToName?: string;
  workOrders: WorkOrder[];
  createdAt: number;
}
```

### Flag Interface
```typescript
interface Flag {
  id: number;
  type: string; // 'LOST' | 'DAMAGED' | 'EXCESS' | 'WRONG_SKU' | 'BATCH_DISCREPANCY'
  identifier: string;
  sku: string;
  details: object;
  createdAt: number;
  status: string; // 'PENDING' | 'RESOLVED' | 'REJECTED'
}
```

## 🎯 Workflow Quick Reference

### B2C Flow
1. Assignment Panel → Assign tasks
2. HHD Panel → Scan and confirm boxes
3. Flag Panel → Resolve discrepancies

### STO Flow
1. Create STO tasks
2. Assign to auditors
3. Audit STO items
4. Handle discrepancies
5. Finalize audit

### Discrepancy Flow
1. Flag generation (automatic)
2. Flag filtering and viewing
3. Flag resolution by type
4. Flag rejection with reason
5. Inventory updates

## 🚨 Error Handling

### Network Errors
```typescript
catch (error) {
  if (error.name === 'NetworkError') {
    showToast('error', 'Network connection failed');
  } else {
    showToast('error', error.message || 'An unexpected error occurred');
  }
}
```

### Validation Errors
```typescript
if (Object.keys(errors).length > 0) {
  showToast('warning', 'Please fix the validation errors');
  return;
}
```

## 🔐 Required Headers
```typescript
headers: {
  'user_id': string,
  'warehouse_id': string,
  'Content-Type': 'application/json'
}
```

## 📱 Responsive Design
- Mobile-first approach
- Touch-friendly interactions
- Keyboard navigation support
- Screen reader accessibility

## 🚀 Performance Tips
- Use React.memo for expensive components
- Implement request debouncing
- Use pagination for large datasets
- Cache frequently accessed data

## 🧪 Testing Checklist
- [ ] Component renders correctly
- [ ] API calls work properly
- [ ] Form validation functions
- [ ] Error handling works
- [ ] Loading states display
- [ ] Accessibility features work

## 📝 File Naming
- Components: `assignment-panel.tsx`
- Hooks: `use-audit-api.ts`
- Types: `audit-types.ts`
- Utils: `audit-utils.ts`

## 🎨 Theme Colors
```css
--primary-color: #5D107F;
--secondary-color: #7B2CBF;
--success-color: #28a745;
--warning-color: #ffc107;
--error-color: #dc3545;
```

---

## 📋 Development Commands

### Generate Component
```bash
# Use Cursor to generate components based on YAML spec
cursor generate @datatable-panel
cursor generate @hhd-panel
cursor generate @flagging-panel
```

### Run Tests
```bash
npm test
npm run test:coverage
```

### Build Project
```bash
npm run build
npm run build:production
```

This quick reference provides instant access to the most commonly used patterns and commands for DC Audit Panel development. 