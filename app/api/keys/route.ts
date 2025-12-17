import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

// GET all API keys (with optional filtering)
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const environment = searchParams.get('environment');

    let query = supabase
      .from('api_keys')
      .select('*')
      .order('created_at', { ascending: false });

    // Apply filters if provided
    if (status && status !== 'all') {
      query = query.eq('status', status);
    }

    if (environment && environment !== 'all') {
      query = query.eq('environment', environment);
    }

    const { data, error } = await query;

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to fetch API keys', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 200 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new API key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, secret, scopes, environment } = body;

    // Validate required fields
    if (!name || !secret || !scopes || !environment) {
      return NextResponse.json(
        { error: 'Missing required fields: name, secret, scopes, environment' },
        { status: 400 }
      );
    }

    // Insert new API key
    const { data, error } = await supabase
      .from('api_keys')
      .insert([
        {
          name,
          secret,
          status: 'active',
          scopes,
          environment,
          last_used: null,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Supabase error:', error);
      return NextResponse.json(
        { error: 'Failed to create API key', details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    console.error('Server error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

