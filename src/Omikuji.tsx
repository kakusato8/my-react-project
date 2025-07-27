import { useState } from 'react'

interface OmikujiResult {
  fortune: string
  message: string
  color: string
}

const omikujiData: OmikujiResult[] = [
  { fortune: '大吉', message: '今日はとても良い日です。新しいことに挑戦してみましょう。', color: '#ff6b6b' },
  { fortune: '中吉', message: '良いことが起こりそうです。積極的に行動しましょう。', color: '#4ecdc4' },
  { fortune: '小吉', message: '小さな幸せが見つかるでしょう。感謝の気持ちを大切に。', color: '#45b7d1' },
  { fortune: '吉', message: '安定した一日になりそうです。計画的に行動しましょう。', color: '#96ceb4' },
  { fortune: '末吉', message: '後半に良いことが待っています。辛抱強く頑張りましょう。', color: '#feca57' },
  { fortune: '凶', message: '注意深く行動しましょう。明日はきっと良い日になります。', color: '#ff9ff3' },
  { fortune: '大凶', message: '今日は慎重に。でも必ず良い日が来ます。', color: '#54a0ff' },
]

export default function Omikuji() {
  const [result, setResult] = useState<OmikujiResult | null>(null)
  const [isDrawing, setIsDrawing] = useState(false)

  const drawOmikuji = () => {
    setIsDrawing(true)
    setResult(null)

    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * omikujiData.length)
      setResult(omikujiData[randomIndex])
      setIsDrawing(false)
    }, 1000)
  }

  const reset = () => {
    setResult(null)
  }

  return (
    <div style={{ textAlign: 'center', padding: '20px', maxWidth: '400px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', marginBottom: '30px' }}>🎋 おみくじ 🎋</h1>
      
      {!result && !isDrawing && (
        <button
          onClick={drawOmikuji}
          style={{
            fontSize: '1.2rem',
            padding: '15px 30px',
            backgroundColor: '#ff6b6b',
            color: 'white',
            border: 'none',
            borderRadius: '25px',
            cursor: 'pointer',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            transition: 'transform 0.2s'
          }}
          onMouseDown={(e) => e.currentTarget.style.transform = 'scale(0.95)'}
          onMouseUp={(e) => e.currentTarget.style.transform = 'scale(1)'}
        >
          おみくじを引く
        </button>
      )}

      {isDrawing && (
        <div style={{ fontSize: '1.5rem', color: '#666' }}>
          <div style={{ animation: 'spin 1s linear infinite' }}>🎋</div>
          <p>おみくじを引いています...</p>
        </div>
      )}

      {result && (
        <div
          style={{
            backgroundColor: result.color,
            padding: '30px',
            borderRadius: '15px',
            color: 'white',
            boxShadow: '0 6px 12px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.5s ease-in'
          }}
        >
          <h2 style={{ fontSize: '3rem', margin: '0 0 20px 0' }}>{result.fortune}</h2>
          <p style={{ fontSize: '1.1rem', lineHeight: '1.6', margin: '0 0 20px 0' }}>
            {result.message}
          </p>
          <button
            onClick={reset}
            style={{
              fontSize: '1rem',
              padding: '10px 20px',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid white',
              borderRadius: '20px',
              cursor: 'pointer',
              transition: 'background-color 0.3s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'}
          >
            もう一度引く
          </button>
        </div>
      )}

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes fadeIn {
          0% { opacity: 0; transform: translateY(-20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}