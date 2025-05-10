import { neon } from '@neondatabase/serverless';

// 使用环境变量中的数据库连接URL
// 在实际部署时，请在.env.local文件中设置DATABASE_URL
const DATABASE_URL = process.env.DATABASE_URL || 'postgresql://beiwanglu_owner:npg_DcZJpn4ms0za@ep-black-glitter-a46ukc73-pooler.us-east-1.aws.neon.tech/beiwanglu?sslmode=require';

// 创建数据库连接
export const sql = neon(DATABASE_URL);

// 初始化数据库表
export async function initDb() {
  try {
    // 创建知识点表
    await sql`
      CREATE TABLE IF NOT EXISTS knowledge_items (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        last_reviewed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        review_count INTEGER DEFAULT 0,
        next_review_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP + INTERVAL '1 day'
      )
    `;
    console.log('数据库表初始化成功');
  } catch (error) {
    console.error('数据库表初始化失败:', error);
  }
} 