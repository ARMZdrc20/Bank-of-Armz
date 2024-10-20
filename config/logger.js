const fs = require('fs');
const path = require('path');

// Create a write stream (log file) in append mode
const logFilePath = path.join(__dirname, 'app.log');
const logStream = fs.createWriteStream(logFilePath, { flags: 'a' });

// Enhanced logMessage function
function logMessage(...args) {
    const timestamp = new Date().toISOString();
    const message = args.map(arg => (typeof arg === 'object' ? JSON.stringify(arg, null, 2) : arg)).join(' ');

    // Log to console (optional)
    console.log(`[${timestamp}] ${message}`);

    // Write to log file
    logStream.write(`[${timestamp}] ${message}\n`);
}

// // Example usage
// logMessage('Server started');
// logMessage('User logged in');
// logMessage('Error: Unable to connect to the database');

// // Close the stream when done
// // logStream.end();

module.exports = logMessage;