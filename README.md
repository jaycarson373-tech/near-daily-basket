# Near Basket

A transparent daily pool concept for buying selected NEAR ecosystem tokens and allocating the realized basket to eligible holders. Holders claim daily; unclaimed allocations and rounding dust carry into the next distribution round.

## Current status

- The responsive interface supports a local basket draft, toggling projects, adding NEAR token accounts, and equal-weight buy previews.
- Batman (`batman-4.nearlytrade.near`) is preloaded as the reference project from the request. It is not a funded order or endorsement.
- `src/rewardLedger.ts` computes pro-rata entitlements from an immutable balance snapshot and carries forward unclaimed units. Unit tests cover distribution, empty snapshots, rounding, and invalid inputs.
- Wallet connection, treasury funding, quote/sign/settle, trusted holder snapshots, claim transactions, and persistent round state are not implemented. No trades or payouts occur.

## Run

```sh
npm install
npm run dev
npm test
npm run build
```

## Before mainnet

Use an audited treasury/contract design, multisig-controlled funding, a project allowlist, deterministic snapshot source and block/height, claim replay protection, and public settlement receipts. Define who can select projects, how buy weights are set, eligibility/anti-sybil rules, cutoff time, and how carry-forward is redistributed. Do not promise yield or daily dollar value; the pool only distributes assets actually purchased and funded.

NEAR Intents integration reference: https://docs.near.org/tutorials/intents/introduction
