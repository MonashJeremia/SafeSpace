const {setGlobalOptions} = require("firebase-functions/v2");
const {onCall} = require("firebase-functions/v2/https");
const admin = require("firebase-admin");

admin.initializeApp();
setGlobalOptions({maxInstances: 10});

/**
 * Records a donation with atomic transaction
 * Tracks total amount and count in Firestore
 */
exports.recordDonation = onCall(async (request) => {
  const {amount, email} = request.data;

  // Validate input
  if (!amount || amount <= 0) throw new Error("Invalid donation amount");
  if (!email || !email.includes("@")) throw new Error("Invalid email");

  const db = admin.firestore();
  const statsRef = db.collection("stats").doc("donations");

  // Atomic transaction: update stats and record donation
  await db.runTransaction(async (transaction) => {
    const stats = await transaction.get(statsRef);
    const data = stats.data() || {totalAmount: 0, donationCount: 0};

    transaction.set(statsRef, {
      totalAmount: data.totalAmount + amount,
      donationCount: data.donationCount + 1,
      lastUpdated: admin.firestore.FieldValue.serverTimestamp(),
    });

    transaction.set(db.collection("donations").doc(), {
      amount,
      email,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

  return {success: true, message: "Donation recorded"};
});

/**
 * Retrieves donation statistics
 */
exports.getDonationStats = onCall(async () => {
  const db = admin.firestore();
  const stats = await db.collection("stats").doc("donations").get();
  const data = stats.data() || {totalAmount: 0, donationCount: 0};

  return {
    success: true,
    totalAmount: data.totalAmount,
    donationCount: data.donationCount,
    lastUpdated: data.lastUpdated,
  };
});
