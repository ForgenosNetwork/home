// ============================================
// 🤖 SECURE AI API WRAPPER
// ============================================
// This is a client-side wrapper that calls your Vercel serverless backend
// The backend handles API key protection and credit deduction

/**
 * Universal fetchAI function for all AI-powered tools
 * @param {string} toolType - Type of AI tool ('image-generation', 'text-summarize', etc.)
 * @param {object} params - Tool-specific parameters
 * @returns {Promise<object>} - API response
 */
export async function fetchAI(toolType, params = {}) {
    // Verify user is authenticated
    if (!window.authState || !window.authState.isAuthenticated) {
        throw new Error('User must be logged in to use AI tools');
    }

    // Verify user has credits
    if (window.authState.credits <= 0) {
        throw new Error('Insufficient credits. Please buy credits.');
    }

    try {
        // Call the Vercel serverless function
        const response = await fetch('/api/generate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${window.authState.session.access_token}` // Include JWT token
            },
            body: JSON.stringify({
                toolType,
                params,
                userId: window.authState.user.id,
                email: window.authState.user.email
            })
        });

        // Handle response
        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.error || 'API request failed');
        }

        const data = await response.json();

        // Update local credits if deduction was successful
        if (data.creditsDeducted) {
            window.authState.credits = data.remainingCredits;
            updateCreditsDisplay();
            
            // Show success message
            if (data.creditsDeducted > 0) {
                window.showToast(`${data.creditsDeducted} credits used`, 'info');
            }
        }

        return data;

    } catch (error) {
        console.error('AI API Error:', error);
        window.showToast(error.message, 'error');
        throw error;
    }
}

/**
 * Generate image using Replicate API
 * @param {string} prompt - Image description
 * @param {object} options - Additional options (model, quality, etc.)
 */
export async function generateImage(prompt, options = {}) {
    const costPerGeneration = options.costPerGeneration || 5; // Deduct 5 credits per image

    try {
        const response = await fetchAI('image-generation', {
            prompt,
            model: options.model || 'stable-diffusion',
            quality: options.quality || 'standard',
            ...options
        });

        return {
            success: true,
            imageUrl: response.imageUrl,
            creditsUsed: costPerGeneration,
            remainingCredits: response.remainingCredits
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Generate text using Gemini API
 * @param {string} prompt - Text prompt
 * @param {object} options - Additional options
 */
export async function generateText(prompt, options = {}) {
    const costPerGeneration = options.costPerGeneration || 1; // Deduct 1 credit per text generation

    try {
        const response = await fetchAI('text-generation', {
            prompt,
            maxTokens: options.maxTokens || 500,
            temperature: options.temperature || 0.7,
            ...options
        });

        return {
            success: true,
            text: response.text,
            creditsUsed: costPerGeneration,
            remainingCredits: response.remainingCredits
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Process image with AI (enhancement, upscaling, etc.)
 * @param {string|File} imageInput - Image URL or File object
 * @param {string} operation - Type of operation
 */
export async function processImage(imageInput, operation = 'enhance') {
    const costPerOperation = 3; // Deduct 3 credits per image operation

    try {
        let imageData;
        
        // Convert File to base64 if needed
        if (imageInput instanceof File) {
            imageData = await fileToBase64(imageInput);
        } else {
            imageData = imageInput; // Assume it's already a URL or base64
        }

        const response = await fetchAI('image-processing', {
            imageData,
            operation,
            quality: 'high'
        });

        return {
            success: true,
            processedImage: response.processedImage,
            creditsUsed: costPerOperation,
            remainingCredits: response.remainingCredits
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Translate text using AI
 * @param {string} text - Text to translate
 * @param {string} targetLanguage - Target language code
 */
export async function translateText(text, targetLanguage = 'en') {
    const costPerTranslation = 2; // Deduct 2 credits per translation

    try {
        const response = await fetchAI('text-translation', {
            text,
            targetLanguage
        });

        return {
            success: true,
            translatedText: response.translatedText,
            creditsUsed: costPerTranslation,
            remainingCredits: response.remainingCredits
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

/**
 * Summarize text
 * @param {string} text - Text to summarize
 * @param {number} maxLength - Maximum length of summary
 */
export async function summarizeText(text, maxLength = 200) {
    const costPerSummary = 2; // Deduct 2 credits per summary

    try {
        const response = await fetchAI('text-summarization', {
            text,
            maxLength
        });

        return {
            success: true,
            summary: response.summary,
            creditsUsed: costPerSummary,
            remainingCredits: response.remainingCredits
        };

    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// ============================================
// HELPER FUNCTIONS
// ============================================

/**
 * Convert File object to base64 string
 */
function fileToBase64(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = error => reject(error);
    });
}

/**
 * Update credits display across the page
 */
function updateCreditsDisplay() {
    const creditsDisplay = document.getElementById('credits-display');
    const dropdownCredits = document.getElementById('dropdown-credits');
    
    if (creditsDisplay) creditsDisplay.textContent = window.authState.credits;
    if (dropdownCredits) dropdownCredits.textContent = window.authState.credits;
}

/**
 * Check if user has enough credits before performing action
 */
export function checkCredits(requiredCredits = 1) {
    if (!window.authState || !window.authState.isAuthenticated) {
        window.showToast('Please login first', 'error');
        window.openAuthModal();
        return false;
    }

    if (window.authState.credits < requiredCredits) {
        window.showToast(`Need ${requiredCredits} credits. You have ${window.authState.credits}`, 'warning');
        window.openCreditsModal();
        return false;
    }

    return true;
}

// Export all functions globally for use in tool pages
window.fetchAI = fetchAI;
window.generateImage = generateImage;
window.generateText = generateText;
window.processImage = processImage;
window.translateText = translateText;
window.summarizeText = summarizeText;
window.checkCredits = checkCredits;

// Export as ES6 module
export {
    fetchAI,
    generateImage,
    generateText,
    processImage,
    translateText,
    summarizeText,
    checkCredits,
    updateCreditsDisplay
};
