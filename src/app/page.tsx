"use client";

import { useState, useEffect } from "react";
import { KnowledgeItem } from "@/lib/knowledge";
import { format } from "date-fns";
import { zhCN } from "date-fns/locale";
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/toast"

export default function Home() {
  const [title, setTitle] = useState("");
  const [items, setItems] = useState<KnowledgeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();
  
  // 使用真实数据
  const useMockData = false;

  // 计算统计信息
  const getStats = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    return {
      total: items.length,
      dueToday: items.filter(item => {
        const reviewDate = new Date(item.next_review_date);
        return reviewDate >= today && reviewDate < tomorrow;
      }).length,
      completed: items.filter(item => item.review_count > 0).length
    };
  };
  
  // 获取所有知识点
  const fetchItems = async () => {
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
      const response = await fetch("/api/knowledge");
      const data = await response.json();
      
      if (response.ok) {
        setItems(data.items);
      } else {
        showToast({
          title: "出错了",
          message: data.error || "获取知识点失败",
          variant: "error"
        });
      }
    } catch (err) {
      showToast({
        title: "出错了",
        message: "获取知识点失败，请检查网络连接",
        variant: "error"
      });
    } finally {
      setLoading(false);
    }
  };

  // 添加知识点
  const addItem = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      showToast({
        title: "出错了",
        message: "知识点标题不能为空",
        variant: "error"
      });
      return;
    }
    
    if (useMockData) {
      // 使用假数据，直接添加到本地状态
      const newItem: KnowledgeItem = {
        id: `mock-${Date.now()}`,
        title: title.trim(),
        created_at: new Date(),
        last_reviewed_at: new Date(),
        review_count: 0,
        next_review_date: new Date(Date.now() + 24 * 60 * 60 * 1000)
      };
      
      setItems([newItem, ...items]);
      setTitle("");
      
      showToast({
        title: "成功",
        message: "知识点添加成功",
        variant: "success"
      });
      
      return;
    }
    
    // 真实API调用
    try {
      const response = await fetch("/api/knowledge", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });
      
      const data = await response.json();
      
      if (response.ok) {
        setTitle("");
        showToast({
          title: "成功",
          message: "知识点添加成功",
          variant: "success",
          duration: 1500 // 缩短显示时间，以便更快刷新
        });
        
        // 延迟一小段时间后刷新页面，让用户看到提示
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        showToast({
          title: "出错了",
          message: data.error || "添加知识点失败",
          variant: "error"
        });
      }
    } catch (err) {
      showToast({
        title: "出错了",
        message: "添加知识点失败，请检查网络连接",
        variant: "error"
      });
    }
  };

  // 删除知识点
  const deleteItem = async (id: string) => {
    if (useMockData) {
      // 使用假数据，直接从本地状态删除
      setItems(items.filter(item => item.id !== id));
      
      showToast({
        title: "成功",
        message: "知识点删除成功",
        variant: "success"
      });
      
      return;
    }
    
    // 真实API调用
    try {
      const response = await fetch(`/api/knowledge/${id}`, {
        method: "DELETE",
      });
      
      if (response.ok) {
        showToast({
          title: "成功",
          message: "知识点删除成功",
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
          message: data.error || "删除知识点失败",
          variant: "error"
        });
      }
    } catch (err) {
      showToast({
        title: "出错了",
        message: "删除知识点失败，请检查网络连接",
        variant: "error"
      });
    }
  };

  // 初始加载
  useEffect(() => {
    fetchItems();
  }, []);

  const stats = getStats();

  return (
    <div className="max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold mb-6">添加今日知识点</h2>
      
      <form onSubmit={addItem} className="mb-8">
        <div className="flex gap-2">
          <Input value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="输入知识点标题..."
            className="flex-grow"
             />
            <Button className="bg-black text-white px-6 min-w-[100px]">添加</Button>
        </div>
      </form>
      
      {/* 统计信息 */}
      <div className="grid grid-cols-3 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-blue-600">{stats.total}</div>
          <div className="text-sm text-gray-500">知识点总数</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-orange-500">{stats.dueToday}</div>
          <div className="text-sm text-gray-500">今日待复习</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm text-center">
          <div className="text-3xl font-bold text-green-600">{stats.completed}</div>
          <div className="text-sm text-gray-500">已复习知识点</div>
        </div>
      </div>
      
      <h3 className="text-xl font-semibold mb-4">已添加的知识点</h3>
      
      {loading ? (
        <p>加载中...</p>
      ) : items.length === 0 ? (
        <p className="text-gray-500">暂无知识点，请添加新的知识点</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="knowledge-item bg-white p-4 rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="text-lg font-medium">{item.title}</h4>
                  <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
                    <div>创建于: {format(new Date(item.created_at), 'yyyy-MM-dd', { locale: zhCN })}</div>
                    <div>•</div>
                    <div>下次复习: {format(new Date(item.next_review_date), 'yyyy-MM-dd', { locale: zhCN })}</div>
                    {item.review_count > 0 && (
                      <>
                        <div>•</div>
                        <div className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                          已复习{item.review_count}次
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <Button 
                  onClick={() => deleteItem(item.id)}
                  variant="destructive"
                  size="sm"
          >
                  删除
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
