const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample in-memory storage for registered companies
const registeredCompanies = {};

// Register endpoint
app.post('/test/register', (req, res) => {
  // Extract registration data from request body
  const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

  // Validate access code
  if (accessCode !== 'bntKpm') {
    return res.status(403).json({ error: 'Invalid access code' });
  }

  // Check if the company is already registered
  if (registeredCompanies[rollNo]) {
    return res.status(400).json({ error: 'Company already registered' });
  }

  // Generate client ID and client secret (sample generation)
  const clientID = generateUUID();
  const clientSecret = generateRandomString();

  // Save registration data
  registeredCompanies[rollNo] = {
    companyName,
    clientID,
    clientSecret,
    ownerName,
    ownerEmail,
    rollNo,
  };

  // Send response
  res.json({
    companyName,
    clientID,
    clientSecret,
    ownerName,
    ownerEmail,
    rollNo,
  });
});

// Authorization token endpoint
app.post('/test/auth', (req, res) => {
    // Extract authorization data from request body
    const { companyName, clientID, clientSecret, ownerName, ownerEmail, rollno } = req.body;
  
    // Check if the company is registered
    if (!registeredCompanies[rollno]) {
      return res.status(404).json({ error: 'Company not registered' });
    }
  
    // Check if the provided client ID and client secret match the registered data
    const registeredCompany = registeredCompanies[rollno];
    if (registeredCompany.companyName !== companyName || registeredCompany.clientID !== clientID || registeredCompany.clientSecret !== clientSecret) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
  
    // Generate authorization token (sample generation)
    const authToken = generateRandomString();
  
    // Send response with authorization token and expiration time
    const response = {
      token_type: 'Bearer',
      access_token: authToken,
      expires_in: Date.now() + (60 * 60 * 1000), // Token expires in 1 hour
    };
  
    res.status(200).json(response);
  });
  

// Helper function to generate UUID (sample implementation)
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c == 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to generate random string (sample implementation)
function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
