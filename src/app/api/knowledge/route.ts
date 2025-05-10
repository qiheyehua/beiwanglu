import { NextResponse } from 'next/server';
import { addKnowledgeItem, getAllKnowledgeItems, deleteKnowledgeItem } from '@/lib/knowledge';

// GET: 获取所有知识点
export async function GET() {
  try {
    const items = await getAllKnowledgeItems();
    return NextResponse.json({ items });
  } catch (error) {
    console.error('获取知识点失败:', error);
    return NextResponse.json(
      { error: '获取知识点失败' },
      { status: 500 }
    );
  }
}

// POST: 添加新知识点
export async function POST(request: Request) {
  try {
    const { title } = await request.json();
    
    if (!title || typeof title !== 'string' || title.trim() === '') {
      return NextResponse.json(
        { error: '知识点标题不能为空' },
        { status: 400 }
      );
    }
    
    const newItem = await addKnowledgeItem(title.trim());
    return NextResponse.json({ item: newItem }, { status: 201 });
  } catch (error) {
    console.error('添加知识点失败:', error);
    return NextResponse.json(
      { error: '添加知识点失败' },
      { status: 500 }
    );
  }
} 