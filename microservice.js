const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// Sample in-memory storage for registered companies
const registeredCompanies = {};

// Sample product data
const sampleProducts = [
  { id: '1', name: 'Product 1', price: 10, rating: 4, company: 'Company A', discount: 0 },
  { id: '2', name: 'Product 2', price: 20, rating: 5, company: 'Company B', discount: 5 },
  { id: '3', name: 'Product 3', price: 15, rating: 4.5, company: 'Company C', discount: 10 },
  // Add more sample products as needed
];

// Register endpoint
app.post('/test/register', (req, res) => {
  const { companyName, ownerName, rollNo, ownerEmail, accessCode } = req.body;

  if (accessCode !== 'bntKpm') {
    return res.status(403).json({ error: 'Invalid access code' });
  }

  if (registeredCompanies[rollNo]) {
    return res.status(400).json({ error: 'Company already registered' });
  }

  const clientID = generateUUID();
  const clientSecret = generateRandomString();

  registeredCompanies[rollNo] = {
    companyName,
    clientID,
    clientSecret,
    ownerName,
    ownerEmail,
    rollNo,
  };

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
  const { companyName, clientID, clientSecret, ownerName, ownerEmail, rollNo } = req.body;

  if (!registeredCompanies[rollNo]) {
    return res.status(404).json({ error: 'Company not registered' });
  }

  const registeredCompany = registeredCompanies[rollNo];
  if (registeredCompany.companyName !== companyName || registeredCompany.clientID !== clientID || registeredCompany.clientSecret !== clientSecret) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const authToken = generateRandomString();

  res.json({
    authToken,
  });
});

// Top products endpoint
app.get('/categories/:categoryname/products', (req, res) => {
  const { categoryname } = req.params;
  let { n, page, sortBy, sortOrder } = req.query;
  n = parseInt(n) || 10;
  page = parseInt(page) || 1;
  sortBy = sortBy || 'rating';
  sortOrder = sortOrder === 'desc' ? -1 : 1;

  // Sample implementation - Fetch products from API
  const products = sampleProducts
    .filter(product => product.category === categoryname)
    .sort((a, b) => (a[sortBy] - b[sortBy]) * sortOrder)
    .slice((page - 1) * n, page * n);

  res.json(products);
});

// Product details endpoint
app.get('/categories/:categoryname/products/:productid', (req, res) => {
  const { categoryname, productid } = req.params;

  // Sample implementation - Find product by ID
  const product = sampleProducts.find(product => product.id === productid && product.category === categoryname);

  if (!product) {
    return res.status(404).json({ error: 'Product not found' });
  }

  res.json(product);
});

// Helper function to generate UUID
function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    var r = Math.random() * 16 | 0,
        v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
}

// Helper function to generate random string
function generateRandomString() {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Start server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
