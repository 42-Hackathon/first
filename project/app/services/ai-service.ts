interface AIAnalysisResult {
  summary: string;
  keywords: string[];
}

class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY || '';
    this.baseUrl = 'https://openrouter.ai/api/v1';
  }

  async analyzeContent(content: string, title?: string): Promise<AIAnalysisResult> {
    if (!this.apiKey) {
      console.warn('OpenRouter API key not configured');
      return {
        summary: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        keywords: this.extractSimpleKeywords(content)
      };
    }

    try {
      const prompt = `다음 콘텐츠를 분석해주세요:

제목: ${title || '제목 없음'}
내용: ${content}

요청사항:
1. 3줄 이내의 한국어 요약을 작성해주세요
2. 최대 3개의 핵심 키워드를 추출해주세요 (한국어)

응답 형식:
SUMMARY: [요약 내용]
KEYWORDS: [키워드1, 키워드2, 키워드3]`;

      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Knowledge Hub'
        },
        body: JSON.stringify({
          model: 'anthropic/claude-3-haiku',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 300,
          temperature: 0.3
        })
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content || '';

      return this.parseAIResponse(aiResponse, content);
    } catch (error) {
      console.error('AI analysis failed:', error);
      // 폴백: 간단한 로컬 분석
      return {
        summary: content.slice(0, 150) + (content.length > 150 ? '...' : ''),
        keywords: this.extractSimpleKeywords(content)
      };
    }
  }

  private parseAIResponse(response: string, originalContent: string): AIAnalysisResult {
    try {
      const summaryMatch = response.match(/SUMMARY:\s*(.+?)(?=KEYWORDS:|$)/s);
      const keywordsMatch = response.match(/KEYWORDS:\s*(.+?)$/s);

      const summary = summaryMatch?.[1]?.trim() || 
        originalContent.slice(0, 150) + (originalContent.length > 150 ? '...' : '');
      
      const keywordsText = keywordsMatch?.[1]?.trim() || '';
      const keywords = keywordsText
        .split(/[,\n]/)
        .map(k => k.trim().replace(/^\[|\]$/g, ''))
        .filter(k => k.length > 0)
        .slice(0, 3);

      return {
        summary: summary.slice(0, 300), // 최대 300자 제한
        keywords: keywords.length > 0 ? keywords : this.extractSimpleKeywords(originalContent)
      };
    } catch (error) {
      console.error('Failed to parse AI response:', error);
      return {
        summary: originalContent.slice(0, 150) + (originalContent.length > 150 ? '...' : ''),
        keywords: this.extractSimpleKeywords(originalContent)
      };
    }
  }

  private extractSimpleKeywords(content: string): string[] {
    // 간단한 키워드 추출 로직 (AI 실패시 폴백)
    const words = content
      .toLowerCase()
      .replace(/[^\w\s가-힣]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2);

    const wordCount = new Map<string, number>();
    words.forEach(word => {
      wordCount.set(word, (wordCount.get(word) || 0) + 1);
    });

    return Array.from(wordCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([word]) => word);
  }

  async batchAnalyze(items: Array<{ id: string; title: string; content: string }>): Promise<Map<string, AIAnalysisResult>> {
    const results = new Map<string, AIAnalysisResult>();
    
    // 병렬 처리로 성능 향상
    const promises = items.map(async (item) => {
      try {
        const result = await this.analyzeContent(item.content, item.title);
        results.set(item.id, result);
      } catch (error) {
        console.error(`Failed to analyze item ${item.id}:`, error);
        // 실패한 경우 기본값 설정
        results.set(item.id, {
          summary: item.content.slice(0, 150) + (item.content.length > 150 ? '...' : ''),
          keywords: this.extractSimpleKeywords(item.content)
        });
      }
    });

    await Promise.all(promises);
    return results;
  }
}

export const aiService = new AIService();