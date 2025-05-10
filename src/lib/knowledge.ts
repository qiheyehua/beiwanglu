import { sql } from './db';
import { addDays } from 'date-fns';

// 知识点类型定义
export type KnowledgeItem = {
  id: string;
  title: string;
  created_at: Date;
  last_reviewed_at: Date;
  review_count: number;
  next_review_date: Date;
};

// 根据艾宾浩斯遗忘曲线计算下次复习日期
export function calculateNextReviewDate(reviewCount: number, lastReviewDate: Date): Date {
  // 艾宾浩斯遗忘曲线的复习间隔（天数）
  const intervals = [1, 2, 4, 7, 15, 30];
  
  // 获取当前复习次数对应的间隔天数，如果超出预设间隔，使用最后一个间隔
  const interval = reviewCount < intervals.length ? intervals[reviewCount] : intervals[intervals.length - 1];
  
  // 计算下次复习日期
  return addDays(lastReviewDate, interval);
}

// 添加新知识点
export async function addKnowledgeItem(title: string): Promise<KnowledgeItem> {
  const result = await sql`
    INSERT INTO knowledge_items (title)
    VALUES (${title})
    RETURNING *
  `;
  
  return result[0] as KnowledgeItem;
}

// 获取所有知识点
export async function getAllKnowledgeItems(): Promise<KnowledgeItem[]> {
  const result = await sql`
    SELECT * FROM knowledge_items
    ORDER BY created_at DESC
  `;
  
  return result as KnowledgeItem[];
}

// 获取今天需要复习的知识点
export async function getTodayReviewItems(): Promise<KnowledgeItem[]> {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  
  const result = await sql`
    SELECT * FROM knowledge_items
    WHERE next_review_date >= ${today} AND next_review_date < ${tomorrow}
    ORDER BY next_review_date ASC
  `;
  
  return result as KnowledgeItem[];
}

// 标记知识点已复习
export async function markAsReviewed(id: string): Promise<KnowledgeItem> {
  const now = new Date();
  
  // 先获取当前知识点信息
  const currentItem = await sql`
    SELECT * FROM knowledge_items WHERE id = ${id}
  `;
  
  if (currentItem.length === 0) {
    throw new Error('知识点不存在');
  }
  
  const item = currentItem[0] as KnowledgeItem;
  const newReviewCount = item.review_count + 1;
  const nextReviewDate = calculateNextReviewDate(newReviewCount, now);
  
  // 更新知识点复习信息
  const result = await sql`
    UPDATE knowledge_items
    SET 
      last_reviewed_at = ${now},
      review_count = ${newReviewCount},
      next_review_date = ${nextReviewDate}
    WHERE id = ${id}
    RETURNING *
  `;
  
  return result[0] as KnowledgeItem;
}

// 删除知识点
export async function deleteKnowledgeItem(id: string): Promise<void> {
  await sql`
    DELETE FROM knowledge_items
    WHERE id = ${id}
  `;
} 