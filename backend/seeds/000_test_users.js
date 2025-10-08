/**
 * Seed: Test Users
 * Creates test employee records and user accounts for all four roles
 * This seed runs first (000_ prefix) to ensure test users are available
 */

const bcrypt = require('bcrypt');

exports.seed = async function(knex) {
  try {
    console.log('🔧 Starting test users seed...');

    // Check if roles exist (required dependency)
    const rolesExist = await knex('roles').select('id').first();
    if (!rolesExist) {
      console.log('⚠️  Roles table is empty. Please run 001_roles_permissions seed first.');
      return;
    }

    // Check if test users already exist
    const existingTestUser = await knex('users').where('username', 'admin').first();

    if (existingTestUser) {
      console.log('✅ Test users already exist. Skipping seed.');
      console.log('\n📋 Test User Credentials:');
      console.log('   System Admin:    admin / Admin123!');
      console.log('   HR Admin:        hradmin / HRAdmin123!');
      console.log('   Supervisor:      supervisor / Supervisor123!');
      console.log('   Employee:        employee / Employee123!');
      console.log('\n');
      return;
    }

    // Create test department
    console.log('📁 Creating test department...');
    const [testDepartment] = await knex('departments').insert({
      name: 'Test Department',
      parent_id: null,
      dept_head_id: null
    }).returning('*');

    console.log(`✅ Test department created: ${testDepartment.name} (ID: ${testDepartment.id})`);

    // Hash passwords (using bcrypt with 10 salt rounds)
    console.log('🔐 Hashing passwords...');
    const adminPassword = await bcrypt.hash('Admin123!', 10);
    const hradminPassword = await bcrypt.hash('HRAdmin123!', 10);
    const supervisorPassword = await bcrypt.hash('Supervisor123!', 10);
    const employeePassword = await bcrypt.hash('Employee123!', 10);

    // Create test employees
    console.log('👥 Creating test employees...');
    const employees = await knex('employees').insert([
      {
        employee_id: 'TEST-ADMIN',
        first_name: 'System',
        last_name: 'Administrator',
        middle_name: 'Test',
        email: 'admin@test.hrms.gov.ph',
        position: 'System Administrator',
        department_id: testDepartment.id,
        employment_status: 'Regular',
        date_hired: '2024-01-01'
      },
      {
        employee_id: 'TEST-HRADMIN',
        first_name: 'HR',
        last_name: 'Administrator',
        middle_name: 'Test',
        email: 'hradmin@test.hrms.gov.ph',
        position: 'HR Manager',
        department_id: testDepartment.id,
        employment_status: 'Regular',
        date_hired: '2024-01-01'
      },
      {
        employee_id: 'TEST-SUPERVISOR',
        first_name: 'Department',
        last_name: 'Supervisor',
        middle_name: 'Test',
        email: 'supervisor@test.hrms.gov.ph',
        position: 'Department Head',
        department_id: testDepartment.id,
        employment_status: 'Regular',
        date_hired: '2024-01-01'
      },
      {
        employee_id: 'TEST-EMPLOYEE',
        first_name: 'Regular',
        last_name: 'Employee',
        middle_name: 'Test',
        email: 'employee@test.hrms.gov.ph',
        position: 'Staff',
        department_id: testDepartment.id,
        employment_status: 'Regular',
        date_hired: '2024-01-01'
      }
    ]).returning('*');

    console.log(`✅ Created ${employees.length} test employees`);

    // Create user accounts
    console.log('🔑 Creating user accounts...');
    const users = await knex('users').insert([
      {
        username: 'admin',
        password_hash: adminPassword,
        employee_id: employees[0].id,
        status: 'active',
        must_change_password: false
      },
      {
        username: 'hradmin',
        password_hash: hradminPassword,
        employee_id: employees[1].id,
        status: 'active',
        must_change_password: false
      },
      {
        username: 'supervisor',
        password_hash: supervisorPassword,
        employee_id: employees[2].id,
        status: 'active',
        must_change_password: false
      },
      {
        username: 'employee',
        password_hash: employeePassword,
        employee_id: employees[3].id,
        status: 'active',
        must_change_password: false
      }
    ]).returning('*');

    console.log(`✅ Created ${users.length} user accounts`);

    // Assign roles
    console.log('👔 Assigning roles...');
    await knex('user_roles').insert([
      { user_id: users[0].id, role_id: 4 }, // System Administrator
      { user_id: users[1].id, role_id: 3 }, // HR Administrator
      { user_id: users[2].id, role_id: 2 }, // Supervisor
      { user_id: users[3].id, role_id: 1 }  // Employee
    ]);

    console.log('✅ Roles assigned successfully');

    // Get leave types for balance initialization
    const vlType = await knex('leave_types').where('code', 'VL').first();
    const slType = await knex('leave_types').where('code', 'SL').first();

    if (vlType && slType) {
      // Create initial leave balances (15 days each for VL and SL)
      console.log('📊 Creating initial leave balances...');
      const leaveBalances = [];
      
      for (const employee of employees) {
        leaveBalances.push(
          {
            employee_id: employee.id,
            leave_type_id: vlType.id,
            current_balance: 15.00
          },
          {
            employee_id: employee.id,
            leave_type_id: slType.id,
            current_balance: 15.00
          }
        );
      }

      await knex('leave_balances').insert(leaveBalances);
      console.log(`✅ Created leave balances for ${employees.length} employees`);
    } else {
      console.log('⚠️  Leave types (VL/SL) not found. Skipping leave balance creation.');
    }

    // Summary
    console.log('\n✅ Test users seed completed successfully!');
    console.log('\n📋 Test User Credentials:');
    console.log('   System Admin:    admin / Admin123!');
    console.log('   HR Admin:        hradmin / HRAdmin123!');
    console.log('   Supervisor:      supervisor / Supervisor123!');
    console.log('   Employee:        employee / Employee123!');
    console.log('\n');

  } catch (error) {
    console.error('❌ Error seeding test users:', error.message);
    throw error;
  }
};

