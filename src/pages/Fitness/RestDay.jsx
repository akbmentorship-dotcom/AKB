export default function RestDay() {
  return (
    <div>
      <div className="card" style={{ borderColor: 'var(--purple-border)', background: 'var(--purple-dim)', marginBottom: 16 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 4 }}>
          Recovery
        </div>
        <div style={{ fontSize: 18, fontWeight: 800 }}>Rest Day</div>
        <div style={{ fontSize: 12, color: 'var(--light)', marginTop: 2 }}>Sleep, eat, recover</div>
      </div>

      <div className="card" style={{ textAlign: 'center', padding: 32 }}>
        <div style={{ fontSize: 48, marginBottom: 12 }}>😴</div>
        <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 8 }}>Rest & Recover</div>
        <div style={{ fontSize: 13, color: 'var(--muted)', lineHeight: 1.6 }}>
          Growth happens during recovery.<br />
          Prioritize sleep, nutrition, and mobility work today.
        </div>
      </div>

      <div className="card" style={{ marginTop: 12 }}>
        <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--purple)', marginBottom: 10 }}>
          Recovery Checklist
        </div>
        {['8+ hours of sleep', 'Hit your protein target', '3+ litres of water', 'Light stretching or walk'].map((item, i) => (
          <div key={i} style={{ fontSize: 13, color: 'var(--light)', padding: '6px 0', borderBottom: i < 3 ? '1px solid var(--border)' : 'none' }}>
            {item}
          </div>
        ))}
      </div>
    </div>
  );
}
