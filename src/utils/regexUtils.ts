// 危険な正規表現パターンをチェック
function isDangerousRegex(pattern: string): boolean {
  // ReDoS攻撃を防ぐための基本的なチェック
  const dangerousPatterns = [
    /\(\?\=.*\)\+/,      // Positive lookahead with +
    /\(\?\!.*\)\+/,      // Negative lookahead with +
    /\(\w\+\)\+/,        // Nested quantifiers
    /\(\.\*\)\+/,        // .* with +
    /\(\.\+\)\+/,        // .+ with +
  ]
  
  return dangerousPatterns.some(dangerous => dangerous.test(pattern))
}

// 正規表現マッチング処理のユーティリティ関数
export function getRegexMatches(pattern: string, text: string) {
  if (!pattern.trim() || !text) return []
  
  // 長すぎるパターンを制限
  if (pattern.length > 200) {
    throw new Error('正規表現が長すぎます')
  }
  
  // 危険なパターンをチェック
  if (isDangerousRegex(pattern)) {
    throw new Error('このパターンは安全上の理由により実行できません')
  }
  
  try {
    const regex = new RegExp(pattern, 'g')
    const matches = []
    let match
    let iterations = 0
    const maxIterations = 1000 // 無限ループ防止
    
    while ((match = regex.exec(text)) !== null && iterations < maxIterations) {
      iterations++
      
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
      
      // マッチ数制限
      if (matches.length > 100) {
        break
      }
    }
    
    return matches
  } catch (error) {
    if (error instanceof Error && error.message.includes('安全上の理由')) {
      throw error
    }
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