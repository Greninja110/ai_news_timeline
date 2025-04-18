/**
 * Main.js - Main functionality for AI Timeline Website
 * Handles general website behavior, animations, and interactions
 */

// Main application class
class AITimelineApp {
    constructor() {
        // Initialize state
        this.isMenuOpen = false;
        this.hasScrolledNav = false;
        this.animationFrameId = null;
        
        // DOM Elements we'll need
        this.header = document.querySelector('.main-nav');
        this.heroSection = document.querySelector('.hero');
        this.timelineSection = document.querySelector('.timeline-section');
        
        // Initialize
        logger.info('Initializing AI Timeline App');
        this.init();
    }
    
    /**
     * Initialize the application
     */
    init() {
        try {
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize animations
            this.initAnimations();
            
            // Mobile menu setup
            this.setupMobileMenu();
            
            // Add debug controls if in development mode
            this.setupDebugControls();
            
            logger.info('AI Timeline App initialized successfully');
        } catch (error) {
            logger.error('Error initializing AI Timeline App:', error);
        }
    }
    
    /**
     * Set up various event listeners
     */
    setupEventListeners() {
        try {
            // Scroll event for nav bar effects
            window.addEventListener('scroll', this.handleScroll.bind(this));
            
            // Resize event for responsive adjustments
            window.addEventListener('resize', this.handleResize.bind(this));
            
            // Initialize scroll position
            this.handleScroll();
            
            logger.debug('Event listeners set up');
        } catch (error) {
            logger.error('Error setting up event listeners:', error);
        }
    }
    
    /**
     * Handle scroll events
     */
    handleScroll() {
        try {
            // Debounce the scroll event
            if (this.animationFrameId) {
                cancelAnimationFrame(this.animationFrameId);
            }
            
            this.animationFrameId = requestAnimationFrame(() => {
                const scrollPosition = window.scrollY;
                
                // Add a class to the header when scrolled
                if (scrollPosition > 50 && !this.hasScrolledNav) {
                    this.header.classList.add('scrolled');
                    this.hasScrolledNav = true;
                    logger.debug('Header scrolled class added');
                } else if (scrollPosition <= 50 && this.hasScrolledNav) {
                    this.header.classList.remove('scrolled');
                    this.hasScrolledNav = false;
                    logger.debug('Header scrolled class removed');
                }
                
                // Animate timeline items when they come into view
                this.animateOnScroll();
            });
        } catch (error) {
            logger.error('Error handling scroll:', error);
        }
    }
    
    /**
     * Handle window resize
     */
    handleResize() {
        try {
            // Adjust layout for different screen sizes
            this.updateResponsiveLayout();
            logger.debug('Window resized, layout updated');
        } catch (error) {
            logger.error('Error handling resize:', error);
        }
    }
    
    /**
     * Update layout for responsive design
     */
    updateResponsiveLayout() {
        try {
            // Get window width
            const windowWidth = window.innerWidth;
            
            // Apply adjustments based on screen size
            if (windowWidth <= 768) {
                // Mobile adjustments
                document.body.classList.add('mobile-view');
                document.body.classList.remove('desktop-view');
            } else {
                // Desktop adjustments
                document.body.classList.add('desktop-view');
                document.body.classList.remove('mobile-view');
            }
            
            logger.debug(`Responsive layout updated for width: ${windowWidth}px`);
        } catch (error) {
            logger.error('Error updating responsive layout:', error);
        }
    }
    
    /**
     * Initialize animations
     */
    initAnimations() {
        try {
            // Add neural background animation
            this.setupNeuralBackground();
            
            // Initial animation for timeline items
            setTimeout(() => {
                this.animateOnScroll();
            }, 500);
            
            logger.debug('Animations initialized');
        } catch (error) {
            logger.error('Error initializing animations:', error);
        }
    }
    
    /**
     * Set up animated neural network background
     */
    setupNeuralBackground() {
        try {
            const neuralBg = document.querySelector('.neural-bg');
            
            // Only proceed if neural background element exists
            if (!neuralBg) return;
            
            // For better performance, we'll use CSS animations
            // but we can add additional dynamic effects here if needed
            
            logger.debug('Neural background animation set up');
        } catch (error) {
            logger.error('Error setting up neural background:', error);
        }
    }
    
    /**
     * Animate elements as they come into view when scrolling
     */
    animateOnScroll() {
        try {
            // Only animate if timeline section exists
            if (!this.timelineSection) return;
            
            // Get all timeline cards
            const cards = document.querySelectorAll('.timeline-card');
            
            cards.forEach(card => {
                const rect = card.getBoundingClientRect();
                const isInView = (
                    rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
                    rect.bottom >= 0
                );
                
                if (isInView) {
                    card.classList.add('in-view');
                }
            });
        } catch (error) {
            logger.error('Error animating on scroll:', error);
        }
    }
    
    /**
     * Set up mobile menu for responsive design
     */
    setupMobileMenu() {
        try {
            // Create mobile menu button if it doesn't exist
            if (!document.querySelector('.mobile-menu-btn') && window.innerWidth <= 768) {
                const navMenu = document.querySelector('.main-nav .menu');
                
                // Create mobile menu button
                const menuBtn = document.createElement('button');
                menuBtn.className = 'mobile-menu-btn';
                menuBtn.innerHTML = '<i class="fas fa-bars"></i>';
                menuBtn.setAttribute('aria-label', 'Toggle navigation menu');
                
                // Insert before the menu
                navMenu.parentNode.insertBefore(menuBtn, navMenu);
                
                // Add click event
                menuBtn.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
                
                logger.debug('Mobile menu set up');
            }
        } catch (error) {
            logger.error('Error setting up mobile menu:', error);
        }
    }
    
    /**
     * Toggle mobile menu open/closed
     */
    toggleMobileMenu() {
        try {
            const menu = document.querySelector('.main-nav .menu');
            const menuBtn = document.querySelector('.mobile-menu-btn i');
            
            this.isMenuOpen = !this.isMenuOpen;
            
            if (this.isMenuOpen) {
                menu.classList.add('open');
                menuBtn.className = 'fas fa-times';
                logger.debug('Mobile menu opened');
            } else {
                menu.classList.remove('open');
                menuBtn.className = 'fas fa-bars';
                logger.debug('Mobile menu closed');
            }
        } catch (error) {
            logger.error('Error toggling mobile menu:', error);
        }
    }
    
    /**
     * Set up debug controls for development
     */
    setupDebugControls() {
        try {
            // Check if we're in development mode
            const isDev = window.location.hostname === 'localhost' || 
                         window.location.hostname === '127.0.0.1';
            
            if (isDev) {
                logger.info('Development mode detected, adding debug controls');
                
                // Create debug panel
                const debugPanel = document.createElement('div');
                debugPanel.className = 'debug-panel';
                debugPanel.innerHTML = `
                    <div class="debug-header">Debug Controls</div>
                    <div class="debug-controls">
                        <button id="toggle-debug">Toggle Debug</button>
                        <button id="download-logs">Download Logs</button>
                        <button id="clear-logs">Clear Logs</button>
                    </div>
                `;
                
                // Style the debug panel
                debugPanel.style.position = 'fixed';
                debugPanel.style.bottom = '10px';
                debugPanel.style.right = '10px';
                debugPanel.style.background = 'rgba(0, 0, 0, 0.8)';
                debugPanel.style.padding = '10px';
                debugPanel.style.borderRadius = '5px';
                debugPanel.style.zIndex = '9999';
                
                // Add to body
                document.body.appendChild(debugPanel);
                
                // Add event listeners
                document.getElementById('toggle-debug').addEventListener('click', () => {
                    window.logger.enabled = !window.logger.enabled;
                    logger.info(`Debug logging ${window.logger.enabled ? 'enabled' : 'disabled'}`);
                });
                
                document.getElementById('download-logs').addEventListener('click', () => {
                    window.logger.downloadLogs();
                });
                
                document.getElementById('clear-logs').addEventListener('click', () => {
                    window.logger.clearLogs();
                });
                
                logger.debug('Debug controls added');
            }
        } catch (error) {
            logger.error('Error setting up debug controls:', error);
        }
    }
}

// Initialize the app when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.aiTimelineApp = new AITimelineApp();
        console.info('AI Timeline App loaded successfully');
        
        // Add AJAX fallback for browsers without native fetch
        if (!window.fetch) {
            console.warn('Browser does not support fetch API, loading fetch polyfill');
            
            // Create script element to load polyfill
            const script = document.createElement('script');
            script.src = 'https://cdnjs.cloudflare.com/ajax/libs/fetch/3.6.2/fetch.min.js';
            script.async = true;
            
            // Add to head
            document.head.appendChild(script);
        }
    } catch (error) {
        console.error('Error initializing AI Timeline App:', error);
    }
});