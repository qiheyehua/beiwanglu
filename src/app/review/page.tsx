"use client";

import { useState, useEffect } from "react";
import { KnowledgeItem } from "@/lib/knowledge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";

export default function ReviewPage() {
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // 使用真实数据
  const useMockData = false;

  // 获取今日需要复习的知识点
  const fetchReviewItems = async () => {
    try {
      setLoading(true);
      
      if (useMockData) {
        // 使用假数据
        setTimeout(() => {
          setItems([]);
          setLoading(false);
        }, 500); // 模拟加载延迟
        return;
      }
      
      // 真实API调用
      const response = await fetch("/api/review");
      const data = await response.json();
      
      if (response.ok) {
        setItems(data.items);
      } else {
        showToast({
          title: "出错了",
          message: data.error || "获取复习知识点失败",
          variant: "error"
        });
      }
    } catch (err) {
      showToast({
        title: "出错了",
        message: "获取复习知识点失败，请检查网络连接",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // 标记知识点已复习
  const markAsReviewed = async (id: string) => {
    if (useMockData) {
      // 使用假数据，直接从本地状态移除
      setItems(items.filter(item => item.id !== id));
      
      showToast({
        title: "成功",
        message: "已完成复习",
        variant: "success"
      });
      
      return;
    }
    
    // 真实API调用
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "PATCH",
      });
      
      if (response.ok) {
        showToast({
          title: "成功",
          message: "已完成复习",
          variant: "success",
          duration: 1500 // 缩短显示时间，以便更快刷新
        });
        
        // 延迟一小段时间后刷新页面，让用户看到提示
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        const data = await response.json();
        showToast({
          title: "出错了",
          message: data.error || "标记复习失败",
          variant: "error"
        });
      }
    } catch (err) {
      showToast({
        title: "出错了",
        message: "标记复习失败，请检查网络连接",
        variant: "error"
      });
    }
  };

  // 计算复习次数对应的文本
  const getReviewCountText = (count: number) => {
    const texts = ["首次复习", "第二次复习", "第三次复习", "第四次复习", "第五次复习", "第六次复习"];
    return count < texts.length ? texts[count] : `第${count + 1}次复习`;
  };

  // 初始加载
  useEffect(() => {
    fetchReviewItems();
  }, []);

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">今日需要复习的知识点</h2>
      
      {loading ? (
        <p>加载中...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">今天没有需要复习的知识点</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="knowledge-item bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between">
                <div className="flex-grow">
                  <h4 className="text-lg font-medium">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <div>创建于: {format(new Date(item.created_at), 'yyyy-MM-dd', { locale: zhCN })}</div>
                    <div>•</div>
                    <div>上次复习: {format(new Date(item.last_reviewed_at), 'yyyy-MM-dd', { locale: zhCN })}</div>
                    <div>•</div>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                      {getReviewCountText(item.review_count)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center">
                  <Button
                    onClick={() => markAsReviewed(item.id)}
                    variant="primary"
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    标记已复习
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
} 