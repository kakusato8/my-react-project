import { useState } from 'react'
import Loto6 from './components/Loto6'
import Numbers4 from './components/Numbers4'
import LotteryHistory from './components/LotteryHistory'
import type { LotteryTicket } from './types/lottery'

type AppView = 'menu' | 'loto6' | 'numbers4' | 'history'

export default function LotteryApp() {
  const [currentView, setCurrentView] = useState<AppView>('menu')
  const [tickets, setTickets] = useState<LotteryTicket[]>([])

  const handlePurchase = (ticket: LotteryTicket) => {
    setTickets(prev => [...prev, ticket])
  }

  const handleClearHistory = () => {
    setTickets([])
  }

  const renderHeader = () => (
    <div style={{
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      borderRadius: '0 0 30px 30px',
      color: 'white',
      boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
      marginBottom: '30px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        maxWidth: '1200px',
        margin: '0 auto',
        flexWrap: 'wrap',
        gap: '15px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          {currentView !== 'menu' && (
            <button
              onClick={() => setCurrentView('menu')}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: '2px solid rgba(255,255,255,0.3)',
                color: 'white',
                borderRadius: '50%',
                width: '50px',
                height: '50px',
                cursor: 'pointer',
                fontSize: '20px',
                transition: 'all 0.3s'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.3)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'rgba(255,255,255,0.2)'
              }}
            >
              ←
            </button>
          )}
          <h1 style={{ 
            margin: '0', 
            fontSize: currentView === 'menu' ? '2.5rem' : '2rem',
            textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
          }}>
            🎲 宝くじシミュレーター 🎲
          </h1>
        </div>
        
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            padding: '10px 20px',
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>購入枚数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{tickets.length}</div>
          </div>
          <div style={{ 
            background: 'rgba(255,255,255,0.15)',
            padding: '10px 20px',
            borderRadius: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>当選回数</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
              {tickets.filter(t => t.result?.isWinner).length}
            </div>
          </div>
        </div>
      </div>
    </div>
  )

  const renderMenu = () => (
    <div style={{ 
      maxWidth: '800px', 
      margin: '0 auto', 
      padding: '20px',
      textAlign: 'center'
    }}>
      <div style={{
        background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        borderRadius: '25px',
        padding: '40px',
        marginBottom: '40px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ 
          fontSize: '2.5rem', 
          margin: '0 0 20px 0',
          textShadow: '2px 2px 4px rgba(0,0,0,0.3)'
        }}>
          ようこそ！
        </h2>
        <p style={{ 
          fontSize: '1.3rem', 
          margin: '0 0 30px 0', 
          lineHeight: '1.6',
          opacity: 0.95
        }}>
          本格的な宝くじシミュレーションを体験しよう！<br />
          実際の確率と賞金額で、宝くじの購入体験ができます。
        </p>
        <div style={{
          background: 'rgba(255,255,255,0.2)',
          borderRadius: '15px',
          padding: '20px',
          marginTop: '20px'
        }}>
          <p style={{ margin: '0', fontSize: '1rem', opacity: 0.9 }}>
            💡 このアプリは教育・エンターテイメント目的です<br />
            実際の賭博を推奨するものではありません
          </p>
        </div>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
        gap: '25px',
        marginBottom: '30px'
      }}>
        <div
          onClick={() => setCurrentView('loto6')}
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '40px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎱</div>
          <h3 style={{ fontSize: '2rem', margin: '0 0 15px 0' }}>ロト6</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.9, lineHeight: '1.5' }}>
            1〜43の数字から6個選択<br />
            最高2億円の高額当選が狙える！
          </p>
          <div style={{
            background: 'rgba(255,255,255,0.2)',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '0.9rem'
          }}>
            1口 200円 | 1等確率: 1/610万
          </div>
        </div>

        <div
          onClick={() => setCurrentView('numbers4')}
          style={{
            background: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
            borderRadius: '20px',
            padding: '40px',
            color: '#2c3e50',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-5px)'
            e.currentTarget.style.boxShadow = '0 12px 35px rgba(0,0,0,0.25)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ fontSize: '4rem', marginBottom: '15px' }}>🎯</div>
          <h3 style={{ fontSize: '2rem', margin: '0 0 15px 0' }}>ナンバーズ4</h3>
          <p style={{ margin: '0 0 20px 0', opacity: 0.8, lineHeight: '1.5' }}>
            0〜9の数字で4桁を選択<br />
            ストレート・ボックス・セットが選択可能
          </p>
          <div style={{
            background: 'rgba(44,62,80,0.1)',
            borderRadius: '10px',
            padding: '10px',
            fontSize: '0.9rem'
          }}>
            1口 200円 | ストレート: 100万円
          </div>
        </div>
      </div>

      {tickets.length > 0 && (
        <div
          onClick={() => setCurrentView('history')}
          style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '20px',
            padding: '30px',
            color: 'white',
            cursor: 'pointer',
            transition: 'all 0.3s',
            boxShadow: '0 8px 25px rgba(0,0,0,0.15)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)'
            e.currentTarget.style.boxShadow = '0 10px 30px rgba(0,0,0,0.2)'
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)'
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '10px' }}>📊</div>
          <h3 style={{ fontSize: '1.5rem', margin: '0 0 10px 0' }}>購入履歴・統計を見る</h3>
          <p style={{ margin: '0', opacity: 0.9 }}>
            これまでの購入履歴と詳細な統計情報を確認
          </p>
        </div>
      )}
    </div>
  )

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
      paddingBottom: '40px'
    }}>
      {renderHeader()}
      
      {currentView === 'menu' && renderMenu()}
      {currentView === 'loto6' && <Loto6 onPurchase={handlePurchase} />}
      {currentView === 'numbers4' && <Numbers4 onPurchase={handlePurchase} />}
      {currentView === 'history' && (
        <LotteryHistory tickets={tickets} onClear={handleClearHistory} />
      )}
    </div>
  )
}