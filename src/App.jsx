import { useState, useEffect, useCallback, useRef } from "react";

// ─── Static Data ────────────────────────────────────────────────────────────────────────────────

const FALLBACK_PRICES = { gold: 2347.80, silver: 28.45, platinum: 982.30 };
const FALLBACK_KRW = 1365.20;

const PRODUCTS = [
  { id: 1, name: "1oz Gold Bar - PAMP Suisse", nameKo: "1온스 금바 - PAMP 스위스", metal: "gold", type: "bar", weight: "1 oz", purity: "99.99%", mint: "PAMP Suisse", premium: 0.035, image: "🥇" },
  { id: 2, name: "1kg Gold Bar - Heraeus", nameKo: "1kg 금바 - 헤레우스", metal: "gold", type: "bar", weight: "1 kg", purity: "99.99%", mint: "Heraeus", premium: 0.025, image: "🥇" },
  { id: 3, name: "1oz Gold Maple Leaf", nameKo: "1온스 골드 메이플리프", metal: "gold", type: "coin", weight: "1 oz", purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.045, image: "🪙" },
  { id: 4, name: "1oz Gold Krugerrand", nameKo: "1온스 골드 크루거랜드", metal: "gold", type: "coin", weight: "1 oz", purity: "91.67%", mint: "South African Mint", premium: 0.04, image: "🪙" },
  { id: 5, name: "100oz Silver Bar - PAMP", nameKo: "100온스 은바 - PAMP", metal: "silver", type: "bar", weight: "100 oz", purity: "99.99%", mint: "PAMP Suisse", premium: 0.04, image: "🥈" },
  { id: 6, name: "1oz Silver Maple Leaf", nameKo: "1온스 실버 메이플리프", metal: "silver", type: "coin", weight: "1 oz", purity: "99.99%", mint: "Royal Canadian Mint", premium: 0.06, image: "🥈" },
  { id: 7, name: "1kg Silver Bar - Heraeus", nameKo: "1kg 은바 - 헤레우스", metal: "silver", type: "bar", weight: "1 kg", purity: "99.99%", mint: "Heraeus", premium: 0.035, image: "🥈" },
  { id: 8, name: "10oz Gold Bar - Valcambi", nameKo: "10온스 금바 - 발캄비", metal: "gold", type: "bar", weight: "10 oz", purity: "99.99%", mint: "Valcambi", premium: 0.028, image: "🥇" },
];

const HOLDINGS = [
  { id: 1, product: "1oz Gold Bar - PAMP Suisse", serial: "PAMP-2026-44891", purchasePrice: 2389.50, purchaseDate: "2026-03-15", weight: "1 oz", metal: "gold", vault: "Singapore - Malca-Amit FTZ" },
  { id: 2, product: "100oz Silver Bar - PAMP", serial: "PAMP-AG-77234", purchasePrice: 2920.00, purchaseDate: "2026-03-20", weight: "100 oz", metal: "silver", vault: "Singapore - Malca-Amit FTZ" },
  { id: 3, product: "1oz Gold Maple Leaf", serial: "RCM-ML-88123", purchasePrice: 2445.20, purchaseDate: "2026-04-01", weight: "1 oz", metal: "gold", vault: "Singapore - Malca-Amit FTZ" },
];

// ─── TASK 2 — Why Gold reasons (enhanced) ─────────────────────────────────────────────────
const WHY_GOLD_REASONS = [
  { icon: "🛡️", titleKo: "인플레이션 헤지", titleEn: "Inflation Hedge", body: "금은 수청 년간 구매력을 보존해왔습니다. 지폐가 인쇄될수록 금의 실질 가치는 올라갑니다. 한국의 소비자물가지수(CPI)가 상승할 때, 금은 원화 자산을 보호하는 방패 역할을 합니다.", stat: "+82%", statLabel: "최근 10년 금 수익률 (USD 기준)" },
  { icon: "🌍", titleKo: "지정학적 안전 자산", titleEn: "Safe Haven Asset", body: "전쟁, 금융위기, 무역분쟁 등 불확실성이 높아질 때마다 투자자들은 금으로 피신합니다. 2008년 금융위기, 2020년 팬데믹, 2022년 러-우 전쟁 때 금 가격은 급등했습니다.", stat: "$3,300+", statLabel: "2025년 역대 최고가 (USD/oz)" },
  { icon: "⚖️", titleKo: "포트폴리오 분산", titleEn: "Portfolio Diversification", body: "금은 주식·체권과 낙은 상관관계를 가집니다. 포트폴리오의 5~15%를 금에 배분하면 변동성을 낙추면서도 장기 수익률을 개선할 수 있습니다.", stat: "-0.02", statLabel: "S&P500과의 상관계수 (장기 평균)" },
  { icon: "🏛️", titleKo: "중앙은행의 선택", titleEn: "Central Bank Reserve", body: "한국은행을 포함한 세계 각국 중앙은행은 외환보유액의 일부를 금으로 보유합니다. 중앙은행들이 2022년 이후 역대 최대 규모로 금을 매입하고 있습니다.", stat: "1,037t", statLabel: "2023 중앙은행 금 순매입량" },
  { icon: "💎", titleKo: "희소성과 내재 가치", titleEn: "Scarcity & Intrinsic Value", body: "지구상에 송광된 금은 올림픽 수영장 약 3.5개 분량에 불과합니다. 새로운 송광량은 매년 제한적이며, 금은 부식되거나 소멸되지 않습니다.", stat: "~212,000t", statLabel: "역대 총 송광량 (추정)" },
  { icon: "🏦", titleKo: "환율 위험 분산", titleEn: "FX Risk Mitigation", body: "원화(KRW)가 약세를 보일 때, 달러로 표시된 금의 원화 가치는 상승합니다. 미국 금리 인상, 글로벌 리스크-오프 국면에서 원화 자산을 보호하는 자연 헤지 수단입니다.", stat: null, statLabel: null },
];

const WHY_GOLD_STATS = [
  { value: "5,000+", label: "년의 가치 저장 역사" },
  { value: "190개국", label: "이상의 중앙은행 보유" },
  { value: "0%", label: "발행자 리스크 (무기명 실물 자산)" },
  { value: "99.99%", label: "순도 보장 (Malca-Amit 보관)" },
];

// ─── TASK 3 — Education articles ─────────────────────────────────────────────────────
const EDUCATION_ARTICLES = [
  {
    id: "what-is-gold", emoji: "🥇", category: "기초",
    title: "실물 금이란 무엇인가?", subtitle: "금 ETF, 금 통장과 다른 진짜 금의 의미", readTime: "5분",
    sections: [
      { heading: "실물 금 vs 종이 금", body: "투자용 금은 크게 두 종류로 나눣니다. 종이 금은 금 ETF, KRX 금 시장, 금 통장체럼 금을 실제 보유하지 않고 가격만 추종하는 상품입니다. 실물 금은 실제로 제련된 금 바(bar) 또는 금화(coin)로, 당신이 손에 들고 금고에 넣을 수 있는 금속 그 자체입니다.", bullets: ["금 ETF: 거래소에 상장된 펜드. 편리하지만 발행사 리스크 존재.", "KRX 금 시장: 한국 내 금 현물 거래. 세금 혜택 있음.", "실물 금 바: 직접 소유하는 순도 999.9 금괴. Aurum Korea가 취급.", "금 통장(KB, 신한 등): 은행이 금을 대신 보유. 예금자 보호 미적용."], highlight: "실물 금은 발행자도, 거래상대방 리스크도 없는 유일한 금융 자산입니다." },
      { heading: "Aurum Korea가 취급하는 금의 종류", body: "저희는 LBMA(런던 귀금속 시장협회) 인증 정련소에서 제조된 제품만을 취급합니다.", bullets: ["1g 금 바 — 소액 투자 시작점", "5g 금 바 — 선물·기념일 수요 높음", "10g 금 바 — 가장 인기 있는 크기", "1oz (31.1g) 금 바 — 국제 표준 단위", "100g 금 바 — 기관·고액 투자자 선호", "1kg 금 바 — 최저 프리미엄, 최고 효율"], highlight: null },
    ],
  },
  {
    id: "gold-pricing", emoji: "📈", category: "가격",
    title: "금 가격은 어떻게 결정되나?", subtitle: "현물가, 프리미엄, 환율의 3중 구조", readTime: "7분",
    sections: [
      { heading: "국제 현물가 (Spot Price)", body: "금 가격의 기준은 LBMA가 하루 두 번 발표하는 현물가입니다. 이 가격은 트로이 온스(31.1034g) 당 USD로 표시됩니다.", bullets: null, highlight: "현재 금 현물가는 홈페이지 상단의 실시간 시세 위젯에서 확인할 수 있습니다." },
      { heading: "환율 (USD/KRW)", body: "국제 금 가격은 달러(USD) 기준이므로, 원화(KRW) 가격 = 현물가 × 환율입니다. 달러가 강세일 때 원화 금 가격이 올라가고, 원화 약세(환율 상승) 시에도 같은 효과가 납니다.", bullets: null, highlight: null },
      { heading: "프리미엄 (Premium)", body: "실물 금 바의 판매가 = 현물가 + 프리미엄입니다. 프리미엄은 제련·제조비, 운송·보험, 딜러 마진으로 구성됩니다.", bullets: ["제련·제조비: 정련소가 금괴를 만드는 비용 (보통 0.5~1%)", "운송·보험료: 싱가포르 → 보관 금고까지", "Aurum 수수료: 투명하게 공개 (상품 페이지 확인)", "소량일수록 프리미엄 높음 → 1g < 10g < 1oz < 1kg 순"], highlight: null },
      { heading: "매수-매도 스프레드", body: "구매(매수)가와 매각(매도)가의 차이를 스프레드라고 합니다. 실물 금은 유동성이 낙아 스프레드가 ETF보다 넓습니다.", bullets: null, highlight: null },
    ],
  },
  {
    id: "how-to-buy", emoji: "🛒", category: "구매",
    title: "Aurum Korea에서 금 구매하는 방법", subtitle: "회원가입부터 보관까지 5단계 가이드", readTime: "4분",
    sections: [
      { heading: "구매 프로세스 (5단계)", body: "Aurum Korea의 구매 과정은 단순하고 투명합니다.", bullets: ["1단계: 회원가입 — 이메일 또는 카카오 소셜 로그인 (5분 이내)", "2단계: 상품 선택 — 중량·브랜드별 금 바 선택", "3단계: 결제 — 토스페이 (카드/계좌이체) 또는 전신환(Wire Transfer)", "4단계: 주문 확인 — 이메일 + 카카오 알림으로 즉시 발송", "5단계: 보관 시작 — Malca-Amit 싱가포르 금고에 즉시 배정"], highlight: "구매 즉시 Malca-Amit 전용 금고에 배정됩니다. 별도 보관 신청 불필요." },
      { heading: "결제 방법", body: "현재 지원되는 결제 수단입니다.", bullets: ["토스페이: 신용카드·체크카드·계좌이체 (즉시 처리)", "전신환(Wire Transfer): 법인·고액 거래 시 권장. 하루 내 처리.", "향후 추가 예정: KakaoPay, Naver Pay"], highlight: null },
      { heading: "실물 인출", body: "금은 기본적으로 싱가포르 Malca-Amit 금고에 보관됩니다. 실물 인출을 원하실 경우 별도 배송 신청이 가능하며, 국내 반입 시 관세 및 부가세가 부과될 수 있습니다.", bullets: null, highlight: null },
    ],
  },
  {
    id: "storage-security", emoji: "🔐", category: "보관",
    title: "보관 및 안전성", subtitle: "Malca-Amit 싱가포르 금고의 보안 구조", readTime: "5분",
    sections: [
      { heading: "Malca-Amit이란?", body: "Malca-Amit은 다이아모드·귀금속 보관 및 운송 분야 세계 최고 수준의 전문 업체입니다. 1963년 설립, 전 세계 주요 도시에 고급 보안 금고를 운영하고 있습니다.", bullets: ["24시간 무장 경비 및 다중 생체인식 보안", "고객별 분리 보관 (세그리게이션) 가능", "보험: Lloyd's of London 신디케이트 완전 보장", "ISO 9001:2015 인증", "싱가포르 MAS(금융통화청) 규제 환경"], highlight: "고객 자산은 Aurum Korea의 재무 상태와 완전히 분리됩니다. Aurum Korea가 파산하더라도 고객 금은 보호됩니다." },
      { heading: "싱가포르 보관의 장점", body: "싱가포르는 아시아 최대 귀금속 허브입니다.", bullets: ["금 수입·수출 GST(부가세) 면제 (투자용 금)", "정치적 안정성 — AAA 국가 신용등급", "한국 원화 환율 위험 분산 효과", "국제 금 시장 접근성 최고"], highlight: null },
    ],
  },
  {
    id: "tax-legal", emoji: "📋", category: "세금·법률",
    title: "세금 및 법률 (한국)", subtitle: "해외 실물 금 투자 시 알아야 할 의무", readTime: "8분",
    sections: [
      { heading: "해외 금융계좌 신고", body: "해외 금융계좌 잔액이 연중 어느 하루라도 5억 원을 초과하면 다음 해 6월 1일~30일 사이에 국세청에 신고해야 합니다.", bullets: null, highlight: "미신고 시 최대 20% 과태료. 세무사 상담을 권장합니다." },
      { heading: "양도소득세", body: "국내에서 실물 금을 매각할 경우, 기타소득세(필요경비 공제 후 22%) 또는 사업소득세가 부과될 수 있습니다.", bullets: ["KRX 금 시장 거래: 비과세 (특례)", "은행 금 통장 이익: 배당소득세 15.4%", "실물 금 매각싨익: 기타소득 or 사업소득 분류 가능", "반드시 세무사·세무대리인과 개별 상담 필요"], highlight: null },
      { heading: "실물 금 국내 반입 시 관세", body: "싱가포르 보관 금을 국내로 반입할 경우 관세(3%) + 부가가치세(10%)가 부과됩니다.", bullets: null, highlight: "본 내용은 일반 정보 제공 목적이며 법적·세무적 조언이 아닙니다. 공인 세무사 또는 법률 전문가와 상담하시기 바랍니다." },
    ],
  },
  {
    id: "glossary", emoji: "📚", category: "용어집",
    title: "금 투자 용어 사전", subtitle: "알아두면 유용한 귀금속 투자 용어 A–Z", readTime: "3분",
    sections: [
      { heading: "기본 용어", body: "", bullets: ["Spot Price (현물가): 즉시 인도 기준 금 시세. 국제 금 가격의 기준.", "Troy Ounce (트로이 온스): 금 계량 단위. 1 troy oz = 31.1034g.", "Premium (프리미엄): 현물가 대비 실물 금 판매가의 추가 마진.", "Bid/Ask Spread: 매수-매도 가격 차이. 스프레드가 좌을수록 거래 비용 낙음.", "LBMA: 런던 귀금속 시장협회. 국제 금 가격 Fix 기준.", "COMEX: 미국 뉴욕 상품거래소. 금 선물 가격 형성 시장."], highlight: null },
      { heading: "순도 관련", body: "", bullets: ["999.9 (4 Nines): 순도 99.99%. 투자용 금의 국제 표준.", "24K: 순도 99.9% 이상 금. 투자용 금바는 보통 24K.", "Assay Certificate: 순도 인증서. 투자용 금바에 동봉."], highlight: null },
      { heading: "보관 관련", body: "", bullets: ["Allocated Storage: 고객 자산이 특정 금괴로 지정되어 분리 보관.", "Unallocated Storage: 풀(pool)에 혼합 보관. 비용 낙지만 상대방 리스크 존재.", "Segregated: 완전 분리 보관. Aurum Korea 기본 옵션.", "Custodian: 자산 보관 수탁 기관. Aurum Korea의 경우 Malca-Amit."], highlight: null },
    ],
  },
];

const EDUCATION_CATEGORIES = ["전체", "기초", "가격", "구매", "보관", "세금·법률", "용어집"];

// ─── TASK 1 — Static news fallback ───────────────────────────────────────────────
const STATIC_NEWS = [
  { title: "Gold Surges Past $3,300 as Central Banks Accelerate Buying", link: "https://www.kitco.com/news/gold", pubDate: "2026-04-11T06:00:00Z", source: "Kitco", category: "gold", snippet: "Gold prices pushed to a new all-time high above $3,300 per troy ounce as central banks continued to accumulate the precious metal at record pace." },
  { title: "Fed Rate Pause Signals Extended Gold Bull Run", link: "https://www.kitco.com/news/gold", pubDate: "2026-04-10T08:30:00Z", source: "Kitco", category: "gold", snippet: "Analysts say the Federal Reserve's decision to pause rate hikes creates a favourable environment for gold, with real yields expected to fall further." },
  { title: "Silver Demand Hits 10-Year High on Solar Panel Boom", link: "https://www.kitco.com/news/silver", pubDate: "2026-04-10T04:00:00Z", source: "Kitco", category: "silver", snippet: "Industrial demand for silver surged to a decade-high driven by solar panel manufacturing, creating a structural supply deficit that supports prices." },
  { title: "Korean Won Weakens \u2014 Gold Hedge Interest Spikes", link: "https://www.bullionstar.com/blogs", pubDate: "2026-04-09T09:00:00Z", source: "BullionStar", category: "gold", snippet: "Korean retail investors are increasingly turning to physical gold as the won softens against the dollar, with vault enquiries up 40% month-on-month." },
  { title: "Singapore FTZ Vaults Report Record Inflows from Asian Investors", link: "https://www.bullionstar.com/blogs", pubDate: "2026-04-08T07:00:00Z", source: "BullionStar", category: "gold", snippet: "Singapore freeport vaults reported record new deposits in Q1 2026, driven primarily by high-net-worth investors from South Korea and Japan." },
  { title: "Silver Industrial Deficit to Widen in 2026 \u2014 Silver Institute", link: "https://www.kitco.com/news/silver", pubDate: "2026-04-07T05:00:00Z", source: "Kitco", category: "silver", snippet: "The Silver Institute projects the global silver market deficit will widen to over 200 million ounces in 2026, the fourth consecutive year of structural undersupply." },
];

// ─── Helpers ────────────────────────────────────────────────────────────────────────────────

function calcPrice(p, prices) {
  const spot = prices[p.metal] ?? prices.gold;
  const oz = p.weight.includes("kg") ? parseFloat(p.weight) * 32.1507 : parseFloat(p.weight);
  return spot * oz * (1 + p.premium);
}

function fUSD(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fKRW(n) { return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n); }

function formatNewsDate(dateStr) {
  const date = new Date(dateStr);
  const diffHours = Math.floor((Date.now() - date.getTime()) / 3_600_000);
  if (diffHours < 1) return "\ubc29\uae08 \uc804";
  if (diffHours < 24) return `${diffHours}\uc2dc\uac04 \uc804`;
  if (diffHours < 48) return "\uc5b4\uc81c";
  return date.toLocaleDateString("ko-KR", { month: "short", day: "numeric" });
}

function useIsMobile() {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);
  return isMobile;
}

function useInView(ref) {
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setInView(true); },
      { threshold: 0.05, rootMargin: "-60px" }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [ref]);
  return inView;
}

// ─── Live Price Hook ──────────────────────────────────────────────────────────────

function useLivePrices() {
  const [prices, setPrices] = useState(FALLBACK_PRICES);
  const [krwRate, setKrwRate] = useState(FALLBACK_KRW);
  const [priceError, setPriceError] = useState(null);
  const fetchPrices = useCallback(async () => {
    try {
      const [goldRes, silverRes, platRes, fxRes] = await Promise.all([
        fetch("https://api.gold-api.com/price/XAU"),
        fetch("https://api.gold-api.com/price/XAG"),
        fetch("https://api.gold-api.com/price/XPT"),
        fetch("https://open.er-api.com/v6/latest/USD"),
      ]);
      const [gold, silver, plat, fx] = await Promise.all([goldRes.json(), silverRes.json(), platRes.json(), fxRes.json()]);
      setPrices({ gold: gold.price, silver: silver.price, platinum: plat.price });
      if (fx.rates?.KRW) setKrwRate(fx.rates.KRW);
      setPriceError(null);
    } catch (err) {
      console.warn("Price fetch failed:", err);
      setPriceError("\uac00\uaca9 \ub85c\ub529 \uc2e4\ud328 \u2014 \ucd5c\uadfc \ub370\uc774\ud130 \ud45c\uc2dc \uc911");
    }
  }, []);
  useEffect(() => {
    fetchPrices();
    const interval = setInterval(fetchPrices, 60_000);
    return () => clearInterval(interval);
  }, [fetchPrices]);
  return { prices, krwRate, priceError };
}

// ─── TASK 1 — Live News Hook ──────────────────────────────────────────────────────

const RSS_FEEDS = [
  { url: "https://www.kitco.com/rss/news.rss", source: "Kitco", category: "gold" },
  { url: "https://www.kitco.com/rss/silver-news.rss", source: "Kitco", category: "silver" },
  { url: "https://www.bullionstar.com/rss", source: "BullionStar", category: "gold" },
];

function useNewsData() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  useEffect(() => {
    let cancelled = false;
    const fetchAll = async () => {
      try {
        const fetches = RSS_FEEDS.map((feed) =>
          fetch(`https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(feed.url)}&count=6`)
            .then((r) => r.ok ? r.json() : null)
            .then((data) => {
              if (!data || data.status !== "ok" || !Array.isArray(data.items)) return [];
              return data.items.map((item) => ({
                title: item.title || "",
                link: item.link || "#",
                pubDate: item.pubDate || new Date().toISOString(),
                source: feed.source,
                category: feed.category,
                snippet: (item.description || "").replace(/<[^>]*>/g, "").trim().slice(0, 200),
              }));
            })
            .catch(() => [])
        );
        const results = await Promise.allSettled(fetches);
        if (cancelled) return;
        const all = results.flatMap((r) => r.status === "fulfilled" ? r.value : []);
        setArticles(all.length >= 4 ? all.slice(0, 12) : STATIC_NEWS);
      } catch {
        if (!cancelled) { setArticles(STATIC_NEWS); setError(true); }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    fetchAll();
    return () => { cancelled = true; };
  }, []);
  return { articles, loading, error };
}

// ─── Ticker ─────────────────────────────────────────────────────────────────────────────────

function Ticker({ lang, prices, krwRate }) {
  const isMobile = useIsMobile();
  const [items, setItems] = useState([]);
  useEffect(() => {
    const build = () => [
      { label: lang === "ko" ? "\uae08" : "XAU", price: prices.gold + (Math.random() - 0.5) * prices.gold * 0.001, change: "+0.42%", up: true },
      { label: lang === "ko" ? "\uc740" : "XAG", price: prices.silver + (Math.random() - 0.5) * prices.silver * 0.001, change: "+1.15%", up: true },
      { label: lang === "ko" ? "\ubc31\uae08" : "XPT", price: prices.platinum + (Math.random() - 0.5) * prices.platinum * 0.001, change: "-0.23%", up: false },
      { label: "KRW/USD", price: krwRate + (Math.random() - 0.5) * krwRate * 0.001, change: "+0.18%", up: true },
    ];
    setItems(build());
    const interval = setInterval(() => setItems(build()), 3000);
    return () => clearInterval(interval);
  }, [lang, prices, krwRate]);
  return (
    <div style={{ background: "linear-gradient(90deg,#0d0d0d,#1a1510,#0d0d0d)", borderBottom: "1px solid #2a2318", padding: isMobile ? "8px 12px" : "10px 0" }}>
      <div style={{ display: "flex", justifyContent: isMobile ? "space-between" : "center", gap: isMobile ? 8 : 48, fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 10 : 13, flexWrap: isMobile ? "wrap" : "nowrap" }}>
        {items.map((item, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <span style={{ color: "#8a7d6b" }}>{item.label}</span>
            <span style={{ color: "#c5a572", fontWeight: 600 }}>${item.price.toFixed(2)}</span>
            <span style={{ color: item.up ? "#4ade80" : "#f87171", fontSize: isMobile ? 8 : 11 }}>{item.change}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Nav ────────────────────────────────────────────────────────────────────────────────────

function Nav({ page, setPage, lang, setLang, isLoggedIn, setIsLoggedIn }) {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = [
    { key: "shop", label: lang === "ko" ? "\ub9e4\uc7a5" : "Shop" },
    { key: "why", label: lang === "ko" ? "\uc67c \uae08\uc778\uac00" : "Why Gold" },
    { key: "storage", label: lang === "ko" ? "\ubcf4\uad00" : "Storage" },
    { key: "learn", label: lang === "ko" ? "\uad50\uc721" : "Learn" },
  ];
  const navigate = (key) => { setPage(key); setMenuOpen(false); };
  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => navigate("home")}>
      <div style={{ width: isMobile ? 30 : 36, height: isMobile ? 30 : 36, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: isMobile ? 13 : 16, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 17 : 22, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
    </div>
  );
  if (isMobile) return (
    <>
      <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Logo />
        <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: "none", border: "none", color: "#c5a572", fontSize: 22, cursor: "pointer" }}>{menuOpen ? "\u2715" : "\u2630"}</button>
      </nav>
      {menuOpen && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, background: "#0a0a0a", zIndex: 999, padding: 24, display: "flex", flexDirection: "column", gap: 8, overflowY: "auto" }}>
          {links.map(x => <button key={x.key} onClick={() => navigate(x.key)} style={{ background: page === x.key ? "rgba(197,165,114,0.1)" : "none", border: "none", color: page === x.key ? "#c5a572" : "#8a7d6b", fontSize: 18, fontFamily: "'Outfit',sans-serif", padding: "14px 0", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #1a1510" }}>{x.label}</button>)}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {isLoggedIn && <button onClick={() => navigate("dashboard")} style={{ flex: 1, background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "10px", borderRadius: 4, fontSize: 14, cursor: "pointer" }}>{lang === "ko" ? "\ub0b4 \ubcf4\uc720\uc790\uc0b0" : "My Holdings"}</button>}
            <button onClick={() => { setIsLoggedIn(!isLoggedIn); setMenuOpen(false); }} style={{ flex: 1, background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "10px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "\ub85c\uadf8\uc544\uc6c3" : "Logout") : (lang === "ko" ? "\ub85c\uadf8\uc778" : "Login")}</button>
            <button onClick={() => { setLang(lang === "en" ? "ko" : "en"); setMenuOpen(false); }} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "10px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "\ud55c\uad6d\uc5b4" : "EN"}</button>
          </div>
        </div>
      )}
    </>
  );
  return (
    <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <Logo />
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map(x => <button key={x.key} onClick={() => setPage(x.key)} style={{ background: "none", border: "none", color: page === x.key ? "#c5a572" : "#8a7d6b", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{x.label}</button>)}
        <div style={{ width: 1, height: 20, background: "#2a2318" }} />
        {isLoggedIn && <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>{lang === "ko" ? "\ub0b4 \ubcf4\uc720\uc790\uc0b0" : "My Holdings"}</button>}
        <button onClick={() => setIsLoggedIn(!isLoggedIn)} style={{ background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "6px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "\ub85c\uadf8\uc544\uc6c3" : "Logout") : (lang === "ko" ? "\ub85c\uadf8\uc778" : "Login")}</button>
        <button onClick={() => setLang(lang === "en" ? "ko" : "en")} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "4px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "\ud55c\uad6d\uc5b4" : "EN"}</button>
      </div>
    </nav>
  );
}

// ─── TASK 1 — News Section ────────────────────────────────────────────────────────────────

function NewsSection({ lang }) {
  const isMobile = useIsMobile();
  const { articles, loading } = useNewsData();
  const [activeTab, setActiveTab] = useState("all");
  const tabs = [
    { key: "all", label: lang === "ko" ? "\uc804\uccb4" : "All" },
    { key: "gold", label: lang === "ko" ? "\uae08" : "Gold" },
    { key: "silver", label: lang === "ko" ? "\uc740" : "Silver" },
  ];
  const filtered = activeTab === "all" ? articles : articles.filter((a) => a.category === activeTab);
  return (
    <div style={{ background: "#111008", padding: isMobile ? "32px 16px" : "52px 80px", borderTop: "1px solid #1a1510" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 28, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 16 : 0 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{lang === "ko" ? "\uc2dc\uc7a5 \uc778\ud154\ub9ac\uc820\uc2a4" : "Market Intelligence"}</div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 28, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "\uae08\u00b7\uc740 \uc2dc\uc7a5 \ub274\uc2a4" : "Gold & Silver News"}</h2>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map((tab) => (
            <button key={tab.key} onClick={() => setActiveTab(tab.key)} style={{ background: activeTab === tab.key ? "#c5a572" : "transparent", color: activeTab === tab.key ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${activeTab === tab.key ? "#c5a572" : "#2a2318"}`, padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: activeTab === tab.key ? 600 : 400, transition: "all 0.15s" }}>{tab.label}</button>
          ))}
        </div>
      </div>
      {loading && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: 16 }}>
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} style={{ background: "#0d0c08", border: "1px solid #1a1510", borderRadius: 8, padding: 20 }}>
              <div style={{ height: 10, background: "#1e1e1e", borderRadius: 4, width: "33%", marginBottom: 14 }} />
              <div style={{ height: 16, background: "#1e1e1e", borderRadius: 4, width: "100%", marginBottom: 8 }} />
              <div style={{ height: 16, background: "#1e1e1e", borderRadius: 4, width: "75%", marginBottom: 14 }} />
              <div style={{ height: 10, background: "#1e1e1e", borderRadius: 4, width: "100%", marginBottom: 6 }} />
              <div style={{ height: 10, background: "#1e1e1e", borderRadius: 4, width: "83%" }} />
            </div>
          ))}
        </div>
      )}
      {!loading && (
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 20 }}>
          {filtered.slice(0, 6).map((article, i) => (
            <a key={`${article.link}-${i}`} href={article.link} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
              <div style={{ background: "#0d0c08", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 20, cursor: "pointer", transition: "border-color 0.2s", height: "100%", boxSizing: "border-box" }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(197,165,114,0.35)"; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1510"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
                  <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, fontWeight: 700, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase" }}>{article.source}</span>
                  <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 10, color: "#555" }}>{formatNewsDate(article.pubDate)}</span>
                </div>
                <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, fontWeight: 500, color: "#f5f0e8", lineHeight: 1.5, margin: "0 0 10px 0", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.title}</h3>
                {article.snippet && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", lineHeight: 1.6, margin: "0 0 12px 0", display: "-webkit-box", WebkitLineClamp: 3, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{article.snippet}</p>}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ display: "inline-block", padding: "2px 8px", borderRadius: 3, fontSize: 10, fontFamily: "'Outfit',sans-serif", fontWeight: 600, background: article.category === "gold" ? "rgba(197,165,114,0.12)" : "rgba(180,180,180,0.1)", color: article.category === "gold" ? "#c5a572" : "#aaa" }}>
                    {article.category === "gold" ? (lang === "ko" ? "\uae08" : "Gold") : (lang === "ko" ? "\uc740" : "Silver")}
                  </span>
                  <span style={{ fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "\uc790\uc138\ud788 \u2192" : "Read \u2192"}</span>
                </div>
              </div>
            </a>
          ))}
          {filtered.length === 0 && (
            <div style={{ gridColumn: "1/-1", textAlign: "center", padding: "40px 0", color: "#555", fontFamily: "'Outfit',sans-serif", fontSize: 13 }}>
              {lang === "ko" ? "\ud604\uc7ac \ud45c\uc2dc\ud560 \ub274\uc2a4\uac00 \uc5c6\uc2b5\ub2c8\ub2e4." : "No articles to display."}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Home ─────────────────────────────────────────────────────────────────────────────────────

function Home({ lang, setPage, prices, krwRate }) {
  const isMobile = useIsMobile();
  const krxPrice = prices.gold * krwRate * 1.10;
  const aurumPrice = prices.gold * krwRate * 1.035;
  const savings = krxPrice - aurumPrice;
  return (
    <div>
      <div style={{ position: "relative", minHeight: isMobile ? 400 : 520, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: isMobile ? "32px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: isMobile ? "100%" : 640 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 11 : 13, color: "#c5a572", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", marginBottom: isMobile ? 12 : 20 }}>
            {lang === "ko" ? "\uc2f1\uac00\ud3ec\ub974 \ubcf4\uad00 \u00b7 \uae00\ub85c\ubc8c \uac00\uaca9 \u00b7 \ud55c\uad6d \uace0\uac1d" : "Singapore Vaulted \u00b7 Global Pricing \u00b7 Korea Focused"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 32 : 52, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.15, margin: "0 0 20px 0" }}>
            {lang === "ko" ? <><span style={{ color: "#c5a572", fontWeight: 600 }}>\uae40\uce58 \ud504\ub9ac\ubbf8\uc5c4</span> \uc5c6\uc774<br />\uae08\uc744 \uc18c\uc720\ud558\uc138\uc694</> : <>Own Gold<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Without the</span><br />Kimchi Premium</>}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 17, color: "#8a7d6b", lineHeight: 1.7, margin: "0 0 28px 0" }}>
            {lang === "ko" ? "\uae00\ub85c\ubc8c \ud604\ubb3c\uac00\uc5d0 \uc2e4\ubb3c \uae08\u00b7\uc740\uc744 \uad6c\ub9e4\ud558\uace0 \uc138\uacc4 \ucd5c\uace0 \uc218\uc900\uc758 \uc2f1\uac00\ud3ec\ub974 \ubcf3\ud2b8\uc5d0 \uc548\uc804\ud558\uac8c \ubcf4\uad00\ud558\uc138\uc694. \ud55c\uad6d VAT\u00b7\uad00\uc138 \uba74\uc81c." : "Buy physical gold and silver at global spot prices. Stored securely in world-class Singapore vaults. No Korean VAT or customs duties."}
          </p>
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => setPage("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer", letterSpacing: 1 }}>{lang === "ko" ? "\ub9e4\uc7a5 \ub458\ub7ec\ubcf4\uae30" : "Browse Shop"}</button>
            <button onClick={() => setPage("why")} style={{ background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>{lang === "ko" ? "\uc67c \uae08\uc778\uac00?" : "Why Gold?"}</button>
          </div>
        </div>
      </div>
      <div style={{ background: "#111008", padding: isMobile ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", alignItems: isMobile ? "stretch" : "center", gap: isMobile ? 20 : 0 }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{lang === "ko" ? "\uae40\uce58 \ud504\ub9ac\ubbf8\uc5c4 \ube44\uad50" : "Kimchi Premium Comparison"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 28, color: "#f5f0e8" }}>{lang === "ko" ? "1\uc628\uc2a4 \uae08 \uad6c\ub9e4 \uc2dc \uc808\uc57d \uae08\uc561" : "Your Savings on 1oz Gold"}</div>
          </div>
          <div style={{ display: "flex", gap: isMobile ? 10 : 40, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", flex: isMobile ? 1 : "none" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>KRX ~10%</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 24, color: "#f87171" }}>{fKRW(krxPrice)}</div>
            </div>
            <div style={{ textAlign: "center", flex: isMobile ? 1 : "none" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>AURUM 3.5%</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 24, color: "#4ade80" }}>{fKRW(aurumPrice)}</div>
            </div>
            <div style={{ textAlign: "center", flex: isMobile ? "1 1 100%" : "none", background: "rgba(74,222,128,0.08)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)" }}>
              <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 4 }}>{lang === "ko" ? "\uc808\uc57d" : "Save"}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(savings)}</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ background: "#0a0a0a", padding: isMobile ? "24px 16px" : "40px 80px", display: "flex", justifyContent: "center", gap: isMobile ? 16 : 64, flexWrap: "wrap" }}>
        {[{ icon: "\ud83c\udfe6", label: "Malca-Amit" }, { icon: "\ud83d\udcdc", label: "LBMA" }, { icon: "\ud83d\udee1\ufe0f", label: lang === "ko" ? "\uc644\uc804 \ubcf4\ud5d8" : "Insured" }, { icon: "\ud83d\udd10", label: lang === "ko" ? "\uc644\uc804 \ubc30\ubd84" : "Allocated" }, { icon: "\ud83c\uddf8\ud83c\uddec", label: "Singapore FTZ" }].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: isMobile ? 11 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: isMobile ? 16 : 20 }}>{x.icon}</span>{x.label}
          </div>
        ))}
      </div>
      <NewsSection lang={lang} />
    </div>
  );
}

// ─── Shop ───────────────────────────────────────────────────────────────────────────────────────

function Shop({ lang, setPage, setProduct, prices, krwRate }) {
  const isMobile = useIsMobile();
  const [metalFilter, setMetalFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const filtered = PRODUCTS.filter(p => (metalFilter === "all" || p.metal === metalFilter) && (typeFilter === "all" || p.type === typeFilter));
  const FilterBtn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ background: active ? "#c5a572" : "transparent", color: active ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${active ? "#c5a572" : "#2a2318"}`, padding: isMobile ? "6px 14px" : "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: isMobile ? 12 : 13, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400 }}>{children}</button>
  );
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 36, color: "#f5f0e8", fontWeight: 300, margin: "0 0 6px 0" }}>{lang === "ko" ? "\uadc0\uae08\uc18d \ub9e4\uc7a5" : "Precious Metals Shop"}</h2>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 14, color: "#8a7d6b", margin: "0 0 24px 0" }}>{lang === "ko" ? "\uae00\ub85c\ubc8c \ud604\ubb3c\uac00 + \ud22c\uba85\ud55c \ud504\ub9ac\ubbf8\uc5c4" : "Global spot + transparent premium"}</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <FilterBtn active={metalFilter === "all"} onClick={() => setMetalFilter("all")}>{lang === "ko" ? "\uc804\uccb4" : "All"}</FilterBtn>
        <FilterBtn active={metalFilter === "gold"} onClick={() => setMetalFilter("gold")}>{lang === "ko" ? "\uae08" : "Gold"}</FilterBtn>
        <FilterBtn active={metalFilter === "silver"} onClick={() => setMetalFilter("silver")}>{lang === "ko" ? "\uc740" : "Silver"}</FilterBtn>
        <div style={{ width: 1, height: 28, background: "#2a2318", alignSelf: "center", margin: "0 4px" }} />
        <FilterBtn active={typeFilter === "all"} onClick={() => setTypeFilter("all")}>{lang === "ko" ? "\uc804\uccb4" : "All"}</FilterBtn>
        <FilterBtn active={typeFilter === "bar"} onClick={() => setTypeFilter("bar")}>{lang === "ko" ? "\ubc14" : "Bars"}</FilterBtn>
        <FilterBtn active={typeFilter === "coin"} onClick={() => setTypeFilter("coin")}>{lang === "ko" ? "\ucf54\uc778" : "Coins"}</FilterBtn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: isMobile ? 16 : 24 }}>
        {filtered.map(p => {
          const price = calcPrice(p, prices);
          return (
            <div key={p.id} onClick={() => { setProduct(p); setPage("product"); }} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 24, cursor: "pointer", position: "relative" }}>
              <span style={{ position: "absolute", top: 10, right: 10, background: p.metal === "gold" ? "rgba(197,165,114,0.15)" : "rgba(180,180,180,0.15)", color: p.metal === "gold" ? "#c5a572" : "#aaa", fontSize: 10, padding: "2px 6px", borderRadius: 3 }}>{p.type === "bar" ? (lang === "ko" ? "\ubc14" : "Bar") : (lang === "ko" ? "\ucf54\uc778" : "Coin")}</span>
              <div style={{ fontSize: isMobile ? 36 : 48, marginBottom: 12 }}>{p.image}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#f5f0e8", fontWeight: 500, marginBottom: 3 }}>{lang === "ko" ? p.nameKo : p.name}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 12 }}>{p.mint} \u00b7 {p.purity} \u00b7 {p.weight}</div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                <div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 18, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(price * krwRate)}</div>
                </div>
                <div style={{ fontSize: 10, color: "#8a7d6b" }}>+{(p.premium * 100).toFixed(1)}%</div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── Product Detail ───────────────────────────────────────────────────────────────────────────────────

function ProductPage({ product, lang, setPage, prices, krwRate, isLoggedIn }) {
  const isMobile = useIsMobile();
  const [storageOption, setStorageOption] = useState("singapore");
  const [qty, setQty] = useState(1);
  if (!product) return null;
  const unitPrice = calcPrice(product, prices);
  const dutyFee = storageOption === "korea" ? unitPrice * 0.18 : 0;
  const total = (unitPrice + dutyFee) * qty;
  const handleBuyNow = () => {
    if (!isLoggedIn) { alert(lang === "ko" ? "\uad6c\ub9e4\ud558\ub824\uba74 \uba3c\uc800 \ub85c\uadf8\uc778\ud558\uc138\uc694." : "Please log in to purchase."); return; }
    alert(lang === "ko" ? "\uacb0\uc81c \uc2dc\uc2a4\ud15c \uc5f0\ub3d9 \uc900\ube44 \uc911\uc785\ub2c8\ub2e4." : "Payment integration coming soon.");
  };
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20 }}>\u2190 {lang === "ko" ? "\ub9e4\uc7a5\uc73c\ub85c" : "Back to Shop"}</button>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 24 : 60 }}>
        <div style={{ background: "#111008", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: isMobile ? 200 : 400, border: "1px solid #1a1510" }}>
          <div style={{ fontSize: isMobile ? 80 : 120 }}>{product.image}</div>
        </div>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{product.mint}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 32, color: "#f5f0e8", fontWeight: 400, margin: "0 0 6px 0" }}>{lang === "ko" ? product.nameKo : product.name}</h1>
          <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 20 }}>{product.purity} \u00b7 {product.weight}</div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "\ud604\ubb3c\uac00" : "Spot"}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#ddd" }}>{fUSD(unitPrice / (1 + product.premium))}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "\ud504\ub9ac\ubbf8\uc5c4" : "Premium"} ({(product.premium * 100).toFixed(1)}%)</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572" }}>+{fUSD(unitPrice - unitPrice / (1 + product.premium))}</span></div>
            {storageOption === "korea" && <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "\ud55c\uad6d \uad00\uc138/VAT ~18%" : "Korea Duties ~18%"}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#f87171" }}>+{fUSD(dutyFee)}</span></div>}
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "\ub2e8\uac00" : "Unit Price"}</span><div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 22, color: "#c5a572", fontWeight: 600 }}>{fUSD(unitPrice + dutyFee)}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW((unitPrice + dutyFee) * krwRate)}</div></div></div>
          </div>
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8 }}>{lang === "ko" ? "\ubcf4\uad00 \uc635\uc158" : "Storage Option"}</div>
            <div style={{ display: "flex", gap: 10, flexDirection: isMobile ? "column" : "row" }}>
              {[{ key: "singapore", label: lang === "ko" ? "\ud83c\uddf8\ud83c\uddec \uc2f1\uac00\ud3ec\ub974 \ubcf4\uad00" : "\ud83c\uddf8\ud83c\uddec Singapore Vault", sub: lang === "ko" ? "VAT \uba74\uc81c \u00b7 \uc5f0 0.8%" : "No VAT \u00b7 0.8%/yr" }, { key: "korea", label: lang === "ko" ? "\ud83c\uddf0\ud83c\uddf7 \ud55c\uad6d \ubc30\uc1a1" : "\ud83c\uddf0\ud83c\uddf7 Ship to Korea", sub: "~18% duties" }].map(o => (
                <button key={o.key} onClick={() => setStorageOption(o.key)} style={{ flex: 1, background: storageOption === o.key ? "rgba(197,165,114,0.08)" : "transparent", border: `1px solid ${storageOption === o.key ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: 13, color: "#f5f0e8", marginBottom: 2 }}>{o.label}</div>
                  <div style={{ fontSize: 11, color: storageOption === o.key ? "#4ade80" : "#8a7d6b" }}>{o.sub}</div>
                </button>
              ))}
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? "\uc218\ub7c9" : "Qty"}</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 4 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>\u2212</button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 12px" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>+</button>
            </div>
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}><span style={{ fontSize: 14, color: "#f5f0e8" }}>{lang === "ko" ? "\uc5ed\uc561" : "Total"}</span><div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 26, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW(total * krwRate)}</div></div></div>
          <button onClick={handleBuyNow} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: 16, fontSize: 16, fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>{lang === "ko" ? "\uc9c0\uae08 \uad6c\ub9e4\ud558\uae30" : "Buy Now"}</button>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>{["\ud83d\udcb3 Toss Pay", "\ud83c\udfe7 \uce74\ub4dc", "\ud83c\udfe6 Wire"].map((x, i) => <span key={i} style={{ fontSize: 11, color: "#666" }}>{x}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── TASK 2 — Why Gold (enhanced) ────────────────────────────────────────────────────────────────────

function WhyGold({ lang, setPage }) {
  const isMobile = useIsMobile();
  const sectionRef = useRef(null);
  const inView = useInView(sectionRef);
  const fadeStyle = (delay = 0) => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translateY(0)" : "translateY(24px)",
    transition: `opacity 0.6s ease ${delay}s, transform 0.6s ease ${delay}s`,
  });
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ padding: isMobile ? "40px 16px 32px" : "60px 80px 40px", textAlign: "center" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? "\uc67c \uae08\uc778\uac00" : "Why Gold"}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 30 : 46, color: "#f5f0e8", fontWeight: 300, margin: "0 0 16px 0", lineHeight: 1.2 }}>{lang === "ko" ? "\uae08\uc740 \ub2e8\uc21c\ud55c \uae08\uc18d\uc774 \uc544\ub2d9\ub2c8\ub2e4" : "Gold Is More Than a Metal"}</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 16, color: "#8a7d6b", maxWidth: 560, margin: "0 auto", lineHeight: 1.75 }}>
          {lang === "ko" ? "\uc218\uccad \ub144\uac04 \uc778\ub958\uac00 \uc2e0\ub8b0\ud574\uc628 \uac00\uce58 \uc800\uc7a5 \uc218\ub2e8. \uc9c0\uae08 \ub2f9\uc2e0\uc758 \ud3ec\ud2b8\ud3f4\ub9ac\uc624\uc5d0 \uae08\uc774 \ud544\uc694\ud55c 6\uac00\uc9c0 \uc774\uc720\ub97c \ud655\uc778\ud558\uc138\uc694." : "The world's most trusted store of value for thousands of years. 6 reasons your portfolio needs physical gold."}
        </p>
      </div>
      <div ref={sectionRef} style={{ padding: isMobile ? "0 16px 40px" : "0 80px 56px" }}>
        <div style={{ ...fadeStyle(0), display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", borderRadius: 12, overflow: "hidden", border: "1px solid #1a1510", marginBottom: isMobile ? 28 : 48 }}>
          {WHY_GOLD_STATS.map((s, i) => (
            <div key={i} style={{ background: "#111008", padding: isMobile ? "18px 10px" : "26px 22px", textAlign: "center", borderRight: i < WHY_GOLD_STATS.length - 1 ? "1px solid #1a1510" : "none" }}>
              <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 26, fontWeight: 600, color: "#c5a572", marginBottom: 5 }}>{s.value}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 9 : 11, color: "#8a7d6b", lineHeight: 1.4 }}>{s.label}</div>
            </div>
          ))}
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 14 : 20, marginBottom: isMobile ? 32 : 48 }}>
          {WHY_GOLD_REASONS.map((reason, i) => (
            <div key={i} style={{ ...fadeStyle(0.07 * i), background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 28 }}>
              <div style={{ fontSize: isMobile ? 26 : 30, marginBottom: 14 }}>{reason.icon}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 23, color: "#f5f0e8", fontWeight: 500, margin: "0 0 3px 0" }}>{lang === "ko" ? reason.titleKo : reason.titleEn}</h3>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? reason.titleEn : reason.titleKo}</div>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#8a7d6b", lineHeight: 1.7, margin: 0 }}>{reason.body}</p>
              {reason.stat && (
                <div style={{ marginTop: 18, paddingTop: 16, borderTop: "1px solid #1a1510" }}>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 20 : 24, color: "#c5a572", fontWeight: 700 }}>{reason.stat}</div>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#555", marginTop: 3 }}>{reason.statLabel}</div>
                </div>
              )}
            </div>
          ))}
        </div>
        <div style={{ ...fadeStyle(0.5), background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 24 : 48, marginBottom: isMobile ? 32 : 48 }}>
          <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 30, color: "#f5f0e8", fontWeight: 300, margin: "0 0 24px 0" }}>{lang === "ko" ? "\uae00\ub85c\ubc8c \ub9ac\uc2a4\ud06c & \uc790\uc0b0 \ubcf4\uc804" : "Global Risks & Wealth Preservation"}</h3>
          <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 16 : 28 }}>
            {[
              { t: lang === "ko" ? "\ud1b5\ud654 \uac00\uce58 \ud558\ub77d" : "Currency Devaluation", d: lang === "ko" ? "\ubaa8\ub4e0 \ubc95\uc815\ud654\ud3d0\ub294 \uc2dc\uac04\uc774 \uc9c0\ub0a8\uc5d0 \ub530\ub77c \uad6c\ub9e4\ub825\uc744 \uc0c1\uc2e4\ud569\ub2c8\ub2e4. \uae08\uc740 \uc9c0\ub09c 100\ub144\uac04 \ubaa8\ub4e0 \uc8fc\uc694 \ud1b5\ud654 \ub300\ube44 \uac00\uce58\ub97c \uc720\uc9c0\ud588\uc2b5\ub2c8\ub2e4." : "All fiat currencies lose purchasing power over time. Gold has maintained its value against all major currencies over the past 100 years." },
              { t: lang === "ko" ? "\uc9c0\uc815\ud559\uc801 \ubd88\ud655\uc2e4\uc131" : "Geopolitical Uncertainty", d: lang === "ko" ? "\ubb34\uc5ed \uc804\uc7c1, \uc9c0\uc5ed \ubd84\uc7c1\uc740 \uc804\ud1b5\uc801 \uae08\uc735 \uc790\uc0b0\uc5d0 \uc704\ud5d8\uc744 \ucd08\ub798\ud569\ub2c8\ub2e4. \uae08\uc740 \uc5b4\ub5a4 \uad6d\uacbd\uc5d0\ub3c4 \ubb36\uc774\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4." : "Trade wars and conflicts pose risks to traditional assets. Gold is not tied to any border or government." },
              { t: lang === "ko" ? "\uae08\uc735 \uc2dc\uc2a4\ud15c \ub9ac\uc2a4\ud06c" : "Financial System Risk", d: lang === "ko" ? "\uc740\ud589 \uc704\uae30, \uc591\uc801\uc644\ud654, \uacfc\ub3c4\ud55c \ubd80\uccb4\ub294 \uc2dc\uc2a4\ud15c\uc801 \ucde8\uc57d\uc131\uc744 \uc99d\uac00\uc2dc\ud0b5\ub2c8\ub2e4. \uc2e4\ubb3c \uae08\uc740 \uc774 \uc2dc\uc2a4\ud15c \ubc16\uc5d0 \uc874\uc7ac\ud569\ub2c8\ub2e4." : "Banking crises and excessive debt increase systemic vulnerabilities. Physical gold exists outside this system." },
              { t: lang === "ko" ? "\uc778\ud50c\ub808\uc774\uc158 \ud5e4\uc9c0" : "Inflation Hedge", d: lang === "ko" ? "\uc911\uc559\uc740\ud589\uc758 \ud1b5\ud654 \ud321\uc18d \uc815\uccb8\uc5d0 \ub300\ud55c \uac00\uc7a5 \uac80\uc99d\ub41c \ubcf4\ud638 \uc218\ub2e8\uc785\ub2c8\ub2e4. 2020~2024\ub144 \uc778\ud50c\ub808\uc774\uc158\uae30\uc5d0 \uae08\uc740 \uc8fc\uc2dd \ub300\ube44 \uc6b0\uc218\ud55c \uc131\uacfc\ub97c \ub0c8\uc2b5\ub2c8\ub2e4." : "The most proven protection against monetary expansion. Gold outperformed equities during the 2020-2024 inflationary period." },
            ].map((x, i) => (
              <div key={i} style={{ padding: isMobile ? "12px 0" : "14px 0", borderBottom: (!isMobile && i < 2) ? "1px solid #1a1510" : "none" }}>
                <h4 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 15, color: "#c5a572", margin: "0 0 6px 0", fontWeight: 600 }}>{x.t}</h4>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.d}</p>
              </div>
            ))}
          </div>
        </div>
        <div style={{ ...fadeStyle(0.6), textAlign: "center" }}>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 14, color: "#8a7d6b", marginBottom: 20 }}>{lang === "ko" ? "\uc9c0\uae08 \ubc14\ub85c \uad6d\uc81c \ud604\ubb3c\uac00 \uae30\uc900\uc73c\ub85c \uc2e4\ubb3c \uae08\u00b7\uc740\uc744 \uad6c\ub9e4\ud558\uc138\uc694" : "Buy physical gold and silver at international spot price today"}</p>
          <div style={{ display: "flex", gap: 14, justifyContent: "center", flexDirection: isMobile ? "column" : "row", maxWidth: 440, margin: "0 auto" }}>
            <button onClick={() => setPage("shop")} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "14px 28px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 30, cursor: "pointer" }}>{lang === "ko" ? "\uc9c0\uae08 \uad6c\ub9e4\ud558\uae30 \u2192" : "Buy Now \u2192"}</button>
            <button onClick={() => setPage("learn")} style={{ flex: 1, background: "transparent", color: "#c5a572", border: "1px solid rgba(197,165,114,0.4)", padding: "14px 28px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 30, cursor: "pointer" }}>{lang === "ko" ? "\ud22c\uc790 \uad50\uc721 \ubcf4\uae30" : "Education Hub"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Storage ────────────────────────────────────────────────────────────────────────────────────

function Storage({ lang }) {
  const isMobile = useIsMobile();
  return (
    <div style={{ padding: isMobile ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: isMobile ? 32 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "\uc2f1\uac00\ud3ec\ub974 \ubcf4\uad00" : "Singapore Storage"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 40, color: "#f5f0e8", fontWeight: 300, margin: "0 0 12px 0" }}>{lang === "ko" ? "\uc138\uacc4 \ucd5c\uace0 \uc218\uc900\uc758 \ubcf3\ud2b8 \ubcf4\uad00" : "World-Class Vault Storage"}</h2>
        <p style={{ fontSize: isMobile ? 13 : 15, color: "#8a7d6b", maxWidth: 600, margin: "0 auto" }}>{lang === "ko" ? "Malca-Amit \uc2f1\uac00\ud3ec\ub974 FTZ \ubcf3\ud2b8\uc5d0\uc11c \uc644\uc804 \ubc30\ubd84, \uc644\uc804 \ubcf4\ud5d8 \ubcf4\uad00." : "Fully allocated, insured storage at Malca-Amit Singapore FTZ."}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 24, marginBottom: isMobile ? 28 : 48 }}>
        {[{ icon: "\ud83d\udd10", title: lang === "ko" ? "\uc644\uc804 \ubc30\ubd84" : "Allocated", desc: lang === "ko" ? "\uace0\uc720 \uc77c\ub828\ubc88\ud638 \uc2e4\ubb3c \ubc30\ubd84." : "Specific serial-numbered allocation." }, { icon: "\ud83d\udee1\ufe0f", title: lang === "ko" ? "\uc644\uc804 \ubcf4\ud5d8" : "Insured", desc: lang === "ko" ? "Lloyd's of London \ubcf4\ud5d8 100% \ubcf4\uc7a5." : "100% Lloyd's of London coverage." }, { icon: "\ud83d\udccb", title: lang === "ko" ? "\uc815\uae30 \uac10\uc0ac" : "Audited", desc: lang === "ko" ? "\ub3c5\ub9bd\uc801 \uc81c3\uc790 \uac10\uc0ac." : "Independent third-party audits." }, { icon: "\ud83d\udcf8", title: lang === "ko" ? "\uc0ac\uc9c4 \uc99d\uba85" : "Photos", desc: lang === "ko" ? "\uace0\ud574\uc0c1\ub3c4 \uc0ac\uc9c4 \ubc0f \uc778\uc99d\uc11c." : "HD photos and certificates." }, { icon: "\ud83c\udf0f", title: "FTZ", desc: lang === "ko" ? "GST \uba74\uc81c \ubc0f \ud55c\uad6d VAT \ud68c\ud53c." : "No GST, avoids Korean VAT." }, { icon: "\u26a1", title: lang === "ko" ? "\uc989\uc2dc \uc720\ub3d9\ud654" : "Liquid", desc: lang === "ko" ? "\uc6d0\ud074\ub9ad \ub9e4\ub3c4, \uc6d0\ud654 \uc218\ub839." : "One-click sell, receive KRW." }].map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 16 : 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{x.icon}</div>
            <h3 style={{ fontSize: isMobile ? 14 : 16, color: "#f5f0e8", margin: "0 0 6px 0" }}>{x.title}</h3>
            <p style={{ fontSize: 12, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.desc}</p>
          </div>
        ))}
      </div>
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 40, overflowX: "auto" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c5a572", fontWeight: 400, margin: "0 0 20px 0" }}>{lang === "ko" ? "\ubcf4\uad00 \uc218\uc218\ub8cc" : "Storage Fees"}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead><tr style={{ borderBottom: "1px solid #2a2318" }}>{[lang === "ko" ? "\ubcf4\uad00 \uac00\uce58" : "Value", lang === "ko" ? "\uc5f0\uac04" : "Annual", lang === "ko" ? "\ucd5c\uc18c" : "Min"].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 0", color: "#8a7d6b", fontSize: 12 }}>{h}</th>)}</tr></thead>
          <tbody>{[["< $50K", "0.80%", "$12/mo"], ["$50K\u2013$250K", "0.65%", lang === "ko" ? "\uba74\uc81c" : "Waived"], ["> $250K", "0.50%", lang === "ko" ? "\uba74\uc81c" : "Waived"]].map((row, i) => (<tr key={i} style={{ borderBottom: "1px solid #1a1510" }}><td style={{ padding: "12px 0", color: "#f5f0e8", fontSize: 13 }}>{row[0]}</td><td style={{ padding: "12px 0", color: "#c5a572", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{row[1]}</td><td style={{ padding: "12px 0", color: "#8a7d6b", fontSize: 13 }}>{row[2]}</td></tr>))}</tbody>
        </table>
      </div>
    </div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────────────────────────

function Dashboard({ lang, prices, krwRate }) {
  const isMobile = useIsMobile();
  const totalGoldOz = HOLDINGS.filter(h => h.metal === "gold").reduce((acc, h) => acc + parseFloat(h.weight), 0);
  const totalSilverOz = HOLDINGS.filter(h => h.metal === "silver").reduce((acc, h) => acc + parseFloat(h.weight), 0);
  const totalValue = totalGoldOz * prices.gold + totalSilverOz * prices.silver;
  const totalCost = HOLDINGS.reduce((acc, h) => acc + h.purchasePrice, 0);
  const totalPnL = totalValue - totalCost;
  const getCurrentValue = (h) => h.metal === "gold" ? prices.gold * parseFloat(h.weight) : prices.silver * parseFloat(h.weight);
  return (
    <div style={{ padding: isMobile ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 24, flexDirection: isMobile ? "column" : "row", gap: isMobile ? 12 : 0 }}>
        <div><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 4px 0" }}>{lang === "ko" ? "\ub0b4 \ubcf4\uc720\uc790\uc0b0" : "My Holdings"}</h2><p style={{ fontSize: 12, color: "#8a7d6b", margin: 0 }}>Malca-Amit Singapore FTZ</p></div>
        <button style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: 600, borderRadius: 4, cursor: "pointer", width: isMobile ? "100%" : "auto" }}>+ {lang === "ko" ? "\uad6c\ub9e4" : "Buy More"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4,1fr)", gap: isMobile ? 10 : 16, marginBottom: 24 }}>
        {[{ label: lang === "ko" ? "\uc5ed \uac00\uce58" : "Total Value", value: fUSD(totalValue), sub: fKRW(totalValue * krwRate), color: "#c5a572" }, { label: lang === "ko" ? "\uae08" : "Gold", value: `${totalGoldOz.toFixed(2)} oz`, sub: fUSD(totalGoldOz * prices.gold), color: "#c5a572" }, { label: lang === "ko" ? "\uc740" : "Silver", value: `${totalSilverOz.toFixed(0)} oz`, sub: fUSD(totalSilverOz * prices.silver), color: "#aaa" }, { label: "P&L", value: `${totalPnL >= 0 ? "+" : ""}${fUSD(totalPnL)}`, sub: `${totalCost > 0 ? ((totalPnL / totalCost) * 100).toFixed(1) : "0"}%`, color: totalPnL >= 0 ? "#4ade80" : "#f87171" }].map((card, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: isMobile ? 12 : 20 }}>
            <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 6 }}>{card.label}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 14 : 20, color: card.color, fontWeight: 600 }}>{card.value}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666", marginTop: 3 }}>{card.sub}</div>
          </div>
        ))}
      </div>
      {isMobile ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HOLDINGS.map(h => { const cur = getCurrentValue(h); const pnl = cur - h.purchasePrice; return (
            <div key={h.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}><div style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{h.product}</div><button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "4px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>{lang === "ko" ? "\ub9e4\ub3c4" : "Sell"}</button></div>
              <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 8 }}>{h.serial} \u00b7 {h.weight}</div>
              <div style={{ display: "flex", justifyContent: "space-between" }}>
                <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "\ub9e4\uc218\uac00" : "Buy"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#ddd" }}>{fUSD(h.purchasePrice)}</div></div>
                <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "\ud604\uc7ac\uac00" : "Now"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fUSD(cur)}</div></div>
                <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>P&L</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: pnl >= 0 ? "#4ade80" : "#f87171" }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</div></div>
              </div>
            </div>
          ); })}
        </div>
      ) : (
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#0d0b08" }}>{["Product", "Serial", "Buy Price", "Current", "P&L", "Vault", ""].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 14px", color: "#8a7d6b", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>)}</tr></thead>
            <tbody>{HOLDINGS.map(h => { const cur = getCurrentValue(h); const pnl = cur - h.purchasePrice; return (
              <tr key={h.id} style={{ borderBottom: "1px solid #1a1510" }}>
                <td style={{ padding: 14, color: "#f5f0e8", fontSize: 13 }}><div>{h.product}</div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{h.weight} \u00b7 {h.purchaseDate}</div></td>
                <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#8a7d6b", fontSize: 12 }}>{h.serial}</td>
                <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#ddd", fontSize: 13 }}>{fUSD(h.purchasePrice)}</td>
                <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#c5a572", fontSize: 13 }}>{fUSD(cur)}</td>
                <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: pnl >= 0 ? "#4ade80" : "#f87171", fontSize: 13 }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</td>
                <td style={{ padding: 14, fontSize: 11, color: "#8a7d6b" }}>\ud83c\uddf8\ud83c\uddec Malca-Amit</td>
                <td style={{ padding: 14 }}><button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "5px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Sell</button></td>
              </tr>
            ); })}</tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// ─── TASK 3 — Education Hub ───────────────────────────────────────────────────────────────────────

function Learn({ lang, setPage }) {
  const isMobile = useIsMobile();
  const [activeCategory, setActiveCategory] = useState("\uc804\uccb4");
  const [openArticleId, setOpenArticleId] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const filtered = activeCategory === "\uc804\uccb4" ? EDUCATION_ARTICLES : EDUCATION_ARTICLES.filter((a) => a.category === activeCategory);
  const selectedArticle = EDUCATION_ARTICLES.find((a) => a.id === openArticleId);
  const openModal = (id) => { setOpenArticleId(id); setModalVisible(true); document.body.style.overflow = "hidden"; };
  const closeModal = () => { setModalVisible(false); document.body.style.overflow = ""; setTimeout(() => setOpenArticleId(null), 200); };
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") closeModal(); };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);
  const catLabels = { "\uc804\uccb4": lang === "ko" ? "\uc804\uccb4" : "All", "\uae30\ucd08": lang === "ko" ? "\uae30\ucd08" : "Basics", "\uac00\uaca9": lang === "ko" ? "\uac00\uaca9" : "Pricing", "\uad6c\ub9e4": lang === "ko" ? "\uad6c\ub9e4" : "Buying", "\ubcf4\uad00": lang === "ko" ? "\ubcf4\uad00" : "Storage", "\uc138\uae08\u00b7\ubc95\ub960": lang === "ko" ? "\uc138\uae08\u00b7\ubc95\ub960" : "Tax & Legal", "\uc6a9\uc5b4\uc9d1": lang === "ko" ? "\uc6a9\uc5b4\uc9d1" : "Glossary" };
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ background: "linear-gradient(135deg,#0a0a0a,#1a1510 50%,#0a0a0a)", padding: isMobile ? "40px 16px 28px" : "56px 80px 36px", textAlign: "center", borderBottom: "1px solid #1a1510" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 12 }}>{lang === "ko" ? "\uad50\uc721 \ud5c8\ube0c" : "Education Hub"}</div>
        <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 30 : 44, color: "#f5f0e8", fontWeight: 300, margin: "0 0 14px 0" }}>{lang === "ko" ? "\uae08 \ud22c\uc790 \uad50\uc721" : "Gold Investment Education"}</h1>
        <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 15, color: "#8a7d6b", maxWidth: 500, margin: "0 auto 24px", lineHeight: 1.7 }}>{lang === "ko" ? "\uc2e4\ubb3c \uae08\u00b7\uc740 \ud22c\uc790\uc5d0 \ud544\uc694\ud55c \ubaa8\ub4e0 \uc9c0\uc2dd\uc744 \ubb34\ub8cc\ub85c \uc81c\uacf5\ud569\ub2c8\ub2e4" : "Everything you need to know about physical gold and silver investing \u2014 free."}</p>
        <div style={{ display: "flex", gap: 10, justifyContent: "center", flexWrap: "wrap" }}>
          {[{ icon: "\ud83d\udcd6", text: lang === "ko" ? "6\uac1c \uc2ec\uce35 \uac00\uc774\ub4dc" : "6 In-Depth Guides" }, { icon: "\ud83c\udf93", text: lang === "ko" ? "\ucd08\ubcf4\uc790\ubd80\ud130 \uc804\ubb38\uac00\uae4c\uc9c0" : "Beginner to Advanced" }, { icon: "\ud83c\udd93", text: lang === "ko" ? "\uc644\uc804 \ubb34\ub8cc" : "Completely Free" }].map((x, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", background: "#111008", border: "1px solid #1a1510", padding: "6px 14px", borderRadius: 20 }}><span>{x.icon}</span>{x.text}</div>
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "20px 16px 0" : "24px 80px 0", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap", paddingBottom: 20 }}>
          {EDUCATION_CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setActiveCategory(cat)} style={{ background: activeCategory === cat ? "#c5a572" : "transparent", color: activeCategory === cat ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${activeCategory === cat ? "#c5a572" : "#2a2318"}`, padding: "7px 18px", borderRadius: 20, cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", fontWeight: activeCategory === cat ? 600 : 400, transition: "all 0.15s" }}>{catLabels[cat] || cat}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: isMobile ? "24px 16px 48px" : "32px 80px 60px" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(auto-fill,minmax(300px,1fr))", gap: isMobile ? 14 : 20 }}>
          {filtered.map((article) => (
            <button key={article.id} onClick={() => openModal(article.id)} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? 20 : 24, cursor: "pointer", textAlign: "left", width: "100%", transition: "border-color 0.2s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "rgba(197,165,114,0.35)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#1a1510"; }}>
              <div style={{ fontSize: isMobile ? 32 : 36, marginBottom: 14 }}>{article.emoji}</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{catLabels[article.category] || article.category} \u00b7 {article.readTime} {lang === "ko" ? "\uc77d\uae30" : "read"}</div>
              <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 19 : 21, color: "#f5f0e8", fontWeight: 500, margin: "0 0 8px 0", lineHeight: 1.3 }}>{article.title}</h3>
              <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", margin: "0 0 16px 0", lineHeight: 1.5 }}>{article.subtitle}</p>
              <div style={{ display: "flex", alignItems: "center", gap: 4, fontSize: 12, color: "#c5a572", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "\uc77d\uae30" : "Read"} \u2192</div>
            </button>
          ))}
        </div>
      </div>
      {selectedArticle && (
        <div onClick={closeModal} style={{ position: "fixed", inset: 0, zIndex: 1000, background: "rgba(0,0,0,0.82)", backdropFilter: "blur(4px)", display: "flex", alignItems: "flex-start", justifyContent: "center", padding: isMobile ? "16px" : "40px 24px", overflowY: "auto", opacity: modalVisible ? 1 : 0, transition: "opacity 0.2s" }}>
          <div onClick={(e) => e.stopPropagation()} style={{ background: "#111008", border: "1px solid #2a2318", borderRadius: 16, maxWidth: 720, width: "100%", transform: modalVisible ? "translateY(0)" : "translateY(20px)", transition: "transform 0.25s ease", boxShadow: "0 32px 80px rgba(0,0,0,0.6)" }}>
            <div style={{ padding: isMobile ? "24px 20px 20px" : "30px 32px 22px", borderBottom: "1px solid #1a1510", display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: isMobile ? 36 : 42, marginBottom: 12 }}>{selectedArticle.emoji}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8, fontWeight: 600 }}>{catLabels[selectedArticle.category] || selectedArticle.category} \u00b7 {selectedArticle.readTime} {lang === "ko" ? "\uc77d\uae30" : "read"}</div>
                <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 22 : 27, color: "#f5f0e8", fontWeight: 500, margin: "0 0 6px 0", lineHeight: 1.3 }}>{selectedArticle.title}</h2>
                <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", margin: 0 }}>{selectedArticle.subtitle}</p>
              </div>
              <button onClick={closeModal} style={{ background: "#1a1510", border: "1px solid #2a2318", color: "#8a7d6b", width: 34, height: 34, borderRadius: "50%", cursor: "pointer", fontSize: 16, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>\u2715</button>
            </div>
            <div style={{ padding: isMobile ? "20px" : "28px 32px", maxHeight: "58vh", overflowY: "auto" }}>
              {selectedArticle.sections.map((section, si) => (
                <div key={si} style={{ marginBottom: 26 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 10 }}>
                    <div style={{ width: 3, height: 18, background: "#c5a572", borderRadius: 2, flexShrink: 0 }} />
                    <h3 style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 15, color: "#f5f0e8", fontWeight: 600, margin: 0 }}>{section.heading}</h3>
                  </div>
                  {section.body && <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 13 : 14, color: "#8a7d6b", lineHeight: 1.75, margin: "0 0 8px 0", paddingLeft: 13 }}>{section.body}</p>}
                  {section.bullets && (
                    <ul style={{ margin: "8px 0 0 0", padding: 0, listStyle: "none", paddingLeft: 13 }}>
                      {section.bullets.map((b, bi) => (
                        <li key={bi} style={{ display: "flex", gap: 10, fontSize: isMobile ? 12 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", lineHeight: 1.65, marginBottom: 6 }}>
                          <span style={{ color: "#c5a572", flexShrink: 0, marginTop: 1 }}>\u25b8</span><span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  {section.highlight && (
                    <div style={{ marginTop: 12, background: "rgba(197,165,114,0.06)", border: "1px solid rgba(197,165,114,0.18)", borderRadius: 8, padding: "12px 14px", marginLeft: 13 }}>
                      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 12 : 13, color: "#c5a572", margin: 0, lineHeight: 1.6 }}>\ud83d\udca1 {section.highlight}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div style={{ padding: isMobile ? "16px 20px 20px" : "18px 32px 26px", borderTop: "1px solid #1a1510", display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
              <button onClick={() => { closeModal(); setPage("shop"); }} style={{ flex: 1, background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "12px", fontSize: 14, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 8, cursor: "pointer" }}>{lang === "ko" ? "\uc9c0\uae08 \uad6c\ub9e4\ud558\uae30" : "Shop Now"}</button>
              <button onClick={closeModal} style={{ flex: 1, background: "transparent", color: "#8a7d6b", border: "1px solid #2a2318", padding: "12px", fontSize: 14, fontFamily: "'Outfit',sans-serif", borderRadius: 8, cursor: "pointer" }}>{lang === "ko" ? "\ub2eb\uae30" : "Close"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Footer ─────────────────────────────────────────────────────────────────────────────────────

function Footer({ lang }) {
  const isMobile = useIsMobile();
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1a1510", padding: isMobile ? "28px 16px 16px" : "40px 80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "2fr 1fr 1fr 1fr", gap: isMobile ? 20 : 40, marginBottom: isMobile ? 20 : 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
          </div>
          <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>{lang === "ko" ? "\uc2f1\uac00\ud3ec\ub974 Pte Ltd. \uadc0\uae08\uc18d \uaddc\uc81c \ub515\ub7ec. AML/CFT \uc900\uc218." : "Singapore Pte Ltd. Registered Dealer. AML/CFT Compliant."}</p>
        </div>
        {[{ title: lang === "ko" ? "\ub9e4\uc7a5" : "Shop", items: [lang === "ko" ? "\uae08 \ubc14" : "Gold Bars", lang === "ko" ? "\uae08 \ucf54\uc778" : "Gold Coins", lang === "ko" ? "\uc740" : "Silver"] }, { title: lang === "ko" ? "\uc815\ubcf4" : "Info", items: [lang === "ko" ? "\ubcf4\uad00" : "Storage", lang === "ko" ? "\uc218\uc218\ub8cc" : "Fees", "FAQ"] }, { title: lang === "ko" ? "\ubc95\ub960" : "Legal", items: [lang === "ko" ? "\uc774\uc6a9\uc57d\uad00" : "Terms", lang === "ko" ? "\uac1c\uc778\uc815\ubcf4" : "Privacy", "AML/KYC"] }].map((col, ci) => (
          <div key={ci}>
            <h4 style={{ fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px 0" }}>{col.title}</h4>
            {col.items.map((x, j) => <div key={j} style={{ fontSize: 12, color: "#555", marginBottom: 6, cursor: "pointer" }}>{x}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1a1510", paddingTop: 12, display: "flex", flexDirection: isMobile ? "column" : "row", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#444" }}>\u00a9 2026 Aurum Korea Pte Ltd.</span>
        <span style={{ fontSize: 10, color: "#444" }}>{lang === "ko" ? "\ud22c\uc790\uc5d0\ub294 \uc704\ud5d8\uc774 \ub530\ub985\ub2c8\ub2e4. \uacfc\uac70 \uc218\uc775\ub960\uc774 \ubbf8\ub798 \uc218\uc775\uc744 \ubcf4\uc7a5\ud558\uc9c0 \uc54a\uc2b5\ub2c8\ub2e4." : "Investing involves risk. Past performance does not guarantee future returns."}</span>
      </div>
    </footer>
  );
}

// ─── Root App ─────────────────────────────────────────────────────────────────────────────────────

export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("ko");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const { prices, krwRate, priceError } = useLivePrices();
  useEffect(() => { window.scrollTo(0, 0); }, [page]);
  return (
    <div style={{ background: "#0a0a0a", color: "#f5f0e8", minHeight: "100vh", fontFamily: "'Outfit',sans-serif" }}>
      {priceError && <div style={{ background: "#1a0a0a", borderBottom: "1px solid #f87171", padding: "6px 20px", fontSize: 11, color: "#f87171", textAlign: "center" }}>{priceError}</div>}
      <Ticker lang={lang} prices={prices} krwRate={krwRate} />
      <Nav page={page} setPage={setPage} lang={lang} setLang={setLang} isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      {page === "home" && <Home lang={lang} setPage={setPage} prices={prices} krwRate={krwRate} />}
      {page === "shop" && <Shop lang={lang} setPage={setPage} setProduct={setSelectedProduct} prices={prices} krwRate={krwRate} />}
      {page === "product" && <ProductPage product={selectedProduct} lang={lang} setPage={setPage} prices={prices} krwRate={krwRate} isLoggedIn={isLoggedIn} />}
      {page === "why" && <WhyGold lang={lang} setPage={setPage} />}
      {page === "storage" && <Storage lang={lang} />}
      {page === "learn" && <Learn lang={lang} setPage={setPage} />}
      {page === "dashboard" && <Dashboard lang={lang} prices={prices} krwRate={krwRate} />}
      <Footer lang={lang} />
    </div>
  );
}
