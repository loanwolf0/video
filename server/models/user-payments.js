const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{
        userId: { type: String },
        paymentId: { type: String },
        subscriptionId: { type: String },
        planId: { type: String },
    }], { timestamps: true }
)
module.exports = { collectionSchema, collectionName: "userPayments" }
