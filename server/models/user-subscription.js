const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Types.ObjectId },
        isActive: { type: Boolean, default: true },
        subscriptionId: { type: String },
        customerId: { type: String },
        razorpayPlanId: { type: String },
        planId: { type: mongoose.Types.ObjectId },
        paymentId: { type: String },
        dueDate: { type: Date },
        features: [
            new mongoose.Schema(
                {
                    module: { type: String },
                    quantity: { type: Number },
                },
                { _id: false } // This prevents _id from being added to each feature object
            ),
        ],
        interval: { type: String },
        currency: { type: String },
        amount: { type: Number },
        status: { type: String }
    },
    { timestamps: true }
);

collectionSchema.index({ userId: 1 })
module.exports = { collectionSchema, collectionName: "userSubscription" };
