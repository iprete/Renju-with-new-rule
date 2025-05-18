name: Merge Gomoku Cache
on:
  issues:
    types: [opened]

jobs:
  merge:
    if: github.event.issue.title == 'Upload cache'
    runs-on: ubuntu-latest

    steps:
      - name: Checkout
        uses: actions/checkout@v4

      - name: Extract JSON from issue body ➜ tmp.json
        run: |
          echo "${{ github.event.issue.body }}" > issue.txt
          # 코드 블록 ‵```json … ```‵ 안의 부분만 추출
          grep -A999 '```json' issue.txt | grep -B999 '```' | sed '1d;$d' > _tmp.json

      - name: Merge into cache.json
        run: node .github/scripts/merge.js

      - name: Commit & push
        uses: EndBug/add-and-commit@v9
        with:
          add: cache.json
          message: 'merge cache'

      - name: Close issue
        uses: peter-evans/close-issue@v2
