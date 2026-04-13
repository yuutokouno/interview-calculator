# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## プロジェクト概要

採用面接用の電卓アプリ実装課題。`index.html` に HTML/CSS のベースが用意されており、`<script>` タグ内に JavaScript を追加して電卓機能を実装する。単一ファイル（index.html）で完結する構成。

## コマンド

```bash
# 依存インストール
npm ci

# E2Eテスト実行（Playwright / ローカルサーバーが自動起動される）
npx playwright test

# Playwright ブラウザのインストール（初回のみ）
npx playwright install --with-deps chromium

# ローカルで動作確認（ブラウザで http://localhost:8787/index.html を開く）
npx serve -l 8787
```

## アーキテクチャ

- **index.html**: 電卓の全体（HTML構造 + CSS + JavaScript）を含む単一ファイル。ディスプレイは `<input id="display" readonly>` で、各ボタンは `data-testid` 属性を持つ
- **e2e/calculator.spec.js**: Playwright による必須要件の自動テスト。ボタンは `data-testid` で特定される（例: `btn-0`〜`btn-9`, `btn-add`, `btn-equals`, `btn-clear`, `btn-backspace` 等）
- **playwright.config.js**: `npx serve -l 8787` でローカルサーバーを起動し、ポート 8787 でテスト実行

## テスト時の重要事項

- ディスプレイの値は `#display` の `value` 属性で検証される（`toHaveValue`）
- 演算子 `×` はボタン表示もテスト内も `×`（Unicode）であり、`*` ではない
- テストは「必須要件」のみカバー（数字入力、四則演算、かっこ、クリア、1文字削除、イコール）

## 必須要件

- 数字ボタン（0〜9）→ ディスプレイに反映
- 四則演算（+, -, ×, /）が正しく動作
- かっこ `()` を使った計算
- C ボタンで入力リセット
- ← ボタンで直前の1文字削除
- = ボタンで計算結果表示

## 任意課題

- 税率設定・税込/税抜計算
- 商と余りの表示
- オリジナル機能
