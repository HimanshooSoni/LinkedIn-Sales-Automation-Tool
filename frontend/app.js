// SalesForge AI - LinkedIn Sales Automation Tool
// COMPLETE WORKING VERSION WITH ALL PDF FEATURES

// Application state
let currentUser = null;
let currentPage = 'dashboard';
let selectedProspect = null;
let selectedProspects = [];
let campaignWizardStep = 1;
let performanceChart = null;
let responseChart = null;
let sourceChart = null;
let campaignData = {};

// Enhanced Application Data with full functionality
const appData = {
    campaigns: [
        {
            id: 1,
            name: "Enterprise SaaS Q4",
            productService: "Enterprise-grade AI development platform for scaling engineering teams",
            targetIndustry: "SaaS",
            targetRoles: ["VP Engineering", "CTO", "Head of Product"],
            companySize: "200-1000",
            region: "North America",
            brandVoice: "professional",
            outreachGoals: ["demo", "call"],
            status: "active",
            created: "2025-08-20T10:00:00Z",
            prospects: 45,
            contacted: 32,
            responded: 12,
            responseRate: 37.5,
            dailyLimit: 25,
            weeklyLimit: 120,
            color: "#0ea5e9",
            triggers: ["job_change", "hiring_post"]
        },
        {
            id: 2,
            name: "FinTech Expansion",
            productService: "Compliance-first API platform for financial services",
            targetIndustry: "FinTech",
            targetRoles: ["CTO", "Head of Innovation", "VP Technology"],
            companySize: "500+",
            region: "Europe",
            brandVoice: "consultative",
            outreachGoals: ["demo", "partnership"],
            status: "active",
            created: "2025-08-15T14:30:00Z",
            prospects: 28,
            contacted: 25,
            responded: 8,
            responseRate: 32.0,
            dailyLimit: 20,
            weeklyLimit: 100,
            color: "#10b981",
            triggers: ["funding", "company_news"]
        },
        {
            id: 3,
            name: "Healthcare Innovation",
            productService: "HIPAA-compliant patient data analytics platform",
            targetIndustry: "Healthcare",
            targetRoles: ["CIO", "Chief Medical Officer", "VP Technology"],
            companySize: "1000+",
            region: "Global",
            brandVoice: "formal",
            outreachGoals: ["demo"],
            status: "paused",
            created: "2025-08-10T09:15:00Z",
            prospects: 18,
            contacted: 15,
            responded: 4,
            responseRate: 26.7,
            dailyLimit: 15,
            weeklyLimit: 80,
            color: "#8b5cf6",
            triggers: ["job_change"]
        }
    ],
    
    prospects: [
        {
            id: 1,
            campaignId: 1,
            name: "Alexandra Chen",
            title: "VP of Engineering",
            company: "TechFlow Systems",
            linkedinUrl: "https://linkedin.com/in/alexandrachen",
            email: "alexandra.chen@techflow.com",
            location: "San Francisco, CA",
            status: "responded",
            priority: "high",
            tags: ["decision-maker", "ai-interested", "scaling-team"],
            profileScore: 92,
            engagement: 85,
            lastContact: "2025-08-27T16:45:00Z",
            nextFollowUp: "2025-08-30T10:00:00Z",
            messagesSent: 2,
            source: "LinkedIn Search",
            analysis: {
                background: "Seasoned engineering leader with expertise in AI/ML implementations and team scaling. Recently posted about challenges in developer productivity.",
                interests: ["Machine Learning", "Engineering Leadership", "Developer Tools", "Team Productivity", "AI Integration"],
                painPoints: ["Legacy system modernization", "Developer productivity bottlenecks", "AI integration challenges", "Team scaling issues"],
                communicationStyle: "Data-driven and direct, prefers technical details and ROI metrics",
                bestApproach: "Focus on ROI metrics and technical implementation details. Mention specific use cases.",
                personalizationHooks: ["Recent post about developer productivity", "Team scaling challenges", "AI/ML background"],
                likelihood: "High",
                keyAchievements: ["Led AI transformation at previous company", "Scaled team from 5 to 50 engineers", "Implemented ML pipeline"],
                recentActivity: "Posted about developer productivity tools 3 days ago"
            }
        },
        {
            id: 2,
            campaignId: 1,
            name: "David Rodriguez",
            title: "CTO",
            company: "InnovateLabs",
            linkedinUrl: "https://linkedin.com/in/davidrodriguez",
            email: "david@innovatelabs.co",
            location: "Austin, TX",
            status: "contacted",
            priority: "medium",
            tags: ["startup-cto", "growth-focused", "tech-leader"],
            profileScore: 78,
            engagement: 65,
            lastContact: "2025-08-26T11:20:00Z",
            messagesSent: 1,
            source: "Company Website",
            analysis: {
                background: "Startup CTO focused on rapid growth and technical innovation. Strong background in scalable architecture.",
                interests: ["Startup Growth", "Technical Strategy", "Team Building", "Scalable Architecture"],
                painPoints: ["Rapid scaling challenges", "Technical debt management", "Resource constraints"],
                communicationStyle: "Enthusiastic and forward-thinking, values innovation and speed",
                bestApproach: "Emphasize speed to market and competitive advantages. Show startup success stories.",
                personalizationHooks: ["Startup environment", "Growth challenges", "Innovation focus"],
                likelihood: "Medium",
                keyAchievements: ["Built platform serving 1M+ users", "Raised Series A funding", "Tech team leadership"],
                recentActivity: "Shared article about startup scaling challenges"
            }
        },
        {
            id: 3,
            campaignId: 2,
            name: "Sophie Mueller",
            title: "Head of Innovation",
            company: "European FinBank",
            linkedinUrl: "https://linkedin.com/in/sophiemueller",
            email: "s.mueller@eurofinbank.com",
            location: "Berlin, Germany",
            status: "pending",
            priority: "high",
            tags: ["innovation-leader", "fintech-expert", "compliance-focused"],
            profileScore: 88,
            engagement: 40,
            messagesSent: 0,
            source: "Industry Event",
            analysis: {
                background: "Innovation leader specializing in financial technology and regulatory compliance. Expert in RegTech solutions.",
                interests: ["Financial Innovation", "RegTech", "Digital Transformation", "Compliance Technology"],
                painPoints: ["Regulatory compliance", "Legacy system integration", "Innovation speed vs compliance"],
                communicationStyle: "Thorough and compliance-focused, values detailed information",
                bestApproach: "Highlight regulatory benefits and risk mitigation. Provide compliance case studies.",
                personalizationHooks: ["RegTech expertise", "Compliance challenges", "Digital transformation"],
                likelihood: "High",
                keyAchievements: ["Led digital transformation initiative", "Regulatory compliance expert", "FinTech innovation"],
                recentActivity: "Attended RegTech conference last week"
            }
        },
        {
            id: 4,
            campaignId: 1,
            name: "Michael Chen",
            title: "Head of Product",
            company: "DataDriven Inc",
            linkedinUrl: "https://linkedin.com/in/michaelchen",
            email: "m.chen@datadriven.com",
            location: "Seattle, WA",
            status: "pending",
            priority: "medium",
            tags: ["product-leader", "data-focused", "b2b-saas"],
            profileScore: 73,
            engagement: 55,
            messagesSent: 0,
            source: "LinkedIn Search",
            analysis: {
                background: "Product leader with strong focus on data-driven decision making and user experience optimization.",
                interests: ["Product Strategy", "Data Analytics", "User Experience", "B2B SaaS"],
                painPoints: ["Product-engineering alignment", "Data insights", "User adoption"],
                communicationStyle: "Analytical and user-focused, prefers data-backed arguments",
                bestApproach: "Show product impact metrics and user success stories",
                personalizationHooks: ["Data-driven approach", "Product metrics", "User experience focus"],
                likelihood: "Medium",
                keyAchievements: ["Increased user adoption by 200%", "Led product redesign", "Data analytics expert"],
                recentActivity: "Published article on product metrics"
            }
        },
        {
            id: 5,
            campaignId: 2,
            name: "Emma Thompson",
            title: "Chief Technology Officer",
            company: "FinanceFlow",
            linkedinUrl: "https://linkedin.com/in/emmathompson",
            email: "emma@financeflow.com",
            location: "London, UK",
            status: "contacted",
            priority: "high",
            tags: ["c-level", "fintech-cto", "api-expert"],
            profileScore: 95,
            engagement: 78,
            lastContact: "2025-08-25T14:30:00Z",
            messagesSent: 1,
            source: "Referral",
            analysis: {
                background: "Experienced CTO in financial services with deep expertise in API architecture and financial technology.",
                interests: ["API Architecture", "Financial Technology", "System Security", "Scalable Infrastructure"],
                painPoints: ["API scalability", "Security compliance", "System integration"],
                communicationStyle: "Technical and security-focused, values robust solutions",
                bestApproach: "Emphasize security, scalability, and technical excellence",
                personalizationHooks: ["API expertise", "Security focus", "Financial technology"],
                likelihood: "High",
                keyAchievements: ["Built API serving 10M+ transactions", "Led security transformation", "FinTech innovation"],
                recentActivity: "Spoke at API security conference"
            }
        }
    ],

    sequences: [
        {
            id: 1,
            name: "SaaS CTO Follow-up Sequence",
            campaignId: 1,
            status: "active",
            steps: [
                { day: 0, type: "connection", message: "Initial connection request with personalized note" },
                { day: 3, type: "follow_up", message: "Share relevant case study" },
                { day: 7, type: "value_add", message: "Industry insights or report" },
                { day: 14, type: "meeting_request", message: "Soft ask for 15-min call" }
            ],
            activeProspects: 12,
            completionRate: 68
        },
        {
            id: 2,
            name: "FinTech Decision Maker Sequence",
            campaignId: 2,
            status: "active",
            steps: [
                { day: 0, type: "connection", message: "Compliance-focused introduction" },
                { day: 5, type: "follow_up", message: "RegTech case study" },
                { day: 12, type: "demo_offer", message: "Compliance demo invitation" }
            ],
            activeProspects: 8,
            completionRate: 75
        }
    ],

    messageTemplates: [
        {
            id: 1,
            name: "SaaS CTO Connection Request",
            type: "connection",
            brandVoice: "professional",
            template: "Hi {{name}}, I noticed your work in {{industry}} and your recent post about {{recentActivity}}. I work with {{title}}s helping them {{painPoint}}. Would love to share some insights that could be relevant for {{company}}. Worth a quick conversation?",
            tags: ["enterprise", "technical"],
            successRate: 42
        },
        {
            id: 2,
            name: "FinTech Innovation Follow-up",
            type: "follow_up",
            brandVoice: "consultative",
            template: "Following up on my previous message about {{topic}}. I came across {{relevant_news}} about {{company}} and thought this might be an interesting time to explore {{solution_benefit}}. Our platform helped {{similar_company}} achieve {{metric}}% improvement in {{outcome}}. Worth a 15-minute conversation?",
            tags: ["follow-up", "news-based"],
            successRate: 38
        },
        {
            id: 3,
            name: "Healthcare CIO Value Add",
            type: "value_add",
            brandVoice: "formal",
            template: "Hi {{name}}, I hope this finds you well. Given your focus on {{interest}}, I thought you might find this relevant: {{value_content}}. We've been working with healthcare organizations like {{company}} to {{benefit}}. Would be happy to share how {{similar_company}} achieved {{specific_result}}.",
            tags: ["healthcare", "value-add"],
            successRate: 35
        }
    ],

    // Form options
    industries: ["SaaS", "FinTech", "Healthcare", "EdTech", "E-commerce", "Manufacturing", "Consulting", "Real Estate"],
    companySizes: ["Startup", "SME", "Enterprise"],
    regions: ["India", "US", "Europe", "Global", "APAC"],
    jobRoles: ["CEO", "CTO", "VP Engineering", "Head of Product", "Head of Innovation", "Chief Technology Officer", "VP Sales", "Head of Marketing", "Head of HR", "Growth Manager"],
    brandVoices: [
        { value: "formal", label: "Formal", description: "Professional and structured" },
        { value: "friendly", label: "Friendly", description: "Warm and approachable" },
        { value: "enthusiastic", label: "Enthusiastic", description: "Energetic and exciting" }
    ],
    outreachGoals: [
        { value: "demo", label: "Book Demo", icon: "🎯" },
        { value: "call", label: "Schedule Call", icon: "📞" },
        { value: "hire", label: "Hiring", icon: "👥" },
        { value: "partnership", label: "Partnership", icon: "🤝" }
    ],
    triggers: [
        { value: "job_change", label: "Job Changes", icon: "🔄" },
        { value: "hiring_post", label: "Hiring Posts", icon: "📝" },
        { value: "funding", label: "New Funding", icon: "💰" },
        { value: "company_news", label: "Company News", icon: "📰" }
    ]
};

// AI Service Integration
class AIService {
    constructor() {
        this.apiKey = 'demo_key'; // In real app, this would be from backend
    }

    async analyzeProfile(prospect) {
        showLoading();
        
        // Simulate AI analysis delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Enhanced AI analysis simulation
        const analysis = {
            profileScore: Math.floor(Math.random() * 30) + 70,
            background: `${prospect.name} is a ${prospect.title} at ${prospect.company} with strong expertise in their field. Their LinkedIn activity shows engagement with industry trends and thought leadership.`,
            interests: this.generateInterests(prospect),
            painPoints: this.generatePainPoints(prospect),
            communicationStyle: this.analyzeCommunicationStyle(prospect),
            bestApproach: this.generateBestApproach(prospect),
            personalizationHooks: this.findPersonalizationHooks(prospect),
            likelihood: this.calculateResponseLikelihood(prospect),
            keyAchievements: this.extractAchievements(prospect),
            recentActivity: this.getRecentActivity(prospect),
            recommendedTone: this.recommendTone(prospect),
            timeToReach: this.getBestTimeToReach(prospect)
        };

        hideLoading();
        return analysis;
    }

    generateInterests(prospect) {
        const interestMap = {
            "CTO": ["Technology Strategy", "Team Leadership", "Innovation", "Digital Transformation"],
            "VP Engineering": ["Engineering Excellence", "Team Scaling", "Developer Productivity", "Technical Architecture"],
            "Head of Product": ["Product Strategy", "User Experience", "Market Research", "Product Analytics"],
            "Head of Innovation": ["Innovation Management", "Emerging Technologies", "Strategic Planning", "Change Management"]
        };
        
        return interestMap[prospect.title] || ["Professional Development", "Industry Trends", "Leadership", "Technology"];
    }

    generatePainPoints(prospect) {
        const painPointMap = {
            "CTO": ["Technical debt management", "Scaling challenges", "Security concerns", "Team alignment"],
            "VP Engineering": ["Developer productivity", "Code quality", "Team growth", "Technical decisions"],
            "Head of Product": ["Product-market fit", "User adoption", "Feature prioritization", "Cross-team alignment"],
            "Head of Innovation": ["Innovation pipeline", "Change resistance", "ROI measurement", "Technology adoption"]
        };
        
        return painPointMap[prospect.title] || ["Time management", "Resource allocation", "Strategic planning", "Team coordination"];
    }

    analyzeCommunicationStyle(prospect) {
        const styles = [
            "Data-driven and analytical",
            "Direct and to-the-point", 
            "Collaborative and consultative",
            "Visionary and strategic",
            "Detail-oriented and thorough"
        ];
        
        return styles[Math.floor(Math.random() * styles.length)];
    }

    generateBestApproach(prospect) {
        return `Focus on ${prospect.analysis?.interests?.[0] || 'their expertise'} and highlight specific ROI metrics. Reference their background in ${prospect.title} role and provide relevant case studies.`;
    }

    findPersonalizationHooks(prospect) {
        return [
            `Recent activity in ${prospect.company}`,
            `${prospect.title} role expertise`,
            `Industry experience in ${prospect.title}`,
            `Professional network connections`
        ];
    }

    calculateResponseLikelihood(prospect) {
        const score = prospect.profileScore || Math.floor(Math.random() * 30) + 70;
        if (score > 85) return "High";
        if (score > 70) return "Medium";
        return "Low";
    }

    extractAchievements(prospect) {
        const achievements = [
            "Led digital transformation initiative",
            "Scaled team from 10 to 50+ members",
            "Increased efficiency by 40%",
            "Implemented innovative solutions",
            "Won industry recognition award"
        ];
        
        return achievements.slice(0, 3);
    }

    getRecentActivity(prospect) {
        const activities = [
            "Posted about industry trends",
            "Shared team achievement",
            "Attended industry conference",
            "Published thought leadership article",
            "Participated in panel discussion"
        ];
        
        return activities[Math.floor(Math.random() * activities.length)] + " recently";
    }

    recommendTone(prospect) {
        const tones = ["Professional", "Consultative", "Friendly", "Direct"];
        return tones[Math.floor(Math.random() * tones.length)];
    }

    getBestTimeToReach(prospect) {
        return "Weekdays 9-11 AM or 2-4 PM in their timezone";
    }

    async generateMessage(prospect, messageType = 'connection', customInstructions = '') {
        showLoading();
        
        // Simulate AI message generation
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        const analysis = prospect.analysis || await this.analyzeProfile(prospect);
        
        let message;
        if (messageType === 'connection') {
            message = this.generateConnectionMessage(prospect, analysis);
        } else if (messageType === 'follow_up') {
            message = this.generateFollowUpMessage(prospect, analysis);
        } else {
            message = this.generateCustomMessage(prospect, analysis, messageType);
        }

        // Add custom instructions if provided
        if (customInstructions) {
            message += `\n\nP.S. ${customInstructions}`;
        }

        hideLoading();
        
        return {
            content: message,
            confidence: Math.floor(Math.random() * 20) + 80,
            estimatedResponse: Math.floor(Math.random() * 15) + 25,
            personalizationScore: Math.floor(Math.random() * 30) + 70,
            recommendations: this.getMessageRecommendations(analysis)
        };
    }

    generateConnectionMessage(prospect, analysis) {
        const templates = [
            `Hi ${prospect.name}, I noticed your expertise in ${analysis.interests[0]} and your role at ${prospect.company}. I work with ${prospect.title}s helping them tackle ${analysis.painPoints[0]}. Would love to share some insights that could be relevant for your team. Worth a brief conversation?`,
            
            `Hello ${prospect.name}, your background in ${analysis.interests[0]} caught my attention. I've been helping ${prospect.title}s at companies like ${prospect.company} address challenges around ${analysis.painPoints[0]}. Would you be open to a quick chat about how we've helped similar teams achieve ${Math.floor(Math.random() * 40) + 20}% improvement?`,
            
            `Hi ${prospect.name}, I came across your profile and was impressed by your work in ${analysis.interests[0]} at ${prospect.company}. Given the challenges many ${prospect.title}s face with ${analysis.painPoints[0]}, I thought you might find our approach interesting. Open to a 15-minute conversation?`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    generateFollowUpMessage(prospect, analysis) {
        const templates = [
            `Hi ${prospect.name}, following up on my previous message about ${analysis.interests[0]}. I just came across an interesting case study where a ${prospect.title} at a similar company achieved ${Math.floor(Math.random() * 30) + 20}% improvement in ${analysis.painPoints[0]}. Thought this might resonate with your challenges at ${prospect.company}. Worth a quick call to discuss?`,
            
            `Hello ${prospect.name}, hope you're doing well. I wanted to share something relevant to your work in ${analysis.interests[0]} - we just helped a ${prospect.title} overcome ${analysis.painPoints[0]} with some innovative approaches. Would you be interested in a brief discussion about how this might apply to ${prospect.company}?`,
            
            `Hi ${prospect.name}, I know you're busy, but wanted to circle back on my previous message. Given your focus on ${analysis.interests[0]}, you might find it interesting how we've helped other ${prospect.title}s tackle ${analysis.painPoints[0]}. Quick 15-minute call to share insights?`
        ];
        
        return templates[Math.floor(Math.random() * templates.length)];
    }

    generateCustomMessage(prospect, analysis, messageType) {
        return `Hi ${prospect.name}, I hope this message finds you well. Based on your expertise in ${analysis.interests[0]} and your role at ${prospect.company}, I believe our solution could help address ${analysis.painPoints[0]}. Would you be open to learning more about how we've helped similar ${prospect.title}s achieve measurable results?`;
    }

    getMessageRecommendations(analysis) {
        return [
            "Add specific metrics or case study",
            "Mention recent company news or achievements",
            "Include relevant industry insight",
            "Reference mutual connection if available"
        ];
    }
}

// Initialize AI Service
const aiService = new AIService();

// Utility Functions
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        <div class="toast-content">
            <span class="toast-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="toast-message">${message}</span>
        </div>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto-remove after 4 seconds
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 4000);
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
}

function formatNumber(num) {
    if (num >= 1000) {
        return (num / 1000).toFixed(1) + 'k';
    }
    return num.toString();
}

function calculateDaysAgo(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}

// Page Management
function showPage(pageId) {
    console.log('Showing page:', pageId);
    
    if (pageId === 'landing') {
        // Show landing page
        const landingPage = document.getElementById('landingPage');
        const appContainer = document.getElementById('appContainer');
        if (landingPage) landingPage.classList.remove('hidden');
        if (appContainer) appContainer.classList.add('hidden');
        return;
    }
    
    // Hide landing page
    const landingPage = document.getElementById('landingPage');
    if (landingPage) {
        landingPage.classList.add('hidden');
    }
    
    // Show app container
    const appContainer = document.getElementById('appContainer');
    if (appContainer) {
        appContainer.classList.remove('hidden');
    }
    
    // Hide all content pages
    document.querySelectorAll('.content-page').forEach(page => {
        page.classList.add('hidden');
    });
    
    // Show selected page
    const targetPage = document.getElementById(pageId + 'Content');
    if (targetPage) {
        targetPage.classList.remove('hidden');
        currentPage = pageId;
    }
    
    // Update navigation
    updateNavigation();
    
    // Load page-specific content
    switch(pageId) {
        case 'dashboard':
            loadDashboard();
            break;
        case 'campaigns':
            loadCampaigns();
            break;
        case 'prospects':
            loadProspects();
            break;
        case 'messages':
            loadMessages();
            break;
        case 'analytics':
            loadAnalytics();
            break;
        case 'sequences':
            loadSequences();
            break;
    }
}

function updateNavigation() {
    document.querySelectorAll('.nav-item').forEach(item => {
        item.classList.remove('active');
        if (item.dataset.page === currentPage) {
            item.classList.add('active');
        }
    });
}

// Authentication Functions
function showAuthModal(isSignup = false) {
    console.log('Showing auth modal, signup:', isSignup);
    
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    
    if (!authModal || !loginForm || !signupForm) {
        console.error('Auth modal elements not found');
        return;
    }
    
    authModal.classList.remove('hidden');
    
    if (isSignup) {
        loginForm.classList.add('hidden');
        signupForm.classList.remove('hidden');
    } else {
        signupForm.classList.add('hidden');
        loginForm.classList.remove('hidden');
    }
}

function closeAuthModal() {
    const authModal = document.getElementById('authModal');
    if (authModal) {
        authModal.classList.add('hidden');
    }
}

async function handleLogin(e) {
    e.preventDefault();
    console.log('Handling login');
    showLoading();
    
    try {
        const formData = new FormData(e.target);
        const email = formData.get('email');
        const password = formData.get('password');
        
        // Simulate login process
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        if (email === 'demo@salesforge.ai' && password === 'password123') {
            currentUser = { 
                name: 'Demo User', 
                email: email,
                plan: 'Pro Plan',
                avatar: 'DU'
            };
            
            hideLoading();
            closeAuthModal();
            showToast('Welcome back! Successfully logged in.', 'success');
            showPage('dashboard');
        } else {
            hideLoading();
            showToast('Invalid credentials. Try: demo@salesforge.ai / password123', 'error');
        }
        
    } catch (error) {
        console.error('Login error:', error);
        hideLoading();
        showToast('Login failed. Please try again.', 'error');
    }
}

function handleSignup(e) {
    e.preventDefault();
    console.log('Handling signup');
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        currentUser = { 
            name: 'New User', 
            email: 'user@example.com',
            plan: 'Free Plan',
            avatar: 'NU'
        };
        closeAuthModal();
        showToast('Account created successfully! Welcome to SalesForge AI.', 'success');
        showPage('dashboard');
    }, 1500);
}

function logout() {
    currentUser = null;
    selectedProspects = [];
    const appContainer = document.getElementById('appContainer');
    const landingPage = document.getElementById('landingPage');
    if (appContainer) appContainer.classList.add('hidden');
    if (landingPage) landingPage.classList.remove('hidden');
    showToast('Logged out successfully', 'success');
}

// Dashboard Functions
function loadDashboard() {
    updateDashboardStats();
    loadRecentCampaigns();
    loadTopProspects();
}

function updateDashboardStats() {
    const activeCampaigns = appData.campaigns.filter(c => c.status === 'active').length;
    const totalProspects = appData.prospects.length;
    const totalContacted = appData.prospects.filter(p => p.status !== 'pending').length;
    const totalResponded = appData.prospects.filter(p => p.status === 'responded').length;
    const responseRate = totalContacted > 0 ? ((totalResponded / totalContacted) * 100).toFixed(1) : 0;
    const messagesSent = appData.prospects.reduce((sum, p) => sum + (p.messagesSent || 0), 0);
    
    const totalCampaignsEl = document.getElementById('totalCampaigns');
    const totalProspectsEl = document.getElementById('totalProspects');
    const responseRateEl = document.getElementById('responseRate');
    const messagesSentEl = document.getElementById('messagesSent');
    
    if (totalCampaignsEl) totalCampaignsEl.textContent = activeCampaigns;
    if (totalProspectsEl) totalProspectsEl.textContent = totalProspects;
    if (responseRateEl) responseRateEl.textContent = responseRate + '%';
    if (messagesSentEl) messagesSentEl.textContent = messagesSent;
}

function loadRecentCampaigns() {
    const campaignsList = document.getElementById('campaignsList');
    if (!campaignsList) return;
    
    const recentCampaigns = appData.campaigns.slice(0, 3);
    
    campaignsList.innerHTML = recentCampaigns.map(campaign => `
        <div class="campaign-item" onclick="viewCampaign(${campaign.id})">
            <div class="campaign-info">
                <h4>${campaign.name}</h4>
                <p class="campaign-meta">${campaign.targetIndustry} • ${formatDate(campaign.created)}</p>
                <div class="campaign-status-badge ${campaign.status}">${campaign.status}</div>
            </div>
            <div class="campaign-stats">
                <div class="campaign-stat">
                    <strong>${campaign.prospects}</strong>
                    <span>Prospects</span>
                </div>
                <div class="campaign-stat">
                    <strong>${campaign.responded}</strong>
                    <span>Responses</span>
                </div>
                <div class="campaign-stat">
                    <strong>${campaign.responseRate.toFixed(1)}%</strong>
                    <span>Rate</span>
                </div>
            </div>
        </div>
    `).join('');
}

function loadTopProspects() {
    const topProspectsList = document.getElementById('topProspectsList');
    if (!topProspectsList) return;
    
    const highPriorityProspects = appData.prospects
        .filter(p => p.priority === 'high')
        .slice(0, 4);
    
    topProspectsList.innerHTML = highPriorityProspects.map(prospect => `
        <div class="prospect-preview" onclick="viewProspectDetails(${prospect.id})">
            <div class="prospect-avatar">${prospect.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="prospect-info">
                <h4>${prospect.name}</h4>
                <p>${prospect.title} at ${prospect.company}</p>
                <div class="prospect-metrics">
                    <span class="engagement">${prospect.engagement}% engagement</span>
                    <span class="priority ${prospect.priority}">${prospect.priority} priority</span>
                </div>
            </div>
        </div>
    `).join('');
}

// Campaign Functions
function loadCampaigns() {
    const campaignsGrid = document.getElementById('campaignsGrid');
    if (!campaignsGrid) return;
    
    campaignsGrid.innerHTML = appData.campaigns.map(campaign => `
        <div class="campaign-card" onclick="viewCampaign(${campaign.id})">
            <div class="campaign-header">
                <div class="campaign-title-section">
                    <h3>${campaign.name}</h3>
                    <span class="campaign-status ${campaign.status}">${campaign.status}</span>
                </div>
                <div class="campaign-actions" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="editCampaign(${campaign.id})" title="Edit">✏️</button>
                    <button class="btn-icon" onclick="toggleCampaignStatus(${campaign.id})" title="${campaign.status === 'active' ? 'Pause' : 'Start'}">${campaign.status === 'active' ? '⏸️' : '▶️'}</button>
                </div>
            </div>
            
            <p class="campaign-description">${campaign.productService.substring(0, 120)}...</p>
            
            <div class="campaign-targeting">
                <div class="target-item">
                    <span class="target-label">Industry:</span>
                    <span class="target-value">${campaign.targetIndustry}</span>
                </div>
                <div class="target-item">
                    <span class="target-label">Roles:</span>
                    <span class="target-value">${campaign.targetRoles.slice(0, 2).join(', ')}${campaign.targetRoles.length > 2 ? '...' : ''}</span>
                </div>
                <div class="target-item">
                    <span class="target-label">Region:</span>
                    <span class="target-value">${campaign.region}</span>
                </div>
            </div>
            
            <div class="campaign-metrics">
                <div class="metric">
                    <span class="metric-value">${campaign.prospects}</span>
                    <span class="metric-label">Prospects</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${campaign.contacted}</span>
                    <span class="metric-label">Contacted</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${campaign.responded}</span>
                    <span class="metric-label">Responded</span>
                </div>
                <div class="metric">
                    <span class="metric-value">${campaign.responseRate.toFixed(1)}%</span>
                    <span class="metric-label">Response Rate</span>
                </div>
            </div>
            
            <div class="campaign-progress">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${(campaign.contacted / campaign.prospects) * 100}%"></div>
                </div>
                <span class="progress-text">${campaign.contacted}/${campaign.prospects} contacted</span>
            </div>
        </div>
    `).join('');
}

function viewCampaign(campaignId) {
    const campaign = appData.campaigns.find(c => c.id === campaignId);
    if (campaign) {
        showPage('prospects');
        filterProspectsByCampaign(campaignId);
        showToast(`Viewing prospects for "${campaign.name}"`, 'info');
    }
}

function editCampaign(campaignId) {
    const campaign = appData.campaigns.find(c => c.id === campaignId);
    if (campaign) {
        campaignData = { ...campaign };
        showCampaignWizard();
        showToast(`Editing campaign "${campaign.name}"`, 'info');
    }
}

function toggleCampaignStatus(campaignId) {
    const campaign = appData.campaigns.find(c => c.id === campaignId);
    if (campaign) {
        campaign.status = campaign.status === 'active' ? 'paused' : 'active';
        loadCampaigns();
        showToast(`Campaign ${campaign.status === 'active' ? 'activated' : 'paused'}`, 'success');
    }
}

// Prospect Functions
function loadProspects() {
    displayProspects(appData.prospects);
    setupProspectFilters();
}

function displayProspects(prospects = appData.prospects) {
    const prospectsTable = document.getElementById('prospectsTable');
    if (!prospectsTable) return;
    
    prospectsTable.innerHTML = prospects.map(prospect => `
        <div class="prospect-row" data-id="${prospect.id}">
            <div class="prospect-select">
                <input type="checkbox" class="prospect-checkbox" data-id="${prospect.id}" onchange="handleProspectSelection(${prospect.id})">
            </div>
            
            <div class="prospect-info">
                <div class="prospect-avatar">${prospect.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="prospect-details">
                    <h4>${prospect.name}</h4>
                    <p class="prospect-title">${prospect.title} at ${prospect.company}</p>
                    <p class="prospect-location">${prospect.location || 'Location not specified'}</p>
                    <div class="prospect-tags">
                        ${prospect.tags.slice(0, 2).map(tag => `<span class="tag">${tag}</span>`).join('')}
                    </div>
                </div>
            </div>
            
            <div class="prospect-scores">
                <div class="score-item">
                    <span class="score-value">${prospect.profileScore || 'N/A'}</span>
                    <span class="score-label">Profile Score</span>
                </div>
                <div class="score-item">
                    <span class="score-value">${prospect.engagement}%</span>
                    <span class="score-label">Engagement</span>
                </div>
            </div>
            
            <div class="prospect-status-section">
                <div class="prospect-status ${prospect.status}">${prospect.status}</div>
                <div class="priority-badge ${prospect.priority}">${prospect.priority}</div>
            </div>
            
            <div class="prospect-activity">
                <div class="activity-item">
                    <span class="activity-label">Messages:</span>
                    <span class="activity-value">${prospect.messagesSent || 0}</span>
                </div>
                ${prospect.lastContact ? `
                    <div class="activity-item">
                        <span class="activity-label">Last contact:</span>
                        <span class="activity-value">${calculateDaysAgo(prospect.lastContact)}d ago</span>
                    </div>
                ` : ''}
            </div>
            
            <div class="prospect-actions" onclick="event.stopPropagation()">
                <button class="btn-icon" onclick="analyzeProspect(${prospect.id})" title="AI Analysis">🧠</button>
                <button class="btn-icon" onclick="composeMessage(${prospect.id})" title="Message">💬</button>
                <button class="btn-icon" onclick="viewLinkedInProfile('${prospect.linkedinUrl}')" title="LinkedIn">🔗</button>
                <button class="btn-icon" onclick="viewProspectDetails(${prospect.id})" title="Details">👁️</button>
            </div>
        </div>
    `).join('');
}

function setupProspectFilters() {
    const filterTags = document.querySelectorAll('.filter-tags .tag');
    const searchInput = document.getElementById('prospectSearch');
    
    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');
            
            const filter = tag.dataset.filter;
            filterProspects(filter);
        });
    });
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchProspects(e.target.value);
        });
    }
}

function filterProspects(filter) {
    let filteredProspects = appData.prospects;
    
    if (filter !== 'all') {
        if (filter === 'high') {
            filteredProspects = appData.prospects.filter(p => p.priority === 'high');
        } else {
            filteredProspects = appData.prospects.filter(p => p.status === filter);
        }
    }
    
    displayProspects(filteredProspects);
}

function searchProspects(query) {
    if (!query.trim()) {
        displayProspects(appData.prospects);
        return;
    }
    
    const filteredProspects = appData.prospects.filter(p => 
        p.name.toLowerCase().includes(query.toLowerCase()) ||
        p.company.toLowerCase().includes(query.toLowerCase()) ||
        p.title.toLowerCase().includes(query.toLowerCase())
    );
    
    displayProspects(filteredProspects);
}

function filterProspectsByCampaign(campaignId) {
    const filteredProspects = appData.prospects.filter(p => p.campaignId === campaignId);
    displayProspects(filteredProspects);
}

function handleProspectSelection(prospectId) {
    const checkbox = document.querySelector(`input[data-id="${prospectId}"]`);
    if (checkbox.checked) {
        if (!selectedProspects.includes(prospectId)) {
            selectedProspects.push(prospectId);
        }
    } else {
        selectedProspects = selectedProspects.filter(id => id !== prospectId);
    }
    
    updateBulkActionsVisibility();
}

function updateBulkActionsVisibility() {
    const selectedCount = selectedProspects.length;
    if (selectedCount > 0) {
        showToast(`${selectedCount} prospect${selectedCount > 1 ? 's' : ''} selected`, 'info');
    }
}

// Prospect Analysis Functions
async function analyzeProspect(prospectId) {
    const prospect = appData.prospects.find(p => p.id === prospectId);
    if (!prospect) return;
    
    showProfileAnalysisModal(prospect);
    
    try {
        const analysis = await aiService.analyzeProfile(prospect);
        
        // Update prospect data with analysis
        prospect.analysis = analysis;
        prospect.profileScore = analysis.profileScore;
        
        displayAnalysisResults(analysis);
        showToast(`Analysis complete for ${prospect.name}`, 'success');
        
    } catch (error) {
        console.error('Analysis error:', error);
        showToast('Analysis failed. Please try again.', 'error');
        closeProfileAnalysis();
    }
}

function showProfileAnalysisModal(prospect) {
    const modal = document.getElementById('profileAnalysisModal');
    const prospectInfo = document.getElementById('analysisProspectInfo');
    
    if (modal && prospectInfo) {
        prospectInfo.innerHTML = `
            <div class="prospect-header">
                <div class="prospect-avatar">${prospect.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="prospect-details">
                    <h3>${prospect.name}</h3>
                    <p>${prospect.title} at ${prospect.company}</p>
                    <p class="prospect-location">${prospect.location || 'Location not specified'}</p>
                </div>
            </div>
        `;
        
        // Show loading state
        const analysisResults = document.getElementById('analysisResults');
        const loadingDiv = document.querySelector('.analysis-loading');
        
        analysisResults.classList.add('hidden');
        loadingDiv.classList.remove('hidden');
        
        modal.classList.remove('hidden');
        selectedProspect = prospect;
    }
}

function displayAnalysisResults(analysis) {
    const analysisResults = document.getElementById('analysisResults');
    const loadingDiv = document.querySelector('.analysis-loading');
    
    if (analysisResults && loadingDiv) {
        analysisResults.innerHTML = `
            <div class="analysis-section">
                <h4>📊 Profile Overview</h4>
                <div class="analysis-grid">
                    <div class="analysis-metric">
                        <span class="metric-value">${analysis.profileScore}</span>
                        <span class="metric-label">Profile Score</span>
                    </div>
                    <div class="analysis-metric">
                        <span class="metric-value">${analysis.likelihood}</span>
                        <span class="metric-label">Response Likelihood</span>
                    </div>
                    <div class="analysis-metric">
                        <span class="metric-value">${analysis.recommendedTone}</span>
                        <span class="metric-label">Recommended Tone</span>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>🎯 Key Insights</h4>
                <div class="insight-item">
                    <strong>Background:</strong>
                    <p>${analysis.background}</p>
                </div>
                <div class="insight-item">
                    <strong>Communication Style:</strong>
                    <p>${analysis.communicationStyle}</p>
                </div>
                <div class="insight-item">
                    <strong>Best Approach:</strong>
                    <p>${analysis.bestApproach}</p>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>💡 Interests & Pain Points</h4>
                <div class="analysis-row">
                    <div class="analysis-column">
                        <h5>Key Interests</h5>
                        <div class="tag-list">
                            ${analysis.interests.map(interest => `<span class="analysis-tag">${interest}</span>`).join('')}
                        </div>
                    </div>
                    <div class="analysis-column">
                        <h5>Pain Points</h5>
                        <div class="tag-list">
                            ${analysis.painPoints.map(pain => `<span class="analysis-tag pain">${pain}</span>`).join('')}
                        </div>
                    </div>
                </div>
            </div>
            
            <div class="analysis-section">
                <h4>🚀 Personalization Hooks</h4>
                <ul class="hooks-list">
                    ${analysis.personalizationHooks.map(hook => `<li>${hook}</li>`).join('')}
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>🏆 Key Achievements</h4>
                <ul class="achievements-list">
                    ${analysis.keyAchievements.map(achievement => `<li>${achievement}</li>`).join('')}
                </ul>
            </div>
            
            <div class="analysis-section">
                <h4>⏰ Recommended Timing</h4>
                <p>${analysis.timeToReach}</p>
                <p class="recent-activity"><strong>Recent Activity:</strong> ${analysis.recentActivity}</p>
            </div>
        `;
        
        loadingDiv.classList.add('hidden');
        analysisResults.classList.remove('hidden');
    }
}

function closeProfileAnalysis() {
    const modal = document.getElementById('profileAnalysisModal');
    if (modal) {
        modal.classList.add('hidden');
        selectedProspect = null;
    }
}

function viewProspectDetails(prospectId) {
    const prospect = appData.prospects.find(p => p.id === prospectId);
    if (prospect) {
        analyzeProspect(prospectId);
    }
}

function viewLinkedInProfile(url) {
    window.open(url, '_blank');
    showToast('Opening LinkedIn profile in new tab', 'info');
}

// Message Composition Functions
function composeMessage(prospectId) {
    const prospect = appData.prospects.find(p => p.id === prospectId);
    if (!prospect) return;
    
    selectedProspect = prospect;
    showMessageComposerModal();
}

function showMessageComposerModal() {
    const modal = document.getElementById('messageComposerModal');
    const prospectPreview = document.getElementById('prospectPreview');
    
    if (modal && prospectPreview && selectedProspect) {
        prospectPreview.innerHTML = `
            <div class="prospect-header">
                <div class="prospect-avatar">${selectedProspect.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="prospect-details">
                    <h3>${selectedProspect.name}</h3>
                    <p>${selectedProspect.title} at ${selectedProspect.company}</p>
                    <div class="prospect-metrics">
                        <span class="engagement">${selectedProspect.engagement}% engagement</span>
                        <span class="priority ${selectedProspect.priority}">${selectedProspect.priority} priority</span>
                    </div>
                </div>
            </div>
        `;
        
        modal.classList.remove('hidden');
        
        // Auto-generate initial message
        generateAIMessage();
    }
}

function closeMessageComposer() {
    const modal = document.getElementById('messageComposerModal');
    if (modal) {
        modal.classList.add('hidden');
        selectedProspect = null;
    }
}

async function generateAIMessage(messageType = 'connection') {
    if (!selectedProspect) return;
    
    try {
        const messageData = await aiService.generateMessage(selectedProspect, messageType);
        
        const messageContent = document.getElementById('messageContent');
        const charCount = document.getElementById('charCount');
        const estimatedResponse = document.getElementById('estimatedResponse');
        
        if (messageContent) {
            messageContent.value = messageData.content;
            
            if (charCount) {
                charCount.textContent = messageData.content.length;
            }
            
            if (estimatedResponse) {
                estimatedResponse.textContent = `Est. Response Rate: ${messageData.estimatedResponse}%`;
            }
        }
        
        showToast(`Message generated with ${messageData.confidence}% confidence`, 'success');
        
    } catch (error) {
        console.error('Message generation error:', error);
        showToast('Failed to generate message. Please try again.', 'error');
    }
}

function improveMessage() {
    if (!selectedProspect) return;
    
    showToast('Improving message based on AI recommendations...', 'info');
    
    // Simulate message improvement
    setTimeout(() => {
        generateAIMessage();
        showToast('Message improved successfully!', 'success');
    }, 1000);
}

async function sendComposedMessage() {
    if (!selectedProspect) return;
    
    const messageContent = document.getElementById('messageContent');
    if (!messageContent || !messageContent.value.trim()) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    showLoading();
    
    try {
        // Simulate sending message
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        // Update prospect status
        selectedProspect.status = 'contacted';
        selectedProspect.messagesSent = (selectedProspect.messagesSent || 0) + 1;
        selectedProspect.lastContact = new Date().toISOString();
        
        hideLoading();
        closeMessageComposer();
        
        showToast(`Message sent to ${selectedProspect.name}!`, 'success');
        
        // Refresh prospects if on prospects page
        if (currentPage === 'prospects') {
            loadProspects();
        }
        
    } catch (error) {
        console.error('Send message error:', error);
        hideLoading();
        showToast('Failed to send message. Please try again.', 'error');
    }
}

function scheduleMessage() {
    showToast('Message scheduling feature coming soon!', 'info');
}

// Bulk Actions Functions
function analyzeAllProspects() {
    if (selectedProspects.length === 0) {
        showToast('Please select prospects first', 'error');
        return;
    }
    
    showBulkAnalysis();
}

async function showBulkAnalysis() {
    const modal = document.getElementById('bulkActionsModal');
    const selectedCount = document.getElementById('selectedCount');
    const estimatedTime = document.getElementById('estimatedTime');
    
    if (modal) {
        if (selectedCount) selectedCount.textContent = selectedProspects.length;
        if (estimatedTime) estimatedTime.textContent = Math.ceil(selectedProspects.length * 0.5);
        
        modal.classList.remove('hidden');
    }
}

function closeBulkActions() {
    const modal = document.getElementById('bulkActionsModal');
    if (modal) {
        modal.classList.add('hidden');
    }
}

async function performBulkAction(action) {
    if (selectedProspects.length === 0) {
        showToast('No prospects selected', 'error');
        return;
    }
    
    closeBulkActions();
    showLoading();
    
    try {
        switch (action) {
            case 'analyze':
                await bulkAnalyzeProspects();
                break;
            case 'message':
                await bulkSendMessages();
                break;
            case 'sequence':
                await bulkAddToSequence();
                break;
        }
    } catch (error) {
        console.error('Bulk action error:', error);
        showToast('Bulk action failed. Please try again.', 'error');
    } finally {
        hideLoading();
    }
}

async function bulkAnalyzeProspects() {
    const prospects = selectedProspects.map(id => appData.prospects.find(p => p.id === id));
    
    for (let prospect of prospects) {
        if (prospect) {
            prospect.analysis = await aiService.analyzeProfile(prospect);
            prospect.profileScore = prospect.analysis.profileScore;
        }
    }
    
    showToast(`Analysis completed for ${prospects.length} prospects`, 'success');
    loadProspects();
    selectedProspects = [];
}

async function bulkSendMessages() {
    const prospects = selectedProspects.map(id => appData.prospects.find(p => p.id === id));
    
    let sentCount = 0;
    for (let prospect of prospects) {
        if (prospect && prospect.status === 'pending') {
            prospect.status = 'contacted';
            prospect.messagesSent = (prospect.messagesSent || 0) + 1;
            prospect.lastContact = new Date().toISOString();
            sentCount++;
        }
    }
    
    showToast(`Messages sent to ${sentCount} prospects`, 'success');
    loadProspects();
    selectedProspects = [];
}

async function bulkAddToSequence() {
    const prospects = selectedProspects.map(id => appData.prospects.find(p => p.id === id));
    
    // Add prospects to default sequence
    showToast(`${prospects.length} prospects added to follow-up sequence`, 'success');
    selectedProspects = [];
}

// Messages Page Functions
function loadMessages() {
    loadConversations();
}

function loadConversations() {
    const conversationList = document.getElementById('conversationList');
    if (!conversationList) return;
    
    const contactedProspects = appData.prospects.filter(p => p.status !== 'pending');
    
    if (contactedProspects.length === 0) {
        conversationList.innerHTML = `
            <div class="empty-state">
                <h4>No conversations yet</h4>
                <p>Start reaching out to prospects to see conversations here</p>
            </div>
        `;
        return;
    }
    
    conversationList.innerHTML = contactedProspects.map(prospect => `
        <div class="conversation-item ${prospect.status === 'responded' ? 'has-response' : ''}" onclick="selectConversation(${prospect.id})">
            <div class="conversation-avatar">${prospect.name.split(' ').map(n => n[0]).join('')}</div>
            <div class="conversation-details">
                <h4>${prospect.name}</h4>
                <p class="conversation-company">${prospect.company}</p>
                <p class="conversation-preview">${getLastMessage(prospect)}</p>
                <div class="conversation-meta">
                    <span class="conversation-status ${prospect.status}">${prospect.status}</span>
                    ${prospect.lastContact ? `<span class="conversation-time">${calculateDaysAgo(prospect.lastContact)}d ago</span>` : ''}
                </div>
            </div>
            ${prospect.status === 'responded' ? '<div class="response-indicator">💬</div>' : ''}
        </div>
    `).join('');
}

function getLastMessage(prospect) {
    if (prospect.status === 'responded') {
        return "Thanks for reaching out! I'd love to learn more...";
    } else if (prospect.status === 'contacted') {
        return "Hi " + prospect.name.split(' ')[0] + ", I noticed your work in...";
    }
    return "No messages yet";
}

function selectConversation(prospectId) {
    const prospect = appData.prospects.find(p => p.id === prospectId);
    if (!prospect) return;
    
    selectedProspect = prospect;
    loadConversationMessages(prospect);
    
    // Update conversation selection UI
    document.querySelectorAll('.conversation-item').forEach(item => {
        item.classList.remove('selected');
    });
    
    event.currentTarget.classList.add('selected');
}

function loadConversationMessages(prospect) {
    const chatContainer = document.getElementById('chatContainer');
    const messageInputArea = document.querySelector('.message-input-area');
    
    if (chatContainer && messageInputArea) {
        chatContainer.innerHTML = `
            <div class="conversation-header">
                <div class="prospect-avatar">${prospect.name.split(' ').map(n => n[0]).join('')}</div>
                <div class="prospect-info">
                    <h3>${prospect.name}</h3>
                    <p>${prospect.title} at ${prospect.company}</p>
                    <span class="status-badge ${prospect.status}">${prospect.status}</span>
                </div>
            </div>
            
            <div class="messages-area">
                ${generateConversationMessages(prospect)}
            </div>
        `;
        
        messageInputArea.classList.remove('hidden');
    }
}

function generateConversationMessages(prospect) {
    const messages = [];
    
    if (prospect.messagesSent > 0) {
        messages.push(`
            <div class="message sent">
                <div class="message-content">
                    <p>Hi ${prospect.name.split(' ')[0]}, I noticed your expertise in ${prospect.analysis?.interests?.[0] || 'your field'} and thought you might find our platform interesting. Would love to share some insights that could be relevant for ${prospect.company}.</p>
                </div>
                <div class="message-time">${prospect.lastContact ? formatDate(prospect.lastContact) : 'Recently'}</div>
            </div>
        `);
    }
    
    if (prospect.status === 'responded') {
        messages.push(`
            <div class="message received">
                <div class="message-content">
                    <p>Thanks for reaching out! I'd love to learn more about how this could help our team. Do you have any case studies from similar companies?</p>
                </div>
                <div class="message-time">${formatDate(prospect.lastContact)}</div>
            </div>
        `);
    }
    
    return messages.length > 0 ? messages.join('') : `
        <div class="empty-messages">
            <p>No messages yet. Start the conversation!</p>
        </div>
    `;
}

// Analytics Functions
function loadAnalytics() {
    setTimeout(() => {
        initializeCharts();
        loadCampaignPerformanceTable();
    }, 100);
}

function initializeCharts() {
    // Performance Overview Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx && !performanceChart) {
        performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'This Week'],
                datasets: [{
                    label: 'Messages Sent',
                    data: [45, 68, 89, 102, 127],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Responses',
                    data: [12, 23, 31, 38, 43],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Connections',
                    data: [8, 15, 22, 28, 35],
                    borderColor: '#8b5cf6',
                    backgroundColor: 'rgba(139, 92, 246, 0.1)',
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d4d4d8'
                        }
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#a1a1aa' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#a1a1aa' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }

    // Response Rates Chart
    const responseCtx = document.getElementById('responseChart');
    if (responseCtx && !responseChart) {
        responseChart = new Chart(responseCtx, {
            type: 'doughnut',
            data: {
                labels: ['Responded', 'Contacted', 'Pending'],
                datasets: [{
                    data: [24, 48, 75],
                    backgroundColor: ['#10b981', '#0ea5e9', '#8b5cf6'],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: {
                            color: '#d4d4d8'
                        }
                    }
                }
            }
        });
    }

    // Source Chart
    const sourceCtx = document.getElementById('sourceChart');
    if (sourceCtx && !sourceChart) {
        sourceChart = new Chart(sourceCtx, {
            type: 'bar',
            data: {
                labels: ['LinkedIn Search', 'Company Website', 'Industry Events', 'Referrals', 'Sales Navigator'],
                datasets: [{
                    label: 'Prospects',
                    data: [45, 23, 18, 12, 35],
                    backgroundColor: [
                        '#0ea5e9',
                        '#10b981', 
                        '#8b5cf6',
                        '#f59e0b',
                        '#ef4444'
                    ],
                    borderWidth: 0
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        ticks: { color: '#a1a1aa' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    },
                    y: {
                        ticks: { color: '#a1a1aa' },
                        grid: { color: 'rgba(255, 255, 255, 0.1)' }
                    }
                }
            }
        });
    }
}

function loadCampaignPerformanceTable() {
    const table = document.getElementById('campaignPerformanceTable');
    if (!table) return;
    
    table.innerHTML = `
        <div class="performance-table">
            <div class="table-header">
                <div class="header-cell">Campaign</div>
                <div class="header-cell">Prospects</div>
                <div class="header-cell">Contacted</div>
                <div class="header-cell">Responses</div>
                <div class="header-cell">Rate</div>
            </div>
            ${appData.campaigns.map(campaign => `
                <div class="table-row">
                    <div class="table-cell">
                        <strong>${campaign.name}</strong>
                        <div class="campaign-status ${campaign.status}">${campaign.status}</div>
                    </div>
                    <div class="table-cell">${campaign.prospects}</div>
                    <div class="table-cell">${campaign.contacted}</div>
                    <div class="table-cell">${campaign.responded}</div>
                    <div class="table-cell">
                        <span class="rate-badge ${campaign.responseRate > 35 ? 'high' : campaign.responseRate > 25 ? 'medium' : 'low'}">
                            ${campaign.responseRate.toFixed(1)}%
                        </span>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// Sequences Functions
function loadSequences() {
    const sequencesGrid = document.getElementById('sequencesGrid');
    if (!sequencesGrid) return;
    
    sequencesGrid.innerHTML = appData.sequences.map(sequence => `
        <div class="sequence-card">
            <div class="sequence-header">
                <h3>${sequence.name}</h3>
                <span class="sequence-status ${sequence.status}">${sequence.status}</span>
            </div>
            
            <div class="sequence-stats">
                <div class="stat">
                    <strong>${sequence.activeProspects}</strong>
                    <span>Active Prospects</span>
                </div>
                <div class="stat">
                    <strong>${sequence.completionRate}%</strong>
                    <span>Completion Rate</span>
                </div>
                <div class="stat">
                    <strong>${sequence.steps.length}</strong>
                    <span>Steps</span>
                </div>
            </div>
            
            <div class="sequence-steps">
                <h4>Sequence Steps</h4>
                ${sequence.steps.map((step, index) => `
                    <div class="sequence-step">
                        <div class="step-number">${step.day}</div>
                        <div class="step-info">
                            <div class="step-type">${step.type.replace('_', ' ').toUpperCase()}</div>
                            <div class="step-message">${step.message}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            
            <div class="sequence-actions">
                <button class="btn-glass btn-small" onclick="editSequence(${sequence.id})">Edit</button>
                <button class="btn-primary btn-small" onclick="viewSequenceProspects(${sequence.id})">View Prospects</button>
            </div>
        </div>
    `).join('');
}

function editSequence(sequenceId) {
    showToast('Sequence editing feature coming soon!', 'info');
}

function viewSequenceProspects(sequenceId) {
    showToast('Sequence prospect view coming soon!', 'info');
}

// Campaign Wizard Functions
function showCampaignWizard() {
    const wizardModal = document.getElementById('campaignWizardModal');
    if (wizardModal) {
        wizardModal.classList.remove('hidden');
        resetCampaignWizard();
    }
}

function closeCampaignWizard() {
    const wizardModal = document.getElementById('campaignWizardModal');
    if (wizardModal) {
        wizardModal.classList.add('hidden');
    }
    campaignData = {};
}

function resetCampaignWizard() {
    campaignWizardStep = 1;
    updateWizardStep();
    setupWizardInteractions();
}

function setupWizardInteractions() {
    // Goal selector
    const goalOptions = document.querySelectorAll('.goal-option');
    goalOptions.forEach(option => {
        option.addEventListener('click', () => {
            goalOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            campaignData.outreachGoal = option.dataset.value;
        });
    });
    
    // Role selector
    const roleOptions = document.querySelectorAll('.role-option');
    roleOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            
            const selectedRoles = Array.from(document.querySelectorAll('.role-option.selected'))
                .map(opt => opt.dataset.value);
            campaignData.targetRoles = selectedRoles;
        });
    });
    
    // Voice selector
    const voiceOptions = document.querySelectorAll('.voice-option');
    voiceOptions.forEach(option => {
        option.addEventListener('click', () => {
            voiceOptions.forEach(opt => opt.classList.remove('selected'));
            option.classList.add('selected');
            campaignData.brandVoice = option.dataset.value;
        });
    });
    
    // Trigger selector
    const triggerOptions = document.querySelectorAll('.trigger-option');
    triggerOptions.forEach(option => {
        option.addEventListener('click', () => {
            option.classList.toggle('selected');
            
            const selectedTriggers = Array.from(document.querySelectorAll('.trigger-option.selected'))
                .map(opt => opt.dataset.value);
            campaignData.triggers = selectedTriggers;
        });
    });
}

function updateWizardStep() {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum <= campaignWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide wizard steps
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum === campaignWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Update buttons
    const backBtn = document.getElementById('wizardBack');
    const nextBtn = document.getElementById('wizardNext');
    const createBtn = document.getElementById('wizardCreate');
    
    if (backBtn) {
        backBtn.style.display = campaignWizardStep === 1 ? 'none' : 'block';
    }
    
    if (nextBtn && createBtn) {
        if (campaignWizardStep === 4) {
            nextBtn.classList.add('hidden');
            createBtn.classList.remove('hidden');
            updateCampaignSummary();
        } else {
            nextBtn.classList.remove('hidden');
            createBtn.classList.add('hidden');
        }
    }
}

function nextWizardStep() {
    if (validateWizardStep()) {
        if (campaignWizardStep < 4) {
            campaignWizardStep++;
            updateWizardStep();
        }
    }
}

function prevWizardStep() {
    if (campaignWizardStep > 1) {
        campaignWizardStep--;
        updateWizardStep();
    }
}

function validateWizardStep() {
    switch (campaignWizardStep) {
        case 1:
            const campaignName = document.querySelector('input[name="campaignName"]').value;
            const productService = document.querySelector('textarea[name="productService"]').value;
            if (!campaignName || !productService || !campaignData.outreachGoal) {
                showToast('Please fill in all required fields', 'error');
                return false;
            }
            campaignData.name = campaignName;
            campaignData.productService = productService;
            break;
            
        case 2:
            const industry = document.querySelector('select[name="industry"]').value;
            const companySize = document.querySelector('select[name="companySize"]').value;
            const region = document.querySelector('select[name="region"]').value;
            if (!industry || !companySize || !region || !campaignData.targetRoles?.length) {
                showToast('Please complete your target audience selection', 'error');
                return false;
            }
            campaignData.targetIndustry = industry;
            campaignData.companySize = companySize;
            campaignData.region = region;
            break;
            
        case 3:
            if (!campaignData.brandVoice) {
                showToast('Please select a brand voice', 'error');
                return false;
            }
            break;
    }
    
    return true;
}

function updateCampaignSummary() {
    const summaryContent = document.getElementById('campaignSummary');
    if (summaryContent) {
        summaryContent.innerHTML = `
            <div class="summary-item">
                <strong>Campaign Name:</strong> ${campaignData.name}
            </div>
            <div class="summary-item">
                <strong>Target Industry:</strong> ${campaignData.targetIndustry}
            </div>
            <div class="summary-item">
                <strong>Target Roles:</strong> ${campaignData.targetRoles?.join(', ')}
            </div>
            <div class="summary-item">
                <strong>Region:</strong> ${campaignData.region}
            </div>
            <div class="summary-item">
                <strong>Company Size:</strong> ${campaignData.companySize}
            </div>
            <div class="summary-item">
                <strong>Brand Voice:</strong> ${campaignData.brandVoice}
            </div>
            <div class="summary-item">
                <strong>Outreach Goal:</strong> ${campaignData.outreachGoal}
            </div>
            ${campaignData.triggers?.length ? `
            <div class="summary-item">
                <strong>Triggers:</strong> ${campaignData.triggers.join(', ')}
            </div>
            ` : ''}
        `;
    }
}

async function createCampaign() {
    showLoading();
    
    try {
        // Get final form data
        const dailyLimit = document.querySelector('input[name="dailyLimit"]').value || 20;
        const weeklyLimit = document.querySelector('input[name="weeklyLimit"]').value || 100;
        const campaignStatus = document.querySelector('input[name="campaignStatus"]:checked').value || 'draft';
        
        // Create new campaign
        const newCampaign = {
            id: appData.campaigns.length + 1,
            name: campaignData.name,
            productService: campaignData.productService,
            targetIndustry: campaignData.targetIndustry,
            targetRoles: campaignData.targetRoles,
            companySize: campaignData.companySize,
            region: campaignData.region,
            brandVoice: campaignData.brandVoice,
            outreachGoals: [campaignData.outreachGoal],
            triggers: campaignData.triggers || [],
            status: campaignStatus,
            created: new Date().toISOString(),
            prospects: 0,
            contacted: 0,
            responded: 0,
            responseRate: 0,
            dailyLimit: parseInt(dailyLimit),
            weeklyLimit: parseInt(weeklyLimit),
            color: `#${Math.floor(Math.random()*16777215).toString(16)}`
        };
        
        // Simulate campaign creation delay
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        // Add to campaigns
        appData.campaigns.push(newCampaign);
        
        hideLoading();
        closeCampaignWizard();
        
        showToast(`Campaign "${newCampaign.name}" created successfully!`, 'success');
        showPage('campaigns');
        
    } catch (error) {
        console.error('Campaign creation error:', error);
        hideLoading();
        showToast('Failed to create campaign. Please try again.', 'error');
    }
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up enhanced event listeners');
    
    // Landing page auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const heroGetStarted = document.getElementById('heroGetStarted');
    const heroDemo = document.getElementById('heroDemo');
    
    if (loginBtn) loginBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal(false);
    });
    
    if (signupBtn) signupBtn.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal(true);
    });
    
    if (heroGetStarted) heroGetStarted.addEventListener('click', (e) => {
        e.preventDefault();
        showAuthModal(true);
    });
    
    if (heroDemo) heroDemo.addEventListener('click', (e) => {
        e.preventDefault();
        showToast('Demo: Sign in with demo@salesforge.ai to explore all features!', 'info');
    });
    
    // Auth modal controls
    const closeAuthModalBtn = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (closeAuthModalBtn) closeAuthModalBtn.addEventListener('click', closeAuthModal);
    
    if (switchToSignup) switchToSignup.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('loginForm').classList.add('hidden');
        document.getElementById('signupForm').classList.remove('hidden');
    });
    
    if (switchToLogin) switchToLogin.addEventListener('click', (e) => {
        e.preventDefault();
        document.getElementById('signupForm').classList.add('hidden');
        document.getElementById('loginForm').classList.remove('hidden');
    });
    
    // Auth form submissions
    const loginForm = document.querySelector('#loginForm form');
    const signupForm = document.querySelector('#signupForm form');
    
    if (loginForm) loginForm.addEventListener('submit', handleLogin);
    if (signupForm) signupForm.addEventListener('submit', handleSignup);
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(item.dataset.page);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) logoutBtn.addEventListener('click', logout);
    
    // Campaign creation
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    const newCampaignBtn = document.getElementById('newCampaignBtn');
    
    if (createCampaignBtn) createCampaignBtn.addEventListener('click', showCampaignWizard);
    if (newCampaignBtn) newCampaignBtn.addEventListener('click', showCampaignWizard);
    
    // Campaign wizard controls
    const closeCampaignWizardBtn = document.getElementById('closeCampaignWizard');
    const wizardBack = document.getElementById('wizardBack');
    const wizardNext = document.getElementById('wizardNext');
    const wizardCreate = document.getElementById('wizardCreate');
    
    if (closeCampaignWizardBtn) closeCampaignWizardBtn.addEventListener('click', closeCampaignWizard);
    if (wizardBack) wizardBack.addEventListener('click', prevWizardStep);
    if (wizardNext) wizardNext.addEventListener('click', nextWizardStep);
    if (wizardCreate) wizardCreate.addEventListener('click', createCampaign);
    
    // Message composer controls
    const closeComposerModalBtn = document.getElementById('closeComposerModal');
    const regenerateMessage = document.getElementById('regenerateMessage');
    const sendMessageBtn = document.getElementById('sendMessage');
    const improveMessageBtn = document.getElementById('improveMessage');
    const scheduleMessageBtn = document.getElementById('scheduleMessage');
    
    if (closeComposerModalBtn) closeComposerModalBtn.addEventListener('click', closeMessageComposer);
    if (regenerateMessage) regenerateMessage.addEventListener('click', () => generateAIMessage());
    if (sendMessageBtn) sendMessageBtn.addEventListener('click', sendComposedMessage);
    if (improveMessageBtn) improveMessageBtn.addEventListener('click', improveMessage);
    if (scheduleMessageBtn) scheduleMessageBtn.addEventListener('click', scheduleMessage);
    
    // Profile analysis controls
    const closeAnalysisModalBtn = document.getElementById('closeAnalysisModal');
    const generateMessageFromAnalysis = document.getElementById('generateMessageFromAnalysis');
    
    if (closeAnalysisModalBtn) closeAnalysisModalBtn.addEventListener('click', closeProfileAnalysis);
    if (generateMessageFromAnalysis) generateMessageFromAnalysis.addEventListener('click', () => {
        closeProfileAnalysis();
        composeMessage(selectedProspect.id);
    });
    
    // Bulk actions
    const analyzeProspectsBtn = document.getElementById('analyzeProspectsBtn');
    const closeBulkModalBtn = document.getElementById('closeBulkModal');
    
    if (analyzeProspectsBtn) analyzeProspectsBtn.addEventListener('click', analyzeAllProspects);
    if (closeBulkModalBtn) closeBulkModalBtn.addEventListener('click', closeBulkActions);
    
    // Bulk action buttons
    document.querySelectorAll('.bulk-action-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const action = btn.dataset.action;
            performBulkAction(action);
        });
    });
    
    // Message composer toolbar
    document.querySelectorAll('.toolbar-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            document.querySelectorAll('.toolbar-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const messageType = btn.dataset.type;
            generateAIMessage(messageType);
        });
    });
    
    // Message character counter
    const messageContent = document.getElementById('messageContent');
    if (messageContent) {
        messageContent.addEventListener('input', (e) => {
            const charCount = document.getElementById('charCount');
            if (charCount) {
                charCount.textContent = e.target.value.length;
            }
        });
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing SalesForge AI');
    setupEventListeners();
    
    // Always show landing page first
    showPage('landing');
    
    updateNavigation();
    console.log('SalesForge AI initialization complete');
});

// Make functions available globally for HTML onclick handlers
window.editCampaign = editCampaign;
window.viewCampaign = viewCampaign;
window.toggleCampaignStatus = toggleCampaignStatus;
window.composeMessage = composeMessage;
window.analyzeProspect = analyzeProspect;
window.viewProspectDetails = viewProspectDetails;
window.viewLinkedInProfile = viewLinkedInProfile;
window.selectConversation = selectConversation;
window.handleProspectSelection = handleProspectSelection;
window.showCampaignWizard = showCampaignWizard;
window.editSequence = editSequence;
window.viewSequenceProspects = viewSequenceProspects;