import s from "./Management.module.css";
export function ManagementSkeleton({ compact = false }: { compact?: boolean }) {
  return <div className={s.skeletonPage} role="status" aria-label="Carregando página"><span className={s.srOnly}>Carregando a gestão…</span><div aria-hidden="true"><div className={s.skeletonHeading}><i /><i /></div>{!compact && <div className={s.skeletonMetrics}>{Array.from({length:4},(_,i)=><div key={i}><i /><i /><i /></div>)}</div>}<div className={s.skeletonColumns}><div className={s.skeletonPanel}>{Array.from({length:5},(_,i)=><i key={i} />)}</div><div className={s.skeletonPanel}>{Array.from({length:4},(_,i)=><i key={i} />)}</div></div></div></div>;
}
