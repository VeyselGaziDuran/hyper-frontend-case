function generateRatingStars(rating) {
    const validRating = Math.max(0, Math.min(5, parseFloat(rating) || 0));
    
    let starsHTML = '';
    
    for (let i = 1; i <= 5; i++) {
        if (i <= Math.floor(validRating)) {
            starsHTML += '<i class="fas fa-star text-warning"></i>';
        } else if (i - 0.5 <= validRating) {
            starsHTML += '<i class="fas fa-star-half-alt text-warning"></i>';
        } else {
            starsHTML += '<i class="far fa-star text-warning"></i>';
        }
    }
    
    return starsHTML;
}

function getValidImageUrl(imageUrl, defaultUrl = 'https://picsum.photos/300/200') {
    if (!imageUrl) return defaultUrl;
    
    try {
        new URL(imageUrl);
        
        const lowerUrl = imageUrl.toLowerCase();
        if (lowerUrl.endsWith('.jpg') || 
            lowerUrl.endsWith('.jpeg') || 
            lowerUrl.endsWith('.png') || 
            lowerUrl.endsWith('.webp') || 
            lowerUrl.endsWith('.gif') ||
            lowerUrl.includes('image')) {
            return imageUrl;
        }
    } catch (e) {
        console.warn("Invalid image URL:", imageUrl);
    }
    
    return defaultUrl + '?random=' + Math.random().toString(36).substring(2, 10);
}