const fs = require('fs');
const mongoose = require('mongoose');
const axios = require('axios');
const path = require('path');

async function main() {
    // 1. Load Environment Variables
    let mongoUri = '';
    try {
        const envPath = path.resolve(__dirname, '.env');
        const envContent = fs.readFileSync(envPath, 'utf8');
        const match = envContent.match(/MONGODB_URI=(.*)/);
        if (match && match[1]) {
            mongoUri = match[1].trim().replace(/^["']|["']$/g, '');
        }
    } catch (e) {
        process.exit(1);
    }

    await mongoose.connect(mongoUri);

    const TempSchema = new mongoose.Schema({
        depositId: String,
        paymentInfo: { status: String },
        createdAt: Date
    }, { strict: false });

    const TempCandidature = mongoose.models.TempCandidature || mongoose.model('TempCandidature', TempSchema);

    // Get ONLY the latest one
    const latest = await TempCandidature.findOne().sort({ createdAt: -1 });

    if (!latest) {
        console.log("No records.");
    } else {
        console.log(`Checking Latest ID: ${latest.depositId}`);
        console.log(`Local Status: ${latest.paymentInfo?.status}`);

        const pawapayBaseUrl = "https://api.pawapay.io";
        const pawapayApiKey = "eyJraWQiOiIxIiwiYWxnIjoiRVMyNTYifQ.eyJ0dCI6IkFBVCIsInN1YiI6IjIxMDQiLCJtYXYiOiIxIiwiZXhwIjoyMDgyNTUxMzY3LCJpYXQiOjE3NjcwMTg1NjcsInBtIjoiREFGLFBBRiIsImp0aSI6IjkzYmRkNGNkLWExYmQtNGU5ZS1hMDkwLWQxMGUwYmI0YTNjMCJ9.H3wX9zgKidXtKsADSSevGwXHjAlPFPbo7H0KzbwiyXITLcfrltzLdAGqiCdEehjeB4pkQ37d-EJ7pIDEeMBTxg";

        try {
            const response = await axios.get(`${pawapayBaseUrl}/v2/deposits/${latest.depositId}`, {
                headers: {
                    'Authorization': `Bearer ${pawapayApiKey}`,
                    'Content-Type': 'application/json'
                }
            });
            console.log("Pawapay Full Response:");
            console.log(JSON.stringify(response.data, null, 2));
        } catch (e) {
            console.error("Error:", e.message);
            if(e.response) console.log(JSON.stringify(e.response.data));
        }
    }
    process.exit(0);
}

main();
