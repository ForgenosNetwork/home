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

        // 🔥 GOOGLE SECURITY FIX: Page load hote hi Google ko ek baar setup karo
        setupGoogleNativeAuth();

    } catch (error) {
        console.error('Auth initialization error:', error);
    } finally {
        window.authState.isLoading = false;
        updateAuthUI();
    }
}

// ========== SETUP GOOGLE SYSTEM (RUNS ONLY ONCE) ==========
function setupGoogleNativeAuth() {
    if (typeof google !== 'undefined' && google.accounts) {
        google.accounts.id.initialize({
            client_id: '903547456598-3i76ma312j9sdrgt78ugccj5vf4te1s1.apps.googleusercontent.com',
            callback: async (response) => {
                try {
                    if (response.credential) {
                        window.showToast('Authenticating with Secure Core...', 'info');
                        
                        const { data, error } = await supabase.auth.signInWithIdToken({
                            provider: 'google',
                            token: response.credential,
                        });
                        
                        if (error) throw error;
                        window.location.reload(); 
                    }
                } catch (err) {
                    console.error('Supabase Core Signin Error:', err);
                    window.showToast('Database authentication failed.', 'error');
                }
            }
        });
    }
}

// ========== LOGIN WITH GOOGLE (ONLY OPENS PROMPT) ==========
export async function loginWithGoogle() {
    if (typeof google === 'undefined' || !google.accounts) {
        window.showToast('Google services loading, please wait...', 'error');
        return;
    }
    
    // SETUP RE-CALL NAHI KARNA HAI. SIRF PROMPT TRIGGER KARNA HAI!
    google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed() || notification.isSkippedMoment()) {
            console.log('Google prompt overlay was skipped or closed.');
        }
    });
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
