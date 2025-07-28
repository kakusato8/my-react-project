import { describe, it, expect } from 'vitest'

// 正規表現マッチング処理のユーティリティ関数
export function getRegexMatches(pattern: string, text: string) {
  if (!pattern.trim() || !text) return []
  
  try {
    const regex = new RegExp(pattern, 'g')
    const matches = []
    let match
    while ((match = regex.exec(text)) !== null) {
      // 空文字列マッチは除外
      if (match[0].length > 0) {
        matches.push({
          text: match[0],
          index: match.index
        })
      }
      // 無限ループ防止
      if (match.index === regex.lastIndex) {
        regex.lastIndex++
      }
    }
    return matches
  } catch {
    return []
  }
}

export function validateRegex(pattern: string): boolean {
  try {
    new RegExp(pattern)
    return true
  } catch {
    return false
  }
}

describe('正規表現ユーティリティ', () => {
  describe('getRegexMatches', () => {
    it('基本的な文字列マッチング', () => {
      const matches = getRegexMatches('apple', 'I have an apple and an orange')
      expect(matches).toHaveLength(1)
      expect(matches[0].text).toBe('apple')
    })

    it('複数のマッチ', () => {
      const matches = getRegexMatches('a', 'banana')
      expect(matches).toHaveLength(3)
      expect(matches.map(m => m.text)).toEqual(['a', 'a', 'a'])
    })

    it('メタ文字のマッチング', () => {
      const matches = getRegexMatches('c.t', 'cat cut cot czt')
      expect(matches).toHaveLength(4)
      expect(matches.map(m => m.text)).toEqual(['cat', 'cut', 'cot', 'czt'])
    })

    it('数字のマッチング', () => {
      const matches = getRegexMatches('\\d+', 'abc123def456ghi')
      expect(matches).toHaveLength(2)
      expect(matches.map(m => m.text)).toEqual(['123', '456'])
    })

    it('郵便番号のマッチング', () => {
      const matches = getRegexMatches('\\d{3}-\\d{4}', '123-4567 東京都')
      expect(matches).toHaveLength(1)
      expect(matches[0].text).toBe('123-4567')
    })

    it('エスケープ文字のマッチング', () => {
      const matches = getRegexMatches('\\.', 'www.example.com')
      expect(matches).toHaveLength(2)
      expect(matches.map(m => m.text)).toEqual(['.', '.'])
    })

    it('文字クラスのマッチング', () => {
      const matches = getRegexMatches('[abc]', 'apple banana cherry')
      expect(matches).toHaveLength(6)
      expect(matches.map(m => m.text)).toEqual(['a', 'b', 'a', 'a', 'a', 'c'])
    })

    it('空文字列のパターンは空配列を返す', () => {
      const matches = getRegexMatches('', 'test string')
      expect(matches).toEqual([])
    })

    it('空白のみのパターンは空配列を返す', () => {
      const matches = getRegexMatches('   ', 'test string')
      expect(matches).toEqual([])
    })

    it('無効な正規表現は空配列を返す', () => {
      const matches = getRegexMatches('[', 'test string')
      expect(matches).toEqual([])
    })

    it('マッチしない場合は空配列を返す', () => {
      const matches = getRegexMatches('xyz', 'abc def ghi')
      expect(matches).toEqual([])
    })

    it('空文字列マッチは除外される', () => {
      const matches = getRegexMatches('a*', 'bbb')
      // 'a*'は'b'の前後で空文字列にマッチするが、これらは除外される
      expect(matches).toEqual([])
    })

    it('正しいインデックスが返される', () => {
      const matches = getRegexMatches('cat', 'The cat in the hat')
      expect(matches[0].index).toBe(4)
    })
  })

  describe('validateRegex', () => {
    it('有効な正規表現はtrueを返す', () => {
      expect(validateRegex('apple')).toBe(true)
      expect(validateRegex('\\d+')).toBe(true)
      expect(validateRegex('[a-z]*')).toBe(true)
      expect(validateRegex('(test|demo)')).toBe(true)
    })

    it('無効な正規表現はfalseを返す', () => {
      expect(validateRegex('[')).toBe(false)
      expect(validateRegex('*')).toBe(false)
      expect(validateRegex('(?')).toBe(false)
      expect(validateRegex('\\')).toBe(false)
    })

    it('空文字列はtrueを返す', () => {
      expect(validateRegex('')).toBe(true)
    })
  })
})