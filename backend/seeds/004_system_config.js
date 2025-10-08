/**
 * Seed: System Configuration
 * Default system configuration settings
 */

exports.seed = async function(knex) {
  // Clear existing system config
  await knex('system_config').del();
  
  // Insert system configuration
  await knex('system_config').insert([
    {
      config_key: 'office_name',
      config_value: 'Philippine Government Office',
      description: 'Official name of the government office'
    },
    {
      config_key: 'office_address',
      config_value: 'Manila, Philippines',
      description: 'Official address of the government office'
    },
    {
      config_key: 'password_expiry_days',
      config_value: '90',
      description: 'Number of days before password expires'
    },
    {
      config_key: 'max_failed_login_attempts',
      config_value: '5',
      description: 'Maximum failed login attempts before account lockout'
    },
    {
      config_key: 'session_timeout_minutes',
      config_value: '480',
      description: 'Session timeout in minutes (8 hours)'
    },
    {
      config_key: 'leave_accrual_day',
      config_value: '1',
      description: 'Day of month when leave credits accrue (1st day)'
    },
    {
      config_key: 'pass_slip_advance_days',
      config_value: '1',
      description: 'Minimum days in advance for planned pass slip requests'
    },
    {
      config_key: 'leave_advance_days',
      config_value: '3',
      description: 'Minimum days in advance for leave requests'
    },
    {
      config_key: 'medical_cert_required_days',
      config_value: '3',
      description: 'Number of consecutive sick leave days requiring medical certificate'
    },
    {
      config_key: 'max_leave_balance_vl',
      config_value: '300',
      description: 'Maximum vacation leave balance in days'
    },
    {
      config_key: 'max_leave_balance_sl',
      config_value: '300',
      description: 'Maximum sick leave balance in days'
    },
    {
      config_key: 'vl_accrual_rate',
      config_value: '1.25',
      description: 'Vacation leave accrual rate per month'
    },
    {
      config_key: 'sl_accrual_rate',
      config_value: '1.25',
      description: 'Sick leave accrual rate per month'
    },
    {
      config_key: 'enable_email_notifications',
      config_value: 'false',
      description: 'Enable email notifications for approvals and updates'
    },
    {
      config_key: 'certificate_reference_prefix',
      config_value: 'CERT',
      description: 'Prefix for certificate reference numbers'
    },
    {
      config_key: 'pass_slip_reference_prefix',
      config_value: 'PS',
      description: 'Prefix for pass slip reference numbers'
    },
    {
      config_key: 'leave_request_reference_prefix',
      config_value: 'LR',
      description: 'Prefix for leave request reference numbers'
    }
  ]);
  
  console.log('✅ System configuration seeded successfully');
};

