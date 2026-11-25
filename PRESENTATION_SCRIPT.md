# 🎓 Presentation Script & Slide Deck: SAAR AI
**Project 18: Meeting & Lecture Summarisation Using NLP**  
**Tagline: Extract What Matters.**  
**KR Mangalam University | B.Tech Capstone Project | Group 2**

---

## 📋 Presentation Overview
- **Duration**: ~8 to 10 Minutes
- **Tone**: Professional, confident, technically sound, and user-centric.
- **Audience**: Faculty Evaluators, External Examiners, and Peers.

---

## Slide 1: Title & Introduction
### 🖼️ Slide Content:
- **Project Name**: SAAR AI
- **Tagline**: Extract What Matters.
- **Academic Title**: Meeting & Lecture Summarisation Using NLP
- **Course**: NLP Capstone Project (Project 18)
- **Institution**: School of Engineering & Technology, KR Mangalam University
- **Team**: Group 2

### 🎙️ Speaking Script:
> *"Good morning respected professors and panel members. Today, Group 2 is proud to present **SAAR AI** — with our core philosophy: **Extract What Matters**. This is our frontend prototype for Project 18: Meeting & Lecture Summarisation Using NLP.*  
>  
> *In today's fast-paced academic and corporate environment, hours are spent sitting through lengthy lectures and team meetings. Capturing insights while actively listening is difficult. SAAR AI bridges this gap with an intuitive, production-grade interface designed to transform raw transcripts into actionable, structured intelligence."*

---

## Slide 2: Problem Statement & Motivation
### 🖼️ Slide Content:
- **Information Overload**: Lengthy meetings and audio/text lecture transcripts are hard to parse.
- **Context Loss**: Key decisions and academic concepts get buried in chat logs and transcripts.
- **Lack of Structure**: Generic summarisers generate dense text blocks without separating action points from core concepts.
- **Objective**: Create a modular, responsive single-page platform capable of contextual summarisation tailored specifically for **Corporate Meetings** and **Academic Lectures**.

### 🎙️ Speaking Script:
> *"What problem are we solving? Most existing summarisation tools treat all text identically. But a corporate sprint meeting has distinct needs — like deadlines, bug reports, and task assignments — while a university lecture focuses on core theories, definitions, and exam takeaways.*  
>  
> *SAAR AI provides specialised **Meeting** and **Lecture** modes, delivering not just a summary, but key takeaways, actionable checklists, and topic keyword extraction."*

---

## Slide 3: Tech Stack & Architecture
### 🖼️ Slide Content:
| Layer | Technologies Used |
| :--- | :--- |
| **Framework & Core** | React 19, JavaScript (ES2024), HTML5 |
| **Build Tool & Bundler** | Vite 8 (Hot Module Replacement, LightningCSS) |
| **Styling & Design System** | Tailwind CSS v4, Custom CSS3 Morphing Keyframes, PostCSS |
| **Icons & Micro-interactions** | Lucide React (featherweight SVG icons) |
| **Package Management** | pnpm (fast, deterministic dependency resolution) |
| **Architectural Pattern** | Modular Component Architecture (Backend-Ready State Contracts) |

### 🎙️ Speaking Script:
> *"On the engineering side, SAAR AI is powered by modern, bleeding-edge web technologies.*  
>  
> *We opted for **React 19** combined with **Vite 8** for lightning-fast build performance and instantaneous hot-module replacement. Styling is built with **Tailwind CSS v4** paired with custom GPU-accelerated CSS animations. The entire application is architected modularly with decoupled states, making it 100% ready to bind with any NLP backend API (such as HuggingFace, FastAPI, or a Python Transformer pipeline)."*

---

## Slide 4: Key Features & Functional Modules
### 🖼️ Slide Content:
1. **Dual Domain Modes**:
   - *Meeting Mode*: Focuses on agenda items, sprint blockers, and stakeholder duties.
   - *Lecture Mode*: Highlights academic theories, paper citations, and formulas.
2. **Flexible Input Handling**:
   - Drag-and-drop / `.txt` file upload support.
   - Real-time word counter with dynamic length validation chips.
   - One-click sample transcript loader for quick evaluation.
3. **Multi-Faceted Output Studio**:
   - Executive Abstract Summary.
   - Extracted Key Takeaways with numbered indexing.
   - **Interactive Action Checklist** with live state strike-through.
   - Auto-extracted **Keyword Tags**.
4. **Export & Portability**:
   - Copy to clipboard (individual sections or full report).
   - Export as Markdown (`.md`) or formatted `.txt` download (`saar-ai-[mode]-summary.txt`).
5. **Developer & Accessibility Shortcuts**:
   - `Ctrl + Enter` (or `Cmd + Enter`) instant analysis trigger.

### 🎙️ Speaking Script:
> *"Let's look at the functional capabilities of SAAR AI.*  
> *The application handles both raw text input and `.txt` file uploads, validating lengths in real-time. Upon analysis, instead of a plain text blob, users receive a multi-tiered breakdown:*  
> *First, a concise executive summary. Second, numbered key points. Third, an interactive checklist of action items where users can tick off tasks directly on the screen. And fourth, keyword tags for quick scanning. Everything can be copied or exported as Markdown and plain text files with a single click."*

---

## Slide 5: UI/UX & Design Philosophy
### 🖼️ Slide Content:
- **Floating Glassmorphism Navbar**: Transparent frosted glass header (`backdrop-filter: blur(20px)`), smooth lift-up hover transitions.
- **Living Canvas (Organic Liquid Mesh)**: Fluid background blobs gently moving with multi-axis keyframe morphing, avoiding flat, static screens.
- **Pro SaaS Aesthetics**: Clean slate typography, restrained soft shadows, and subtle purple/royal-blue ambient glows (`#6C3CE1` & `#2152CC`).
- **Zero Visual Friction**: Eliminated harsh contrast boxes in favor of soft gradients and balanced whitespace.

### 🎙️ Speaking Script:
> *"A significant milestone in this project was creating a high-grade UI/UX experience.*  
>  
> *We implemented a floating glassmorphism header, smooth pill toggles, and an ambient 'living canvas' effect where organic liquid gradients move softly in the background like gentle water. The cards feature subtle glow halos on hover. This ensures the user experience feels like a modern SaaS platform rather than a rudimentary academic prototype."*

---

## Slide 6: Backend-Readiness & NLP Integration Pipeline
### 🖼️ Slide Content:
```
[User Input: Raw Transcript]
            │
            ▼
[Client-side Validation (Word count & format check)]
            │
            ▼
[API Contract: POST /api/v1/summarise { text, mode, length }]
            │
            ▼
[NLP Backend Engine (e.g., T5 / BART / PEGASUS / OpenAI API)]
            │
            ▼
[JSON Response: { summary, key_points, action_items, keywords, stats }]
            │
            ▼
[State Re-render in SAAR AI Output Studio]
```

### 🎙️ Speaking Script:
> *"A core requirement of our capstone was to ensure SAAR AI is not an isolated mockup, but a backend-ready application.*  
>  
> *The entire frontend communicates through clean JavaScript payload contracts. When connected to a backend, the `generate()` function sends the transcript payload, length parameters, and domain mode to an NLP inference engine (like a fine-tuned T5 or BART model), which parses the text and feeds structured JSON back to our UI components."*

---

## Slide 7: Live Demonstration (Walkthrough)
### 🖼️ Slide Content:
- **Step 1**: Selecting **Meeting Mode** and loading the sample sprint transcript.
- **Step 2**: Triggering summarisation with `Ctrl + Enter`.
- **Step 3**: Reviewing the generated summary, checking off action items.
- **Step 4**: Exporting the report via the **Download `.txt`** and **Markdown** buttons.
- **Step 5**: Switching to **Lecture Mode** to demonstrate academic summarisation.

### 🎙️ Speaking Script:
> *(While screen-sharing or presenting the live UI)*  
> *"Allow us to demonstrate SAAR AI in action.*  
> *Here on the main canvas, we select 'Meeting Mode' and click 'Sample' to load a team transcript. Notice the real-time word counter and length badge. When we press 'Generate Summary', our loading skeleton simulates the processing phase.*  
> *Instantly, we receive the summary, 8 key highlights, and action items. I can check off Sam's duty directly here. Clicking 'Download' gives us a clean `.txt` file ready to be shared with stakeholders."*

---

## Slide 8: Future Scope & Roadmap
### 🖼️ Slide Content:
- **Direct Audio/Video Transcription**: Integrating Whisper API / Wav2Vec for direct audio upload summarisation.
- **Speaker Diarisation**: Automatically tagging which participant said which point (`[Speaker A]`, `[Speaker B]`).
- **Calendar & Notion Integration**: Syncing extracted action items directly to Google Calendar, Trello, or Jira.
- **Multi-lingual Support**: Summarisation across vernacular Indian languages via IndicBERT.

### 🎙️ Speaking Script:
> *"Looking ahead, our roadmap for SAAR AI includes integrating speech-to-text engines like Whisper for direct audio ingestion, automatic speaker diarisation to track individual contributions, and syncing action items directly to project tools like Jira or Google Calendar."*

---

## Slide 9: Conclusion & Q&A
### 🖼️ Slide Content:
- **Project 18 Summary**: SAAR AI — Meeting & Lecture Summarisation Using NLP.
- **Key Takeaways**: High-performance React 19 frontend, clean visual hierarchy, modular NLP integration architecture.
- **Acknowledgement**: Guided by the Faculty of Computer Science & Engineering, KR Mangalam University.
- **Q&A**: Open for questions.

### 🎙️ Speaking Script:
> *"To conclude, SAAR AI demonstrates how modern NLP systems can be delivered through elegant, accessible, and user-centric interfaces. We thank our mentors and professors for their guidance throughout Project 18.*  
>  
> *We are now open to any questions and feedback from the panel. Thank you!"*
