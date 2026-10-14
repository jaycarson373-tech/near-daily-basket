import { describe, expect, it } from 'vitest'
import { calculateRound } from './rewardLedger'

describe('daily reward accounting', () => {
  it('allocates pro rata and carries unclaimed shares into the next pool', () => {
    const round = calculateRound({
      purchased: 100n,
      carryForward: 20n,
      holders: [{ accountId: 'alice.near', balance: 3n }, { accountId: 'bob.near', balance: 1n }],
      claimedAccounts: ['alice.near'],
    })
    expect(round.entitlements.get('alice.near')).toBe(90n)
    expect(round.entitlements.get('bob.near')).toBe(30n)
    expect(round.claimable.get('bob.near')).toBe(30n)
    expect(round.carryForwardNext).toBe(30n)
  })

  it('keeps the entire pool when there are no eligible snapshot balances', () => {
    const round = calculateRound({ purchased: 9n, carryForward: 3n, holders: [{ accountId: 'empty.near', balance: 0n }] })
    expect(round.totalBalance).toBe(0n)
    expect(round.carryForwardNext).toBe(12n)
  })

  it('retains integer-rounding dust for the next distribution', () => {
    const round = calculateRound({ purchased: 11n, carryForward: 0n, holders: [{ accountId: 'alice.near', balance: 1n }, { accountId: 'bob.near', balance: 1n }], claimedAccounts: ['alice.near', 'bob.near'] })
    expect(round.claimedTotal).toBe(10n)
    expect(round.carryForwardNext).toBe(1n)
  })

  it('rejects a negative pool input', () => {
    expect(() => calculateRound({ purchased: -1n, carryForward: 0n, holders: [] })).toThrow('Pool amounts cannot be negative')
  })
})
