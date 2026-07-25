const {cert, initializeApp} = require("firebase-admin");
const serviceAccount = require("../serviceAccountKey.json");


module.exports.app = initializeApp({ credential: cert(serviceAccount)});