// Reusable form section wrapper — fades in when active
export default function FormStep({ active, children }) {
  if (!active) return null;
  return (
    <div style={{
      animation: 'fadeSlideIn 0.4s ease',
    }}>
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(10px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
      {children}
    </div>
  );
}
