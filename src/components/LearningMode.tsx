import { useState, useCallback, useMemo, useEffect } from 'react'
import { getRegexMatches } from '../utils/regexUtils'

// デバウンス用のカスタムフック
function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

interface Lesson {
  id: number
  title: string
  description: string
  content: LessonContent
  exercises: Exercise[]
  completed: boolean
}

interface LessonContent {
  theory: string
  examples: Example[]
  keyPoints: string[]
}

interface Example {
  pattern: string
  text: string
  explanation: string
  matches?: string[]
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
    title: '正規表現とは？（基礎の基礎）',
    description: 'テキスト検索・置換・抽出に使う正規表現の基本を学びます。',
    content: {
      theory: `正規表現（Regular Expression）は、文字列のパターンを表現するための記法です。プログラミング、データ処理、ログ解析など様々な場面で使用される強力なツールです。

正規表現の基本的な仕組み：
• 文字列の中から特定のパターンを検索する
• パターンにマッチした部分を置換する
• データの形式を検証する（バリデーション）

最もシンプルな正規表現は、検索したい文字列をそのまま書くことです。例えば「apple」という正規表現は、テキスト中の「apple」という文字列にマッチします。`,
      examples: [
        {
          pattern: 'apple',
          text: 'I have an apple and an orange',
          explanation: '「apple」という文字列を検索します',
          matches: ['apple']
        },
        {
          pattern: 'c.t',
          text: 'cat cut cot czt',
          explanation: '「.」は任意の1文字にマッチするメタ文字です',
          matches: ['cat', 'cut', 'cot', 'czt']
        },
        {
          pattern: '\\.',
          text: 'www.example.com',
          explanation: 'エスケープ文字「\\」を使ってピリオド文字そのものを検索します',
          matches: ['.', '.']
        }
      ],
      keyPoints: [
        '正規表現はパターンマッチングのツール',
        '文字をそのまま書くとリテラル検索になる',
        '「.」は任意の1文字にマッチする特別な文字',
        '特別な文字を検索するには「\\」でエスケープする'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '文字列「apple」にマッチする正規表現を作成してください',
        testString: 'I have an apple and an orange',
        expectedAnswer: 'apple',
        hint: 'そのまま「apple」と入力してください'
      },
      {
        id: 2,
        question: '任意の1文字にマッチする「.」を使って「c.t」パターンを作成してください',
        testString: 'cat cut cot czt',
        expectedAnswer: 'c.t',
        hint: '「.」は任意の1文字にマッチします'
      },
      {
        id: 3,
        question: 'ピリオド文字「.」そのものにマッチする正規表現を作成してください',
        testString: 'www.example.com',
        expectedAnswer: '\\.',
        hint: 'エスケープ文字「\\」を使って「\\.」と入力します'
      }
    ],
    completed: false
  },
  {
    id: 2,
    title: '量指定子をマスターする',
    description: '繰り返しを表す量指定子の使い方を学びます。',
    content: {
      theory: `量指定子（Quantifier）は、直前の文字やパターンが何回繰り返されるかを指定する記号です。これにより、柔軟なパターンマッチングが可能になります。

主な量指定子：
• * ：0回以上の繰り返し
• + ：1回以上の繰り返し
• ? ：0回または1回（省略可能）
• {n} ：ちょうどn回
• {n,} ：n回以上
• {n,m} ：n回以上m回以下

量指定子は直前の1文字またはグループに適用されます。例えば「a*」は「a」が0回以上繰り返されるパターンにマッチします。`,
      examples: [
        {
          pattern: 'ba*',
          text: 'b ba baa baaa',
          explanation: '「a」が0回以上繰り返される。「b」だけでもマッチする',
          matches: ['b', 'ba', 'baa', 'baaa']
        },
        {
          pattern: 'ba+',
          text: 'b ba baa baaa',
          explanation: '「a」が1回以上繰り返される。「b」だけではマッチしない',
          matches: ['ba', 'baa', 'baaa']
        },
        {
          pattern: '\\d{3}-\\d{4}',
          text: '123-4567 東京都',
          explanation: '数字3桁-数字4桁のパターン（郵便番号）',
          matches: ['123-4567']
        }
      ],
      keyPoints: [
        '量指定子は直前の文字・パターンの繰り返し回数を指定',
        '*は0回以上、+は1回以上の繰り返し',
        '{n}で正確な回数、{n,m}で範囲を指定',
        '実用的なパターン：電話番号、郵便番号など'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '「a」が0回以上繰り返される文字列にマッチする正規表現を作成してください',
        testString: 'b ba baa baaa',
        expectedAnswer: 'ba*',
        hint: '「*」は0回以上の繰り返しを表します'
      },
      {
        id: 2,
        question: '「a」が1回以上繰り返される文字列にマッチする正規表現を作成してください',
        testString: 'b ba baa baaa',
        expectedAnswer: 'ba+',
        hint: '「+」は1回以上の繰り返しを表します'
      },
      {
        id: 3,
        question: '数字が1回以上連続する文字列にマッチする正規表現を作成してください',
        testString: 'abc123def456ghi',
        expectedAnswer: '\\d+',
        hint: '「\\d」は数字、「+」は1回以上の繰り返しです'
      },
      {
        id: 4,
        question: '郵便番号（3桁-4桁）の形式にマッチする正規表現を作成してください',
        testString: '123-4567 東京都',
        expectedAnswer: '\\d{3}-\\d{4}',
        hint: '「{n}」はちょうどn回の繰り返しを表します'
      },
      {
        id: 5,
        question: '電話番号（2〜4桁-2〜4桁-4桁）の形式にマッチする正規表現を作成してください',
        testString: '03-1234-5678 または 090-1234-5678',
        expectedAnswer: '\\d{2,4}-\\d{2,4}-\\d{4}',
        hint: '「{n,m}」はn回以上m回以下の繰り返しを表します'
      }
    ],
    completed: false
  },
  {
    id: 3,
    title: '文字クラスとショートハンド',
    description: '特定の種類の文字にマッチする文字クラスとショートハンドを学びます。',
    content: {
      theory: `文字クラス（Character Class）は、複数の文字の中から1つの文字にマッチするパターンを定義します。角括弧[]で囲んで表現します。

基本的な文字クラス：
• [abc] ：a、b、cのいずれか1文字
• [a-z] ：aからzまでの小文字
• [0-9] ：0から9までの数字
• [^abc] ：a、b、c以外の文字

よく使うショートハンド：
• \d ：数字 [0-9]と同じ
• \D ：数字以外 [^0-9]と同じ
• \w ：単語構成文字 [a-zA-Z0-9_]と同じ
• \W ：単語構成文字以外
• \s ：空白文字（スペース、タブ、改行など）
• \S ：空白文字以外`,
      examples: [
        {
          pattern: '[abc]',
          text: 'apple banana cherry',
          explanation: 'a、b、cのいずれか1文字にマッチ',
          matches: ['a', 'b', 'a', 'a', 'a', 'c']
        },
        {
          pattern: '\\d',
          text: 'abc123def',
          explanation: '数字1文字にマッチ',
          matches: ['1', '2', '3']
        },
        {
          pattern: '\\w+',
          text: 'user_name123',
          explanation: '単語構成文字が1文字以上続く',
          matches: ['user_name123']
        }
      ],
      keyPoints: [
        '[]で文字の選択肢を定義',
        'ハイフンで文字の範囲を指定',
        '^で否定（その文字以外）',
        'ショートハンドで頻用パターンを簡潔に表現'
      ]
    },
    exercises: [
      {
        id: 1,
        question: 'a、b、cのいずれか1文字にマッチする正規表現を作成してください',
        testString: 'apple banana cherry',
        expectedAnswer: '[abc]',
        hint: '角括弧「[]」を使って文字クラスを表現します'
      },
      {
        id: 2,
        question: 'aからzまでの小文字にマッチする正規表現を作成してください',
        testString: 'Hello World 123',
        expectedAnswer: '[a-z]',
        hint: 'ハイフン「-」で範囲を指定できます'
      },
      {
        id: 3,
        question: '数字以外の文字にマッチする正規表現を作成してください',
        testString: 'abc123def',
        expectedAnswer: '\\D',
        hint: '「\\D」は数字以外の文字にマッチします'
      },
      {
        id: 4,
        question: '単語構成文字（英数字とアンダースコア）にマッチする正規表現を作成してください',
        testString: 'user_name123',
        expectedAnswer: '\\w',
        hint: '「\\w」は単語構成文字にマッチします'
      },
      {
        id: 5,
        question: '空白文字（スペース、タブなど）にマッチする正規表現を作成してください',
        testString: 'hello world',
        expectedAnswer: '\\s',
        hint: '「\\s」は空白文字にマッチします'
      },
      {
        id: 6,
        question: 'メールアドレスのユーザー名部分（@より前）にマッチする正規表現を作成してください',
        testString: 'user.name@example.com',
        expectedAnswer: '[\\w\\.]+',
        hint: '英数字、アンダースコア、ピリオドが1文字以上続く文字列です'
      }
    ],
    completed: false
  },
  {
    id: 4,
    title: '位置指定子とグループ化',
    description: '文字列の特定の位置にマッチする位置指定子とグループ化を学びます。',
    content: {
      theory: `位置指定子（Anchor）は、文字そのものではなく、文字列中の位置にマッチします。グループ化は複数の文字をまとめて扱うための仕組みです。

主な位置指定子：
• ^ ：行の先頭
• $ ：行の末尾
• \b ：単語の境界
• \B ：単語の境界以外

グループ化とパターンの組み合わせ：
• () ：グループ化とキャプチャ
• | ：OR条件（いずれかのパターン）
• ? ：直前のパターンが省略可能

グループ化により、複雑なパターンを構築し、マッチした部分を後で参照することができます。`,
      examples: [
        {
          pattern: '^Hello',
          text: 'Hello World\nSay Hello',
          explanation: '行の先頭にある「Hello」のみマッチ',
          matches: ['Hello']
        },
        {
          pattern: '\\bcat\\b',
          text: 'cat catch application',
          explanation: '単語として独立した「cat」のみマッチ',
          matches: ['cat']
        },
        {
          pattern: 'https?://',
          text: 'https://example.com or ftp://server.com',
          explanation: 'httpまたはhttpsで始まるURL',
          matches: ['https://']
        }
      ],
      keyPoints: [
        '位置指定子は文字ではなく位置にマッチ',
        '^と$で行の開始・終了を指定',
        '\\bで単語の境界を指定',
        '()でグループ化、|でOR条件'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '行の先頭にある「Hello」にマッチする正規表現を作成してください',
        testString: 'Hello World\nSay Hello',
        expectedAnswer: '^Hello',
        hint: '「^」は行の先頭を表します'
      },
      {
        id: 2,
        question: '行の末尾にある「end」にマッチする正規表現を作成してください',
        testString: 'This is the end\nend of story',
        expectedAnswer: 'end$',
        hint: '「$」は行の末尾を表します'
      },
      {
        id: 3,
        question: '単語の境界にある「cat」にマッチする正規表現を作成してください',
        testString: 'cat catch application',
        expectedAnswer: '\\bcat\\b',
        hint: '「\\b」は単語の境界を表します'
      },
      {
        id: 4,
        question: 'httpsまたはhttpで始まるURLにマッチする正規表現を作成してください',
        testString: 'https://example.com or ftp://server.com',
        expectedAnswer: 'https?://',
        hint: '「?」は直前の文字が0回または1回の繰り返しです'
      },
      {
        id: 5,
        question: '日付形式（YYYY/MM/DD）から年をキャプチャする正規表現を作成してください',
        testString: '2024/03/15',
        expectedAnswer: '(\\d{4})/\\d{2}/\\d{2}',
        hint: '丸括弧「()」でグループ化してキャプチャします'
      }
    ],
    completed: false
  },
  {
    id: 5,
    title: '先読み・後読み（発展編）',
    description: '特定の条件が満たされた場合にマッチする先読み・後読みを学びます。',
    content: {
      theory: `先読み・後読み（Lookahead/Lookbehind）は、特定の条件が満たされている場合のみマッチする高度な機能です。マッチした部分には含まれません。

先読み（Lookahead）：
• (?=...) ：肯定先読み（後に...が続く場合）
• (?!...) ：否定先読み（後に...が続かない場合）

後読み（Lookbehind）：
• (?<=...) ：肯定後読み（前に...がある場合）
• (?<!...) ：否定後読み（前に...がない場合）

これらは「ゼロ幅アサーション」と呼ばれ、条件をチェックするだけで文字を消費しません。`,
      examples: [
        {
          pattern: 'Java(?=Script)',
          text: 'Java JavaScript Python',
          explanation: '「Java」の後に「Script」が続く場合のみ「Java」にマッチ',
          matches: ['Java']
        },
        {
          pattern: 'Java(?!Script)',
          text: 'Java JavaScript JavaBeans',
          explanation: '「Java」の後に「Script」が続かない場合のみマッチ',
          matches: ['Java', 'Java']
        },
        {
          pattern: '\\d+(?=\\$)',
          text: 'Price: 100$ and 200¥',
          explanation: '「$」の前にある数字のみマッチ',
          matches: ['100']
        }
      ],
      keyPoints: [
        '先読み・後読みは条件をチェックするだけ',
        '(?=...)で肯定先読み、(?!...)で否定先読み',
        'マッチ結果には条件部分は含まれない',
        '複雑な条件付きマッチングに便利'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '「Java」の後に「Script」が続く場合の「Java」にマッチする正規表現を作成してください',
        testString: 'Java JavaScript Python',
        expectedAnswer: 'Java(?=Script)',
        hint: '「(?=...)」は肯定先読みです'
      },
      {
        id: 2,
        question: '「Java」の後に「Script」が続かない場合の「Java」にマッチする正規表現を作成してください',
        testString: 'Java JavaScript JavaBeans',
        expectedAnswer: 'Java(?!Script)',
        hint: '「(?!...)」は否定先読みです'
      },
      {
        id: 3,
        question: '「$」の前にある数字にマッチする正規表現を作成してください',
        testString: 'Price: 100$ and 200¥',
        expectedAnswer: '\\d+(?=\\$)',
        hint: '先読みを使って「$」の前の数字を取得します'
      }
    ],
    completed: false
  },
  {
    id: 6,
    title: 'フラグとオプション',
    description: '正規表現の挙動を変更するフラグとオプションを学びます。',
    content: {
      theory: `フラグ（Flag）は正規表現の挙動を変更するオプションです。多くのプログラミング言語では、正規表現の末尾にフラグを指定します。

主なフラグ：
• i (ignoreCase) ：大文字小文字を区別しない
• g (global) ：全てのマッチを検索（最初の1つだけではなく）
• m (multiline) ：複数行モード（^と$が行頭・行末にマッチ）
• s (dotall) ：「.」が改行文字にもマッチ

例：/hello/i は大文字小文字を区別せずに「hello」を検索
このアプリではフラグを直接体験できませんが、実際の開発では非常に重要です。`,
      examples: [
        {
          pattern: 'hello',
          text: 'Hello HELLO hello',
          explanation: '通常は大文字小文字を区別するが、iフラグで区別しない',
          matches: ['hello']
        },
        {
          pattern: '^#',
          text: '# Title\nSome text\n# Another title',
          explanation: 'mフラグで各行の先頭の#にマッチ',
          matches: ['#', '#']
        }
      ],
      keyPoints: [
        'フラグは正規表現の挙動を変更',
        'iフラグで大文字小文字を無視',
        'mフラグで複数行に対応',
        '実際のアプリケーションで非常に有用'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '大文字小文字を区別せずに「hello」にマッチする場面を想定してください（実際の正規表現は「hello」と入力）',
        testString: 'Hello HELLO hello',
        expectedAnswer: 'hello',
        hint: '実際のアプリケーションでは「i」フラグ（ignoreCase）を使用します'
      },
      {
        id: 2,
        question: '改行を含む複数行で行頭の「#」にマッチする場面を想定してください（実際の正規表現は「^#」と入力）',
        testString: '# Title\nSome text\n# Another title',
        expectedAnswer: '^#',
        hint: '実際のアプリケーションでは「m」フラグ（multiline）を使用します'
      }
    ],
    completed: false
  },
  {
    id: 7,
    title: '実践チャレンジ問題（初級）',
    description: '実際のデータ処理で使用される正規表現パターンを学びます。',
    content: {
      theory: `実践チャレンジでは、これまで学んだ知識を組み合わせて、実際のデータ処理でよく使われるパターンにチャレンジします。

初級レベルの実践パターン：
• メールアドレスの基本的な検証
• IPアドレスのパターンマッチング
• HTMLタグの属性値の抽出
• 電話番号や郵便番号の検証

これらのパターンは、Web開発、データ処理、ログ解析などで頻繁に使用されます。簡単なパターンから始めて、徐々に複雑なパターンに挑戦していきましょう。`,
      examples: [
        {
          pattern: '\\w+@\\w+\\.\\w+',
          text: 'Contact: user@example.com',
          explanation: '基本的なメールアドレスのパターン',
          matches: ['user@example.com']
        },
        {
          pattern: '\\d+\\.\\d+\\.\\d+\\.\\d+',
          text: 'Server: 192.168.1.1',
          explanation: 'IPv4アドレスの簡易パターン',
          matches: ['192.168.1.1']
        },
        {
          pattern: '"[^"]+"',
          text: '<img src="image.jpg" alt="description">',
          explanation: 'ダブルクォート内の文字列を抽出',
          matches: ['"image.jpg"', '"description"']
        }
      ],
      keyPoints: [
        '学んだ技術を組み合わせて実用的なパターンを作成',
        '簡単なパターンから始める',
        '実際のデータでテストして精度を上げる',
        'パフォーマンスと精度のバランスを考慮'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '基本的なメールアドレス形式にマッチする正規表現を作成してください',
        testString: 'Contact: user@example.com or admin@test.org',
        expectedAnswer: '\\w+@\\w+\\.\\w+',
        hint: '単語文字@単語文字.単語文字の形式です'
      },
      {
        id: 2,
        question: 'IPv4アドレス（簡易版）にマッチする正規表現を作成してください',
        testString: 'Server: 192.168.1.1 or 10.0.0.1',
        expectedAnswer: '\\d+\\.\\d+\\.\\d+\\.\\d+',
        hint: '数字.数字.数字.数字の形式です'
      },
      {
        id: 3,
        question: 'HTMLタグの属性値（ダブルクォート内の文字列）にマッチする正規表現を作成してください',
        testString: '<img src="image.jpg" alt="description">',
        expectedAnswer: '"[^"]+"',
        hint: 'ダブルクォート内のダブルクォート以外の文字です'
      }
    ],
    completed: false
  },
  {
    id: 8,
    title: '実践チャレンジ問題（中級）',
    description: 'より複雑な実践的な正規表現パターンにチャレンジします。',
    content: {
      theory: `中級レベルでは、より複雑で実用的なパターンにチャレンジします。これらのパターンは、Web開発、ログ解析、データマイニングなどで頻繁に使用されます。

中級レベルの実践パターン：
• 日付フォーマットの検証と抽出
• ログファイルからのタイムスタンプ抽出
• CSSのcolor値やHTMLの属性値のパーシング
• URLの各部分の抽出

これらのパターンでは、量指定子、文字クラス、グループ化などの技術を組み合わせて使用します。`,
      examples: [
        {
          pattern: '\\d{4}-\\d{2}-\\d{2}',
          text: 'Today is 2024-03-15',
          explanation: 'YYYY-MM-DD形式の日付パターン',
          matches: ['2024-03-15']
        },
        {
          pattern: '\\d{2}:\\d{2}:\\d{2}',
          text: '[12:34:56] INFO: Application started',
          explanation: 'HH:MM:SS形式の時刻パターン',
          matches: ['12:34:56']
        },
        {
          pattern: '#[0-9A-Fa-f]{6}',
          text: 'color: #FF5733; background: #123ABC;',
          explanation: '六進カラーコードのパターン',
          matches: ['#FF5733', '#123ABC']
        }
      ],
      keyPoints: [
        '複数の技術を組み合わせた実用パターン',
        '数値の範囲や文字の制約を適切に指定',
        'パフォーマンスと精度のバランスを考慮',
        '実際のプロジェクトですぐに応用可能'
      ]
    },
    exercises: [
      {
        id: 1,
        question: '日付フォーマット（YYYY-MM-DD）にマッチする正規表現を作成してください',
        testString: 'Today is 2024-03-15 and tomorrow is 2024-03-16',
        expectedAnswer: '\\d{4}-\\d{2}-\\d{2}',
        hint: '4桁年-2桁月-2桁日の形式です'
      },
      {
        id: 2,
        question: 'ログファイルのタイムスタンプ（HH:MM:SS）にマッチする正規表現を作成してください',
        testString: '[12:34:56] INFO: Application started',
        expectedAnswer: '\\d{2}:\\d{2}:\\d{2}',
        hint: '2桁時:2桁分:2桁秒の形式です'
      },
      {
        id: 3,
        question: 'CSS color値（#RRGGBB形式）にマッチする正規表現を作成してください',
        testString: 'color: #FF5733; background: #123ABC;',
        expectedAnswer: '#[0-9A-Fa-f]{6}',
        hint: '#の後に16進数6桁が続きます'
      }
    ],
    completed: false
  }
]

function LearningMode() {
  const [lessons] = useState<Lesson[]>(initialLessons)
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(lessons[0])
  const [currentExercise, setCurrentExercise] = useState<Exercise | null>(lessons[0]?.exercises[0] || null)
  const [userRegex, setUserRegex] = useState('')
  const [feedback, setFeedback] = useState('')
  const [showHint, setShowHint] = useState(false)
  const [viewMode, setViewMode] = useState<'theory' | 'practice'>('theory')
  
  // デバウンスされた正規表現値（パフォーマンス向上のため）
  const debouncedUserRegex = useDebounce(userRegex, 300)

  // マッチング処理を改善（メモ化でパフォーマンス向上）
  const getMatches = useCallback((regexPattern: string) => {
    if (!currentExercise) return []
    return getRegexMatches(regexPattern, currentExercise.testString)
  }, [currentExercise])

  // デバウンスされたマッチ結果
  const matches = useMemo(() => getMatches(debouncedUserRegex), [getMatches, debouncedUserRegex])

  const checkAnswer = () => {
    if (!currentExercise || !userRegex.trim()) return
    
    try {
      const testMatches = getMatches(userRegex)
      
      if (userRegex === currentExercise.expectedAnswer) {
        setFeedback('🎉 正解です！')
      } else if (testMatches.length > 0) {
        const matchTexts = testMatches.map(m => m.text).filter(text => text.length > 0)
        if (matchTexts.length > 0) {
          setFeedback(`⚠️ マッチしましたが、期待される答えと異なります。\nマッチした内容: "${matchTexts.join('", "')}"`)
        } else {
          setFeedback('❌ マッチしませんでした。もう一度試してください。')
        }
      } else {
        setFeedback('❌ マッチしませんでした。もう一度試してください。')
      }
    } catch (error) {
      if (error instanceof Error) {
        setFeedback(`❌ ${error.message}`)
      } else {
        setFeedback('❌ 無効な正規表現です。構文を確認してください。')
      }
    }
  }

  // ハイライト処理を改善（デバウンスされたマッチ結果を使用）
  const highlightMatches = useMemo(() => {
    if (!currentExercise || matches.length === 0) {
      return currentExercise?.testString || ''
    }
    
    let result = ''
    let lastIndex = 0
    
    // マッチをインデックス順にソート
    const sortedMatches = [...matches].sort((a, b) => a.index - b.index)
    
    sortedMatches.forEach(match => {
      result += currentExercise.testString.slice(lastIndex, match.index)
      result += `<mark>${match.text}</mark>`
      lastIndex = match.index + match.text.length
    })
    result += currentExercise.testString.slice(lastIndex)
    
    return result
  }, [currentExercise, matches])

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
                setViewMode('theory')
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
              
              <div className="mode-tabs">
                <button 
                  className={`tab-button ${viewMode === 'theory' ? 'active' : ''}`}
                  onClick={() => setViewMode('theory')}
                >
                  📚 解説
                </button>
                <button 
                  className={`tab-button ${viewMode === 'practice' ? 'active' : ''}`}
                  onClick={() => setViewMode('practice')}
                >
                  ✏️ 練習問題
                </button>
              </div>
            </div>
            
            {viewMode === 'theory' && (
              <div className="theory-section">
                <div className="theory-content">
                  <h3>📖 理論</h3>
                  <div className="theory-text">
                    {selectedLesson.content.theory.split('\n').map((line, index) => (
                      <p key={index}>{line}</p>
                    ))}
                  </div>
                </div>
                
                <div className="examples-section">
                  <h3>💡 具体例</h3>
                  {selectedLesson.content.examples.map((example, index) => (
                    <div key={index} className="example-item">
                      <div className="example-pattern">
                        <strong>パターン:</strong> <code>{example.pattern}</code>
                      </div>
                      <div className="example-text">
                        <strong>テキスト:</strong> <span className="text-sample">{example.text}</span>
                      </div>
                      <div className="example-explanation">
                        <strong>説明:</strong> {example.explanation}
                      </div>
                      {example.matches && (
                        <div className="example-matches">
                          <strong>マッチ結果:</strong> {example.matches.map((match, matchIndex) => 
                            <span key={`${index}-${matchIndex}-${match}`} className="match-result">{match}</span>
                          )}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="key-points-section">
                  <h3>🔑 重要ポイント</h3>
                  <ul className="key-points-list">
                    {selectedLesson.content.keyPoints.map((point, index) => (
                      <li key={index}>{point}</li>
                    ))}
                  </ul>
                </div>
                
                <div className="next-step-button">
                  <button 
                    className="primary-button" 
                    onClick={() => setViewMode('practice')}
                  >
                    練習問題に進む →
                  </button>
                </div>
              </div>
            )}
            
            {viewMode === 'practice' && currentExercise && (
              <div className="exercise-section">
                <div className="exercise-question">
                  <h3>練習問題</h3>
                  <p>{currentExercise.question}</p>
                </div>
                
                <div className="test-string">
                  <h4>テスト文字列:</h4>
                  <div 
                    className="test-string-display"
                    dangerouslySetInnerHTML={{ __html: highlightMatches }}
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
                  <button 
                    className="secondary-button"
                    onClick={() => setViewMode('theory')}
                  >
                    📚 解説に戻る
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