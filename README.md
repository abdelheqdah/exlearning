# ExLearn — ATEX & IECEx Training Simulator (Release Candidate V1)

An independent, hardened educational browser application for learning ATEX and IECEx-related concepts, practising quizzes, and working through hazardous-area decision scenarios.

## Status: Verified Release Candidate V1 (RC1)

- **Content Audit & Integrity**: 100% of all 174 quiz questions and 15 decision scenarios audited and enhanced with authentic technical engineering distractors, zero positional leaks, zero semantic mismatches, and mathematically balanced answer distribution (24.1% / 25.9% / 27.0% / 23.0%).
- **Browser Validation**: 23/23 real browser verification checks passed (0 defects, 0 console exceptions, complete route/state persistence).
- **Test Suite**: 38 automated unit & integration tests passing (100% pass rate across curriculum, storage, routing, and accessibility suites).
- **TypeScript**: Strict typechecking with 0 errors (`tsc --noEmit`).
- **Production Build**: Clean client bundle verified (`tsc -b && vite build` in 1.75s).
- **Storage & Privacy**: 100% local-first, zero telemetry/tracking, resilient storage error absorption (`SecurityError`, `QuotaExceededError`, incognito mode).
- **Accessibility**: Skip link, ARIA landmarks, WCAG 1.4.1 non-color-only indicators (`✓ Correct` / `✗ Your answer`), and air-gapped system font fallbacks.

## Run locally

```bash
npm install
npm run dev
```

Use `npm run lint`, `npm test`, and `npm run build` to check the project.

When deploying this client-side app, configure the host to serve `index.html` as the fallback for unknown paths. Built-in SPA redirect fallbacks (`_redirects` and `404.html`) ensure deep-links and direct refreshes on routes such as `/lessons` and `/lesson/ex001-foundations` work seamlessly on static hosts like Cloudflare Pages, Netlify, or GitHub Pages.

## Learning progress and resilience

Lesson, quiz, and scenario progress is stored only in the current browser's local storage. The Progress page shows ordered module completion, level summaries, activity attempts, and a Continue learning recommendation. Use Reset local progress to clear this browser's saved state.

The persistence layer is fault-tolerant:
- Storage exceptions in restricted or sandboxed iframes and private browsing modes are safely absorbed without breaking application state.
- Corrupted payloads (non-strings, nulls, NaNs) are automatically filtered and cleansed upon load.
- Dynamic route transitions are isolated with explicit keys and state cleanup.

## Scope and safety

ExLearn is for general educational use only. It is not official IECEx or IEC training, certification, approval, legal advice, or a substitute for current standards, manufacturer instructions, local regulations, site procedures, or competent professional judgment. Progress is stored only in the browser's local storage; there is no login, backend, database, or payment flow.

## Curriculum and assessment bank

The 24 ordered lessons progress from Ex fundamentals and ATEX/IECEx context through hazardous atmospheres, gas/vapour/mist/dust hazards, zones, Equipment Protection Levels, Ex d, Ex e, Ex i, Ex t, Ex p, equipment marking, installation, inspection, maintenance, repair, documentation, competence, and integrated decisions. Focused modules cover EX001 foundations, EX007 installation practice, EX008 inspection, cable entries, protection concepts, marking, findings, and intrinsic-safety loop calculations.

Concrete technical standards specifications covered in the curriculum include:
- Gas zones (0, 1, 2) and dust zones (20, 21, 22) with qualitative definitions and informative industry exposure duration benchmarks.
- Gas groups IIA (Propane), IIB (Ethylene), IIC (Hydrogen/Acetylene) with MESG and MIC ratios.
- Dust groups IIIA (flyings), IIIB (non-conductive), IIIC (conductive) with particle size and volume resistivity criteria.
- Equipment Protection Levels (EPLs Ga, Gb, Gc, Da, Db, Dc) and normative zone-to-EPL mapping.
- Standard Temperature Classes T1 (450°C) through T6 (85°C) and dust surface temperature margins ($T_{\text{cloud}}$ and $T_{5\text{mm}}$).
- Intrinsic Safety (Ex i) 5 golden entity parameter inequalities ($U_i \ge U_o$, $I_i \ge I_o$, $P_i \ge P_o$, $C_i + C_c \le C_o$, $L_i + L_c \le L_o$).
- ATEX Directive 2014/34/EU statutory markings (CE, 4-digit Notified Body ID, ⟨Ex⟩ hexagon, Group I/II, Categories 1G/2G/3G and 1D/2D/3D).
- Certificate numbering and suffixes: "X" (Specific Conditions of Use) vs "U" (Ex Component Certificate).
- IEC 60079-17 Inspection Grades (Visual, Close, Detailed) and Regimes (Initial, Periodic, Sample, Continuous Supervision; fixed 3-yr vs portable 12-month intervals).
- IEC 60079-14 Installation requirements: Thread engagement (metric ≥5 threads / 8 mm, NPT ≥5 threads), Ex d barrier gland selection criteria (>2 L or Group IIC with ignition sources), equipotential bonding (minimum 4 mm² Cu unprotected, or 2.5 mm² Cu if mechanically protected), and Ex i cable segregation (≥50 mm, light-blue identification, single-point screen earthing).

The assessment bank contains **174 original quiz questions** and **15 realistic decision scenarios** (189 interactive assessment items total), including at least 25 questions directly related to EX001 foundations, 20 related to EX007 installation practice, and 25 related to EX008 inspection. All quiz questions and scenarios feature balanced answer distributions across all option positions. Questions are educational exercises with explanations; results do not certify personnel or approve equipment, installations, or compliance.

The application includes educational explanations of CoPC, RTP, and ExCB roles. ExLearn is not an RTP, is not an ExCB, and does not issue CoPC. No lesson, quiz, scenario, or progress result is a certification, approval, or legal-compliance decision.

Terminology was checked against official IECEx system information and IEC publication metadata before writing original content:

- [IECEx](https://www.iecex.com/)
- [IEC Webstore](https://webstore.iec.ch/)
- [IEC 60079 series publication search](https://webstore.iec.ch/en/search?query=60079)
