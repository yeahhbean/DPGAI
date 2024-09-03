import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productName = searchParams.get('productName');

  // 필수 파라미터 검증
  if (!productName) {
    return new NextResponse(JSON.stringify({ error: 'Missing required parameter: productName' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 파일 경로 설정
  const fileName = `${productName}.txt`;
  const filePath = path.join(process.cwd(), '..', 'data', '운전자상품요약서', fileName);

  try {
    // 파일 읽기
    const content = await fs.readFile(filePath, 'utf8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error("상품 요약서를 가져오는 중 오류 발생:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read product summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
