# 🛠️ DC Audit Panel Technical Documentation (Cursor-AI Ready)

This document outlines the full end-to-end UI interaction design, placeholder API logic, and Cursor-compatible generation requirements for the following panels:
- Assignment Panel (Desktop)
- HHD Panel (Handheld)
- Flag Resolution Panel (Desktop)

Each section includes:
1. **Flow overview**
2. **Expected API integrations (with placeholders)**
3. **Error cases and validation**
4. **Toast/message triggers**
5. **Cursor rule tags to support automation**

---

## 📋 Assignment Panel

### Objective
Enable supervisors to assign audit tasks to auditors based on availability, track task status, and review work orders assigned under each task.

### Main Flows
- View all available audit tasks (CREATED, ASSIGNED, IN_PROGRESS).
- View work orders under each audit task (click to open modal).
- Assign audit task to an auditor via dropdown + confirm modal.
- Status badge based on current task state.
- Toast on success/failure.

### Cursor Tags Used
```mdc
@datatable-panel
@modal-form
@actions
@resource: audit/work-tasks
@table-columns: id, createdAt[Date], status[Badge], assignedToName
@modal-fields: workOrders[List], rackName
@toast: all
```

### API Integration Points (placeholders):
- `GET /audit/work-tasks` → Fetch tasks list
- `POST /audit/assign-task` → Assign to auditor

### Modal Form Example
- Triggered by "View Work Orders" button
- Readonly modal showing nested list of work orders
- Uses: `@modal-form mode: readonly`

### Error Handling
- Toast: “Failed to fetch work orders”
- Toast: “Task already assigned”
- Form should block submission if auditor not selected.

---

## 🖐 HHD Panel

### Objective
Audit workflow for handheld devices: scan work task, fetch boxes, confirm item details, handle discrepancies.

### Main Flows
1. **Work Task Fetch** (auto fetch highest priority task via `GET /audit/work-task`)
2. **Start Work Task** – Validate rack state, update task state.
3. **List Work Orders** – Display current WOs under this task.
4. **Start Work Order** – Begins scan state.
5. **Scan Box** – Calls `POST /box/scan`, show details.
6. **Confirm Box** – With validations (qty, ean, damage).
7. **Submit WO** – Finalizes WO if all boxes confirmed.

### Cursor Tags Used
```mdc
@hhd-panel
@scan-input: boxCode[autofocus]
@table-columns: boxCode, sku, ean, mfg, qty
@footer-actions: Start WO, Skip WO, Confirm Box
@toast: all
```

### API Integration Points:
- `GET /audit/work-task`
- `POST /audit/work-task/start`
- `POST /audit/work-order/start`
- `POST /audit/work-order/box/scan`
- `POST /audit/work-order/box/confirm`
- `POST /audit/work-order/submit`

### Error Scenarios
- Scan invalid box → Toast: “Invalid Box Code”
- Confirm with missing fields → Toast: “All details required”
- Rack not in correct state → Toast: “Rack status mismatch”
- Mismatch in expected quantity → Discrepancy flag triggered

---

## 🚩 Flag Panel

### Objective
Enable auditors to resolve or reject various discrepancy flags identified during audit.

### Main Flows
- Fetch all pending flags (GET /audit/flags)
- Filter by flag type (Excess, Lost, Damaged, etc.)
- Modal for each flag resolution type
- Reject modal with reason
- Resolve modal based on flag type logic (LOST → GON; DAMAGED → reason map)

### Cursor Tags Used
```mdc
@flagging-panel
@resource: audit/flags
@tabs: LOST, DAMAGED, EXCESS, WRONG_SKU, BATCH_DISCREPANCY
@modal-form
@actions: Reject[Modal], Resolve[Modal]
@toast: all
```

### API Integration Points:
- `GET /audit/flags`
- `POST /audit/flags/reject`
- `POST /audit/flags/resolve`
- `POST /audit/recovery-gon`

### Resolution Modal Logic
- LOST: Sequential call to `createGon`, `submitGonItcV2`
- DAMAGED: `resolve` with damage reasons → validate qty
- BATCH_DISCREPANCY: Show 2 tabs - Update batch OR Create new batch
- WRONG_SKU: Product SKU mismatch resolution

### Error Handling
- Reject without reason → Block + Toast
- Resolve with missing inputs → Block + Toast
- API failure on submit → Show retry toast
- Unhandled flag type → “Unsupported resolution type”

---

## 🔍 Technical Implementation Reminders

- Add loading states during API transitions.
- Disable primary buttons on submission.
- Validate all fields in confirm modals.
- Add keyboard-accessible close for all modals.
- All toast messages must be standardized via `packages/ui/Toast`.

---

## 🔗 Cursor Prompt Reference

Prompt example for generating Flag panel:
```
Create a @flagging-panel with @tabs for LOST, EXCESS, DAMAGED, WRONG_SKU, BATCH_DISCREPANCY using @resource audit/flags.
Include modals with @modal-form for each resolution flow.
```

Prompt for HHD:
```
Generate an @hhd-panel to allow scanning boxCode, confirm details, and submit work order. Use autofocus on scan input.
```

Prompt for Assignment Panel:
```
Create an @datatable-panel for audit/work-tasks with modal showing workOrders. Allow assignment via dropdown and toast on submit.
```
