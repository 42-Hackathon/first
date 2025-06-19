/*
  # Knowledge Hub 초기 스키마 생성

  1. 새로운 테이블들
    - `folders`
      - `id` (uuid, primary key)
      - `name` (text, 폴더명)
      - `color` (text, 색상 코드)
      - `parent_id` (uuid, 중첩 폴더 지원)
      - `user_id` (uuid, 소유자)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `content_items`
      - `id` (uuid, primary key)
      - `title` (text, 제목)
      - `content` (text, 내용)
      - `type` (text, 콘텐츠 타입)
      - `stage` (text, 처리 단계)
      - `folder_id` (uuid, 폴더 참조)
      - `user_id` (uuid, 소유자)
      - `ai_summary` (text, AI 요약)
      - `ai_keywords` (text[], AI 키워드)
      - `metadata` (jsonb, 메타데이터)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `tags`
      - `id` (uuid, primary key)
      - `name` (text, 태그명)
      - `color` (text, 색상)
      - `user_id` (uuid, 소유자)
      - `created_at` (timestamp)
    
    - `content_tags`
      - `content_id` (uuid, 콘텐츠 참조)
      - `tag_id` (uuid, 태그 참조)
    
    - `collaborations`
      - `id` (uuid, primary key)
      - `content_id` (uuid, 콘텐츠 참조)
      - `user_id` (uuid, 사용자 참조)
      - `role` (text, 권한)
      - `created_at` (timestamp)

  2. 보안
    - 모든 테이블에 RLS 활성화
    - 사용자별 데이터 접근 정책 설정
    - 협업 권한 정책 설정

  3. 인덱스
    - 검색 성능을 위한 인덱스 추가
    - 외래키 인덱스 추가
*/

-- 폴더 테이블
CREATE TABLE IF NOT EXISTS folders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#3b82f6',
  parent_id uuid REFERENCES folders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 콘텐츠 아이템 테이블
CREATE TABLE IF NOT EXISTS content_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  content text NOT NULL DEFAULT '',
  type text NOT NULL CHECK (type IN ('text', 'image', 'link', 'video', 'file')),
  stage text NOT NULL DEFAULT 'review' CHECK (stage IN ('review', 'refine', 'consolidate')),
  folder_id uuid REFERENCES folders(id) ON DELETE SET NULL,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  ai_summary text,
  ai_keywords text[] DEFAULT '{}',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- 태그 테이블
CREATE TABLE IF NOT EXISTS tags (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  color text DEFAULT '#6b7280',
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(name, user_id)
);

-- 콘텐츠-태그 연결 테이블
CREATE TABLE IF NOT EXISTS content_tags (
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  tag_id uuid REFERENCES tags(id) ON DELETE CASCADE,
  PRIMARY KEY (content_id, tag_id)
);

-- 협업 테이블
CREATE TABLE IF NOT EXISTS collaborations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  content_id uuid REFERENCES content_items(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'viewer' CHECK (role IN ('owner', 'editor', 'viewer')),
  created_at timestamptz DEFAULT now(),
  UNIQUE(content_id, user_id)
);

-- 업데이트 트리거 함수
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- 업데이트 트리거 생성
CREATE TRIGGER update_folders_updated_at BEFORE UPDATE ON folders
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_content_items_updated_at BEFORE UPDATE ON content_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- RLS 활성화
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE content_tags ENABLE ROW LEVEL SECURITY;
ALTER TABLE collaborations ENABLE ROW LEVEL SECURITY;

-- 폴더 정책
CREATE POLICY "Users can manage their own folders"
  ON folders
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 콘텐츠 정책
CREATE POLICY "Users can manage their own content"
  ON content_items
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can view shared content"
  ON content_items
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM collaborations
      WHERE collaborations.content_id = content_items.id
      AND collaborations.user_id = auth.uid()
    )
  );

-- 태그 정책
CREATE POLICY "Users can manage their own tags"
  ON tags
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 콘텐츠-태그 정책
CREATE POLICY "Users can manage tags for their content"
  ON content_tags
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_items
      WHERE content_items.id = content_tags.content_id
      AND content_items.user_id = auth.uid()
    )
  );

-- 협업 정책
CREATE POLICY "Content owners can manage collaborations"
  ON collaborations
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM content_items
      WHERE content_items.id = collaborations.content_id
      AND content_items.user_id = auth.uid()
    )
  );

CREATE POLICY "Collaborators can view their collaborations"
  ON collaborations
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- 검색을 위한 인덱스
CREATE INDEX IF NOT EXISTS idx_content_items_search 
  ON content_items USING gin(to_tsvector('english', title || ' ' || content || ' ' || COALESCE(ai_summary, '')));

CREATE INDEX IF NOT EXISTS idx_content_items_user_id ON content_items(user_id);
CREATE INDEX IF NOT EXISTS idx_content_items_folder_id ON content_items(folder_id);
CREATE INDEX IF NOT EXISTS idx_content_items_type ON content_items(type);
CREATE INDEX IF NOT EXISTS idx_content_items_stage ON content_items(stage);
CREATE INDEX IF NOT EXISTS idx_content_items_created_at ON content_items(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_folders_user_id ON folders(user_id);
CREATE INDEX IF NOT EXISTS idx_folders_parent_id ON folders(parent_id);

CREATE INDEX IF NOT EXISTS idx_tags_user_id ON tags(user_id);
CREATE INDEX IF NOT EXISTS idx_tags_name ON tags(name);