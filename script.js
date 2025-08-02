// DOM Elements
const loading = document.getElementById('loading');
const albumCover = document.getElementById('album-cover');
const albumPages = document.getElementById('album-pages');
const pages = document.querySelectorAll('.page');
const hugBtn = document.getElementById('hug-btn');
const hugPopup = document.getElementById('hug-popup');
const closePopup = document.getElementById('close-popup');
const sunflowerEffects = document.getElementById('sunflower-effects');
const petals = document.getElementById('petals');
const hugCount = document.getElementById('hug-count');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const currentPageSpan = document.getElementById('current-page');
const totalPagesSpan = document.getElementById('total-pages');
const closeAlbumBtn = document.getElementById('close-album');
const musicToggle = document.getElementById('music-toggle');
const bgMusic = document.getElementById('bg-music');
const bgMusicAlt = document.getElementById('bg-music-alt');
const surpriseBtn = document.getElementById('surprise-btn');
const surpriseContainer = document.getElementById('surprise-container');
const closeSurprise = document.getElementById('close-surprise');

// Variables
let currentPage = 0;
let isAlbumOpened = false;
let isAnimating = false;
let hugCounter = 0;
let petalCount = 0;
let isMusicPlaying = false;
let currentAudio = bgMusic;
let touchStartX = 0;
let touchStartY = 0;
let touchEndX = 0;
let touchEndY = 0;

// Initialize
window.addEventListener('load', () => {
    setTimeout(() => {
        loading.style.display = 'none';
        setupEventListeners();
        startPetalSystem();
        createSunflowerEffects();
        initializeAlbum();
        updateNavigation();
        setupMusic();
        
        // Add image protection after page loads
        setTimeout(() => {
            protectImages();
        }, 1000);
    }, 3000);
});

// Image protection function
function protectImages() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Add additional protection attributes
        img.setAttribute('draggable', 'false');
        img.style.pointerEvents = 'none';
        
        // Prevent image saving through various methods
        img.addEventListener('contextmenu', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('dragstart', (e) => {
            e.preventDefault();
            return false;
        });
        
        img.addEventListener('selectstart', (e) => {
            e.preventDefault();
            return false;
        });
    });
}

// Setup music with better mobile support and autostart
function setupMusic() {
    // Try to load music with better error handling
    currentAudio.addEventListener('canplaythrough', () => {
        console.log('Music loaded successfully');
        // Update music info with actual song name
        const musicInfo = document.querySelector('.music-info span');
        if (musicInfo) {
            musicInfo.textContent = 'Wildflower - Yung Kai';
        }
    });
    
    currentAudio.addEventListener('error', (e) => {
        console.log('Music loading failed, trying alternative source');
        currentAudio = bgMusicAlt;
        currentAudio.load();
        // Update music info for fallback
        const musicInfo = document.querySelector('.music-info span');
        if (musicInfo) {
            musicInfo.textContent = 'Friendship Song';
        }
    });
    
    // Set volume to a comfortable level
    currentAudio.volume = 0.3;
    
    // Show music button after setup
    musicToggle.style.display = 'block';
}

// Setup Event Listeners
function setupEventListeners() {
    // Prevent right-click context menu
    document.addEventListener('contextmenu', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Prevent drag and drop
    document.addEventListener('dragstart', (e) => {
        e.preventDefault();
        return false;
    });
    
    // Prevent keyboard shortcuts for saving images
    document.addEventListener('keydown', (e) => {
        // Prevent Ctrl+S, Ctrl+U, F12
        if ((e.ctrlKey && (e.key === 's' || e.key === 'u')) || e.key === 'F12') {
            e.preventDefault();
            return false;
        }
        // Call the existing keyboard handler for navigation
        handleKeyboard(e);
    });
    
    // Album cover click - improved mobile support
    albumCover.addEventListener('click', openAlbum);
    albumCover.addEventListener('touchstart', (e) => {
        e.preventDefault();
        openAlbum();
    });
    
    // Navigation buttons - improved mobile support
    prevBtn.addEventListener('click', goToPreviousPage);
    nextBtn.addEventListener('click', goToNextPage);
    prevBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        goToPreviousPage();
    });
    nextBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        goToNextPage();
    });
    
    // Close album button - improved mobile support
    closeAlbumBtn.addEventListener('click', closeAlbum);
    closeAlbumBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        closeAlbum();
    });
    
    // Hug button - improved mobile support
    hugBtn.addEventListener('click', showHug);
    hugBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showHug();
    });
    
    // Close popup - improved mobile support
    closePopup.addEventListener('click', hideHug);
    closePopup.addEventListener('touchstart', (e) => {
        e.preventDefault();
        hideHug();
    });
    
    // Music toggle - improved mobile support
    musicToggle.addEventListener('click', toggleMusic);
    musicToggle.addEventListener('touchstart', (e) => {
        e.preventDefault();
        toggleMusic();
    });
    
    // Surprise button - improved mobile support
    surpriseBtn.addEventListener('click', showSurprise);
    surpriseBtn.addEventListener('touchstart', (e) => {
        e.preventDefault();
        showSurprise();
    });
    
    // Close surprise - improved mobile support
    closeSurprise.addEventListener('click', hideSurprise);
    closeSurprise.addEventListener('touchstart', (e) => {
        e.preventDefault();
        hideSurprise();
    });
    
    // Close popup when clicking outside
    hugPopup.addEventListener('click', (e) => {
        if (e.target === hugPopup) {
            hideHug();
        }
    });
    
    // Close surprise when clicking outside
    surpriseContainer.addEventListener('click', (e) => {
        if (e.target === surpriseContainer) {
            hideSurprise();
        }
    });
    
    // Touch/swipe events for mobile navigation - will be added when album opens
}

// Toggle music with better mobile support
function toggleMusic() {
    if (isMusicPlaying) {
        currentAudio.pause();
        musicToggle.textContent = '🔇';
        isMusicPlaying = false;
    } else {
        // Try to play music with better error handling
        const playPromise = currentAudio.play();
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    musicToggle.textContent = '🎵';
                    isMusicPlaying = true;
                })
                .catch(error => {
                    console.log('Music autoplay blocked:', error);
                    musicToggle.textContent = '🔇';
                    isMusicPlaying = false;
                    // Try alternative source
                    if (currentAudio === bgMusic) {
                        currentAudio = bgMusicAlt;
                        currentAudio.volume = 0.3;
                        currentAudio.play().catch(e => console.log('Alternative music also failed'));
                    }
                });
        }
    }
}

// Touch start for swipe detection - improved
function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
    touchStartY = e.changedTouches[0].screenY;
}

// Touch end for swipe detection - improved
function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    touchEndY = e.changedTouches[0].screenY;
    handleSwipe();
}

// Handle swipe gestures - improved for mobile
function handleSwipe() {
    const swipeThreshold = 30; // Reduced threshold for mobile
    const horizontalDiff = touchStartX - touchEndX;
    const verticalDiff = touchStartY - touchEndY;
    
    // Only trigger swipe if horizontal movement is greater than vertical movement
    // and horizontal movement exceeds threshold
    if (Math.abs(horizontalDiff) > swipeThreshold && Math.abs(horizontalDiff) > Math.abs(verticalDiff)) {
        if (horizontalDiff > 0) {
            // Swipe left - next page
            goToNextPage();
        } else {
            // Swipe right - previous page
            goToPreviousPage();
        }
    }
}

// Show surprise with better chaotic content
function showSurprise() {
    surpriseContainer.classList.add('show');
    createSunflowerExplosion();
    createSparkleGarden();
    createFireworks();
    createChaosEffects();
    
    // Auto hide after 8 seconds
    setTimeout(() => {
        hideSurprise();
    }, 8000);
}

// Hide surprise
function hideSurprise() {
    surpriseContainer.classList.remove('show');
}

// Create fireworks
function createFireworks() {
    for (let i = 0; i < 20; i++) {
        setTimeout(() => {
            const firework = document.createElement('div');
            firework.textContent = '🎆';
            firework.style.position = 'fixed';
            firework.style.left = Math.random() * window.innerWidth + 'px';
            firework.style.top = Math.random() * window.innerHeight + 'px';
            firework.style.fontSize = '2rem';
            firework.style.pointerEvents = 'none';
            firework.style.zIndex = '1500';
            firework.style.animation = 'fireworkExplode 2s ease-out forwards';
            
            document.body.appendChild(firework);
            
            setTimeout(() => {
                firework.remove();
            }, 2000);
        }, i * 100);
    }
}

// Create chaos effects for surprise
function createChaosEffects() {
    const chaosEmojis = ['🎭', '🎪', '🎨', '🎯', '🎲', '🎮', '🎸', '🎹', '🎺', '🎻', '🎤', '🎧', '🎬', '🎭', '🎪'];
    
    for (let i = 0; i < 25; i++) {
        setTimeout(() => {
            const chaos = document.createElement('div');
            chaos.textContent = chaosEmojis[Math.floor(Math.random() * chaosEmojis.length)];
            chaos.style.position = 'fixed';
            chaos.style.left = Math.random() * window.innerWidth + 'px';
            chaos.style.top = Math.random() * window.innerHeight + 'px';
            chaos.style.fontSize = '2rem';
            chaos.style.pointerEvents = 'none';
            chaos.style.zIndex = '1500';
            chaos.style.animation = 'chaosFloat 3s ease-out forwards';
            
            document.body.appendChild(chaos);
            
            setTimeout(() => {
                chaos.remove();
            }, 3000);
        }, i * 100);
    }
}

// Keyboard shortcuts
function handleKeyboard(e) {
    if (e.key === 'Escape') {
        if (isAlbumOpened) {
            closeAlbum();
        } else {
            hideHug();
            hideSurprise();
        }
    }
    
    if (e.key === ' ') {
        e.preventDefault();
        if (!isAlbumOpened) {
            openAlbum();
        }
    }
    
    if (e.key === 'h' || e.key === 'H') {
        showHug();
    }
    
    if (e.key === 'm' || e.key === 'M') {
        toggleMusic();
    }
    
    if (e.key === 's' || e.key === 'S') {
        showSurprise();
    }
    
    // Arrow keys for navigation
    if (e.key === 'ArrowRight' && isAlbumOpened) {
        goToNextPage();
    }
    
    if (e.key === 'ArrowLeft' && isAlbumOpened) {
        goToPreviousPage();
    }
    
    // Beautiful effects
    if (e.key === 'f' || e.key === 'F') {
        createSunflowerExplosion();
    }
    
    if (e.key === 'g' || e.key === 'G') {
        createSparkleGarden();
    }
}

// Open album with better mobile support and autostart music
function openAlbum() {
    if (isAnimating || isAlbumOpened) return;
    
    isAnimating = true;
    isAlbumOpened = true;
    
    // Create sunflower explosion
    createSunflowerExplosion();
    
    // Animate album cover opening with 3D effect
    albumCover.classList.add('opened');
    
    // Create beautiful page turn effects
    createBeautifulPageTurnEffects();
    
    // Show first page after cover animation
    setTimeout(() => {
        showPage(0);
        isAnimating = false;
        createSparkleGarden();
        updateNavigation();
        
        // Add touch listeners for swipe navigation when album is opened
        albumPages.addEventListener('touchstart', handleTouchStart, { passive: false });
        albumPages.addEventListener('touchend', handleTouchEnd, { passive: false });
        
        // Autostart music when album opens
        setTimeout(() => {
            const playPromise = currentAudio.play();
            if (playPromise !== undefined) {
                playPromise
                    .then(() => {
                        musicToggle.textContent = '🎵';
                        isMusicPlaying = true;
                    })
                    .catch(error => {
                        console.log('Music autostart blocked:', error);
                        musicToggle.textContent = '🔇';
                        isMusicPlaying = false;
                    });
            }
        }, 500);
    }, 1500);
}

// Close album with better mobile support
function closeAlbum() {
    if (isAnimating) return;
    
    isAnimating = true;
    
    // Create sunflower explosion
    createSunflowerExplosion();
    
    // Reset to cover
    setTimeout(() => {
        albumCover.classList.remove('opened');
        currentPage = 0;
        isAlbumOpened = false;
        isAnimating = false;
        updateNavigation();
        
        // Remove touch listeners when album is closed
        albumPages.removeEventListener('touchstart', handleTouchStart);
        albumPages.removeEventListener('touchend', handleTouchEnd);
        
        // Reset all pages
        pages.forEach((page, index) => {
            page.classList.remove('active');
            page.style.opacity = '0';
            page.style.pointerEvents = 'none';
            if (index === 0) {
                page.style.transform = 'translateX(0)';
            } else {
                page.style.transform = `translateX(${index * 100}%)`;
            }
        });
    }, 500);
}

// Go to next page with better mobile support
function goToNextPage() {
    if (isAnimating || currentPage >= pages.length - 1) return;
    
    isAnimating = true;
    createSunflowerExplosion();
    
    // Add turning effect to current page
    pages[currentPage].classList.add('turning');
    
    setTimeout(() => {
        currentPage++;
        showPage(currentPage);
        isAnimating = false;
        createSparkleGarden();
        updateNavigation();
        
        // Remove turning class
        pages.forEach(page => page.classList.remove('turning'));
    }, 600);
}

// Go to previous page with better mobile support
function goToPreviousPage() {
    if (isAnimating || currentPage <= 0) return;
    
    isAnimating = true;
    createSunflowerExplosion();
    
    // Add turning effect to current page
    pages[currentPage].classList.add('turning');
    
    setTimeout(() => {
        currentPage--;
        showPage(currentPage);
        isAnimating = false;
        createSparkleGarden();
        updateNavigation();
        
        // Remove turning class
        pages.forEach(page => page.classList.remove('turning'));
    }, 600);
}

// Show specific page with better mobile support
function showPage(pageIndex) {
    pages.forEach((page, index) => {
        page.classList.remove('active');
        page.style.opacity = '0';
        page.style.pointerEvents = 'none';
        
        if (index === pageIndex) {
            page.classList.add('active');
            page.style.transform = 'translateX(0)';
            page.style.opacity = '1';
            page.style.pointerEvents = 'auto';
        } else if (index < pageIndex) {
            page.style.transform = 'translateX(-100%)';
        } else {
            page.style.transform = `translateX(${(index - pageIndex) * 100}%)`;
        }
    });
}

// Update navigation controls with better mobile support
function updateNavigation() {
    currentPageSpan.textContent = currentPage + 1;
    totalPagesSpan.textContent = pages.length;
    
    // Update button states
    prevBtn.disabled = currentPage === 0;
    nextBtn.disabled = currentPage === pages.length - 1;
    
    // Show/hide navigation and close button based on screen size
    const isMobile = window.innerWidth <= 768;
    
    if (isAlbumOpened) {
        if (!isMobile) {
            document.querySelector('.album-navigation').style.display = 'flex';
            closeAlbumBtn.style.display = 'block';
        } else {
            // Hide buttons on mobile, rely on swipe gestures
            document.querySelector('.album-navigation').style.display = 'none';
            closeAlbumBtn.style.display = 'none';
        }
    } else {
        document.querySelector('.album-navigation').style.display = 'none';
        closeAlbumBtn.style.display = 'none';
    }
}

// Add swipe hint for mobile
function addSwipeHint() {
    if (window.innerWidth <= 768) {
        // Add swipe hint to the page content
        const swipeHint = document.createElement('div');
        swipeHint.className = 'swipe-hint';
        swipeHint.innerHTML = '<p>💫 Swipe to navigate 💫</p>';
        swipeHint.style.cssText = `
            position: fixed;
            bottom: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(255, 215, 0, 0.9);
            color: #8b4513;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 0.8rem;
            z-index: 100;
            animation: fadeInOut 3s ease-in-out;
        `;
        
        document.body.appendChild(swipeHint);
        
        setTimeout(() => {
            swipeHint.remove();
        }, 3000);
    }
}

// Add fade in/out animation for swipe hint
const swipeHintStyle = document.createElement('style');
swipeHintStyle.textContent += `
    @keyframes fadeInOut {
        0%, 100% { opacity: 0; }
        50% { opacity: 1; }
    }
`;
document.head.appendChild(swipeHintStyle);

// Initialize album state with better mobile support
function initializeAlbum() {
    // Hide all pages initially
    pages.forEach((page, index) => {
        page.classList.remove('active');
        page.style.opacity = '0';
        page.style.pointerEvents = 'none';
        
        if (index === 0) {
            page.style.transform = 'translateX(0)';
        } else {
            page.style.transform = `translateX(${index * 100}%)`;
        }
    });
    
    // Show first page when album opens
    if (isAlbumOpened) {
        pages[0].classList.add('active');
        pages[0].style.opacity = '1';
        pages[0].style.pointerEvents = 'auto';
    }
    
    // Add swipe hint for mobile
    setTimeout(() => {
        addSwipeHint();
    }, 1000);
}

// Create beautiful sunflower explosion
function createSunflowerExplosion() {
    const sunflowers = ['🌻', '🌻', '🌻', '🌻', '🌻', '🌻'];
    
    for (let i = 0; i < 12; i++) {
        setTimeout(() => {
            const sunflower = document.createElement('div');
            sunflower.textContent = sunflowers[Math.floor(Math.random() * sunflowers.length)];
            sunflower.style.position = 'fixed';
            sunflower.style.left = '50%';
            sunflower.style.top = '50%';
            sunflower.style.fontSize = '2rem';
            sunflower.style.pointerEvents = 'none';
            sunflower.style.zIndex = '1000';
            sunflower.style.animation = 'sunflowerExplosion 2s ease-out forwards';
            
            document.body.appendChild(sunflower);
            
            setTimeout(() => {
                sunflower.remove();
            }, 2000);
        }, i * 100);
    }
}

// Create beautiful page turn effects
function createBeautifulPageTurnEffects() {
    const effects = ['🌻', '🌻', '🌻', '🌻', '🌻', '💖', '💕', '💗', '💓', '💝'];
    
    for (let i = 0; i < 15; i++) {
        setTimeout(() => {
            const effect = document.createElement('div');
            effect.textContent = effects[Math.floor(Math.random() * effects.length)];
            effect.style.position = 'fixed';
            effect.style.left = Math.random() * window.innerWidth + 'px';
            effect.style.top = Math.random() * window.innerHeight + 'px';
            effect.style.fontSize = '1.5rem';
            effect.style.pointerEvents = 'none';
            effect.style.zIndex = '1000';
            effect.style.animation = 'beautifulEffect 2.5s ease-out forwards';
            
            document.body.appendChild(effect);
            
            setTimeout(() => {
                effect.remove();
            }, 2500);
        }, i * 80);
    }
}

// Create sparkle garden
function createSparkleGarden() {
    const sparkles = ['✨', '💫', '⭐', '🌟', '💎'];
    
    for (let i = 0; i < 10; i++) {
        setTimeout(() => {
            const sparkle = document.createElement('div');
            sparkle.textContent = sparkles[Math.floor(Math.random() * sparkles.length)];
            sparkle.style.position = 'fixed';
            sparkle.style.left = Math.random() * window.innerWidth + 'px';
            sparkle.style.top = Math.random() * window.innerHeight + 'px';
            sparkle.style.fontSize = '1.8rem';
            sparkle.style.pointerEvents = 'none';
            sparkle.style.zIndex = '1000';
            sparkle.style.animation = 'sparkleGarden 2s ease-out forwards';
            
            document.body.appendChild(sparkle);
            
            setTimeout(() => {
                sparkle.remove();
            }, 2000);
        }, i * 120);
    }
}

// Start petal system
function startPetalSystem() {
    setInterval(() => {
        if (petalCount < 25) {
            createPetal();
            petalCount++;
        }
    }, 400);
}

// Create petal
function createPetal() {
    const petal = document.createElement('div');
    petal.className = 'petal';
    petal.style.left = Math.random() * window.innerWidth + 'px';
    petal.style.animationDelay = Math.random() * 10 + 's';
    petal.style.animationDuration = (Math.random() * 5 + 5) + 's';
    
    petals.appendChild(petal);
    
    setTimeout(() => {
        petal.remove();
        petalCount--;
    }, 10000);
}

// Create sunflower effects
function createSunflowerEffects() {
    setInterval(() => {
        const effect = document.createElement('div');
        effect.style.position = 'fixed';
        effect.style.left = Math.random() * window.innerWidth + 'px';
        effect.style.top = Math.random() * window.innerHeight + 'px';
        effect.style.fontSize = '1.2rem';
        effect.style.pointerEvents = 'none';
        effect.style.zIndex = '1';
        effect.style.animation = 'sunflowerFloat 8s linear forwards';
        effect.textContent = '🌻';
        
        document.body.appendChild(effect);
        
        setTimeout(() => {
            effect.remove();
        }, 8000);
    }, 5000);
}

// Show beautiful hug popup with better mobile support
function showHug() {
    hugPopup.classList.add('show');
    hugCounter++;
    hugCount.textContent = hugCounter;
    createSunflowerExplosion();
    createSparkleGarden();
    
    // Auto hide after 6 seconds
    setTimeout(() => {
        hideHug();
    }, 6000);
}

// Hide hug popup with better mobile support
function hideHug() {
    hugPopup.classList.remove('show');
}

// Add beautiful animations
const style = document.createElement('style');
style.textContent = `
    @keyframes sunflowerExplosion {
        0% {
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translate(-50%, -50%) scale(2.5) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes beautifulEffect {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.3) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
    
    @keyframes sparkleGarden {
        0% {
            opacity: 0;
            transform: scale(0) rotate(0deg);
        }
        50% {
            opacity: 1;
            transform: scale(1.2) rotate(180deg);
        }
        100% {
            opacity: 0;
            transform: scale(0) rotate(360deg);
        }
    }
    
    @keyframes sunflowerFloat {
        0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-10vh) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
    
    @keyframes fireworkExplode {
        0% {
            transform: scale(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: scale(3) rotate(720deg);
            opacity: 0;
        }
    }
    
    @keyframes chaosFloat {
        0% {
            transform: translateY(100vh) translateX(0) rotate(0deg);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-10vh) translateX(100px) rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Prevent zoom on mobile
document.addEventListener('gesturestart', (e) => {
    e.preventDefault();
});

document.addEventListener('gesturechange', (e) => {
    e.preventDefault();
});

document.addEventListener('gestureend', (e) => {
    e.preventDefault();
});

// Handle orientation change
window.addEventListener('orientationchange', () => {
    setTimeout(() => {
        // Recalculate album dimensions
        const albumContainer = document.querySelector('.friendship-album');
        if (albumContainer) {
            albumContainer.offsetHeight; // Force reflow
        }
    }, 100);
});

// Success message
console.log('🌻 Beautiful 3D Sunflower Album loaded successfully! 🌻');
console.log('🌻 Features: 3D page turning, music player, photo gallery, surprise animations! 🌻');
console.log('🎮 Controls: Tap arrows to turn pages, M=Music, S=Surprise, H=Hug, Esc=Close 🎮'); 