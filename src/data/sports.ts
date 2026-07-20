import type { Sport } from '../types'

export const SPORTS: Sport[] = [
  { id: 'baseball', label: '野球', emoji: '', color: '#C45C26' },
  { id: 'soccer', label: 'サッカー', emoji: '', color: '#1F6B4A' },
  { id: 'volleyball', label: 'バレーボール', emoji: '', color: '#1A6FA8' },
  { id: 'basketball', label: 'バスケ', emoji: '', color: '#B42318' },
  { id: 'softball', label: 'ソフトボール', emoji: '', color: '#A86B2D' },
  { id: 'tennis', label: 'テニス', emoji: '', color: '#2F7A52' },
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
  { amount: 100, label: '応援しています', emoji: '' },
  { amount: 300, label: 'いい試合を', emoji: '' },
  { amount: 500, label: '勝利を祈って', emoji: '' },
  { amount: 1000, label: '全力サポート', emoji: '' },
]
