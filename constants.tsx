
import React from 'react';
import { UserProfile, Activity } from './types';

export const COMMON_INTERESTS = [
  '书法', '散步', '品茶', '象棋', '修理', '烘焙', '烹饪', '聊天', '园艺', '广场舞',
  '太极拳', '唱歌', '旅游', '阅读', '摄影', '钓鱼', '棋牌', '养宠物', '志愿服务', '学习新技能'
];

export const HONG_KONG_DISTRICTS = [
  '中西区', '湾仔区', '东区', '南区', '油尖旺区', '深水埗区', '九龙城区', '黄大仙区', '观塘区', '葵青区',
  '荃湾区', '屯门区', '元朗区', '北区', '大埔区', '沙田区', '西贡区', '离岛区'
];

export const MOCK_USERS: UserProfile[] = [
  {
    id: '2',
    name: '王女士',
    gender: 'female',
    age: 68,
    region: '香港, 中西区',
    introduction: '我非常热爱传统书法，每天早上都会去公园散步散心。',
    interests: ['书法', '散步', '品茶'],
    tags: ['传统艺术', '早起达人', '爱茶之人', '性格温和'],
    aiSummary: '王女士是一位内心宁静的长者，她能在笔墨和清晨的空气中找到生活的乐趣。',
    avatar: '/avatar-wang.jpg'
  },
  {
    id: '3',
    name: '张先生',
    gender: 'male',
    age: 72,
    region: '香港, 湾仔区',
    introduction: '退休工程师，喜欢下象棋，也爱钻研修理旧家电。',
    interests: ['象棋', '修理', '策略'],
    tags: ['解决问题高手', '象棋大师', '充满好奇心'],
    aiSummary: '张先生思维敏捷，不仅是一位象棋高手，更乐于通过修理东西帮助邻里。',
    avatar: '/avatar-zhang.jpg'
  },
  {
    id: '4',
    name: '陈女士',
    gender: 'female',
    age: 65,
    region: '香港, 油尖旺区',
    introduction: '我以前是面点师，现在依然很喜欢做甜品，也爱和邻居们聊天。',
    interests: ['烘焙', '烹饪', '聊天'],
    tags: ['烘焙达人', '爱讲故事', '热心肠'],
    aiSummary: '陈女士总是带着甜甜的笑容，她的烘焙手艺总能给邻里带来温馨的香气。',
    avatar: 'https://storage.googleapis.com/maker-me-assets/assets/elderly-woman-2.png'
  },
  {
    id: '5',
    name: '李先生',
    gender: 'male',
    age: 70,
    region: '香港, 九龙城区',
    introduction: '喜欢摄影和旅游，去过很多地方，也爱分享旅行故事。',
    interests: ['摄影', '旅游', '分享'],
    tags: ['旅行家', '摄影爱好者', '故事大王'],
    aiSummary: '李先生的镜头记录了世界的精彩，他的故事充满了远方的魅力。',
    avatar: 'https://storage.googleapis.com/maker-me-assets/assets/elderly-man-2.png'
  },
  {
    id: '6',
    name: '赵女士',
    gender: 'female',
    age: 63,
    region: '香港, 观塘区',
    introduction: '热爱广场舞，每天傍晚都会和姐妹们一起跳舞，也喜欢园艺。',
    interests: ['广场舞', '园艺', '健康'],
    tags: ['舞林高手', '绿色生活', '活力四射'],
    aiSummary: '赵女士是社区的活力源泉，她的舞步轻快，她的花园生机勃勃。',
    avatar: 'https://storage.googleapis.com/maker-me-assets/assets/elderly-woman-3.png'
  },
  {
    id: '7',
    name: '钱先生',
    gender: 'male',
    age: 75,
    region: '香港, 荃湾区',
    introduction: '退休教师，喜欢阅读历史书籍，也爱和年轻人交流。',
    interests: ['阅读', '历史', '交流'],
    tags: ['知识渊博', '诲人不倦', '思想深邃'],
    aiSummary: '钱先生是一位智慧的长者，他的知识如同图书馆般丰富，乐于与人分享。',
    avatar: 'https://storage.googleapis.com/maker-me-assets/assets/elderly-man-3.png'
  }
];

export const MOCK_ACTIVITIES: Activity[] = [
  {
    id: 'a1',
    title: '维多利亚公园晨间书法交流会',
    description: '欢迎大家加入我们，在新鲜的空气中挥毫泼墨，静心创作。',
    creatorId: '2',
    creatorName: '王女士',
    region: '香港, 中西区',
    date: '2026-06-20',
    time: '早上 08:00',
    category: '艺术',
    maxParticipants: 10,
    participants: ['2', '4']
  },
  {
    id: 'a2',
    title: '社区象棋友谊赛',
    description: '以棋会友，切磋棋艺，欢迎各位象棋爱好者前来挑战。',
    creatorId: '3',
    creatorName: '张先生',
    region: '香港, 湾仔区',
    date: '2026-06-22',
    time: '下午 14:00',
    category: '棋牌',
    maxParticipants: 8,
    participants: ['3']
  },
  {
    id: 'a3',
    title: '手工烘焙体验课',
    description: '陈女士亲自教学，制作美味的传统点心，品尝甜蜜的下午茶。',
    creatorId: '4',
    creatorName: '陈女士',
    region: '香港, 油尖旺区',
    date: '2026-06-25',
    time: '下午 15:00',
    category: '美食',
    maxParticipants: 6,
    participants: []
  },
  {
    id: 'a4',
    title: '公园摄影采风活动',
    description: '带上你的相机或手机，一起捕捉公园里的美好瞬间，李先生会分享摄影技巧。',
    creatorId: '5',
    creatorName: '李先生',
    region: '香港, 九龙城区',
    date: '2026-06-28',
    time: '上午 09:30',
    category: '户外',
    maxParticipants: 12,
    participants: ['5']
  },
  {
    id: 'a5',
    title: '活力广场舞教学',
    description: '赵女士带领大家学习最新最流行的广场舞，一起来舞动健康。',
    creatorId: '6',
    creatorName: '赵女士',
    region: '香港, 观塘区',
    date: '2026-07-01',
    time: '傍晚 18:00',
    category: '健身',
    maxParticipants: 20,
    participants: ['6']
  }
];
