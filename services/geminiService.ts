import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FriendMatch, Activity } from "../types";

// 🧨 我们注销了这个在前端尝试用假密码连接 Google 的“内鬼”
// const ai = new GoogleGenAI({ apiKey: import.meta.env.VITE_API_KEY || 'dummy_key_for_test_123' });

export const geminiService = {
  /**
   * 基于用户输入生成个性化标签和温馨简介（中文）。
   * （这个功能保留真实 AI 链路，证明你的硬核技术实力！）
   */
  async generateProfileAnalysis(intro: string, rawInterests: string, region: string): Promise<{ tags: string[], summary: string }> {
    try {
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
   * 纯前端路演版：好友匹配 (Mock Data)
   */
  async matchFriends(currentUser: UserProfile, candidates: UserProfile[]): Promise<any[]> {
    console.log("启动路演模式：物理切断 AI 请求，加载本地匹配数据");
    
    if (candidates.length === 0) return [];

    // 直接从传进来的候选人里挑前两个，匹配上完美的文案，0延时返回
    return candidates.slice(0, 2).map((candidate, index) => ({
      userId: candidate.id,
      compatibilityScore: index === 0 ? 95 : 88,
      matchingReason: index === 0 
        ? `和您一样，${candidate.name}也对${currentUser.tags[0] || '这些爱好'}感兴趣，你们一定有很多共同话题可以交流。`
        : `${candidate.name}性格非常温和，在社区也很活跃，非常适合一起结伴参与活动。`,
      profile: candidate
    }));
  },

  /**
   * 纯前端路演版：智能活动规划 (Mock Data)
   */
  async suggestActivityPlans(user: UserProfile): Promise<any[]> {
    console.log("启动路演模式：物理切断 AI 请求，加载本地活动数据");

    // 0延时返回高质量的静态商业展示数据
    return [
      {
        title: `周末“老友记”${user.tags[0] || '兴趣'}交流沙龙`,
        description: `针对您在${user.region || '本社区'}的居住情况，我们为您规划了一场轻松愉快的线下沙龙，没有剧烈运动，只有茶香和笑声，让您结识志同道合的老街坊。`,
        category: "休闲社交",
        maxParticipants: 15
      },
      {
        title: "社区长者智能手机互助班",
        description: "年轻社工手把手教您用微信、刷短视频、防诈骗，学会之后还能和异地子女畅快视频聊天。",
        category: "学习互助",
        maxParticipants: 10
      },
      {
        title: "春季公园踏青与摄影教学",
        description: "组织大家去附近的公园散步，并由摄影爱好者分享如何用手机拍出好看的花朵和人物照。",
        category: "户外活动",
        maxParticipants: 20
      }
    ];
  }
};