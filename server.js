// Development server for Quantum Computing Experience
const express = require('express');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS
app.use(cors());

// Serve static files
app.use(express.static(__dirname));

// Serve index.html for all routes (SPA behavior)
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
    console.log(`
╔══════════════════════════════════════════════════════════╗
║           QUANTUM COMPUTING EXPERIENCE                  ║
║                   Step 1 Server                         ║
╠══════════════════════════════════════════════════════════╣
║  🚀 Server running on: http://localhost:${PORT}           ║
║  📁 Serving files from: ${__dirname}                      ║
║  🌐 Access your cyberpunk quantum experience!           ║
╚══════════════════════════════════════════════════════════╝
    `);
});

// Graceful shutdown
process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down quantum server...');
    process.exit(0);
});
