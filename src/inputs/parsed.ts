import { pageLimitInput } from './raw'

const LargeLimit = 100000

export const pageLimit = (): number => {
  const result = parseInt(pageLimitInput())
  if (isNaN(result)) return 1
  if (result < 1) return LargeLimit
  return result
}
