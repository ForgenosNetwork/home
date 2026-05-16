import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ========== SUPABASE CONFIG ==========
const SUPABASE_URL = 'https://pyllqiygyxunhzhibmvw.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_rPns9_1aQ15LO6fSQJAFQw_cM0geUuf'; 

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
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
            window.authState.session = session;
            window.authState.user = session.user;
            window.authState.isAuthenticated = true;
            
            await fetchUserProfile();
        }
    } catch (error) {
        console.error('Auth initialization error:', error);
    } finally {
        window.authState.isLoading = false;
        updateAuthUI();
    }
}

// ========== LOGIN WITH GOOGLE (STANDARD BULLETPROOF FLOW) ==========
export async function loginWithGoogle() {
    try {
        window.showToast('Redirecting to Google Secure Login...', 'info');
        
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                // Yeh automatically check kar lega ki user forgenos.com par hai ya github.io par
                redirectTo: window.location.origin 
            }
        });
        
        if (error) throw error;
    } catch (error) {
        console.error('Google login error:', error);
        window.showToast('Google login failed', 'error');
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
                    credits: 50, 
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

// ========== LOGIN WITH GITHUB ==========
export async function loginWithGithub() {
    try {
        const { error } = await supabase.auth.signInWithOAuth({
            provider: 'github',
            options: { redirectTo: window.location.origin }
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
    const emailDisplay = document.getElementById('user-email-display');
    const dropdownEmail = document.getElementById('dropdown-email');
    const avatarSpan = document.getElementById('user-avatar');
    
    if (window.authState.isAuthenticated) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userProfileBtn) userProfileBtn.classList.remove('hidden');
        if (creditsDisplay) creditsDisplay.textContent = window.authState.credits;
        
        if (window.authState.user) {
            const email = window.authState.user.email;
            if (emailDisplay) emailDisplay.textContent = email.split('@')[0];
            if (dropdownEmail) dropdownEmail.textContent = email;
            if (avatarSpan) avatarSpan.textContent = email.charAt(0).toUpperCase();
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userProfileBtn) userProfileBtn.classList.add('hidden');
        if (creditsDisplay) creditsDisplay.textContent = '0';
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

document.addEventListener('DOMContentLoaded', initializeAuth);

window.supabaseAuth = {
    loginWithGoogle,
    loginWithGithub,
    logout,
    fetchUserProfile
};
