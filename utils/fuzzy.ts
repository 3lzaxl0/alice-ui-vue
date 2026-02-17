/**
 * Interface representing a fuzzy match result.
 */
export interface FuzzyMatchResult {
  score: number
  indices: number[]
}

/**
 * Single-word fuzzy matching algorithm.
 * Sequential matching within the target string.
 */
export function fuzzyMatch(query: string, target: string): FuzzyMatchResult | null {
  if (!query) return { score: 0, indices: [] }

  const q = query.toLowerCase()
  const t = target.toLowerCase()
  const qLen = q.length
  const tLen = t.length

  if (qLen > tLen) return null

  const indices: number[] = []
  let score = 0
  let tIdx = 0
  let lastIdx = -1

  for (let i = 0; i < qLen; i++) {
    const char = q[i]
    let found = false

    while (tIdx < tLen) {
      if (t[tIdx] === char) {
        indices.push(tIdx)

        let matchBonus = 10
        if (lastIdx !== -1 && tIdx === lastIdx + 1) matchBonus += 30
        const isStartOfWord =
          tIdx === 0 || t[tIdx - 1] === ' ' || t[tIdx - 1] === '-' || t[tIdx - 1] === '_'
        if (isStartOfWord) matchBonus += 50
        if (target[tIdx] === query[i]) matchBonus += 5

        score += matchBonus
        lastIdx = tIdx
        tIdx++
        found = true
        break
      }
      tIdx++
    }
    if (!found) return null
  }

  const firstMatch = indices[0]
  const lastMatch = indices[indices.length - 1]
  if (firstMatch !== undefined && lastMatch !== undefined) {
    const spread = lastMatch - firstMatch
    const densityPenalty = spread - qLen
    score -= densityPenalty
  }

  return { score, indices }
}

/**
 * Smart Multi-word Fuzzy Matching.
 * Tokenizes the query by space and ensures EVERY token matches the target,
 * regardless of the order in the query.
 *
 * @param query - The multi-word query (e.g., "pet 20 bid")
 * @param target - The string to search against (e.g., "AGUA ... 20L BIDON PET")
 */
export function smartFuzzyMatch(query: string, target: string): FuzzyMatchResult | null {
  const trimmed = query.trim()
  if (!trimmed) return { score: 0, indices: [] }

  const tokens = trimmed.split(/\s+/).filter(Boolean)
  const allIndices: number[] = []
  let totalScore = 0

  for (const token of tokens) {
    const match = fuzzyMatch(token, target)
    if (!match) return null // All tokens MUST match

    // Collect all indices and sum scores
    totalScore += match.score
    for (const idx of match.indices) {
      if (!allIndices.includes(idx)) {
        allIndices.push(idx)
      }
    }
  }

  // Bonus for matching more tokens
  totalScore += tokens.length * 100

  // Sort indices for highlighting
  allIndices.sort((a, b) => a - b)

  return { score: totalScore, indices: allIndices }
}
