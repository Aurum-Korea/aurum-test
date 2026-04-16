import { useState } from 'react';
import FormStep from '../components/FormStep';
import PaymentMethodCard from '../components/PaymentMethodCard';
import ConsentCheckbox from '../components/ConsentCheckbox';

const T = {
  bg: '#0a0a0a',
  bgPanel: '#111008',
  bgField: '#1a1814',
  gold: '#C5A572',
  goldBright: '#E3C187',
  goldDim: '#8a7d6b',
  textPrimary: '#f5f0e8',
  textSecondary: '#a8a096',
  textMuted: '#6b655d',
  border: 'rgba(197, 165, 114, 0.2)',
  borderStrong: 'rgba(197, 165, 114, 0.5)',
  serif: "'Cormorant Garamond', serif",
  sans: "'Outfit', 'Noto Sans KR', sans-serif",
  mono: "'JetBrains Mono', monospace",
  krDisplay: "'Noto Serif KR', serif",
};

// F-1: Compact progress bar — replaces sidebar entirely
function ProgressBar({ section }) {
  const steps = [
    { num: '01', kr: '본인 정보' },
    { num: '02', kr: '투자자 프로필' },
    { num: '03', kr: '플랜 설계' },
    { num: '04', kr: '결제 수단' },
    { num: '05', kr: '약관 동의' },
    { num: '06', kr: '검토 제출' },
  ];
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 0, marginBottom: 40, overflowX: 'auto', paddingBottom: 4, width: '100%' }}>
      {steps.map((s, i) => {
        const n = i + 1;
        const isActive = section === n;
        const isDone = section > n;
        return (
          <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 5 }}>
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: isActive ? T.gold : isDone ? 'rgba(197,165,114,0.3)' : '#1a1814',
                border: isActive ? `2px solid ${T.gold}` : isDone ? `2px solid ${T.goldDim}` : `1px solid ${T.border}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: T.mono, fontSize: 10, fontWeight: 700,
                color: isActive ? '#0a0a0a' : isDone ? T.gold : T.textMuted,
                flexShrink: 0,
              }}>
                {isDone ? '✓' : s.num}
              </div>
              <span style={{ fontFamily: T.sans, fontSize: 9, color: isActive ? T.gold : T.textMuted, whiteSpace: 'nowrap', letterSpacing: '0.02em' }}>{s.kr}</span>
            </div>
            {i < steps.length - 1 && (
              <div style={{ width: 28, height: 1, background: isDone ? T.goldDim : T.border, margin: '0 4px', marginBottom: 18, flexShrink: 0 }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

const fieldStyle = {
  width: '100%',
  background: T.bgField,
  border: `1px solid ${T.border}`,
  padding: '13px 14px',
  color: T.textPrimary,
  fontFamily: T.sans,
  fontSize: 14,
  outline: 'none',
  boxSizing: 'border-box',
  borderRadius: 4,
};
const labelStyle = {
  display: 'block',
  fontFamily: T.sans,
  fontSize: 13,
  color: T.textPrimary,
  fontWeight: 500,
  marginBottom: 6,
};
const btnPrimary = {
  background: T.gold, color: '#0a0a0a', border: 'none',
  padding: '14px 28px', fontFamily: T.sans, fontSize: 15,
  fontWeight: 600, cursor: 'pointer', borderRadius: 4,
};
const btnSecondary = {
  background: 'transparent', color: T.textPrimary,
  border: `1px solid ${T.borderStrong}`, padding: '13px 24px',
  fontFamily: T.sans, fontSize: 14, cursor: 'pointer', borderRadius: 4,
};

export default function AGPEnrollPage({ lang, navigate }) {
  const ko = lang === 'ko';
  const [section, setSection] = useState(1);
  const [submitted, setSubmitted] = useState(false);

  const [form, setForm] = useState({
    nameKr: '', nameEn: '', rrn: '', nationality: 'KR', phone: '', email: '',
    zipcode: '', address: '', addressDetail: '', passVerified: false,
    occupation: '', income: '', sourceOfFunds: '', expectedMonthly: '',
    pep: 'no', fatca: 'no',
    composition: 'gold100', monthlyAmount: '500000', frequency: 'monthly',
    startDate: '', conversionTarget: '100g',
    payMethod: 'toss', bank: '', accountNum: '', accountVerified: false,
    cardNum: '', cardExpiry: '', cardCvc: '', cardName: '',
    cryptoCoin: 'USDT', cryptoNetwork: 'TRC20', cryptoWallet: '',
    consentAll: false, consent1: false, consent2: false, consent3: false,
    consent4: false, consent5: false, consent6: false,
  });

  const update = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));
  const set = (field, val) => setForm(f => ({ ...f, [field]: val }));
  const next = () => { if (section < 6) setSection(s => s + 1); else setSubmitted(true); };
  const prev = () => { if (section > 1) setSection(s => s - 1); };
  const gotoSection = (n) => setSection(n);
  const toggleAll = (val) => setForm(f => ({
    ...f, consentAll: val, consent1: val, consent2: val,
    consent3: val, consent4: val, consent5: val, consent6: val,
  }));

  // Fee helpers for F-5 / F-6 / F-7
  const monthly = parseInt(form.monthlyAmount || 0);
  const storageFeeKrw = Math.round(monthly * 12 * 0.003 / 12);
  const txFeeRate = form.payMethod === 'card' ? 0.055 : form.payMethod === 'crypto' ? 0.025 : 0.003;
  const txFeeKrw = Math.round(monthly * txFeeRate);
  const totalMonthly = monthly + storageFeeKrw + txFeeKrw;

  const selDropStyle = {
    ...fieldStyle,
    appearance: 'none',
    backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8'><path d='M1 1l5 5 5-5' stroke='%23C5A572' fill='none' stroke-width='1.5'/></svg>")`,
    backgroundRepeat: 'no-repeat',
    backgroundPosition: 'right 14px center',
    paddingRight: 36,
  };

  if (submitted) return (
    <div style={{ background: T.bg, minHeight: '90vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '60px 20px' }}>
      <div style={{ maxWidth: 580, width: '100%', textAlign: 'center', padding: '64px 40px 52px', background: T.bgPanel, border: `1px solid ${T.borderStrong}`, position: 'relative', overflow: 'hidden', borderRadius: 8 }}>
        <div style={{ position: 'absolute', top: -80, left: '50%', transform: 'translateX(-50%)', width: 400, height: 240, background: 'radial-gradient(ellipse, rgba(197,165,114,0.1), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ width: 72, height: 72, border: `1px solid ${T.gold}`, borderRadius: '50%', margin: '0 auto 24px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: T.gold, fontSize: 28 }}>✓</div>
        <h3 style={{ fontFamily: T.krDisplay, fontSize: 28, fontWeight: 600, color: T.textPrimary, marginBottom: 16 }}>신청이 접수되었습니다</h3>
        <p style={{ color: T.textSecondary, maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.75, fontSize: 14 }}>
          확인 이메일을 다음 주소로 발송했습니다. 이메일 내 확인 링크를 클릭하면 KYC 심사가 시작됩니다. 영업일 기준 24시간 내에 결과를 알려드립니다.
        </p>
        <div style={{ fontFamily: T.mono, fontSize: 13, color: T.gold, padding: '10px 16px', background: 'rgba(197,165,114,0.07)', border: `1px solid ${T.border}`, display: 'inline-block', marginBottom: 28 }}>
          {form.email || 'you@example.com'}
        </div>
        <div style={{ textAlign: 'left', maxWidth: 400, margin: '0 auto 28px' }}>
          {[
            ['이메일 확인', '수신함에서 Aurum 확인 메일을 열어 링크를 클릭하세요.'],
            ['KYC 심사', '신분증과 PASS 인증 기준 24시간 내 승인됩니다.'],
            ['첫 자동이체', '승인 후 설정하신 시작일에 첫 입금이 진행됩니다.'],
            ['대시보드', '그램 적립, 현물가, 보관료, 전환 진행률을 실시간으로 확인하세요.'],
          ].map(([title, body], i) => (
            <div key={i} style={{ display: 'flex', gap: 14, paddingBottom: 14, color: T.textSecondary, fontSize: 13 }}>
              <span style={{ fontFamily: T.mono, color: T.gold, fontWeight: 500, flexShrink: 0 }}>{String(i+1).padStart(2,'0')}</span>
              <p style={{ margin: 0, lineHeight: 1.6 }}><strong style={{ color: T.textPrimary, fontWeight: 500 }}>{title}.</strong> {body}</p>
            </div>
          ))}
        </div>
        <button onClick={() => navigate('home')} style={btnSecondary}>홈으로 돌아가기</button>
      </div>
    </div>
  );

  return (
    <div style={{ background: T.bg, minHeight: '90vh', padding: '60px 20px 80px' }}>
      {/* F-1/F-2: Single column layout, no sidebar. Progress bar at top. */}
      <div style={{ maxWidth: 680, margin: '0 auto' }}>

        <div style={{ marginBottom: 8 }}>
          <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.28em', color: T.gold, textTransform: 'uppercase', marginBottom: 6 }}>AGP 가입 신청</div>
          <h2 style={{ fontFamily: T.krDisplay, fontSize: 26, color: T.textPrimary, marginBottom: 28, fontWeight: 600 }}>신규 가입</h2>
        </div>

        {/* Compact top progress bar */}
        <ProgressBar section={section} />

        {/* Form card */}
        <div style={{ background: T.bgPanel, border: `1px solid ${T.border}`, padding: 'clamp(24px, 5vw, 44px)', borderRadius: 8 }}>

          {/* SECTION 1: 본인 정보 */}
          <FormStep active={section === 1}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>본인 정보</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              한국 금융실명법에 따라 실명 확인이 필요합니다. 모든 정보는 암호화 전송·저장되며 KYC 심사에만 사용됩니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>성명 (한글) <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="홍길동" value={form.nameKr} onChange={update('nameKr')} />
              </div>
              <div>
                <label style={labelStyle}>영문 성명 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="HONG GIL DONG" value={form.nameEn} onChange={update('nameEn')} />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>주민등록번호 앞 7자리 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="YYMMDD-N" maxLength={8} value={form.rrn} onChange={update('rrn')} inputMode="numeric" />
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 5, fontFamily: T.sans }}>실명 확인에만 사용 · 뒷자리는 저장하지 않습니다</p>
              </div>
              <div>
                <label style={labelStyle}>국적 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <select style={selDropStyle} value={form.nationality} onChange={update('nationality')}>
                  <option value="KR">대한민국</option>
                  <option value="OTHER">기타</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>휴대폰 번호 본인 인증 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10 }}>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="tel" placeholder="010-0000-0000" value={form.phone} onChange={update('phone')} />
                <button onClick={() => { set('passVerified', true); alert('PASS 인증 성공 (mock)'); }} style={{ background: form.passVerified ? T.gold : 'transparent', color: form.passVerified ? '#0a0a0a' : T.gold, border: `1px solid ${T.gold}`, padding: '0 16px', fontFamily: T.mono, fontSize: 12, cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: 4 }}>
                  {form.passVerified ? '✓ 인증완료' : 'PASS 인증'}
                </button>
              </div>
              <p style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>PASS 앱 또는 문자 인증으로 본인 확인을 진행합니다</p>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>이메일 주소 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <input style={fieldStyle} type="email" placeholder="you@example.com" value={form.email} onChange={update('email')} />
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>주소 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 10, marginBottom: 8 }}>
                <input style={fieldStyle} type="text" placeholder="우편번호" value={form.zipcode} readOnly />
                <button style={{ background: 'transparent', color: T.gold, border: `1px solid ${T.gold}`, padding: '0 14px', fontFamily: T.mono, fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>주소 검색</button>
              </div>
              <input style={{ ...fieldStyle, marginBottom: 8 }} type="text" placeholder="기본 주소" value={form.address} readOnly />
              <input style={fieldStyle} type="text" placeholder="상세 주소 (동·호수 등)" value={form.addressDetail} onChange={update('addressDetail')} />
            </div>

            <div style={{ marginBottom: 24 }}>
              <label style={labelStyle}>신분증 업로드 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ border: `1px dashed ${T.borderStrong}`, padding: '24px 16px', textAlign: 'center', background: 'rgba(197,165,114,0.03)', cursor: 'pointer', borderRadius: 4 }}>
                <div style={{ fontSize: 22, color: T.gold, marginBottom: 6 }}>⬆</div>
                <div style={{ color: T.textPrimary, fontSize: 13, marginBottom: 4 }}>주민등록증 앞·뒷면 또는 여권 업로드</div>
                <div style={{ color: T.textMuted, fontSize: 11 }}>JPG, PNG, PDF · 최대 10MB</div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
              <button style={btnSecondary} onClick={() => navigate('agp-intro')}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 →</button>
            </div>
          </FormStep>

          {/* SECTION 2: 투자자 프로필 */}
          <FormStep active={section === 2}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>투자자 프로필</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              자금세탁방지(AML) 및 FATCA 규정 준수를 위한 기본 정보입니다. 답변은 계정 한도 설정에 사용됩니다.
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>직업 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="text" placeholder="예: 회사원, 자영업, 전문직" value={form.occupation} onChange={update('occupation')} />
              </div>
              <div>
                <label style={labelStyle}>연소득 범위 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <select style={selDropStyle} value={form.income} onChange={update('income')}>
                  <option value="">선택</option>
                  <option value="under30m">3천만원 이하</option>
                  <option value="30m-70m">3천만원 ~ 7천만원</option>
                  <option value="70m-150m">7천만원 ~ 1.5억원</option>
                  <option value="150m-300m">1.5억원 ~ 3억원</option>
                  <option value="over300m">3억원 이상</option>
                </select>
              </div>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>자금의 출처 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <select style={selDropStyle} value={form.sourceOfFunds} onChange={update('sourceOfFunds')}>
                <option value="">선택</option>
                <option value="employment">근로 소득</option>
                <option value="business">사업 소득</option>
                <option value="investment">투자 수익</option>
                <option value="inheritance">상속 · 증여</option>
                <option value="retirement">퇴직금</option>
                <option value="other">기타</option>
              </select>
            </div>

            <div style={{ marginBottom: 18 }}>
              <label style={labelStyle}>예상 월 적립액 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <select style={selDropStyle} value={form.expectedMonthly} onChange={update('expectedMonthly')}>
                <option value="20-50">20만원 ~ 50만원</option>
                <option value="50-100">50만원 ~ 100만원</option>
                <option value="100-300">100만원 ~ 300만원</option>
                <option value="300-1000">300만원 ~ 1,000만원</option>
                <option value="over1000">1,000만원 이상</option>
              </select>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>정치적 노출 인물(PEP) 여부 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ val: 'no', kr: '해당 없음' }, { val: 'yes', kr: '해당' }].map(opt => (
                    <div key={opt.val} onClick={() => set('pep', opt.val)} style={{ cursor: 'pointer', padding: '12px 14px', background: form.pep === opt.val ? 'rgba(197,165,114,0.08)' : T.bgField, border: `1px solid ${form.pep === opt.val ? T.gold : T.border}`, borderRadius: 4, transition: 'all 0.2s', fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14, textAlign: 'center' }}>{opt.kr}</div>
                  ))}
                </div>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>미국 세법 거주자(FATCA) <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                  {[{ val: 'no', kr: '아니오' }, { val: 'yes', kr: '예' }].map(opt => (
                    <div key={opt.val} onClick={() => set('fatca', opt.val)} style={{ cursor: 'pointer', padding: '12px 14px', background: form.fatca === opt.val ? 'rgba(197,165,114,0.08)' : T.bgField, border: `1px solid ${form.fatca === opt.val ? T.gold : T.border}`, borderRadius: 4, transition: 'all 0.2s', fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 14, textAlign: 'center' }}>{opt.kr}</div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 →</button>
            </div>
          </FormStep>

          {/* SECTION 3: AGP 플랜 설계 */}
          <FormStep active={section === 3}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>AGP 플랜 설계</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              자산 구성, 적립액, 주기, 전환 목표를 설정하세요. 모든 설정은 가입 후 대시보드에서 언제든 변경 가능합니다.
            </p>

            <div style={{ marginBottom: 18 }}>
              <label style={{ ...labelStyle, marginBottom: 10 }}>자산 구성 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10 }}>
                {[
                  { val: 'gold100', kr: '금 100%', detail: '가장 전통적 · 변동성 낮음' },
                  { val: 'silver100', kr: '은 100%', detail: '공급 부족 · 산업 수요' },
                  { val: 'gold70', kr: '금 70% · 은 30%', detail: '안정 + 성장 균형' },
                  { val: 'custom', kr: '직접 설정', detail: '대시보드에서 조정' },
                ].map(opt => (
                  <div key={opt.val} onClick={() => set('composition', opt.val)} style={{ cursor: 'pointer', padding: '14px 12px', background: form.composition === opt.val ? 'rgba(197,165,114,0.07)' : T.bgField, border: `1px solid ${form.composition === opt.val ? T.gold : T.border}`, boxShadow: form.composition === opt.val ? `0 0 0 2px rgba(197,165,114,0.12)` : 'none', transition: 'all 0.2s', borderRadius: 4 }}>
                    <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 13, marginBottom: 4 }}>{opt.kr}</div>
                    <div style={{ color: T.textSecondary, fontSize: 11, lineHeight: 1.4 }}>{opt.detail}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 18 }}>
              <div>
                <label style={labelStyle}>월 적립액 (원) <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" value={form.monthlyAmount} onChange={update('monthlyAmount')} inputMode="numeric" />
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>최소 200,000원 · 최대 10,000,000원</p>
              </div>
              <div>
                <label style={{ ...labelStyle, marginBottom: 10 }}>적립 주기 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                  {[{ val: 'daily', kr: '매일' }, { val: 'weekly', kr: '매주' }, { val: 'monthly', kr: '매월' }].map(opt => (
                    <div key={opt.val} onClick={() => set('frequency', opt.val)} style={{ cursor: 'pointer', padding: '11px 8px', textAlign: 'center', background: form.frequency === opt.val ? 'rgba(197,165,114,0.07)' : T.bgField, border: `1px solid ${form.frequency === opt.val ? T.gold : T.border}`, transition: 'all 0.2s', borderRadius: 4 }}>
                      <div style={{ fontFamily: T.sans, fontWeight: 500, color: T.textPrimary, fontSize: 13 }}>{opt.kr}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 14, marginBottom: 24 }}>
              <div>
                <label style={labelStyle}>시작일 <span style={{ color: T.gold, fontSize: 11 }}>필수</span></label>
                <input style={fieldStyle} type="date" value={form.startDate} onChange={update('startDate')} />
              </div>
              <div>
                <label style={labelStyle}>자동 전환 목표</label>
                <select style={selDropStyle} value={form.conversionTarget} onChange={update('conversionTarget')}>
                  <option value="100g">100g 도달 시 전환</option>
                  <option value="1kg">1kg 도달 시 전환</option>
                  <option value="manual">수동 결정</option>
                </select>
                <p style={{ fontSize: 11, color: T.textMuted, marginTop: 5 }}>전환은 무료 · 언제든 변경 가능</p>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 →</button>
            </div>
          </FormStep>

          {/* SECTION 4: 결제 수단 — F-4 cleanup */}
          <FormStep active={section === 4}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>결제 수단</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              세 가지 방식으로 AGP에 자금을 입금할 수 있습니다. 토스뱅크 자동이체가 수수료가 가장 낮고 권장 방식입니다.
            </p>

            {/* F-4: Equal-width payment boxes, Korean only, normalized fees */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginBottom: 28 }}>
              {[
                { val: 'toss', icon: '💙', label: '토스뱅크 자동이체', fee: '수수료 0.3%', badge: '권장' },
                { val: 'card', icon: '💳', label: '신용·체크카드', fee: '수수료 5.5%', badge: null },
                { val: 'crypto', icon: '🔷', label: '암호화폐 (USDT·USDC)', fee: '수수료 2.5%', badge: null },
              ].map(m => (
                <div key={m.val} onClick={() => set('payMethod', m.val)} style={{ cursor: 'pointer', background: form.payMethod === m.val ? 'rgba(197,165,114,0.07)' : T.bgField, border: `1.5px solid ${form.payMethod === m.val ? T.gold : T.border}`, borderRadius: 6, padding: '16px 18px', transition: 'all 0.2s', position: 'relative' }}>
                  {m.badge && <span style={{ position: 'absolute', top: 12, right: 12, background: T.gold, color: '#0a0a0a', fontSize: 10, padding: '2px 8px', borderRadius: 3, fontWeight: 700, fontFamily: T.sans }}>{m.badge}</span>}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 20 }}>{m.icon}</span>
                    <div>
                      <div style={{ fontFamily: T.sans, fontSize: 15, fontWeight: 600, color: T.textPrimary, marginBottom: 3 }}>{m.label}</div>
                      <div style={{ fontFamily: T.mono, fontSize: 13, color: T.gold }}>{m.fee}</div>
                    </div>
                  </div>
                  {/* Toss: bank account verification */}
                  {form.payMethod === 'toss' && m.val === 'toss' && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, marginBottom: 10 }}>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12, color: T.textMuted }}>은행 선택</label>
                          <select style={{ ...selDropStyle, fontSize: 13 }} value={form.bank} onChange={update('bank')}>
                            {['토스뱅크','카카오뱅크','KB국민은행','신한은행','우리은행','하나은행','IBK기업은행','NH농협은행','기타'].map(b => <option key={b}>{b}</option>)}
                          </select>
                        </div>
                        <div>
                          <label style={{ ...labelStyle, fontSize: 12, color: T.textMuted }}>계좌번호</label>
                          <input style={{ ...fieldStyle, fontFamily: T.mono, fontSize: 13 }} type="text" placeholder="0000-00-0000000" value={form.accountNum} onChange={update('accountNum')} inputMode="numeric" />
                        </div>
                      </div>
                      <button onClick={e => { e.stopPropagation(); set('accountVerified', true); alert('1원 송금 인증 성공 (mock)'); }} style={{ background: form.accountVerified ? 'rgba(74,222,128,0.07)' : 'transparent', color: form.accountVerified ? '#4ade80' : T.textPrimary, border: `1px solid ${form.accountVerified ? '#4ade80' : T.borderStrong}`, padding: '10px 16px', fontFamily: T.mono, fontSize: 12, cursor: 'pointer', borderRadius: 4 }}>
                        {form.accountVerified ? '✓ 계좌 인증 완료' : '1원 송금으로 계좌 인증'}
                      </button>
                    </div>
                  )}
                  {/* Card: card fields */}
                  {form.payMethod === 'card' && m.val === 'card' && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                      <input style={{ ...fieldStyle, fontFamily: T.mono, marginBottom: 10 }} type="text" placeholder="카드 번호 (0000-0000-0000-0000)" value={form.cardNum} onChange={update('cardNum')} />
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="MM/YY" value={form.cardExpiry} onChange={update('cardExpiry')} />
                        <input style={{ ...fieldStyle, fontFamily: T.mono }} type="text" placeholder="CVC" value={form.cardCvc} onChange={update('cardCvc')} />
                        <input style={fieldStyle} type="text" placeholder="카드 소유자명" value={form.cardName} onChange={update('cardName')} />
                      </div>
                    </div>
                  )}
                  {/* Crypto */}
                  {form.payMethod === 'crypto' && m.val === 'crypto' && (
                    <div style={{ marginTop: 14, paddingTop: 14, borderTop: `1px solid ${T.border}` }}>
                      <p style={{ fontSize: 12, color: '#f87171', marginBottom: 10, fontFamily: T.sans }}>⚠️ 암호화폐는 자동 반복 결제가 불가합니다. 매 주기마다 고유 입금 주소가 이메일로 전송됩니다.</p>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 10 }}>
                        <select style={{ ...selDropStyle, fontSize: 13 }} value={form.cryptoCoin} onChange={update('cryptoCoin')}>
                          <option value="USDT">USDT</option>
                          <option value="USDC">USDC</option>
                        </select>
                        <select style={{ ...selDropStyle, fontSize: 13 }} value={form.cryptoNetwork} onChange={update('cryptoNetwork')}>
                          <option value="TRC20">TRC20 (권장)</option>
                          <option value="ERC20">ERC20</option>
                          <option value="Polygon">Polygon</option>
                        </select>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 →</button>
            </div>
          </FormStep>

          {/* SECTION 5: 약관 동의 */}
          <FormStep active={section === 5}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>약관 동의</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              필수 항목은 서비스 제공을 위해 반드시 동의가 필요합니다. 선택 항목은 마케팅 메일 수신 여부만 결정합니다.
            </p>

            <div style={{ borderTop: `1px solid ${T.borderStrong}`, borderBottom: `1px solid ${T.borderStrong}`, marginBottom: 8, padding: '16px 0' }}>
              <ConsentCheckbox checked={form.consentAll} onChange={toggleAll} label="전체 약관에 동의합니다" required={false} />
            </div>
            <div style={{ marginBottom: 20 }}>
              {[
                { key: 'consent1', label: '서비스 이용약관 동의' },
                { key: 'consent2', label: '개인정보 수집·이용 동의 (PIPA)' },
                { key: 'consent3', label: '개인정보 국외이전 동의 (싱가포르)' },
                { key: 'consent4', label: '금융 정보 제공 동의 (오픈뱅킹)' },
                { key: 'consent5', label: '투자 위험 고지 확인' },
              ].map(c => (
                <ConsentCheckbox key={c.key} checked={form[c.key]} onChange={v => set(c.key, v)} label={c.label} required={true} onView={() => alert(`${c.label} 전문 (준비 중)`)} />
              ))}
            </div>
            <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 10 }}>
              <p style={{ fontSize: 12, color: T.textMuted, marginBottom: 8 }}>선택 동의 항목</p>
              <ConsentCheckbox checked={form.consent6} onChange={v => set('consent6', v)} label="마케팅 정보 수신 (이메일·SMS)" required={false} onView={() => alert('마케팅 수신 동의 안내 (준비 중)')} />
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}`, marginTop: 20 }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>다음 →</button>
            </div>
          </FormStep>

          {/* SECTION 6: 검토 및 제출 — includes F-5, F-6, F-7 */}
          <FormStep active={section === 6}>
            <h3 style={{ fontFamily: T.krDisplay, fontSize: 24, fontWeight: 600, color: T.textPrimary, marginBottom: 20 }}>검토 및 제출</h3>
            <p style={{ color: T.textSecondary, fontSize: 13, lineHeight: 1.7, marginBottom: 28, paddingBottom: 20, borderBottom: `1px solid ${T.border}` }}>
              제출 전 입력 내용을 확인하세요. 신청 후 확인 이메일이 발송되고 KYC 심사가 24시간 내 완료됩니다.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>

              {/* 본인 정보 */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '18px 20px', borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.textPrimary }}>본인 정보</span>
                  <button onClick={() => gotoSection(1)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {[['성명', form.nameKr || '—'], ['이메일', form.email || '—'], ['휴대폰', form.phone ? `${form.phone} ${form.passVerified ? '✓' : '미인증'}` : '—']].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>{l}</span>
                    <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
              </div>

              {/* F-5: AGP 플랜 with 보관 수수료 + 총 적립액 */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '18px 20px', borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.textPrimary }}>AGP 플랜</span>
                  <button onClick={() => gotoSection(3)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                {[
                  ['자산 구성', form.composition],
                  ['월 적립액', `₩${monthly.toLocaleString()}`],
                  ['적립 주기', form.frequency === 'daily' ? '매일' : form.frequency === 'weekly' ? '매주' : '매월'],
                  ['자동 전환', form.conversionTarget + ' 도달 시'],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>{l}</span>
                    <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
                {/* F-5: Storage fee + total */}
                <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px dashed ${T.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
                    <span style={{ color: T.textMuted }}>보관 수수료 (연 0.3%)</span>
                    <span style={{ color: T.textSecondary, fontFamily: T.mono, fontSize: 12 }}>₩{storageFeeKrw.toLocaleString()}/월</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13, marginTop: 4 }}>
                    <span style={{ color: T.textPrimary, fontWeight: 600 }}>총 적립액</span>
                    <span style={{ color: T.gold, fontFamily: T.mono, fontWeight: 600 }}>₩{(monthly + storageFeeKrw).toLocaleString()}/월</span>
                  </div>
                </div>
              </div>

              {/* F-6: 결제수단 with 거래 수수료 in KRW */}
              <div style={{ background: T.bgField, border: `1px solid ${T.border}`, padding: '18px 20px', borderRadius: 4 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, paddingBottom: 10, borderBottom: `1px dashed ${T.border}` }}>
                  <span style={{ fontFamily: T.sans, fontWeight: 600, fontSize: 14, color: T.textPrimary }}>결제 수단</span>
                  <button onClick={() => gotoSection(4)} style={{ fontFamily: T.mono, fontSize: 10, color: T.gold, letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>편집</button>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                  <span style={{ color: T.textMuted }}>방식</span>
                  <span style={{ color: T.textPrimary, fontFamily: T.mono, fontSize: 12 }}>{form.payMethod === 'toss' ? '토스뱅크 자동이체' : form.payMethod === 'card' ? '신용·체크카드' : '암호화폐'}</span>
                </div>
                {/* F-6: fee in KRW, no ~ symbol */}
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '5px 0', fontSize: 13 }}>
                  <span style={{ color: T.textMuted }}>거래 수수료 ({form.payMethod === 'card' ? '5.5%' : form.payMethod === 'crypto' ? '2.5%' : '0.3%'})</span>
                  <span style={{ color: T.textSecondary, fontFamily: T.mono, fontSize: 12 }}>₩{txFeeKrw.toLocaleString()}</span>
                </div>
              </div>

              {/* F-7: 총 월 결제액 summary */}
              <div style={{ background: 'rgba(197,165,114,0.05)', border: `1px solid ${T.borderStrong}`, padding: '18px 20px', borderRadius: 4 }}>
                <div style={{ fontFamily: T.mono, fontSize: 10, letterSpacing: '0.15em', color: T.gold, textTransform: 'uppercase', marginBottom: 14 }}>총 월 결제액</div>
                {[
                  ['AGP 기본 납입액', `₩${monthly.toLocaleString()}`],
                  ['보관 수수료', `₩${storageFeeKrw.toLocaleString()}`],
                  ['거래 수수료', `₩${txFeeKrw.toLocaleString()}`],
                ].map(([l, v]) => (
                  <div key={l} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, fontSize: 13, color: T.textSecondary }}>
                    <span>{l}</span>
                    <span style={{ fontFamily: T.mono, fontSize: 12 }}>{v}</span>
                  </div>
                ))}
                <div style={{ borderTop: `1px solid ${T.border}`, paddingTop: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, color: T.textPrimary, fontWeight: 600 }}>총 월 결제액</span>
                  <span style={{ fontFamily: T.mono, fontSize: 20, color: T.gold, fontWeight: 700 }}>₩{totalMonthly.toLocaleString()}</span>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, paddingTop: 20, borderTop: `1px solid ${T.border}` }}>
              <button style={btnSecondary} onClick={prev}>← 이전</button>
              <button style={btnPrimary} onClick={next}>신청 완료 →</button>
            </div>
          </FormStep>

        </div>
      </div>
    </div>
  );
}
