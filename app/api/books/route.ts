import { NextRequest, NextResponse } from 'next/server';
import { createServerSupabaseClient } from '@/lib/supabase/server';
import { CreateBookDto } from '@/lib/types';

// GET /api/books - List user's books with optional filtering
export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let query = supabase
      .from('books')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (status && ['Reading', 'Completed', 'Wishlist'].includes(status)) {
      query = query.eq('status', status);
    }

    if (search) {
      query = query.or(`title.ilike.%${search}%,author.ilike.%${search}%`);
    }

    const { data, error } = await query;

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST /api/books - Create a new book
export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerSupabaseClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body: CreateBookDto = await request.json();

    // Validation
    if (!body.title || !body.author || !body.status) {
      return NextResponse.json(
        { error: 'Missing required fields: title, author, status' },
        { status: 400 }
      );
    }

    if (!['Reading', 'Completed', 'Wishlist'].includes(body.status)) {
      return NextResponse.json(
        { error: 'Invalid status. Must be: Reading, Completed, or Wishlist' },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from('books')
      .insert([{ ...body, user_id: user.id }])
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}