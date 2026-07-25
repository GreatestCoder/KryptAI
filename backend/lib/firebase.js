const { cert, initializeApp } = require("firebase-admin");
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);


module.exports.app = initializeApp({ credential: cert(serviceAccount) });