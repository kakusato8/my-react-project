import { useState } from 'react'
import type { LotteryTicket, LotteryResult, Numbers4Config } from '../types/lottery'

const numbers4Config: Numbers4Config = {
  digits: 4,
  numberRange: { min: 0, max: 9 },
  cost: 200,
  types: {
    straight: { prize: 1000000, odds: 10000 },
    box: { prize: 41600, odds: 417 },
    set: { prize: 106200, odds: 1667 }
  }
}

interface Numbers4Props {
  onPurchase: (ticket: LotteryTicket) => void
}

export default function Numbers4({ onPurchase }: Numbers4Props) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [playType, setPlayType] = useState<'straight' | 'box' | 'set'>('straight')
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastResult, setLastResult] = useState<LotteryResult | null>(null)

  const updateNumber = (position: number, value: number) => {
    const newNumbers = [...selectedNumbers]
    newNumbers[position] = value
    setSelectedNumbers(newNumbers)
  }

  const quickPick = () => {
    const numbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))
    setSelectedNumbers(numbers)
  }

  const calculateResult = (userNumbers: number[], winningNumbers: number[], type: 'straight' | 'box' | 'set'): LotteryResult => {
    let isWinner = false
    let prize = 0
    let rank = ''

    if (type === 'straight') {
      // ストレート: 数字・順番ともに一致
      if (JSON.stringify(userNumbers) === JSON.stringify(winningNumbers)) {
        isWinner = true
        prize = numbers4Config.types.straight.prize
        rank = 'ストレート当選'
      } else {
        rank = 'はずれ'
      }
    } else if (type === 'box') {
      // ボックス: 数字は一致、順番は問わない
      const userSorted = [...userNumbers].sort()
      const winningSorted = [...winningNumbers].sort()
      if (JSON.stringify(userSorted) === JSON.stringify(winningSorted)) {
        isWinner = true
        prize = numbers4Config.types.box.prize
        rank = 'ボックス当選'
      } else {
        rank = 'はずれ'
      }
    } else if (type === 'set') {
      // セット: ストレートとボックスの両方を購入
      const isStrightWin = JSON.stringify(userNumbers) === JSON.stringify(winningNumbers)
      const userSorted = [...userNumbers].sort()
      const winningSorted = [...winningNumbers].sort()
      const isBoxWin = JSON.stringify(userSorted) === JSON.stringify(winningSorted)

      if (isStrightWin) {
        isWinner = true
        prize = numbers4Config.types.set.prize
        rank = 'セット当選（ストレート）'
      } else if (isBoxWin) {
        isWinner = true
        prize = Math.floor(numbers4Config.types.set.prize * 0.6) // セットのボックス分
        rank = 'セット当選（ボックス）'
      } else {
        rank = 'はずれ'
      }
    }

    return {
      winningNumbers,
      prize,
      rank,
      isWinner
    }
  }

  const purchaseTicket = () => {
    if (selectedNumbers.length !== 4) return

    setIsDrawing(true)
    setLastResult(null)

    // 抽選シミュレーション
    setTimeout(() => {
      const winningNumbers = Array.from({ length: 4 }, () => Math.floor(Math.random() * 10))
      const result = calculateResult(selectedNumbers, winningNumbers, playType)

      setLastResult(result)

      const ticket: LotteryTicket = {
        id: `numbers4-${Date.now()}`,
        type: 'numbers4',
        numbers: [...selectedNumbers],
        purchaseDate: new Date(),
        cost: numbers4Config.cost,
        result
      }

      onPurchase(ticket)
      setIsDrawing(false)
      setSelectedNumbers([])
    }, 2500)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ja-JP')
  }

  const getPlayTypeInfo = (type: 'straight' | 'box' | 'set') => {
    switch (type) {
      case 'straight':
        return {
          name: 'ストレート',
          description: '選んだ4桁の数字が抽選数字と順番も含めて一致',
          prize: '1,000,000円',
          odds: '1/10,000'
        }
      case 'box':
        return {
          name: 'ボックス',
          description: '選んだ4桁の数字が抽選数字と順番に関係なく一致',
          prize: '41,600円（平均）',
          odds: '1/417（平均）'
        }
      case 'set':
        return {
          name: 'セット',
          description: 'ストレートとボックスを半分ずつ購入',
          prize: '106,200円（平均）',
          odds: '1/1,667（平均）'
        }
    }
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      borderRadius: '20px',
      color: '#333',
      boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0', color: '#2c3e50' }}>
          🎯 ナンバーズ4 🎯
        </h2>
        <p style={{ fontSize: '1.1rem', margin: '10px 0', color: '#34495e' }}>
          0〜9の数字から4桁を選んでください（1口200円）
        </p>
      </div>

      {!isDrawing && !lastResult && (
        <>
          {/* プレイタイプ選択 */}
          <div style={{ 
            marginBottom: '30px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 15px 0', color: '#2c3e50' }}>プレイタイプを選択</h3>
            <div style={{ display: 'flex', gap: '10px', marginBottom: '15px', flexWrap: 'wrap' }}>
              {(['straight', 'box', 'set'] as const).map(type => (
                <button
                  key={type}
                  onClick={() => setPlayType(type)}
                  style={{
                    flex: 1,
                    minWidth: '160px',
                    padding: '15px 10px',
                    borderRadius: '10px',
                    border: playType === type ? '3px solid #3498db' : '2px solid #bdc3c7',
                    backgroundColor: playType === type ? '#3498db' : 'white',
                    color: playType === type ? 'white' : '#2c3e50',
                    cursor: 'pointer',
                    transition: 'all 0.3s',
                    fontSize: '16px',
                    fontWeight: 'bold'
                  }}
                >
                  {getPlayTypeInfo(type).name}
                </button>
              ))}
            </div>
            <div style={{ 
              background: 'rgba(52, 152, 219, 0.1)',
              padding: '15px',
              borderRadius: '10px',
              border: '2px solid rgba(52, 152, 219, 0.2)'
            }}>
              <h4 style={{ margin: '0 0 5px 0', color: '#2c3e50' }}>
                {getPlayTypeInfo(playType).name}
              </h4>
              <p style={{ margin: '0 0 5px 0', fontSize: '14px', color: '#34495e' }}>
                {getPlayTypeInfo(playType).description}
              </p>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#2c3e50' }}>
                <span>理論値: {getPlayTypeInfo(playType).prize}</span>
                <span>当選確率: {getPlayTypeInfo(playType).odds}</span>
              </div>
            </div>
          </div>

          {/* 数字選択 */}
          <div style={{ 
            marginBottom: '30px',
            background: 'rgba(255,255,255,0.7)',
            borderRadius: '15px',
            padding: '20px'
          }}>
            <h3 style={{ margin: '0 0 20px 0', textAlign: 'center', color: '#2c3e50' }}>
              4桁の数字を選択
            </h3>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '15px', marginBottom: '20px' }}>
              {Array.from({ length: 4 }, (_, index) => (
                <div key={index} style={{ textAlign: 'center' }}>
                  <div style={{ 
                    width: '80px',
                    height: '80px',
                    borderRadius: '15px',
                    border: '3px solid #3498db',
                    backgroundColor: 'white',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    fontWeight: 'bold',
                    color: '#2c3e50',
                    marginBottom: '10px',
                    boxShadow: '0 4px 8px rgba(0,0,0,0.1)'
                  }}>
                    {selectedNumbers[index] !== undefined ? selectedNumbers[index] : '-'}
                  </div>
                  <select
                    value={selectedNumbers[index] !== undefined ? selectedNumbers[index] : ''}
                    onChange={(e) => updateNumber(index, parseInt(e.target.value))}
                    style={{
                      width: '80px',
                      padding: '8px',
                      borderRadius: '8px',
                      border: '2px solid #bdc3c7',
                      fontSize: '16px',
                      backgroundColor: 'white'
                    }}
                  >
                    <option value="">選択</option>
                    {Array.from({ length: 10 }, (_, i) => (
                      <option key={i} value={i}>{i}</option>
                    ))}
                  </select>
                </div>
              ))}
            </div>

            <div style={{ textAlign: 'center' }}>
              <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
                <button
                  onClick={quickPick}
                  style={{
                    padding: '12px 25px',
                    fontSize: '1rem',
                    backgroundColor: '#95a5a6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: 'pointer',
                    transition: 'all 0.3s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#7f8c8d'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#95a5a6'
                  }}
                >
                  クイックピック
                </button>
                
                <button
                  onClick={purchaseTicket}
                  disabled={selectedNumbers.length !== 4}
                  style={{
                    padding: '12px 25px',
                    fontSize: '1.2rem',
                    fontWeight: 'bold',
                    backgroundColor: selectedNumbers.length === 4 ? '#e74c3c' : '#bdc3c7',
                    color: 'white',
                    border: 'none',
                    borderRadius: '25px',
                    cursor: selectedNumbers.length === 4 ? 'pointer' : 'not-allowed',
                    opacity: selectedNumbers.length === 4 ? 1 : 0.5,
                    transition: 'all 0.3s',
                    boxShadow: selectedNumbers.length === 4 ? '0 4px 15px rgba(231,76,60,0.4)' : 'none'
                  }}
                >
                  購入する (200円)
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {isDrawing && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ 
            fontSize: '4rem', 
            animation: 'bounce 1s infinite',
            marginBottom: '20px'
          }}>
            🎯
          </div>
          <p style={{ fontSize: '1.5rem', margin: '0', color: '#2c3e50' }}>抽選中...</p>
          <div style={{ 
            width: '100%', 
            height: '6px', 
            background: 'rgba(52, 152, 219, 0.2)', 
            borderRadius: '3px',
            marginTop: '20px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(90deg, #3498db, #2980b9)',
              animation: 'loading 2.5s ease-in-out'
            }}></div>
          </div>
        </div>
      )}

      {lastResult && (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          background: lastResult.isWinner 
            ? 'linear-gradient(135deg, #ff6b6b, #ee5a24)'
            : 'linear-gradient(135deg, #74b9ff, #0984e3)',
          borderRadius: '15px',
          animation: 'slideIn 0.5s ease-out',
          color: 'white'
        }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
            {lastResult.isWinner ? '🎉 当選おめでとうございます！ 🎉' : '残念...'}
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '10px 0', fontSize: '1.2rem' }}>当選番号</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '20px' }}>
              {lastResult.winningNumbers.map((num, index) => (
                <div key={index} style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '10px',
                  backgroundColor: '#fff',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '24px',
                  boxShadow: '0 4px 8px rgba(0,0,0,0.2)'
                }}>
                  {num}
                </div>
              ))}
            </div>
          </div>

          <div style={{ 
            background: 'rgba(255,255,255,0.2)',
            padding: '20px',
            borderRadius: '10px',
            marginBottom: '20px'
          }}>
            <p style={{ fontSize: '1.5rem', margin: '0 0 10px 0', fontWeight: 'bold' }}>
              {lastResult.rank}
            </p>
            <p style={{ fontSize: '2rem', margin: '0', fontWeight: 'bold' }}>
              {lastResult.isWinner ? `¥${formatPrice(lastResult.prize)}` : '¥0'}
            </p>
          </div>

          <button
            onClick={() => setLastResult(null)}
            style={{
              padding: '12px 30px',
              fontSize: '1.1rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.5)',
              borderRadius: '25px',
              cursor: 'pointer',
              transition: 'all 0.3s'
            }}
          >
            もう一度プレイ
          </button>
        </div>
      )}

      <style>{`
        @keyframes bounce {
          0%, 20%, 50%, 80%, 100% { transform: translateY(0); }
          40% { transform: translateY(-20px); }
          60% { transform: translateY(-10px); }
        }
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes slideIn {
          0% { transform: translateY(-20px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  )
}