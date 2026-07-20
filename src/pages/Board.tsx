import { useMemo, useState } from 'react'
import { MatchCard } from '../components/MatchCard'
import { SPORTS } from '../data/sports'
import { useStore } from '../store'
import type { SportId } from '../types'

type Filter = 'all' | SportId

export function Board() {
  const { visibleMatches } = useStore()
  const [filter, setFilter] = useState<Filter>('all')

  const display = useMemo(() => {
    if (filter === 'all') return visibleMatches
    return visibleMatches.filter((m) => m.sport === filter)
  }, [visibleMatches, filter])

  return (
    <>
      <h1 className="page-title">試合一覧</h1>
      <p className="page-sub">公開募集と、あなたに表示される非公開募集</p>

      <div className="filters" role="tablist" aria-label="競技で絞り込み">
        <button
          type="button"
          className={`chip ${filter === 'all' ? 'active' : ''}`}
          onClick={() => setFilter('all')}
        >
          すべて
        </button>
        {SPORTS.map((s) => (
          <button
            key={s.id}
            type="button"
            className={`chip ${filter === s.id ? 'active' : ''}`}
            onClick={() => setFilter(s.id)}
          >
            {s.label}
          </button>
        ))}
      </div>

      {display.length === 0 ? (
        <div className="empty">条件に合う試合はまだありません</div>
      ) : (
        <div className="match-list">
          {display.map((m, i) => (
            <MatchCard key={m.id} match={m} index={i} />
          ))}
        </div>
      )}
    </>
  )
}
