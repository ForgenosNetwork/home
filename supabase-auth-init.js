// ============================================
// 🔐 FORGENOS SUPABASE AUTH & CREDIT SYSTEM
// ============================================
// Inject this script BEFORE the main app initialization in your index.html
// Place it after the config.js import but before the main app logic

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ========== SUPABASE CONFIG ==========
const SUPABASE_URL = 'https://pyllqiygyxunhzhibmvw.supabase.co'; // Replace with your Supabase URL
const SUPABASE_ANON_KEY = 'sb_publishable_rPns9_1aQ15LO6fSQJAFQw_cM0geUuf'; // Replace with your anon key

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========== GLOBAL AUTH STATE ==========
window.authState = {
    user: null,
    session: null,
    credits: 0,
    profile: null,
    isLoading: true,
    isAuthenticated: false
};

// ========== INITIALIZE AUTH ==========
export async function initializeAuth() {
    try {
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            window.authState.session = session;
            window.authState.user = session.user;
            window.authState.isAuthenticated = true;
            
            // Fetch user profile and credits
            await fetchUserProfile();
        }
    } catch (error) {
        console.error('Auth initialization error:', error);
    } finally {
        window.authState.isLoading = false;
        updateAuthUI();
    }
}

// ========== FETCH USER PROFILE & CREDITS ==========
export async function fetchUserProfile() {
    if (!window.authState.user) return;
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', window.authState.user.id)
            .single();
        
        if (error && error.code === 'PGRST116') {
            // Profile doesn't exist, create one
            await createUserProfile();
        } else if (error) {
            throw error;
        } else {
            window.authState.profile = profile;
            window.authState.credits = profile.credits || 0;
        }
    } catch (error) {
        console.error('Error fetching profile:', error);
    }
}

// ========== CREATE NEW USER PROFILE ==========
export async function createUserProfile() {
    if (!window.authState.user) return;
    
    try {
        const { data: profile, error } = await supabase
            .from('profiles')
            .insert([
                {
                    id: window.authState.user.id,
                    email: window.authState.user.email,
                    credits: 50, // Default free credits
                    plan: 'free',
                    created_at: new Date().toISOString(),
                    updated_at: new Date().toISOString()
                }
            ])
            .select()
            .single();
        
        if (error) throw error;
        
        window.authState.profile = profile;
        window.authState.credits = 50;
        window.showToast('Welcome! You received 50 Free Credits', 'success');
        
    } catch (error) {
        console.error('Error creating profile:', error);
    }
}

// ========== LOGIN WITH GOOGLE ==========
export async function loginWithGoogle() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('Google login error:', error);
        window.showToast('Google login failed', 'error');
    }
}

// ========== LOGIN WITH GITHUB ==========
export async function loginWithGithub() {
    try {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: {
                redirectTo: window.location.origin
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('GitHub login error:', error);
        window.showToast('GitHub login failed', 'error');
    }
}

// ========== LOGOUT ==========
export async function logout() {
    try {
        const { error } = await supabase.auth.signOut();
        if (error) throw error;
        
        window.authState = {
            user: null,
            session: null,
            credits: 0,
            profile: null,
            isAuthenticated: false
        };
        
        updateAuthUI();
        window.showToast('Logged out successfully', 'success');
    } catch (error) {
        console.error('Logout error:', error);
    }
}

// ========== UPDATE AUTH UI ==========
function updateAuthUI() {
    const loginBtn = document.getElementById('auth-login-btn');
    const userProfileBtn = document.getElementById('auth-user-profile');
    const creditsDisplay = document.getElementById('credits-display');
    
    if (!loginBtn || !userProfileBtn) return;
    
    if (window.authState.isAuthenticated) {
        loginBtn.classList.add('hidden');
        userProfileBtn.classList.remove('hidden');
        if (creditsDisplay) creditsDisplay.textContent = window.authState.credits;
    } else {
        loginBtn.classList.remove('hidden');
        userProfileBtn.classList.add('hidden');
        if (creditsDisplay) creditsDisplay.textContent = '0';
    }
}

// ========== DEDUCT CREDITS (Server-side call) ==========
export async function deductCredits(amount = 1) {
    if (!window.authState.isAuthenticated) {
        window.showToast('Please login to use AI tools', 'error');
        return false;
    }
    
    if (window.authState.credits < amount) {
        window.showToast('Insufficient credits. Upgrade your plan.', 'error');
        return false;
    }
    
    try {
        const response = await fetch('/api/deduct-credits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                userId: window.authState.user.id,
                amount: amount
            })
        });
        
        const result = await response.json();
        
        if (result.success) {
            window.authState.credits = result.remainingCredits;
            updateAuthUI();
            return true;
        } else {
            window.showToast(result.error || 'Failed to deduct credits', 'error');
            return false;
        }
    } catch (error) {
        console.error('Credit deduction error:', error);
        window.showToast('Error processing credits', 'error');
        return false;
    }
}

// ========== LOCK/UNLOCK TOOLS BASED ON CREDITS ==========
export function checkToolAccess(toolId = null) {
    if (!window.authState.isAuthenticated || window.authState.credits <= 0) {
        // Lock all AI-powered tools
        const aiTools = document.querySelectorAll('[data-tool-type="ai"]');
        aiTools.forEach(tool => {
            const lockOverlay = document.createElement('div');
            lockOverlay.className = 'absolute inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center rounded-2xl z-10';
            lockOverlay.innerHTML = `
                <div class="text-center">
                    <div class="text-3xl mb-2">🔒</div>
                    <p class="text-sm text-gray-300 mb-3">Login & Buy Credits</p>
                    <button onclick="window.openAuthModal()" class="px-4 py-2 bg-[var(--brand-color)] rounded-lg text-sm font-medium hover:opacity-90">
                        Get Credits
                    </button>
                </div>
            `;
            
            if (!tool.querySelector('.lock-overlay')) {
                tool.style.position = 'relative';
                tool.appendChild(lockOverlay);
            }
        });
    }
}

// ========== LISTEN FOR AUTH CHANGES ==========
supabase.auth.onAuthStateChange(async (event, session) => {
    if (event === 'SIGNED_IN' && session) {
        window.authState.session = session;
        window.authState.user = session.user;
        window.authState.isAuthenticated = true;
        await fetchUserProfile();
        updateAuthUI();
        window.showToast('Successfully logged in!', 'success');
    } else if (event === 'SIGNED_OUT') {
        window.authState = {
            user: null,
            session: null,
            credits: 0,
            profile: null,
            isAuthenticated: false
        };
        updateAuthUI();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializeAuth);

// Export for use in other modules
window.supabaseAuth = {
    loginWithGoogle,
    loginWithGithub,
    logout,
    deductCredits,
    fetchUserProfile,
    checkToolAccess
};
