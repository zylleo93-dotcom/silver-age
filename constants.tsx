
import React from 'react';
import { UserProfile, Activity } from './types';

export const MOCK_USERS: UserProfile[] = [
  {
    id: '2',
    name: '王奶奶',
    age: 68,
    region: '上海 浦东新区',
    introduction: '我非常热爱传统书法，每天早上都会去公园散步散心。',
    interests: ['书法', '散步', '品茶'],
    tags: ['传统艺术', '早起达人', '爱茶之人', '性格温和'],
    aiSummary: '王奶奶是一位内心宁静的长者，她能在笔墨和清晨的空气中找到生活的乐趣。',
    avatar: 'https://picsum.photos/seed/wang/200'
  },
  {
    id: '3',
    name: '张大爷',
    age: 72,
    region: '北京 朝阳区',
    introduction: '退休工程师，喜欢下象棋，也爱钻研修理旧家电。',
    interests: ['象棋', '修理', '策略'],
    tags: ['解决问题高手', '象棋大师', '充满好奇心'],
    aiSummary: '张大爷思维敏捷，不仅是一位象棋高手，更乐于通过修理东西帮助邻里。',
    avatar: 'https://picsum.photos/seed/zhang/200'
  },
  {
    id: '4',
    name: '陈阿姨',
    age: 65,
    region: '上海 浦东新区',
    introduction: '我以前是面点师，现在依然很喜欢做甜品，也爱和邻居们聊天。',
    interests: ['烘焙', '烹饪', '聊天'],
    tags: ['烘焙达人', '爱讲故事', '热心肠'],
    aiSummary: '陈阿姨总是带着甜甜的笑容，她的烘焙手艺总能给邻里带来温馨的香气。',
    avatar: 'https://picsum.photos/seed/linda/200'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '公园晨间书法交流会',
    description: '欢迎大家加入我们，在新鲜的空气中挥毫泼墨，静心创作。',
    creatorId: '2',
    creatorName: '王奶奶',
    region: '上海 浦东新区',
    date: '2024-06-20',
    time: '早上 08:00',
    category: '艺术',
    maxParticipants: 10,
    participants: ['2', '4']
  }
];
