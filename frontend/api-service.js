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

// // API Service for LinkedIn Sales Automation Tool
// // This file handles all communication between frontend and backend

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

//     async getCampaign(campaignId) {
//         const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
//             headers: this.getHeaders()
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

//     async updateProspect(prospectId, prospectData) {
//         const response = await fetch(`${API_BASE_URL}/prospects/${prospectId}`, {
//             method: 'PUT',
//             headers: this.getHeaders(),
//             body: JSON.stringify(prospectData)
//         });
//         return this.handleResponse(response);
//     }

//     // Messages API calls
//     async getMessages(prospectId) {
//         const response = await fetch(`${API_BASE_URL}/messages?prospect_id=${prospectId}`, {
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

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
//     async analyzeProfile(profileData) {
//         const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(profileData)
//         });
//         return this.handleResponse(response);
//     }

//     async generateMessage(messageRequest) {
//         const response = await fetch(`${API_BASE_URL}/ai/generate-message`, {
//             method: 'POST',
//             headers: this.getHeaders(),
//             body: JSON.stringify(messageRequest)
//         });
//         return this.handleResponse(response);
//     }

//     async optimizeCampaign(campaignId) {
//         const response = await fetch(`${API_BASE_URL}/ai/optimize-campaign/${campaignId}`, {
//             method: 'POST',
//             headers: this.getHeaders()
//         });
//         return this.handleResponse(response);
//     }

//     async getAIUsageStats() {
//         const response = await fetch(`${API_BASE_URL}/ai/usage-stats`, {
//             headers: this.getHeaders()
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
// window.apiService = apiService; // Make it globally available














// API Service for SalesForge AI - Backend Integration
const API_BASE_URL = 'http://localhost:5000/api';

class ApiService {
    constructor() {
        this.token = localStorage.getItem('auth_token');
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

    // Helper method to handle API responses
    async handleResponse(response) {
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            throw new Error(errorData.message || 'API request failed');
        }
        return response.json();
    }

    // Authentication API calls
    async login(email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        
        const data = await this.handleResponse(response);
        if (data.success && data.data.token) {
            this.token = data.data.token;
            localStorage.setItem('auth_token', this.token);
        }
        return data;
    }

    async register(name, email, password) {
        const response = await fetch(`${API_BASE_URL}/auth/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, email, password })
        });
        
        const data = await this.handleResponse(response);
        if (data.success && data.data.token) {
            this.token = data.data.token;
            localStorage.setItem('auth_token', this.token);
        }
        return data;
    }

    async getUserProfile() {
        const response = await fetch(`${API_BASE_URL}/auth/profile`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    logout() {
        this.token = null;
        localStorage.removeItem('auth_token');
    }

    // Campaign API calls
    async getCampaigns(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/campaigns?${queryParams}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async createCampaign(campaignData) {
        const response = await fetch(`${API_BASE_URL}/campaigns`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(campaignData)
        });
        return this.handleResponse(response);
    }

    async updateCampaign(campaignId, campaignData) {
        const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}`, {
            method: 'PUT',
            headers: this.getHeaders(),
            body: JSON.stringify(campaignData)
        });
        return this.handleResponse(response);
    }

    async startCampaign(campaignId) {
        const response = await fetch(`${API_BASE_URL}/campaigns/${campaignId}/start`, {
            method: 'POST',
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Prospects API calls
    async getProspects(filters = {}) {
        const queryParams = new URLSearchParams(filters);
        const response = await fetch(`${API_BASE_URL}/prospects?${queryParams}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async addProspect(prospectData) {
        const response = await fetch(`${API_BASE_URL}/prospects`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(prospectData)
        });
        return this.handleResponse(response);
    }

    // Messages API calls
    async sendMessage(messageData) {
        const response = await fetch(`${API_BASE_URL}/messages/send`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(messageData)
        });
        return this.handleResponse(response);
    }

    async getMessageTemplates() {
        const response = await fetch(`${API_BASE_URL}/messages/templates`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // AI API calls
    async generateMessage(messageRequest) {
        const response = await fetch(`${API_BASE_URL}/ai/generate-message`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(messageRequest)
        });
        return this.handleResponse(response);
    }

    async analyzeProfile(profileData) {
        const response = await fetch(`${API_BASE_URL}/ai/analyze-profile`, {
            method: 'POST',
            headers: this.getHeaders(),
            body: JSON.stringify(profileData)
        });
        return this.handleResponse(response);
    }

    // Analytics API calls
    async getDashboardAnalytics() {
        const response = await fetch(`${API_BASE_URL}/analytics/dashboard`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    async getCampaignAnalytics(campaignId) {
        const response = await fetch(`${API_BASE_URL}/analytics/campaign/${campaignId}`, {
            headers: this.getHeaders()
        });
        return this.handleResponse(response);
    }

    // Health check
    async healthCheck() {
        const response = await fetch('http://localhost:5000/health');
        return this.handleResponse(response);
    }
}

// Export singleton instance
const apiService = new ApiService();
window.apiService = apiService;