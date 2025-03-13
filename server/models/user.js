const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{
        firstName: { type: String },
        lastName: { type: String },
        email: { type: String },
        password: { type: String },
        userType: { type: String, enum: ['endUser', 'partner', 'admin'], default: 'endUser' },
        refId: { type: mongoose.Types.ObjectId },
        isActive: { type: Boolean, default: false },
        isVerified: { type: Boolean, default: false },
        activePlan: { type: String },
        planId: { type: mongoose.Types.ObjectId },
        planType: { type: String, enum: ['FREE_TRIAL', 'BASIC', 'PREMIUM', 'ELITE'], default: 'FREE_TRIAL' }

    }], { timestamps: true }
)
module.exports = { collectionSchema, collectionName: "user" }
