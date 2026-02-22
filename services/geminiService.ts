
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FriendMatch, Activity } from "../types";

const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || 'dummy_key_for_test_123' });

export const geminiService = {
  /**
   * 基于用户输入生成个性化标签和温馨简介（中文）。
   */
  async generateProfileAnalysis(intro: string, rawInterests: string, region: string): Promise<{ tags: string[], summary: string }> {
    try {
      // 核心改变：向你本地的 Python 服务器发送请求！
      const response = await fetch('https://zylleo-silver-backend.hf.space/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ intro, rawInterests, region })
      });

      if (!response.ok) {
        throw new Error('后端接口响应异常');
      }

      const data = await response.json();
      
      try {
          const parsedResult = JSON.parse(data.result);
          return parsedResult;
      } catch (e) {
          console.error("解析大模型返回格式失败", e);
          return { tags: ["系统连通成功"], summary: data.result };
      }

    } catch (error) {
      console.error("生成分析失败:", error);
      return { 
        tags: ["活跃分子", "友善邻里"], 
        summary: "这位朋友很热情，暂未生成详细简介。" 
      };
    }
  },

  /**
   * 将用户与潜在好友进行匹配。
   */
  async matchFriends(currentUser: UserProfile, candidates: UserProfile[]): Promise<FriendMatch[]> {
    if (candidates.length === 0) return [];

    const candidatesSummary = candidates.map(c => 
      `ID: ${c.id}, 姓名: ${c.name}, 标签: ${c.tags.join(', ')}, 简介: ${c.aiSummary}`
    ).join('\n');

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `当前用户：${currentUser.name}, 标签：${currentUser.tags.join(', ')}, 简介：${currentUser.aiSummary}。
      
      请从以下候选人中选出最匹配的3位：
      ${candidatesSummary}
      
      请为每位匹配者提供：
      1. 一个匹配度分数 (0-100)。
      2. 一个简短且温馨的中文理由，解释为什么他们适合做朋友。
      
      注意：匹配理由必须使用中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              userId: { type: Type.STRING },
              compatibilityScore: { type: Type.NUMBER },
              matchingReason: { type: Type.STRING }
            },
            required: ["userId", "compatibilityScore", "matchingReason"]
          }
        }
      }
    });

    const matchesData = JSON.parse(response.text || '[]');
    return matchesData.map((m: any) => ({
      ...m,
      profile: candidates.find(c => c.id === m.userId)!
    })).filter((m: any) => m.profile);
  },

  /**
   * 为用户智能规划个性化活动。
   */
  async suggestActivityPlans(user: UserProfile): Promise<Partial<Activity>[]> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `基于这位老年用户的个人档案（姓名：${user.name}, 标签：${user.tags.join(', ')}, 地区：${user.region}），
      请构思3个富有创意且有趣的社区活动，供该用户发起。
      活动应当轻松、具有社交属性且对老年人有意义。
      
      注意：活动名称、描述和类别必须使用中文。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              description: { type: Type.STRING },
              category: { type: Type.STRING },
              maxParticipants: { type: Type.NUMBER }
            },
            required: ["title", "description", "category", "maxParticipants"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  }
};
