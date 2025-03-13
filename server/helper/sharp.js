const sharp = require('sharp');
const axios = require('axios');
const path = require('path');
const uploadHelper = require("../helper/common.js");
const ffmpeg = require('fluent-ffmpeg');
const util = require('util');
const ffprobeAsync = util.promisify(ffmpeg.ffprobe);
const fs = require('fs');
const unlinkAsync = util.promisify(fs.unlink);

module.exports.createVideoTemplateThumbnail = async function (background, thumbnail) {
    let backgroundImage;
    let backgroundBuffer;
    let foregroundImage;
    let foregroundBuffer;
    if (background.includes('http')) {
        let { data } = await axios.get(background, { responseType: 'arraybuffer' });
        backgroundBuffer = Buffer.from(data); // Convert ArrayBuffer to Buffer
        backgroundImage = sharp(backgroundBuffer)
    } else backgroundImage = sharp(background)
    let backgroundMetaData = await backgroundImage.metadata()

    if (thumbnail.includes('http')) {
        let { data } = await axios.get(thumbnail, { responseType: 'arraybuffer' });
        foregroundBuffer = Buffer.from(data);
        foregroundImage = sharp(foregroundBuffer)
        foregroundBuffer = await foregroundImage.resize({ width: 200 }).toBuffer()
        foregroundImage = sharp(foregroundBuffer)
    } else foregroundImage = sharp(thumbnail)
    let foregroundMetaData = await foregroundImage.metadata()

    // Create a blank canvas of the same size as the larger image
    const canvas = sharp({
        create: {
            width: backgroundMetaData.width,
            height: backgroundMetaData.height,
            channels: 4, // 4 channels for RGBA
            background: { r: 0, g: 0, b: 0, alpha: 0 }, // Transparent background
        },
    });

    // Calculate the position to center the smaller image on the larger image
    const offsetX = Math.floor((backgroundMetaData.width - foregroundMetaData.width) / 2);
    const offsetY = Math.floor((backgroundMetaData.height - foregroundMetaData.height) / 2);

    // Composite the larger image onto the canvas
    const composedImage = canvas.composite([
        {
            input: backgroundBuffer,
        },
        {
            input: foregroundBuffer,
            left: offsetX,
            top: offsetY,
        }
    ]);


    return await composedImage.jpeg().toBuffer()

}

module.exports.mergeImages = async function(imageArr, options){
    let imageSharp;
    if (imageArr[0].url){
        let { data } = await axios.get(imageArr[0].url, { responseType: 'arraybuffer' });
        imageSharp = sharp(Buffer.from(data))
        delete data
    }
    let compositeArr = []
    for( let i=1; i<imageArr.length; i++){
        let nextSharp;
        if (imageArr[i].url){
            let { data } = await axios.get(imageArr[i].url, { responseType: 'arraybuffer' });
            nextSharp = sharp(Buffer.from(data))
            delete data
        }else if ( imageArr[i].buffer ){
            nextSharp = sharp(imageArr[i].buffer)
        }
        compositeArr.push( { input: await nextSharp.toBuffer() } )
    }
    imageSharp.composite(compositeArr)
    if (options.outputType=='buffer') return imageSharp.toBuffer()
    if (options.outputType=='file' && options.outputFile){
        await imageSharp.toFile( options.outputFile )
        return options.outputFile
    }
    return imageSharp
}


module.exports.createAndUploadImage = async function (headerImageURL, footerImageURL, templateId) {
    try {
        const [headerImageResponse, footerImageResponse] = await Promise.all([
            axios.get(headerImageURL, { responseType: 'arraybuffer' }),
            axios.get(footerImageURL, { responseType: 'arraybuffer' }),
        ]);

        const headerImageBuffer = Buffer.from(headerImageResponse.data, 'binary');
        const resizedHeaderImageBuffer = await sharp(headerImageBuffer).resize({ width: 275 }).toBuffer();
        const footerImageBuffer = Buffer.from(footerImageResponse.data, 'binary');
        const resizedFooterImageBuffer = await sharp(footerImageBuffer).resize({ width: 275 }).toBuffer();

        const canvas = sharp({
            create: {
                width: 275,
                height: 370,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        });

        canvas.composite([
            { input: resizedHeaderImageBuffer, top: 0, left: 0 },
            { input: resizedFooterImageBuffer, top: 290, left: 0 }
        ]);
        const compositeImageBuffer = await canvas.png().toBuffer();

        const remotePath = CONFIG.MEDIA_DATA + 'VideoTemplate/' + templateId + '.png'
        const uploadUrl = await uploadHelper.uploadBufferDataToS3(compositeImageBuffer, remotePath);

        return uploadUrl;
    } catch (error) {
        console.error('Error creating and uploading image:', error.message);
        throw error;
    }
};

module.exports.getFrameRate = async function (videoFilePath) {
    try {
        const metadata = await ffprobeAsync(videoFilePath);
        const videoStream = metadata.streams.find(stream => stream.codec_type === 'video');

        if (videoStream && videoStream.r_frame_rate) {
            return eval(videoStream.r_frame_rate);
        } else {
            console.error("Frame rate not found in video metadata");
            return null;
        }
    } catch (error) {
        throw error;
    }
};

module.exports.extractFramesFromVideo = async function (videoFilePath, frameRate,videoName) {
    const tempImageDir = path.join(__dirname, '..', 'temporary', 'videoframes');
    const dynamicDirectoryName = `${videoName}-${new Date().getTime()}`
    const dynamicDirectoryPath = path.join(tempImageDir, dynamicDirectoryName);

    let frames = [];
    let files = []

    try {
        fs.mkdirSync(dynamicDirectoryPath, { recursive: true });
        await new Promise((resolve, reject) => {
            ffmpeg()
                .on('progress', async () => {
                    try {
                        for (const framePath of frames) {
                            await unlinkAsync(framePath);
                        }
                    } catch (unlinkError) {
                        console.error('Error deleting temporary frames:', unlinkError);
                        reject(unlinkError);
                    }
                })
                .on('error', (err) => {
                    console.error('Error extracting frames from video:', err);
                    reject(err);
                })
                .on('end', (err) => {
                    if (!err) resolve(frames);
                    else reject(err)
                })
                .input(videoFilePath)
                .output(path.join(dynamicDirectoryPath, `%d.png`))
                .outputFPS(frameRate)
                .run()

        });
        const filesInDirectory = getAllFilesInDirectory(dynamicDirectoryPath);
        return filesInDirectory;
    } catch (error) {
        console.error('Error in extractFramesFromVideo:', error);
        throw error;
    }
}
function getAllFilesInDirectory(tempImageDir) {
    const files = fs.readdirSync(tempImageDir);
    let frameNumber = 1;
    let fileName = files.map(file => path.join(tempImageDir, `${frameNumber++}.png`))
    return fileName;
}
module.exports.createImageTemplate = async function (headerImageResponse, footerImageResponse, imageUrl, i,dynamicDirectoryPath) {
    try {
        const headerImageBuffer = Buffer.from(headerImageResponse.data, 'binary');
        const resizedHeaderImageBuffer = await sharp(headerImageBuffer).resize({ width: 1360, height: 400 }).toBuffer();
        const footerImageBuffer = Buffer.from(footerImageResponse.data, 'binary');
        const resizedFooterImageBuffer = await sharp(footerImageBuffer).resize({ width: 1360, height: 400 }).toBuffer();
        const imageBuffer = fs.readFileSync(imageUrl);
        const resizedImageBuffer = await sharp(imageBuffer).resize({ width: 1360, height: 700 }).toBuffer();

        const localFilePath = path.join(dynamicDirectoryPath, `${i + 1}.png`);

        const canvas = sharp({
            create: {
                width: 1360,
                height: 1500,
                channels: 4,
                background: { r: 255, g: 255, b: 255, alpha: 1 }
            }
        });

        const composedImage = canvas.composite([
            { input: resizedHeaderImageBuffer, top: 0, left: 0 },
            { input: resizedImageBuffer, top: 410, left: 0 },
            { input: resizedFooterImageBuffer, top: 1100, left: 0 }
        ]);
        try {
            await composedImage.toFile(localFilePath);
        } catch (error) {
            console.error('Error writing file:', error);
        }
        const filesInDirectory = getAllFilesInDirectory(dynamicDirectoryPath);
        return filesInDirectory;
    } catch (error) {
        console.error('Error creating and uploading image:', error.message);
        throw error;
    }
};

module.exports.extractAudio = function (videoUrl,audioName) {
    return new Promise((resolve, reject) => {
        const localFolderPath = path.join(__dirname, '..', 'temporary');
        const outputAudioPath = path.join(localFolderPath, `${audioName}.mp3`);

        const command =ffmpeg()
            .input(videoUrl)
            .noVideo()
            .audioCodec('libmp3lame')
            .outputFormat('mp3')
            .on('end', () => {
                console.log('Audio extraction finished');
                resolve(outputAudioPath);
            })
            .on('error', (err) => {
                console.error('Error:', err);
                reject(err);
            })
            .save(outputAudioPath);
    });
};
module.exports.createVideoFromFrames = async function (framePaths, framerate,audioPath,videoName,localFolderPath) {
    const outputVideoPath = path.join(localFolderPath, `${videoName}.mp4`);
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(`concat:${framePaths.join('|')}`)
            .inputOptions(`-r ${framerate}`)
            .input(audioPath)
            .output(outputVideoPath)
            .on('end', () => resolve(outputVideoPath))
            .on('error', (err) => reject(err))
            .run();
    });

}