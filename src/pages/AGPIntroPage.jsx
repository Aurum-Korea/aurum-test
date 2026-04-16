import { useState, useEffect } from 'react';

// ─── Inline FAQ Accordion (Task 6.3) ──────────────────────────────────────────
function FaqAccordion({ items }) {
  const [open, setOpen] = useState(null);
  return (
    <div>
      {items.map((item, i) => (
        <div key={i} style={{ borderBottom: '1px solid rgba(197,165,114,0.15)' }}>
          <button
            onClick={() => setOpen(open === i ? null : i)}
            style={{
              width: '100%', textAlign: 'left', background: 'none', border: 'none',
              padding: '20px 0', cursor: 'pointer', display: 'flex',
              justifyContent: 'space-between', alignItems: 'center', gap: 16,
            }}
          >
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: open === i ? '#c5a572' : '#f5f0e8', fontWeight: open === i ? 600 : 400 }}>
              {item.q}
            </span>
            <span style={{ color: '#c5a572', fontSize: 20, flexShrink: 0, transform: open === i ? 'rotate(45deg)' : 'none', transition: 'transform 0.3s ease', lineHeight: 1 }}>+</span>
          </button>
          <div style={{ maxHeight: open === i ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.35s ease' }}>
            <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 15, color: '#a09080', lineHeight: 1.75, paddingBottom: 20, margin: 0 }}>
              {item.a}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Step data with meta key/value grids ──────────────────────────────────────
const STEPS = [
  {
    num: '01',
    title: '월 적립 설정',
    subtitle: '매월 자동 이체로 시작',
    body: '매달 지정한 날짜에 설정 금액이 자동 이체됩니다. 최소 월 20만원부터 시작할 수 있습니다.',
    meta: [
      { key: '최소 금액', value: '₩200,000/월' },
      { key: '이체일', value: '월 1~28일 선택' },
      { key: '결제', value: 'TossPay/KakaoPay/이체' },
    ],
  },
  {
    num: '02',
    title: '실물 금 매입',
    subtitle: '국제 현물가 기준 즉시 매입',
    body: '이체 완료 후 당일 국제 현물가 기준으로 실물 금 또는 은을 매입합니다.',
    meta: [
      { key: '매입 기준', value: '국제 현물가 + 8%' },
      { key: '매입 시점', value: '이체 당일' },
      { key: '최소 단위', value: '0.01g' },
    ],
  },
  {
    num: '03',
    title: '싱가포르 금고 배분 보관',
    subtitle: 'Malca-Amit FTZ 귀하 명의 등록',
    body: '매입된 금속은 싱가포르 자유무역지대 Malca-Amit 금고에 고객 명의로 배분 보관됩니다.',
    meta: [
      { key: '금고', value: 'Malca-Amit Singapore' },
      { key: '지역', value: '싱가포르 FTZ' },
      { key: '보험', value: "Lloyd's of London" },
    ],
  },
  {
    num: '04',
    title: '보고서 & 투명성',
    subtitle: '매일 업데이트되는 적립 현황',
    body: '대시보드에서 매일 적립량, 현재 시세 기준 자산 가치, 보관 증빙을 확인할 수 있습니다.',
    meta: [
      { key: '업데이트', value: '매일' },
      { key: '증빙', value: '감사 추적 제공' },
      { key: '접근', value: '웹/앱 대시보드' },
    ],
  },
  {
    num: '05',
    title: '인출 또는 배송',
    subtitle: '언제든 실물로 출금 가능',
    body: '보관 중인 실물 금속은 언제든 한국으로 배송 신청하거나 현금화할 수 있습니다.',
    meta: [
      { key: '배송', value: '한국 문 앞까지' },
      { key: '처리', value: '영업일 5~7일' },
      { key: '출금', value: '시세 기준 현금화 가능' },
    ],
  },
];

// ─── FAQ items for bottom of intro page ───────────────────────────────────────
const FAQ_ITEMS = [
  { q: '월 납입 금액을 변경하거나 해지할 수 있나요?', a: '네. 언제든지 대시보드에서 월 납입 금액을 변경하거나 플랜을 일시 중지, 해지할 수 있습니다. 해지 시 보관 중인 실물 금속은 그대로 귀하의 소유입니다.' },
  { q: '최소 가입 금액과 최대 납입 한도는 어떻게 되나요?', a: '최소 월 20만원부터 시작하며, 최대 한도는 없습니다. 티어별 혜택이 달라지며, 월 100만원 이상은 프리미엄 티어로 분류됩니다.' },
  { q: '적립한 금은 실제로 존재하는 실물인가요?', a: '네. 귀하의 AGP 잔고는 싱가포르 Malca-Amit 금고에 실물로 보관된 금속에 1:1 연동됩니다. 혼장이 없으며, 매일 감사 보고서를 제공합니다.' },
  { q: '한국에서 세금 신고가 필요한가요?', a: '현재 해외 실물 귀금속 보유는 한국 내 과세 대상이 아닙니다. 다만 인출 또는 매도 시점에 따라 양도소득세가 적용될 수 있으므로, 세무사와 상담을 권장합니다.' },
  { q: '실물 배송을 요청하면 얼마나 걸리나요?', a: '배송 요청 후 영업일 기준 5~7일 내에 한국 주소로 배송됩니다. 배송비 및 보험료는 주문 시 안내됩니다.' },
];

const T = {
  bg: '#0a0a0a',
  panel: '#141414',
  gold: '#C5A572',
  goldBright: '#E3C187',
  textPrimary: '#f5f0e8',
  textSecondary: '#a09080',
  textMuted: '#6b6b6b',
  border: 'rgba(197,165,114,0.2)',
  borderStrong: 'rgba(197,165,114,0.5)',
  serif: "'Cormorant Garamond', serif",
  sans: "'Outfit', 'Noto Sans KR', sans-serif",
  mono: "'JetBrains Mono', monospace",
};

// ═══════════════════════════════════════════════════════════════════════════════
// AGP INTRO PAGE — Task 6.1: Vertical expand-collapse step panel
// ═══════════════════════════════════════════════════════════════════════════════
export default function AGPIntroPage({ lang, navigate }) {
  const [activeStep, setActiveStep] = useState(0);

  // Task 6.4: Preserve keyboard navigation
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
        setActiveStep(s => Math.min(s + 1, STEPS.length - 1));
      }
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
        setActiveStep(s => Math.max(s - 1, 0));
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div style={{ background: T.bg, minHeight: '90vh', padding: '60px 20px 80px' }}>
      <div style={{ maxWidth: 780, margin: '0 auto' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 48 }}>
          <div>
            <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.25em', color: T.gold, textTransform: 'uppercase', marginBottom: 8 }}>
              AGP는 이렇게 작동합니다
            </div>
            <h1 style={{ fontFamily: T.serif, fontSize: 'clamp(28px,4vw,40px)', fontWeight: 300, color: T.textPrimary, margin: 0 }}>
              5단계 가입 안내
            </h1>
          </div>
          <button
            onClick={() => navigate('agp-enroll')}
            style={{ background: 'none', border: 'none', fontFamily: T.mono, fontSize: 11, letterSpacing: '0.12em', color: T.textMuted, textTransform: 'uppercase', cursor: 'pointer', transition: 'color 0.2s', whiteSpace: 'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.color = T.gold}
            onMouseLeave={e => e.currentTarget.style.color = T.textMuted}
          >
            가입 신청 바로가기 →
          </button>
        </div>

        {/* Task 6.1: Vertical step panels */}
        <div style={{ marginBottom: 56 }}>
          {STEPS.map((step, i) => {
            const isActive = activeStep === i;
            return (
              <div key={i} style={{ borderBottom: `1px solid ${T.border}` }}>
                {/* Step header row — always visible, clickable */}
                <div
                  onClick={() => setActiveStep(isActive ? -1 : i)}
                  style={{ display: 'flex', alignItems: 'center', gap: 18, padding: '22px 0', cursor: 'pointer' }}
                >
                  {/* Step number circle */}
                  <div style={{
                    width: 34, height: 34, borderRadius: '50%', flexShrink: 0,
                    background: isActive ? T.gold : 'transparent',
                    border: isActive ? `2px solid ${T.gold}` : '1px solid #282828',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontFamily: T.mono, fontSize: 11, fontWeight: 700,
                    color: isActive ? '#0a0a0a' : '#555',
                    transition: 'all 0.3s ease',
                  }}>
                    {step.num}
                  </div>
                  {/* Title + subtitle */}
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: T.serif, fontSize: 20, color: isActive ? T.textPrimary : '#8a8070', fontWeight: 400, lineHeight: 1.2, transition: 'color 0.3s' }}>
                      {step.title}
                    </div>
                    {!isActive && (
                      <div style={{ fontFamily: T.sans, fontSize: 12, color: T.textMuted, marginTop: 2 }}>
                        {step.subtitle}
                      </div>
                    )}
                  </div>
                  {/* Chevron */}
                  <div style={{ color: T.gold, fontSize: 16, transform: isActive ? 'rotate(90deg)' : 'none', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                    ›
                  </div>
                </div>

                {/* Task 6.1: Detail panel — animated max-height */}
                <div style={{ maxHeight: isActive ? '400px' : '0', overflow: 'hidden', transition: 'max-height 0.4s ease' }}>
                  <div style={{ padding: '0 0 28px 52px' }}>
                    {/* Subtitle when active */}
                    <div style={{ fontFamily: T.sans, fontSize: 12, color: T.gold, letterSpacing: '0.08em', marginBottom: 12, textTransform: 'uppercase' }}>
                      {step.subtitle}
                    </div>
                    {/* Body text */}
                    <p style={{ fontFamily: T.sans, fontSize: 15, color: T.textSecondary, lineHeight: 1.75, margin: '0 0 20px' }}>
                      {step.body}
                    </p>
                    {/* Meta grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
                      {step.meta.map((m, j) => (
                        <div key={j} style={{ background: 'rgba(197,165,114,0.04)', border: '1px solid rgba(197,165,114,0.12)', borderRadius: 6, padding: '10px 12px' }}>
                          <div style={{ fontFamily: T.sans, fontSize: 9, color: T.gold, letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: 4 }}>{m.key}</div>
                          <div style={{ fontFamily: T.mono, fontSize: 12, color: T.textPrimary }}>{m.value}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Task 6.2: Navigation dots (circular, replaces progress bars) */}
        <div style={{ display: 'flex', gap: 10, justifyContent: 'center', alignItems: 'center', marginBottom: 48 }}>
          {STEPS.map((_, i) => (
            <div
              key={i}
              onClick={() => setActiveStep(i)}
              style={{
                width: 8, height: 8, borderRadius: '50%',
                background: activeStep === i ? T.gold : '#282828',
                border: activeStep === i ? `1px solid ${T.gold}` : '1px solid #333',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                transform: activeStep === i ? 'scale(1.3)' : 'scale(1)',
              }}
            />
          ))}
        </div>

        {/* Task 6.4: Preserve original CTA buttons */}
        <div style={{ display: 'flex', gap: 12, flexDirection: 'column', alignItems: 'stretch', marginBottom: 64 }}>
          <button
            onClick={() => navigate('agp-enroll')}
            style={{ background: T.gold, color: '#0a0a0a', border: `1px solid ${T.gold}`, padding: '16px', fontFamily: T.sans, fontSize: 16, fontWeight: 700, cursor: 'pointer', width: '100%', borderRadius: 4, transition: 'all 0.2s' }}
            onMouseEnter={e => e.currentTarget.style.background = T.goldBright}
            onMouseLeave={e => e.currentTarget.style.background = T.gold}
          >
            AGP 가입하기
          </button>
          <button
            onClick={() => navigate('agp-report')}
            style={{ background: 'transparent', color: T.textPrimary, border: `1px solid ${T.borderStrong}`, padding: '16px', fontFamily: T.sans, fontSize: 16, fontWeight: 500, cursor: 'pointer', width: '100%', borderRadius: 4, transition: 'all 0.2s' }}
          >
            오늘의 백업 리포트
          </button>
        </div>

        {/* Task 6.3: AGP FAQ at bottom */}
        <div>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.25em', color: T.gold, textTransform: 'uppercase', marginBottom: 6 }}>자주 묻는 질문</div>
          <h2 style={{ fontFamily: T.serif, fontSize: 'clamp(24px,3vw,32px)', fontWeight: 300, color: T.textPrimary, margin: '0 0 28px' }}>AGP FAQ</h2>
          <FaqAccordion items={FAQ_ITEMS} />
        </div>
      </div>
    </div>
  );
}
