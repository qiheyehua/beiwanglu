import { NextRequest, NextResponse } from 'next/server';
import { deleteKnowledgeItem, markAsReviewed } from '@/lib/knowledge';

// DELETE: 删除知识点
export async function DELETE(request: NextRequest) {
  try {
    // 从URL中获取ID
    const url = request.nextUrl.pathname;
    const id = url.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: '知识点ID不能为空' },
        { status: 400 }
      );
    }
    
    await deleteKnowledgeItem(id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('删除知识点失败:', error);
    return NextResponse.json(
      { error: '删除知识点失败' },
      { status: 500 }
    );
  }
}

// PATCH: 标记知识点已复习
export async function PATCH(request: NextRequest) {
  try {
    // 从URL中获取ID
    const url = request.nextUrl.pathname;
    const id = url.split('/').pop();
    
    if (!id) {
      return NextResponse.json(
        { error: '知识点ID不能为空' },
        { status: 400 }
      );
    }
    
    const updatedItem = await markAsReviewed(id);
    return NextResponse.json({ item: updatedItem });
  } catch (error) {
    console.error('更新知识点失败:', error);
    return NextResponse.json(
      { error: '更新知识点失败' },
      { status: 500 }
    );
  }
} 