/**
 * Department Service
 * Handles department management operations
 */

const db = require('../config/database');
const logger = require('../config/logger');
const auditLogService = require('./auditLogService');

class DepartmentService {
  /**
   * Get all departments with hierarchy
   * @returns {Promise<Array>}
   */
  async getDepartments() {
    try {
      const departments = await db('departments')
        .leftJoin('employees as dept_head', 'departments.dept_head_id', 'dept_head.id')

        .select(
          'departments.id',
          'departments.name',
          'departments.parent_id',
          'departments.dept_head_id',
          db.raw(`CONCAT(dept_head.first_name, ' ', dept_head.last_name) as dept_head_name`),
          'departments.created_at',
          'departments.updated_at'
        )
        .orderBy('departments.name', 'asc');
      
      // Get employee count for each department
      const departmentsWithCount = await Promise.all(
        departments.map(async (dept) => {
          const [{ count }] = await db('employees')
            .where({ department_id: dept.id })
            .count('* as count');
          
          return {
            ...dept,
            employee_count: parseInt(count)
          };
        })
      );
      
      return this.buildDepartmentTree(departmentsWithCount);
    } catch (error) {
      logger.error(`Get departments error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Build department tree from flat list
   * @param {Array} departments - Flat list of departments
   * @param {number|null} parentId - Parent department ID
   * @returns {Array}
   */
  buildDepartmentTree(departments, parentId = null) {
    return departments
      .filter(dept => dept.parent_id === parentId)
      .map(dept => ({
        ...dept,
        children: this.buildDepartmentTree(departments, dept.id)
      }));
  }
  
  /**
   * Get department by ID
   * @param {number} id - Department ID
   * @returns {Promise<Object>}
   */
  async getDepartmentById(id) {
    try {
      const department = await db('departments')
        .leftJoin('employees as dept_head', 'departments.dept_head_id', 'dept_head.id')
        .where('departments.id', id)

        .select(
          'departments.id',
          'departments.name',
          'departments.parent_id',
          'departments.dept_head_id',
          db.raw(`CONCAT(dept_head.first_name, ' ', dept_head.last_name) as dept_head_name`),
          'departments.created_at',
          'departments.updated_at'
        )
        .first();
      
      if (!department) {
        throw new Error('Department not found');
      }
      
      // Get employee count
      const [{ count }] = await db('employees')
        .where({ department_id: id })
        .count('* as count');
      
      department.employee_count = parseInt(count);
      
      return department;
    } catch (error) {
      logger.error(`Get department by ID error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Create new department
   * @param {Object} departmentData - Department data
   * @param {number} createdBy - ID of user creating department
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async createDepartment(departmentData, createdBy, ipAddress, userAgent) {
    try {
      // Check if name is unique within parent
      const existing = await db('departments')
        .where({
          name: departmentData.name,
          parent_id: departmentData.parentId || null
        })
        .first();
      
      if (existing) {
        throw new Error('Department name must be unique within parent department');
      }
      
      // Validate department head if provided
      if (departmentData.deptHeadId) {
        const employee = await db('employees')
          .where({ id: departmentData.deptHeadId })
          .first();
        
        if (!employee) {
          throw new Error('Department head not found');
        }
      }
      
      // Create department
      const [department] = await db('departments').insert({
        name: departmentData.name,
        parent_id: departmentData.parentId || null,
        dept_head_id: departmentData.deptHeadId || null,
        created_by: createdBy,
        updated_by: createdBy
      }).returning('*');
      
      // Log audit
      await auditLogService.logCreate(
        createdBy,
        'Department Management',
        'department',
        department.id,
        { name: department.name, parent_id: department.parent_id },
        ipAddress,
        userAgent
      );
      
      logger.info(`Department ${department.name} created by user ${createdBy}`);
      
      return await this.getDepartmentById(department.id);
    } catch (error) {
      logger.error(`Create department error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Update department
   * @param {number} id - Department ID
   * @param {Object} departmentData - Department data
   * @param {number} updatedBy - ID of user updating department
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<Object>}
   */
  async updateDepartment(id, departmentData, updatedBy, ipAddress, userAgent) {
    try {
      const department = await db('departments')
        .where({ id })
        .first();
      
      if (!department) {
        throw new Error('Department not found');
      }
      
      // Check if name is unique within parent (excluding current department)
      if (departmentData.name) {
        const existing = await db('departments')
          .where({
            name: departmentData.name,
            parent_id: departmentData.parentId !== undefined ? departmentData.parentId : department.parent_id
          })
          .whereNot('id', id)
          .first();
        
        if (existing) {
          throw new Error('Department name must be unique within parent department');
        }
      }
      
      // Prevent circular references
      if (departmentData.parentId !== undefined && departmentData.parentId !== null) {
        const isCircular = await this.checkCircularReference(id, departmentData.parentId);
        if (isCircular) {
          throw new Error('Cannot create circular reference: department cannot be its own ancestor');
        }
      }
      
      // Validate department head if provided
      if (departmentData.deptHeadId) {
        const employee = await db('employees')
          .where({ id: departmentData.deptHeadId })
          .first();
        
        if (!employee) {
          throw new Error('Department head not found');
        }
      }
      
      // Update department
      await db('departments')
        .where({ id })
        .update({
          name: departmentData.name || department.name,
          parent_id: departmentData.parentId !== undefined ? departmentData.parentId : department.parent_id,
          dept_head_id: departmentData.deptHeadId !== undefined ? departmentData.deptHeadId : department.dept_head_id,
          updated_by: updatedBy,
          updated_at: db.fn.now()
        });
      
      // Log audit
      await auditLogService.logUpdate(
        updatedBy,
        'Department Management',
        'department',
        id,
        departmentData,
        ipAddress,
        userAgent
      );
      
      logger.info(`Department ${id} updated by user ${updatedBy}`);
      
      return await this.getDepartmentById(id);
    } catch (error) {
      logger.error(`Update department error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Delete department (soft delete)
   * @param {number} id - Department ID
   * @param {number} deletedBy - ID of user deleting department
   * @param {string} ipAddress - IP address
   * @param {string} userAgent - User agent
   * @returns {Promise<boolean>}
   */
  async deleteDepartment(id, deletedBy, ipAddress, userAgent) {
    try {
      const department = await db('departments')
        .where({ id })
        .first();
      
      if (!department) {
        throw new Error('Department not found');
      }
      
      // Check if department has employees
      const [{ count }] = await db('employees')
        .where({ department_id: id })
        .count('* as count');
      
      if (parseInt(count) > 0) {
        throw new Error('Cannot delete department with assigned employees. Reassign employees first.');
      }
      
      // Soft delete
      // Hard delete since schema has no deleted_at
      await db('departments')
        .where({ id })
        .delete();
      
      // Log audit
      await auditLogService.logDelete(
        deletedBy,
        'Department Management',
        'department',
        id,
        { name: department.name },
        ipAddress,
        userAgent
      );
      
      logger.info(`Department ${id} deleted by user ${deletedBy}`);
      
      return true;
    } catch (error) {
      logger.error(`Delete department error: ${error.message}`);
      throw error;
    }
  }
  
  /**
   * Check for circular reference in department hierarchy
   * @param {number} deptId - Department ID
   * @param {number} newParentId - New parent ID
   * @returns {Promise<boolean>}
   */
  async checkCircularReference(deptId, newParentId) {
    if (deptId === newParentId) {
      return true;
    }
    
    let currentParentId = newParentId;
    
    while (currentParentId !== null) {
      if (currentParentId === deptId) {
        return true;
      }
      
      const parent = await db('departments')
        .where({ id: currentParentId })
        .first();
      
      if (!parent) {
        break;
      }
      
      currentParentId = parent.parent_id;
    }
    
    return false;
  }
}

module.exports = new DepartmentService();

