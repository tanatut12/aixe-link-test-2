import axios from 'axios';

const API_BASE_URL = 'http://103.121.12.92:9582';

export default async function handler(req, res) {
    // Enable CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const response = await axios.get(`${API_BASE_URL}/test-data`, {
            responseType: 'text',
        });

        res.setHeader('Content-Type', 'text/xml');
        return res.status(200).send(response.data);
    } catch (error) {
        console.error('Proxy error:', error.message);
        return res.status(500).json({
            error: 'Failed to fetch data from API',
            message: error.message
        });
    }
}

