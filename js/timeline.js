/**
 * Timeline.js - Timeline functionality for AI Timeline Website
 * Handles filtering, sorting, and "Show More" functionality for the timeline
 */

// TimelineManager class to handle all timeline interactions
class TimelineManager {
    constructor() {
        // Initialize timeline data structures
        this.timelineItems = [];
        this.filteredItems = [];
        this.currentFilter = 'all';
        this.currentTypeFilter = 'all';
        
        // DOM Elements
        this.timelineEl = document.querySelector('.timeline');
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.typeFilterSelect = document.getElementById('model-type-filter');
        
        // Initialize
        console.info('Initializing TimelineManager');
        this.init();
    }
    
    /**
     * Initialize the timeline manager
     */
    init() {
        try {
            // Log initialization
            console.debug('TimelineManager initialization started');
            
            // Cache timeline items
            this.loadTimelineItems();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Initialize read more buttons
            this.initReadMoreButtons();
            
            console.info('TimelineManager initialized successfully');
        } catch (error) {
            console.error('Error initializing TimelineManager:', error);
        }
    }
    
    /**
     * Load timeline items from the DOM and cache them
     */
    loadTimelineItems() {
        try {
            // Get all timeline items from the DOM
            const items = document.querySelectorAll('.timeline-item');
            console.debug(`Found ${items.length} timeline items`);
            
            // Cache the items
            this.timelineItems = Array.from(items).map(item => {
                // Parse date from the data attribute
                const dateStr = item.getAttribute('data-date');
                const date = dateStr ? new Date(dateStr) : null;
                
                // Get category
                const category = item.getAttribute('data-category') || 'uncategorized';
                
                return {
                    element: item,
                    date: date,
                    dateStr: dateStr,
                    category: category,
                    visible: true
                };
            });
            
            // Initially all items are visible and filtered
            this.filteredItems = [...this.timelineItems];
            
            console.debug('Timeline items loaded and cached');
        } catch (error) {
            console.error('Error loading timeline items:', error);
        }
    }
    
    /**
     * Setup event listeners for filters and buttons
     */
    setupEventListeners() {
        try {
            // Filter buttons
            this.filterBtns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const filter = e.target.getAttribute('data-filter');
                    
                    // Update active button
                    this.filterBtns.forEach(b => b.classList.remove('active'));
                    e.target.classList.add('active');
                    
                    // Apply filter
                    this.currentFilter = filter;
                    this.applyFilters();
                    
                    console.info(`Timeline date filter applied: ${filter}`);
                });
            });
            
            // Type filter select
            if (this.typeFilterSelect) {
                this.typeFilterSelect.addEventListener('change', (e) => {
                    this.currentTypeFilter = e.target.value;
                    this.applyFilters();
                    console.info(`Timeline type filter applied: ${this.currentTypeFilter}`);
                });
            }
            
            console.debug('Event listeners set up successfully');
        } catch (error) {
            console.error('Error setting up event listeners:', error);
        }
    }
    
    /**
     * Initialize read more buttons functionality
     */
    initReadMoreButtons() {
        try {
            const readMoreBtns = document.querySelectorAll('.read-more-btn');
            console.debug(`Found ${readMoreBtns.length} read more buttons`);
            
            readMoreBtns.forEach(btn => {
                // Remove any existing event listeners to prevent duplicates
                const newBtn = btn.cloneNode(true);
                btn.parentNode.replaceChild(newBtn, btn);
                
                newBtn.addEventListener('click', function(e) {
                    const card = this.closest('.timeline-card');
                    const content = card.querySelector('.read-more-content');
                    
                    if (content.classList.contains('active')) {
                        // Hide content
                        content.classList.remove('active');
                        this.textContent = 'Show More';
                        this.classList.remove('active');
                    } else {
                        // Show content
                        content.classList.add('active');
                        this.textContent = 'Show Less';
                        this.classList.add('active');
                    }
                    
                    console.debug(`Read more toggle clicked for: ${card.querySelector('h3').textContent}`);
                });
            });
            
            console.debug('Read more buttons initialized');
        } catch (error) {
            console.error('Error initializing read more buttons:', error);
        }
    }
    
    /**
     * Apply filters to the timeline items
     */
    applyFilters() {
        try {
            console.debug(`Applying filters: date=${this.currentFilter}, type=${this.currentTypeFilter}`);
            
            // Get current date for relative filters
            const now = new Date();
            
            // Filter items based on date filter
            this.timelineItems.forEach(item => {
                // First check if the item should be visible based on its type
                const typeMatches = this.currentTypeFilter === 'all' || 
                    item.category === this.currentTypeFilter;
                
                // Then check if it matches the date filter
                let dateMatches = false;
                
                if (this.currentFilter === 'all') {
                    dateMatches = true;
                } else if (this.currentFilter.includes(',')) {
                    // Date range filter (e.g., "2025-01-01,2025-04-15")
                    const [startStr, endStr] = this.currentFilter.split(',');
                    const startDate = new Date(startStr);
                    const endDate = new Date(endStr);
                    
                    dateMatches = item.date >= startDate && item.date <= endDate;
                } else if (this.currentFilter === '6months') {
                    // Past 6 months
                    const sixMonthsAgo = new Date(now);
                    sixMonthsAgo.setMonth(now.getMonth() - 6);
                    
                    dateMatches = item.date >= sixMonthsAgo;
                } else if (this.currentFilter === '1year') {
                    // Past year
                    const oneYearAgo = new Date(now);
                    oneYearAgo.setFullYear(now.getFullYear() - 1);
                    
                    dateMatches = item.date >= oneYearAgo;
                }
                
                // Set visibility based on both filters
                const isVisible = typeMatches && dateMatches;
                item.visible = isVisible;
                
                // Update the DOM
                if (isVisible) {
                    item.element.removeAttribute('data-filtered');
                } else {
                    item.element.setAttribute('data-filtered', 'true');
                }
            });
            
            // Also need to handle month headers visibility
            this.updateMonthHeadersVisibility();
            
            // Update filtered items
            this.filteredItems = this.timelineItems.filter(item => item.visible);
            
            console.info(`Filter applied: ${this.filteredItems.length} items visible out of ${this.timelineItems.length}`);
            
            // Check if no items are visible
            if (this.filteredItems.length === 0) {
                this.showNoResultsMessage();
            } else {
                this.hideNoResultsMessage();
            }
            
            // Reinitialize read more buttons in case they were affected by filtering
            setTimeout(() => {
                this.initReadMoreButtons();
            }, 100);
            
        } catch (error) {
            console.error('Error applying filters:', error);
        }
    }
    
    /**
     * Update month headers visibility based on visible timeline items
     */
    updateMonthHeadersVisibility() {
        try {
            const monthHeaders = document.querySelectorAll('.month-header');
            
            monthHeaders.forEach(header => {
                // Get the month from this header
                const monthName = header.querySelector('.month-bubble span:first-child').textContent;
                const yearText = header.querySelector('.month-bubble .year').textContent;
                
                // Convert month name to month number (0-11)
                const months = ['january', 'february', 'march', 'april', 'may', 'june', 
                               'july', 'august', 'september', 'october', 'november', 'december'];
                const monthIndex = months.indexOf(monthName.toLowerCase());
                
                if (monthIndex === -1) {
                    console.warn(`Unknown month name: ${monthName}`);
                    return;
                }
                
                // Check if there are any visible items for this month
                const year = parseInt(yearText);
                const hasVisibleItems = this.timelineItems.some(item => {
                    if (!item.visible) return false;
                    
                    const itemDate = item.date;
                    return itemDate.getFullYear() === year && 
                           itemDate.getMonth() === monthIndex;
                });
                
                // Show/hide header based on whether there are visible items
                if (hasVisibleItems) {
                    header.style.display = 'block';
                } else {
                    header.style.display = 'none';
                }
            });
            
        } catch (error) {
            console.error('Error updating month headers visibility:', error);
        }
    }
    
    /**
     * Show a message when no results match the current filters
     */
    showNoResultsMessage() {
        try {
            // Check if message already exists
            if (!document.querySelector('.no-results-message')) {
                const message = document.createElement('div');
                message.className = 'no-results-message';
                message.innerHTML = `
                    <div class="timeline-card">
                        <h3>No matching events found</h3>
                        <p>Try adjusting your filters to see more results.</p>
                    </div>
                `;
                
                this.timelineEl.appendChild(message);
                console.debug('No results message displayed');
            }
        } catch (error) {
            console.error('Error showing no results message:', error);
        }
    }
    
    /**
     * Hide the no results message
     */
    hideNoResultsMessage() {
        try {
            const message = document.querySelector('.no-results-message');
            if (message) {
                message.remove();
                console.debug('No results message removed');
            }
        } catch (error) {
            console.error('Error hiding no results message:', error);
        }
    }
}

// Create a global timeline manager when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.timelineManager = new TimelineManager();
        console.info('Timeline initialized successfully');
    } catch (error) {
        console.error('Error initializing timeline:', error);
    }
});

// Backup initialization to ensure event handlers are bound
window.addEventListener('load', () => {
    try {
        // If timelineManager not initialized yet, do it now
        if (!window.timelineManager) {
            window.timelineManager = new TimelineManager();
            console.info('Timeline initialized on window load');
        } 
        // Otherwise, just reinitialize the read more buttons
        else {
            window.timelineManager.initReadMoreButtons();
            console.info('Read more buttons reinitialized on window load');
        }
    } catch (error) {
        console.error('Error initializing timeline on window load:', error);
    }
});