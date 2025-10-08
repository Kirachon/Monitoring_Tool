/**
 * Authentication Store
 * Manages authentication state and actions
 */

import { defineStore } from 'pinia'
import axios from 'axios'
import api from '../services/api'

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    user: JSON.parse(localStorage.getItem('user') || 'null')
  }),
  
  getters: {
    /**
     * Check if user is authenticated
     */
    isAuthenticated: (state) => !!state.token,
    
    /**
     * Check if user has specific role
     * @param {string} role - Role name
     */
    hasRole: (state) => (role) => {
      return state.user?.roles?.includes(role) || false
    },
    
    /**
     * Check if user has specific permission
     * @param {string} permission - Permission name
     */
    hasPermission: (state) => (permission) => {
      if (state.user?.username === 'admin') return true
      return state.user?.permissions?.includes(permission) || false
    },
    
    /**
     * Check if user has any of the specified roles
     * @param {Array<string>} roles - Array of role names
     */
    hasAnyRole: (state) => (roles) => {
      if (!state.user?.roles) return false
      return roles.some(role => state.user.roles.includes(role))
    },
    
    /**
     * Check if user has any of the specified permissions
     * @param {Array<string>} permissions - Array of permission names
     */
    hasAnyPermission: (state) => (permissions) => {
      if (state.user?.username === 'admin') return true
      if (!state.user?.permissions) return false
      return permissions.some(permission => state.user.permissions.includes(permission))
    },
    
    /**
     * Get user's full name
     */
    fullName: (state) => {
      return state.user?.fullName || state.user?.username || 'User'
    },
    
    /**
     * Get user's roles as comma-separated string
     */
    rolesString: (state) => {
      return state.user?.roles?.join(', ') || 'No roles'
    }
  },
  
  actions: {
    /**
     * Login user
     * @param {string} username - Username
     * @param {string} password - Password
     * @param {boolean} rememberMe - Remember me flag
     */
    async login(username, password, rememberMe = false) {
      try {
        const response = await api.post('/auth/login', {
          username,
          password,
          rememberMe
        })
        
        this.token = response.data.data.token
        this.user = response.data.data.user
        
        // Store in localStorage
        localStorage.setItem('token', this.token)
        localStorage.setItem('user', JSON.stringify(this.user))
        
        // Set default authorization header for all future requests
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
        
        return response.data
      } catch (error) {
        // Clear any existing auth data on login failure
        this.clearAuth()
        throw error
      }
    },
    
    /**
     * Logout user
     */
    async logout() {
      try {
        // Call logout endpoint if token exists
        if (this.token) {
          await api.post('/auth/logout')
        }
      } catch (error) {
        console.error('Logout error:', error)
        // Continue with local logout even if API call fails
      } finally {
        this.clearAuth()
      }
    },
    
    /**
     * Fetch current user information
     */
    async fetchCurrentUser() {
      try {
        const response = await api.get('/auth/me')
        this.user = response.data.data
        localStorage.setItem('user', JSON.stringify(this.user))
        return response.data
      } catch (error) {
        // If fetch fails, clear auth (token might be invalid)
        this.clearAuth()
        throw error
      }
    },
    
    /**
     * Verify token validity
     */
    async verifyToken() {
      try {
        const response = await api.get('/auth/verify')
        return response.data.data.valid
      } catch (error) {
        this.clearAuth()
        return false
      }
    },
    
    /**
     * Clear authentication data
     */
    clearAuth() {
      this.token = null
      this.user = null
      
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      
      delete axios.defaults.headers.common['Authorization']
    },
    
    /**
     * Initialize auth from localStorage
     * Call this on app startup
     */
    initAuth() {
      if (this.token) {
        axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`
      }
    }
  }
})

