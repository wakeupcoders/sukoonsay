/**
 * divyasukoon — Live Darshan Interactive Player Script
 * Mobile & Desktop Synchronized Live Stream Manager:
 * - Dynamic iframe recreation for 100% reliable stream switching on mobile & desktop
 * - Supports any YouTube link format (youtu.be, /watch?v=, /live/, /shorts/, m.youtube, etc.)
 * - Syncs URL query (?v=VIDEO_ID) and preserves user selected live stream in localStorage
 * - Seamless preset switching and custom link submission
 */
document.addEventListener('DOMContentLoaded', function () {
  const ytWatchBtn = document.getElementById('ytWatchBtn');
  const refreshBtn = document.getElementById('refreshStreamBtn');
  const fullScreenBtn = document.getElementById('fullScreenBtn');
  const playerOverlayFsBtn = document.getElementById('playerOverlayFsBtn');
  const playerFrameWrap = document.getElementById('playerFrameWrap');

  const toggleCustomStreamBtn = document.getElementById('toggleCustomStreamBtn');
  const customStreamPanel = document.getElementById('customStreamPanel');
  const customStreamForm = document.getElementById('customStreamForm');
  const customStreamInput = document.getElementById('customStreamInput');
  const applyCustomStreamBtn = document.getElementById('applyCustomStreamBtn');
  const customInputMsg = document.getElementById('customInputMsg');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const lastCheckedTime = document.getElementById('lastCheckedTime');

  const DEFAULT_VIDEO_ID = '1csZkqyVToM';

  // 1. Live Clock & Last Checked Time
  function updateTime() {
    const now = new Date();
    if (lastCheckedTime) {
      lastCheckedTime.textContent = now.toLocaleTimeString('en-IN', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true
      });
    }
  }
  updateTime();
  setInterval(updateTime, 30000);

  // 2. High-Precision Universal YouTube ID extractor
  function parseYouTubeId(input) {
    if (!input) return null;
    input = input.trim();

    // Direct 11-char ID
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;

    // Standard matchers for all YouTube URL formats
    let match = input.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|live\/|shorts\/))([a-zA-Z0-9_-]{11})/
    );
    if (match && match[1]) return match[1];

    // Query parameter ?v= or &v=
    let idMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (idMatch && idMatch[1]) return idMatch[1];

    // Loose match inside URL string
    let looseMatch = input.match(
      /(?:youtu\.be\/|v=|\/live\/|\/embed\/)([a-zA-Z0-9_-]{11})/
    );
    if (looseMatch && looseMatch[1]) return looseMatch[1];

    return null;
  }

  // 3. Switch Stream safely with full DOM Node recreation (Guarantees instant playback on Mobile & Desktop)
  function switchStream(videoId, updateUrl) {
    if (!videoId) return;

    const wrap = document.getElementById('playerFrameWrap');
    if (wrap) {
      const oldIframe = document.getElementById('liveStreamIframe');

      // Recreate iframe node from scratch to force immediate reload across all mobile engines
      const newIframe = document.createElement('iframe');
      newIframe.id = 'liveStreamIframe';
      newIframe.className = 'yt-iframe';
      newIframe.src =
        'https://www.youtube.com/embed/' +
        videoId +
        '?autoplay=1&mute=1&enablejsapi=1&rel=0';
      newIframe.title = 'divyasukoon Live Darshan';
      newIframe.allow =
        'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share';
      newIframe.setAttribute('referrerpolicy', 'strict-origin-when-cross-origin');
      newIframe.allowFullscreen = true;
      newIframe.loading = 'lazy';

      if (oldIframe && oldIframe.parentNode) {
        oldIframe.parentNode.replaceChild(newIframe, oldIframe);
      } else {
        wrap.appendChild(newIframe);
      }
    }

    if (ytWatchBtn) {
      ytWatchBtn.href = 'https://www.youtube.com/watch?v=' + videoId;
    }

    if (customStreamInput) {
      customStreamInput.value = 'https://youtu.be/' + videoId;
    }

    // Sync presets visual state
    presetBtns.forEach(btn => {
      const chip = btn.querySelector('.preset-playing-chip');
      if (btn.getAttribute('data-vid') === videoId) {
        btn.classList.add('active');
        if (!chip) {
          btn.insertAdjacentHTML(
            'beforeend',
            '<span class="preset-playing-chip"><span class="pulse-ring"></span>Playing Now</span>'
          );
        }
      } else {
        btn.classList.remove('active');
        if (chip) chip.remove();
      }
    });

    // Update URL query parameter
    if (updateUrl !== false) {
      try {
        const url = new URL(window.location.href);
        url.searchParams.set('v', videoId);
        window.history.replaceState({}, '', url.toString());
      } catch (e) {}
    }

    try {
      localStorage.setItem('divyasukoon_live_vid', videoId);
    } catch (e) {}
  }

  // 4. Determine which stream to play on page load
  function initLiveStream() {
    // Clear any obsolete legacy test streams from localStorage so visitors don't get trapped on old videos
    try {
      const savedVid = localStorage.getItem('divyasukoon_live_vid');
      if (savedVid && savedVid !== DEFAULT_VIDEO_ID) {
        localStorage.removeItem('divyasukoon_live_vid');
      }
    } catch (e) {}

    // A. URL query parameter takes top priority (for shared links or direct ?v=)
    const urlParams = new URLSearchParams(window.location.search);
    const paramVid = urlParams.get('v') || urlParams.get('stream');

    if (paramVid && parseYouTubeId(paramVid)) {
      switchStream(parseYouTubeId(paramVid), false);
      return;
    }

    // B. Global server / site config (data/live-stream.json) - Always prioritize the live configured stream!
    fetch('data/live-stream.json?t=' + Date.now())
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.videoId && parseYouTubeId(data.videoId)) {
          switchStream(parseYouTubeId(data.videoId), false);
        } else {
          switchStream(DEFAULT_VIDEO_ID, false);
        }
      })
      .catch(() => {
        switchStream(DEFAULT_VIDEO_ID, false);
      });
  }

  initLiveStream();

  // 5. Preset Buttons Click
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const vid = this.getAttribute('data-vid');
      if (vid) switchStream(vid, true);
    });
  });

  const closeCustomStreamBtn = document.getElementById('closeCustomStreamBtn');

  // 6. Toggle Custom Stream Link Panel ONLY on button click (Laptop & Mobile)
  function toggleStreamPanel(forceState) {
    if (!customStreamPanel) return;
    const isCurrentlyOpen =
      customStreamPanel.classList.contains('open') ||
      customStreamPanel.style.display === 'block';

    const shouldOpen = typeof forceState === 'boolean' ? forceState : !isCurrentlyOpen;

    if (shouldOpen) {
      customStreamPanel.style.display = 'block';
      customStreamPanel.classList.add('open');
      if (toggleCustomStreamBtn) {
        toggleCustomStreamBtn.classList.add('active');
        const textSpan = document.getElementById('toggleCustomStreamText');
        if (textSpan) textSpan.textContent = 'Close Form';
      }
      setTimeout(() => {
        if (customStreamInput) {
          customStreamInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
          customStreamInput.focus();
        }
      }, 100);
    } else {
      customStreamPanel.style.display = 'none';
      customStreamPanel.classList.remove('open');
      if (toggleCustomStreamBtn) {
        toggleCustomStreamBtn.classList.remove('active');
        const textSpan = document.getElementById('toggleCustomStreamText');
        if (textSpan) textSpan.textContent = 'Change Link';
      }
    }
  }

  if (toggleCustomStreamBtn) {
    toggleCustomStreamBtn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleStreamPanel();
    });
  }

  if (closeCustomStreamBtn) {
    closeCustomStreamBtn.addEventListener('click', function (e) {
      e.preventDefault();
      toggleStreamPanel(false);
    });
  }

  // 7. Apply Custom YouTube Link / ID (Form Submission)
  function handleApplyCustom(e) {
    if (e && e.preventDefault) e.preventDefault();
    if (!customStreamInput) return;

    const val = customStreamInput.value.trim();
    if (!val) {
      if (customInputMsg) {
        customInputMsg.style.display = 'block';
        customInputMsg.style.color = '#EF4444';
        customInputMsg.textContent = '⚠️ Please paste a YouTube link or Video ID first.';
      }
      return;
    }

    const vidId = parseYouTubeId(val);

    if (vidId) {
      // 1. Immediately switch stream
      switchStream(vidId, true);

      // 2. Visual button feedback
      if (applyCustomStreamBtn) {
        const originalText = applyCustomStreamBtn.innerHTML;
        applyCustomStreamBtn.innerHTML = '✓ Video Loaded!';
        applyCustomStreamBtn.style.background = '#10B981';
        applyCustomStreamBtn.style.color = '#FFFFFF';
        setTimeout(() => {
          applyCustomStreamBtn.innerHTML = originalText;
          applyCustomStreamBtn.style.background = '';
          applyCustomStreamBtn.style.color = '';
        }, 2200);
      }

      // 3. Status message & copy link button
      if (customInputMsg) {
        customInputMsg.style.display = 'block';
        customInputMsg.style.color = '#10B981';
        customInputMsg.innerHTML =
          '<strong>✓ Live stream active!</strong> Video ID: <code>' +
          vidId +
          '</code> ' +
          '<button type="button" class="btn btn-sm btn-outline-success ms-2 py-0 px-2 rounded-pill" id="copyShareLinkBtn">📋 Copy Link to Share</button>';

        const copyBtn = document.getElementById('copyShareLinkBtn');
        if (copyBtn) {
          copyBtn.onclick = function () {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              copyBtn.textContent = '✓ Copied!';
            }
          };
        }
      }

      // 4. Scroll smoothly to player so the user immediately sees the video running!
      if (playerFrameWrap) {
        playerFrameWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    } else {
      if (customInputMsg) {
        customInputMsg.style.display = 'block';
        customInputMsg.style.color = '#EF4444';
        customInputMsg.textContent =
          '⚠️ Invalid YouTube Link or Video ID. Please check and retry.';
      }
    }
  }

  // Bind to click, touch, and form submit
  if (applyCustomStreamBtn) {
    applyCustomStreamBtn.addEventListener('click', handleApplyCustom);
    applyCustomStreamBtn.addEventListener('touchend', function (e) {
      e.preventDefault();
      handleApplyCustom(e);
    });
  }

  if (customStreamForm) {
    customStreamForm.addEventListener('submit', handleApplyCustom);
  }

  if (customStreamInput) {
    customStreamInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApplyCustom(e);
      }
    });
  }

  // 8. Refresh Button
  if (refreshBtn) {
    refreshBtn.addEventListener('click', function () {
      const iframe = document.getElementById('liveStreamIframe');
      if (iframe) {
        const curSrc = iframe.src;
        iframe.src = '';
        setTimeout(() => {
          iframe.src = curSrc;
        }, 60);
      }
      updateTime();
    });
  }

  // 9. Fullscreen Toggle
  function toggleFullscreen(targetElem) {
    const el = targetElem || playerFrameWrap || document.getElementById('liveStreamIframe');
    if (!el) return;

    if (!document.fullscreenElement) {
      if (el.requestFullscreen) {
        el.requestFullscreen().catch(() => {});
      } else if (el.webkitRequestFullscreen) {
        el.webkitRequestFullscreen();
      } else if (el.msRequestFullscreen) {
        el.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }

  if (fullScreenBtn) {
    fullScreenBtn.addEventListener('click', function () {
      toggleFullscreen(playerFrameWrap);
    });
  }

  if (playerOverlayFsBtn) {
    playerOverlayFsBtn.addEventListener('click', function () {
      toggleFullscreen(playerFrameWrap);
    });
  }
});
