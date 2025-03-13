const crypto = require("crypto");
const { google } = require('googleapis');
const dotenv = require('dotenv');

//const Razorpay = require('razorpay');
//const axios = require('axios')
//const qs = require('qs')
//const userDao = require('../dao/user')

/*
var instance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY,
    key_secret: process.env.RAZORPAY_SECRET,
});const crypto = require("crypto");
const express = require('express');
const { google } = require('googleapis');
const dotenv = require('dotenv');
*/

// Define the scope of access for the Google Calendar API.
const scopes = ['https://www.googleapis.com/auth/calendar'];

// OAuth 2 configuration
const oauth2Client = new google.auth.OAuth2
(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URL
);

const calendar = google.calendar({
    version: 'v3', 
    auth: oauth2Client
});

// Step 1: Authenticate and generate Redirect URL 
module.exports.authClient = async function () {
    try{
        //console.log('Authenticating Client')
        const url = oauth2Client.generateAuthUrl({
            access_type: 'offline',
            scope: scopes,
        });
        //res.redirect(url);
        return url;
    }catch(error) {
        console.error('Error while authenticating token:', error.message);
    }
}

// Step 2: Generate Google Token
module.exports.generateToken = async function (googleCode) {
    const { tokens } = await oauth2Client.getToken(googleCode);
    return oauth2Client.setCredentials(tokens);    
}

// Step 3: Verify and Regenerate Google Token
module.exports.verifyRegenerateToken = async function (tokens) {
    // Check if access token is expired and refresh if necessary
    if (tokens.expiry_date <= Date.now()) {
        const newTokens = await oauth2Client.refreshAccessToken();
        return newTokens.credentials;
        //oauth2Client.setCredentials(newTokens.credentials);
        // Update the stored tokens in the database
        //updateTokensInDatabase(clientId, newTokens.credentials);
    }else{
        return tokens;
    }
}


// Step 4: Create an event using stored tokens
module.exports.createEvent = async function (tokens, requestEmail) {
    const clientId = req.params.clientId;
    //const tokens = getTokensFromDatabase(clientId); // Retrieve stored tokens

    const calendar = google.calendar({ version: 'v3', auth: oauth2Client });
    oauth2Client.setCredentials(tokens);

    // Create the event
    const event = {
        summary: 'Google Meet Event',
        description: 'A test event with Google Meet link.',
        start: {
            dateTime: '2024-10-10T10:00:00-07:00', // Adjust time as needed
            timeZone: 'America/Los_Angeles',
        },
        end: {
            dateTime: '2024-10-10T11:00:00-07:00', // Adjust time as needed
            timeZone: 'America/Los_Angeles',
        },
        conferenceData: {
            createRequest: {
                requestId: 'random-string', // Ensure this is unique
                conferenceSolutionKey: {
                    type: 'hangoutsMeet',
                },
            },
        },
        attendees: [
            { email: requestEmail }, // Add attendee email
        ],
    };

    try {
        const response = await calendar.events.insert({
            calendarId: 'primary',
            resource: event,
            conferenceDataVersion: 1,
        });
        //res.send(`Event created: ${response.data.htmlLink}`);
        return response.data.htmlLink;
    } catch (error) {
        console.error('Error creating event:', error);
        res.status(500).send('Error creating event.');
    }
}

