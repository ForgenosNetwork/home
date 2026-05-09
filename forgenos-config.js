const FORGENOS_CONFIG = {
    // === 🎨 THEME COLOR SETTINGS ===
    // Logo hamesha Orange rahega. Ye color buttons, links, glow aur slider ke liye hai.
    // Aap isko badal sakte hain (eg: '#3b82f6' for Blue, '#10b981' for Green)
    brandColor: '#FA8F42', 

    // === 📐 LAYOUT ALIGNMENT ===
    // Home page ka Top Section kahan dikhega?
    // Options: 'left', 'center', 'right'
    layout: {
        alignment: 'left' 
    },

    // === 🔠 HERO TEXT SETTINGS ===
    hero: {
        titleSize: 'text-4xl md:text-6xl', // Text bada/chota karne ke liye (eg: 'text-5xl md:text-7xl')
        effect: 'animate-fade-up', // Options: 'animate-fade-up', 'animate-pulse', '' (for no effect)
        rollingWords: ['Toolkit', 'Dashboard', 'Partner', 'Resource', 'Experience']
    },

    // === 🖼️ HERO BANNER SLIDER ===
    // Banner mein kaunse tools dikhane hain unki IDs yahan daalein
    sliderToolIds: [25, 1, 58],

    // === 🔥 TRENDING TOOLS ===
    // Trending section mein dikhne wale tools ki IDs
    trendingToolIds: [24, 30, 46, 62],
    
    // === 📢 ANNOUNCEMENT POPUP ===
    announcement: {
        enabled: false,
        id: 'announce_v3', 
        delaySeconds: 5,
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
        category: 'Update',
        title: 'New Features Added',
        description: 'Check out the new customizable dashboard and smooth navigation.',
        buttonText: 'Explore',
        buttonLink: 'https://forgenos.com/'
    }
};
