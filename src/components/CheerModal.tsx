import { useEffect, useState } from 'react'
import { CHEER_PRESETS } from '../data/sports'
import { useStore } from '../store'

export function CheerModal({
  matchId,
  teamName,
  onClose,
}: {
  matchId: string
  teamName: string
  onClose: () => void
}) {
  const { currentUser, sendCheer } = useStore()
  const [amount, setAmount] = useState(CHEER_PRESETS[0].amount)
  const [message, setMessage] = useState(CHEER_PRESETS[0].label)
  const [error, setError] = useState('')
  const [done, setDone] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [onClose])

  if (!currentUser) return null

  const submit = () => {
    setError('')
    const ok = sendCheer(matchId, amount, message)
    if (!ok) {
      setError('コインが足りません。マイページでチャージできます（デモ）。')
      return
    }
    setDone(true)
    setTimeout(onClose, 900)
  }

  return (
    <div className="modal-backdrop" onClick={onClose} role="presentation">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cheer-title"
        onClick={(e) => e.stopPropagation()}
      >
        {done ? (
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <div style={{ fontSize: '3rem' }}>🎉</div>
            <h3>応援ありがとう！</h3>
            <p className="sub">{teamName} に気持ちが届きました</p>
          </div>
        ) : (
          <>
            <h3 id="cheer-title">投げ銭で応援</h3>
            <p className="sub">
              {teamName} を応援しよう（所持: 🪙 {currentUser.coins.toLocaleString()}）
            </p>

            <div className="preset-grid">
              {CHEER_PRESETS.map((p) => (
                <button
                  key={p.amount}
                  type="button"
                  className={`preset ${amount === p.amount ? 'active' : ''}`}
                  onClick={() => {
                    setAmount(p.amount)
                    setMessage(p.label)
                  }}
                >
                  <div style={{ fontSize: '1.4rem' }}>{p.emoji}</div>
                  <div>{p.label}</div>
                  <div style={{ color: '#b45309' }}>{p.amount}</div>
                </button>
              ))}
            </div>

            <div className="field" style={{ marginBottom: 14 }}>
              <label htmlFor="cheer-msg">メッセージ</label>
              <input
                id="cheer-msg"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                maxLength={40}
                placeholder="がんばれ！"
              />
            </div>

            {error && (
              <p style={{ color: 'var(--coral)', fontWeight: 700, marginTop: 0 }}>{error}</p>
            )}

            <div style={{ display: 'flex', gap: 10 }}>
              <button type="button" className="btn btn-ghost btn-block" onClick={onClose}>
                やめる
              </button>
              <button type="button" className="btn btn-coral btn-block" onClick={submit}>
                🪙 {amount} 送る
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
