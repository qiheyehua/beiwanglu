import { NextResponse } from 'next/server';
import { getTodayReviewItems } from '@/lib/knowledge';

// GET: 获取今天需要复习的知识点
export async function GET() {
  try {
    const items = await getTodayReviewItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('获取复习知识点失败:', error);
    return NextResponse.json(
      { error: '获取复习知识点失败' },
      { status: 500 }
    );
  }
} 