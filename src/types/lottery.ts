export interface LotteryTicket {
  id: string
  type: 'loto6' | 'numbers4'
  numbers: number[]
  purchaseDate: Date
  cost: number
  result?: LotteryResult
}

export interface LotteryResult {
  winningNumbers: number[]
  bonusNumber?: number
  prize: number
  rank: string
  isWinner: boolean
}

export interface Loto6Config {
  numbersToSelect: 6
  numberRange: { min: 1, max: 43 }
  cost: 200
  prizes: {
    '1st': 200000000  // 2億円（目安）
    '2nd': 15000000   // 1500万円
    '3rd': 500000     // 50万円
    '4th': 9600       // 9600円
    '5th': 1000       // 1000円
  }
  odds: {
    '1st': 6096454    // 約610万分の1
    '2nd': 1016076    // 約102万分の1
    '3rd': 28224      // 約2万8千分の1
    '4th': 610        // 610分の1
    '5th': 39         // 39分の1
  }
}

export interface Numbers4Config {
  digits: 4
  numberRange: { min: 0, max: 9 }
  cost: 200
  types: {
    straight: { prize: 1000000, odds: 10000 }    // ストレート：100万円
    box: { prize: 41600, odds: 417 }             // ボックス：平均4万1600円
    set: { prize: 106200, odds: 1667 }           // セット：平均10万6200円
  }
}