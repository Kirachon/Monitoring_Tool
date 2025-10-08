/**
 * Seed: CSC Leave Types
 * Standard leave types as per Civil Service Commission regulations
 */

exports.seed = async function(knex) {
  // Clear existing leave types
  await knex('leave_types').del();
  
  // Insert CSC-compliant leave types
  await knex('leave_types').insert([
    {
      id: 1,
      name: 'Vacation Leave',
      code: 'VL',
      accrual_rate: 1.25, // 1.25 days per month = 15 days per year
      max_balance: 300,
      requires_medical_cert: false,
      monetizable: true,
      description: 'Vacation leave for rest and recreation. Accrues at 1.25 days per month with a maximum balance of 300 days.',
      is_active: true
    },
    {
      id: 2,
      name: 'Sick Leave',
      code: 'SL',
      accrual_rate: 1.25, // 1.25 days per month = 15 days per year
      max_balance: 300,
      requires_medical_cert: true, // Required for 3+ consecutive days
      monetizable: true,
      description: 'Sick leave for illness or injury. Accrues at 1.25 days per month with a maximum balance of 300 days. Medical certificate required for 3 or more consecutive days.',
      is_active: true
    },
    {
      id: 3,
      name: 'Maternity Leave',
      code: 'ML',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: true,
      monetizable: false,
      description: '105 days maternity leave for female employees (60 days for normal delivery, 78 days for caesarean). Additional 15 days for solo parent.',
      is_active: true
    },
    {
      id: 4,
      name: 'Paternity Leave',
      code: 'PL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: true,
      monetizable: false,
      description: '7 days paternity leave for married male employees for the first four deliveries of the legitimate spouse.',
      is_active: true
    },
    {
      id: 5,
      name: 'Special Privilege Leave',
      code: 'SPL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: false,
      monetizable: false,
      description: '3 days special privilege leave for female employees who have undergone surgery caused by gynecological disorders.',
      is_active: true
    },
    {
      id: 6,
      name: 'Solo Parent Leave',
      code: 'SOLO',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: false,
      monetizable: false,
      description: '7 working days parental leave for solo parents.',
      is_active: true
    },
    {
      id: 7,
      name: 'Magna Carta Leave',
      code: 'MCL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: true,
      monetizable: false,
      description: '2 months leave with full pay for women who have undergone surgery caused by gynecological disorders.',
      is_active: true
    },
    {
      id: 8,
      name: 'Rehabilitation Leave',
      code: 'RL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: true,
      monetizable: false,
      description: 'Leave for employees who have been victims of violence or abuse.',
      is_active: true
    },
    {
      id: 9,
      name: 'Study Leave',
      code: 'STL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: false,
      monetizable: false,
      description: 'Leave for employees pursuing further studies or training.',
      is_active: true
    },
    {
      id: 10,
      name: 'Terminal Leave',
      code: 'TL',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: false,
      monetizable: true,
      description: 'Monetization of accumulated leave credits upon retirement or resignation.',
      is_active: true
    },
    {
      id: 11,
      name: 'Special Leave Benefits for Women',
      code: 'SLBW',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: true,
      monetizable: false,
      description: 'Special leave benefits for women as provided under RA 9710 (Magna Carta of Women).',
      is_active: true
    },
    {
      id: 12,
      name: 'VAWC Leave',
      code: 'VAWC',
      accrual_rate: 0,
      max_balance: null,
      requires_medical_cert: false,
      monetizable: false,
      description: '10 days leave for victims of violence against women and their children.',
      is_active: true
    }
  ]);
  
  console.log('✅ CSC leave types seeded successfully');
};

