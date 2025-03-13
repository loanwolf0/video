const mongoose = require("mongoose");

let collectionSchema = new mongoose.Schema(
    [{
        domain: { type: String }
    }],
)
module.exports = { collectionSchema, collectionName: "tempMails" }
