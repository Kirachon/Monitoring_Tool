/**
 * Employee Service
 * Handles employee management operations
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class EmployeeService {
  /**
   * Get all employees with pagination, search, and filters
   * @param {Object} params - Query parameters
   * @returns {Promise<Object>}
   */
  async getEmployees({ page = 1, perPage = 25, search = '', department = '', employmentStatus = '', salaryGrade = '', salaryGradeMin = '', salaryGradeMax = '', dateHiredFrom = '', dateHiredTo = '', userId = null, userRole = null }) {
    try {
      const offset = (page - 1) * perPage;
      
      let query = db('employees')
        .leftJoin('departments', 'employees.department_id', 'departments.id')

        .select(
          'employees.id',
          'employees.employee_id',
          'employees.first_name',
          'employees.middle_name',
          'employees.last_name',
          'employees.suffix',
          'employees.position',
          'employees.employment_status',
          'employees.status',
          'employees.salary_grade',
          'departments.name as department_name',
          'employees.date_hired',
          'employees.date_regularized'
        );
      
      // Apply search filter
      if (search) {
        query = query.where(function() {
          this.where('employees.employee_id', 'ilike', `%${search}%`)
            .orWhere('employees.first_name', 'ilike', `%${search}%`)
            .orWhere('employees.middle_name', 'ilike', `%${search}%`)
            .orWhere('employees.last_name', 'ilike', `%${search}%`)
            .orWhere('employees.position', 'ilike', `%${search}%`)
            .orWhere('departments.name', 'ilike', `%${search}%`);
        });
      }
      
      // Role-based filtering: Supervisors see only their department
      if (userRole === 'Supervisor' && userId) {
        const supervisor = await db('employees').where('id', userId).first();
        if (supervisor) {
          query = query.where('employees.department_id', supervisor.department_id);
        }
      }

      // Apply filters
      if (department) {
        query = query.where('employees.department_id', department);
      }

      if (employmentStatus) {
        query = query.where('employees.employment_status', employmentStatus);
      }

      if (salaryGrade) {
        query = query.where('employees.salary_grade', salaryGrade);
      }

      if (salaryGradeMin) {
        query = query.where('employees.salary_grade', '>=', salaryGradeMin);
      }

      if (salaryGradeMax) {
        query = query.where('employees.salary_grade', '<=', salaryGradeMax);
      }

      if (dateHiredFrom) {
        query = query.where('employees.date_hired', '>=', dateHiredFrom);
      }

      if (dateHiredTo) {
        query = query.where('employees.date_hired', '<=', dateHiredTo);
      }
      
      // Get total count (use separate builder to avoid select/aggregation conflict)
      const countBuilder = db('employees')
        .leftJoin('departments', 'employees.department_id', 'departments.id');
      if (search) {
        countBuilder.where(function() {
          this.where('employees.employee_id', 'ilike', `%${search}%`)
            .orWhere('employees.first_name', 'ilike', `%${search}%`)
            .orWhere('employees.middle_name', 'ilike', `%${search}%`)
            .orWhere('employees.last_name', 'ilike', `%${search}%`)
            .orWhere('employees.position', 'ilike', `%${search}%`)
            .orWhere('departments.name', 'ilike', `%${search}%`);
        });
      }
      if (userRole === 'Supervisor' && userId) {
        const supervisor = await db('employees').where('id', userId).first();
        if (supervisor) {
          countBuilder.where('employees.department_id', supervisor.department_id);
        }
      }
      if (department) countBuilder.where('employees.department_id', department);
      if (employmentStatus) countBuilder.where('employees.employment_status', employmentStatus);
      if (salaryGrade) countBuilder.where('employees.salary_grade', salaryGrade);
      if (salaryGradeMin) countBuilder.where('employees.salary_grade', '>=', salaryGradeMin);
      if (salaryGradeMax) countBuilder.where('employees.salary_grade', '<=', salaryGradeMax);
      if (dateHiredFrom) countBuilder.where('employees.date_hired', '>=', dateHiredFrom);
      if (dateHiredTo) countBuilder.where('employees.date_hired', '<=', dateHiredTo);

      const { count } = await countBuilder.countDistinct('employees.id as count').first();
      const total = parseInt(count);
      
      // Get paginated results
      const employees = await query
        .orderBy('employees.employee_id', 'asc')
        .limit(perPage)
        .offset(offset);
      
      return {
        employees: employees.map(emp => ({
          id: emp.id,
          employeeId: emp.employee_id,
          fullName: `${emp.first_name} ${emp.middle_name ? emp.middle_name + ' ' : ''}${emp.last_name}${emp.suffix ? ' ' + emp.suffix : ''}`,
          firstName: emp.first_name,
          middleName: emp.middle_name,
          lastName: emp.last_name,
          suffix: emp.suffix,
          position: emp.position,
          employmentStatus: emp.employment_status,
          status: emp.status,
          salaryGrade: emp.salary_grade,
          departmentName: emp.department_name,
          dateHired: emp.date_hired,
          dateRegularized: emp.date_regularized
        })),
        pagination: {
          page,
          perPage,
          total,
          totalPages: Math.ceil(total / perPage)
        }
      };
    } catch (error) {
      logger.error(`Get employees error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Get employee by ID
   * @param {number} id - Employee ID
   * @returns {Promise<Object>}
   */
  async getEmployeeById(id) {
    try {
      const employee = await db('employees')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .where('employees.id', id)
        .select(
          'employees.*',
          'departments.name as department_name'
        )
        .first();

      if (!employee) {
        throw new Error('Employee not found');
      }

      return this._formatEmployee(employee);
    } catch (error) {
      logger.error(`Get employee by ID error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Get employee by employee_id (employee number)
   * @param {string} employeeId - Employee ID (employee number)
   * @returns {Promise<Object>}
   */
  async getEmployeeByEmployeeId(employeeId) {
    try {
      const employee = await db('employees')
        .leftJoin('departments', 'employees.department_id', 'departments.id')
        .where('employees.employee_id', employeeId)
        .select(
          'employees.*',
          'departments.name as department_name'
        )
        .first();

      if (!employee) {
        throw new Error('Employee not found');
      }

      return this._formatEmployee(employee);
    } catch (error) {
      logger.error(`Get employee by employee_id error: ${error.message}`);
      throw error;
    }
  }

  /**
   * Format employee data for response
   * @param {Object} employee - Raw employee data from database
   * @returns {Object} Formatted employee data
   * @private
   */
  _formatEmployee(employee) {
    return {
      id: employee.id,
      employee_id: employee.employee_id,
      first_name: employee.first_name,
      middle_name: employee.middle_name,
      last_name: employee.last_name,
      suffix: employee.suffix,
      date_of_birth: employee.date_of_birth,
      gender: employee.gender,
      civil_status: employee.civil_status,
      position: employee.position,
      salary_grade: employee.salary_grade,
      department_id: employee.department_id,
      department_name: employee.department_name,
      employment_status: employee.employment_status,
      date_hired: employee.date_hired,
      date_regularized: employee.date_regularized,
      email: employee.email,
      mobile_number: employee.mobile_number,
      address_street: employee.address_street,
      address_barangay: employee.address_barangay,
      address_city: employee.address_city,
      address_province: employee.address_province,
      address_postal_code: employee.address_postal_code,
      status: employee.status,
      created_at: employee.created_at,
      updated_at: employee.updated_at
    };
  }
  
  /**
   * Generate next employee ID
   * @returns {Promise<string>}
   */
  async generateEmployeeId() {
    const year = new Date().getFullYear();
    const prefix = year.toString();
    
    // Get last employee ID for this year
    const lastEmployee = await db('employees')
      .where('employee_id', 'like', `${prefix}-%`)
      .orderBy('employee_id', 'desc')
      .first();
    
    let sequence = 1;
    if (lastEmployee) {
      const lastSequence = parseInt(lastEmployee.employee_id.split('-')[1]);
      sequence = lastSequence + 1;
    }
    
    return `${prefix}-${sequence.toString().padStart(4, '0')}`;
  }
  
  /**
   * Create new employee
   * @param {Object} employeeData - Employee data
   * @param {number} createdBy - ID of user creating employee
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createEmployee(employeeData, createdBy, ipAddress, userAgent) {
    try {
      // Generate employee ID if not provided
      let employeeId = employeeData.employeeId;
      if (!employeeId) {
        employeeId = await this.generateEmployeeId();
      }
      
      // Check if employee ID is unique
      const existing = await db('employees')
        .where({ employee_id: employeeId })
        .first();
      
      if (existing) {
        throw new Error('Employee ID already exists');
      }
      
      // Validate date hired
      if (new Date(employeeData.dateHired) > new Date()) {
        throw new Error('Date hired cannot be in the future');
      }
      
      // Create employee
      const [employee] = await db('employees').insert({
        employee_id: employeeId,
        first_name: employeeData.firstName,
        middle_name: employeeData.middleName || null,
        last_name: employeeData.lastName,
        suffix: employeeData.suffix || null,
        date_of_birth: employeeData.dateOfBirth,
        gender: employeeData.gender,
        civil_status: employeeData.civilStatus,
        position: employeeData.position,
        salary_grade: employeeData.salaryGrade,
        department_id: employeeData.departmentId,
        employment_status: employeeData.employmentStatus,
        date_hired: employeeData.dateHired,
        date_regularized: employeeData.dateRegularized || null,
        email: employeeData.email || null,
        mobile_number: employeeData.mobileNumber || null,
        street: employeeData.street || null,
        barangay: employeeData.barangay || null,
        city: employeeData.city || null,
        province: employeeData.province || null,
        postal_code: employeeData.postalCode || null,
        created_by: createdBy,
        updated_by: createdBy
      }).returning('*');
      
      // Log audit
      await auditLogService.logCreate(
        createdBy,
        'Employee Management',
        'employee',
        employee.id,
        { employee_id: employee.employee_id, name: `${employee.first_name} ${employee.last_name}` },
        ipAddress,
        userAgent
      );
      
      logger.info(`Employee ${employee.employee_id} created by user ${createdBy}`);
      
      return await this.getEmployeeById(employee.id);
    } catch (error) {
      logger.error(`Create employee error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Bulk import employees
   * @param {Array} employeesData - Array of employee data
   * @param {number} importedBy - ID of user importing
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async bulkImportEmployees(employeesData, importedBy, ipAddress, userAgent) {
    const results = {
      total: employeesData.length,
      successful: 0,
      failed: 0,
      errors: []
    };

    const bcrypt = require('bcrypt');
    const defaultPassword = 'Welcome2024!';
    const password_hash = await bcrypt.hash(defaultPassword, 10);

    for (let i = 0; i < employeesData.length; i++) {
      const empData = employeesData[i];
      try {
        // Create employee
        const [employee] = await db('employees').insert({
          employee_id: empData.employeeId,
          first_name: empData.firstName,
          middle_name: empData.middleName || null,
          last_name: empData.lastName,
          suffix: empData.suffix || null,
          date_of_birth: empData.dateOfBirth,
          gender: empData.gender,
          civil_status: empData.civilStatus,
          position: empData.position,
          salary_grade: empData.salaryGrade,
          department_id: empData.departmentId,
          employment_status: empData.employmentStatus,
          date_hired: empData.dateHired,
          date_regularized: empData.dateRegularized || null,
          email: empData.email || null,
          mobile_number: empData.mobileNumber || null,
          street: empData.street || null,
          barangay: empData.barangay || null,
          city: empData.city || null,
          province: empData.province || null,
          postal_code: empData.postalCode || null,
          created_by: importedBy,
          updated_by: importedBy
        }).returning('*');

        // Create user account with Employee role
        const username = empData.employeeId.toLowerCase().replace(/[^a-z0-9]/g, '');
        const [user] = await db('users').insert({
          username,
          password_hash,
          employee_id: employee.id,
          status: 'active',
          must_change_password: true,
          created_by: importedBy,
          updated_by: importedBy
        }).returning('*');

        // Assign Employee role (role_id = 1)
        await db('user_roles').insert({
          user_id: user.id,
          role_id: 1,
          assigned_by: importedBy
        });

        results.successful++;
      } catch (error) {
        results.failed++;
        results.errors.push({
          row: i + 1,
          employeeId: empData.employeeId,
          error: error.message
        });
      }
    }

    // Log audit
    await auditLogService.log({
      user_id: importedBy,
      action: 'BULK_IMPORT_EMPLOYEES',
      module: 'Employee Management',
      details: results,
      ip_address: ipAddress,
      user_agent: userAgent
    });

    logger.info(`Bulk import completed: ${results.successful} successful, ${results.failed} failed`);

    return results;
  }

  /**
   * Update employee
   * @param {number} id - Employee ID
   * @param {Object} employeeData - Employee data
   * @param {number} updatedBy - ID of user updating employee
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async updateEmployee(id, employeeData, updatedBy, ipAddress, userAgent) {
    try {
      const employee = await db('employees')
        .where({ id })
        .first();
      
      if (!employee) {
        throw new Error('Employee not found');
      }
      
      // Check for employment status change
      if (employeeData.employmentStatus && employeeData.employmentStatus !== employee.employment_status) {
        await auditLogService.log({
          user_id: updatedBy,
          action: 'EMPLOYMENT_STATUS_CHANGE',
          module: 'Employee Management',
          entity_type: 'employee',
          entity_id: id,
          details: {
            old_status: employee.employment_status,
            new_status: employeeData.employmentStatus
          },
          ip_address: ipAddress,
          user_agent: userAgent
        });
      }
      
      // Update employee
      await db('employees')
        .where({ id })
        .update({
          first_name: employeeData.firstName || employee.first_name,
          middle_name: employeeData.middleName !== undefined ? employeeData.middleName : employee.middle_name,
          last_name: employeeData.lastName || employee.last_name,
          suffix: employeeData.suffix !== undefined ? employeeData.suffix : employee.suffix,
          date_of_birth: employeeData.dateOfBirth || employee.date_of_birth,
          gender: employeeData.gender || employee.gender,
          civil_status: employeeData.civilStatus || employee.civil_status,
          position: employeeData.position || employee.position,
          salary_grade: employeeData.salaryGrade || employee.salary_grade,
          department_id: employeeData.departmentId || employee.department_id,
          employment_status: employeeData.employmentStatus || employee.employment_status,
          date_hired: employeeData.dateHired || employee.date_hired,
          date_regularized: employeeData.dateRegularized !== undefined ? employeeData.dateRegularized : employee.date_regularized,
          email: employeeData.email !== undefined ? employeeData.email : employee.email,
          mobile_number: employeeData.mobileNumber !== undefined ? employeeData.mobileNumber : employee.mobile_number,
          street: employeeData.street !== undefined ? employeeData.street : employee.street,
          barangay: employeeData.barangay !== undefined ? employeeData.barangay : employee.barangay,
          city: employeeData.city !== undefined ? employeeData.city : employee.city,
          province: employeeData.province !== undefined ? employeeData.province : employee.province,
          postal_code: employeeData.postalCode !== undefined ? employeeData.postalCode : employee.postal_code,
          updated_by: updatedBy,
          updated_at: db.fn.now()
        });
      
      // Log audit
      await auditLogService.logUpdate(
        updatedBy,
        'Employee Management',
        'employee',
        id,
        employeeData,
        ipAddress,
        userAgent
      );
      
      logger.info(`Employee ${id} updated by user ${updatedBy}`);
      
      return await this.getEmployeeById(id);
    } catch (error) {
      logger.error(`Update employee error: ${error.message}`);
      throw error;
    }
  }
}

module.exports = new EmployeeService();

