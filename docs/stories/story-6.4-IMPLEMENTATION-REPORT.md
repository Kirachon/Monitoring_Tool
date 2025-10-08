# Story 6.4: Certificate Reports - Implementation Report

## Overview
Implements reporting for certificates issued, with filters and CSV export.

## Backend
- Endpoints:
  - GET `/api/reports/certificates` (filters: dateFrom, dateTo, type)
  - GET `/api/reports/certificates/export` (CSV)
- Service: `reportService.certificateReport()`
- Security: `report.read`

## Frontend
- View: `frontend/src/views/reports/CertificateReports.vue`
- Service: `reportService.certificates`, `reportService.certificatesExport`
- Router: `/reports/certificates`

## Testing Recommendations
- Verify joins and filter correctness
- Validate CSV columns and date formatting

## Status
✅ Completed.

