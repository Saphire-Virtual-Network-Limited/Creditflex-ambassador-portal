import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { path } = req.query;
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;
  
  if (!apiUrl) {
    return res.status(500).json({ error: 'API URL not configured' });
  }

  try {
    const targetUrl = `${apiUrl}/${Array.isArray(path) ? path.join('/') : path}`;
    
    const headers: HeadersInit = {
      'Accept': '*/*',
      'Content-Type': 'application/json',
    };

    // Forward headers from the original request
    if (req.headers.authorization) {
      headers['Authorization'] = req.headers.authorization;
    }
    if (req.headers['x-app-key']) {
      headers['x-app-key'] = req.headers['x-app-key'] as string;
    }
    if (req.headers['requestapikey']) {
      headers['requestApiKey'] = req.headers['requestapikey'] as string;
    }

    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.method !== 'GET' && req.method !== 'HEAD' ? JSON.stringify(req.body) : undefined,
    });

    const data = await response.json();
    
    // Forward the response status and data
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Proxy error:', error);
    res.status(500).json({ error: 'Proxy request failed' });
  }
} 