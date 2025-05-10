import { NextResponse } from 'next/server';
import { initDb } from '@/lib/db';

// GET: 初始化数据库
export async function GET() {
  try {
    await initDb();
    return NextResponse.json({ message: '数据库初始化成功' });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return NextResponse.json(
      { error: '数据库初始化失败' },
      { status: 500 }
    );
  }
} 