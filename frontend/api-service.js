// // // // API Service for LinkedIn Sales Automation Tool
// // // // This file handles all communication between frontend and backend

// // // const API_BASE_URL = 'http://localhost:5000/api';

// // // class ApiService {
// // //     constructor() {
// // //         this.token = localStorage.getItem('auth_token');
// // //     }

// // //     // Helper method to get headers with authentication
// // //     getHeaders() {
// // //         const headers = {
// // //             'Content-Type': 'application/json'
// // //         };
        
// // //         if (this.token) {
// // //             headers['Authorization'] = `Bearer ${this.token}`;
// // //         }
        
// // //         return headers;
// // //     }

// // //     // Helper method to handle API responses
// // //     async handleResponse(response) {
// // //         if (!response.ok) {
// // //             const errorData = await response.json().catch(() => ({}));
// // //             throw new Error(errorData.message || 'API request failed');
// // //         }
// // //         return response.json();
// // //     }

// // //     // Authentication API calls
// // //     async login(email, password) {
// // //         const response = await fetch(`${API_BASE_URL}/auth/login`, {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({ email, password })
// // //         });
        
// // //         const data = await this.handleResponse(response);
// // //         if (data.success && data.data.token) {
// // //             this.token = data.data.token;
// // //             localStorage.setItem('auth_token', this.token);
// // //         }
// // //         return data;
// // //     }

// // //     async register(name, email, password) {
// // //         const response = await fetch(`${API_BASE_URL}/auth/register`, {
// // //             method: 'POST',
// // //             headers: { 'Content-Type': 'application/json' },
// // //             body: JSON.stringify({ name, email, password })
// // //         });
        
// // //         const data = await this.handleResponse(response);
// // //         if (data.success && data.data.token) {
// // //             this.token = data.data.token;
// // //             localStorage.setItem('auth_token', this.token);
// // //         }
// // //         return data;
// // //     }

// // //     async getUserProfile() {
// // //         const response = await fetch(`${API_BASE_URL}/auth/profile`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     logout() {
// // //         this.token = null;
// // //         localStorage.removeItem('auth_token');
// // //     }

// // //     // Campaign API calls
// // //     async getCampaigns(filters = {}) {
// // //         const queryParams = new URLSearchParams(filters);
// // //         const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams}`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async createCampaign(campaignData) {
// // //         const response = await fetch(`${API_BASE_URL}/campaigns`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(campaignData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async getCampaign(campaignId) {
// // //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async updateCampaign(campaignId, campaignData) {
// // //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
// // //             method: 'PUT',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(campaignData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async startCampaign(campaignId) {
// // //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/start`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     // Prospects API calls
// // //     async getProspects(filters = {}) {
// // //         const queryParams = new URLSearchParams(filters);
// // //         const response = await fetch(`${API_BASE_URL}/prospects?${queryParams}`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async addProspect(prospectData) {
// // //         const response = await fetch(`${API_BASE_URL}/prospects`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(prospectData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async updateProspect(prospectId, prospectData) {
// // //         const response = await fetch(`${API_BASE_URL}/prospects/${prospectId}`, {
// // //             method: 'PUT',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(prospectData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     // Messages API calls
// // //     async getMessages(prospectId) {
// // //         const response = await fetch(`${API_BASE_URL}/messages?prospect_id=${prospectId}`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async sendMessage(messageData) {
// // //         const response = await fetch(`${API_BASE_URL}/messages/send`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(messageData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async getMessageTemplates() {
// // //         const response = await fetch(`${API_BASE_URL}/messages/templates`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     // AI API calls
// // //     async analyzeProfile(profileData) {
// // //         const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(profileData)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async generateMessage(messageRequest) {
// // //         const response = await fetch(`${API_BASE_URL}/ai/generate-message`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders(),
// // //             body: JSON.stringify(messageRequest)
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async optimizeCampaign(campaignId) {
// // //         const response = await fetch(`${API_BASE_URL}/ai/optimize-campaign/${campaignId}`, {
// // //             method: 'POST',
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async getAIUsageStats() {
// // //         const response = await fetch(`${API_BASE_URL}/ai/usage-stats`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     // Analytics API calls
// // //     async getDashboardAnalytics() {
// // //         const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     async getCampaignAnalytics(campaignId) {
// // //         const response = await fetch(`${API_BASE_URL}/analytics/campaign/${campaignId}`, {
// // //             headers: this.getHeaders()
// // //         });
// // //         return this.handleResponse(response);
// // //     }

// // //     // Health check
// // //     async healthCheck() {
// // //         const response = await fetch('http://localhost:5000/health');
// // //         return this.handleResponse(response);
// // //     }
// // // }

// // // // Export singleton instance
// // // const apiService = new ApiService();
// // // window.apiService = apiService; // Make it globally available

// // // API Service for LinkedIn Sales Automation Tool
// // // This file handles all communication between frontend and backend

// // const API_BASE_URL = 'http://localhost:5000/api';

// // class ApiService {
// //     constructor() {
// //         this.token = localStorage.getItem('auth_token');
// //     }

// //     // Helper method to get headers with authentication
// //     getHeaders() {
// //         const headers = {
// //             'Content-Type': 'application/json'
// //         };
        
// //         if (this.token) {
// //             headers['Authorization'] = `Bearer ${this.token}`;
// //         }
        
// //         return headers;
// //     }

// //     // Helper method to handle API responses
// //     async handleResponse(response) {
// //         if (!response.ok) {
// //             const errorData = await response.json().catch(() => ({}));
// //             throw new Error(errorData.message || 'API request failed');
// //         }
// //         return response.json();
// //     }

// //     // Authentication API calls
// //     async login(email, password) {
// //         const response = await fetch(`${API_BASE_URL}/auth/login`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ email, password })
// //         });
        
// //         const data = await this.handleResponse(response);
// //         if (data.success && data.data.token) {
// //             this.token = data.data.token;
// //             localStorage.setItem('auth_token', this.token);
// //         }
// //         return data;
// //     }

// //     async register(name, email, password) {
// //         const response = await fetch(`${API_BASE_URL}/auth/register`, {
// //             method: 'POST',
// //             headers: { 'Content-Type': 'application/json' },
// //             body: JSON.stringify({ name, email, password })
// //         });
        
// //         const data = await this.handleResponse(response);
// //         if (data.success && data.data.token) {
// //             this.token = data.data.token;
// //             localStorage.setItem('auth_token', this.token);
// //         }
// //         return data;
// //     }

// //     async getUserProfile() {
// //         const response = await fetch(`${API_BASE_URL}/auth/profile`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     logout() {
// //         this.token = null;
// //         localStorage.removeItem('auth_token');
// //     }

// //     // Campaign API calls
// //     async getCampaigns(filters = {}) {
// //         const queryParams = new URLSearchParams(filters);
// //         const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams}`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async createCampaign(campaignData) {
// //         const response = await fetch(`${API_BASE_URL}/campaigns`, {
// //             method: 'POST',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(campaignData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async getCampaign(campaignId) {
// //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async updateCampaign(campaignId, campaignData) {
// //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
// //             method: 'PUT',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(campaignData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async startCampaign(campaignId) {
// //         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/start`, {
// //             method: 'POST',
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     // Prospects API calls
// //     async getProspects(filters = {}) {
// //         const queryParams = new URLSearchParams(filters);
// //         const response = await fetch(`${API_BASE_URL}/prospects?${queryParams}`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async addProspect(prospectData) {
// //         const response = await fetch(`${API_BASE_URL}/prospects`, {
// //             method: 'POST',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(prospectData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async updateProspect(prospectId, prospectData) {
// //         const response = await fetch(`${API_BASE_URL}/prospects/${prospectId}`, {
// //             method: 'PUT',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(prospectData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     // Messages API calls
// //     async getMessages(prospectId) {
// //         const response = await fetch(`${API_BASE_URL}/messages?prospect_id=${prospectId}`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async sendMessage(messageData) {
// //         const response = await fetch(`${API_BASE_URL}/messages/send`, {
// //             method: 'POST',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(messageData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async getMessageTemplates() {
// //         const response = await fetch(`${API_BASE_URL}/messages/templates`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     // AI API calls
// //     async analyzeProfile(profileData) {
// //         const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
// //             method: 'POST',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(profileData)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async generateMessage(messageRequest) {
// //         const response = await fetch(`${API_BASE_URL}/ai/generate-message`, {
// //             method: 'POST',
// //             headers: this.getHeaders(),
// //             body: JSON.stringify(messageRequest)
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async optimizeCampaign(campaignId) {
// //         const response = await fetch(`${API_BASE_URL}/ai/optimize-campaign/${campaignId}`, {
// //             method: 'POST',
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async getAIUsageStats() {
// //         const response = await fetch(`${API_BASE_URL}/ai/usage-stats`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     // Analytics API calls
// //     async getDashboardAnalytics() {
// //         const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     async getCampaignAnalytics(campaignId) {
// //         const response = await fetch(`${API_BASE_URL}/analytics/campaign/${campaignId}`, {
// //             headers: this.getHeaders()
// //         });
// //         return this.handleResponse(response);
// //     }

// //     // Health check
// //     async healthCheck() {
// //         const response = await fetch('http://localhost:5000/health');
// //         return this.handleResponse(response);
// //     }
// // }

// // // Export singleton instance
// // const apiService = new ApiService();
// // window.apiService = apiService; // Make it globally available














// // API Service for SalesForge AI - Backend Integration
// const API_BASE_URL = 'http://localhost:5000/api';

// class ApiService {
//     constructor() {
//         this.token = localStorage.getItem('auth_token');
//     }

//     // Helper method to get headers with authentication
//     getHeaders() {
//         const headers = {
//             'Content-Type': 'application/json'
//         };
        
//         if (this.token) {
//             headers['Authorization'] = `Bearer ${this.token}`;
//         }
        
//         return headers;
//     }

//     // Helper method to handle API responses
//     async handleResponse(response) {
//         if (!response.ok) {
//             const errorData = await response.json().catch(() => ({}));
//             throw new Error(errorData.message || 'API request failed');
//         }
//         return response.json();
//     }

//     // Authentication API calls
//     async login(email, password) {
//         const response = await fetch(`${API_BASE_URL}/auth/login`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ email, password })
//         });
        
//         const data = await this.handleResponse(response);
//         if (data.success && data.data.token) {
//             this.token = data.data.token;
//             localStorage.setItem('auth_token', this.token);
//         }
//         return data;
//     }

//     async register(name, email, password) {
//         const response = await fetch(`${API_BASE_URL}/auth/register`, {
//             method: 'POST',
//             headers: { 'Content-Type': 'application/json' },
//             body: JSON.stringify({ name, email, password })
//         });
        
//         const data = await this.handleResponse(response);
//         if (data.success && data.data.token) {
//             this.token = data.data.token;
//             localStorage.setItem('auth_token', this.token);
//         }
//         return data;
//     }

//     async getUserProfile() {
//         const response = await fetch(`${API_BASE_URL}/auth/profile`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     logout() {
//         this.token = null;
//         localStorage.removeItem('auth_token');
//     }

//     // Campaign API calls
//     async getCampaigns(filters = {}) {
//         const queryParams = new URLSearchParams(filters);
//         const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams}`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     async createCampaign(campaignData) {
//         const response = await fetch(`${API_BASE_URL}/campaigns`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(campaignData)
//         });
//         return this.handleResponse(response);
//     }

//     async updateCampaign(campaignId, campaignData) {
//         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
//             method: 'PUT',
//             headers: this.getHeaders(),
//             body: JSON.stringify(campaignData)
//         });
//         return this.handleResponse(response);
//     }

//     async startCampaign(campaignId) {
//         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/start`, {
//             method: 'POST',
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     // Prospects API calls
//     async getProspects(filters = {}) {
//         const queryParams = new URLSearchParams(filters);
//         const response = await fetch(`${API_BASE_URL}/prospects?${queryParams}`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     async addProspect(prospectData) {
//         const response = await fetch(`${API_BASE_URL}/prospects`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(prospectData)
//         });
//         return this.handleResponse(response);
//     }

//     // Messages API calls
//     async sendMessage(messageData) {
//         const response = await fetch(`${API_BASE_URL}/messages/send`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(messageData)
//         });
//         return this.handleResponse(response);
//     }

//     async getMessageTemplates() {
//         const response = await fetch(`${API_BASE_URL}/messages/templates`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     // AI API calls
//     async generateMessage(messageRequest) {
//         const response = await fetch(`${API_BASE_URL}/ai/generate-message`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(messageRequest)
//         });
//         return this.handleResponse(response);
//     }

//     async analyzeProfile(profileData) {
//         const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(profileData)
//         });
//         return this.handleResponse(response);
//     }

//     // Analytics API calls
//     async getDashboardAnalytics() {
//         const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     async getCampaignAnalytics(campaignId) {
//         const response = await fetch(`${API_BASE_URL}/analytics/campaign/${campaignId}`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     // Health check
//     async healthCheck() {
//         const response = await fetch('http://localhost:5000/health');
//         return this.handleResponse(response);
//     }
// }

// // Export singleton instance
// const apiService = new ApiService();
// window.apiService = apiService;













// Fixed API Service for SalesForge AI - LinkedIn Sales Automation Tool
// This handles all backend communication with proper error handling

class ApiService {
  constructor() {
    this.baseURL = 'http://localhost:5000/api';
    this.token = localStorage.getItem('auth_token');
    this.maxRetries = 3;
    this.retryDelay = 1000;
  }

  // Helper method to get headers with authentication
  getHeaders() {
    const headers = {
      'Content-Type': 'application/json'
    };
    
    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }
    
    return headers;
  }

  // Helper method to handle API responses with retries
  async makeRequest(url, options = {}, retries = 0) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...this.getHeaders(),
          ...options.headers
        }
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        
        // Handle token expiration
        if (response.status === 401 || response.status === 403) {
          this.logout();
          throw new Error('Session expired. Please login again.');
        }
        
        throw new Error(errorData.message || `HTTP ${response.status}: ${response.statusText}`);
      }
      
      return response.json();
    } catch (error) {
      // Retry on network errors
      if (retries < this.maxRetries && error.name === 'TypeError') {
        console.log(`Retrying request... Attempt ${retries + 1}`);
        await new Promise(resolve => setTimeout(resolve, this.retryDelay * (retries + 1)));
        return this.makeRequest(url, options, retries + 1);
      }
      
      throw error;
    }
  }

  // Test backend connection
  async testConnection() {
    try {
      const response = await this.makeRequest('http://localhost:5000/health');
      return response;
    } catch (error) {
      console.error('Backend connection failed:', error.message);
      return null;
    }
  }

  // Authentication methods
  async login(email, password) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/auth/login`, {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });
      
      if (data.success && data.data.token) {
        this.token = data.data.token;
        localStorage.setItem('auth_token', this.token);
      }
      
      return data;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(name, email, password) {
    try {
      const data = await this.makeRequest(`${this.baseURL}/auth/register`, {
        method: 'POST',
        body: JSON.stringify({ name, email, password })
      });
      
      if (data.success && data.data.token) {
        this.token = data.data.token;
        localStorage.setItem('auth_token', this.token);
      }
      
      return data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async getUserProfile() {
    try {
      return await this.makeRequest(`${this.baseURL}/auth/profile`);
    } catch (error) {
      console.error('Get profile error:', error);
      throw error;
    }
  }

  logout() {
    this.token = null;
    localStorage.removeItem('auth_token');
  }

  // Campaign methods
  async getCampaigns(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      return await this.makeRequest(`${this.baseURL}/campaigns?${queryParams}`);
    } catch (error) {
      console.error('Get campaigns error:', error);
      throw error;
    }
  }

  async createCampaign(campaignData) {
    try {
      return await this.makeRequest(`${this.baseURL}/campaigns`, {
        method: 'POST',
        body: JSON.stringify(campaignData)
      });
    } catch (error) {
      console.error('Create campaign error:', error);
      throw error;
    }
  }

  async updateCampaign(campaignId, campaignData) {
    try {
      return await this.makeRequest(`${this.baseURL}/campaigns/${campaignId}`, {
        method: 'PUT',
        body: JSON.stringify(campaignData)
      });
    } catch (error) {
      console.error('Update campaign error:', error);
      throw error;
    }
  }

  async startCampaign(campaignId) {
    try {
      return await this.makeRequest(`${this.baseURL}/campaigns/${campaignId}/start`, {
        method: 'POST'
      });
    } catch (error) {
      console.error('Start campaign error:', error);
      throw error;
    }
  }

  // Prospect methods
  async getProspects(filters = {}) {
    try {
      const queryParams = new URLSearchParams(filters);
      return await this.makeRequest(`${this.baseURL}/prospects?${queryParams}`);
    } catch (error) {
      console.error('Get prospects error:', error);
      throw error;
    }
  }

  async addProspect(prospectData) {
    try {
      return await this.makeRequest(`${this.baseURL}/prospects`, {
        method: 'POST',
        body: JSON.stringify(prospectData)
      });
    } catch (error) {
      console.error('Add prospect error:', error);
      throw error;
    }
  }

  // AI methods
  async analyzeProfile(profileData) {
    try {
      return await this.makeRequest(`${this.baseURL}/ai/analyze-profile`, {
        method: 'POST',
        body: JSON.stringify(profileData)
      });
    } catch (error) {
      console.error('Analyze profile error:', error);
      throw error;
    }
  }

  async generateMessage(messageRequest) {
    try {
      return await this.makeRequest(`${this.baseURL}/ai/generate-message`, {
        method: 'POST',
        body: JSON.stringify(messageRequest)
      });
    } catch (error) {
      console.error('Generate message error:', error);
      throw error;
    }
  }

  // Message methods
  async sendMessage(messageData) {
    try {
      return await this.makeRequest(`${this.baseURL}/messages/send`, {
        method: 'POST',
        body: JSON.stringify(messageData)
      });
    } catch (error) {
      console.error('Send message error:', error);
      throw error;
    }
  }

  async getMessageTemplates() {
    try {
      return await this.makeRequest(`${this.baseURL}/messages/templates`);
    } catch (error) {
      console.error('Get templates error:', error);
      throw error;
    }
  }

  // Analytics methods
  async getDashboardAnalytics() {
    try {
      return await this.makeRequest(`${this.baseURL}/analytics/dashboard`);
    } catch (error) {
      console.error('Get analytics error:', error);
      throw error;
    }
  }

  // Utility methods
  isAuthenticated() {
    return !!this.token;
  }

  getToken() {
    return this.token;
  }
}

// Create singleton instance
const apiService = new ApiService();

// Make it globally available
window.apiService = apiService;

// Auto-test connection when page loads
document.addEventListener('DOMContentLoaded', async () => {
  console.log('🔗 Testing backend connection...');
  
  try {
    const health = await apiService.testConnection();
    if (health) {
      console.log('✅ Backend connected:', health.status);
      
      // Show connection status in UI
      const statusEl = document.getElementById('connection-status');
      if (statusEl) {
        statusEl.textContent = 'Backend Connected';
        statusEl.className = 'status connected';
      }
    } else {
      throw new Error('Health check failed');
    }
  } catch (error) {
    console.error('❌ Backend connection failed:', error.message);
    
    // Show connection error in UI
    const statusEl = document.getElementById('connection-status');
    if (statusEl) {
      statusEl.textContent = 'Backend Disconnected';
      statusEl.className = 'status disconnected';
    }
    
    // Show user-friendly error
    if (typeof showToast === 'function') {
      showToast('Unable to connect to backend. Please ensure the server is running on port 5000.', 'error');
    }
  }
});

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ApiService;
}