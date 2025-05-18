/**
 * 읽은 _tmp.json(방금 Issue에서 온 배열)과
 * repo 루트의 cache.json(기존 배열)을 병합 후 덮어쓰기
 *  - 같은 hash면 최신(depth 더 큰) 데이터가 우선
 */

const fs = require('fs');

const add = JSON.parse(fs.readFileSync('_tmp.json', 'utf-8') || '[]');
let base = [];
try {
  base = JSON.parse(fs.readFileSync('cache.json', 'utf-8'));
} catch {
  base = [];
}

// Map<hash, {depth, top3}>
const map = new Map(base.map(o => [o.hash, o]));

for (const o of add) {
  const prev = map.get(o.hash);
  if (!prev || (o.depth ?? 0) > (prev.depth ?? 0)) map.set(o.hash, o);
}

fs.writeFileSync('cache.json', JSON.stringify([...map.values()], null, 2));
console.log(`Merged ${add.length} entries -> total ${map.size}`);
