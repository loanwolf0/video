const bcrypt = require('bcrypt');
const saltRounds = Number(process.env.SALT_ROUNDS);
const crypto = require('crypto');
// const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
// const { GetObjectCommand, S3 } = require('@aws-sdk/client-s3');

const fs = require('fs')

// var s3 = new S3({
//     credentials: {
//         accessKeyId: process.env.S3_ACCESS_KEY,
//         secretAccessKey: process.env.S3_SECRET_KEY
//     },
//     region: process.env.S3_REGION,
// })

// Function to hash a password
module.exports.hashPassword = async (plainPassword) => {
    try {
        const hashedPassword = await bcrypt.hash(plainPassword, saltRounds);
        return hashedPassword;
    } catch (error) {
        throw error;
    }
};

// Function to verify a password
module.exports.comparePasswords = async (plainPassword, hashedPassword) => {
    try {
        const match = await bcrypt.compare(plainPassword, hashedPassword);
        return match;
    } catch (error) {
        throw error;
    }
};


// module.exports.uploadFileToS3 = async function (options) {
//     return new Promise((resolve, reject) => {
//         try {
//             const params = {
//                 Body: fs.createReadStream(options.localPath),
//                 Bucket: process.env.S3_BUCKET_NAME,
//                 Key: options.remotePath,
//                 ContentType: options.contentType ? options.contentType : 'audio/mpeg'
//             };


//             s3.putObject(params, function (err, data) {
//                 if (err) {
//                     console.error('Error occurred while uploading file to S3:', err);
//                     reject(err);
//                 } else {
//                     fs.unlinkSync(options.localPath);
//                     resolve(data);
//                 }
//             });
//         } catch (error) {
//             reject(error);
//         }
//     });
// }

// module.exports.uploadBufferDataToS3 = async function (buffer, remotePath) {
//     return await s3.putObject({
//         Body: buffer,
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: remotePath
//     });
// }

// module.exports.deleteDirectoryFromS3 = async function (dir) {
//     const listParams = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Prefix: dir
//     };

//     const listedObjects = await s3.listObjectsV2(listParams);
//     console.log("🚀 ~ ddddddddmodule.exports.deleteDirectoryFromS3 ~ listedObjects:", listedObjects)
//     if (!listedObjects.Contents) return;

//     if (listedObjects.Contents.length === 0) return;

//     const deleteParams = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Delete: { Objects: [] }
//     };

//     listedObjects.Contents.forEach(({ Key }) => {
//         deleteParams.Delete.Objects.push({ Key });
//     });

//     await s3.deleteObjects(deleteParams);

//     if (listedObjects.IsTruncated) await deleteDirectoryFromS3(dir);
// }

// module.exports.deleteFileFromS3 = async function (filePath) {
//     const params = {
//         Bucket: process.env.S3_BUCKET_NAME,
//         Key: filePath
//     };

//     try {
//         await s3.deleteObject(params);
//         console.log(`File deleted successfully: ${filePath}`);
//     } catch (error) {
//         console.error(`Error deleting file: ${filePath}`, error);
//         throw error;
//     }
// }


// module.exports.generatePreSignedGetUrl = async function (fileName) {
//     let url = await getSignedUrl(s3, new GetObjectCommand({
//         Key: fileName,
//         Bucket: process.env.S3_BUCKET_NAME
//     }));
//     return url
// }

// module.exports.downloadFileFromS3 = async function (options) {
//     try {
//         const params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: options.remotePath
//         };

//         const data = await s3.getObject(params);
//         fs.writeFileSync(options.localPath, data.Body);
//         console.log(`File downloaded from S3 to ${options.localPath}`);
//     } catch (error) {
//         throw error;
//     }
// }


// module.exports.createMultipartUpload = async (uploadId, userId) => {
//     try {
//         const params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `recordings/${userId}/${uploadId}.webm`,
//             ContentType: `video/webm`
//         };

//         let { UploadId } = await s3.createMultipartUpload(params);
//         console.log("CREATED MULTIPART")
//         return UploadId;
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports.uploadPart = async (sessionRec, partNumber, filePath) => {
//     try {
//         const params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `recordings/${sessionRec.userId}/${sessionRec.uploadId}.webm`,
//             PartNumber: partNumber,
//             UploadId: sessionRec.s3UploadId,
//             Body: fs.createReadStream(filePath)
//         };
//         let data = await s3.uploadPart(params);
//         console.log("UPLOADED MULTIPART")
//         return data
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports.completeMultipartUpload = async (sessionRec) => {
//     try {
//         const params = {
//             Bucket: process.env.S3_BUCKET_NAME,
//             Key: `recordings/${sessionRec.userId}/${sessionRec.uploadId}.webm`,
//             UploadId: sessionRec.s3UploadId,
//         };

//         s3.listParts(params, (err, data) => {
//             if (err) {
//                 console.error('Error listing parts:', err);
//                 throw err
//             }
//             const parts = data.Parts.map(part => ({
//                 ETag: part.ETag,
//                 PartNumber: part.PartNumber
//             }));

//             const completeParams = {
//                 Bucket: process.env.S3_BUCKET_NAME,
//                 Key: `recordings/${sessionRec.userId}/${sessionRec.uploadId}.webm`,
//                 UploadId: sessionRec.s3UploadId,
//                 MultipartUpload: { Parts: parts }
//             };

//             s3.completeMultipartUpload(completeParams, (err, data) => {
//                 if (err) {
//                     console.error('Error completing upload:', err);
//                     throw err
//                 }
//                 console.log("COMPLETED ASWELL")
//                 return data
//             });
//         });
//     } catch (error) {
//         throw error;
//     }
// };

// module.exports.generateRandomString = (length = 8) => {
//     const timestamp = Date.now().toString(36);
//     const randomPart = crypto.randomBytes(Math.ceil(length / 2)).toString("base64")
//         .replace(/[^a-zA-Z0-9]/g, "").substring(0, length - timestamp.length);

//     return (randomPart + timestamp).substring(0, length);
// }

module.exports.delay = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
}
module.exports.generateSharedResourceUrl = (baseUrl, id) => {
    return `${baseUrl}/login?shareToken=${id}`;
};
module.exports.convertToSeconds = (duration) => {
    const hoursInSeconds = duration.HH * 3600; // 1 hour = 3600 seconds
    const minutesInSeconds = duration.MM * 60; // 1 minute = 60 seconds
    const seconds = duration.SS; // seconds are already in seconds

    return hoursInSeconds + minutesInSeconds + seconds;
}

module.exports.getFeatureByModuleName = (plan, moduleName) => {
    return plan.features.find((feature) => feature.module === moduleName) || {};
}