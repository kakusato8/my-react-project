import { useState } from 'react'
import LearningMode from './components/LearningMode'
import PracticeMode from './components/PracticeMode'
import './App.css'

type Mode = 'learning' | 'practice'

function App() {
  const [currentMode, setCurrentMode] = useState<Mode>('learning')

  return (
    <div className="App">
      <header className="app-header">
        <h1>正規表現学習アプリ</h1>
        <nav className="mode-selector">
          <button 
            className={currentMode === 'learning' ? 'active' : ''}
            onClick={() => setCurrentMode('learning')}
          >
            学習モード
          </button>
          <button 
            className={currentMode === 'practice' ? 'active' : ''}
            onClick={() => setCurrentMode('practice')}
          >
            練習モード
          </button>
        </nav>
      </header>
      
      <main className="app-main">
        {currentMode === 'learning' ? <LearningMode /> : <PracticeMode />}
      </main>
    </div>
  )
}

export default App
