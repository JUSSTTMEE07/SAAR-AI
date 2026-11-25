import React, { useState, useEffect, useRef, useCallback } from "react";
import {
  FileText,
  Mic,
  BookOpen,
  Zap,
  Copy,
  Trash2,
  Upload,
  CheckSquare,
  Download,
  Check,
  X,
  AlertTriangle,
  ChevronRight,
  Sparkles,
  Clock,
  GraduationCap,
  Users,
  ArrowRight,
  Hash,
  BarChart2,
  Languages,
  FileDown,
  LayoutTemplate,
  RefreshCw,
  Keyboard,
  Info,
} from "lucide-react";

/* ═══════════════════════════════════════════════
   DESIGN TOKENS
═══════════════════════════════════════════════ */
const C = {
  bg: "#F5F4F0",
  white: "#FFFFFF",
  ink: "#0C0C0C",
  ink2: "#1A1A2E",
  muted: "#5A6072",
  faint: "#9499A6",
  line: "#E3E1DB",
  line2: "#CBC8C0",
  purple: "#6C3CE1",
  purpleH: "#5A2FBF",
  purpleL: "#F0EBFF",
  purpleM: "#D9CCFF",
  blue: "#2152CC",
  blueL: "#EBF1FF",
  teal: "#0D8F84",
  tealL: "#EDFAF8",
  green: "#1A7F4B",
  greenL: "#EDFAF3",
  amber: "#A66200",
  amberL: "#FFF8EC",
  red: "#CC2D2D",
  redL: "#FFF1F1",
};

/* ═══════════════════════════════════════════════
   SAMPLE DATA
═══════════════════════════════════════════════ */
const SAMPLES = {
  Meeting: `[09:00] Aryan (PM): Good morning team. Let's kick off Q4 sprint planning.
[09:02] Riya (Dev): Authentication module is complete and ready for review.
[09:04] Priya (QA): I found three edge-case bugs during regression — logging them in Jira now.
[09:06] Sam (Design): New dashboard mockups are done — sharing the Figma link.
[09:08] Aryan: Sprint goal is to ship the user dashboard by Friday.
[09:10] Riya: We need the API endpoints finalised first. Can we sync with backend?
[09:12] Aryan: Yes — Sam, schedule that by EOD today?
[09:14] Sam: Sure. We should also do an accessibility audit before launch.
[09:16] Aryan: Agreed. Client demo is confirmed for Thursday at 3 PM.
[09:18] Priya: I'll need the staging build by Tuesday for a full test cycle.
[09:20] Riya: I'll prep staging by Monday evening.
[09:22] Aryan: Perfect. Meeting adjourned — thanks everyone.`,

  Lecture: `Prof. Sharma: Welcome to today's NLP session. We'll cover tokenisation, stemming, lemmatisation, and transformers.

Tokenisation splits text into smaller units — words, sub-words, or characters depending on the model.

Student: What's the difference between stemming and lemmatisation?

Prof. Sharma: Stemming crudely removes suffixes — "running" → "run". Lemmatisation uses vocabulary and morphology, so "better" → "good".

We then moved to transformer architectures. The key innovation is self-attention — the model weighs each token against every other. This was introduced in "Attention is All You Need" by Vaswani et al., 2017.

The BERT model (Bidirectional Encoder Representations from Transformers) extended this with pre-training on masked language modelling and next sentence prediction.

Assignment: implement a bigram language model in Python before next class.`,
};

const MOCK = {
  Meeting: {
    summary: `The sprint-planning meeting confirmed that the authentication module is complete and dashboard mockups are ready for review. Three edge-case bugs were logged in Jira by QA. The sprint goal is to ship the user dashboard by Friday, dependent on backend API endpoints being finalised. An accessibility audit and backend team sync are required before launch. The client demo is confirmed for Thursday at 3 PM, with a full QA test cycle planned on a staging build by Tuesday.`,
    keyPoints: [
      "Authentication module complete — pending code review",
      "Three edge-case bugs logged in Jira by QA during regression",
      "Dashboard Figma mockups ready for stakeholder review",
      "Sprint goal: ship user dashboard by Friday",
      "Backend API endpoints must be finalised before frontend integration",
      "Accessibility audit required before public launch",
      "Client demo confirmed for Thursday at 3 PM",
      "Staging build needed by Monday evening for QA cycle",
    ],
    actionItems: [
      "Sam to schedule backend sync by EOD today",
      "Riya to prepare staging environment by Monday evening",
      "Priya to complete full test cycle by Tuesday",
      "Team to complete accessibility audit before launch",
      "Sam to share Figma link with all stakeholders",
      "Aryan to send demo agenda to client",
    ],
    keywords: [
      "Sprint",
      "Dashboard",
      "Authentication",
      "API",
      "QA",
      "Figma",
      "Staging",
      "Demo",
      "Accessibility",
      "Jira",
    ],
    readingLevel: "Professional",
    detectedLang: "English",
    confidence: 94,
    wordCount: 148,
  },
  Lecture: {
    summary: `The lecture introduced core NLP concepts — tokenisation, stemming vs. lemmatisation — and provided a detailed overview of transformer architectures with focus on the self-attention mechanism from the 2017 landmark paper "Attention is All You Need" by Vaswani et al. The session also covered BERT's pre-training methodology using masked language modelling and next sentence prediction.`,
    keyPoints: [
      "Tokenisation splits text into words, sub-words, or characters",
      "Stemming: rule-based suffix removal — fast but imprecise",
      "Lemmatisation: vocabulary-aware base form lookup — accurate",
      "Transformers use self-attention to weigh token relationships",
      '"Attention is All You Need" — Vaswani et al., 2017',
      "BERT: pre-trained with masked LM + next sentence prediction",
    ],
    actionItems: [
      "Implement a bigram language model in Python (due next class)",
      "Read Vaswani et al. (2017) attention paper",
      "Review BERT pre-training methodology from lecture slides",
      "Review tokenisation exercises from last week",
    ],
    keywords: [
      "NLP",
      "Tokenisation",
      "Stemming",
      "Lemmatisation",
      "Transformer",
      "Self-attention",
      "BERT",
      "Vaswani",
      "Pre-training",
    ],
    readingLevel: "Academic",
    detectedLang: "English",
    confidence: 97,
    wordCount: 94,
  },
};

/* ═══════════════════════════════════════════════
   MICRO COMPONENTS
═══════════════════════════════════════════════ */

function Toast({ msg, type = "success", onClose }) {
  useEffect(() => {
    const t = setTimeout(onClose, 2800);
    return () => clearTimeout(t);
  }, [onClose]);
  const color = type === "success" ? C.green : C.amber;
  return (
    <div
      style={{
        position: "fixed",
        bottom: 32,
        left: "50%",
        transform: "translateX(-50%)",
        zIndex: 9999,
        background: C.ink,
        color: C.white,
        padding: "12px 20px",
        borderRadius: 100,
        display: "flex",
        alignItems: "center",
        gap: 10,
        fontSize: 13.5,
        fontWeight: 500,
        boxShadow: "0 12px 40px rgba(0,0,0,.3)",
        animation: "popIn .25s ease both",
        whiteSpace: "nowrap",
        border: `1px solid rgba(255,255,255,.08)`,
      }}
    >
      <span
        style={{
          width: 20,
          height: 20,
          background: color,
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Check size={12} color="#fff" strokeWidth={3} />
      </span>
      {msg}
    </div>
  );
}

function Pill({ children, color = C.purple, bg = C.purpleL }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 4,
        background: bg,
        color,
        fontSize: 11,
        fontWeight: 700,
        letterSpacing: ".3px",
        padding: "3px 10px",
        borderRadius: 99,
        border: `1px solid ${color}22`,
      }}
    >
      {children}
    </span>
  );
}

function Spinner() {
  return (
    <span
      style={{
        width: 15,
        height: 15,
        border: `2.5px solid rgba(255,255,255,.3)`,
        borderTopColor: "#fff",
        borderRadius: "50%",
        display: "inline-block",
        animation: "spin .7s linear infinite",
        flexShrink: 0,
      }}
    />
  );
}

function SkeletonLine({ w = "100%", h = 16, mb = 10 }) {
  return (
    <div
      className="skeleton"
      style={{ width: w, height: h, marginBottom: mb }}
    />
  );
}

/* ═══════════════════════════════════════════════
   NAVBAR
═══════════════════════════════════════════════ */
export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [navHover, setNavHover] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div
      style={{
        position: "fixed",
        top: 14,
        left: 0,
        right: 0,
        zIndex: 200,
        display: "flex",
        justifyContent: "center",
        padding: "0 20px",
        pointerEvents: "none",
      }}
    >
      <header
        onMouseEnter={() => setNavHover(true)}
        onMouseLeave={() => setNavHover(false)}
        style={{
          pointerEvents: "auto",
          width: "100%",
          maxWidth: 1040,
          height: 60,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 24px",
          borderRadius: 9999,
          background: scrolled
            ? navHover
              ? "rgba(255, 255, 255, 0.88)"
              : "rgba(255, 255, 255, 0.75)"
            : navHover
              ? "rgba(255, 255, 255, 0.95)"
              : "rgba(255, 255, 255, 0.82)",
          backdropFilter: "blur(20px) saturate(190%)",
          WebkitBackdropFilter: "blur(20px) saturate(190%)",
          border: `1px solid ${navHover ? "rgba(108, 60, 225, 0.28)" : "rgba(255, 255, 255, 0.7)"}`,
          boxShadow: navHover
            ? "0 16px 36px -6px rgba(108, 60, 225, 0.16), 0 8px 18px -4px rgba(0, 0, 0, 0.06)"
            : scrolled
              ? "0 10px 30px -5px rgba(0, 0, 0, 0.08), 0 4px 10px -2px rgba(0, 0, 0, 0.04)"
              : "0 4px 20px -2px rgba(0, 0, 0, 0.05)",
          transform: navHover ? "translateY(-2px)" : "translateY(0)",
          transition: "all 0.35s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        {/* Logo */}
        <a
          href="#"
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              background: `linear-gradient(135deg, ${C.purple} 0%, ${C.blue} 100%)`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: `0 3px 12px ${C.purple}44`,
              transition: "transform 0.25s cubic-bezier(0.16, 1, 0.3, 1)",
              transform: navHover ? "scale(1.06) rotate(-2deg)" : "scale(1)",
            }}
          >
            <FileText size={15} color="#fff" />
          </div>
          <span
            style={{
              fontSize: 16,
              fontWeight: 800,
              color: C.ink,
              letterSpacing: "-0.4px",
            }}
          >
            SAAR AI
          </span>
        </a>

        {/* Links */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }}>
          {[
            ["Tool", "#tool"],
            ["How it works", "#how-it-works"],
            ["About", "#about"],
          ].map(([l, h]) => (
            <a
              key={h}
              href={h}
              style={{
                color: C.muted,
                fontSize: 13.5,
                fontWeight: 600,
                textDecoration: "none",
                padding: "7px 15px",
                borderRadius: 9999,
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = C.purple;
                e.currentTarget.style.background = C.purpleL;
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = C.muted;
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              {l}
            </a>
          ))}
          <div
            style={{
              width: 1,
              height: 18,
              background: "rgba(0,0,0,0.08)",
              margin: "0 8px",
            }}
          />
          <a
            href="#tool"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 6,
              background: `linear-gradient(135deg, ${C.purple} 0%, ${C.purpleH} 100%)`,
              color: "#fff",
              padding: "8px 18px",
              borderRadius: 9999,
              fontSize: 13,
              fontWeight: 700,
              textDecoration: "none",
              boxShadow: `0 4px 14px ${C.purple}38`,
              transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = "scale(1.04) translateY(-1px)";
              e.currentTarget.style.boxShadow = `0 6px 18px ${C.purple}55`;
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = "scale(1) translateY(0)";
              e.currentTarget.style.boxShadow = `0 4px 14px ${C.purple}38`;
            }}
          >
            <Sparkles size={13} /> Try now
          </a>
        </nav>
      </header>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   HERO
═══════════════════════════════════════════════ */
export function Hero() {
  return (
    <section
      style={{
        position: "relative",
        overflow: "hidden",
        background: "linear-gradient(180deg, #FFFFFF 0%, #FAFAFD 60%, #F5F4F0 100%)",
        padding: "110px 32px 88px",
      }}
    >
      {/* Dynamic ambient colorful fluid water-like glow meshes */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          overflow: "hidden",
        }}
      >
        <div
          className="liquid-orb-1"
          style={{
            position: "absolute",
            top: -60,
            right: "2%",
            width: 700,
            height: 700,
            borderRadius: "45% 55% 60% 40% / 50% 45% 55% 50%",
            background:
              "radial-gradient(circle, rgba(108,60,225,0.18) 0%, rgba(33,82,204,0.12) 40%, transparent 70%)",
            filter: "blur(65px)",
          }}
        />
        <div
          className="liquid-orb-2"
          style={{
            position: "absolute",
            top: "15%",
            left: "-8%",
            width: 580,
            height: 580,
            borderRadius: "55% 45% 50% 50% / 40% 60% 40% 60%",
            background:
              "radial-gradient(circle, rgba(13,143,132,0.15) 0%, rgba(108,60,225,0.08) 50%, transparent 70%)",
            filter: "blur(60px)",
          }}
        />
        <div
          className="liquid-orb-3"
          style={{
            position: "absolute",
            bottom: -80,
            left: "25%",
            width: 650,
            height: 420,
            borderRadius: "50% 50% 40% 60% / 60% 40% 60% 40%",
            background:
              "radial-gradient(circle, rgba(219,234,254,0.85) 0%, rgba(240,235,255,0.6) 50%, transparent 75%)",
            filter: "blur(55px)",
          }}
        />
      </div>

      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          position: "relative",
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 64,
          alignItems: "center",
        }}
      >
        {/* Left */}
        <div>
          <div
            className="anim anim-1"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 7,
              background: C.purpleL,
              border: `1px solid ${C.purpleM}`,
              borderRadius: 99,
              padding: "5px 14px",
              marginBottom: 20,
            }}
          >
            <GraduationCap size={12} color={C.purple} />
            <span
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.purple,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              KR Mangalam University · Project 18 · Group 2
            </span>
          </div>

          <h1
            className="anim anim-2"
            style={{
              fontSize: "clamp(38px, 4.8vw, 64px)",
              fontWeight: 900,
              letterSpacing: "-2.5px",
              lineHeight: 1.05,
              color: C.ink,
              marginBottom: 16,
            }}
          >
            SAAR AI
            <br />
            <span
              style={{
                background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              Extract What Matters.
            </span>
          </h1>

          <div
            className="anim anim-2"
            style={{
              fontSize: 14,
              fontWeight: 700,
              color: C.purple,
              letterSpacing: "0.2px",
              textTransform: "uppercase",
              marginBottom: 16,
            }}
          >
            Meeting &amp; Lecture Summarisation Using NLP
          </div>

          <p
            className="anim anim-3"
            style={{
              fontSize: 16.5,
              color: C.muted,
              lineHeight: 1.75,
              marginBottom: 36,
              maxWidth: 440,
              letterSpacing: "-0.1px",
            }}
          >
            Paste any meeting or lecture transcript — get a clean summary, key
            points, action items, and keyword extraction in seconds.
          </p>

          <div
            className="anim anim-4"
            style={{
              display: "flex",
              gap: 12,
              flexWrap: "wrap",
              marginBottom: 44,
            }}
          >
            <a
              href="#tool"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 8,
                background: C.purple,
                color: "#fff",
                padding: "13px 26px",
                borderRadius: 10,
                fontWeight: 700,
                fontSize: 15,
                textDecoration: "none",
                boxShadow: `0 4px 20px ${C.purple}44`,
                transition: "all .18s",
                letterSpacing: "-0.2px",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.purpleH;
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.purple;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              <Sparkles size={16} /> Start Summarising
            </a>
            <a
              href="#how-it-works"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: C.bg,
                color: C.muted,
                border: `1.5px solid ${C.line}`,
                padding: "13px 22px",
                borderRadius: 10,
                fontWeight: 600,
                fontSize: 14,
                textDecoration: "none",
                transition: "all .15s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = C.line2;
                e.currentTarget.style.color = C.ink;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = C.line;
                e.currentTarget.style.color = C.muted;
              }}
            >
              How it works <ChevronRight size={15} />
            </a>
          </div>

          {/* Features row */}
          <div
            className="anim anim-5"
            style={{ display: "flex", gap: 20, flexWrap: "wrap" }}
          >
            {[
              [<Mic size={13} />, "Meeting Mode"],
              [<BookOpen size={13} />, "Lecture Mode"],
              [<Hash size={13} />, "Keyword Extraction"],
              [<Download size={13} />, "Export Results"],
            ].map(([icon, label]) => (
              <div
                key={label}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 13,
                  color: C.faint,
                  fontWeight: 500,
                }}
              >
                <span style={{ color: C.purple }}>{icon}</span> {label}
              </div>
            ))}
          </div>
        </div>

        {/* Right — preview card */}
        <div className="anim anim-3" style={{ position: "relative" }}>
          <div
            style={{
              background: C.white,
              border: `1.5px solid ${C.line}`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 20px 60px rgba(0,0,0,.1), 0 4px 16px rgba(0,0,0,.06)",
            }}
          >
            {/* Fake chrome */}
            <div
              style={{
                background: C.bg,
                padding: "12px 16px",
                borderBottom: `1px solid ${C.line}`,
                display: "flex",
                alignItems: "center",
                gap: 8,
              }}
            >
              <div style={{ display: "flex", gap: 5 }}>
                {["#f87171", "#fbbf24", "#34d399"].map((c, i) => (
                  <div
                    key={i}
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: "50%",
                      background: c,
                    }}
                  />
                ))}
              </div>
              <div
                style={{
                  flex: 1,
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: 5,
                  height: 24,
                  margin: "0 20px",
                  display: "flex",
                  alignItems: "center",
                  paddingLeft: 8,
                }}
              >
                <span style={{ fontSize: 11, color: C.faint }}>
                  localhost:5174 — SAAR AI
                </span>
              </div>
            </div>
            {/* Fake result preview */}
            <div style={{ padding: "20px 20px 16px" }}>
              <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
                <Pill color={C.green} bg={C.greenL}>
                  <Check size={9} /> Analysis done
                </Pill>
                <Pill color={C.purple} bg={C.purpleL}>
                  94% confidence
                </Pill>
              </div>
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.purple,
                  letterSpacing: ".6px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Summary
              </div>
              <SkeletonLine w="100%" h={12} mb={7} />
              <SkeletonLine w="88%" h={12} mb={7} />
              <SkeletonLine w="72%" h={12} mb={16} />
              <div
                style={{
                  fontSize: 12,
                  fontWeight: 700,
                  color: C.blue,
                  letterSpacing: ".6px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}
              >
                Key Points
              </div>
              {["100%", "82%", "65%"].map((w, i) => (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    gap: 8,
                    marginBottom: 7,
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      width: 16,
                      height: 16,
                      borderRadius: "50%",
                      background: C.purpleL,
                      flexShrink: 0,
                    }}
                  />
                  <SkeletonLine w={w} h={11} mb={0} />
                </div>
              ))}
              <div style={{ marginTop: 14, display: "flex", gap: 6 }}>
                {["Sprint", "Dashboard", "API", "Auth", "QA"].map((tag) => (
                  <span
                    key={tag}
                    style={{
                      background: C.purpleL,
                      color: C.purple,
                      fontSize: 10,
                      fontWeight: 700,
                      padding: "3px 8px",
                      borderRadius: 99,
                    }}
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
          {/* Floating badge */}
          <div
            style={{
              position: "absolute",
              bottom: -16,
              left: -16,
              background: C.white,
              border: `1.5px solid ${C.line}`,
              borderRadius: 12,
              padding: "10px 14px",
              boxShadow: "0 8px 24px rgba(0,0,0,.1)",
              display: "flex",
              alignItems: "center",
              gap: 9,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: C.greenL,
                borderRadius: 8,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Zap size={18} color={C.green} />
            </div>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.ink }}>
                Generated in 1.4s
              </div>
              <div style={{ fontSize: 11, color: C.faint }}>
                148 words analysed
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ═══════════════════════════════════════════════
   MAIN TOOL
═══════════════════════════════════════════════ */
export function Tool() {
  const [mode, setMode] = useState("Meeting");
  const [text, setText] = useState("");
  const [length, setLength] = useState("Standard");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [checkedItems, setCheckedItems] = useState({});
  const fileRef = useRef();
  const resultRef = useRef();

  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  const maxWords = 2000;
  const wordPct = Math.min((words / maxWords) * 100, 100);

  // Keyboard shortcut Ctrl+Enter
  useEffect(() => {
    const fn = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        generate();
      }
    };
    window.addEventListener("keydown", fn);
    return () => window.removeEventListener("keydown", fn);
  }, [text, mode]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (!file.name.endsWith(".txt")) {
      setError("Only .txt files are supported.");
      return;
    }
    if (file.size > 500_000) {
      setError("File is too large (max 500 KB).");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setText(ev.target.result);
      setError("");
    };
    reader.readAsText(file);
    e.target.value = "";
  };

  const generate = () => {
    if (!text.trim()) {
      setError("Please add a transcript first.");
      return;
    }
    if (words < 10) {
      setError("Too short — please add at least 10 words.");
      return;
    }
    setError("");
    setLoading(true);
    setResult(null);
    setCheckedItems({});
    setTimeout(() => {
      setResult(MOCK[mode]);
      setLoading(false);
      setTimeout(
        () =>
          resultRef.current?.scrollIntoView({
            behavior: "smooth",
            block: "start",
          }),
        80,
      );
    }, 1500);
  };

  const copy = useCallback((content, label) => {
    navigator.clipboard
      .writeText(content)
      .then(() => setToast(`${label} copied to clipboard`));
  }, []);

  const copyMarkdown = () => {
    if (!result) return;
    const md = `# SAAR AI Analysis — ${mode} Mode\n*Tagline: Extract What Matters.*\n*Academic Project: Meeting & Lecture Summarisation Using NLP*\n\n## Summary\n${result.summary}\n\n## Key Points\n${result.keyPoints.map((k, i) => `${i + 1}. ${k}`).join("\n")}\n\n## Action Items\n${result.actionItems.map((a) => `- [ ] ${a}`).join("\n")}\n\n## Keywords\n${result.keywords.join(", ")}\n\n---\n*Generated by SAAR AI — Demonstration Preview (Mock Data, Not Real NLP Results)*`;
    navigator.clipboard
      .writeText(md)
      .then(() => setToast("Copied as Markdown"));
  };

  const downloadTxt = () => {
    if (!result) return;
    const content = `SAAR AI ANALYSIS — ${mode.toUpperCase()} MODE\nTAGLINE: Extract What Matters.\nACADEMIC TITLE: Meeting & Lecture Summarisation Using NLP\n${"=".repeat(60)}\n\nSUMMARY\n${"-".repeat(40)}\n${result.summary}\n\nKEY POINTS\n${"-".repeat(40)}\n${result.keyPoints.map((k, i) => `${i + 1}. ${k}`).join("\n")}\n\nACTION ITEMS\n${"-".repeat(40)}\n${result.actionItems.map((a) => `☐ ${a}`).join("\n")}\n\nKEYWORDS\n${"-".repeat(40)}\n${result.keywords.join(", ")}\n\n${"=".repeat(60)}\nGenerated by SAAR AI — Demonstration Preview Only\n(Mock Data, Not Actual NLP Results)\nKR Mangalam University | Capstone Project 18, Group 2`;
    const blob = new Blob([content], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `saar-ai-${mode.toLowerCase()}-summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    setToast("Downloaded as .txt");
  };

  const toggleCheck = (i) =>
    setCheckedItems((prev) => ({ ...prev, [i]: !prev[i] }));
  const clear = () => {
    setText("");
    setResult(null);
    setError("");
    setCheckedItems({});
  };

  const lengthOpts = ["Brief", "Standard", "Detailed"];

  return (
    <section
      id="tool"
      style={{
        position: "relative",
        background: "linear-gradient(180deg, #F5F4F0 0%, #FAF9F6 50%, #F5F4F0 100%)",
        padding: "50px 32px 88px",
      }}
    >
      {/* Subtle organic liquid water lights behind tool */}
      <div
        className="liquid-orb-2"
        style={{
          position: "absolute",
          top: -40,
          left: "25%",
          width: 850,
          height: 400,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,60,225,0.09) 0%, rgba(33,82,204,0.06) 45%, transparent 75%)",
          filter: "blur(65px)",
          pointerEvents: "none",
        }}
      />
      <div
        className="liquid-orb-1"
        style={{
          position: "absolute",
          bottom: 20,
          right: "10%",
          width: 550,
          height: 380,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(13,143,132,0.08) 0%, rgba(108,60,225,0.05) 50%, transparent 75%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        {/* Demo notice */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: 10,
            background: C.amberL,
            border: `1px solid #FCD34D`,
            borderRadius: 10,
            padding: "12px 16px",
            marginBottom: 48,
          }}
        >
          <Info
            size={15}
            color={C.amber}
            style={{ flexShrink: 0, marginTop: 1 }}
          />
          <p
            style={{
              fontSize: 13,
              color: "#78350F",
              margin: 0,
              lineHeight: 1.6,
            }}
          >
            <strong>Demo Preview</strong> — All generated output is hard-coded
            mock data for UI demonstration only. It does not represent actual
            NLP model results. All buttons and validation logic are fully
            functional.
          </p>
        </div>

        {/* ── Top Controls ── */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: 24,
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Mode toggle */}
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.faint,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              Mode
            </span>
            <div
              style={{
                display: "inline-flex",
                background: C.white,
                border: `1.5px solid ${C.line}`,
                borderRadius: 10,
                padding: 4,
                gap: 2,
              }}
            >
              {[
                { key: "Meeting", icon: <Mic size={13} /> },
                { key: "Lecture", icon: <BookOpen size={13} /> },
              ].map(({ key, icon }) => {
                const active = mode === key;
                return (
                  <button
                    key={key}
                    onClick={() => {
                      setMode(key);
                      setResult(null);
                    }}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 7,
                      padding: "8px 18px",
                      borderRadius: 7,
                      border: "none",
                      background: active ? C.purple : "transparent",
                      color: active ? "#fff" : C.muted,
                      fontSize: 13,
                      fontWeight: 700,
                      cursor: "pointer",
                      transition: "all .18s",
                      boxShadow: active ? `0 2px 10px ${C.purple}44` : "none",
                    }}
                  >
                    {React.cloneElement(icon, {
                      color: active ? "#fff" : C.muted,
                    })}{" "}
                    {key}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Length selector */}
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: C.faint,
                letterSpacing: ".8px",
                textTransform: "uppercase",
              }}
            >
              Length
            </span>
            <div style={{ display: "flex", gap: 4 }}>
              {lengthOpts.map((opt) => (
                <button
                  key={opt}
                  onClick={() => setLength(opt)}
                  style={{
                    padding: "7px 14px",
                    borderRadius: 7,
                    border: `1.5px solid ${length === opt ? C.purple : C.line}`,
                    background: length === opt ? C.purpleL : C.white,
                    color: length === opt ? C.purple : C.muted,
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: "pointer",
                    transition: "all .15s",
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Main Split Layout ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            minHeight: 540,
          }}
        >
          {/* LEFT — Input */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 0,
              background: "rgba(255, 255, 255, 0.95)",
              border: `1.5px solid rgba(227, 225, 219, 0.9)`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 20px 40px -15px rgba(108, 60, 225, 0.08), 0 4px 18px rgba(0, 0, 0, 0.04)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            {/* Panel header */}
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${C.line}`,
                background: C.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ display: "flex", gap: 5 }}>
                  {["#f87171", "#fbbf24", "#34d399"].map((c, i) => (
                    <div
                      key={i}
                      style={{
                        width: 10,
                        height: 10,
                        borderRadius: "50%",
                        background: c,
                      }}
                    />
                  ))}
                </div>
                <span
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    color: C.muted,
                    marginLeft: 4,
                  }}
                >
                  input.txt
                </span>
              </div>
              <div style={{ display: "flex", gap: 6 }}>
                <SmBtn
                  icon={<Sparkles size={12} />}
                  label="Sample"
                  onClick={() => {
                    setText(SAMPLES[mode]);
                    setError("");
                  }}
                />
                <SmBtn
                  icon={<Upload size={12} />}
                  label="Upload"
                  onClick={() => fileRef.current.click()}
                />
                <input
                  ref={fileRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFile}
                  style={{ display: "none" }}
                />
              </div>
            </div>

            {/* Textarea */}
            <TA
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                setError("");
              }}
              mode={mode}
            />

            {/* Panel footer */}
            <div
              style={{
                padding: "10px 18px",
                borderTop: `1px solid ${C.line}`,
                background: C.bg,
                display: "flex",
                flexDirection: "column",
                gap: 6,
              }}
            >
              <div
                style={{
                  height: 3,
                  background: C.line,
                  borderRadius: 99,
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    height: "100%",
                    background:
                      wordPct > 90 ? C.red : wordPct > 70 ? C.amber : C.purple,
                    width: `${wordPct}%`,
                    borderRadius: 99,
                    transition: "width .3s",
                  }}
                />
              </div>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    gap: 14,
                    fontSize: 12,
                    color: C.faint,
                  }}
                >
                  <span>
                    <strong style={{ color: C.muted, fontWeight: 600 }}>
                      {words}
                    </strong>
                    /{maxWords} words
                  </span>
                  {words > 0 && (
                    <span
                      style={{ display: "flex", alignItems: "center", gap: 4 }}
                    >
                      <Clock size={10} /> ~{Math.ceil(words / 150)} min
                    </span>
                  )}
                </div>
                {words > 0 && words < 10 && (
                  <Pill color={C.red} bg={C.redL}>
                    Too short
                  </Pill>
                )}
                {words >= 10 && words < 60 && (
                  <Pill color={C.amber} bg={C.amberL}>
                    Short
                  </Pill>
                )}
                {words >= 60 && (
                  <Pill color={C.green} bg={C.greenL}>
                    ✓ Good length
                  </Pill>
                )}
              </div>
            </div>
          </div>

          {/* RIGHT — Output */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              background: "rgba(255, 255, 255, 0.95)",
              border: `1.5px solid rgba(227, 225, 219, 0.9)`,
              borderRadius: 20,
              overflow: "hidden",
              boxShadow:
                "0 20px 40px -15px rgba(33, 82, 204, 0.08), 0 4px 18px rgba(0, 0, 0, 0.04)",
              backdropFilter: "blur(12px)",
              transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
            }}
          >
            <div
              style={{
                padding: "14px 18px",
                borderBottom: `1px solid ${C.line}`,
                background: C.bg,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <span style={{ fontSize: 12, fontWeight: 600, color: C.muted }}>
                output — {mode.toLowerCase()}_summary.txt
              </span>
              {result && (
                <div style={{ display: "flex", gap: 6 }}>
                  <SmBtn
                    icon={<Copy size={12} />}
                    label="Markdown"
                    onClick={copyMarkdown}
                  />
                  <SmBtn
                    icon={<FileDown size={12} />}
                    label=".txt"
                    onClick={downloadTxt}
                  />
                </div>
              )}
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "20px 20px" }}>
              {!result && !loading && (
                <div
                  style={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: 14,
                    padding: "40px 20px",
                    textAlign: "center",
                  }}
                >
                  <div
                    style={{
                      width: 56,
                      height: 56,
                      background: C.purpleL,
                      borderRadius: 14,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <LayoutTemplate size={26} color={C.purple} />
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: 15,
                        fontWeight: 700,
                        color: C.ink2,
                        marginBottom: 6,
                      }}
                    >
                      Ready to summarise
                    </div>
                    <div
                      style={{
                        fontSize: 13,
                        color: C.faint,
                        lineHeight: 1.6,
                        maxWidth: 220,
                      }}
                    >
                      Paste a transcript and hit Generate, or press{" "}
                      <kbd
                        style={{
                          background: C.bg,
                          border: `1px solid ${C.line}`,
                          borderRadius: 4,
                          padding: "1px 5px",
                          fontSize: 11,
                          fontFamily: "monospace",
                        }}
                      >
                        Ctrl+Enter
                      </kbd>
                    </div>
                  </div>
                </div>
              )}

              {loading && (
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 10,
                    padding: "4px 0",
                  }}
                >
                  <div
                    style={{
                      fontSize: 11,
                      fontWeight: 700,
                      color: C.purple,
                      letterSpacing: ".6px",
                      textTransform: "uppercase",
                      marginBottom: 6,
                    }}
                  >
                    Analysing…
                  </div>
                  <SkeletonLine w="100%" h={13} mb={6} />
                  <SkeletonLine w="90%" h={13} mb={6} />
                  <SkeletonLine w="78%" h={13} mb={18} />
                  <SkeletonLine w="45%" h={11} mb={8} />
                  {[1, 2, 3].map((i) => (
                    <div
                      key={i}
                      style={{ display: "flex", gap: 8, marginBottom: 8 }}
                    >
                      <div
                        className="skeleton"
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: "50%",
                          flexShrink: 0,
                        }}
                      />
                      <SkeletonLine w="80%" h={11} mb={0} />
                    </div>
                  ))}
                  <SkeletonLine w="40%" h={11} mb={8} />
                  {[1, 2].map((i) => (
                    <SkeletonLine key={i} w="85%" h={11} mb={6} />
                  ))}
                </div>
              )}

              {result && (
                <div className="slide-in">
                  {/* Meta bar */}
                  <div
                    style={{
                      display: "flex",
                      gap: 6,
                      flexWrap: "wrap",
                      marginBottom: 20,
                    }}
                  >
                    <Pill color={C.green} bg={C.greenL}>
                      <Check size={9} /> Done
                    </Pill>
                    <Pill color={C.purple} bg={C.purpleL}>
                      <BarChart2 size={9} /> {result.confidence}% confidence
                    </Pill>
                    <Pill color={C.blue} bg={C.blueL}>
                      <Languages size={9} /> {result.detectedLang}
                    </Pill>
                    <Pill color={C.teal} bg={C.tealL}>
                      {result.readingLevel}
                    </Pill>
                  </div>

                  {/* Summary */}
                  <OutputBlock
                    label="Summary"
                    color={C.purple}
                    onCopy={() => copy(result.summary, "Summary")}
                  >
                    <p
                      style={{
                        fontSize: 14,
                        lineHeight: 1.85,
                        color: C.ink2,
                        margin: 0,
                      }}
                    >
                      {result.summary}
                    </p>
                  </OutputBlock>

                  {/* Key points */}
                  <OutputBlock
                    label="Key Points"
                    color={C.blue}
                    badge={`${result.keyPoints.length}`}
                    onCopy={() =>
                      copy(
                        result.keyPoints
                          .map((k, i) => `${i + 1}. ${k}`)
                          .join("\n"),
                        "Key points",
                      )
                    }
                  >
                    <div>
                      {result.keyPoints.map((pt, i) => (
                        <div
                          key={i}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            padding: "9px 0",
                            borderBottom:
                              i < result.keyPoints.length - 1
                                ? `1px dashed ${C.line}`
                                : "none",
                          }}
                        >
                          <span
                            style={{
                              width: 20,
                              height: 20,
                              background: C.blueL,
                              color: C.blue,
                              borderRadius: "50%",
                              fontSize: 10,
                              fontWeight: 800,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              flexShrink: 0,
                            }}
                          >
                            {i + 1}
                          </span>
                          <span
                            style={{
                              fontSize: 13.5,
                              color: C.ink2,
                              lineHeight: 1.65,
                            }}
                          >
                            {pt}
                          </span>
                        </div>
                      ))}
                    </div>
                  </OutputBlock>

                  {/* Action items (interactive checkboxes) */}
                  <OutputBlock
                    label="Action Items"
                    color={C.teal}
                    badge={`${result.actionItems.length} tasks`}
                    onCopy={() =>
                      copy(
                        result.actionItems.map((a) => `☐ ${a}`).join("\n"),
                        "Action items",
                      )
                    }
                  >
                    <div
                      style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 8,
                      }}
                    >
                      {result.actionItems.map((item, i) => (
                        <div
                          key={i}
                          onClick={() => toggleCheck(i)}
                          style={{
                            display: "flex",
                            alignItems: "flex-start",
                            gap: 10,
                            cursor: "pointer",
                            opacity: checkedItems[i] ? 0.5 : 1,
                            transition: "opacity .2s",
                          }}
                        >
                          <div
                            style={{
                              width: 18,
                              height: 18,
                              border: `2px solid ${checkedItems[i] ? C.green : C.line2}`,
                              background: checkedItems[i]
                                ? C.green
                                : "transparent",
                              borderRadius: 5,
                              flexShrink: 0,
                              marginTop: 2,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              transition: "all .15s",
                            }}
                          >
                            {checkedItems[i] && (
                              <Check size={11} color="#fff" strokeWidth={3} />
                            )}
                          </div>
                          <span
                            style={{
                              fontSize: 13.5,
                              color: C.ink2,
                              lineHeight: 1.65,
                              textDecoration: checkedItems[i]
                                ? "line-through"
                                : "none",
                            }}
                          >
                            {item}
                          </span>
                        </div>
                      ))}
                    </div>
                  </OutputBlock>

                  {/* Keywords */}
                  <OutputBlock
                    label="Keywords"
                    color={C.purple}
                    onCopy={() => copy(result.keywords.join(", "), "Keywords")}
                  >
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 7 }}>
                      {result.keywords.map((kw) => (
                        <span
                          key={kw}
                          style={{
                            background: C.purpleL,
                            color: C.purple,
                            fontSize: 12,
                            fontWeight: 600,
                            padding: "4px 11px",
                            borderRadius: 99,
                            border: `1px solid ${C.purpleM}`,
                          }}
                        >
                          {kw}
                        </span>
                      ))}
                    </div>
                  </OutputBlock>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Error & action row ── */}
        <div
          style={{
            marginTop: 20,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
          }}
        >
          {error ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: C.redL,
                border: `1px solid #FCA5A5`,
                borderRadius: 8,
                padding: "10px 14px",
                fontSize: 13,
                color: C.red,
              }}
            >
              <X size={13} style={{ flexShrink: 0 }} /> {error}
            </div>
          ) : (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 12,
                color: C.faint,
              }}
            >
              <Keyboard size={13} /> Press{" "}
              <kbd
                style={{
                  background: C.white,
                  border: `1px solid ${C.line}`,
                  borderRadius: 4,
                  padding: "1px 6px",
                  fontSize: 11,
                  fontFamily: "monospace",
                  color: C.muted,
                }}
              >
                Ctrl+Enter
              </kbd>{" "}
              to generate
            </div>
          )}

          <div style={{ display: "flex", gap: 10 }}>
            {result && (
              <>
                <ActionBtn
                  icon={<RefreshCw size={14} />}
                  label="Re-analyse"
                  onClick={generate}
                  color={C.purple}
                />
                <ActionBtn
                  icon={<Download size={14} />}
                  label="Download"
                  onClick={downloadTxt}
                  color={C.teal}
                />
              </>
            )}
            <ActionBtn
              icon={<Zap size={14} />}
              label={loading ? "Analysing…" : "Generate Summary"}
              onClick={generate}
              primary
              loading={loading}
            />
            <ActionBtn
              icon={<Trash2 size={14} />}
              label="Clear"
              onClick={clear}
              danger
            />
          </div>
        </div>
      </div>

      {toast && <Toast msg={toast} onClose={() => setToast("")} />}
    </section>
  );
}

function TA({ value, onChange, mode }) {
  const [focused, setFocused] = useState(false);
  return (
    <textarea
      value={value}
      onChange={onChange}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      placeholder={`Paste your ${mode.toLowerCase()} transcript here…\n\nTip: click "Sample" to load example data, or use Ctrl+Enter to generate.`}
      style={{
        flex: 1,
        width: "100%",
        border: "none",
        outline: "none",
        padding: "18px 18px",
        fontSize: 13.5,
        fontFamily: "var(--font)",
        lineHeight: 1.85,
        resize: "none",
        color: C.ink,
        background: focused ? "#FEFEFE" : C.white,
        boxSizing: "border-box",
        display: "block",
        minHeight: 380,
        transition: "background .15s",
      }}
    />
  );
}

function OutputBlock({ label, color, badge, onCopy, children }) {
  return (
    <div
      style={{
        marginBottom: 24,
        paddingBottom: 24,
        borderBottom: `1px solid ${C.line}`,
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 3,
              height: 14,
              background: color,
              borderRadius: 2,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color,
              letterSpacing: ".8px",
              textTransform: "uppercase",
            }}
          >
            {label}
          </span>
          {badge && (
            <span
              style={{
                fontSize: 11,
                fontWeight: 600,
                color: C.faint,
                background: C.bg,
                padding: "2px 8px",
                borderRadius: 99,
              }}
            >
              {badge}
            </span>
          )}
        </div>
        <button
          onClick={onCopy}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 4,
            background: "none",
            border: `1px solid ${C.line}`,
            color: C.faint,
            padding: "4px 10px",
            borderRadius: 6,
            fontSize: 11,
            fontWeight: 500,
            cursor: "pointer",
            transition: "all .15s",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = color;
            e.currentTarget.style.color = color;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = C.line;
            e.currentTarget.style.color = C.faint;
          }}
        >
          <Copy size={11} /> Copy
        </button>
      </div>
      {children}
    </div>
  );
}

function SmBtn({ icon, label, onClick }) {
  const [h, setH] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 5,
        padding: "5px 12px",
        borderRadius: 6,
        background: h ? C.line + "88" : C.white,
        border: `1px solid ${C.line}`,
        color: h ? C.ink : C.muted,
        fontSize: 11.5,
        fontWeight: 500,
        cursor: "pointer",
        transition: "all .15s",
      }}
    >
      {icon}
      {label}
    </button>
  );
}

function ActionBtn({ icon, label, onClick, primary, danger, loading, color }) {
  const [h, setH] = useState(false);
  let bg, clr, border, shadow;
  if (primary) {
    bg = h ? C.purpleH : C.purple;
    clr = "#fff";
    border = "none";
    shadow = `0 3px 12px ${C.purple}44`;
  } else if (danger) {
    bg = h ? "#fee2e2" : C.redL;
    clr = C.red;
    border = `1.5px solid #FCA5A5`;
    shadow = "none";
  } else if (color) {
    bg = h ? color + "18" : C.white;
    clr = color;
    border = `1.5px solid ${color}44`;
    shadow = "none";
  } else {
    bg = h ? C.bg : C.white;
    clr = C.muted;
    border = `1.5px solid ${C.line}`;
    shadow = "none";
  }

  return (
    <button
      onClick={onClick}
      disabled={loading}
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 7,
        padding: "10px 20px",
        borderRadius: 9,
        background: bg,
        color: clr,
        border,
        fontSize: 13.5,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        boxShadow: shadow,
        transition: "all .15s",
        opacity: loading ? 0.7 : 1,
      }}
    >
      {loading ? <Spinner /> : icon}
      {label}
    </button>
  );
}

/* ═══════════════════════════════════════════════
   HOW IT WORKS
═══════════════════════════════════════════════ */
const STEPS = [
  {
    n: "01",
    title: "Input transcript",
    body: "Paste raw text or upload a .txt file from your meeting or lecture recording. Up to 2,000 words supported.",
    icon: <FileText size={20} />,
    color: C.purple,
  },
  {
    n: "02",
    title: "Configure options",
    body: "Choose Meeting or Lecture mode, then pick a summary length — Brief, Standard, or Detailed.",
    icon: <Zap size={20} />,
    color: C.blue,
  },
  {
    n: "03",
    title: "Generate",
    body: "The NLP pipeline tokenises, scores, and ranks content to surface the most informative sentences.",
    icon: <BarChart2 size={20} />,
    color: C.teal,
  },
  {
    n: "04",
    title: "Export & share",
    body: "Copy as plain text or Markdown, download as .txt, or tick off action items directly in the UI.",
    icon: <Download size={20} />,
    color: C.green,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      style={{
        background: "linear-gradient(180deg, #F5F4F0 0%, #FAF8F5 50%, #FFFFFF 100%)",
        padding: "96px 32px 100px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Ambient gradient lights */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          right: "5%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(108,60,225,0.08) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "10%",
          left: "5%",
          width: 450,
          height: 450,
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(33,82,204,0.07) 0%, transparent 65%)",
          filter: "blur(60px)",
          pointerEvents: "none",
        }}
      />
      <div style={{ maxWidth: 1100, margin: "0 auto", position: "relative" }}>
        <div
          style={{
            display: "flex",
            gap: 72,
            alignItems: "flex-start",
            flexWrap: "wrap",
          }}
        >
          {/* Left label */}
          <div style={{ flex: "0 0 260px" }}>
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                background: C.purpleL,
                border: `1px solid ${C.purpleM}`,
                borderRadius: 99,
                padding: "4px 12px",
                fontSize: 11,
                fontWeight: 700,
                color: C.purple,
                letterSpacing: ".8px",
                textTransform: "uppercase",
                marginBottom: 18,
              }}
            >
              <Sparkles size={11} /> How it works
            </div>
            <h2
              style={{
                fontSize: 36,
                fontWeight: 900,
                color: C.ink,
                letterSpacing: "-1.8px",
                lineHeight: 1.1,
                marginBottom: 20,
              }}
            >
              Four steps,
              <br />
              <span
                style={{
                  background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                }}
              >
                zero friction.
              </span>
            </h2>
            <p
              style={{
                fontSize: 14.5,
                color: C.muted,
                lineHeight: 1.75,
                marginBottom: 24,
              }}
            >
              From raw transcript to structured, shareable notes — no sign-up, no
              backend required.
            </p>
            <a
              href="#tool"
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 7,
                background: C.white,
                color: C.purple,
                border: `1.5px solid ${C.purpleM}`,
                padding: "9px 18px",
                borderRadius: 99,
                fontSize: 13,
                fontWeight: 700,
                textDecoration: "none",
                boxShadow: `0 3px 12px rgba(108,60,225,0.12)`,
                transition: "all .2s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = C.purple;
                e.currentTarget.style.color = "#fff";
                e.currentTarget.style.transform = "translateY(-1px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = C.white;
                e.currentTarget.style.color = C.purple;
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              Try the tool <ArrowRight size={13} />
            </a>
          </div>

          {/* Right steps */}
          <div style={{ flex: 1, minWidth: 320, display: "flex", flexDirection: "column", gap: 12 }}>
            {STEPS.map(({ n, title, body, icon, color }, i) => (
              <HowRow
                key={n}
                n={n}
                title={title}
                body={body}
                icon={icon}
                color={color}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function HowRow({ n, title, body, icon, color }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        display: "flex",
        gap: 20,
        padding: "20px 22px",
        borderRadius: 16,
        background: h
          ? "rgba(255, 255, 255, 0.95)"
          : "rgba(255, 255, 255, 0.65)",
        border: `1.5px solid ${h ? color + "66" : "rgba(227, 225, 219, 0.8)"}`,
        cursor: "default",
        transition: "all .25s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: h ? "translateY(-2px)" : "translateY(0)",
        boxShadow: h
          ? `0 14px 30px -8px ${color}22, 0 2px 10px rgba(0,0,0,0.02)`
          : "0 2px 8px rgba(0,0,0,0.02)",
        backdropFilter: "blur(10px)",
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          background: color + "15",
          border: `1px solid ${color}33`,
          borderRadius: 12,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          boxShadow: h ? `0 0 16px ${color}33` : "none",
          transition: "all .25s ease",
        }}
      >
        {React.cloneElement(icon, {
          color: color,
          size: 19,
        })}
      </div>
      <div style={{ flex: 1 }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            marginBottom: 6,
          }}
        >
          <span
            style={{
              fontSize: 11,
              fontWeight: 800,
              color: color,
              letterSpacing: ".5px",
            }}
          >
            {n}
          </span>
          <div
            style={{
              width: 1,
              height: 12,
              background: C.line,
            }}
          />
          <span
            style={{
              fontSize: 16,
              fontWeight: 750,
              color: C.ink,
              letterSpacing: "-.3px",
            }}
          >
            {title}
          </span>
        </div>
        <p
          style={{
            fontSize: 13.5,
            color: C.muted,
            lineHeight: 1.65,
            margin: 0,
          }}
        >
          {body}
        </p>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   ABOUT
═══════════════════════════════════════════════ */
const FEATURES = [
  [
    <Mic size={16} />,
    "Two Modes",
    "Meeting & Lecture — optimised separately",
    C.purple,
  ],
  [
    <Hash size={16} />,
    "Keyword Tags",
    "Auto-extracted topic keywords from transcript",
    C.blue,
  ],
  [
    <CheckSquare size={16} />,
    "Interactive Checklist",
    "Tick off action items directly in the UI",
    C.teal,
  ],
  [
    <Download size={16} />,
    "Export Options",
    "Download .txt or copy as Markdown",
    C.green,
  ],
  [
    <BarChart2 size={16} />,
    "Confidence Score",
    "Mock confidence metric per analysis",
    C.purple,
  ],
  [
    <Keyboard size={16} />,
    "Keyboard Shortcut",
    "Ctrl+Enter to generate instantly",
    C.blue,
  ],
];

export function About() {
  const tech = [
    ["React 19", "#0EA5E9"],
    ["Vite 8", "#F97316"],
    ["Tailwind 4", C.teal],
    ["Lucide React", C.purple],
    ["ES2024", "#CA8A04"],
  ];
  const info = [
    ["University", "KR Mangalam University"],
    ["Project", "Project 18"],
    ["Group", "Group 2"],
    ["Domain", "NLP / Text Summarisation"],
    ["Stack", "React · Vite · Tailwind · Lucide"],
    ["Year", "2026"],
  ];

  return (
    <section
      id="about"
      style={{
        background: C.white,
        borderTop: `1px solid ${C.line}`,
        padding: "88px 32px",
      }}
    >
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        {/* Features grid */}
        <div style={{ marginBottom: 72 }}>
          <div
            style={{
              fontSize: 11,
              fontWeight: 700,
              color: C.faint,
              letterSpacing: "1px",
              textTransform: "uppercase",
              marginBottom: 14,
            }}
          >
            Features
          </div>
          <h2
            style={{
              fontSize: 32,
              fontWeight: 900,
              color: C.ink,
              letterSpacing: "-1.5px",
              marginBottom: 36,
            }}
          >
            What SAAR AI can do
          </h2>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: 16,
            }}
          >
            {FEATURES.map(([icon, title, desc, color]) => (
              <FeatureCard
                key={title}
                icon={icon}
                title={title}
                desc={desc}
                color={color}
              />
            ))}
          </div>
        </div>

        {/* About split */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 64,
            alignItems: "start",
          }}
        >
          <div>
            <div
              style={{
                fontSize: 11,
                fontWeight: 700,
                color: C.faint,
                letterSpacing: "1px",
                textTransform: "uppercase",
                marginBottom: 14,
              }}
            >
              About the project
            </div>
            <h2
              style={{
                fontSize: 28,
                fontWeight: 900,
                color: C.ink,
                letterSpacing: "-1.2px",
                marginBottom: 18,
              }}
            >
              KR Mangalam Capstone, 2026
            </h2>
            <p
              style={{
                fontSize: 15,
                color: C.muted,
                lineHeight: 1.85,
                marginBottom: 20,
              }}
            >
              <strong style={{ color: C.ink }}>SAAR AI</strong> (<em>"Extract What Matters"</em>) is the
              frontend prototype for{" "}
              <strong style={{ color: C.ink }}>
                Project 18: Meeting &amp; Lecture Summarisation Using NLP
              </strong>
              . The UI is production-ready and designed to drop onto any NLP
              backend — extractive or abstractive.
            </p>
            <p
              style={{
                fontSize: 15,
                color: C.muted,
                lineHeight: 1.85,
                marginBottom: 28,
              }}
            >
              All components are modular. The{" "}
              <code
                style={{
                  fontFamily: "var(--mono)",
                  background: C.bg,
                  padding: "1px 6px",
                  borderRadius: 4,
                  fontSize: 12,
                }}
              >
                generate()
              </code>{" "}
              function expects a plain JSON response — backend wiring is a
              one-line change.
            </p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
              {tech.map(([label, color]) => (
                <span
                  key={label}
                  style={{
                    background: color + "14",
                    color,
                    border: `1px solid ${color}28`,
                    fontSize: 12,
                    fontWeight: 700,
                    padding: "5px 13px",
                    borderRadius: 99,
                  }}
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <div>
            {info.map(([k, v], i) => (
              <div
                key={k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "16px 0",
                  borderBottom:
                    i < info.length - 1 ? `1px solid ${C.line}` : "none",
                }}
              >
                <span style={{ fontSize: 13, color: C.faint, fontWeight: 500 }}>
                  {k}
                </span>
                <span style={{ fontSize: 14, color: C.ink, fontWeight: 600 }}>
                  {v}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function FeatureCard({ icon, title, desc, color }) {
  const [h, setH] = useState(false);
  return (
    <div
      onMouseEnter={() => setH(true)}
      onMouseLeave={() => setH(false)}
      style={{
        padding: "22px",
        background: h
          ? "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(245,244,240,0.8))"
          : "rgba(255, 255, 255, 0.7)",
        border: `1.5px solid ${h ? color + "66" : "rgba(227, 225, 219, 0.8)"}`,
        borderRadius: 16,
        transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        transform: h ? "translateY(-4px)" : "translateY(0)",
        boxShadow: h
          ? `0 16px 32px -8px ${color}25, 0 4px 12px rgba(0,0,0,0.03)`
          : "0 2px 8px rgba(0,0,0,0.02)",
        backdropFilter: "blur(8px)",
      }}
    >
      <div
        style={{
          width: 42,
          height: 42,
          background: color + "18",
          borderRadius: 11,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          marginBottom: 16,
          boxShadow: h ? `0 0 16px ${color}33` : "none",
          transition: "all 0.25s ease",
        }}
      >
        {React.cloneElement(icon, { color })}
      </div>
      <div
        style={{ fontSize: 14, fontWeight: 700, color: C.ink, marginBottom: 6 }}
      >
        {title}
      </div>
      <div style={{ fontSize: 13, color: C.faint, lineHeight: 1.6 }}>
        {desc}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════
   FOOTER
═══════════════════════════════════════════════ */
export function Footer() {
  return (
    <footer
      style={{
        background: C.bg,
        borderTop: `1px solid ${C.line}`,
        padding: "28px 32px",
      }}
    >
      <div
        style={{
          maxWidth: 1100,
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: 12,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div
            style={{
              width: 24,
              height: 24,
              background: `linear-gradient(135deg, ${C.purple}, ${C.blue})`,
              borderRadius: 6,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <FileText size={12} color="#fff" />
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: C.ink }}>
            SAAR AI
          </span>
          <span style={{ color: C.line2 }}>·</span>
          <span style={{ fontSize: 13, color: C.muted, fontWeight: 600 }}>
            Extract What Matters.
          </span>
          <span style={{ color: C.line2 }}>·</span>
          <span style={{ fontSize: 13, color: C.faint }}>
            Meeting &amp; Lecture Summarisation Using NLP · KR Mangalam University · Project 18 · Group 2 · 2026
          </span>
        </div>
        <span style={{ fontSize: 12, color: C.faint }}>
          Frontend demo only — no backend, no real AI output.
        </span>
      </div>
    </footer>
  );
}
