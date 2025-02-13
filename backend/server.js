import express from 'express';
import { create } from 'ipfs-http-client';
import cors from 'cors';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const port = 5000;
const baseUrl = `http://localhost:${port}`;

app.use(cors());
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// Resolve __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve Vite-built frontend
app.use(express.static(path.join(__dirname, 'dist')));

// Initialize IPFS client
const ipfs = create({ url: 'http://127.0.0.1:5001' });

const ipfsStorage = {};

// Store data in IPFS
app.post('/api/store', async (req, res) => {
  try {
    const data = JSON.stringify(req.body);
    const { cid } = await ipfs.add(data);
    ipfsStorage[cid.toString()] = req.body;
    res.status(200).json({ cid: cid.toString(), url: `${baseUrl}/api/retrieve/${cid.toString()}` });
  } catch (error) {
    res.status(500).json({ error: 'Failed to store data in IPFS' });
  }
});

// Retrieve data from IPFS
app.get('/api/retrieve/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    if (!ipfsStorage[cid]) {
      return res.status(404).json({ error: 'Data not found' });
    }
    res.status(200).json({ data: ipfsStorage[cid] });
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve data from IPFS' });
  }
});

app.put('/api/update/:cid', async (req, res) => {
  try {
    const cid = req.params.cid;
    const newData = req.body;
    if (!ipfsStorage[cid]) {
      return res.status(404).json({ error: 'Data not found' });
    }
    ipfsStorage[cid] = newData; // Update data in memory
    res.status(200).json({ cid, url: `${baseUrl}/retrieve/${cid}` });
  } catch (error) {
    console.error('Error updating data in IPFS:', error);
    res.status(500).json({ error: 'Failed to update data in IPFS' });
  }
});

// Serve React frontend for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on ${baseUrl}`);
});
