import { useState, useEffect } from 'react';

// G-3: 2x3 grid layout for how AGP works (5 items)
const STEPS = [
  {
    icon: '✍️',
    krTitle: '가입',
    desc: '10분 내 온라인으로 가입하고 한국 표준 KYC (실명 확인, 휴대폰 인증)를 완료합니다. 모든 절차는 국내 금융기관 방식에 맞춰 설계되었습니다.',
  },
  {
    icon: '💰',
    krTitle: '입금',
    desc: '토스뱅크·한국 주요 은행에서 일회 또는 월간 자동이체. 신용카드 및 암호화폐 (USDT·USDC) 입금도 지원합니다. 최소 월 20만원부터.',
  },
  {
    icon: '⚖️',
    krTitle: '그램 적립',
    desc: '입금액이 실시간 국제 현물가 + 2.0% 프리미엄으로 AGP 그램으로 전환됩니다. 국내 실물 프리미엄을 피하고 깔끔한 국제 시세에 접근하세요.',
  },
  {
    icon: '📊',
    krTitle: '관리',
    desc: '대시보드에서 보유 그램, KRW 가치, 손익, 보관료, 전환 기준 진행률을 실시간으로 확인하세요. 매일 백킹 리포트 공개.',
  },
  {
    icon: '🥇',
    krTitle: '전환',
    desc: '100g (또는 1,000g 기준) 도달 시 LBMA 승인 실물 바로 무료 전환. 또는 언제든 국제 현물가로 매도 후 KRW를 한국 은행 계좌로 수령.',
  },
];

export default function AGPIntroPage({ lang, navigate }) {
  const ko = lang === 'ko';
  const [step, setStep] = useState(0);

  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [step]);

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      setStep(s => s + 1);
    } else {
      navigate('agp-enroll');
    }
  };
  const handlePrev = () => {
    if (step > 0) setStep(s => s - 1);
  };

  const T = {
    bg: '#0a0a0a',
    panel: '#141414',
    gold: '#C5A572',
    goldBright: '#E3C187',
    goldDim: '#8a7d6b',
    textPrimary: '#f5f0e8',
    textSecondary: '#a09080',
    textMuted: '#6b6b6b',
    border: 'rgba(197, 165, 114, 0.2)',
    borderStrong: 'rgba(197, 165, 114, 0.5)',
    serif: "'Cormorant Garamond', serif",
    sans: "'Outfit', 'Noto Sans KR', sans-serif",
    mono: "'JetBrains Mono', monospace",
  };

  const current = STEPS[step];
  const isLast = step === STEPS.length - 1;

  return (
    <div style={{ background: T.bg, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 20px' }}>
      <div style={{ maxWidth: 880, width: '100%' }}>

        {/* Top row: step counter + SKIP */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 40 }}>
          <span style={{ fontFamily: T.mono, fontSize: 12, letterSpacing: '0.2em', color: T.goldDim }}>
            <span style={{ color: T.gold, fontWeight: 500 }}>{String(step + 1).padStart(2, '0')}</span>
            {' / '}
            <span>05</span>
          </span>
          {/* G-1/G-2: Korean only, no English */}
          <button
            onClick={() => navigate('agp-enroll')}
            style={{ background: 'none', border: 'none', fontFamily: T.mono, fontSize: 11, letterSpacing: '0.15em', color: T.textMuted, textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.3s' }}
            onMouseEnter={e => e.currentTarget.style.color = T.gold}
            onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
          >
            가입 신청 바로가기 →
          </button>
        </div>

        {/* Main card */}
        <div style={{
          background: 'linear-gradient(180deg, #141414 0%, #0a0a0a 100%)',
          border: `1px solid ${T.border}`,
          padding: 'clamp(40px, 8vw, 80px) clamp(24px, 6vw, 60px)',
          minHeight: 480,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}>
          {/* Ambient glow */}
          <div style={{
            position: 'absolute', top: -200, left: '50%', transform: 'translateX(-50%)',
            width: 600, height: 400,
            background: 'radial-gradient(ellipse at center, rgba(197, 165, 114, 0.08), transparent 60%)',
            pointerEvents: 'none',
          }} />

          {/* Eyebrow — G: Korean only */}
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.28em', color: T.gold, textTransform: 'uppercase', marginBottom: 32, position: 'relative' }}>
            AGP는 이렇게 작동합니다
          </div>

          {/* Icon */}
          <div style={{ fontSize: 52, marginBottom: 32, filter: 'drop-shadow(0 0 40px rgba(197, 165, 114, 0.3))', position: 'relative' }}>
            {current.icon}
          </div>

          {/* Korean title only — G: Remove English subtitle */}
          <h2 style={{
            fontFamily: T.serif,
            fontSize: 'clamp(36px, 4.5vw, 52px)',
            fontWeight: 400,
            color: T.textPrimary,
            marginBottom: 32,
            letterSpacing: '-0.01em',
            position: 'relative',
          }}>
            {current.krTitle}
          </h2>

          {/* Description */}
          <p style={{ maxWidth: 560, color: T.textSecondary, fontSize: 16, lineHeight: 1.75, fontFamily: T.sans, position: 'relative' }}>
            {current.desc}
          </p>
        </div>

        {/* Navigation row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 32, gap: 16 }}>
          {/* Previous — Korean only */}
          <button
            onClick={handlePrev}
            disabled={step === 0}
            style={{
              background: 'transparent',
              border: `1px solid ${T.borderStrong}`,
              color: step === 0 ? T.textMuted : T.textPrimary,
              padding: '14px 28px',
              fontFamily: T.sans,
              fontSize: 14,
              letterSpacing: '0.04em',
              cursor: step === 0 ? 'not-allowed' : 'pointer',
              opacity: step === 0 ? 0.35 : 1,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.3s',
            }}
          >
            ← 이전
          </button>

          {/* Progress dots */}
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            {STEPS.map((_, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  width: 32,
                  height: 2,
                  background: i === step ? T.gold : i < step ? T.goldDim : T.border,
                  transition: 'all 0.4s',
                  cursor: 'pointer',
                }}
              />
            ))}
          </div>

          {/* Next — Korean only */}
          <button
            onClick={handleNext}
            style={{
              background: T.gold,
              color: '#0a0a0a',
              border: `1px solid ${T.gold}`,
              padding: '14px 28px',
              fontFamily: T.sans,
              fontSize: 14,
              fontWeight: 500,
              letterSpacing: '0.04em',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              transition: 'all 0.3s',
            }}
            onMouseEnter={e => e.currentTarget.style.background = T.goldBright}
            onMouseLeave={e => e.currentTarget.style.background = T.gold}
          >
            {isLast ? '가입 신청 시작' : '다음'}
          </button>
        </div>

        {/* G-3: 2x3 grid showing all 5 steps at a glance */}
        <div style={{ marginTop: 56, borderTop: `1px solid ${T.border}`, paddingTop: 40 }}>
          <div style={{ fontFamily: T.mono, fontSize: 11, letterSpacing: '0.28em', color: T.gold, textTransform: 'uppercase', marginBottom: 24, textAlign: 'center' }}>
            AGP 전체 단계
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: 16,
          }}>
            {STEPS.map((s, i) => (
              <div
                key={i}
                onClick={() => setStep(i)}
                style={{
                  background: step === i ? 'rgba(197, 165, 114, 0.08)' : '#141414',
                  border: `1px solid ${step === i ? T.borderStrong : T.border}`,
                  padding: '18px 20px',
                  cursor: 'pointer',
                  transition: 'all 0.25s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 14,
                  ...(i === 4 ? { gridColumn: '1 / -1', maxWidth: '50%', margin: '0 auto', width: '100%' } : {}),
                }}
              >
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                <div>
                  <div style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, marginBottom: 4 }}>{String(i + 1).padStart(2, '0')}</div>
                  <div style={{ fontFamily: T.sans, fontSize: 14, color: step === i ? T.textPrimary : T.textSecondary, fontWeight: step === i ? 600 : 400 }}>{s.krTitle}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* G-1: CTA bars - equal width, Korean only */}
        <div style={{ marginTop: 40, display: 'flex', gap: 14, flexDirection: 'column', alignItems: 'stretch' }}>
          {/* F-8: AGP 가입하기 Gold bar - links to AGP Sign Up Page */}
          <button
            onClick={() => navigate('agp-enroll')}
            style={{
              background: T.gold,
              color: '#0a0a0a',
              border: `1px solid ${T.gold}`,
              padding: '16px',
              fontFamily: T.sans,
              fontSize: 16,
              fontWeight: 700,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s',
            }}
          >
            🚀 AGP 가입하기
          </button>
          <button
            onClick={() => navigate('agp-report')}
            style={{
              background: 'transparent',
              color: T.textPrimary,
              border: `1px solid ${T.borderStrong}`,
              padding: '16px',
              fontFamily: T.sans,
              fontSize: 16,
              fontWeight: 500,
              letterSpacing: '0.03em',
              cursor: 'pointer',
              width: '100%',
              transition: 'all 0.3s',
            }}
          >
            📊 오늘의 백업 리포트
          </button>
        </div>
      </div>
    </div>
  );
}
