export type HolderBalance = { accountId: string; balance: bigint }
export type RoundInput = {
  /** New tokens realized by the day's buys, in the token's smallest unit. */
  purchased: bigint
  /** Unclaimed units carried from earlier rounds for this same token. */
  carryForward: bigint
  /** Immutable balance snapshot taken at the published cutoff. */
  holders: HolderBalance[]
  /** Wallets that have already claimed their current entitlement. */
  claimedAccounts?: string[]
}

export function calculateRound(input: RoundInput) {
  if (input.purchased < 0n || input.carryForward < 0n) throw new Error('Pool amounts cannot be negative')
  const pool = input.purchased + input.carryForward
  const holders = input.holders.filter(holder => holder.balance > 0n)
  const totalBalance = holders.reduce((sum, holder) => sum + holder.balance, 0n)
  const claimed = new Set(input.claimedAccounts ?? [])
  const entitlements = new Map<string, bigint>()

  if (totalBalance > 0n) {
    for (const holder of holders) {
      const entitlement = pool * holder.balance / totalBalance
      entitlements.set(holder.accountId, entitlement)
    }
  }

  const claimable = new Map<string, bigint>()
  let claimedTotal = 0n
  for (const [accountId, entitlement] of entitlements) {
    if (claimed.has(accountId)) claimedTotal += entitlement
    else claimable.set(accountId, entitlement)
  }
  // Unclaimed allocations and integer-rounding dust both remain in the pool.
  const carryForwardNext = pool - claimedTotal
  return { pool, totalBalance, entitlements, claimable, claimedTotal, carryForwardNext }
}
