import type { Sport } from '../types'

export const SPORTS: Sport[] = [
  { id: 'baseball', label: '野球', emoji: '⚾', color: '#E85D04' },
  { id: 'soccer', label: 'サッカー', emoji: '⚽', color: '#2D6A4F' },
  { id: 'volleyball', label: 'バレーボール', emoji: '🏐', color: '#0077B6' },
  { id: 'basketball', label: 'バスケ', emoji: '🏀', color: '#C1121F' },
  { id: 'softball', label: 'ソフトボール', emoji: '🥎', color: '#F4A261' },
  { id: 'tennis', label: 'テニス', emoji: '🎾', color: '#40916C' },
]

export function getSport(id: string): Sport {
  return SPORTS.find((s) => s.id === id) ?? SPORTS[0]
}

export const AREAS = [
  '東京',
  '神奈川',
  '埼玉',
  '千葉',
  '大阪',
  '愛知',
  '福岡',
  '北海道',
  'その他',
]

export const CHEER_PRESETS = [
  { amount: 100, label: 'がんばれ！', emoji: '👏' },
  { amount: 300, label: 'ナイスプレー', emoji: '🔥' },
  { amount: 500, label: '優勝祈願', emoji: '⭐' },
  { amount: 1000, label: '熱い応援', emoji: '💖' },
]
