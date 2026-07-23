const path = require('path');
const { google } = require('googleapis');

// Service-account auth from a JSON key file. GOOGLE_CREDENTIALS_PATH points at
// the key (defaults to ./credentials.json). On Render, add the key as a Secret
// File named credentials.json — it mounts at the project root, so the default
// path just works (or point GOOGLE_CREDENTIALS_PATH at /etc/secrets/credentials.json).
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
