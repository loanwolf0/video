const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{

        token: { type: String },
        userId: { type: String },
        createdAt: {
            type: Date,
            default: Date.now,
            expires: 3600,// this is the expiry time in seconds
        },
    }]
)
module.exports = { collectionSchema, collectionName: "userTokens" }
