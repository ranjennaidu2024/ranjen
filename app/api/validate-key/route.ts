import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { apiKey } = body;

    if (!apiKey) {
      return NextResponse.json(
        { error: 'API key is required', valid: false },
        { status: 400 }
      );
    }

    // Query Supabase to check if the API key exists and is active
    const { data, error } = await supabase
      .from('api_keys')
      .select('id, status')
      .eq('secret', apiKey)
      .single();

    if (error || !data) {
      return NextResponse.json(
        { error: 'Invalid API key', valid: false },
        { status: 401 }
      );
    }

    // Check if the key is active
    if (data.status !== 'active') {
      return NextResponse.json(
        { error: 'API key is revoked', valid: false },
        { status: 401 }
      );
    }

    // Update last_used timestamp
    await supabase
      .from('api_keys')
      .update({ last_used: new Date().toISOString() })
      .eq('id', data.id);

    return NextResponse.json(
      { message: 'Valid API key', valid: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error', valid: false },
      { status: 500 }
    );
  }
}
