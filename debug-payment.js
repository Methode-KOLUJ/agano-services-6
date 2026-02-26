const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

async function main() {
    console.log("Starting Debug Script...");

    // 1. Load Environment Variables
    let mongoUri = '';
    try {
        const envPath = path.resolve(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);
        if (match && match[1]) {
            mongoUri = match[1].trim();
            // Remove quotes if present
            mongoUri = mongoUri.replace(/^["']|["']$/g, '');
        }
    } catch (e) {
        console.error("Could not read .env file:", e.message);
        process.exit(1);
    }

    if (!mongoUri) {
        console.error("MONGODB_URI not found in .env");
        process.exit(1);
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected.");

    // 2. Define Schema (Minimal)
    const TempSchema = new mongoose.Schema({
        depositId: String,
        paymentInfo: {
            status: String
        },
        createdAt: Date
    }, { strict: false });

    const TempCandidature = mongoose.models.TempCandidature || mongoose.model('TempCandidature', TempSchema);

    // 3. Find recent Temp Candidatures
    const recents = await TempCandidature.find().sort({ createdAt: -1 }).limit(5);

    if (recents.length === 0) {
        console.log("No TempCandidatures found.");
    } else {
        console.log(`Found ${recents.length} recent TempCandidatures.`);
        
        const pawapayBaseUrl = "https://api.pawapay.io";
        const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";

        for (const doc of recents) {
            console.log(`\n--- ID: ${doc.depositId} ---`);
            console.log(`Local Status: ${doc.paymentInfo?.status}`);
            console.log(`Created At: ${doc.createdAt}`);

            try {
                const response = await axios.get(`${pawapayBaseUrl}/v2/deposits/${doc.depositId}`, {
                    headers: {
                        'Authorization': `Bearer ${pawapayApiKey}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 5000
                });

                const data = response.data;
                console.log("Pawapay Response Data:", JSON.stringify(data, null, 2));
                
                // Emulate Logic
                let status = 'PENDING';
                let pData = null;
                if (data && data.length > 0 && Array.isArray(data)) {
                     pData = data[0];
                     status = pData.status;
                } else if (data && data.status) { // Direct object
                     // Check if it's nested data.status or just status
                     // The logic in route.ts had data.data.status vs data.status
                     if (data.data && data.data.status) {
                        status = data.data.status;
                     } else {
                        status = data.status;
                     }
                }
                
                console.log(`Derived Status: ${status}`);

            } catch (err) {
                console.error("Pawapay Check Failed:", err.message);
                if (err.response) {
                    console.error("Status:", err.response.status);
                    console.error("Data:", JSON.stringify(err.response.data));
                }
            }
        }
    }

    console.log("\nDone.");
    process.exit(0);
}

main();
