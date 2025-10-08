import api from './api'

export default {
  passSlips(params){ return api.get('/reports/pass-slips', { params }).then(r=>r.data) },
  passSlipsExport(params){ return api.get('/reports/pass-slips/export', { params, responseType: 'blob' }) },

  leave(params){ return api.get('/reports/leave', { params }).then(r=>r.data) },
  leaveExport(params){ return api.get('/reports/leave/export', { params, responseType: 'blob' }) },

  certificates(params){ return api.get('/reports/certificates', { params }).then(r=>r.data) },
  certificatesExport(params){ return api.get('/reports/certificates/export', { params, responseType: 'blob' }) },

  auditLogs(params){ return api.get('/reports/audit-logs', { params }).then(r=>r.data) },
  auditLogsExport(params){ return api.get('/reports/audit-logs/export', { params, responseType: 'blob' }) },

  employees(params){ return api.get('/reports/employees', { params }).then(r=>r.data) },
  employeesExport(params){ return api.get('/reports/employees/export', { params, responseType: 'blob' }) },
}

