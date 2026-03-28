export default function SectionHead({ label, color = 'var(--orange)', style }) {
  return (
    <div className="sh" style={{ color, ...style }}>
      {label}
    </div>
  );
}
