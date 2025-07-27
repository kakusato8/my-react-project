import { useState, useMemo } from 'react'

interface RegexFlags {
  global: boolean
  ignoreCase: boolean
  multiline: boolean
  dotAll: boolean
  unicode: boolean
  sticky: boolean
}

function PracticeMode() {
  const [regex, setRegex] = useState('')
  const [testString, setTestString] = useState('Hello World 123\nThis is a test string.\nContact: test@example.com')
  const [flags, setFlags] = useState<RegexFlags>({
    global: true,
    ignoreCase: false,
    multiline: false,
    dotAll: false,
    unicode: false,
    sticky: false
  })
  const [error, setError] = useState('')

  const getFlagsString = () => {
    let flagsStr = ''
    if (flags.global) flagsStr += 'g'
    if (flags.ignoreCase) flagsStr += 'i'
    if (flags.multiline) flagsStr += 'm'
    if (flags.dotAll) flagsStr += 's'
    if (flags.unicode) flagsStr += 'u'
    if (flags.sticky) flagsStr += 'y'
    return flagsStr
  }

  const matches = useMemo(() => {
    if (!regex || !testString) return []
    
    try {
      setError('')
      const regexObj = new RegExp(regex, getFlagsString())
      const matchResults = []
      let match
      
      if (flags.global) {
        while ((match = regexObj.exec(testString)) !== null) {
          matchResults.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          })
        }
      } else {
        match = regexObj.exec(testString)
        if (match) {
          matchResults.push({
            text: match[0],
            index: match.index,
            groups: match.slice(1),
            namedGroups: match.groups || {}
          })
        }
      }
      
      return matchResults
    } catch (err) {
      setError(err instanceof Error ? err.message : '無効な正規表現です')
      return []
    }
  }, [regex, testString, flags])

  const highlightedText = useMemo(() => {
    if (matches.length === 0) return testString
    
    let result = ''
    let lastIndex = 0
    
    matches.forEach((match, index) => {
      result += testString.slice(lastIndex, match.index)
      result += `<mark class="match-${index % 5}">${match.text}</mark>`
      lastIndex = match.index + match.text.length
    })
    result += testString.slice(lastIndex)
    
    return result.replace(/\n/g, '<br>')
  }, [matches, testString])

  const toggleFlag = (flagName: keyof RegexFlags) => {
    setFlags(prev => ({
      ...prev,
      [flagName]: !prev[flagName]
    }))
  }

  return (
    <div className="practice-mode">
      <div className="practice-header">
        <h2>練習モード</h2>
        <p>自由に正規表現をテストして、パターンマッチングを確認できます。</p>
      </div>

      <div className="practice-content">
        <div className="input-section">
          <div className="regex-input-group">
            <label htmlFor="practice-regex">正規表現パターン:</label>
            <div className="regex-wrapper">
              <span className="regex-delimiter">/</span>
              <input
                id="practice-regex"
                type="text"
                value={regex}
                onChange={(e) => setRegex(e.target.value)}
                placeholder="正規表現を入力してください"
                className="practice-regex-input"
              />
              <span className="regex-delimiter">/{getFlagsString()}</span>
            </div>
          </div>

          <div className="flags-section">
            <h3>フラグ設定:</h3>
            <div className="flags-grid">
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.global}
                  onChange={() => toggleFlag('global')}
                />
                <span className="flag-label">g (グローバル)</span>
                <span className="flag-description">全てのマッチを検索</span>
              </label>
              
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.ignoreCase}
                  onChange={() => toggleFlag('ignoreCase')}
                />
                <span className="flag-label">i (大文字小文字無視)</span>
                <span className="flag-description">大文字小文字を区別しない</span>
              </label>
              
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.multiline}
                  onChange={() => toggleFlag('multiline')}
                />
                <span className="flag-label">m (マルチライン)</span>
                <span className="flag-description">^と$が行の開始/終了にマッチ</span>
              </label>
              
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.dotAll}
                  onChange={() => toggleFlag('dotAll')}
                />
                <span className="flag-label">s (ドットオール)</span>
                <span className="flag-description">. が改行文字にもマッチ</span>
              </label>
              
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.unicode}
                  onChange={() => toggleFlag('unicode')}
                />
                <span className="flag-label">u (Unicode)</span>
                <span className="flag-description">Unicode対応</span>
              </label>
              
              <label className="flag-option">
                <input
                  type="checkbox"
                  checked={flags.sticky}
                  onChange={() => toggleFlag('sticky')}
                />
                <span className="flag-label">y (スティッキー)</span>
                <span className="flag-description">lastIndexから検索開始</span>
              </label>
            </div>
          </div>

          <div className="test-string-input">
            <label htmlFor="test-string">テスト文字列:</label>
            <textarea
              id="test-string"
              value={testString}
              onChange={(e) => setTestString(e.target.value)}
              placeholder="テストしたい文字列を入力してください"
              rows={6}
            />
          </div>
        </div>

        <div className="results-section">
          <div className="preview-area">
            <h3>マッチング結果プレビュー:</h3>
            <div 
              className="test-string-preview"
              dangerouslySetInnerHTML={{ __html: highlightedText }}
            />
          </div>

          {error && (
            <div className="error-message">
              <strong>エラー:</strong> {error}
            </div>
          )}

          <div className="match-details">
            <h3>マッチ詳細:</h3>
            {matches.length > 0 ? (
              <div className="matches-list">
                <p><strong>マッチ数:</strong> {matches.length}</p>
                {matches.map((match, index) => (
                  <div key={index} className={`match-item match-${index % 5}`}>
                    <h4>マッチ {index + 1}:</h4>
                    <p><strong>内容:</strong> "{match.text}"</p>
                    <p><strong>位置:</strong> {match.index} - {match.index + match.text.length - 1}</p>
                    {match.groups.length > 0 && (
                      <div className="capture-groups">
                        <strong>キャプチャグループ:</strong>
                        <ul>
                          {match.groups.map((group, groupIndex) => (
                            <li key={groupIndex}>
                              グループ {groupIndex + 1}: "{group || '(マッチなし)'}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {Object.keys(match.namedGroups).length > 0 && (
                      <div className="named-groups">
                        <strong>名前付きグループ:</strong>
                        <ul>
                          {Object.entries(match.namedGroups).map(([name, value]) => (
                            <li key={name}>
                              {name}: "{value}"
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="no-matches">マッチする結果がありません</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PracticeMode