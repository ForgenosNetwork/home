import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';

// ========== SUPABASE CONFIG ==========
const SUPABASE_URL = 'https://pyllqiygyxunhzhibmvw.supabase.co'; 
const SUPABASE_ANON_KEY = 'sb_publishable_rPns9_1aQ15LO6fSQJAFQw_cM0geUuf'; 

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// ========== EXPOSE MAIN CLIENT TO WINDOW ==========
// Critical: handleGoogleLoginState uses this to avoid creating a duplicate Supabase instance
window.supabaseClient = supabase;

// ========== RELOAD GUARD ==========
// Blocks any accidental page.reload() that Supabase OAuth processing might trigger internally
window._blockReload = false;
(function() {
    try {
        const _nativeReload = window.location.reload.bind(window.location);
        Object.defineProperty(window.location, 'reload', {
            configurable: true,
            value: function() {
                if (window._blockReload) {
                    console.warn('[ForgenosAuth] Shield: Reload blocked during active auth flow');
                    return;
                }
                _nativeReload();
            }
        });
    } catch(e) { /* Safari strict-mode: silently skips, native reload remains */ }
})();

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

// ========== LOGIN WITH GOOGLE (OAuth REDIRECT — NOT USED BY MODAL) ==========
// WARNING: This function causes a full page redirect (reload by design).
// The modal button uses handleGoogleLoginState() (GIS One Tap flow) instead.
// Only call this as a last-resort fallback.
export async function loginWithGoogle() {
    try {
        window.showToast('Redirecting to Google Secure Login...', 'info');
        
        const { error } = await supabase.auth.signInWithOAuth({
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
    const creditsContainer = document.getElementById('credits-display-container');
    const emailDisplay = document.getElementById('user-email-display');
    const dropdownEmail = document.getElementById('dropdown-email');
    const avatarContainer = document.getElementById('user-avatar-container');
    
    if (window.authState.isAuthenticated) {
        if (loginBtn) loginBtn.classList.add('hidden');
        if (userProfileBtn) userProfileBtn.classList.remove('hidden');
        if (creditsContainer) { creditsContainer.classList.remove('hidden'); creditsContainer.classList.add('flex'); }
        if (creditsDisplay) creditsDisplay.textContent = window.authState.credits;
        
        if (window.authState.user) {
            const email = window.authState.user.email;
            const metadata = window.authState.user.user_metadata || {};
            
            if (emailDisplay) {
                emailDisplay.textContent = metadata.full_name || email.split('@')[0];
            }
            if (dropdownEmail) dropdownEmail.textContent = email;
            
            if (avatarContainer && avatarContainer.dataset.loadedEmail !== email) {
                if (metadata.avatar_url) {
                    avatarContainer.innerHTML = `<img src="${metadata.avatar_url}" class="w-full h-full object-cover" referrerpolicy="no-referrer" alt="User Avatar">`;
                } else {
                    avatarContainer.innerHTML = `<span id="user-avatar" class="text-white text-xs font-black">${email.charAt(0).toUpperCase()}</span>`;
                }
                avatarContainer.dataset.loadedEmail = email;
            }
        }
    } else {
        if (loginBtn) loginBtn.classList.remove('hidden');
        if (userProfileBtn) userProfileBtn.classList.add('hidden');
        if (creditsContainer) { creditsContainer.classList.add('hidden'); creditsContainer.classList.remove('flex'); }
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
