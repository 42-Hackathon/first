import { ContentItem, Folder } from "@/types/content";

export const mockContentItems: ContentItem[] = [
  {
    id: '1',
    title: '디자인 시스템 아이디어',
    content: '컴포넌트 라이브러리와 디자인 토큰에 대한 새로운 접근 방식을 탐구합니다. 접근성과 개발자 경험에 중점을 둡니다.',
    type: 'text',
    stage: 'review',
    tags: ['design', 'system', 'components'],
    createdAt: '2024-01-15T10:30:00Z',
    updatedAt: '2024-01-15T10:30:00Z'
  },
  {
    id: '2',
    title: '사용자 리서치 결과',
    content: '콘텐츠 정리 선호도에 대한 사용자 인터뷰의 핵심 인사이트입니다.',
    type: 'text',
    stage: 'refine',
    tags: ['research', 'users', 'insights'],
    createdAt: '2024-01-14T14:20:00Z',
    updatedAt: '2024-01-14T14:20:00Z'
  },
  {
    id: '3',
    title: 'API 문서',
    content: '새로운 콘텐츠 관리 API 엔드포인트에 대한 종합 가이드입니다.',
    type: 'text',
    stage: 'consolidate',
    tags: ['api', 'documentation', 'development'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z'
  },
  {
    id: '4',
    title: '와이어프레임 컨셉',
    content: '새로운 대시보드 레이아웃을 위한 초기 와이어프레임입니다.',
    type: 'image',
    stage: 'review',
    tags: ['wireframes', 'design', 'dashboard'],
    createdAt: '2024-01-12T16:45:00Z',
    updatedAt: '2024-01-12T16:45:00Z'
  },
  {
    id: '5',
    title: '경쟁사 분석',
    content: '시장의 유사한 도구들과 그들의 주요 기능에 대한 분석입니다.',
    type: 'link',
    stage: 'refine',
    tags: ['analysis', 'competitors', 'market'],
    createdAt: '2024-01-11T11:30:00Z',
    updatedAt: '2024-01-11T11:30:00Z',
    metadata: {
      url: 'https://example.com/analysis'
    }
  },
  {
    id: '6',
    title: '회의 노트',
    content: '주간 팀 동기화 노트와 액션 아이템입니다.',
    type: 'text',
    stage: 'consolidate',
    tags: ['meetings', 'notes', 'team'],
    createdAt: '2024-01-10T13:00:00Z',
    updatedAt: '2024-01-10T13:00:00Z'
  },
  {
    id: '7',
    title: 'UI 패턴 라이브러리',
    content: '재사용 가능한 UI 패턴과 컴포넌트 모음입니다.',
    type: 'image',
    stage: 'review',
    tags: ['ui', 'patterns', 'library'],
    createdAt: '2024-01-09T15:20:00Z',
    updatedAt: '2024-01-09T15:20:00Z'
  },
  {
    id: '8',
    title: '개발 가이드라인',
    content: '프로젝트 코딩 표준과 베스트 프랙티스입니다.',
    type: 'text',
    stage: 'consolidate',
    tags: ['development', 'guidelines', 'standards'],
    createdAt: '2024-01-08T11:10:00Z',
    updatedAt: '2024-01-08T11:10:00Z'
  },
  {
    id: '9',
    title: '사용자 플로우 다이어그램',
    content: '주요 사용자 여정과 상호작용 플로우입니다.',
    type: 'image',
    stage: 'refine',
    tags: ['userflow', 'diagram', 'ux'],
    createdAt: '2024-01-07T09:30:00Z',
    updatedAt: '2024-01-07T09:30:00Z'
  },
  {
    id: '10',
    title: '기술 스택 리뷰',
    content: '현재 기술 스택과 향후 개선 방향에 대한 검토입니다.',
    type: 'text',
    stage: 'review',
    tags: ['technology', 'stack', 'review'],
    createdAt: '2024-01-06T14:45:00Z',
    updatedAt: '2024-01-06T14:45:00Z'
  }
];

export const mockFolders: Folder[] = [
  {
    id: 'design',
    name: '디자인',
    color: '#3B82F6',
    itemCount: 25,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'development',
    name: '개발',
    color: '#10B981',
    itemCount: 34,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'research',
    name: '리서치',
    color: '#8B5CF6',
    itemCount: 18,
    createdAt: '2024-01-01T00:00:00Z'
  },
  {
    id: 'marketing',
    name: '마케팅',
    color: '#F59E0B',
    itemCount: 12,
    createdAt: '2024-01-01T00:00:00Z'
  }
];