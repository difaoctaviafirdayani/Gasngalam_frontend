// src/components/Pagination.jsx
export function LoadMoreBtn({ loading, hasMore, onLoadMore }) {
  if (!hasMore) return (
    <p style={{ textAlign: 'center', fontSize: 12, color: 'var(--text4)', padding: '14px 0' }}>
      Semua destinasi sudah ditampilkan ✓
    </p>
  );
  return (
    <div style={{ textAlign: 'center', marginTop: 10, marginBottom: 24 }}>
      <button
        className="btn-secondary"
        onClick={onLoadMore}
        disabled={loading}
        style={{ minWidth: 160 }}
      >
        {loading ? 'Memuat...' : 'Lihat Lebih Banyak'}
      </button>
    </div>
  );
}

export function Pagination({ page, totalPages, onPageChange }) {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);
  return (
    <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 10, marginBottom: 24, flexWrap: 'wrap' }}>
      <button
        className="btn-secondary"
        disabled={page === 1}
        onClick={() => onPageChange(page - 1)}
        style={{ padding: '6px 14px', fontSize: 13 }}
      >← Prev</button>

      {pages.map(p => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          style={{
            padding: '6px 12px',
            borderRadius: 'var(--r-sm)',
            border: '1.5px solid',
            borderColor: p === page ? 'var(--brand)' : 'var(--border)',
            background: p === page ? 'var(--brand)' : 'var(--white)',
            color: p === page ? 'var(--white)' : 'var(--text2)',
            fontWeight: p === page ? 700 : 500,
            cursor: 'pointer',
            fontSize: 13,
            fontFamily: 'Inter,sans-serif',
          }}
        >{p}</button>
      ))}

      <button
        className="btn-secondary"
        disabled={page === totalPages}
        onClick={() => onPageChange(page + 1)}
        style={{ padding: '6px 14px', fontSize: 13 }}
      >Next →</button>
    </div>
  );
}