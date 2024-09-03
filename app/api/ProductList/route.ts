import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const gender = searchParams.get('gender');
  const priority = searchParams.get('priority');

  // 필수 파라미터 검증
  if (!gender || !priority) {
    return new NextResponse(JSON.stringify({ error: 'Missing required parameters' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  // 파일 경로 설정
  let fileName;
  if (gender === "남") {
    fileName = priority === "가격우선" ? "Ascending_male_premium.txt" : "Descending_male_premium.txt";
  } else if (gender === "여") {
    fileName = priority === "가격우선" ? "Ascending_female_premium.txt" : "Descending_female_premium.txt";
  } else {
    return new NextResponse(JSON.stringify({ error: 'Invalid gender parameter' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const filePath = path.join(process.cwd(), 'data', fileName);

  try {
    // 파일 읽기
    const content = await fs.readFile(filePath, 'utf8');
    return new NextResponse(content, {
      headers: { 'Content-Type': 'text/plain' },
    });
  } catch (error) {
    console.error("상품 목록을 가져오는 중 오류 발생:", error);
    return new NextResponse(JSON.stringify({ error: 'Failed to read product list' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
