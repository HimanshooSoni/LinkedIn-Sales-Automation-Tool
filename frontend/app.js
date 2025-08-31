



// SalesForge AI - Premium LinkedIn Sales Automation Tool
// Original UI Preserved + Working Demo

// Application state
let currentUser = null;
let currentPage = 'dashboard';
let selectedProspect = null;
let campaignWizardStep = 1;
let performanceChart = null;
let responseChart = null;

// Application data from the provided JSON
const appData = {
    campaigns: [
        {
            id: 1,
            name: "Enterprise SaaS Q4",
            targetIndustry: "SaaS",
            targetRoles: ["VP Engineering", "CTO", "Head of Product"],
            companySize: "200-1000",
            region: "North America",
            brandVoice: "professional",
            productService: "Enterprise-grade AI development platform for scaling engineering teams",
            outreachGoals: ["demo", "call"],
            status: "active",
            created: "2025-08-20T10:00:00Z",
            prospects: 45,
            contacted: 32,
            responded: 12,
            responseRate: 37.5,
            color: "#0ea5e9"
        },
        {
            id: 2,
            name: "FinTech Expansion",
            targetIndustry: "FinTech",
            targetRoles: ["Chief Technology Officer", "Head of Innovation"],
            companySize: "500+",
            region: "Europe",
            brandVoice: "consultative",
            productService: "Compliance-first API platform for financial services",
            outreachGoals: ["demo", "partnership"],
            status: "active",
            created: "2025-08-15T14:30:00Z",
            prospects: 28,
            contacted: 25,
            responded: 8,
            responseRate: 32.0,
            color: "#10b981"
        },
        {
            id: 3,
            name: "Healthcare Innovation",
            targetIndustry: "Healthcare",
            targetRoles: ["CIO", "Chief Medical Officer", "VP Technology"],
            companySize: "1000+",
            region: "Global",
            brandVoice: "formal",
            productService: "HIPAA-compliant patient data analytics platform",
            outreachGoals: ["demo"],
            status: "paused",
            created: "2025-08-10T09:15:00Z",
            prospects: 18,
            contacted: 15,
            responded: 4,
            responseRate: 26.7,
            color: "#8b5cf6"
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
            status: "responded",
            priority: "high",
            tags: ["decision-maker", "ai-interested", "scaling-team"],
            analysis: {
                background: "Seasoned engineering leader with expertise in AI/ML implementations and team scaling",
                interests: ["Machine Learning", "Engineering Leadership", "Developer Tools", "Team Productivity"],
                painPoints: ["Legacy system modernization", "Developer productivity", "AI integration challenges"],
                communicationStyle: "Data-driven and direct",
                bestApproach: "Focus on ROI metrics and technical implementation details"
            },
            lastContact: "2025-08-27T16:45:00Z",
            nextFollowUp: "2025-08-30T10:00:00Z",
            engagement: 85
        },
        {
            id: 2,
            campaignId: 1,
            name: "David Rodriguez",
            title: "CTO",
            company: "InnovateLabs",
            linkedinUrl: "https://linkedin.com/in/davidrodriguez",
            status: "contacted",
            priority: "medium",
            tags: ["startup-cto", "growth-focused"],
            analysis: {
                background: "Startup CTO focused on rapid growth and technical innovation",
                interests: ["Startup Growth", "Technical Strategy", "Team Building"],
                painPoints: ["Rapid scaling challenges", "Technical debt management"],
                communicationStyle: "Enthusiastic and forward-thinking",
                bestApproach: "Emphasize speed to market and competitive advantages"
            },
            lastContact: "2025-08-26T11:20:00Z",
            engagement: 65
        },
        {
            id: 3,
            campaignId: 2,
            name: "Sophie Mueller",
            title: "Head of Innovation",
            company: "European FinBank",
            linkedinUrl: "https://linkedin.com/in/sophiemueller",
            status: "pending",
            priority: "high",
            tags: ["innovation-leader", "fintech-expert", "compliance-focused"],
            analysis: {
                background: "Innovation leader specializing in financial technology and regulatory compliance",
                interests: ["Financial Innovation", "RegTech", "Digital Transformation"],
                painPoints: ["Regulatory compliance", "Legacy system integration", "Innovation speed"],
                communicationStyle: "Thorough and compliance-focused",
                bestApproach: "Highlight regulatory benefits and risk mitigation"
            },
            engagement: 40
        }
    ],
    messageTemplates: [
        {
            id: 1,
            name: "Enterprise Introduction",
            type: "connection",
            brandVoice: "professional",
            template: "Hi {{name}}, I noticed your work in {{industry}} and thought you might be interested in how {{company}} achieved {{metric}}% improvement in {{painPoint}}. Would love to share some insights that could be relevant for {{prospect_company}}. Open to a brief conversation?",
            tags: ["enterprise", "metrics-focused"]
        },
        {
            id: 2,
            name: "Innovation Follow-up",
            type: "follow_up",
            brandVoice: "consultative",
            template: "Following up on my previous message about {{topic}}. I came across {{relevant_news}} about {{prospect_company}} and thought this might be an interesting time to explore {{solution_benefit}}. Worth a 15-minute conversation?",
            tags: ["follow-up", "news-based"]
        }
    ],
    analytics: {
        totalCampaigns: 3,
        totalProspects: 91,
        totalContacted: 72,
        totalResponded: 24,
        overallResponseRate: 33.3,
        thisWeekStats: {
            messagesSpent: 28,
            newResponses: 7,
            newProspects: 12,
            campaignsActive: 2
        },
        topPerformingCampaign: "Enterprise SaaS Q4",
        bestResponseRate: 37.5
    },
    // Form options
    industries: ["SaaS", "FinTech", "Healthcare", "EdTech", "E-commerce", "Manufacturing", "Consulting", "Real Estate"],
    companySizes: ["1-50", "50-200", "200-1000", "1000+"],
    regions: ["North America", "Europe", "Asia Pacific", "Global", "United Kingdom", "Australia"],
    jobRoles: ["CEO", "CTO", "VP Engineering", "Head of Product", "Head of Innovation", "Chief Technology Officer", "VP Sales", "Head of Marketing"],
    brandVoices: [
        { value: "professional", label: "Professional", description: "Formal and structured" },
        { value: "friendly", label: "Friendly", description: "Warm and approachable" },
        { value: "consultative", label: "Consultative", description: "Expert and advisory" }
    ],
    outreachGoals: [
        { value: "demo", label: "Book Demo", icon: "🎯" },
        { value: "call", label: "Schedule Call", icon: "📞" },
        { value: "partnership", label: "Partnership", icon: "🤝" }
    ]
};

// Utility Functions
function showToast(message, type = 'success') {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
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

// Authentication
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

function handleLogin(e) {
    e.preventDefault();
    console.log('Handling login');
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        currentUser = {
            name: 'Demo User',
            email: 'demo@salesforge.ai'
        };
        closeAuthModal();
        showToast('Welcome back! Successfully logged in.', 'success');
        showPage('dashboard');
    }, 1500);
}

function handleSignup(e) {
    e.preventDefault();
    console.log('Handling signup');
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        currentUser = {
            name: 'New User',
            email: 'user@example.com'
        };
        closeAuthModal();
        showToast('Account created successfully! Welcome to SalesForge AI.', 'success');
        showPage('dashboard');
    }, 1500);
}

function logout() {
    currentUser = null;
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
}

function updateDashboardStats() {
    const totalCampaigns = appData.campaigns.filter(c => c.status === 'active').length;
    const totalProspects = appData.analytics.totalProspects;
    const responseRate = appData.analytics.overallResponseRate;
    
    const totalCampaignsEl = document.getElementById('totalCampaigns');
    const totalProspectsEl = document.getElementById('totalProspects');
    const responseRateEl = document.getElementById('responseRate');
    
    if (totalCampaignsEl) totalCampaignsEl.textContent = totalCampaigns;
    if (totalProspectsEl) totalProspectsEl.textContent = totalProspects;
    if (responseRateEl) responseRateEl.textContent = responseRate + '%';
    
    // Animate progress ring
    const progressRing = document.querySelector('.progress-ring-progress');
    if (progressRing) {
        const circumference = 2 * Math.PI * 40;
        const offset = circumference - (responseRate / 100) * circumference;
        progressRing.style.strokeDashoffset = offset;
    }
}

function loadRecentCampaigns() {
    const campaignsList = document.getElementById('campaignsList');
    if (!campaignsList) return;
    
    const recentCampaigns = appData.campaigns.slice(0, 3);
    
    campaignsList.innerHTML = recentCampaigns.map(campaign => `
        <div class="campaign-card">
            <div class="campaign-header">
                <h4>${campaign.name}</h4>
                <span class="campaign-status ${campaign.status}">${campaign.status}</span>
            </div>
            <p class="campaign-meta">
                ${campaign.targetIndustry} • ${formatDate(campaign.created)}
            </p>
            <div class="campaign-stats">
                <div class="stat">
                    <strong>${campaign.prospects}</strong>
                    <span>Prospects</span>
                </div>
                <div class="stat">
                    <strong>${campaign.contacted}</strong>
                    <span>Contacted</span>
                </div>
                <div class="stat">
                    <strong>${campaign.responded}</strong>
                    <span>Responded</span>
                </div>
            </div>
            <p class="campaign-product">${campaign.productService.substring(0, 120)}...</p>
            <div class="campaign-actions">
                <button onclick="editCampaign(${campaign.id})" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="viewCampaignProspects(${campaign.id})" class="btn btn-primary btn-sm">View Prospects</button>
            </div>
        </div>
    `).join('');
}

// Campaign Functions
function loadCampaigns() {
    const campaignsGrid = document.getElementById('campaignsGrid');
    if (!campaignsGrid) return;
    
    campaignsGrid.innerHTML = appData.campaigns.map(campaign => `
        <div class="campaign-card">
            <div class="campaign-header">
                <h3>${campaign.name}</h3>
                <span class="campaign-status ${campaign.status}">${campaign.status}</span>
            </div>
            <p class="campaign-description">
                ${campaign.targetIndustry} • ${campaign.region}
            </p>
            <div class="campaign-stats">
                <div class="stat">
                    <span class="stat-value">${campaign.prospects}</span>
                    <span class="stat-label">Prospects</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${campaign.contacted}</span>
                    <span class="stat-label">Contacted</span>
                </div>
                <div class="stat">
                    <span class="stat-value">${campaign.responseRate.toFixed(1)}%</span>
                    <span class="stat-label">Response Rate</span>
                </div>
            </div>
            <p class="campaign-product">${campaign.productService.substring(0, 120)}...</p>
            <div class="campaign-actions">
                <button onclick="editCampaign(${campaign.id})" class="btn btn-secondary btn-sm">Edit</button>
                <button onclick="viewCampaignProspects(${campaign.id})" class="btn btn-primary btn-sm">View Prospects</button>
            </div>
        </div>
    `).join('');
}

function editCampaign(campaignId) {
    showToast('Campaign editing functionality coming soon!', 'info');
}

function viewCampaignProspects(campaignId) {
    showPage('prospects');
    filterProspects(campaignId);
}

// Prospect Functions
function loadProspects() {
    const prospectsTable = document.getElementById('prospectsTable');
    if (!prospectsTable) return;
    
    prospectsTable.innerHTML = appData.prospects.map(prospect => `
        <div class="prospect-card">
            <div class="prospect-info">
                <h4>${prospect.name}</h4>
                <p>${prospect.title} at ${prospect.company}</p>
                <div class="prospect-tags">
                    ${prospect.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="prospect-meta">
                <span class="priority ${prospect.priority}">${prospect.priority}</span>
                <span class="engagement">${prospect.engagement}%</span>
                <span class="status ${prospect.status}">${prospect.status}</span>
            </div>
            <div class="prospect-actions">
                <button onclick="composeMessage(${prospect.id})" class="btn btn-primary btn-sm">Message</button>
                <button onclick="viewLinkedInProfile('${prospect.linkedinUrl}')" class="btn btn-secondary btn-sm">LinkedIn</button>
            </div>
        </div>
    `).join('');
}

function filterProspects(campaignId = null) {
    const prospectsTable = document.getElementById('prospectsTable');
    if (!prospectsTable) return;
    
    let filteredProspects = appData.prospects;
    if (campaignId) {
        filteredProspects = appData.prospects.filter(p => p.campaignId === campaignId);
    }
    
    prospectsTable.innerHTML = filteredProspects.map(prospect => `
        <div class="prospect-card">
            <div class="prospect-info">
                <h4>${prospect.name}</h4>
                <p>${prospect.title} at ${prospect.company}</p>
                <div class="prospect-tags">
                    ${prospect.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
            <div class="prospect-meta">
                <span class="priority ${prospect.priority}">${prospect.priority}</span>
                <span class="engagement">${prospect.engagement}%</span>
                <span class="status ${prospect.status}">${prospect.status}</span>
            </div>
            <div class="prospect-actions">
                <button onclick="composeMessage(${prospect.id})" class="btn btn-primary btn-sm">Message</button>
                <button onclick="viewLinkedInProfile('${prospect.linkedinUrl}')" class="btn btn-secondary btn-sm">LinkedIn</button>
            </div>
        </div>
    `).join('');
}

function composeMessage(prospectId) {
    selectedProspect = appData.prospects.find(p => p.id === prospectId);
    if (!selectedProspect) return;
    
    const modal = document.getElementById('messageComposerModal');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Update prospect info
        const prospectPreview = document.getElementById('prospectPreview');
        if (prospectPreview) {
            prospectPreview.innerHTML = `
                <h4>${selectedProspect.name}</h4>
                <p>${selectedProspect.title} at ${selectedProspected.company}</p>
            `;
        }
        
        // Generate AI message
        generateAIMessage();
    }
}

function closeMessageComposer() {
    const modal = document.getElementById('messageComposerModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    selectedProspect = null;
}

function generateAIMessage() {
    if (!selectedProspect) return;
    
    const messageContent = document.getElementById('messageContent');
    if (!messageContent) return;
    
    showLoading();
    
    // Demo AI message generation
    setTimeout(() => {
        const templates = [
            `Hi ${selectedProspect.name}, I noticed your work in ${selectedProspect.analysis.interests[0]} and thought you might find our platform interesting. Would love to share some insights that could be relevant for ${selectedProspect.company}.`,
            `Hello ${selectedProspect.name}, I came across ${selectedProspect.company} and was impressed by your focus on ${selectedProspect.analysis.interests[1] || 'innovation'}. Our platform has helped similar companies achieve significant improvements. Open to a brief conversation?`,
            `Hi ${selectedProspect.name}, given your role at ${selectedProspect.company} and expertise in ${selectedProspect.analysis.interests[0] || 'technology'}, I believe our solution could provide substantial value. Would you be interested in a 15-minute discussion?`
        ];
        
        const randomTemplate = templates[Math.floor(Math.random() * templates.length)];
        messageContent.value = randomTemplate;
        hideLoading();
    }, 1000);
}

function sendComposedMessage() {
    if (!selectedProspect) return;
    
    const messageContent = document.getElementById('messageContent');
    if (!messageContent || !messageContent.value.trim()) {
        showToast('Please enter a message', 'error');
        return;
    }
    
    showLoading();
    
    // Demo send message
    setTimeout(() => {
        hideLoading();
        closeMessageComposer();
        showToast('Message sent successfully!', 'success');
        
        // Update prospect status
        selectedProspect.status = 'contacted';
        if (currentPage === 'prospects') {
            loadProspects();
        }
    }, 1000);
}

function viewLinkedInProfile(url) {
    window.open(url, '_blank');
}

// Message Functions
function loadMessages() {
    const conversationList = document.getElementById('conversationList');
    if (conversationList) {
        conversationList.innerHTML = `
            <div class="empty-state">
                <h3>Select a conversation</h3>
                <p>Choose a prospect to start messaging</p>
            </div>
        `;
    }
}

function selectConversation(prospectId) {
    selectedProspect = appData.prospects.find(p => p.id === prospectId);
    if (!selectedProspect) return;
    
    const chatContainer = document.getElementById('chatContainer');
    if (chatContainer) {
        chatContainer.innerHTML = `
            <div class="conversation-header">
                <h3>${selectedProspect.name}</h3>
                <p>${selectedProspect.title} at ${selectedProspect.company}</p>
            </div>
            <div class="messages">
                <p>No messages yet. Start the conversation!</p>
            </div>
        `;
    }
}

function sendMessage() {
    showToast('Message sent successfully!', 'success');
}

// Analytics Functions
function loadAnalytics() {
    setTimeout(() => {
        initializeCharts();
    }, 100);
}

function initializeCharts() {
    // Performance Overview Chart
    const performanceCtx = document.getElementById('performanceChart');
    if (performanceCtx && !performanceChart) {
        performanceChart = new Chart(performanceCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
                datasets: [{
                    label: 'Messages Sent',
                    data: [120, 190, 300, 500, 420, 600, 720],
                    borderColor: '#0ea5e9',
                    backgroundColor: 'rgba(14, 165, 233, 0.1)',
                    fill: true,
                    tension: 0.4
                }, {
                    label: 'Responses',
                    data: [40, 65, 95, 160, 140, 200, 240],
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
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
                    data: [24, 48, 19],
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
}

// Campaign Wizard Functions
function showCampaignWizard() {
    const wizardModal = document.getElementById('campaignWizardModal');
    if (wizardModal) {
        wizardModal.classList.remove('hidden');
        resetCampaignWizard();
        populateWizardOptions();
    }
}

function closeCampaignWizard() {
    const wizardModal = document.getElementById('campaignWizardModal');
    if (wizardModal) {
        wizardModal.classList.add('hidden');
    }
}

function resetCampaignWizard() {
    campaignWizardStep = 1;
    updateWizardStep();
}

function populateWizardOptions() {
    // Populate industry dropdown
    const industrySelect = document.querySelector('select[name="industry"]');
    if (industrySelect) {
        industrySelect.innerHTML = '<option value="">Select Industry</option>' +
            appData.industries.map(industry => `<option value="${industry}">${industry}</option>`).join('');
    }
    
    // Populate company size dropdown
    const companySizeSelect = document.querySelector('select[name="companySize"]');
    if (companySizeSelect) {
        companySizeSelect.innerHTML = '<option value="">Select Size</option>' +
            appData.companySizes.map(size => `<option value="${size}">${size}</option>`).join('');
    }
    
    // Populate brand voice options
    const voiceSelector = document.querySelector('.voice-selector');
    if (voiceSelector) {
        voiceSelector.innerHTML = appData.brandVoices.map(voice => `
            <label class="voice-option">
                <input type="radio" name="brandVoice" value="${voice.value}">
                <div class="voice-card">
                    <h4>${voice.label}</h4>
                    <p>${voice.description}</p>
                </div>
            </label>
        `).join('');
    }
    
    // Populate outreach goals
    const goalSelector = document.querySelector('.goal-selector');
    if (goalSelector) {
        goalSelector.innerHTML = appData.outreachGoals.map(goal => `
            <label class="goal-option">
                <input type="checkbox" name="outreachGoals" value="${goal.value}">
                <div class="goal-card">
                    <span class="goal-icon">${goal.icon}</span>
                    <span class="goal-label">${goal.label}</span>
                </div>
            </label>
        `).join('');
    }
}

function updateWizardStep() {
    // Update progress steps
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        if (index + 1 <= campaignWizardStep) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
    
    // Show/hide wizard steps
    document.querySelectorAll('.wizard-step').forEach((step, index) => {
        if (index + 1 === campaignWizardStep) {
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
        if (campaignWizardStep === 3) {
            nextBtn.classList.add('hidden');
            createBtn.classList.remove('hidden');
        } else {
            nextBtn.classList.remove('hidden');
            createBtn.classList.add('hidden');
        }
    }
}

function nextWizardStep() {
    if (campaignWizardStep < 3) {
        campaignWizardStep++;
        updateWizardStep();
    }
}

function prevWizardStep() {
    if (campaignWizardStep > 1) {
        campaignWizardStep--;
        updateWizardStep();
    }
}

function createCampaign() {
    showLoading();
    
    setTimeout(() => {
        hideLoading();
        closeCampaignWizard();
        showToast('Campaign created successfully!', 'success');
        showPage('campaigns');
    }, 1500);
}

// Event Listeners Setup
function setupEventListeners() {
    console.log('Setting up event listeners');
    
    // Landing page auth buttons
    const loginBtn = document.getElementById('loginBtn');
    const signupBtn = document.getElementById('signupBtn');
    const heroGetStarted = document.getElementById('heroGetStarted');
    const heroDemo = document.getElementById('heroDemo');
    
    if (loginBtn) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal(false);
        });
    }
    
    if (signupBtn) {
        signupBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal(true);
        });
    }
    
    if (heroGetStarted) {
        heroGetStarted.addEventListener('click', (e) => {
            e.preventDefault();
            showAuthModal(true);
        });
    }
    
    if (heroDemo) {
        heroDemo.addEventListener('click', (e) => {
            e.preventDefault();
            showToast('Demo functionality would be implemented here', 'info');
        });
    }
    
    // Auth modal controls
    const closeAuthModalBtn = document.getElementById('closeAuthModal');
    const switchToSignup = document.getElementById('switchToSignup');
    const switchToLogin = document.getElementById('switchToLogin');
    
    if (closeAuthModalBtn) {
        closeAuthModalBtn.addEventListener('click', closeAuthModal);
    }
    
    if (switchToSignup) {
        switchToSignup.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('loginForm').classList.add('hidden');
            document.getElementById('signupForm').classList.remove('hidden');
        });
    }
    
    if (switchToLogin) {
        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            document.getElementById('signupForm').classList.add('hidden');
            document.getElementById('loginForm').classList.remove('hidden');
        });
    }
    
    // Auth form submissions
    const loginForm = document.querySelector('#loginForm form');
    const signupForm = document.querySelector('#signupForm form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
    
    // Navigation
    document.querySelectorAll('.nav-item').forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            showPage(item.dataset.page);
        });
    });
    
    // Logout
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', logout);
    }
    
    // Campaign creation
    const createCampaignBtn = document.getElementById('createCampaignBtn');
    const newCampaignBtn = document.getElementById('newCampaignBtn');
    
    if (createCampaignBtn) {
        createCampaignBtn.addEventListener('click', showCampaignWizard);
    }
    
    if (newCampaignBtn) {
        newCampaignBtn.addEventListener('click', showCampaignWizard);
    }
    
    // Campaign wizard controls
    const closeCampaignWizardBtn = document.getElementById('closeCampaignWizard');
    const wizardBack = document.getElementById('wizardBack');
    const wizardNext = document.getElementById('wizardNext');
    const wizardCreate = document.getElementById('wizardCreate');
    
    if (closeCampaignWizardBtn) {
        closeCampaignWizardBtn.addEventListener('click', closeCampaignWizard);
    }
    
    if (wizardBack) {
        wizardBack.addEventListener('click', prevWizardStep);
    }
    
    if (wizardNext) {
        wizardNext.addEventListener('click', nextWizardStep);
    }
    
    if (wizardCreate) {
        wizardCreate.addEventListener('click', createCampaign);
    }
    
    // Message composer controls
    const closeComposerModalBtn = document.getElementById('closeComposerModal');
    const regenerateMessage = document.getElementById('regenerateMessage');
    const sendMessageBtn = document.getElementById('sendMessage');
    
    if (closeComposerModalBtn) {
        closeComposerModalBtn.addEventListener('click', closeMessageComposer);
    }
    
    if (regenerateMessage) {
        regenerateMessage.addEventListener('click', generateAIMessage);
    }
    
    if (sendMessageBtn) {
        sendMessageBtn.addEventListener('click', sendComposedMessage);
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded - Initializing app');
    setupEventListeners();
    
    // ALWAYS SHOW LANDING PAGE FIRST
    showPage('landing');
    
    updateNavigation();
    console.log('App initialization complete');
});

// Make functions available globally for HTML onclick handlers
window.editCampaign = editCampaign;
window.viewCampaignProspects = viewCampaignProspects;
window.composeMessage = composeMessage;
window.viewLinkedInProfile = viewLinkedInProfile;
window.selectConversation = selectConversation;
window.sendMessage = sendMessage;
window.showCampaignWizard = showCampaignWizard;