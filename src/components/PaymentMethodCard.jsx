// Reusable payment method radio tile
export default function PaymentMethodCard({ value, selected, onChange, label, subtitle, badge, fee, children }) {
  const isSelected = selected === value;
  return (
    <div
      onClick={() => onChange(value)}
      style={{
        cursor: 'pointer',
        padding: '20px 18px',
        background: isSelected ? 'rgba(197, 165, 114, 0.07)' : '#1a1814',
        border: `1px solid ${isSelected ? 'rgba(197, 165, 114, 0.5)' : 'rgba(197, 165, 114, 0.15)'}`,
        borderRadius: 8,
        transition: 'all 0.25s ease',
        userSelect: 'none',
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, letterSpacing: '0.15em', color: isSelected ? '#C5A572' : '#8a7d6b', textTransform: 'uppercase', marginBottom: 8 }}>
        {badge}
      </div>
      <div style={{ fontFamily: "'Noto Sans KR', 'Outfit', sans-serif", fontWeight: 500, color: '#f5f0e8', fontSize: 15, marginBottom: 4 }}>
        {label}
      </div>
      <div style={{ fontFamily: "'Cormorant Garamond', serif", fontStyle: 'italic', color: '#8a7d6b', fontSize: 13, marginBottom: 10 }}>
        {subtitle}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: '#C5A572', paddingTop: 10, borderTop: '1px dashed rgba(197, 165, 114, 0.2)' }}>
        {fee}
      </div>
      {isSelected && children && (
        <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(197, 165, 114, 0.2)' }}>
          {children}
        </div>
      )}
    </div>
  );
}
