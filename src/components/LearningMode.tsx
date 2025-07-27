import { useState } from 'react'

interface Lesson {
  id: number
  title: string
  description: string
  exercises: Exercise[]
  completed: boolean
}

interface Exercise {
  id: number
  question: string
  testString: string
  expectedAnswer: string
  hint?: string
}

const initialLessons: Lesson[] = [
  {
    id: 1,
    title: '基本的なリテラル文字',
    description: '正規表現の基本となるリテラル文字のマッチングを学びます。',
    exercises: [
      {
        id: 1,
        question: '文字列「hello」にマッチする正規表現を作成してください',
        testString: 'hello world',
        expectedAnswer: 'hello',
        hint: 'そのまま「hello」と入力してください'
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: 'メタ文字と文字クラス',
    description: '特殊な意味を持つメタ文字と文字クラスの使い方を学びます。',
    exercises: [
      {
        id: 1,
        question: '任意の数字1文字にマッチする正規表現を作成してください',
        testString: 'abc123def',
        expectedAnswer: '\\d',
        hint: '\\dを使用します'
      }
    ],
    completed: false
  }
]

function LearningMode() {
  const [lessons, setLessons] = useState<Lesson[]>(initialLessons)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0])
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(lessons[0]?.exercises[0] || null)
  const [userRegex, setUserRegex] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)

  const checkAnswer = () => {
    if (!currentExercise) return
    
    try {
      const regex = new RegExp(userRegex, 'g')
      const matches = currentExercise.testString.match(regex)
      
      if (userRegex === currentExercise.expectedAnswer) {
        setFeedback('正解です！')
      } else if (matches && matches.length > 0) {
        setFeedback(`マッチしましたが、期待される答えと異なります。マッチした内容: ${matches.join(', ')}`)
      } else {
        setFeedback('マッチしませんでした。もう一度試してください。')
      }
    } catch (error) {
      setFeedback('無効な正規表現です。構文を確認してください。')
    }
  }

  const getMatches = () => {
    if (!currentExercise || !userRegex) return []
    
    try {
      const regex = new RegExp(userRegex, 'g')
      const matches = []
      let match
      while ((match = regex.exec(currentExercise.testString)) !== null) {
        matches.push({
          text: match[0],
          index: match.index
        })
      }
      return matches
    } catch {
      return []
    }
  }

  const highlightMatches = () => {
    if (!currentExercise) return ''
    
    const matches = getMatches()
    if (matches.length === 0) return currentExercise.testString
    
    let result = ''
    let lastIndex = 0
    
    matches.forEach(match => {
      result += currentExercise.testString.slice(lastIndex, match.index)
      result += `<mark>${match.text}</mark>`
      lastIndex = match.index + match.text.length
    })
    result += currentExercise.testString.slice(lastIndex)
    
    return result
  }

  return (
    <div className="learning-mode">
      <div className="lesson-sidebar">
        <h2>レッスン一覧</h2>
        <ul className="lesson-list">
          {lessons.map(lesson => (
            <li 
              key={lesson.id} 
              className={`lesson-item ${selectedLesson?.id === lesson.id ? 'active' : ''} ${lesson.completed ? 'completed' : ''}`}
              onClick={() => {
                setSelectedLesson(lesson)
                setCurrentExercise(lesson.exercises[0])
                setUserRegex('')
                setFeedback('')
                setShowHint(false)
              }}
            >
              <span className="lesson-title">{lesson.title}</span>
              {lesson.completed && <span className="completion-badge">✓</span>}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="lesson-content">
        {selectedLesson && (
          <>
            <div className="lesson-header">
              <h2>{selectedLesson.title}</h2>
              <p>{selectedLesson.description}</p>
            </div>
            
            {currentExercise && (
              <div className="exercise-section">
                <div className="exercise-question">
                  <h3>練習問題</h3>
                  <p>{currentExercise.question}</p>
                </div>
                
                <div className="test-string">
                  <h4>テスト文字列:</h4>
                  <div 
                    className="test-string-display"
                    dangerouslySetInnerHTML={{ __html: highlightMatches() }}
                  />
                </div>
                
                <div className="regex-input">
                  <label htmlFor="regex">正規表現を入力:</label>
                  <input
                    id="regex"
                    type="text"
                    value={userRegex}
                    onChange={(e) => setUserRegex(e.target.value)}
                    placeholder="正規表現を入力してください"
                  />
                </div>
                
                <div className="action-buttons">
                  <button onClick={checkAnswer}>解答チェック</button>
                  <button onClick={() => setShowHint(!showHint)}>
                    {showHint ? 'ヒントを隠す' : 'ヒントを表示'}
                  </button>
                </div>
                
                {showHint && currentExercise.hint && (
                  <div className="hint">
                    <strong>ヒント:</strong> {currentExercise.hint}
                  </div>
                )}
                
                {feedback && (
                  <div className={`feedback ${feedback.includes('正解') ? 'success' : 'error'}`}>
                    {feedback}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default LearningMode