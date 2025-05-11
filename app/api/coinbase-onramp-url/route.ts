import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const wallet = searchParams.get('wallet');

  if (!wallet) {
    return NextResponse.json({ error: 'Missing wallet address' }, { status: 400 });
  }

  // Replace with your actual Coinbase Onramp API endpoint and API key
  const COINBASE_API_KEY = process.env.COINBASE_ONRAMP_API_KEY;
  const COINBASE_API_URL = 'https://api.commerce.coinbase.com/onramp/generate-one-click-buy-url'; // Example, check docs for actual endpoint

  try {
    const response = await fetch(COINBASE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CC-Api-Key': COINBASE_API_KEY || '',
      },
      body: JSON.stringify({
        destination_wallet: wallet,
        // Add any other required params here
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      return NextResponse.json({ error }, { status: 500 });
    }

    const data = await response.json();
    // Assume the API returns { url: "https://..." }
    return NextResponse.json({ url: data.url });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || 'Failed to generate onramp URL' }, { status: 500 });
  }
} 