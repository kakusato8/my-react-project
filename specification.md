1. アプリケーション概要
本アプリケーションは、プログラマが正規表現を効果的に学習し、実践的にスキルを向上させるためのWebベースのツールです。インタラクティブな演習、リアルタイムのパターンマッチング確認、および詳細な解説を通じて、正規表現の複雑な概念を直感的に理解できることを目指します。

2. ターゲットユーザー
正規表現の基礎を学びたいプログラミング初心者

正規表現の複雑なパターンを習得したい中級プログラマ

正規表現の復習や確認を行いたい上級プログラマ

3. 主要機能
3.1. 学習モード（Learning Mode）
段階的に正規表現の概念を学べる機能です。

レッスンリスト表示:

正規表現の基本（例: リテラル、メタ文字、文字クラス）から、高度な概念（例: 量指定子、グループ化、後方参照、先読み/後読み、Atomic Grouping, Possessive Quantifiers）まで、段階的に構成されたレッスンの一覧を表示します。

各レッスンには進捗状況（未開始、進行中、完了）が表示されます。

レッスン詳細:

選択されたレッスンの概念説明（テキスト、図解、コード例を含む）を表示します。

インタラクティブな演習問題を複数提供します。

問題文と期待される出力例を提示します。

ユーザーが正規表現を入力するテキストエリアを提供します。

ユーザーが入力した正規表現に対するリアルタイムのマッチング結果（マッチした部分のハイライト表示、キャプチャグループの表示など）をプレビューエリアに表示します。

解答ボタンを押すと、正誤判定を行い、必要に応じてヒントや模範解答を表示します。

問題ごとに正解率や解答時間などの統計情報を記録します。

用語集/チートシート:

正規表現の主要なメタ文字、記号、フラグなどの一覧と簡単な説明をいつでも参照できる機能を提供します。

3.2. 練習モード（Practice Mode）
自由な文字列と正規表現で試行錯誤できる機能です。

正規表現入力エリア:

ユーザーが任意の正規表現を入力できるテキストエリアを提供します。

テスト文字列入力エリア:

ユーザーが任意のテスト文字列を入力できるテキストエリアを提供します。

リアルタイムマッチング結果表示:

正規表現とテスト文字列に基づき、リアルタイムでマッチング結果を表示します。

マッチした部分のハイライト表示。

キャプチャグループの内容表示（例: グループ1: "abc"）。

全体のマッチ数を表示。

マッチに失敗した場合のエラーメッセージ（構文エラーなど）を表示。

フラグ設定:

g (グローバル検索), i (大文字小文字無視), m (複数行モード), s (ドットオール), u (Unicode), y (スティッキー) などのフラグをON/OFFできるチェックボックスを提供します。

3.3. ユーザープロファイル・進捗管理
ユーザー登録/ログイン:

ユーザーがアカウントを作成し、ログインできるようにします。（任意：ゲストモードも可）

学習進捗の保存:

各レッスンの完了状況、演習問題の正解履歴、スコアなどをユーザーごとに保存し、次回アクセス時に復元します。

統計情報の表示:

完了したレッスン数、総合的な正解率、得意な正規表現パターン/苦手なパターン（演習問題の結果に基づく）などの統計情報をグラフや数値で表示します。

4. 非機能要件
4.1. パフォーマンス
正規表現のマッチングはユーザー入力に対してリアルタイムかつ高速に実行されること。

UIの操作はスムーズで、遅延を感じさせないこと。

4.2. ユーザビリティ
直感的で分かりやすいUI/UX。

レスポンシブデザインにより、PC、タブレット、スマートフォンなど様々なデバイスで利用可能であること。

エラーメッセージは具体的で、ユーザーが問題を解決しやすいように工夫すること。

4.3. 堅牢性
無効な正規表現が入力された場合でも、アプリケーションがクラッシュしないこと。

セキュリティ対策（XSS対策など）を講じること。

4.4. 拡張性
将来的に新しいレッスンや演習問題を追加しやすいアーキテクチャであること。

他のプログラミング言語（Python, JavaScript, Rubyなど）の正規表現の差異を比較できる機能の追加を検討できるように設計すること。