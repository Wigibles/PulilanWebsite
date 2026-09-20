/**
 * Pulilan: Kasaysayan at Pamana — Museum Cultural Monograph
 * Interactive Controller inspired by https://bank-history.mosmuseum.ru/en
 * 
 * Features:
 * - Scoped Carabao Peeker (Option C: mounted only on Ch 01 and Ch 08)
 * - Hero Diptych Switcher (Option A: Carabao + Stone Church proof)
 * - Scroll-Linked Scrollytelling (1.1 Reveal on scroll, 1.2 Rail progress,
 *   1.3 Scroll-linked photo switching, 1.4 Animated metrics, 1.5 Subtle parallax)
 * - Accessible Curatorial Dossier Reader (Focus trapping & ARIA)
 */

document.addEventListener('DOMContentLoaded', () => {
  initSideTrackerScrollSpy();
  initAmbientAudio();
  initArtifactPhotoSwitchers();
  initScrollReveal();
  initScrollLinkedArtifacts();
  initMetricCountUp();
  initPhotoParallax();
  initSectionDossiers();
  initMobileDrawer();
  initImageLightbox();
});

/* ==========================================================================
   1. Modern Minimalist Side Tracker Scroll-Spy & Progress Fill
   ========================================================================== */

function initSideTrackerScrollSpy() {
  const links = document.querySelectorAll('.side-tracker-link');
  const sections = document.querySelectorAll('.exhibition-chapter');
  const trackerCounter = document.getElementById('tracker-current-room');
  const trackerFill = document.getElementById('side-tracker-fill');

  if (!links.length || !sections.length) return;

  // Smooth click scroll
  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = link.getAttribute('href');
      const targetSection = document.querySelector(targetId);
      if (targetSection) {
        const offset = 100;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = targetSection.getBoundingClientRect().top;
        const offsetPosition = (elementRect - bodyRect) - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });

  // Window scroll handler
  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;

    // Side tracker vertical fill
    if (trackerFill && docHeight > 0) {
      if (scrollY < 100) {
        trackerFill.style.height = '0%';
      } else {
        const scrollPercent = Math.min(100, Math.max(0, ((scrollY - 100) / (docHeight - 100)) * 100));
        trackerFill.style.height = `${scrollPercent.toFixed(1)}%`;
      }
    }

    let currentId = '';
    let currentIndex = 0;
    const scrollPos = scrollY + 240;

    sections.forEach((sec, idx) => {
      const top = sec.offsetTop;
      const height = sec.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        currentId = sec.getAttribute('id');
        currentIndex = idx + 1;
      }
    });

    if (currentIndex === 0 && sections.length > 0) {
      if (scrollPos >= sections[0].offsetTop) {
        currentIndex = 1;
        currentId = sections[0].getAttribute('id');
      }
    }

    // Update side tracker links active state
    links.forEach(link => {
      const href = link.getAttribute('href').replace('#', '');
      const isActive = href === currentId;
      link.classList.toggle('active', isActive);
    });

    // Update room counter number (01, 02, ... 08)
    if (trackerCounter && currentIndex > 0) {
      trackerCounter.textContent = currentIndex < 10 ? `0${currentIndex}` : currentIndex;
    }
  }, { passive: true });
}

/* ==========================================================================
   2. Traditional Acoustic Ambient Music Controller (Bulacan Harana / Kundiman)
   ========================================================================== */

function initAmbientAudio() {
  const soundBtn = document.getElementById('btn-ambient-sound');
  const soundLabel = document.getElementById('sound-label');

  if (!soundBtn) return;

  let isPlaying = false;
  let audioCtx = null;
  let ambientInterval = null;
  let masterGain = null;

  // Harana & classical Spanish-colonial guitar harmonic arpeggio (chords in Hz)
  const chordProgressions = [
    // D Major plucks
    [146.83, 220.00, 293.66, 369.99, 440.00, 587.33],
    // B Minor plucks
    [123.47, 185.00, 246.94, 293.66, 369.99, 493.88],
    // G Major plucks
    [98.00, 146.83, 196.00, 246.94, 293.66, 392.00],
    // A7 plucks
    [110.00, 164.81, 220.00, 277.18, 329.63, 440.00]
  ];

  let currentProgressionIndex = 0;
  let noteIndex = 0;

  function initAudioContext() {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      audioCtx = new AudioContextClass();
      masterGain = audioCtx.createGain();
      masterGain.gain.setValueAtTime(0.001, audioCtx.currentTime);
      masterGain.connect(audioCtx.destination);
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
  }

  // Soft acoustic plucked string synthesis
  function playPluck(freq, time, duration = 2.4) {
    if (!audioCtx || !isPlaying) return;

    const osc = audioCtx.createOscillator();
    const oscHarmonic = audioCtx.createOscillator();
    const pluckGain = audioCtx.createGain();
    const filter = audioCtx.createBiquadFilter();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, time);

    oscHarmonic.type = 'sine';
    oscHarmonic.frequency.setValueAtTime(freq * 2, time);

    filter.type = 'lowpass';
    filter.frequency.setValueAtTime(1400, time);
    filter.frequency.exponentialRampToValueAtTime(280, time + duration);

    pluckGain.gain.setValueAtTime(0.0001, time);
    pluckGain.gain.exponentialRampToValueAtTime(0.18, time + 0.03);
    pluckGain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

    osc.connect(filter);
    oscHarmonic.connect(filter);
    filter.connect(pluckGain);
    pluckGain.connect(masterGain);

    osc.start(time);
    oscHarmonic.start(time);
    osc.stop(time + duration);
    oscHarmonic.stop(time + duration);
  }

  function startAmbientMusic() {
    initAudioContext();
    isPlaying = true;
    masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
    masterGain.gain.setTargetAtTime(0.24, audioCtx.currentTime, 0.6);

    soundBtn.classList.add('playing');
    if (soundLabel) soundLabel.textContent = '\u266b Music';

    // Play initial plucks
    playPluck(chordProgressions[0][0], audioCtx.currentTime);

    ambientInterval = setInterval(() => {
      if (!isPlaying || !audioCtx) return;

      const currentChord = chordProgressions[currentProgressionIndex];
      const freq = currentChord[noteIndex % currentChord.length];
      
      playPluck(freq, audioCtx.currentTime);

      noteIndex++;
      if (noteIndex % 6 === 0) {
        currentProgressionIndex = (currentProgressionIndex + 1) % chordProgressions.length;
      }
    }, 540);
  }

  function stopAmbientMusic() {
    isPlaying = false;
    if (ambientInterval) {
      clearInterval(ambientInterval);
      ambientInterval = null;
    }
    if (masterGain && audioCtx) {
      masterGain.gain.cancelScheduledValues(audioCtx.currentTime);
      masterGain.gain.setTargetAtTime(0.0001, audioCtx.currentTime, 0.4);
    }
    soundBtn.classList.remove('playing');
    if (soundLabel) soundLabel.textContent = 'Music';
  }

  soundBtn.addEventListener('click', (e) => {
    e.preventDefault();
    if (!isPlaying) {
      startAmbientMusic();
    } else {
      stopAmbientMusic();
    }
  });
}

/* ==========================================================================
   3. In-Card Artifact Photo Switchers (Manual Selection)
   ========================================================================== */

function initArtifactPhotoSwitchers() {
  const switchers = document.querySelectorAll('.artifact-switcher-row');

  switchers.forEach(row => {
    const thumbs = row.querySelectorAll('.switcher-thumb');

    thumbs.forEach(thumb => {
      thumb.addEventListener('click', () => {
        const targetId = thumb.getAttribute('data-target');
        const newSrc = thumb.getAttribute('data-src');
        const mainImg = document.getElementById(targetId);

        if (mainImg && newSrc) {
          mainImg.style.opacity = '0.3';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 150);
        }

        thumbs.forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
      });
    });
  });
}

/* ==========================================================================
   4. Scrollytelling Reveal on Scroll (Section 1.1)
   ========================================================================== */

function initScrollReveal() {
  // Respect user preference for reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const revealTargets = document.querySelectorAll(
    '.lead-narrative, .museum-quote, .curatorial-points .point-item, .artifact-card, .metric-highlight-box, .dish-museum-card, .directory-box, .curiosity-card'
  );

  revealTargets.forEach(el => el.classList.add('reveal-on-scroll'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.12,
    rootMargin: '0px 0px -40px 0px'
  });

  revealTargets.forEach(el => observer.observe(el));
}

/* ==========================================================================
   5. Scroll-Linked Artifact Image Transitions (Section 1.3)
   ========================================================================== */

function initScrollLinkedArtifacts() {
  const pointItems = document.querySelectorAll('.point-item[data-switch-src]');
  if (!pointItems.length) return;

  const pointObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = entry.target;
        const targetImgId = target.getAttribute('data-switch-target');
        const newSrc = target.getAttribute('data-switch-src');
        const mainImg = document.getElementById(targetImgId);

        // Highlight active point
        pointItems.forEach(p => p.classList.remove('active-scroll-point'));
        target.classList.add('active-scroll-point');

        // Swap photo with transition if needed
        if (mainImg && newSrc && mainImg.getAttribute('src') !== newSrc) {
          mainImg.style.opacity = '0.35';
          setTimeout(() => {
            mainImg.src = newSrc;
            mainImg.style.opacity = '1';
          }, 140);

          // Update matching thumbnail active state
          const switcher = mainImg.closest('.artifact-card')?.querySelector('.artifact-switcher-row');
          if (switcher) {
            const thumbs = switcher.querySelectorAll('.switcher-thumb');
            thumbs.forEach(t => {
              t.classList.toggle('active', t.getAttribute('data-src') === newSrc);
            });
          }
        }
      }
    });
  }, {
    threshold: 0.6,
    rootMargin: '-20% 0px -30% 0px'
  });

  pointItems.forEach(p => pointObserver.observe(p));
}

/* ==========================================================================
   6. Animate Metric Numbers Count-Up (Section 1.4)
   ========================================================================== */

function initMetricCountUp() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const metricBoxes = document.querySelectorAll('.metric-highlight-box');
  if (!metricBoxes.length) return;

  const metricObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const values = entry.target.querySelectorAll('.metric-val[data-target-num]');
        values.forEach(valEl => {
          const target = parseInt(valEl.getAttribute('data-target-num'), 10);
          const prefix = valEl.getAttribute('data-prefix') || '';
          const suffix = valEl.getAttribute('data-suffix') || '';
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1200;
          const startTime = performance.now();

          function updateCounter(now) {
            const elapsed = now - startTime;
            const progress = Math.min(1, elapsed / duration);
            // Ease out cubic
            const easeOut = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * easeOut);

            valEl.textContent = `${prefix}${current}${suffix}`;

            if (progress < 1) {
              requestAnimationFrame(updateCounter);
            } else {
              valEl.textContent = `${prefix}${target}${suffix}`;
            }
          }

          requestAnimationFrame(updateCounter);
        });

        metricObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.3
  });

  metricBoxes.forEach(box => metricObserver.observe(box));
}

/* ==========================================================================
   7. Subtle Parallax on Archival Photo Frames (Section 1.5)
   ========================================================================== */

function initPhotoParallax() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return;
  }

  const parallaxImages = document.querySelectorAll('.parallax-img');
  if (!parallaxImages.length) return;

  let ticking = false;

  function updateParallax() {
    const vh = window.innerHeight;

    parallaxImages.forEach(img => {
      const parent = img.parentElement;
      if (!parent) return;

      const rect = parent.getBoundingClientRect();
      // Check if in or near viewport
      if (rect.bottom >= -50 && rect.top <= vh + 50) {
        const centerOffset = (rect.top + rect.height / 2) - (vh / 2);
        const translateY = centerOffset * -0.06;
        img.style.transform = `scale(1.06) translateY(${translateY.toFixed(1)}px)`;
      }
    });

    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateParallax);
      ticking = true;
    }
  }, { passive: true });
}

/* ==========================================================================
   8. The Scoped Peeking Carabao Mascot (Section 0 - Option C)
   ========================================================================== */

function initPeekingCarabao() {
  const peekerTrigger = document.getElementById('carabao-peek-trigger');
  const speechBubble = document.getElementById('carabao-speech-bubble');
  const factText = document.getElementById('bubble-fact-text');
  const btnNextFact = document.getElementById('btn-next-trivia');
  const btnNextChapter = document.getElementById('btn-carabao-next-chapter');
  const btnClose = document.getElementById('bubble-close-btn');

  if (!peekerTrigger || !speechBubble) return;

  const docentTrivia = [
    "Did you know? In 1749, Augustinian friars placed Pulilan under the spiritual protection of San Isidro Labrador!",
    "Did you know? Training a carabao to kneel takes weeks of gentle bonding, patience, and mutual trust—never force!",
    "Did you know? Pulong Kabyawan takes its name from ancient animal-powered stone mills used to press sugarcane!",
    "Did you know? The Diocesan Shrine withstood destructive earthquakes in 1863 and 1880, fortified with volcanic tuff!",
    "Did you know? Casa San Francisco survived the Second World War with its 1929 narra woodwork and capiz panels completely intact!",
    "Did you know? Sumang Bulagta is called 'bulagta' because it lies completely flat when unwrapped on the banana leaf!",
    "Did you know? Dentong's Fried Itik was born along the Angat River duck farms in 1974, slow-simmered in garlic-vinegar brine!",
    "Did you know? The Campo Santo's solitary three-tiered adobe arch is one of the few surviving Spanish cemetery gates in Bulacan!"
  ];

  let currentFactIndex = 0;

  function updateFact() {
    currentFactIndex = (currentFactIndex + 1) % docentTrivia.length;
    factText.style.opacity = '0';
    setTimeout(() => {
      factText.textContent = `"${docentTrivia[currentFactIndex]}"`;
      factText.style.opacity = '1';
    }, 150);
  }

  // Toggle bubble on carabao click
  peekerTrigger.addEventListener('click', () => {
    const isCurrentlyActive = speechBubble.classList.contains('active');
    if (!isCurrentlyActive) {
      speechBubble.classList.add('active');
      updateFact();
    } else {
      updateFact();
    }
  });

  // Next Fact action
  if (btnNextFact) {
    btnNextFact.addEventListener('click', (e) => {
      e.stopPropagation();
      updateFact();
    });
  }

  // Next Chapter Action
  if (btnNextChapter) {
    btnNextChapter.addEventListener('click', (e) => {
      e.stopPropagation();
      const chapters = Array.from(document.querySelectorAll('.exhibition-chapter'));
      const scrollPos = window.scrollY + 220;
      
      let nextChapter = null;
      for (let ch of chapters) {
        if (ch.offsetTop > scrollPos) {
          nextChapter = ch;
          break;
        }
      }

      if (!nextChapter && chapters.length > 0) {
        nextChapter = chapters[0]; // loop back to first
      }

      if (nextChapter) {
        const offset = 135;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = nextChapter.getBoundingClientRect().top;
        const offsetPosition = (elementRect - bodyRect) - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  }

  // Dismiss button
  if (btnClose) {
    btnClose.addEventListener('click', (e) => {
      e.stopPropagation();
      speechBubble.classList.remove('active');
    });
  }
}

/* ==========================================================================
   9. In-Section Curatorial & Culinary Dossier Controller (Direct on Section)
   ========================================================================== */

function initSectionDossiers() {
  const toggleButtons = document.querySelectorAll('.btn-dossier-toggle');
  const closeButtons = document.querySelectorAll('.dossier-close-inline');

  toggleButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const dossierPanel = document.getElementById(targetId);
      if (!dossierPanel) return;

      const isOpen = dossierPanel.classList.contains('open');

      if (isOpen) {
        dossierPanel.classList.remove('open');
        btn.classList.remove('active');
        const textSpan = btn.querySelector('.toggle-text');
        if (textSpan) {
          textSpan.textContent = btn.getAttribute('data-original-text') || 'Read Detailed Curatorial Dossier';
        }
      } else {
        // Cache original button text
        if (!btn.getAttribute('data-original-text')) {
          const textSpan = btn.querySelector('.toggle-text');
          if (textSpan) btn.setAttribute('data-original-text', textSpan.textContent);
        }

        dossierPanel.classList.add('open');
        btn.classList.add('active');
        const textSpan = btn.querySelector('.toggle-text');
        if (textSpan) {
          textSpan.textContent = 'Close Dossier ↑';
        }

        // Smooth scroll so the newly opened dossier panel is comfortably in view
        setTimeout(() => {
          const panelRect = dossierPanel.getBoundingClientRect();
          if (panelRect.top < 80 || panelRect.top > window.innerHeight - 150) {
            const offset = 140;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = dossierPanel.getBoundingClientRect().top;
            const offsetPosition = (elementRect - bodyRect) - offset;
            window.scrollTo({
              top: offsetPosition,
              behavior: 'smooth'
            });
          }
        }, 120);
      }
    });
  });

  closeButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const dossierPanel = document.getElementById(targetId);
      if (!dossierPanel) return;

      dossierPanel.classList.remove('open');

      // Reset matching toggle button
      const toggleBtn = document.querySelector(`.btn-dossier-toggle[data-target="${targetId}"]`);
      if (toggleBtn) {
        toggleBtn.classList.remove('active');
        const textSpan = toggleBtn.querySelector('.toggle-text');
        if (textSpan && toggleBtn.getAttribute('data-original-text')) {
          textSpan.textContent = toggleBtn.getAttribute('data-original-text');
        }
      }

      // Smooth scroll back to chapter header
      const chapter = dossierPanel.closest('.exhibition-chapter');
      if (chapter) {
        const offset = 135;
        const bodyRect = document.body.getBoundingClientRect().top;
        const elementRect = chapter.getBoundingClientRect().top;
        const offsetPosition = (elementRect - bodyRect) - offset;
        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

/* ==========================================================================
   10. Mobile Navigation Drawer
   ========================================================================== */

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const drawer = document.getElementById('mobile-chapter-drawer');
  const closeBtn = document.getElementById('close-mobile-drawer');

  if (!toggleBtn || !drawer) return;

  function toggleDrawer(open) {
    drawer.classList.toggle('open', open);
    drawer.setAttribute('aria-hidden', !open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => toggleDrawer(true));
  if (closeBtn) closeBtn.addEventListener('click', () => toggleDrawer(false));

  drawer.addEventListener('click', (e) => {
    if (e.target === drawer) toggleDrawer(false);
  });

  drawer.querySelectorAll('.mobile-pill').forEach(pill => {
    pill.addEventListener('click', () => toggleDrawer(false));
  });
}

/* ==========================================================================
   11. Image Lightbox (Click-to-Expand with Detail Side Panel)
   ========================================================================== */

function initImageLightbox() {
  const backdrop = document.getElementById('img-lightbox');
  const closeBtn = document.getElementById('lightbox-close');
  const mainImg = document.getElementById('lightbox-main-img');
  const tagEl = document.getElementById('lightbox-tag');
  const titleEl = document.getElementById('lightbox-title');
  const locationEl = document.getElementById('lightbox-location');
  const descEl = document.getElementById('lightbox-desc');
  const thumbStrip = document.getElementById('lightbox-thumb-strip');
  const counter = document.getElementById('lightbox-img-counter');
  const prevBtn = document.getElementById('lightbox-prev');
  const nextBtn = document.getElementById('lightbox-next');

  if (!backdrop || !mainImg) return;

  let currentGallery = [];
  let currentIndex = 0;

  function openLightbox(stage) {
    const src = stage.getAttribute('data-lightbox-src') || '';
    const tag = stage.getAttribute('data-lightbox-tag') || '';
    const title = stage.getAttribute('data-lightbox-title') || '';
    const location = stage.getAttribute('data-lightbox-location') || '';
    const desc = stage.getAttribute('data-lightbox-desc') || '';
    let gallery = [];
    try {
      gallery = JSON.parse(stage.getAttribute('data-lightbox-gallery') || '[]');
    } catch (e) {
      gallery = src ? [src] : [];
    }

    if (!gallery.length && src) gallery = [src];
    currentGallery = gallery;
    currentIndex = gallery.indexOf(src);
    if (currentIndex < 0) currentIndex = 0;

    // Fill details
    if (tagEl) tagEl.textContent = tag;
    if (titleEl) titleEl.textContent = title;
    if (locationEl) locationEl.textContent = location;
    if (descEl) descEl.textContent = desc;

    // Build thumb strip
    if (thumbStrip) {
      thumbStrip.innerHTML = '';
      gallery.forEach((imgSrc, idx) => {
        const thumb = document.createElement('div');
        thumb.className = 'lightbox-thumb' + (idx === currentIndex ? ' active' : '');
        thumb.innerHTML = `<img src="${imgSrc}" alt="Gallery thumbnail ${idx + 1}" loading="lazy">`;
        thumb.addEventListener('click', () => setLightboxImage(idx));
        thumbStrip.appendChild(thumb);
      });
    }

    setLightboxImage(currentIndex, false);

    // Open
    backdrop.setAttribute('aria-hidden', 'false');
    backdrop.style.display = 'flex';
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        backdrop.classList.add('open');
      });
    });
    document.body.style.overflow = 'hidden';
  }

  function setLightboxImage(idx, animate = true) {
    if (!currentGallery.length) return;
    currentIndex = Math.max(0, Math.min(idx, currentGallery.length - 1));
    const src = currentGallery[currentIndex];

    if (animate) {
      mainImg.style.opacity = '0';
      setTimeout(() => {
        mainImg.src = src;
        mainImg.style.opacity = '1';
      }, 150);
    } else {
      mainImg.src = src;
    }

    // Update counter
    if (counter) counter.textContent = `${currentIndex + 1} / ${currentGallery.length}`;

    // Update thumb active state
    if (thumbStrip) {
      thumbStrip.querySelectorAll('.lightbox-thumb').forEach((t, i) => {
        t.classList.toggle('active', i === currentIndex);
      });
    }

    // Show/hide nav buttons
    if (prevBtn) prevBtn.style.visibility = currentGallery.length > 1 ? '' : 'hidden';
    if (nextBtn) nextBtn.style.visibility = currentGallery.length > 1 ? '' : 'hidden';
  }

  function closeLightbox() {
    backdrop.classList.remove('open');
    backdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    setTimeout(() => {
      backdrop.style.display = 'none';
      if (mainImg) mainImg.src = '';
    }, 300);
  }

  // Attach click listeners to all artifact photo stages
  document.querySelectorAll('.artifact-photo-stage[data-lightbox-src]').forEach(stage => {
    stage.addEventListener('click', () => openLightbox(stage));
    stage.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        openLightbox(stage);
      }
    });
  });

  // Close controls
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  backdrop.addEventListener('click', (e) => {
    if (e.target === backdrop || e.target === backdrop.querySelector('.lightbox-inner')) {
      // Only close if clicking dark area, not inner content
    }
  });

  // Navigation
  if (prevBtn) prevBtn.addEventListener('click', () => setLightboxImage(currentIndex - 1));
  if (nextBtn) nextBtn.addEventListener('click', () => setLightboxImage(currentIndex + 1));

  // Keyboard navigation
  document.addEventListener('keydown', (e) => {
    if (!backdrop.classList.contains('open')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') setLightboxImage(currentIndex - 1);
    if (e.key === 'ArrowRight') setLightboxImage(currentIndex + 1);
  });

  // Close button explicit
  if (closeBtn) {
    closeBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      closeLightbox();
    });
  }
}
