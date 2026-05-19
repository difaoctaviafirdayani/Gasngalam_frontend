// src/components/SkeletonCard.jsx
export function SkeletonCard() {
  return (
    <div className="dest-card" style={{ pointerEvents: 'none' }}>
      <div className="card-img" style={{ background: 'var(--bg)', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
      <div className="card-body">
        <div style={{ height: 13, width: '75%', background: 'var(--bg)', borderRadius: 6, marginBottom: 8, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 11, width: '50%', background: 'var(--bg)', borderRadius: 6, marginBottom: 10, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 12, width: '40%', background: 'var(--bg)', borderRadius: 6, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}

export function SkeletonList() {
  return (
    <div className="list-item" style={{ pointerEvents: 'none' }}>
      <div className="list-thumb" style={{ background: 'var(--bg)', borderRadius: 'var(--r-sm)', animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
      <div style={{ flex: 1 }}>
        <div style={{ height: 13, width: '60%', background: 'var(--bg)', borderRadius: 6, marginBottom: 8, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 11, width: '40%', background: 'var(--bg)', borderRadius: 6, marginBottom: 8, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
        <div style={{ height: 11, width: '30%', background: 'var(--bg)', borderRadius: 6, animation: 'skeleton-pulse 1.4s ease-in-out infinite' }} />
      </div>
    </div>
  );
}