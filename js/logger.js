/**
 * Logger.js - Logging functionality for AI Timeline Website
 * This file creates a logging system that captures console logs into a file
 * for debugging purposes
 */

// Logger class to handle logging
class Logger {
    constructor() {
        this.logs = [];
        this.enabled = true;
        this.logLevel = 'info'; // Possible values: 'debug', 'info', 'warn', 'error'
        this.logLevels = {
            'debug': 0,
            'info': 1,
            'warn': 2,
            'error': 3
        };

        // Initialize logging by overriding console methods
        this.initLogging();
        
        // Log application start
        this.info('Application started', { timestamp: new Date().toISOString() });
        
        // Set up interval to save logs periodically
        setInterval(() => this.saveLogs(), 10000); // Save logs every 10 seconds
    }

    // Initialize logging by overriding console methods
    initLogging() {
        // Store original console methods
        this.originalConsole = {
            log: console.log,
            info: console.info,
            warn: console.warn,
            error: console.error,
            debug: console.debug
        };

        // Override console.log
        console.log = (...args) => {
            this.originalConsole.log(...args);
            if (this.enabled && this.shouldLog('debug')) {
                this.addLog('debug', args);
            }
        };

        // Override console.info
        console.info = (...args) => {
            this.originalConsole.info(...args);
            if (this.enabled && this.shouldLog('info')) {
                this.addLog('info', args);
            }
        };

        // Override console.warn
        console.warn = (...args) => {
            this.originalConsole.warn(...args);
            if (this.enabled && this.shouldLog('warn')) {
                this.addLog('warn', args);
            }
        };

        // Override console.error
        console.error = (...args) => {
            this.originalConsole.error(...args);
            if (this.enabled && this.shouldLog('error')) {
                this.addLog('error', args);
            }
        };

        // Override console.debug
        console.debug = (...args) => {
            this.originalConsole.debug(...args);
            if (this.enabled && this.shouldLog('debug')) {
                this.addLog('debug', args);
            }
        };
    }

    // Check if log should be recorded based on current log level
    shouldLog(level) {
        return this.logLevels[level] >= this.logLevels[this.logLevel];
    }

    // Add a log entry
    addLog(level, args) {
        try {
            const timestamp = new Date().toISOString();
            const sanitizedArgs = args.map(arg => {
                if (typeof arg === 'object') {
                    try {
                        return JSON.stringify(arg);
                    } catch (e) {
                        return `[Object: Circular or complex structure]`;
                    }
                }
                return String(arg);
            });

            this.logs.push({
                timestamp,
                level,
                message: sanitizedArgs.join(' ')
            });

            // If logs get too large, remove oldest entries
            if (this.logs.length > 1000) {
                this.logs = this.logs.slice(-500); // Keep the last 500 logs
                this.warn('Log buffer truncated to prevent memory issues', { timestamp });
            }
        } catch (e) {
            // Use original console to avoid infinite loops
            this.originalConsole.error('Error in logger:', e);
        }
    }

    // Log methods for direct use
    debug(message, context = {}) {
        console.debug(message, context);
    }

    info(message, context = {}) {
        console.info(message, context);
    }

    warn(message, context = {}) {
        console.warn(message, context);
    }

    error(message, context = {}) {
        console.error(message, context);
    }

    // Save logs to localStorage (in a real app, this might save to a file or server)
    saveLogs() {
        try {
            if (this.logs.length === 0) return;
            
            // Format logs for output
            const formattedLogs = this.logs.map(log => 
                `[${log.timestamp}] [${log.level.toUpperCase()}] ${log.message}`
            ).join('\n');
            
            // In a real application, this might use a backend API
            // For this example, we'll use localStorage
            const existingLogs = localStorage.getItem('aiTimeline_logs') || '';
            localStorage.setItem('aiTimeline_logs', existingLogs + formattedLogs + '\n');
            
            // Clear the logs after saving
            const savedCount = this.logs.length;
            this.logs = [];
            
            this.debug(`Saved ${savedCount} logs`);
        } catch (e) {
            this.originalConsole.error('Error saving logs:', e);
        }
    }

    // Download logs as a text file
    downloadLogs() {
        try {
            const logs = localStorage.getItem('aiTimeline_logs') || '';
            const blob = new Blob([logs], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            
            const a = document.createElement('a');
            a.href = url;
            a.download = `ai_timeline_logs_${new Date().toISOString().split('T')[0]}.log`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            
            this.info('Logs downloaded');
        } catch (e) {
            this.error('Error downloading logs:', e);
        }
    }

    // Clear all saved logs
    clearLogs() {
        localStorage.removeItem('aiTimeline_logs');
        this.logs = [];
        this.info('Logs cleared');
    }
}

// Create a global logger instance
window.logger = new Logger();

// Export the logger for module use
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.logger;
}