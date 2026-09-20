# Pulilan: Kasaysayan at Pamana
### *An Interactive Digital Cultural Monograph & Art Appreciation Web Exhibition*

[![Developer](https://img.shields.io/badge/Developer-Wigibles%20Creations-D97724?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Wigibles)
[![Web Tech](https://img.shields.io/badge/Tech-HTML5%20%7C%20Vanilla%20CSS3%20%7C%20ES6+-8D5119?style=for-the-badge)](https://github.com/Wigibles/PulilanWebsite)
[![Heritage](https://img.shields.io/badge/Heritage-Pulilan%2C%20Bulacan-2D2925?style=for-the-badge)](https://celebrate.pulilan.gov.ph)

---

## 📖 Overview

**Pulilan: Kasaysayan at Pamana** is a bespoke, museum-grade cultural web application dedicated to the history, sacred architecture, agrarian traditions, and culinary heritage of **Pulilan, Bulacan, Philippines**. 

Crafted with an editorial design language inspired by world-class museum monographs, this digital exhibition bridges centuries of devotion—from the 18th-century Augustinian foundation and the iconic **Kneeling Carabao Festival**, to centuries-old Spanish colonial ruins, equestrian sports grounds, ancestral heritage homes, and celebrated heirloom dishes.

Developed by **[Wigibles Creations](https://github.com/Wigibles)**, this application was built with performance, accessibility, storytelling, and visual elegance at its core.

---

## 👨‍💻 Main Developer & Creative Lead

* **Developer**: **[Wigibles Creations](https://github.com/Wigibles)**
* **GitHub Profile**: [https://github.com/Wigibles](https://github.com/Wigibles)
* **Repository**: [https://github.com/Wigibles/PulilanWebsite](https://github.com/Wigibles/PulilanWebsite)

---

## ✨ Key Interactive Features

### 🏛️ 1. Curatorial Exhibition Rooms (00 – 08)
Structured as a sequential museum walk-through:
* **Room 00: Curatorial Introduction** — Overview of Pulilan’s geography, founding (1749), agrarian roots, and metric highlights.
* **Room 01: Diocesan Shrine & Parish of San Isidro Labrador** — Founded in 1749, consecrated stone church (1826) standing at the spiritual heart of the town.
* **Room 02: Pulong Kabyawan Heritage Site** — Echoes of ancient sugarcane milling and the historic sugar heritage of Barangay Inaon.
* **Room 03: Spanish Colonial Era Cemetery (Campo Santo)** — Restored heritage mortuary chapel, adobe arches, and centuries-old burial grounds in Barangay San Jose.
* **Room 04: North Polo Club** — Premier 26-hectare equestrian sports facility in Barangay Tibag, celebrating modern heritage and sportsmanship.
* **Room 05: Casa San Francisco (Laxamana Heritage House)** — 1929 pre-war *bahay na bato* showcasing preserved capiz windows, antique woodwork, and Mandalá Art Festival exhibitions.
* **Room 06: The Kneeling Carabao Festival** — World-famous May 14th patronal devotion where hundreds of carabaos genuflect before the Diocesan Shrine.
* **Room 07: Heirloom Culinary Traditions** — Gastronomic profile of *Sumang Bulagta* (flattened sticky rice cake) and crispy *Fried Itik* (savory game duck delicacy).
* **Room 08: Visitor Concierge & Directory** — Practical transit guide, municipal directory, emergency hotlines, and travel advisory.

---

### 🎬 2. Dual YouTube Video Showcases & Floating Mini-Player (PiP)
Seamlessly embedded documentary media with intelligent viewing controls:
* **Chapter 01 Showcase**: *"Viva San Isidro"* — Official patronal theme song composed by Jon Meer Vera Perez honoring the Diocesan Shrine.
* **Chapter 06 Showcase**: *Kneeling Carabao Festival 2024* — Live documentary coverage produced by Tagapagkwento Film Productions.
* **Floating Picture-in-Picture (PiP) on Scroll**: When a visitor plays a video and scrolls through other sections, the video smoothly lifts into a fixed, docked mini-player in the corner without interrupting playback.
* **Mini-Player Controls**: Includes inline Pause/Play, **+10s Skip**, and Stop/Close buttons.

---

### 🎵 3. Ambient Heritage Soundscape (*Bagani*)
* Features subtle acoustic background music using the track **Bagani**.
* **Smart Audio Ducking**: The ambient sound automatically mutes whenever a user starts playing any video documentary and seamlessly resumes once the video is paused or stopped.
* Includes a masthead sound toggle with live pulsating audio equalizer wave visualization.

---

### 📸 4. Archival Photographic Collection & Multi-View Switchers
* **Artifact Photo Switchers**: Interactive thumbnail carousels on each chapter exhibit card allowing visitors to switch viewpoints in real time.
* **Archival Festival Gallery**: A dedicated 2-column curated photo collection displaying:
  1. *Traditional Kneeling Rites* (Carabao decorated with ceremonial red & yellow ruffles).
  2. *Church Square Devotion* (Kneeling directly before the stone shrine facade).
  3. *Barangay Float Parade* (Hand-painted carabao pulling decorated floral kubos).
  4. *Carabao Heritage Street Mural* (Vibrant public folk art along town walls).
* **Full-Screen Curatorial Lightbox**: Deep zoom modal equipped with curatorial captions, tags, source location, slide counters, thumbnail strips, keyboard navigation (`←`/`→`/`Esc`), and mobile touch swipe.

---

### 🗺️ 5. Interactive Cartographic Map & Spatial Wayfinder
* Live responsive Google Maps spatial integration showing exact pinned coordinates for all major cultural sites in Pulilan.
* Includes quick-filter cluster pills (Religious, Historical, Modern, Culinary) and interactive spatial node trails.

---

### 🐂 6. Scoped Carabao Docent Peeker & Editorial Cursor
* **Interactive Docent**: A subtle, playful mascot peeks from the right edge on key chapters with a curated speech bubble delivering historical facts and voice-line audio.
* **Custom Theme Cursor**: Bespoke terracotta and gold medallion tracker that reacts with smooth spring physics and contextual hover states (`EXPLORE`, `VIEW PHOTO`, `PLAY VIDEO`).

---

## 📁 Repository Structure

```text
PulilanWebsite/
│
├── index.html                  # Core single-page application structure & semantic layout
├── README.md                   # Project documentation & credits
├── favicon.ico                 # Standard browser tab icon
├── favicon.png                 # High-resolution PNG app icon
├── favicon.svg                 # Scalable vector logo icon
│
├── assets/                     # Curated high-resolution imagery & audio
│   ├── Bagani.mp3              # Ambient background soundscape track
│   ├── Carabao.png             # Hero transparent carabao motif
│   ├── pulilan-seal.png        # Official Municipal Seal of Pulilan
│   ├── San Isidro Church.jpg   # Diocesan Shrine exterior photograph
│   ├── Kneeling Carabao Festival Traditional Rites.jpg
│   ├── Kneeling Carabao Festival Church Rites.jpg
│   ├── Kneeling Carabao Festival Parade Float.jpg
│   ├── Kneeling Carabao Festival Street Mural.jpg
│   ├── Pulong Kabyawan.jpg
│   ├── Spanish Colonial Era Cemetery.jpg
│   ├── North Polo Club.jpg
│   ├── Casa San Francisco.jpg
│   ├── Sumang Bulagta.jpg
│   └── Fried itik.jpg
│
├── css/
│   └── style.css               # Comprehensive editorial design system & responsive layout
│
└── js/
    ├── data.js                 # Curatorial database (sites, history, coordinates, media)
    └── main.js                 # Interactive controllers (scroll-spy, soundscape, videos, lightbox)
```

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Markup** | Semantic HTML5 with ARIA accessibility roles & landmarks |
| **Styling** | Vanilla CSS3 (Custom design system, CSS Variables, Flexbox, CSS Grid) |
| **Typography** | Google Fonts (*Playfair Display*, *Plus Jakarta Sans*, *Cinzel*) |
| **Logic & Interactivity** | Vanilla JavaScript (ES6+), YouTube IFrame Player API |
| **Media Architecture** | Embedded HTML5 `<audio>`, Lazy-loaded WebP/JPEG image pipelines |
| **Spatial Mapping** | Google Maps Embed API with dynamic query parameters |

---

## 🚀 Running Locally

Because this project uses modern web standards (ES6 modules and embedded audio/video assets), it is best viewed via a local HTTP server:

### Option 1: Python 3
```bash
# Navigate to project folder
cd PulilanWebsite

# Start local server on port 8000
python -m http.server 8000
```
Then open `http://localhost:8000` in any modern web browser.

### Option 2: Node.js / `npx serve`
```bash
npx serve .
```

### Option 3: VS Code Live Server
Right-click `index.html` and select **"Open with Live Server"**.

---

## 📚 Historical & Research References

Content within this monograph has been gathered from official government archives, news dispatches, and local heritage initiatives:
* **Municipality of Pulilan Official Portal**: [celebrate.pulilan.gov.ph](https://celebrate.pulilan.gov.ph)
* **Diocesan Shrine & Parish of San Isidro Labrador Archive**: [dspsilpulilan.franzcreations.site](https://dspsilpulilan.franzcreations.site)
* **Catholic Bishops' Conference of the Philippines (CBCP News)**: *Bulacan Bishop Elevates Pulilan Church to Diocesan Shrine*
* **Philippine Daily Inquirer**: *Pulilan, Bulacan Leads the Way in Heritage-Based Sustainable Development*
* **Manila Bulletin / Tempo**: *Kneeling Carabaos to Wow Pulilan Fiesta Crowds*
* **Video Documentary**: *Tagapagkwento Film Productions* (Coverage of Kneeling Carabao Festival 2024)
* **Hymn Composition**: *Viva San Isidro* composed by Jon Meer Vera Perez (RankOne)
* **Musical Monograph**: *Bagani* performed by Anthony Castillo & Pinopela

---

## ⚖️ License & Attribution

* **Software & Web Application**: Designed and developed by **[Wigibles Creations](https://github.com/Wigibles)**.
* **Cultural Content & Imagery**: All photographs, municipal seals, and historical monographs belong to their respective cultural caretakers, photographers, and the Municipality of Pulilan, Bulacan. Used here for cultural preservation and educational art appreciation purposes.
