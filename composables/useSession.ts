
export const SID_KEY = 'phri_session_id'

function genShortId(len = 16) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const arr = crypto.getRandomValues(new Uint8Array(len))
  let out = ''
  for (let i = 0; i < len; i++) out += alphabet[arr[i] % alphabet.length]
  return out
}


function isBackendSafe(sid: string | null | undefined) {
  if (!sid) return false
  if (sid.length > 20) return false
  return /^[a-z0-9]+$/.test(sid)
}


function needUpgrade(sid: string | null | undefined) {
  return !isBackendSafe(sid || '')
}

export function getSession(): string | null {
  if (!process.client) return null
  try { return localStorage.getItem(SID_KEY) } catch { return null }
}


export function ensureSessionWithUpgrade(): { sid: string; prev: string | null } {
  if (!process.client) return { sid: '', prev: null }
  try {
    let sid = localStorage.getItem(SID_KEY)
    if (needUpgrade(sid)) {
      const prev = sid || null
      sid = genShortId(16)
      localStorage.setItem(SID_KEY, sid)
      return { sid, prev }
    }
    return { sid: sid!, prev: null }
  } catch {
    const sid = genShortId(16)
    return { sid, prev: null }
  }
}

export function ensureSession(): string {
  return ensureSessionWithUpgrade().sid
}
