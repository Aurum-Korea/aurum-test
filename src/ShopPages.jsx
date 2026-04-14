import { useState, useEffect, useCallback, useRef } from "react";
import { useIsMobile, calcPrice, fUSD, fKRW, PRODUCTS, MOCK_ORDERS_INIT, API } from "./lib.jsx";
import { NewsSection } from "./BaseUI.jsx";

// ═══════════════════════════════════════════════════════════════════════════════
// HOME
// ═══════════════════════════════════════════════════════════════════════════════
function Home({ lang, navigate, prices, krwRate }) {
  const isMobile = useIsMobile();
  // H-04: Gold tracker — 1돈 (3.75g = 3.75/31.1035 oz) units
  const DON_RATIO = 3.75 / 31.1035;
  const goldKB = prices.gold * krwRate * DON_RATIO * 1.15;   // KB Star approx (실물 시가 포함 ~15% premium)
  const goldAurum = prices.gold * krwRate * DON_RATIO * 1.05; // Aurum 5.5% card premium
  const goldSavings = goldKB - goldAurum;
  // H-05: Silver tracker — 1kg (1000g = 1000/31.1035 oz)
  const KG_RATIO = 1000 / 31.1035;
  const silverKB = (prices.silver || 32.15) * krwRate * KG_RATIO * 1.20;   // KB Star silver approx
  const silverAurum = (prices.silver || 32.15) * krwRate * KG_RATIO * 1.10; // Aurum 10% silver premium
  const silverSavings = silverKB - silverAurum;
  return (
    <div>

      {/* ── 1a. HERO ── */}
      <div style={{ position: "relative", minHeight: isMobile ? 420 : 540, background: "linear-gradient(135deg,#0a0a0a,#1a1510 40%,#0d0b08)", display: "flex", alignItems: "center", padding: isMobile ? "40px 16px" : "0 80px", overflow: "hidden" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 0.035, backgroundImage: "repeating-linear-gradient(45deg,#c5a572 0,#c5a572 1px,transparent 1px,transparent 40px)", pointerEvents: "none" }} />
        <div style={{ position: "relative", zIndex: 1, maxWidth: isMobile ? "100%" : 660 }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 10 : 12, color: "#c5a572", letterSpacing: isMobile ? 2 : 4, textTransform: "uppercase", marginBottom: isMobile ? 14 : 20 }}>
            {lang === "ko" ? "배분 보관 · 국제 현물가 · 한국 투자자 전용" : "Allocated Vault Storage · International Spot Pricing · Korean Investors"}
          </div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 34 : 54, fontWeight: 300, color: "#f5f0e8", lineHeight: 1.12, margin: "0 0 20px" }}>
            {lang === "ko"
              ? <><span style={{ color: "#c5a572", fontWeight: 600 }}>진짜 금. 진짜 은.</span><br />진짜 소유.</>
              : <>Real Gold. Real Silver.<br /><span style={{ color: "#c5a572", fontWeight: 600 }}>Real Ownership.</span></>}
          </h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: isMobile ? 14 : 16, color: "#8a7d6b", lineHeight: 1.75, margin: "0 0 30px" }}>
            {lang === "ko"
              ? "은행 통장도 아니고, KRX 계좌도 아닙니다. 싱가포르 Malca-Amit 금고에 귀하의 이름으로 등록된 실물 금속 — 국제 현물가 기준."
              : "Not a bank passbook. Not a KRX account. Allocated physical metal — registered in your name at Malca-Amit Singapore — priced at international spot."}
          </p>
          {/* H-02: 2 buttons only — duplicate removed */}
          <div style={{ display: "flex", gap: 12, flexDirection: isMobile ? "column" : "row" }}>
            <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#ffffff", border: "none", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 0.5 }}>
              {lang === "ko" ? "지금 배분 시작 →" : "Start Allocating →"}
            </button>
            <button onClick={() => navigate("agp")} style={{ background: "transparent", color: "#8a7d6b", border: "1px solid #2a2318", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
              {lang === "ko" ? "AGP — 월 20만원부터" : "AGP — From KRW 200,000/month"}
            </button>
          </div>
        </div>
      </div>

      {/* ── 1c. PAPER vs PHYSICAL ── */}
      <div style={{ background: "#111008", padding: isMobile ? "36px 16px" : "56px 80px", borderTop: "1px solid #1a1510", borderBottom: "1px solid #1a1510" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "근본적인 차이" : "THE FUNDAMENTAL DIFFERENCE"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>
            {lang === "ko" ? "금을 소유하는 두 가지 방법. 진짜는 하나입니다." : "You Can Own Gold Two Ways. Only One Is Real."}
          </h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 24 }}>
          <div style={{ background: "#0a0a0a", border: "1px solid #2a2318", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#f87171", flexShrink: 0 }} />
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#f87171", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {lang === "ko" ? "페이퍼 금·은" : "Paper Gold / Silver"}
              </div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {(lang === "ko" ? [
                "은행 금통장, KRX 계좌, 또는 펀드",
                "귀하는 계약상 청구권을 보유 — 실물 금속이 아닙니다",
                "상대방 리스크. 법적 소유권 없음. 일련번호 없음."
              ] : [
                "Bank passbook, KRX account, or fund",
                "You own a contractual claim — not the metal",
                "Counterparty risk. No legal title. No serial number."
              ]).map((b, i) => (
                <li key={i} style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 8, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
          <div style={{ background: "#0a0a0a", border: "1px solid rgba(74,222,128,0.2)", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#4ade80", flexShrink: 0 }} />
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#4ade80", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {lang === "ko" ? "실물 배분 금·은" : "Physical Allocated"}
              </div>
            </div>
            <ul style={{ margin: 0, padding: "0 0 0 18px" }}>
              {(lang === "ko" ? [
                "실물 금·은. 귀하의 이름. 귀하의 일련번호.",
                "분리 보관 — 절대 풀링되지 않음, 어떤 은행의 대차대조표에도 없음",
                "법적 소유권은 첫 날부터 귀하의 것"
              ] : [
                "Real metal. Your name. Your serial number.",
                "Segregated, never pooled, never on any bank's balance sheet",
                "Legal title is yours from day one"
              ]).map((b, i) => (
                <li key={i} style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 8, lineHeight: 1.6 }}>{b}</li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* ── Premium Comparison + H-04/05/06 Savings Trackers ── */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "24px 16px" : "32px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 14 : 24 }}>
          {/* Premium comparison left */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ko" ? "실물 프리미엄 비교" : "Physical Premium Comparison"}
            </div>
            <div style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 20 : 26, color: "#f5f0e8", marginBottom: 22, lineHeight: 1.2 }}>
              {lang === "ko" ? "왜 Aurum?" : "Why Aurum?"}
            </div>
            <div style={{ display: "flex", alignItems: "center" }}>
              <div style={{ flex: 1, textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 30 : 40, color: "#f87171", fontWeight: 700, lineHeight: 1 }}>10%</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", marginTop: 6 }}>{lang === "ko" ? "KRX 실물 프리미엄" : "KRX Premium"}</div>
              </div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 20, color: "#333", padding: "0 8px" }}>vs</div>
              <div style={{ flex: 1, textAlign: "center", padding: "12px 0" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 30 : 40, color: "#4ade80", fontWeight: 700, lineHeight: 1 }}>3.5%</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#8a7d6b", marginTop: 6 }}>{lang === "ko" ? "Aurum 프리미엄" : "Aurum Premium"}</div>
              </div>
            </div>
          </div>

          {/* H-04: Gold 1돈 tracker — RIGHT */}
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ko" ? "금 1돈 구매 시 절약 금액" : "Savings on 1 Don Gold (3.75g)"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: lang === "ko" ? "한국 실물 시가" : "Korean Market", val: fKRW(goldKB), col: "#f87171" },
                { label: lang === "ko" ? "아름 실물가" : "Aurum Price", val: fKRW(goldAurum), col: "#4ade80" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{x.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: x.col, fontWeight: 600 }}>{x.val}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.07)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "절약" : "Save"}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(goldSavings)}</div>
              </div>
            </div>
          </div>

          {/* H-05: Silver 1kg tracker */}
          <div style={{ background: "#111008", border: "1px solid rgba(197,165,114,0.15)", borderRadius: 10, padding: isMobile ? "20px 18px" : "28px 28px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", letterSpacing: 2, textTransform: "uppercase", marginBottom: 10 }}>
              {lang === "ko" ? "은 1키로 구매시 절약 금액" : "Savings on 1kg Silver Bar"}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {[
                { label: lang === "ko" ? "한국 실물 시가" : "Korean Market", val: fKRW(silverKB), col: "#f87171" },
                { label: lang === "ko" ? "아름 실물가" : "Aurum Price", val: fKRW(silverAurum), col: "#4ade80" },
              ].map((x, i) => (
                <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "4px 0" }}>
                  <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{x.label}</div>
                  <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 16 : 20, color: x.col, fontWeight: 600 }}>{x.val}</div>
                </div>
              ))}
              <div style={{ background: "rgba(74,222,128,0.07)", padding: "12px 16px", borderRadius: 8, border: "1px solid rgba(74,222,128,0.2)", display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 4 }}>
                <div style={{ fontSize: 11, color: "#4ade80", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "절약" : "Save"}</div>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 24, color: "#4ade80", fontWeight: 700 }}>{fKRW(silverSavings)}</div>
              </div>
            </div>
          </div>
        </div>

        {/* H-06: Premium caption below both panels */}
        <div style={{ marginTop: 16, padding: "12px 16px", background: "rgba(197,165,114,0.04)", border: "1px solid rgba(197,165,114,0.12)", borderRadius: 8, textAlign: "center" }}>
          <span style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", lineHeight: 1.6 }}>
            {lang === "ko"
              ? "※ 한국 실물 시가는 KB Star 금·은 시세 기준 추정값입니다. 아름 가격은 국제 현물가 + 프리미엄 기준이며, 실시간으로 변동됩니다."
              : "※ Korean market prices are estimates based on KB Star gold & silver rates. Aurum prices are international spot + premium and update in real time."}
          </span>
        </div>
      </div>

      {/* ── WHY SILVER section ── */}
      <div style={{ background: "#111008", padding: isMobile ? "36px 16px" : "56px 80px", borderBottom: "1px solid #1a1510" }}>
        <div style={{ textAlign: "center", marginBottom: isMobile ? 28 : 40 }}>
          <div style={{ fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 8, fontFamily: "'Outfit',sans-serif" }}>
            {lang === "ko" ? "🥈 2026년 은에 주목해야 하는 이유" : "🥈 WHY SILVER IN 2026"}
          </div>
          <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: "0 0 8px" }}>
            {lang === "ko"
              ? "은: 공급이 부족하고 있습니다. 프리미엄이 상승하고 있습니다."
              : "Silver: The Deficit Is Real. The Supply Is Tightening. The Premium Is Rising."}
          </h2>
        </div>
        <div style={{ display: "flex", gap: 12, justifyContent: "center", flexDirection: isMobile ? "column" : "row", alignItems: isMobile ? "stretch" : "center" }}>
          <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#ffffff", border: "none", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 700, borderRadius: 6, cursor: "pointer", letterSpacing: 0.5 }}>
            {lang === "ko" ? "실물 은 구매하기 →" : "Buy Physical Silver →"}
          </button>
          <button onClick={() => navigate("agp")} style={{ background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: isMobile ? "14px" : "14px 36px", fontSize: 15, fontFamily: "'Outfit',sans-serif", fontWeight: 600, borderRadius: 6, cursor: "pointer" }}>
            {lang === "ko" ? "AGP로 은 저축 시작 →" : "Silver in AGP →"}
          </button>
        </div>
      </div>

      {/* Trust badges */}
      <div style={{ background: "#0a0a0a", padding: isMobile ? "20px 16px" : "28px 80px", display: "flex", justifyContent: "center", gap: isMobile ? 14 : 36, flexWrap: "wrap" }}>
        {[
          ["🏛️", "Malca-Amit"],
          ["📜", "LBMA"],
          ["🛡️", lang === "ko" ? "보험 보장" : "Insured"],
          ["🔐", lang === "ko" ? "배분 보관" : "Allocated"],
          ["🇸🇬", "Singapore FTZ"],
          ["💰", lang === "ko" ? "현물가 + 투명 프리미엄" : "Spot + Transparent Premium"],
          ["🥇🥈", lang === "ko" ? "금·은" : "Gold & Silver"],
        ].map(([icon, label], i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: isMobile ? 12 : 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>
            <span style={{ fontSize: isMobile ? 18 : 20 }}>{icon}</span>{label}
          </div>
        ))}
      </div>

      <NewsSection lang={lang} />
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// SHOP PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function Shop({ lang, navigate, prices, krwRate, addToCart, toast }) {
  const isMobile = useIsMobile();
  const [filter, setFilter] = useState("all");
  const filtered = filter === "all" ? PRODUCTS : PRODUCTS.filter(p => p.metal === filter);
  const tabs = [{ k: "all", ko: "전체", en: "All" }, { k: "gold", ko: "금", en: "Gold" }, { k: "silver", ko: "은", en: "Silver" }];
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh", padding: isMobile ? "24px 16px" : "40px 80px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: isMobile ? "flex-start" : "center", marginBottom: 28, flexWrap: "wrap", gap: 12 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 3, textTransform: "uppercase", marginBottom: 6 }}>{lang === "ko" ? "실물 금·은 구매" : "Physical Gold & Silver"}</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 34, color: "#f5f0e8", fontWeight: 300, margin: 0 }}>{lang === "ko" ? "Malca-Amit 금고 직접 배분" : "Direct Allocation to Malca-Amit Vault"}</h1>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          {tabs.map(t => <button key={t.k} onClick={() => setFilter(t.k)} style={{ background: filter === t.k ? "#c5a572" : "transparent", color: filter === t.k ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${filter === t.k ? "#c5a572" : "#2a2318"}`, padding: "6px 16px", borderRadius: 20, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: filter === t.k ? 600 : 400 }}>{lang === "ko" ? t.ko : t.en}</button>)}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3,1fr)", gap: isMobile ? 12 : 20 }}>
        {filtered.map(p => {
          const price = calcPrice(p, prices);
          return (
            <div key={p.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, overflow: "hidden", cursor: "pointer", transition: "border-color 0.2s" }}
              onClick={() => navigate("product", p)}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(197,165,114,0.35)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "#1a1510"}>
              <div style={{ padding: isMobile ? "28px 20px 20px" : "36px 24px 24px" }}>
                <div style={{ fontSize: isMobile ? 48 : 56, marginBottom: 16, textAlign: "center" }}>{p.image}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 6 }}>{p.metal.toUpperCase()} · {p.type.toUpperCase()}</div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 18 : 20, color: "#f5f0e8", fontWeight: 500, margin: "0 0 6px", lineHeight: 1.3 }}>{lang === "ko" ? p.nameKo : p.name}</h3>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b", marginBottom: 14 }}>{p.purity} · {p.weight}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: isMobile ? 18 : 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(price)}</div>
                    <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#555", marginTop: 2 }}>{fKRW(price * krwRate)}</div>
                  </div>
                  <button onClick={e => { e.stopPropagation(); addToCart(p, 1, "singapore"); toast(lang === "ko" ? "장바구니에 담겼습니다" : "Added to cart"); }} style={{ background: "rgba(197,165,114,0.12)", border: "1px solid rgba(197,165,114,0.35)", color: "#c5a572", padding: "8px 14px", borderRadius: 6, cursor: "pointer", fontSize: 12, fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>
                    {lang === "ko" ? "담기" : "Add"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// PRODUCT PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ProductPage({ lang, navigate, prices, krwRate, addToCart, toast, product }) {
  const isMobile = useIsMobile();
  const [qty, setQty] = useState(1);
  const [storage, setStorage] = useState("singapore");
  if (!product) return <div style={{ padding: 80, textAlign: "center", color: "#888", fontFamily: "'Outfit',sans-serif" }}>Product not found.</div>;
  const price = calcPrice(product, prices);
  const total = price * qty;
  const buyNow = () => { addToCart(product, qty, storage); navigate("checkout"); };
  const addCart = () => { addToCart(product, qty, storage); toast(lang === "ko" ? "장바구니에 담겼습니다" : "Added to cart"); };
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh", padding: isMobile ? "24px 16px" : "40px 80px" }}>
      <button onClick={() => navigate("shop")} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 13, fontFamily: "'Outfit',sans-serif", marginBottom: 24 }}>← {lang === "ko" ? "뒤로" : "Back"}</button>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: isMobile ? 20 : 48 }}>
        <div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 12, padding: isMobile ? "48px 24px" : "64px 40px", textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 80 }}>{product.image}</div>
          </div>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: "16px 20px" }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", fontWeight: 600, marginBottom: 10, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "제품 사양" : "Specifications"}</div>
            {[[lang === "ko" ? "금속" : "Metal", product.metal.toUpperCase()], [lang === "ko" ? "중량" : "Weight", product.weight], [lang === "ko" ? "순도" : "Purity", product.purity], [lang === "ko" ? "발행처" : "Mint", product.mint], [lang === "ko" ? "보관" : "Vault", "Malca-Amit Singapore"]].map(([l, v], i) => (
              <div key={i} style={{ display: "flex", justifyContent: "space-between", padding: "5px 0", borderBottom: i < 4 ? "1px solid #1a1510" : "none" }}>
                <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{l}</span>
                <span style={{ fontSize: 12, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif" }}>{v}</span>
              </div>
            ))}
          </div>
        </div>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 10, color: "#c5a572", letterSpacing: 2, textTransform: "uppercase", marginBottom: 8 }}>{product.metal.toUpperCase()} · LBMA</div>
          <h1 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 24 : 30, color: "#f5f0e8", fontWeight: 400, margin: "0 0 8px" }}>{lang === "ko" ? product.nameKo : product.name}</h1>
          <p style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#8a7d6b", lineHeight: 1.7, marginBottom: 20 }}>{lang === "ko" ? product.descKo : product.descKo}</p>
          <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: "18px 20px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? "단가" : "Unit Price"}</div>
              <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 20, color: "#c5a572", fontWeight: 700 }}>{fUSD(price)}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>KRW</div>
              <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#666" }}>{fKRW(total * krwRate)}</div>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 20 }}>
            <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 12, color: "#8a7d6b" }}>{lang === "ko" ? "수량" : "Qty"}</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: "#111008", border: "1px solid #1a1510", borderRadius: 6, padding: "4px 8px" }}>
              <button onClick={() => setQty(Math.max(1, qty - 1))} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>−</button>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#f5f0e8", minWidth: 24, textAlign: "center" }}>{qty}</span>
              <button onClick={() => setQty(qty + 1)} style={{ background: "none", border: "none", color: "#8a7d6b", cursor: "pointer", fontSize: 18, lineHeight: 1 }}>+</button>
            </div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            <button onClick={buyNow} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", color: "#0a0a0a", border: "none", padding: "15px", fontSize: 16, fontWeight: 700, borderRadius: 8, cursor: "pointer", letterSpacing: 0.5, fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "지금 구매하기" : "Buy Now"}
            </button>
            <button onClick={addCart} style={{ width: "100%", background: "transparent", color: "#c5a572", border: "1px solid #c5a572", padding: "13px", fontSize: 14, fontWeight: 600, borderRadius: 8, cursor: "pointer", fontFamily: "'Outfit',sans-serif" }}>
              {lang === "ko" ? "장바구니 담기" : "Add to Cart"}
            </button>
          </div>
          <div style={{ display: "flex", justifyContent: "center", gap: 20, marginTop: 14 }}>
            {["💙 TossPay", "💛 카카오페이", "🏦 Wire", "💳 Card"].map((x, i) => <span key={i} style={{ fontSize: 11, color: "#555", fontFamily: "'Outfit',sans-serif" }}>{x}</span>)}
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CART PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function CartPage({ lang, navigate, prices, krwRate, cart, setCart, toast }) {
  const isMobile = useIsMobile();
  const remove = (id) => setCart(cart.filter(i => i.id !== id));
  const total = cart.reduce((s, i) => s + calcPrice(i, prices) * i.qty, 0);
  if (cart.length === 0) return (
    <div style={{ padding: isMobile ? "60px 16px" : 80, textAlign: "center", background: "#0a0a0a", minHeight: "60vh" }}>
      <div style={{ fontSize: 48, marginBottom: 12 }}>🛒</div>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", marginBottom: 20 }}>{lang === "ko" ? "장바구니가 비어있습니다." : "Your cart is empty."}</p>
      <button onClick={() => navigate("shop")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "상품 보기" : "Browse Products"}</button>
    </div>
  );
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh", padding: isMobile ? "24px 16px" : "40px 80px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, marginBottom: 24 }}>{lang === "ko" ? "장바구니" : "Cart"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {cart.map(item => (
            <div key={item.id} style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 14 : "16px 20px", display: "flex", gap: 14, alignItems: "center" }}>
              <div style={{ fontSize: 32 }}>{item.image}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 13, color: "#f5f0e8", fontWeight: 500 }}>{lang === "ko" ? item.nameKo : item.name}</div>
                <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#8a7d6b", marginTop: 2 }}>{item.weight} · {item.purity}</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 14, color: "#c5a572", fontWeight: 600 }}>{fUSD(calcPrice(item, prices) * item.qty)}</div>
                <div style={{ fontSize: 11, color: "#555", marginTop: 2 }}>×{item.qty}</div>
              </div>
              <button onClick={() => remove(item.id)} style={{ background: "none", border: "none", color: "#f87171", cursor: "pointer", fontSize: 16 }}>✕</button>
            </div>
          ))}
        </div>
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 16 : 24, height: "fit-content" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", fontWeight: 600, marginBottom: 16, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "주문 요약" : "Order Summary"}</div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
            <span style={{ fontSize: 13, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "소계" : "Subtotal"}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 15, color: "#f5f0e8", fontWeight: 600 }}>{fUSD(total)}</span>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #1a1510" }}>
            <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>KRW</span>
            <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{fKRW(total * krwRate)}</span>
          </div>
          <button onClick={() => navigate("checkout")} style={{ width: "100%", background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "14px", borderRadius: 8, fontWeight: 700, cursor: "pointer", fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "결제하기" : "Checkout"}</button>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
// CHECKOUT
// ═══════════════════════════════════════════════════════════════════════════════
function Checkout({ lang, navigate, prices, krwRate, cart, setCart, setOrders, user, toast }) {
  const isMobile = useIsMobile();
  const [step, setStep] = useState(1);
  const [payMethod, setPayMethod] = useState("toss");
  const [loading, setLoading] = useState(false);
  const [confirmed, setConfirmed] = useState(null);
  const total = cart.reduce((s, i) => s + calcPrice(i, prices) * i.qty, 0);
  const submit = async () => {
    setLoading(true);
    try {
      const order = await API.orders.create({ items: cart, total, paymentMethod: payMethod, storageOption: "singapore", userId: user?.id });
      let payResult;
      if (payMethod === "toss") payResult = await API.payments.toss({ id: order.id, total });
      else if (payMethod === "kakao") payResult = await API.payments.kakao({ id: order.id, total });
      else if (payMethod === "wire") payResult = await API.payments.wire({ id: order.id, total });
      else payResult = await API.payments.card({ id: order.id, total });
      const fullOrder = { ...order, date: new Date().toISOString(), status: payMethod === "wire" ? "pending_payment" : "confirmed", items: cart, subtotal: total, total, paymentMethod: payMethod, storageOption: "singapore", paymentDetails: payResult };
      setOrders(prev => [fullOrder, ...prev]);
      setCart([]);
      setConfirmed(fullOrder);
      toast(lang === "ko" ? "주문이 확인되었습니다!" : "Order confirmed!");
    } catch { toast(lang === "ko" ? "결제 오류. 다시 시도하세요." : "Payment error. Please retry.", "error"); }
    finally { setLoading(false); }
  };
  if (confirmed) return (
    <div style={{ padding: isMobile ? "60px 16px" : 80, textAlign: "center", background: "#0a0a0a", minHeight: "70vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
      <div style={{ fontSize: 56, marginBottom: 16 }}>✅</div>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: 28, color: "#f5f0e8", fontWeight: 300, marginBottom: 10 }}>{lang === "ko" ? "주문 확인" : "Order Confirmed"}</h2>
      <p style={{ color: "#8a7d6b", fontFamily: "'Outfit',sans-serif", maxWidth: 400, lineHeight: 1.6, marginBottom: 8 }}>{lang === "ko" ? `주문번호: ${confirmed.id}` : `Order: ${confirmed.id}`}</p>
      {payMethod === "wire" && <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 8, padding: "16px 20px", maxWidth: 400, textAlign: "left", marginBottom: 20 }}>
        <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", fontWeight: 600, marginBottom: 10, textTransform: "uppercase" }}>{lang === "ko" ? "입금 계좌" : "Wire Details"}</div>
        {Object.entries(confirmed.paymentDetails?.bankDetails || {}).map(([k, v]) => (
          <div key={k} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <span style={{ fontSize: 11, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{k}</span>
            <span style={{ fontSize: 11, color: "#f5f0e8", fontFamily: "'JetBrains Mono',monospace" }}>{String(v)}</span>
          </div>
        ))}
      </div>}
      <button onClick={() => navigate("orders")} style={{ background: "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: "#0a0a0a", padding: "12px 28px", borderRadius: 6, fontWeight: 700, cursor: "pointer", fontSize: 14, fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? "주문 내역 보기" : "View Orders"}</button>
    </div>
  );
  const methods = [{ k: "toss", icon: "💙", label: "TossPay", extra: lang === "ko" ? "5.5% 프리미엄" : "5.5% premium" }, { k: "kakao", icon: "💛", label: "KakaoPay", extra: lang === "ko" ? "5.5% 프리미엄" : "5.5% premium" }, { k: "wire", icon: "🏦", label: lang === "ko" ? "전신환" : "Wire Transfer", extra: lang === "ko" ? "2.5% 프리미엄" : "2.5% premium" }, { k: "card", icon: "💳", label: lang === "ko" ? "해외 카드" : "Int'l Card", extra: lang === "ko" ? "5.5% 프리미엄" : "5.5% premium" }];
  return (
    <div style={{ background: "#0a0a0a", minHeight: "80vh", padding: isMobile ? "24px 16px" : "40px 80px" }}>
      <h2 style={{ fontFamily: "'Cormorant Garamond',serif", fontSize: isMobile ? 26 : 32, color: "#f5f0e8", fontWeight: 300, marginBottom: 28 }}>{lang === "ko" ? "결제" : "Checkout"}</h2>
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 360px", gap: 24 }}>
        <div>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "결제 수단 선택" : "Payment Method"}</div>
          <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 28 }}>
            {methods.map(m => (
              <button key={m.k} onClick={() => setPayMethod(m.k)} style={{ background: payMethod === m.k ? "#c5a572" : "transparent", color: payMethod === m.k ? "#0a0a0a" : "#8a7d6b", border: `1px solid ${payMethod === m.k ? "#c5a572" : "#2a2318"}`, padding: "12px 16px", borderRadius: 8, cursor: "pointer", textAlign: "left", display: "flex", alignItems: "center", gap: 10, fontFamily: "'Outfit',sans-serif" }}>
                <span style={{ fontSize: 20 }}>{m.icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: payMethod === m.k ? 700 : 500 }}>{m.label}</div>
                  <div style={{ fontSize: 11, opacity: 0.7 }}>{m.extra}</div>
                </div>
              </button>
            ))}
          </div>
        </div>
        <div style={{ background: "#111008", border: "1px solid #1a1510", borderRadius: 10, padding: isMobile ? 16 : 24, height: "fit-content" }}>
          <div style={{ fontFamily: "'Outfit',sans-serif", fontSize: 11, color: "#c5a572", fontWeight: 600, marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>{lang === "ko" ? "주문 요약" : "Summary"}</div>
          {cart.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={{ fontSize: 12, color: "#8a7d6b", fontFamily: "'Outfit',sans-serif" }}>{lang === "ko" ? item.nameKo : item.name} ×{item.qty}</span>
              <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 12, color: "#c5a572" }}>{fUSD(calcPrice(item, prices) * item.qty)}</span>
            </div>
          ))}
          <div style={{ borderTop: "1px solid #1a1510", marginTop: 12, paddingTop: 12, display: "flex", justifyContent: "space-between", marginBottom: 20 }}>
            <span style={{ fontSize: 14, color: "#f5f0e8", fontFamily: "'Outfit',sans-serif", fontWeight: 600 }}>{lang === "ko" ? "합계" : "Total"}</span>
            <span style={{ fontFamily: "'JetBrains Mono',monospace", fontSize: 16, color: "#c5a572", fontWeight: 700 }}>{fUSD(total)}</span>
          </div>
          <button onClick={submit} disabled={loading} style={{ width: "100%", background: loading ? "#2a2318" : "linear-gradient(135deg,#c5a572,#8a6914)", border: "none", color: loading ? "#8a7d6b" : "#0a0a0a", padding: "14px", borderRadius: 8, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer", fontSize: 15, fontFamily: "'Outfit',sans-serif" }}>
            {loading ? (lang === "ko" ? "처리 중..." : "Processing...") : (lang === "ko" ? "결제 확인" : "Confirm Payment")}
          </button>
        </div>
      </div>
    </div>
  );
}

export { Home, Shop, ProductPage, CartPage, Checkout };
