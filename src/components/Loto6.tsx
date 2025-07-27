import { useState } from 'react'
import type { LotteryTicket, LotteryResult, Loto6Config } from '../types/lottery'

const loto6Config: Loto6Config = {
  numbersToSelect: 6,
  numberRange: { min: 1, max: 43 },
  cost: 200,
  prizes: {
    '1st': 200000000,
    '2nd': 15000000,
    '3rd': 500000,
    '4th': 9600,
    '5th': 1000
  },
  odds: {
    '1st': 6096454,
    '2nd': 1016076,
    '3rd': 28224,
    '4th': 610,
    '5th': 39
  }
}

interface Loto6Props {
  onPurchase: (ticket: LotteryTicket) => void
}

export default function Loto6({ onPurchase }: Loto6Props) {
  const [selectedNumbers, setSelectedNumbers] = useState<number[]>([])
  const [isDrawing, setIsDrawing] = useState(false)
  const [lastResult, setLastResult] = useState<LotteryResult | null>(null)

  const generateNumbers = () => {
    const numbers: number[] = []
    while (numbers.length < 43) {
      numbers.push(numbers.length + 1)
    }
    return numbers
  }

  const toggleNumber = (number: number) => {
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter(n => n !== number))
    } else if (selectedNumbers.length < 6) {
      setSelectedNumbers([...selectedNumbers, number].sort((a, b) => a - b))
    }
  }

  const quickPick = () => {
    const numbers: number[] = []
    while (numbers.length < 6) {
      const randomNum = Math.floor(Math.random() * 43) + 1
      if (!numbers.includes(randomNum)) {
        numbers.push(randomNum)
      }
    }
    setSelectedNumbers(numbers.sort((a, b) => a - b))
  }

  const calculateResult = (userNumbers: number[], winningNumbers: number[], bonusNumber: number): LotteryResult => {
    const matches = userNumbers.filter(num => winningNumbers.includes(num)).length
    const hasBonusMatch = userNumbers.includes(bonusNumber)
    
    let rank = ''
    let prize = 0
    let isWinner = false

    if (matches === 6) {
      rank = '1等'
      prize = loto6Config.prizes['1st']
      isWinner = true
    } else if (matches === 5 && hasBonusMatch) {
      rank = '2等'
      prize = loto6Config.prizes['2nd']
      isWinner = true
    } else if (matches === 5) {
      rank = '3等'
      prize = loto6Config.prizes['3rd']
      isWinner = true
    } else if (matches === 4) {
      rank = '4等'
      prize = loto6Config.prizes['4th']
      isWinner = true
    } else if (matches === 3) {
      rank = '5等'
      prize = loto6Config.prizes['5th']
      isWinner = true
    } else {
      rank = 'はずれ'
      prize = 0
      isWinner = false
    }

    return {
      winningNumbers,
      bonusNumber,
      prize,
      rank,
      isWinner
    }
  }

  const purchaseTicket = () => {
    if (selectedNumbers.length !== 6) return

    setIsDrawing(true)
    setLastResult(null)

    // 抽選シミュレーション
    setTimeout(() => {
      const winningNumbers: number[] = []
      while (winningNumbers.length < 6) {
        const randomNum = Math.floor(Math.random() * 43) + 1
        if (!winningNumbers.includes(randomNum)) {
          winningNumbers.push(randomNum)
        }
      }
      winningNumbers.sort((a, b) => a - b)

      let bonusNumber: number
      do {
        bonusNumber = Math.floor(Math.random() * 43) + 1
      } while (winningNumbers.includes(bonusNumber))

      const result = calculateResult(selectedNumbers, winningNumbers, bonusNumber)
      setLastResult(result)

      const ticket: LotteryTicket = {
        id: `loto6-${Date.now()}`,
        type: 'loto6',
        numbers: [...selectedNumbers],
        purchaseDate: new Date(),
        cost: loto6Config.cost,
        result
      }

      onPurchase(ticket)
      setIsDrawing(false)
      setSelectedNumbers([])
    }, 3000)
  }

  const formatPrice = (price: number) => {
    return price.toLocaleString('ja-JP')
  }

  return (
    <div style={{ 
      maxWidth: '600px', 
      margin: '0 auto', 
      padding: '20px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      borderRadius: '20px',
      color: 'white',
      boxShadow: '0 10px 30px rgba(0,0,0,0.3)'
    }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <h2 style={{ fontSize: '2.5rem', margin: '0', textShadow: '2px 2px 4px rgba(0,0,0,0.5)' }}>
          🎱 ロト6 🎱
        </h2>
        <p style={{ fontSize: '1.1rem', opacity: 0.9, margin: '10px 0' }}>
          1〜43の数字から6個選んでください（1口200円）
        </p>
      </div>

      {!isDrawing && !lastResult && (
        <>
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(7, 1fr)', 
            gap: '8px', 
            marginBottom: '30px',
            padding: '20px',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '15px'
          }}>
            {generateNumbers().map(number => (
              <button
                key={number}
                onClick={() => toggleNumber(number)}
                disabled={!selectedNumbers.includes(number) && selectedNumbers.length >= 6}
                style={{
                  width: '50px',
                  height: '50px',
                  borderRadius: '50%',
                  border: 'none',
                  fontSize: '14px',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  backgroundColor: selectedNumbers.includes(number) 
                    ? '#ff6b6b' 
                    : 'rgba(255,255,255,0.8)',
                  color: selectedNumbers.includes(number) ? 'white' : '#333',
                  opacity: (!selectedNumbers.includes(number) && selectedNumbers.length >= 6) ? 0.3 : 1,
                  transform: selectedNumbers.includes(number) ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: selectedNumbers.includes(number) 
                    ? '0 4px 15px rgba(255,107,107,0.4)' 
                    : '0 2px 8px rgba(0,0,0,0.1)'
                }}
              >
                {number}
              </button>
            ))}
          </div>

          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ 
              background: 'rgba(255,255,255,0.1)',
              padding: '15px',
              borderRadius: '10px',
              marginBottom: '20px'
            }}>
              <p style={{ margin: '0 0 10px 0', fontSize: '1.1rem' }}>
                選択した番号: {selectedNumbers.length}/6
              </p>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
                {selectedNumbers.length > 0 ? selectedNumbers.join(' - ') : '番号を選択してください'}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={quickPick}
                style={{
                  padding: '12px 25px',
                  fontSize: '1rem',
                  backgroundColor: 'rgba(255,255,255,0.2)',
                  color: 'white',
                  border: '2px solid rgba(255,255,255,0.5)',
                  borderRadius: '25px',
                  cursor: 'pointer',
                  transition: 'all 0.3s'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.2)'
                }}
              >
                クイックピック
              </button>
              
              <button
                onClick={purchaseTicket}
                disabled={selectedNumbers.length !== 6}
                style={{
                  padding: '12px 25px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  backgroundColor: selectedNumbers.length === 6 ? '#4ecdc4' : 'rgba(255,255,255,0.1)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '25px',
                  cursor: selectedNumbers.length === 6 ? 'pointer' : 'not-allowed',
                  opacity: selectedNumbers.length === 6 ? 1 : 0.5,
                  transition: 'all 0.3s',
                  boxShadow: selectedNumbers.length === 6 ? '0 4px 15px rgba(78,205,196,0.4)' : 'none'
                }}
              >
                購入する (200円)
              </button>
            </div>
          </div>
        </>
      )}

      {isDrawing && (
        <div style={{ textAlign: 'center', padding: '40px 0' }}>
          <div style={{ 
            fontSize: '4rem', 
            animation: 'spin 1s linear infinite',
            marginBottom: '20px'
          }}>
            🎱
          </div>
          <p style={{ fontSize: '1.5rem', margin: '0' }}>抽選中...</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: 'rgba(255,255,255,0.2)', 
            borderRadius: '2px',
            marginTop: '20px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: '100%', 
              height: '100%', 
              background: 'linear-gradient(90deg, #4ecdc4, #44a08d)',
              animation: 'loading 3s ease-in-out'
            }}></div>
          </div>
        </div>
      )}

      {lastResult && (
        <div style={{
          textAlign: 'center',
          padding: '30px',
          background: lastResult.isWinner 
            ? 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)'
            : 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          borderRadius: '15px',
          animation: 'slideIn 0.5s ease-out'
        }}>
          <h3 style={{ fontSize: '2rem', margin: '0 0 20px 0' }}>
            {lastResult.isWinner ? '🎉 おめでとうございます！ 🎉' : '残念...'}
          </h3>
          
          <div style={{ marginBottom: '20px' }}>
            <p style={{ margin: '10px 0', fontSize: '1.2rem' }}>当選番号</p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '10px' }}>
              {lastResult.winningNumbers.map((num, index) => (
                <div key={index} style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  backgroundColor: '#fff',
                  color: '#333',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontWeight: 'bold',
                  fontSize: '18px'
                }}>
                  {num}
                </div>
              ))}
            </div>
            <p style={{ margin: '10px 0', fontSize: '1rem' }}>
              ボーナス数字: <span style={{ 
                display: 'inline-block',
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                backgroundColor: '#ffd700',
                color: '#333',
                textAlign: 'center',
                lineHeight: '30px',
                fontWeight: 'bold'
              }}>{lastResult.bonusNumber}</span>
            </p>
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
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
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