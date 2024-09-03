import { NextResponse } from 'next/server';
import fs from 'fs';
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

  // URL 디코딩 후 파일 시스템에서 허용되지 않는 문자 제거
  const decodedProductName = decodeURIComponent(productName);
  const sanitizedProductName = decodedProductName.replace(/[<>:"\/\\|?*]/g, '');
  const fileName = `${sanitizedProductName}.txt`;
  const filePath = path.join(ROOT_DIR, 'data', 'DriverSummary', fileName);

  console.log("요청된 상품명:", productName);
  console.log("디코딩된 상품명:", decodedProductName);
  console.log("정규화된 파일 이름:", fileName);
  console.log("전체 파일 경로:", filePath);

  try {
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      return new NextResponse(content, {
        headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      });
    } else {
      console.error("파일을 찾을 수 없음:", filePath);
      return new NextResponse(JSON.stringify({ 
        error: 'Product summary not found',
        requestedProductName: productName,
        decodedProductName: decodedProductName,
        sanitizedFileName: fileName
      }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error("상품 요약서를 가져오는 중 오류 발생:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read product summary', details: error }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
