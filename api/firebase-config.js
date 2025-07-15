// api/firebase-config.js
// This Vercel Serverless Function provides Firebase configuration
// securely from environment variables.

export default function handler(req, res) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    // Retrieve Firebase configuration from Vercel environment variables
    // These variables MUST be set in your Vercel project settings.
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    // Basic validation: ensure essential keys are present
    if (!firebaseConfig.apiKey || !firebaseConfig.projectId || !firebaseConfig.appId) {
        console.error("Missing one or more Firebase environment variables.");
        return res.status(500).json({ error: 'Server configuration error: Firebase environment variables missing.' });
    }

    res.status(200).json(firebaseConfig);
}
