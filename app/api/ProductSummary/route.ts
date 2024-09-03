import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const type = searchParams.get('type');
  const name = searchParams.get('name');

  const filePath = path.join(process.cwd(), 'data', 'report', type as string, `${name}.txt`);

  try {
    const content = await fs.readFile(filePath, 'utf8');
    return new NextResponse(content);
  } catch (error) {
    return new NextResponse(JSON.stringify({ error: 'Failed to read product summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
