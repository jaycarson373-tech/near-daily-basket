import { useMemo, useState } from 'react'
import './App.css'

type Project = { name: string; ticker: string; contract: string; pair: string; selected: boolean }
const initialProjects: Project[] = [
  { name: 'Batman', ticker: 'BATMAN', contract: 'batman-4.nearlytrade.near', pair: 'NEAR', selected: true },
]

function App() {
  const [projects, setProjects] = useState(initialProjects)
  const [name, setName] = useState('')
  const [contract, setContract] = useState('')
  const [poolNear, setPoolNear] = useState(25)
  const [wallet, setWallet] = useState(false)
  const [notice, setNotice] = useState('')
  const [view, setView] = useState<'basket' | 'rewards'>('basket')

  const allocated = useMemo(() => projects.filter(p => p.selected).length, [projects])
  const previewAmount = poolNear / Math.max(allocated, 1)
  const addProject = (e: React.FormEvent) => {
    e.preventDefault()
    if (!name.trim() || !contract.trim()) return
    setProjects(p => [...p, { name: name.trim(), ticker: name.trim().toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 8), contract: contract.trim(), pair: 'NEAR', selected: true }])
    setName(''); setContract(''); setNotice('Added to this browser’s draft basket. No trade was placed.')
    window.setTimeout(() => setNotice(''), 3600)
  }
  const toggle = (contractId: string) => setProjects(p => p.map(x => x.contract === contractId ? { ...x, selected: !x.selected } : x))

  return <div className="basket-app">
    <header className="nav"><a href="#top" className="logo"><span className="logo-mark">n</span><span>near<span>basket</span></span></a><div className="nav-links"><button onClick={() => setView('basket')} className={view === 'basket' ? 'selected' : ''}>Basket</button><button onClick={() => setView('rewards')} className={view === 'rewards' ? 'selected' : ''}>Rewards</button><a href="#rules">How it works</a></div><button className="wallet" onClick={() => { setWallet(!wallet); setNotice(wallet ? 'Wallet disconnected in preview.' : 'Wallet connection is not enabled in this preview.') }}>{wallet ? 'Preview connected' : 'Connect wallet'} <span>↗</span></button></header>
    <main id="top">
      <section className="basket-hero"><div className="hero-left"><div className="overline"><span className="pulse"/> NEAR ECOSYSTEM BUYING POOL</div><h1>Build the basket.<br/><i>Share the drops.</i></h1><p>A transparent pool buys selected NEAR projects on a published schedule. Eligible holders can claim their share each day. Anything left unclaimed rolls into the next distribution.</p><div className="hero-buttons"><button className="btn-primary" onClick={() => document.getElementById('basket')?.scrollIntoView({ behavior: 'smooth' })}>Explore the basket <span>↓</span></button><button className="btn-link" onClick={() => setView('rewards')}>View reward rules <span>↗</span></button></div><div className="hero-meta"><span><b>01</b> Funded buy pool</span><span><b>02</b> Daily snapshot</span><span><b>03</b> Claim or roll over</span></div></div>
      <div className="pool-card"><div className="pool-top"><span>ROUND STATUS</span><span className="status"><i/> PREVIEW ONLY</span></div><div className="pool-total"><span>Next daily buy</span><strong>Not funded</strong><small>Funding and the schedule appear once configured.</small></div><div className="pool-bars"><div><span>AVAILABLE FOR BUY</span><b>—</b><div className="track"><i style={{ width: '0%' }}/></div></div><div><span>ROLLED FROM PRIOR DAYS</span><b>—</b><div className="track muted"><i style={{ width: '0%' }}/></div></div></div><div className="pool-bottom"><span><i className="sol-dot"/> NEAR-denominated treasury</span><span>ON-CHAIN RECEIPTS</span></div><div className="glow-ring ring-a"/><div className="glow-ring ring-b"/></div>
      </section>

      <section className="signal-row"><div><span>BUY LOGIC</span><b>Published basket weights</b></div><div><span>HOLDER SHARE</span><b>Snapshot-based pro rata</b></div><div><span>UNCLAIMED</span><b>Rolls into next pool</b></div><div><span>LIVE STATUS</span><b className="amber">Not funded</b></div></section>

      {view === 'basket' ? <section className="basket-section" id="basket"><div className="section-head"><div><span className="overline">THE DAILY BASKET</span><h2>Choose what the pool tracks.</h2></div><p>Projects remain a draft watchlist until the treasury, buy execution, and holder snapshot services are configured.</p></div>
        <div className="basket-layout"><div className="project-list"><div className="table-head"><span>PROJECT / TOKEN ACCOUNT</span><span>PAIR</span><span>IN BASKET</span></div>{projects.map(project => <article className="project-row" key={project.contract}><span className="project-icon">{project.ticker.slice(0, 1)}</span><div className="project-info"><b>{project.name} <small>${project.ticker}</small></b><code>{project.contract}</code></div><span className="pair-chip">{project.pair}</span><button className={`toggle ${project.selected ? 'on' : ''}`} aria-label={`Toggle ${project.name}`} onClick={() => toggle(project.contract)}><i/></button></article>)}{projects.length === 0 && <div className="list-empty">Add a NEAR token account to start a watchlist.</div>}
          <form className="add-project" onSubmit={addProject}><div className="add-copy"><b>Add a NEAR project</b><span>Track a NEP-141 token account in your draft basket.</span></div><input aria-label="Project name" placeholder="Project name" value={name} onChange={e => setName(e.target.value)} required/><input aria-label="NEAR token account" placeholder="token-account.near" value={contract} onChange={e => setContract(e.target.value)} required/><button type="submit">Add <span>＋</span></button></form>
        </div><aside className="allocation"><div className="allocation-top"><span>DAILY BUY PREVIEW</span><span>LOCAL</span></div><label>Draft pool size <div className="amount"><input type="number" min="0" step="1" value={poolNear} onChange={e => setPoolNear(Number(e.target.value))}/><span>NEAR</span></div></label><div className="allocation-stat"><span>Selected projects</span><b>{allocated}</b></div><div className="allocation-stat"><span>Equal-weight per project</span><b>{allocated ? previewAmount.toFixed(2) : '0.00'} <small>NEAR</small></b></div><div className="allocation-note"><span>ⓘ</span> Preview math only. No wallet, quote, swap, or treasury is connected.</div><button className="allocation-cta" onClick={() => setNotice('Treasury funding and on-chain buy execution are not configured yet.')}>Review basket <span>↗</span></button></aside></div>
      </section> : <section className="basket-section" id="basket"><div className="section-head"><div><span className="overline">HOLDER REWARDS</span><h2>Claim each day. Roll the rest.</h2></div><p>Daily allocations are recorded against a holder snapshot. Unclaimed rewards stay attributed and roll into the next pool, never silently disappear.</p></div><div className="reward-grid"><article><span className="reward-num">01</span><h3>Snapshot</h3><p>At the published cutoff, record eligible balances for each selected token.</p></article><article><span className="reward-num">02</span><h3>Allocate</h3><p>Split each day’s realized buys pro rata across the eligible snapshot.</p></article><article><span className="reward-num">03</span><h3>Claim or carry</h3><p>Holders claim on site. Unclaimed amounts remain in the next reward cycle.</p></article></div><div className="claim-box"><div><span className="overline">YOUR CLAIMS</span><h3>No claim available</h3><p>Connect a wallet after the pool is funded and a verified snapshot is published.</p></div><button className="btn-primary" onClick={() => setNotice('No on-chain claim service is configured yet.')}>Connect to view claims <span>↗</span></button></div></section>}

      <section className="rules" id="rules"><div className="rules-copy"><span className="overline">THE ACCOUNTING</span><h2>Every unit accounted for.</h2><p>Buys, snapshots, entitlements, claims, and carry-forward amounts should be visible by round. A holder’s claim is based on a fixed snapshot; later trading does not rewrite a completed round.</p></div><div className="rules-list"><div><span>Daily pool input</span><b>Treasury-funded NEAR</b></div><div><span>Buy outcome</span><b>Selected NEAR project tokens</b></div><div><span>Claim window</span><b>Daily, after snapshot</b></div><div><span>Unclaimed share</span><b>Rolled into next pool</b></div><div><span>Live execution</span><b className="amber">Disabled in this build</b></div></div></section>
      <section className="next-step"><div><span className="overline">NEXT STEP</span><h2>Make the first round verifiable.</h2><p>Before mainnet, wire a treasury signer, published project allowlist, holder indexer, and a claim ledger with replay protection. Keep each buy and distribution linked to its settlement receipt.</p></div><a href="https://docs.near.org/tutorials/intents/introduction" target="_blank" rel="noreferrer">NEAR Intents developer docs <span>↗</span></a></section>
    </main>
    <footer><a href="#top" className="logo"><span className="logo-mark">n</span><span>near<span>basket</span></span></a><span>Independent project preview • Not affiliated with NEAR Foundation or Nearly</span><span>© 2026 NEAR BASKET</span></footer>
    {notice && <div className="notice" role="status">{notice}<button onClick={() => setNotice('')}>×</button></div>}
  </div>
}

export default App
