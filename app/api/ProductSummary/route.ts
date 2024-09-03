import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

const ROOT_DIR = process.cwd();

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const productName = searchParams.get('productName');

  if (!productName) {
    return new NextResponse(JSON.stringify({ error: 'Missing required parameter: productName' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 파일 이름에서 허용되지 않는 문자만 제거하고 공백은 유지
  const sanitizedProductName = productName.replace(/[<>:"/\\|?*]/g, '').trim();
  const fileName = `${sanitizedProductName}.txt`;
  const filePath = path.join(ROOT_DIR, 'data', 'DriverSummary', fileName);

  console.log("요청된 상품명:", productName);
  console.log("정규화된 파일 이름:", fileName);
  console.log("전체 파일 경로:", filePath);

  try {
    await fs.access(filePath);
    const content = await fs.readFile(filePath, 'utf8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error: unknown) {
    console.error("상품 요약서를 가져오는 중 오류 발생:", error);
    
    if (error instanceof Error) {
      if ('code' in error && error.code === 'ENOENT') {
        return new NextResponse(JSON.stringify({ 
          error: 'Product summary not found',
          requestedProductName: productName,
          sanitizedFileName: fileName
        }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }
    
    return new NextResponse(JSON.stringify({ error: 'Failed to read product summary' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
