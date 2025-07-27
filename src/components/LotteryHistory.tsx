import type { LotteryTicket } from '../types/lottery'

interface LotteryHistoryProps {
  tickets: LotteryTicket[]
  onClear: () => void
}

export default function LotteryHistory({ tickets, onClear }: LotteryHistoryProps) {
  const formatPrice = (price: number) => {
    return price.toLocaleString('ja-JP')
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('ja-JP', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const totalSpent = tickets.reduce((sum, ticket) => sum + ticket.cost, 0)
  const totalWon = tickets.reduce((sum, ticket) => sum + (ticket.result?.prize || 0), 0)
  const totalProfit = totalWon - totalSpent
  const winningTickets = tickets.filter(ticket => ticket.result?.isWinner)

  const getTypeIcon = (type: 'loto6' | 'numbers4') => {
    return type === 'loto6' ? '🎱' : '🎯'
  }

  const getTypeName = (type: 'loto6' | 'numbers4') => {
    return type === 'loto6' ? 'ロト6' : 'ナンバーズ4'
  }

  if (tickets.length === 0) {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px 20px',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
        borderRadius: '20px',
        color: '#34495e'
      }}>
        <div style={{ fontSize: '4rem', marginBottom: '20px' }}>📊</div>
        <h2 style={{ margin: '0 0 10px 0' }}>購入履歴がありません</h2>
        <p style={{ margin: '0', opacity: 0.8 }}>宝くじを購入すると、ここに履歴が表示されます</p>
      </div>
    )
  }

  return (
    <div style={{
      maxWidth: '800px',
      margin: '0 auto',
      padding: '20px'
    }}>
      {/* 統計サマリー */}
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: '20px',
        padding: '30px',
        marginBottom: '30px',
        color: 'white',
        boxShadow: '0 10px 30px rgba(0,0,0,0.2)'
      }}>
        <h2 style={{ margin: '0 0 25px 0', textAlign: 'center', fontSize: '2rem' }}>
          📊 購入履歴・統計
        </h2>
        
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '20px',
          marginBottom: '20px'
        }}>
          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎫</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{tickets.length}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>購入枚数</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>💰</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>¥{formatPrice(totalSpent)}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>総支出</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🎉</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>¥{formatPrice(totalWon)}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>総当選金額</div>
          </div>

          <div style={{
            background: totalProfit >= 0 
              ? 'rgba(46, 213, 115, 0.3)' 
              : 'rgba(255, 107, 107, 0.3)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>
              {totalProfit >= 0 ? '📈' : '📉'}
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              {totalProfit >= 0 ? '+' : ''}¥{formatPrice(totalProfit)}
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>損益</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>🏆</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>{winningTickets.length}</div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>当選回数</div>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.15)',
            borderRadius: '15px',
            padding: '20px',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '5px' }}>📊</div>
            <div style={{ fontSize: '1.8rem', fontWeight: 'bold' }}>
              {tickets.length > 0 ? ((winningTickets.length / tickets.length) * 100).toFixed(1) : 0}%
            </div>
            <div style={{ fontSize: '0.9rem', opacity: 0.9 }}>当選率</div>
          </div>
        </div>

        <div style={{ textAlign: 'center' }}>
          <button
            onClick={onClear}
            style={{
              padding: '10px 20px',
              fontSize: '1rem',
              backgroundColor: 'rgba(255,255,255,0.2)',
              color: 'white',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '20px',
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
            履歴をクリア
          </button>
        </div>
      </div>

      {/* 購入履歴リスト */}
      <div style={{
        background: 'white',
        borderRadius: '20px',
        padding: '20px',
        boxShadow: '0 5px 20px rgba(0,0,0,0.1)'
      }}>
        <h3 style={{ 
          margin: '0 0 20px 0', 
          color: '#2c3e50',
          fontSize: '1.5rem',
          textAlign: 'center'
        }}>
          詳細履歴
        </h3>

        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
          {tickets.slice().reverse().map((ticket) => (
            <div
              key={ticket.id}
              style={{
                border: `2px solid ${ticket.result?.isWinner ? '#2ecc71' : '#ecf0f1'}`,
                borderRadius: '15px',
                padding: '20px',
                marginBottom: '15px',
                background: ticket.result?.isWinner 
                  ? 'linear-gradient(135deg, rgba(46, 204, 113, 0.05) 0%, rgba(46, 204, 113, 0.1) 100%)'
                  : '#fafafa',
                transition: 'all 0.3s'
              }}
            >
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: '15px',
                flexWrap: 'wrap',
                gap: '10px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <span style={{ fontSize: '1.5rem' }}>
                    {getTypeIcon(ticket.type)}
                  </span>
                  <div>
                    <div style={{ fontWeight: 'bold', color: '#2c3e50' }}>
                      {getTypeName(ticket.type)}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d' }}>
                      {formatDate(ticket.purchaseDate)}
                    </div>
                  </div>
                </div>
                
                <div style={{ textAlign: 'right' }}>
                  <div style={{ 
                    fontSize: '1.2rem', 
                    fontWeight: 'bold',
                    color: ticket.result?.isWinner ? '#27ae60' : '#e74c3c'
                  }}>
                    {ticket.result?.isWinner 
                      ? `+¥${formatPrice(ticket.result.prize)}` 
                      : `-¥${formatPrice(ticket.cost)}`}
                  </div>
                  {ticket.result && (
                    <div style={{ 
                      fontSize: '0.9rem',
                      color: ticket.result.isWinner ? '#27ae60' : '#95a5a6'
                    }}>
                      {ticket.result.rank}
                    </div>
                  )}
                </div>
              </div>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: '20px',
                flexWrap: 'wrap'
              }}>
                <div>
                  <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '5px' }}>
                    購入番号
                  </div>
                  <div style={{ display: 'flex', gap: '5px' }}>
                    {ticket.numbers.map((num, index) => (
                      <div
                        key={index}
                        style={{
                          width: '35px',
                          height: '35px',
                          borderRadius: ticket.type === 'numbers4' ? '8px' : '50%',
                          backgroundColor: '#3498db',
                          color: 'white',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '14px',
                          fontWeight: 'bold'
                        }}
                      >
                        {num}
                      </div>
                    ))}
                  </div>
                </div>

                {ticket.result && (
                  <div>
                    <div style={{ fontSize: '0.9rem', color: '#7f8c8d', marginBottom: '5px' }}>
                      当選番号
                    </div>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      {ticket.result.winningNumbers.map((num, index) => (
                        <div
                          key={index}
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: ticket.type === 'numbers4' ? '8px' : '50%',
                            backgroundColor: ticket.numbers.includes(num) ? '#e74c3c' : '#95a5a6',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '14px',
                            fontWeight: 'bold'
                          }}
                        >
                          {num}
                        </div>
                      ))}
                      {ticket.result.bonusNumber !== undefined && (
                        <div
                          style={{
                            width: '35px',
                            height: '35px',
                            borderRadius: '50%',
                            backgroundColor: ticket.numbers.includes(ticket.result.bonusNumber) ? '#f39c12' : '#bdc3c7',
                            color: 'white',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '12px',
                            fontWeight: 'bold'
                          }}
                        >
                          B{ticket.result.bonusNumber}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}