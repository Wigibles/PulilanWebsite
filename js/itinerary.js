/**
 * Pulilan Day Tour Curator
 * A quiet, minimalist day planner for travelers visiting Pulilan, Bulacan.
 */

const ITINERARY_PRESETS = {
  heritage: {
    name: "Sacred & Colonial Heritage (Half Day)",
    stops: ["san-isidro-church", "campo-santo-cemetery", "sumang-bulagta", "casa-san-francisco"]
  },
  agri: {
    name: "Agri-Heritage & Food Trail (6 Hours)",
    stops: ["sumang-bulagta", "pulong-kabyawan", "fried-itik", "north-polo-club"]
  },
  odyssey: {
    name: "The Full Pulilan Discovery (Full Day)",
    stops: [
      "san-isidro-church",
      "campo-santo-cemetery",
      "sumang-bulagta",
      "casa-san-francisco",
      "fried-itik",
      "pulong-kabyawan",
      "north-polo-club",
      "bulacan-special-lomi"
    ]
  }
};

const ALL_DESTINATIONS = [
  { id: "san-isidro-church", name: "Diocesan Shrine of San Isidro Labrador", type: "1826 Spanish Stone Church", duration: 60 },
  { id: "campo-santo-cemetery", name: "Spanish Colonial Era Campo Santo", type: "18th-Century Mortuary Gate", duration: 45 },
  { id: "sumang-bulagta", name: "Sumang Bulagta Morning Market Walk", type: "Heirloom Kakanin Tasting", duration: 45 },
  { id: "casa-san-francisco", name: "Casa San Francisco (Laxamana House)", type: "1929 Bahay na Bato", duration: 60 },
  { id: "fried-itik", name: "Lunch at Dentong's Fried Itik", type: "Angat River Culinary Heritage", duration: 60 },
  { id: "pulong-kabyawan", name: "Pulong Kabyawan & Kape't Bahay", type: "Protected Eco-Farm & Art Space", duration: 90 },
  { id: "north-polo-club", name: "The North Polo Club (Big Ben Farm)", type: "26-Hectare Equestrian Grounds", duration: 60 },
  { id: "bulacan-special-lomi", name: "Bulacan Special Lomi Evening Stop", type: "Comfort Egg Noodle Broth", duration: 45 }
];

class ItineraryCurator {
  constructor() {
    this.selectedIds = new Set(["san-isidro-church", "campo-santo-cemetery", "sumang-bulagta", "pulong-kabyawan", "fried-itik"]);
    this.init();
  }

  init() {
    this.renderChecklist();
    this.renderSchedule();
    this.bindEvents();
  }

  bindEvents() {
    // Presets
    document.querySelectorAll('[data-preset]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const key = e.currentTarget.dataset.preset;
        this.applyPreset(key);
      });
    });

    // Copy memo
    const copyBtn = document.getElementById('curator-copy-btn');
    if (copyBtn) {
      copyBtn.addEventListener('click', () => this.copyMemo());
    }

    // Print
    const printBtn = document.getElementById('curator-print-btn');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  applyPreset(key) {
    const preset = ITINERARY_PRESETS[key];
    if (!preset) return;
    this.selectedIds = new Set(preset.stops);
    this.update();

    document.querySelectorAll('[data-preset]').forEach(b => {
      b.classList.toggle('active', b.dataset.preset === key);
    });
  }

  toggle(id) {
    if (this.selectedIds.has(id)) {
      if (this.selectedIds.size <= 1) {
        if (window.showToast) window.showToast("Please maintain at least one stop.");
        return;
      }
      this.selectedIds.delete(id);
    } else {
      this.selectedIds.add(id);
    }
    document.querySelectorAll('[data-preset]').forEach(b => b.classList.remove('active'));
    this.update();
  }

  update() {
    this.renderChecklist();
    this.renderSchedule();
  }

  renderChecklist() {
    const container = document.getElementById('curator-select-list');
    if (!container) return;

    container.innerHTML = ALL_DESTINATIONS.map(item => {
      const isSelected = this.selectedIds.has(item.id);
      return `
        <label class="curator-checkbox-row ${isSelected ? 'selected' : ''}">
          <input type="checkbox" ${isSelected ? 'checked' : ''} onchange="window.curatorApp.toggle('${item.id}')">
          <div>
            <div class="stop-meta-name">${item.name}</div>
            <div class="stop-meta-sub">${item.type} · Approx. ${item.duration} min</div>
          </div>
        </label>
      `;
    }).join('');
  }

  renderSchedule() {
    const scheduleContainer = document.getElementById('schedule-steps-list');
    const summaryContainer = document.getElementById('schedule-header-summary');
    if (!scheduleContainer) return;

    const chosen = ALL_DESTINATIONS.filter(item => this.selectedIds.has(item.id));
    const totalMinutes = chosen.reduce((acc, curr) => acc + curr.duration + 20, 0);
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    if (summaryContainer) {
      summaryContainer.innerHTML = `
        <div>
          <span style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-muted);">Estimated Duration</span>
          <div style="font-size: 1.3rem; font-family: var(--font-serif); color: var(--text-ink);">${hours} hr ${minutes > 0 ? minutes + ' min' : ''}</div>
        </div>
        <div style="font-size: 0.85rem; color: var(--text-muted);">
          ${chosen.length} locations selected · Gateway: NLEX Exit 45
        </div>
      `;
    }

    let curHour = 8;
    let curMin = 30;

    scheduleContainer.innerHTML = chosen.map((item, index) => {
      const timeStr = `${curHour.toString().padStart(2, '0')}:${curMin.toString().padStart(2, '0')} ${curHour < 12 ? 'AM' : 'PM'}`;
      
      curMin += item.duration + 20;
      while (curMin >= 60) {
        curHour += 1;
        curMin -= 60;
      }

      return `
        <div class="schedule-item">
          <div class="schedule-time">${timeStr}</div>
          <div class="schedule-detail">
            <h5>${index + 1}. ${item.name}</h5>
            <p>${item.type} (${item.duration} min visit + transit)</p>
          </div>
        </div>
      `;
    }).join('');
  }

  copyMemo() {
    const chosen = ALL_DESTINATIONS.filter(item => this.selectedIds.has(item.id));
    let text = `Pulilan, Bulacan — Day Tour Itinerary\n`;
    text += `=====================================\n\n`;

    let curHour = 8;
    let curMin = 30;

    chosen.forEach((item, index) => {
      const timeStr = `${curHour.toString().padStart(2, '0')}:${curMin.toString().padStart(2, '0')} ${curHour < 12 ? 'AM' : 'PM'}`;
      text += `${index + 1}. ${timeStr} — ${item.name}\n`;
      text += `   Category: ${item.type} (~${item.duration} mins)\n\n`;

      curMin += item.duration + 20;
      while (curMin >= 60) {
        curHour += 1;
        curMin -= 60;
      }
    });

    text += `Access: North Luzon Expressway (NLEX) Pulilan Exit Km 45.\n`;
    text += `Explore more at the Pulilan Cultural Showcase.`;

    navigator.clipboard.writeText(text).then(() => {
      if (window.showToast) window.showToast("Itinerary copied to clipboard.");
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  window.curatorApp = new ItineraryCurator();
});
