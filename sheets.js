const path = require('path');
const { google } = require('googleapis');

// Service-account auth. GOOGLE_CREDENTIALS_PATH points at the JSON key file
// you download from Google Cloud (defaults to ./credentials.json).
const auth = new google.auth.GoogleAuth({
    keyFile: process.env.GOOGLE_CREDENTIALS_PATH || path.join(__dirname, 'credentials.json'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

const sheets = google.sheets({ version: 'v4', auth });

// Appends one contact submission as a row to the configured sheet.
// Columns: Timestamp | First Name | Last Name | Email | Message
async function appendContact({ firstName, lastName, email, message }) {
    await sheets.spreadsheets.values.append({
        spreadsheetId: process.env.SPREADSHEET_ID,
        range: 'Sheet1!A:E',
        valueInputOption: 'USER_ENTERED',
        requestBody: {
            values: [[new Date().toISOString(), firstName, lastName, email, message]],
        },
    });
}

module.exports = { appendContact };
