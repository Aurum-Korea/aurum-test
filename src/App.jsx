import { useState, useEffect } from "react";

const SPOT_PRICES = { gold: 2347.80, silver: 28.45, platinum: 982.30 };
const KRW_RATE = 1365.20;

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

const WHY_GOLD = [
  { title: "김치 프리미엄 절약", titleEn: "Save on Kimchi Premium", icon: "💰", desc: "한국 KRX 금 시장은 지속적으로 5-15% 프리미엄이 붙습니다. 글로벌 현물가로 구매하여 즉시 절약하세요.", descEn: "The Korean KRX gold market consistently carries a 5-15% premium. Buy at global spot prices and save immediately." },
  { title: "세금 혜택", titleEn: "Tax Advantages", icon: "🏛️", desc: "싱가포르에 보관하는 동안 한국 부가가치세와 관세가 면제됩니다.", descEn: "No Korean VAT or customs duties while stored in Singapore." },
  { title: "관할권 다변화", titleEn: "Jurisdictional Diversification", icon: "🌏", desc: "세계적 수준의 싱가포르 볼트에 안전하게 보관하여 지정학적 리스크를 분산하세요.", descEn: "Diversify geopolitical risk by securely storing in world-class Singapore vaults." },
  { title: "원화 헤지", titleEn: "KRW Hedge", icon: "📊", desc: "금은 수세기 동안 통화 가치 하락에 대한 검증된 헤지 수단입니다.", descEn: "Gold has been a proven hedge against currency devaluation for centuries." },
  { title: "완전 배분 소유", titleEn: "Fully Allocated Ownership", icon: "🔒", desc: "귀하의 금은 고유 일련번호가 있는 실물 바와 코인으로 완전 배분됩니다.", descEn: "Your gold is fully allocated as specific serial-numbered bars and coins." },
  { title: "즉시 유동화", titleEn: "Instant Liquidity", icon: "⚡", desc: "언제든지 원클릭으로 보유 자산을 시장가에 매도하고 원화로 수령하세요.", descEn: "Sell your holdings at market price with one click anytime and receive KRW." },
];

const NEWS = [
  { date: "2026-04-08", title: "Gold Reaches $2,350 as Central Banks Continue Buying", ko: "중앙은행 매수 지속으로 금값 $2,350 도달" },
  { date: "2026-04-07", title: "Silver Demand Surges on Green Energy Push", ko: "그린 에너지 수요로 은 수요 급증" },
  { date: "2026-04-05", title: "Korean Won Weakens Against Dollar — Gold Hedge Interest Grows", ko: "원화 약세 지속 — 금 헤지 관심 증가" },
  { date: "2026-04-03", title: "Singapore Vaults Report Record Inflows from Asian Investors", ko: "싱가포르 볼트, 아시아 투자자 유입 사상 최고 기록" },
];

// --- Helpers ---
function getPrice(p) {
  const spot = p.metal === "gold" ? SPOT_PRICES.gold : SPOT_PRICES.silver;
  const mult = p.weight.includes("kg") ? 32.1507 : parseFloat(p.weight);
  return spot * mult * (1 + p.premium);
}
function fUSD(n) { return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(n); }
function fKRW(n) { return new Intl.NumberFormat("ko-KR", { style: "currency", currency: "KRW", maximumFractionDigits: 0 }).format(n); }

function useM() {
  const [m, setM] = useState(false);
  useEffect(() => { const c = () => setM(window.innerWidth < 768); c(); window.addEventListener("resize", c); return () => window.removeEventListener("resize", c); }, []);
  return m;
}

// --- Shared style helper ---
function px(mobile) { return mobile ? "16px" : "clamp(24px, 5vw, 80px)"; }

// --- Price Ticker ---
function Ticker({ lang }) {
  const m = useM();
  const [, setT] = useState(0);
  useEffect(() => { const i = setInterval(() => setT(t => t + 1), 3000); return () => clearInterval(i); }, []);
  const j = b => b + (Math.random() - 0.5) * b * 0.001;
  const items = [
    { l: lang === "ko" ? "금" : "XAU", p: j(SPOT_PRICES.gold), c: "+0.42%", u: true },
    { l: lang === "ko" ? "은" : "XAG", p: j(SPOT_PRICES.silver), c: "+1.15%", u: true },
    { l: lang === "ko" ? "백금" : "XPT", p: j(SPOT_PRICES.platinum), c: "-0.23%", u: false },
    { l: "KRW", p: j(KRW_RATE), c: "+0.18%", u: true },
  ];
  return (
    <div style={{ background: "linear-gradient(90deg,#0d0d0d,#1a1510,#0d0d0d)", borderBottom: "1px solid #2a2318", padding: m ? "8px 12px" : "10px 0", overflow: "hidden" }}>
      <div style={{ display: "flex", justifyContent: m ? "space-between" : "center", gap: m ? 8 : 48, fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 10 : 13, flexWrap: m ? "wrap" : "nowrap" }}>
        {items.map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 4, whiteSpace: "nowrap" }}>
            <span style={{ color: "#8a7d6b" }}>{x.l}</span>
            <span style={{ color: "#c5a572", fontWeight: 600 }}>${x.p.toFixed(2)}</span>
            <span style={{ color: x.u ? "#4ade80" : "#f87171", fontSize: m ? 8 : 11 }}>{x.c}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Nav ---
function Nav({ page, setPage, lang, setLang, isLoggedIn, setIsLoggedIn }) {
  const m = useM();
  const [open, setOpen] = useState(false);
  const links = [
    { k: "shop", l: lang === "ko" ? "매장" : "Shop" },
    { k: "why", l: lang === "ko" ? "왜 금인가" : "Why Gold" },
    { k: "storage", l: lang === "ko" ? "보관" : "Storage" },
    { k: "learn", l: lang === "ko" ? "교육" : "Learn" },
  ];
  const go = k => { setPage(k); setOpen(false); };
  const Logo = () => (
    <div style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer" }} onClick={() => go("home")}>
      <div style={{ width: m ? 30 : 36, height: m ? 30 : 36, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: m ? 13 : 16, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
      <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 17 : 22, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
    </div>
  );

  if (m) return (
    <>
      <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 16px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 56 }}>
        <Logo />
        <button onClick={() => setOpen(!open)} style={{ background: "none", border: "none", color: "#c5a572", fontSize: 22, cursor: "pointer" }}>{open ? "✕" : "☰"}</button>
      </nav>
      {open && (
        <div style={{ position: "fixed", top: 56, left: 0, right: 0, bottom: 0, background: "#0a0a0a", zIndex: 999, padding: 24, display: "flex", flexDirection: "column", gap: 8 }}>
          {links.map(x => (
            <button key={x.k} onClick={() => go(x.k)} style={{ background: page === x.k ? "rgba(197,165,114,0.1)" : "none", border: "none", color: page === x.k ? "#c5a572" : "#8a7d6b", fontSize: 18, fontFamily: "'Outfit',sans-serif", padding: "14px 0", textAlign: "left", cursor: "pointer", borderBottom: "1px solid #1a1510" }}>{x.l}</button>
          ))}
          <div style={{ marginTop: 16, display: "flex", gap: 8 }}>
            {isLoggedIn && <button onClick={() => go("dashboard")} style={{ flex: 1, background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "10px", borderRadius: 4, fontSize: 14, cursor: "pointer" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</button>}
            <button onClick={() => { setIsLoggedIn(!isLoggedIn); setOpen(false); }} style={{ flex: 1, background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "10px", borderRadius: 4, fontSize: 14, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "로그아웃" : "Logout") : (lang === "ko" ? "로그인" : "Login")}</button>
            <button onClick={() => { setLang(lang === "en" ? "ko" : "en"); setOpen(false); }} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "10px 14px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "한국어" : "EN"}</button>
          </div>
        </div>
      )}
    </>
  );

  return (
    <nav style={{ background: "#0a0a0a", borderBottom: "1px solid #1a1510", padding: "0 40px", display: "flex", alignItems: "center", justifyContent: "space-between", height: 64 }}>
      <Logo />
      <div style={{ display: "flex", gap: 28, alignItems: "center" }}>
        {links.map(x => (
          <button key={x.k} onClick={() => setPage(x.k)} style={{ background: "none", border: "none", color: page === x.k ? "#c5a572" : "#8a7d6b", cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif", letterSpacing: 1, textTransform: "uppercase" }}>{x.l}</button>
        ))}
        <div style={{ width: 1, height: 20, background: "#2a2318" }} />
        {isLoggedIn && <button onClick={() => setPage("dashboard")} style={{ background: "none", border: "1px solid #c5a572", color: "#c5a572", padding: "6px 16px", borderRadius: 4, fontSize: 13, cursor: "pointer" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</button>}
        <button onClick={() => setIsLoggedIn(!isLoggedIn)} style={{ background: isLoggedIn ? "transparent" : "linear-gradient(135deg,#c5a572,#8a6914)", border: isLoggedIn ? "1px solid #333" : "none", color: isLoggedIn ? "#888" : "#0a0a0a", padding: "6px 16px", borderRadius: 4, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>{isLoggedIn ? (lang === "ko" ? "로그아웃" : "Logout") : (lang === "ko" ? "로그인" : "Login")}</button>
        <button onClick={() => setLang(lang === "en" ? "ko" : "en")} style={{ background: "none", border: "1px solid #2a2318", color: "#8a7d6b", padding: "4px 10px", borderRadius: 4, fontSize: 12, cursor: "pointer" }}>{lang === "en" ? "한국어" : "EN"}</button>
      </div>
    </nav>
  );
}

// --- Home ---
function Home({ lang, setPage }) {
  const m = useM();
  return (
    <div>
      {/* Hero */}
      <div style={{ position: "relative", minHeight: m ? 400 : 520, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: m ? "32px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: m ? "100%" : 640 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: m ? 11 : 13, color: "#c5a572", letterSpacing: m ? 2 : 4, textTransform: "uppercase", marginBottom: m ? 12 : 20 }}>
            {lang === "ko" ? "싱가포르 보관 · 글로벌 가격 · 한국 고객" : "Singapore Vaulted · Global Pricing · Korea Focused"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 32 : 52, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.15, margin: "0 0 20px 0" }}>
            {lang === "ko" ? (<><span style={{ color: "#c5a572", fontWeight: 600 }}>김치 프리미엄</span> 없이<br />금을 소유하세요</>) : (<>Own Gold<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Without the</span><br />Kimchi Premium</>)}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: m ? 14 : 17, color: "#8a7d6b", lineHeight: 1.7, margin: "0 0 28px 0" }}>
            {lang === "ko" ? "글로벌 현물가에 실물 금·은을 구매하고 세계 최고 수준의 싱가포르 볼트에 안전하게 보관하세요. 한국 VAT·관세 면제." : "Buy physical gold and silver at global spot prices. Stored securely in world-class Singapore vaults. No Korean VAT or customs duties."}
          </p>
          <div style={{ display: "flex", gap: 12, flexDirection: m ? "column" : "row" }}>
            <button onClick={() => setPage("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: m ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer", letterSpacing: 1 }}>{lang === "ko" ? "매장 둘러보기" : "Browse Shop"}</button>
            <button onClick={() => setPage("why")} style={{ background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: m ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>{lang === "ko" ? "왜 금인가?" : "Why Gold?"}</button>
          </div>
        </div>
      </div>
      {/* Savings Strip */}
      <div style={{ background: "#111008", padding: m ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "flex", flexDirection: m ? "column" : "row", justifyContent: "space-between", alignItems: m ? "stretch" : "center", gap: m ? 20 : 0 }}>
          <div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{lang === "ko" ? "김치 프리미엄 비교" : "Kimchi Premium Comparison"}</div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 22 : 28, color: "#f5f0e8" }}>{lang === "ko" ? "1온스 금 구매 시 절약 금액" : "Your Savings on 1oz Gold"}</div>
          </div>
          <div style={{ display: "flex", gap: m ? 10 : 40, flexWrap: "wrap" }}>
            <div style={{ textAlign: "center", flex: m ? 1 : "none", minWidth: m ? 0 : "auto" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>KRX</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 16 : 24, color: "#f87171" }}>{fKRW(SPOT_PRICES.gold * KRW_RATE * 1.10)}</div>
              <div style={{ fontSize: 10, color: "#f87171" }}>~10%</div>
            </div>
            <div style={{ textAlign: "center", flex: m ? 1 : "none" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 4 }}>AURUM</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 16 : 24, color: "#4ade80" }}>{fKRW(SPOT_PRICES.gold * KRW_RATE * 1.035)}</div>
              <div style={{ fontSize: 10, color: "#4ade80" }}>3.5%</div>
            </div>
            <div style={{ textAlign: "center", flex: m ? "1 1 100%" : "none", background: "rgba(74,222,128,0.08)", padding: "8px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)" }}>
              <div style={{ fontSize: 11, color: "#4ade80", marginBottom: 4 }}>{lang === "ko" ? "절약" : "Save"}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(SPOT_PRICES.gold * KRW_RATE * 0.065)}</div>
            </div>
          </div>
        </div>
      </div>
      {/* Trust */}
      <div style={{ background: "#0a0a0a", padding: m ? "24px 16px" : "40px 80px", display: "flex", justifyContent: "center", gap: m ? 16 : 64, flexWrap: "wrap" }}>
        {[{ i: "🏦", l: "Malca-Amit" }, { i: "📜", l: "LBMA" }, { i: "🛡️", l: lang === "ko" ? "완전 보험" : "Insured" }, { i: "🔐", l: lang === "ko" ? "완전 배분" : "Allocated" }, { i: "🇸🇬", l: "Singapore" }].map((x, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: m ? 11 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}><span style={{ fontSize: m ? 16 : 20 }}>{x.i}</span>{x.l}</div>
        ))}
      </div>
      {/* News */}
      <div style={{ background: "#111008", padding: m ? "24px 16px" : "32px 80px", borderTop: "1px solid #1a1510" }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 16 }}>{lang === "ko" ? "최신 뉴스" : "Latest News"}</div>
        {NEWS.map((n, i) => (
          <div key={i} style={{ display: "flex", alignItems: m ? "flex-start" : "center", gap: m ? 8 : 16, padding: "10px 0", borderBottom: i < NEWS.length - 1 ? "1px solid #1a1510" : "none", flexDirection: m ? "column" : "row" }}>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#555", whiteSpace: "nowrap" }}>{n.date}</span>
            <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: m ? 13 : 15, color: "#ddd" }}>{lang === "ko" ? n.ko : n.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Shop ---
function Shop({ lang, setPage, setProduct }) {
  const m = useM();
  const [metal, setMetal] = useState("all");
  const [type, setType] = useState("all");
  const filtered = PRODUCTS.filter(p => (metal === "all" || p.metal === metal) && (type === "all" || p.type === type));
  const Btn = ({ active, onClick, children }) => (
    <button onClick={onClick} style={{ background: active ? "#c5a572" : "transparent", color: active ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${active ? "#c5a572" : "#2a2318"}`, padding: m ? "6px 14px" : "8px 20px", borderRadius: 4, cursor: "pointer", fontSize: m ? 12 : 13, fontFamily: "'Outfit',sans-serif", fontWeight: active ? 600 : 400 }}>{children}</button>
  );
  return (
    <div style={{ padding: m ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 26 : 36, color: "#f5f0e8", fontWeight: 300, margin: "0 0 6px 0" }}>{lang === "ko" ? "귀금속 매장" : "Precious Metals Shop"}</h2>
      <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: m ? 12 : 14, color: "#8a7d6b", margin: "0 0 24px 0" }}>{lang === "ko" ? "글로벌 현물가 + 투명한 프리미엄" : "Global spot + transparent premium"}</p>
      <div style={{ display: "flex", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
        <Btn active={metal === "all"} onClick={() => setMetal("all")}>{lang === "ko" ? "전체" : "All"}</Btn>
        <Btn active={metal === "gold"} onClick={() => setMetal("gold")}>{lang === "ko" ? "금" : "Gold"}</Btn>
        <Btn active={metal === "silver"} onClick={() => setMetal("silver")}>{lang === "ko" ? "은" : "Silver"}</Btn>
        <div style={{ width: 1, height: 28, background: "#2a2318", alignSelf: "center", margin: "0 4px" }} />
        <Btn active={type === "all"} onClick={() => setType("all")}>{lang === "ko" ? "전체" : "All"}</Btn>
        <Btn active={type === "bar"} onClick={() => setType("bar")}>{lang === "ko" ? "바" : "Bars"}</Btn>
        <Btn active={type === "coin"} onClick={() => setType("coin")}>{lang === "ko" ? "코인" : "Coins"}</Btn>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(auto-fill,minmax(280px,1fr))", gap: m ? 16 : 24 }}>
        {filtered.map(p => { const price = getPrice(p); return (
          <div key={p.id} onClick={() => { setProduct(p); setPage("product"); }} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 16 : 24, cursor: "pointer", position: "relative" }}>
            <span style={{ position: "absolute", top: 10, right: 10, background: p.metal === "gold" ? "rgba(197,165,114,0.15)" : "rgba(180,180,180,0.15)", color: p.metal === "gold" ? "#c5a572" : "#aaa", fontSize: 10, padding: "2px 6px", borderRadius: 3 }}>{p.type === "bar" ? (lang === "ko" ? "바" : "Bar") : (lang === "ko" ? "코인" : "Coin")}</span>
            <div style={{ fontSize: m ? 36 : 48, marginBottom: 12 }}>{p.image}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: m ? 13 : 14, color: "#f5f0e8", fontWeight: 500, marginBottom: 3 }}>{lang === "ko" ? p.nameKo : p.name}</div>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginBottom: 12 }}>{p.mint} · {p.purity} · {p.weight}</div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
              <div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 16 : 18, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666" }}>{fKRW(price * KRW_RATE)}</div>
              </div>
              <div style={{ fontSize: 10, color: "#8a7d6b" }}>+{(p.premium * 100).toFixed(1)}%</div>
            </div>
          </div>
        ); })}
      </div>
    </div>
  );
}

// --- Product ---
function Product({ product: p, lang, setPage }) {
  const m = useM();
  const [stor, setStor] = useState("singapore");
  const [qty, setQty] = useState(1);
  if (!p) return null;
  const price = getPrice(p); const tot = price * qty; const ship = stor === "korea" ? tot * 0.18 : 0;
  return (
    <div style={{ padding: m ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <button onClick={() => setPage("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, marginBottom: 20 }}>← {lang === "ko" ? "매장으로" : "Back to Shop"}</button>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 24 : 60 }}>
        <div style={{ background: "#111008", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", minHeight: m ? 200 : 400, border: "1px solid #1a1510" }}><div style={{ fontSize: m ? 80 : 120 }}>{p.image}</div></div>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{p.mint}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 24 : 32, color: "#f5f0e8", fontWeight: 400, margin: "0 0 6px 0" }}>{lang === "ko" ? p.nameKo : p.name}</h1>
          <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 20 }}>{p.purity} · {p.weight}</div>
          {/* Price breakdown */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 16 : 24, marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "현물가" : "Spot"}</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#ddd" }}>{fUSD(price / (1 + p.premium))}</span></div>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}><span style={{ fontSize: 13, color: "#8a7d6b" }}>{lang === "ko" ? "프리미엄" : "Premium"} ({(p.premium * 100).toFixed(1)}%)</span><span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572" }}>+{fUSD(price - price / (1 + p.premium))}</span></div>
            <div style={{ borderTop: "1px solid #2a2318", paddingTop: 10, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 600 }}>{lang === "ko" ? "단가" : "Price"}</span>
              <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 18 : 22, color: "#c5a572", fontWeight: 600 }}>{fUSD(price)}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW(price * KRW_RATE)}</div></div>
            </div>
          </div>
          {/* Storage */}
          <div style={{ marginBottom: 20 }}>
            <div style={{ fontSize: 12, color: "#8a7d6b", marginBottom: 8 }}>{lang === "ko" ? "보관 옵션" : "Storage"}</div>
            <div style={{ display: "flex", gap: 10, flexDirection: m ? "column" : "row" }}>
              {[{ k: "singapore", l: lang === "ko" ? "🇸🇬 싱가포르 보관" : "🇸🇬 Singapore", s: lang === "ko" ? "VAT 면제" : "No VAT" },
                { k: "korea", l: lang === "ko" ? "🇰🇷 한국 배송" : "🇰🇷 Ship Korea", s: "~18% duties" }].map(o => (
                <button key={o.k} onClick={() => setStor(o.k)} style={{ flex: 1, background: stor === o.k ? "rgba(197,165,114,0.08)" : "transparent", border: `1px solid ${stor === o.k ? "#c5a572" : "#2a2318"}`, borderRadius: 8, padding: "10px 14px", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ fontSize: 13, color: "#f5f0e8", marginBottom: 2 }}>{o.l}</div>
                  <div style={{ fontSize: 11, color: stor === o.k ? "#4ade80" : "#8a7d6b" }}>{o.s}</div>
                </button>
              ))}
            </div>
          </div>
          {/* Qty */}
          <div style={{ display: "flex", alignItems: "center", gap: 16, marginBottom: 20 }}>
            <span style={{ fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? "수량" : "Qty"}</span>
            <div style={{ display: "flex", alignItems: "center", border: "1px solid #2a2318", borderRadius: 4 }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>−</button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", color: "#f5f0e8", padding: "0 12px" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", padding: "8px 12px", fontSize: 18 }}>+</button>
            </div>
          </div>
          {/* Total */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16, marginBottom: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 14, color: "#f5f0e8" }}>{lang === "ko" ? "총액" : "Total"}</span>
            <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 20 : 26, color: "#c5a572", fontWeight: 700 }}>{fUSD(tot + ship)}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#666" }}>{fKRW((tot + ship) * KRW_RATE)}</div></div>
          </div>
          <button style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: 16, fontSize: 16, fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 1 }}>{lang === "ko" ? "지금 구매하기" : "Buy Now"}</button>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 12 }}>{["💳 Toss", "🏧 Card", "₿ Crypto"].map((x, i) => <span key={i} style={{ fontSize: 11, color: "#666" }}>{x}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

// --- Why Gold ---
function WhyGold({ lang }) {
  const m = useM();
  return (
    <div style={{ padding: m ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: m ? 32 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "왜 금인가" : "Why Gold"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 28 : 40, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "실물 금 투자의 핵심 원칙" : "Core Principles of Physical Gold"}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3,1fr)", gap: m ? 16 : 24, marginBottom: m ? 32 : 60 }}>
        {WHY_GOLD.map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 20 : 32 }}>
            <div style={{ fontSize: 28, marginBottom: 12 }}>{x.icon}</div>
            <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 18 : 22, color: "#c5a572", fontWeight: 500, margin: "0 0 8px 0" }}>{lang === "ko" ? x.title : x.titleEn}</h3>
            <p style={{ fontSize: m ? 13 : 14, color: "#8a7d6b", lineHeight: 1.7, margin: 0 }}>{lang === "ko" ? x.desc : x.descEn}</p>
          </div>
        ))}
      </div>
      {/* Risk section */}
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: m ? 24 : 48 }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 22 : 28, color: "#f5f0e8", fontWeight: 300, margin: "0 0 20px 0" }}>{lang === "ko" ? "글로벌 리스크 & 자산 보전" : "Global Risks & Wealth Preservation"}</h3>
        <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "1fr 1fr", gap: m ? 16 : 32 }}>
          {[{ t: lang === "ko" ? "통화 가치 하락" : "Currency Devaluation", d: lang === "ko" ? "모든 법정화폐는 시간이 지남에 따라 구매력을 상실합니다." : "All fiat currencies lose purchasing power over time." },
            { t: lang === "ko" ? "지정학적 불확실성" : "Geopolitical Uncertainty", d: lang === "ko" ? "무역 전쟁, 지역 분쟁은 전통적 금융 자산에 위험을 초래합니다." : "Trade wars and conflicts pose risks to traditional assets." },
            { t: lang === "ko" ? "금융 시스템 리스크" : "Financial System Risk", d: lang === "ko" ? "은행 위기, 양적완화, 과도한 부채는 시스템적 취약성을 증가시킵니다." : "Banking crises and excessive debt increase systemic vulnerabilities." },
            { t: lang === "ko" ? "인플레이션 헤지" : "Inflation Hedge", d: lang === "ko" ? "중앙은행의 통화 팽창 정책에 대한 가장 검증된 보호 수단입니다." : "The most proven protection against monetary expansion." }
          ].map((x, i) => (
            <div key={i} style={{ padding: "16px 0", borderBottom: i < 2 ? "1px solid #1a1510" : "none" }}>
              <h4 style={{ fontSize: 15, color: "#c5a572", margin: "0 0 6px 0" }}>{x.t}</h4>
              <p style={{ fontSize: 13, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.d}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// --- Storage ---
function Storage({ lang }) {
  const m = useM();
  return (
    <div style={{ padding: m ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: m ? 32 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "싱가포르 보관" : "Singapore Storage"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 26 : 40, color: "#f5f0e8", fontWeight: 300, margin: "0 0 12px 0" }}>{lang === "ko" ? "세계 최고 수준의 볼트 보관" : "World-Class Vault Storage"}</h2>
        <p style={{ fontSize: m ? 13 : 15, color: "#8a7d6b", maxWidth: 600, margin: "0 auto" }}>{lang === "ko" ? "Malca-Amit 싱가포르 FTZ 볼트에서 완전 배분, 완전 보험 보관." : "Fully allocated, insured storage at Malca-Amit Singapore FTZ."}</p>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "repeat(3,1fr)", gap: m ? 12 : 24, marginBottom: m ? 28 : 48 }}>
        {[{ i: "🔐", t: lang === "ko" ? "완전 배분" : "Allocated", d: lang === "ko" ? "고유 일련번호 실물 배분." : "Specific serial-numbered allocation." },
          { i: "🛡️", t: lang === "ko" ? "완전 보험" : "Insured", d: lang === "ko" ? "Lloyd's of London 보험 100% 보장." : "100% Lloyd's of London coverage." },
          { i: "📋", t: lang === "ko" ? "정기 감사" : "Audited", d: lang === "ko" ? "독립적 제3자 감사." : "Independent third-party audits." },
          { i: "📸", t: lang === "ko" ? "사진 증명" : "Photos", d: lang === "ko" ? "고해상도 사진 및 인증서." : "HD photos and certificates." },
          { i: "🌏", t: "FTZ", d: lang === "ko" ? "GST 면제 및 한국 VAT 회피." : "No GST, avoids Korean VAT." },
          { i: "⚡", t: lang === "ko" ? "즉시 유동화" : "Liquid", d: lang === "ko" ? "원클릭 매도, 원화 수령." : "One-click sell, receive KRW." }
        ].map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 16 : 28 }}>
            <div style={{ fontSize: 28, marginBottom: 8 }}>{x.i}</div>
            <h3 style={{ fontSize: m ? 14 : 16, color: "#f5f0e8", margin: "0 0 6px 0" }}>{x.t}</h3>
            <p style={{ fontSize: 12, color: "#8a7d6b", lineHeight: 1.6, margin: 0 }}>{x.d}</p>
          </div>
        ))}
      </div>
      {/* Fee table */}
      <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: m ? 20 : 40, overflowX: "auto" }}>
        <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 22, color: "#c5a572", fontWeight: 400, margin: "0 0 20px 0" }}>{lang === "ko" ? "보관 수수료" : "Storage Fees"}</h3>
        <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 400 }}>
          <thead><tr style={{ borderBottom: "1px solid #2a2318" }}>
            {[lang === "ko" ? "보관 가치" : "Value", lang === "ko" ? "연간" : "Annual", lang === "ko" ? "최소" : "Min"].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "10px 0", color: "#8a7d6b", fontSize: 12 }}>{h}</th>)}
          </tr></thead>
          <tbody>
            {[["< $50K", "0.80%", "$12/mo"], ["$50K–$250K", "0.65%", lang === "ko" ? "면제" : "Waived"], ["> $250K", "0.50%", lang === "ko" ? "면제" : "Waived"]].map((r, i) => (
              <tr key={i} style={{ borderBottom: "1px solid #1a1510" }}>
                <td style={{ padding: "12px 0", color: "#f5f0e8", fontSize: 13 }}>{r[0]}</td>
                <td style={{ padding: "12px 0", color: "#c5a572", fontFamily: "'JetBrains Mono',monospace", fontSize: 13 }}>{r[1]}</td>
                <td style={{ padding: "12px 0", color: "#8a7d6b", fontSize: 13 }}>{r[2]}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// --- Dashboard ---
function Dashboard({ lang }) {
  const m = useM();
  const tGold = 2, tSilver = 100;
  const tVal = tGold * SPOT_PRICES.gold + tSilver * SPOT_PRICES.silver;
  return (
    <div style={{ padding: m ? "20px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: m ? "flex-start" : "center", marginBottom: 24, flexDirection: m ? "column" : "row", gap: m ? 12 : 0 }}>
        <div><h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: "0 0 4px 0" }}>{lang === "ko" ? "내 보유자산" : "My Holdings"}</h2><p style={{ fontSize: 12, color: "#8a7d6b", margin: 0 }}>Malca-Amit Singapore</p></div>
        <button style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "10px 20px", fontSize: 14, fontWeight: 600, borderRadius: 4, cursor: "pointer", width: m ? "100%" : "auto" }}>+ {lang === "ko" ? "구매" : "Buy"}</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr 1fr" : "repeat(4,1fr)", gap: m ? 10 : 16, marginBottom: 24 }}>
        {[{ l: lang === "ko" ? "총 가치" : "Total", v: fUSD(tVal), s: fKRW(tVal * KRW_RATE), c: "#c5a572" },
          { l: lang === "ko" ? "금" : "Gold", v: `${tGold} oz`, s: fUSD(tGold * SPOT_PRICES.gold), c: "#c5a572" },
          { l: lang === "ko" ? "은" : "Silver", v: `${tSilver} oz`, s: fUSD(tSilver * SPOT_PRICES.silver), c: "#aaa" },
          { l: "P&L", v: "+$142.30", s: "+1.8%", c: "#4ade80" }
        ].map((x, i) => (
          <div key={i} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 12 : 20 }}>
            <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 6 }}>{x.l}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: m ? 16 : 22, color: x.c, fontWeight: 600 }}>{x.v}</div>
            <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 11, color: "#666", marginTop: 3 }}>{x.s}</div>
          </div>
        ))}
      </div>
      {/* Holdings — card layout on mobile, table on desktop */}
      {m ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {HOLDINGS.map(h => {
            const cur = h.metal === "gold" ? SPOT_PRICES.gold * parseFloat(h.weight) : SPOT_PRICES.silver * parseFloat(h.weight);
            const pnl = cur - h.purchasePrice;
            return (
              <div key={h.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <div style={{ fontSize: 14, color: "#f5f0e8", fontWeight: 500 }}>{h.product}</div>
                  <button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "4px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>{lang === "ko" ? "매도" : "Sell"}</button>
                </div>
                <div style={{ fontSize: 11, color: "#8a7d6b", marginBottom: 8 }}>{h.serial} · {h.weight}</div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "매수가" : "Buy"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#ddd" }}>{fUSD(h.purchasePrice)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{lang === "ko" ? "현재가" : "Now"}</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{fUSD(cur)}</div></div>
                  <div><div style={{ fontSize: 10, color: "#8a7d6b" }}>P&L</div><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: pnl >= 0 ? "#4ade80" : "#f87171" }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</div></div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, overflow: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse", minWidth: 700 }}>
            <thead><tr style={{ background: "#0d0b08" }}>
              {["Product", "Serial", "Buy Price", "Current", "P&L", "Vault", ""].map((h, i) => <th key={i} style={{ textAlign: "left", padding: "12px 14px", color: "#8a7d6b", fontSize: 11, letterSpacing: 1, textTransform: "uppercase" }}>{h}</th>)}
            </tr></thead>
            <tbody>
              {HOLDINGS.map(h => { const cur = h.metal === "gold" ? SPOT_PRICES.gold * parseFloat(h.weight) : SPOT_PRICES.silver * parseFloat(h.weight); const pnl = cur - h.purchasePrice; return (
                <tr key={h.id} style={{ borderBottom: "1px solid #1a1510" }}>
                  <td style={{ padding: 14, color: "#f5f0e8", fontSize: 13 }}><div>{h.product}</div><div style={{ fontSize: 10, color: "#8a7d6b" }}>{h.weight}</div></td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#8a7d6b", fontSize: 12 }}>{h.serial}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#ddd", fontSize: 13 }}>{fUSD(h.purchasePrice)}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: "#c5a572", fontSize: 13 }}>{fUSD(cur)}</td>
                  <td style={{ padding: 14, fontFamily: "'JetBrains Mono',monospace", color: pnl >= 0 ? "#4ade80" : "#f87171", fontSize: 13 }}>{pnl >= 0 ? "+" : ""}{fUSD(pnl)}</td>
                  <td style={{ padding: 14, fontSize: 11, color: "#8a7d6b" }}>🇸🇬 Malca-Amit</td>
                  <td style={{ padding: 14 }}><button style={{ background: "rgba(248,113,113,0.1)", border: "1px solid rgba(248,113,113,0.3)", color: "#f87171", padding: "5px 12px", borderRadius: 4, fontSize: 11, cursor: "pointer" }}>Sell</button></td>
                </tr>
              ); })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

// --- Learn ---
function Learn({ lang }) {
  const m = useM();
  const sections = [
    { cat: lang === "ko" ? "초보자 가이드" : "Beginner's Guide", items: [
      { t: lang === "ko" ? "실물 금 vs ETF vs 종이 금" : "Physical Gold vs ETFs vs Paper", time: "8 min" },
      { t: lang === "ko" ? "금 순도 이해하기" : "Understanding Gold Purity", time: "5 min" },
      { t: lang === "ko" ? "바 vs 코인" : "Bars vs Coins: Which?", time: "6 min" },
      { t: lang === "ko" ? "김치 프리미엄 분석" : "Kimchi Premium Explained", time: "10 min" },
    ]},
    { cat: lang === "ko" ? "보관 & 보안" : "Storage & Security", items: [
      { t: lang === "ko" ? "싱가포르 보관의 장점" : "Singapore Storage Benefits", time: "7 min" },
      { t: lang === "ko" ? "완전 배분 vs 풀 저장" : "Allocated vs Pooled", time: "5 min" },
    ]},
    { cat: lang === "ko" ? "시장 분석" : "Market Analysis", items: [
      { t: lang === "ko" ? "2026년 금값 전망" : "Gold Outlook 2026", time: "12 min" },
      { t: lang === "ko" ? "중앙은행 금 매수 트렌드" : "Central Bank Buying", time: "8 min" },
    ]},
  ];
  return (
    <div style={{ padding: m ? "24px 16px" : "40px 80px", background: "#0a0a0a", minHeight: "80vh" }}>
      <div style={{ textAlign: "center", marginBottom: m ? 28 : 48 }}>
        <div style={{ fontSize: 12, color: "#c5a572", letterSpacing: 4, textTransform: "uppercase", marginBottom: 10 }}>{lang === "ko" ? "교육 센터" : "Education"}</div>
        <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: m ? 26 : 40, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "귀금속 투자 가이드" : "Investment Guide"}</h2>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "2fr 1fr", gap: m ? 20 : 32 }}>
        <div>
          {sections.map((s, si) => (
            <div key={si} style={{ marginBottom: 28 }}>
              <h3 style={{ fontSize: 14, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 12px 0" }}>{s.cat}</h3>
              {s.items.map((it, ii) => (
                <div key={ii} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: m ? "12px" : "12px 16px", background: "#111008", border: "1px solid #1a1510", borderRadius: 6, marginBottom: 6, cursor: "pointer" }}>
                  <span style={{ fontSize: m ? 13 : 14, color: "#f5f0e8" }}>{it.t}</span>
                  <span style={{ fontSize: 11, color: "#8a7d6b", whiteSpace: "nowrap", marginLeft: 8 }}>{it.time}</span>
                </div>
              ))}
            </div>
          ))}
        </div>
        <div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: m ? 16 : 24, marginBottom: 20 }}>
            <h3 style={{ fontSize: 14, color: "#c5a572", margin: "0 0 12px 0" }}>{lang === "ko" ? "오늘의 시장" : "Market Today"}</h3>
            {[{ l: lang === "ko" ? "금" : "Gold", p: fUSD(SPOT_PRICES.gold), c: "+0.42%" }, { l: lang === "ko" ? "은" : "Silver", p: fUSD(SPOT_PRICES.silver), c: "+1.15%" }, { l: "KRW", p: `₩${KRW_RATE}`, c: "+0.18%" }].map((x, i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: i < 2 ? "1px solid #1a1510" : "none" }}>
                <span style={{ fontSize: 13, color: "#ddd" }}>{x.l}</span>
                <div style={{ textAlign: "right" }}><div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 13, color: "#c5a572" }}>{x.p}</div><div style={{ fontSize: 10, color: "#4ade80" }}>{x.c}</div></div>
              </div>
            ))}
          </div>
          <div style={{ background: "rgba(197,165,114,0.05)", border: "1px solid #c5a572", borderRadius: 8, padding: m ? 16 : 24 }}>
            <h3 style={{ fontSize: 14, color: "#c5a572", margin: "0 0 6px 0" }}>{lang === "ko" ? "무료 가이드" : "Free Guide"}</h3>
            <p style={{ fontSize: 12, color: "#8a7d6b", margin: "0 0 12px 0", lineHeight: 1.5 }}>{lang === "ko" ? "한국 투자자를 위한 해외 금 투자 가이드 (PDF)" : "Offshore Gold Guide for Korean Investors (PDF)"}</p>
            <button style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: 10, fontSize: 13, fontWeight: 600, borderRadius: 4, cursor: "pointer" }}>{lang === "ko" ? "다운로드" : "Download"}</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// --- Footer ---
function Footer({ lang }) {
  const m = useM();
  return (
    <footer style={{ background: "#050505", borderTop: "1px solid #1a1510", padding: m ? "28px 16px 16px" : "40px 80px 24px" }}>
      <div style={{ display: "grid", gridTemplateColumns: m ? "1fr" : "2fr 1fr 1fr 1fr", gap: m ? 20 : 40, marginBottom: m ? 20 : 32 }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
            <div style={{ width: 24, height: 24, borderRadius: "50%", background: "linear-gradient(135deg,#c5a572,#8a6914)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: "#0a0a0a" }}>Au</div>
            <span style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 16, fontWeight: 600, color: "#c5a572", letterSpacing: 2 }}>AURUM KOREA</span>
          </div>
          <p style={{ fontSize: 11, color: "#666", lineHeight: 1.6 }}>{lang === "ko" ? "싱가포르 Pte Ltd. 귀금속 규제 딜러. AML/CFT 준수." : "Singapore Pte Ltd. Registered Dealer. AML/CFT Compliant."}</p>
        </div>
        {[{ t: lang === "ko" ? "매장" : "Shop", i: [lang === "ko" ? "금 바" : "Gold Bars", lang === "ko" ? "금 코인" : "Gold Coins", lang === "ko" ? "은 바" : "Silver Bars"] },
          { t: lang === "ko" ? "정보" : "Info", i: [lang === "ko" ? "보관" : "Storage", lang === "ko" ? "수수료" : "Fees", "FAQ"] },
          { t: lang === "ko" ? "법률" : "Legal", i: [lang === "ko" ? "이용약관" : "Terms", lang === "ko" ? "개인정보" : "Privacy", "AML/KYC"] }
        ].map((c, ci) => (
          <div key={ci}>
            <h4 style={{ fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", margin: "0 0 10px 0" }}>{c.t}</h4>
            {c.i.map((x, j) => <div key={j} style={{ fontSize: 12, color: "#555", marginBottom: 6, cursor: "pointer" }}>{x}</div>)}
          </div>
        ))}
      </div>
      <div style={{ borderTop: "1px solid #1a1510", paddingTop: 12, display: "flex", flexDirection: m ? "column" : "row", justifyContent: "space-between", gap: 6 }}>
        <span style={{ fontSize: 10, color: "#444" }}>© 2026 Aurum Korea Pte Ltd.</span>
        <span style={{ fontSize: 10, color: "#444" }}>{lang === "ko" ? "투자에는 위험이 따릅니다." : "Investing involves risk."}</span>
      </div>
    </footer>
  );
}

// --- Main App ---
export default function App() {
  const [page, setPage] = useState("home");
  const [lang, setLang] = useState("ko");
  const [loggedIn, setLoggedIn] = useState(false);
  const [product, setProduct] = useState(null);

  // Scroll to top on page change
  useEffect(() => { window.scrollTo(0, 0); }, [page]);

  return (
    <div style={{ background: "#0a0a0a", color: "#f5f0e8", minHeight: "100vh", fontFamily: "'Outfit',sans-serif" }}>
      <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;500;600&family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
      <Ticker lang={lang} />
      <Nav page={page} setPage={setPage} lang={lang} setLang={setLang} isLoggedIn={loggedIn} setIsLoggedIn={setLoggedIn} />
      {page === "home" && <Home lang={lang} setPage={setPage} />}
      {page === "shop" && <Shop lang={lang} setPage={setPage} setProduct={setProduct} />}
      {page === "product" && <Product product={product} lang={lang} setPage={setPage} />}
      {page === "why" && <WhyGold lang={lang} />}
      {page === "storage" && <Storage lang={lang} />}
      {page === "learn" && <Learn lang={lang} />}
      {page === "dashboard" && <Dashboard lang={lang} />}
      <Footer lang={lang} />
    </div>
  );
}
