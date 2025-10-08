/**
 * Seed: Philippine Holidays 2025
 * Official Philippine holidays as per CSC guidelines
 */

exports.seed = async function(knex) {
  // Clear existing holidays
  await knex('holidays').del();
  
  // Insert Philippine holidays for 2025
  await knex('holidays').insert([
    { 
      date: '2025-01-01', 
      name: 'New Year\'s Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-02-09', 
      name: 'Chinese New Year', 
      type: 'Special Non-Working', 
      recurring: false 
    },
    { 
      date: '2025-02-25', 
      name: 'EDSA People Power Revolution Anniversary', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-04-09', 
      name: 'Araw ng Kagitingan (Day of Valor)', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-04-17', 
      name: 'Maundy Thursday', 
      type: 'Regular', 
      recurring: false 
    },
    { 
      date: '2025-04-18', 
      name: 'Good Friday', 
      type: 'Regular', 
      recurring: false 
    },
    { 
      date: '2025-04-19', 
      name: 'Black Saturday', 
      type: 'Special Non-Working', 
      recurring: false 
    },
    { 
      date: '2025-05-01', 
      name: 'Labor Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-06-12', 
      name: 'Independence Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-08-21', 
      name: 'Ninoy Aquino Day', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-08-25', 
      name: 'National Heroes Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-11-01', 
      name: 'All Saints\' Day', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-11-02', 
      name: 'All Souls\' Day', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-11-30', 
      name: 'Bonifacio Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-12-08', 
      name: 'Feast of the Immaculate Conception of Mary', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-12-24', 
      name: 'Christmas Eve', 
      type: 'Special Non-Working', 
      recurring: true 
    },
    { 
      date: '2025-12-25', 
      name: 'Christmas Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-12-30', 
      name: 'Rizal Day', 
      type: 'Regular', 
      recurring: true 
    },
    { 
      date: '2025-12-31', 
      name: 'Last Day of the Year', 
      type: 'Special Non-Working', 
      recurring: true 
    }
  ]);
  
  console.log('✅ Philippine holidays 2025 seeded successfully');
};

