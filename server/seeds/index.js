const path = require("path");
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mongoose = require("mongoose");
const model = require("../models/index.js");

let dataSet = [
    ...(process.env.NODE_ENV === 'production' ? [{
        modelName: 'tempMails',
        clear: true,
        documents: require('./temp-mails.json')
    }] : []),
    {
        modelName: 'user',
        clear: false,
        update: true, // Update existing users
        documents: require('./admin.js')
    }
];

mongoose.connect(`${process.env.MONGO_URL}${process.env.DB_NAME}`)
    .then(async () => {
        console.log('Connection to DB established\n');

        for (const item of dataSet) {
            const collection = model[item.modelName];
            console.log(`================= Running seeder: ${item.modelName} =================`);
            if (item.clear) {
                await collection.deleteMany();
                console.log('Seeds:', 'existing', item.modelName, 'documents deleted');
            }

            let docLength = item.documents.length;
            for (let i = 0; i < docLength; i++) {
                const doc = item.documents[i];

                if (item.clear) {
                    // Insert new document normally
                    await new collection(doc).save();
                    console.log('Seeds:', i + 1, item.modelName, 'generated');
                } else if (item.update) {
                    // Update existing or insert new documents
                    await collection.findOneAndUpdate(
                        { _id: doc._id },
                        doc,
                        { upsert: true, new: true }
                    );
                    console.log('Seeds:', i + 1, item.modelName, 'updated or inserted');
                } else {
                    // Check if the document already exists
                    const existingDoc = await collection.findOne({ _id: doc._id });

                    if (!existingDoc) {
                        // Insert only if it does not exist
                        await new collection(doc).save();
                        console.log('Seeds:', i + 1, item.modelName, 'inserted (new)');
                    } else {
                        console.log('Seeds:', i + 1, item.modelName, 'skipped (already exists)');
                    }
                }
            }

            console.log(`================= Seeder completed: ${item.modelName} =================`);
        }

        mongoose.disconnect().then(() => {
            console.log('\nSeeds: Data has been generated successfully!');
        });
    })
    .catch(error => {
        console.error('Seeds: Could not establish mongoose connection', error);
    });
