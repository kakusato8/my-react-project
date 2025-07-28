import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import LearningMode from '../LearningMode'

describe('LearningMode', () => {
  beforeEach(() => {
    render(<LearningMode />)
  })

  describe('基本的な機能', () => {
    it('コンポーネントが正常にレンダリングされる', () => {
      expect(screen.getByText('レッスン一覧')).toBeInTheDocument()
      expect(screen.getByText('📚 解説')).toBeInTheDocument()
      expect(screen.getByText('✏️ 練習問題')).toBeInTheDocument()
    })

    it('デフォルトで解説タブが選択されている', () => {
      const theoryTab = screen.getByText('📚 解説')
      expect(theoryTab).toHaveClass('active')
    })

    it('練習問題タブをクリックすると切り替わる', () => {
      const practiceTab = screen.getByText('✏️ 練習問題')
      fireEvent.click(practiceTab)
      
      expect(practiceTab).toHaveClass('active')
      expect(screen.getByText('練習問題')).toBeInTheDocument()
    })
  })

  describe('練習問題機能', () => {
    beforeEach(() => {
      // 練習問題タブに切り替え
      const practiceTab = screen.getByText('✏️ 練習問題')
      fireEvent.click(practiceTab)
    })

    it('正規表現入力フィールドが表示される', () => {
      expect(screen.getByPlaceholderText('正規表現を入力してください')).toBeInTheDocument()
    })

    it('解答チェックボタンが表示される', () => {
      expect(screen.getByText('解答チェック')).toBeInTheDocument()
    })

    it('ヒント表示ボタンが表示される', () => {
      expect(screen.getByText('ヒントを表示')).toBeInTheDocument()
    })

    it('正解時に正しいフィードバックが表示される', async () => {
      const input = screen.getByPlaceholderText('正規表現を入力してください')
      const checkButton = screen.getByText('解答チェック')
      
      // 最初の問題の正解を入力
      fireEvent.change(input, { target: { value: 'apple' } })
      fireEvent.click(checkButton)
      
      await waitFor(() => {
        expect(screen.getByText('🎉 正解です！')).toBeInTheDocument()
      })
    })

    it('不正解時に適切なフィードバックが表示される', async () => {
      const input = screen.getByPlaceholderText('正規表現を入力してください')
      const checkButton = screen.getByText('解答チェック')
      
      // 間違った正規表現を入力
      fireEvent.change(input, { target: { value: 'orange' } })
      fireEvent.click(checkButton)
      
      await waitFor(() => {
        expect(screen.getByText('❌ マッチしませんでした。もう一度試してください。')).toBeInTheDocument()
      })
    })

    it('マッチするが不正解の場合、マッチ内容が表示される', async () => {
      const input = screen.getByPlaceholderText('正規表現を入力してください')
      const checkButton = screen.getByText('解答チェック')
      
      // マッチするが正解ではない正規表現を入力
      fireEvent.change(input, { target: { value: 'a' } })
      fireEvent.click(checkButton)
      
      await waitFor(() => {
        expect(screen.getByText(/マッチしましたが、期待される答えと異なります/)).toBeInTheDocument()
      })
    })

    it('無効な正規表現の場合、エラーメッセージが表示される', async () => {
      const input = screen.getByPlaceholderText('正規表現を入力してください')
      const checkButton = screen.getByText('解答チェック')
      
      // 無効な正規表現を入力
      fireEvent.change(input, { target: { value: '[' } })
      fireEvent.click(checkButton)
      
      await waitFor(() => {
        expect(screen.getByText('❌ 無効な正規表現です。構文を確認してください。')).toBeInTheDocument()
      })
    })

    it('ヒントボタンをクリックするとヒントが表示される', () => {
      const hintButton = screen.getByText('ヒントを表示')
      fireEvent.click(hintButton)
      
      expect(screen.getByText(/ヒント:/)).toBeInTheDocument()
      expect(screen.getByText('ヒントを隠す')).toBeInTheDocument()
    })
  })

  describe('解説機能', () => {
    it('理論セクションが表示される', () => {
      expect(screen.getByText('📖 理論')).toBeInTheDocument()
    })

    it('具体例セクションが表示される', () => {
      expect(screen.getByText('💡 具体例')).toBeInTheDocument()
    })

    it('重要ポイントセクションが表示される', () => {
      expect(screen.getByText('🔑 重要ポイント')).toBeInTheDocument()
    })

    it('練習問題に進むボタンが表示される', () => {
      expect(screen.getByText('練習問題に進む →')).toBeInTheDocument()
    })

    it('練習問題に進むボタンをクリックすると練習問題タブに切り替わる', () => {
      const nextButton = screen.getByText('練習問題に進む →')
      fireEvent.click(nextButton)
      
      const practiceTab = screen.getByText('✏️ 練習問題')
      expect(practiceTab).toHaveClass('active')
    })
  })

  describe('レッスン切り替え', () => {
    it('レッスン一覧が表示される', () => {
      expect(screen.getByText('レッスン一覧')).toBeInTheDocument()
    })

    it('異なるレッスンをクリックすると切り替わる', () => {
      const lessonItems = screen.getAllByText('量指定子をマスターする')
      fireEvent.click(lessonItems[0]) // サイドバーのレッスンをクリック
      
      expect(screen.getByRole('heading', { level: 2, name: '量指定子をマスターする' })).toBeInTheDocument()
      expect(screen.getByText('繰り返しを表す量指定子の使い方を学びます。')).toBeInTheDocument()
    })

    it('レッスン切り替え時に解説タブにリセットされる', () => {
      // 練習問題タブに切り替え
      const practiceTab = screen.getByText('✏️ 練習問題')
      fireEvent.click(practiceTab)
      
      // 別のレッスンに切り替え
      const lessonItems = screen.getAllByText('量指定子をマスターする')
      fireEvent.click(lessonItems[0]) // サイドバーのレッスンをクリック
      
      // 解説タブがアクティブになっているか確認
      const theoryTab = screen.getByText('📚 解説')
      expect(theoryTab).toHaveClass('active')
    })
  })
})