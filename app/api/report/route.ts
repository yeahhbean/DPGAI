import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const insuranceType = searchParams.get('insuranceType');
  const gender = searchParams.get('gender');
  const company = searchParams.get('company');
  const priority = searchParams.get('priority');

  if (!insuranceType || !gender || !priority) {
    return NextResponse.json({ error: '보험 종류, 성별, 우선순위가 필요합니다.' }, { status: 400 });
  }

  const fileName = gender === '남' ? 'sorted_by_male_premium.txt' : 'sorted_by_female_premium.txt';

  try {
    const dataDir = path.join(process.cwd(), 'data', insuranceType);
    let companies = company ? [company] : await fs.readdir(dataDir);
    let allBlocks = [];

    for (const companyName of companies) {
      const filePath = path.join(dataDir, companyName, fileName);
      try {
        const fileContent = await fs.readFile(filePath, 'utf-8');
        const blocks = fileContent.match(/\[end\] 암 \d+[\s\S]*?\[\\end\]/g) || [];
        allBlocks.push(...blocks);
      } catch (error) {
        console.error(`Error reading file for company ${companyName}:`, error);
      }
    }

    if (allBlocks.length === 0) {
      return NextResponse.json({ error: '해당하는 보험 데이터를 찾을 수 없습니다.' }, { status: 404 });
    }

    // 가격 우선 정렬 (이미 정렬되어 있으므로 추가 정렬 불필요)
    const relevantBlocks = allBlocks.slice(0, 2).join('\n\n');

    return new NextResponse(relevantBlocks, {
      status: 200,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' }
    });
  } catch (error) {
    console.error('Error reading insurance data:', error);
    return NextResponse.json({ error: '보험 데이터를 읽는 중 오류가 발생했습니다.' }, { status: 500 });
  }
}
