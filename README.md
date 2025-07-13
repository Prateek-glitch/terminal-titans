
<div align="center">
  <img src="https://github.com/Prateek-glitch/terminal-titans/blob/main/cyberscan-bg.png" alt="CyberScan Logo" width="120" />
  <h1>CyberScan</h1>
  <p><strong>AI-powered Vulnerability Scanner Dashboard</strong></p>
  <p>Modern full-stack tool for automated pentesting, LLM analysis, and beautiful reporting</p>
  <br/>
</div>

---

## 🌐 Overview

**CyberScan** is a full-stack, glassmorphic web app that helps security teams and ethical hackers automate network reconnaissance and vulnerability scanning using tools like **Nmap**, **Nikto**, **WhatWeb**, and more. It integrates **Google Gemini** to analyze output, suggest remediations, and help users install missing tools.

---

## 🚧 Key Features

- Custom scan orchestration using well-known tools (Nmap, Nikto, etc.)
- Interactive glassmorphic dashboard built with React & Tailwind
- Real-time output parsing with LLM-based insights (via Gemini)
- Automatic PDF report generation
- Missing tool detection + LLM-powered install help
- File upload & scan parsing support
- Local deployment with zero paid dependencies

---

## 🧰 Tech Stack

| Layer       | Tech Used                                                                 |
|-------------|---------------------------------------------------------------------------|
| Frontend    | ![Next.js](https://img.shields.io/badge/-Next.js-black?logo=next.js) ![React](https://img.shields.io/badge/-React-20232a?logo=react) ![TailwindCSS](https://img.shields.io/badge/-Tailwind-06B6D4?logo=tailwindcss) |
| Backend     | ![Node.js](https://img.shields.io/badge/-Node.js-339933?logo=node.js) ![Express](https://img.shields.io/badge/-Express.js-black?logo=express) |
| LLM         | ![Gemini](https://img.shields.io/badge/-Gemini-4285F4?logo=google) |
| Scanning    | ![Nmap](https://img.shields.io/badge/-Nmap-00457C?logo=nmap) ![Nikto](https://img.shields.io/badge/-Nikto-EE3A43?logo=ruby) ![Httpx](https://img.shields.io/badge/-Httpx-0E76A8?logo=go) ![WhatWeb](https://img.shields.io/badge/-WhatWeb-CC342D?logo=ruby) |
| Reports     | ![PDFKit](https://img.shields.io/badge/-PDFKit-FF9800?logo=adobeacrobatreader) |
| Optional DB | ![PostgreSQL](https://img.shields.io/badge/-PostgreSQL-4169E1?logo=postgresql) via Docker |

---

## 📸 UI Previews

| Dashboard | Scan + AI Insights |
|----------|--------------------|
| ![Dashboard](https://github.com/Prateek-glitch/terminal-titans/blob/main/cyber-1.png) | ![Insights](https://github.com/Prateek-glitch/terminal-titans/blob/main/cyber-2.png) |

---

## ⚙️ Local Setup

> **Requires:** Node.js, npm, and system-installed tools (Nmap, Nikto, etc.)

### 1. Clone the Repo

```bash
git clone https://github.com/Prateek-glitch/terminal-titans
cd terminal-titans

