const FORGENOS_CONFIG = {
    // === 🎨 THEME COLOR SETTINGS ===
    // Yahan se aap poori website ka main color change kar sakte hain.
    // Default color orange hai ('#f97316'). Isko kisi bhi hex code (jaise '#3b82f6' for blue) se badlein.
    brandColor: '#a855f7', 

    // === 🖼️ HERO BANNER SLIDER ===
    // Yahan un tools ki IDs daalein jinhe aap home page ke top sliding banner mein dikhana chahte hain.
    // Aap kitni bhi IDs daal sakte hain.
    sliderToolIds: [25, 1, 58],

    // === 🔥 TRENDING TOOLS SETTINGS ===
    // Yahan un tools ki IDs daalein jinhe aap "Trending Tools" section mein dikhana chahte hain.
    trendingToolIds: [24, 30, 46, 62],
    
    // === 📢 ANNOUNCEMENT POPUP ===
    // Agar aapko website par naya update dikhana hai, toh enabled ko 'true' karein.
    announcement: {
        enabled: false,
        id: 'announce_v2', 
        delaySeconds: 5,
        image: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?q=80&w=600&auto=format&fit=crop',
        category: 'New Release',
        title: 'Welcome to Forgenos',
        description: 'Experience the next generation of digital utility infrastructure.',
        buttonText: 'Explore Now',
        buttonLink: 'https://forgenos.com/'
    }
};
