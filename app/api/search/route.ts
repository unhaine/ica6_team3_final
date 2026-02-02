
import { NextResponse } from 'next/server';

/**
 * @swagger
 * /api/search:
 *   get:
 *     description: Search for products using Naver Shopping API
 *     parameters:
 *       - name: query
 *         in: query
 *         required: true
 *         description: Search keyword
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       title:
 *                         type: string
 *                       link:
 *                         type: string
 *                       image:
 *                         type: string
 *                       lprice:
 *                         type: string
 *                       mallName:
 *                         type: string
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('query');

  if (!query) {
    return NextResponse.json(
      { error: 'Query parameter "query" is required' },
      { status: 400 }
    );
  }

  const clientId = process.env.AUTH_NAVER_ID;
  const clientSecret = process.env.AUTH_NAVER_SECRET;

  // Mock data for demonstration if keys are unavailable
  if (!clientId || !clientSecret) {
    console.warn('Naver API credentials (AUTH_NAVER_ID, AUTH_NAVER_SECRET) missing. Returning mock data.');
    // ... mock data return ...
  }
  
  // Debug log (Server-side only)
  console.warn('Attempting Naver Search API call with:', {
    clientId: clientId ? clientId.substring(0, 5) + '...' : 'MISSING',
    clientSecret: clientSecret ? 'PRESENT' : 'MISSING',
    query
  });

  try {
    const apiURL = `https://openapi.naver.com/v1/search/shop.json?query=${encodeURIComponent(query)}&display=5`;
    
    const response = await fetch(apiURL, {
      headers: {
        'X-Naver-Client-Id': clientId || '',
        'X-Naver-Client-Secret': clientSecret || '',
      },
      next: { revalidate: 60 } 
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Naver API failed:', response.status, errorText);
      return NextResponse.json(
        { error: `Naver API Error: ${response.status}`, details: errorText },
        { status: response.status }
      );
    }

    const data = await response.json();
    console.warn('Naver API Success, items count:', data.items?.length);
    return NextResponse.json(data);

  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
