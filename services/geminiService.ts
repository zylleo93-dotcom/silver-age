
import { GoogleGenAI, Type } from "@google/genai";
import { UserProfile, FriendMatch, Activity } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const geminiService = {
  /**
   * 基于用户输入生成个性化标签和温馨简介（中文）。
   */
  async generateProfileAnalysis(intro: string, rawInterests: string, region: string): Promise<{ tags: string[], summary: string }> {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位专业且温暖的老年人社交助理。
      请分析该用户的自我介绍： "${intro}" 
      兴趣爱好： "${rawInterests}"
      所在地区： "${region}"
      
      请生成：
      1. 5个能够体现其爱好或性格的中文标签。
      2. 一段约2句的温馨、平易近人的中文简介，让其他老年人觉得这位用户很亲切。
      
      注意：必须使用中文返回结果。`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            tags: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            },
            summary: {
              type: Type.STRING
            }
          },
          required: ["tags", "summary"]
        }
      }
    });

    return JSON.parse(response.text || '{"tags":[], "summary":""}');
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
