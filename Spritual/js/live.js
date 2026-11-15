/**
 * divyasukoon — Live Darshan Interactive Player Script
 * Global Synchronized Live Stream Manager:
 * - Fetches published stream from data/live-stream.json (visible to all devotees worldwide)
 * - Supports URL query ?v=VIDEO_ID for instant shared streaming
 * - Presets switching, custom stream loading, fullscreen, and stream refreshes.
 */
document.addEventListener('DOMContentLoaded', function () {
  const iframe = document.getElementById('liveStreamIframe');
  const ytWatchBtn = document.getElementById('ytWatchBtn');
  const refreshBtn = document.getElementById('refreshStreamBtn');
  const fullScreenBtn = document.getElementById('fullScreenBtn');
  const playerOverlayFsBtn = document.getElementById('playerOverlayFsBtn');
  const playerFrameWrap = document.getElementById('playerFrameWrap');

  const toggleCustomStreamBtn = document.getElementById('toggleCustomStreamBtn');
  const customStreamPanel = document.getElementById('customStreamPanel');
  const closeCustomStreamBtn = document.getElementById('closeCustomStreamBtn');
  const customStreamInput = document.getElementById('customStreamInput');
  const applyCustomStreamBtn = document.getElementById('applyCustomStreamBtn');
  const customInputMsg = document.getElementById('customInputMsg');
  const presetBtns = document.querySelectorAll('.preset-btn');
  const lastCheckedTime = document.getElementById('lastCheckedTime');

  const DEFAULT_VIDEO_ID = '4dloJNwOyDc';

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

  // 2. Robust YouTube ID extractor
  function parseYouTubeId(input) {
    if (!input) return null;
    input = input.trim();
    if (/^[a-zA-Z0-9_-]{11}$/.test(input)) return input;
    const match = input.match(
      /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|live\/|shorts\/))([\w-]{11})/
    );
    if (match && match[1]) return match[1];
    const idMatch = input.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
    if (idMatch && idMatch[1]) return idMatch[1];
    return null;
  }

  // 3. Switch Stream safely
  function switchStream(videoId, updateUrl) {
    if (!videoId) return;

    if (iframe) {
      iframe.style.display = 'block';
      iframe.src =
        'https://www.youtube.com/embed/' +
        videoId +
        '?autoplay=1&mute=1&enablejsapi=1&rel=0';
    }

    if (ytWatchBtn) {
      ytWatchBtn.href = 'https://www.youtube.com/watch?v=' + videoId;
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

    // Update URL query parameter so sharing the URL shows this live stream to everyone
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

  // 4. Determine which stream to play on page load (URL param > Global JSON > Default)
  function initLiveStream() {
    // Check URL parameter first: e.g. live.html?v=4dloJNwOyDc
    const urlParams = new URLSearchParams(window.location.search);
    const paramVid = urlParams.get('v') || urlParams.get('stream');

    if (paramVid && parseYouTubeId(paramVid)) {
      switchStream(parseYouTubeId(paramVid), false);
      return;
    }

    // Check remote global published live config (synchronizes live stream for all devotees)
    fetch('data/live-stream.json?t=' + Date.now())
      .then(res => (res.ok ? res.json() : null))
      .then(data => {
        if (data && data.videoId) {
          switchStream(data.videoId, false);
        } else {
          fallbackLocalStream();
        }
      })
      .catch(() => {
        fallbackLocalStream();
      });
  }

  function fallbackLocalStream() {
    try {
      const savedVid = localStorage.getItem('divyasukoon_live_vid');
      if (savedVid) {
        switchStream(savedVid, false);
        return;
      }
    } catch (e) {}
    switchStream(DEFAULT_VIDEO_ID, false);
  }

  initLiveStream();

  // 5. Preset Buttons Click
  presetBtns.forEach(btn => {
    btn.addEventListener('click', function () {
      const vid = this.getAttribute('data-vid');
      switchStream(vid, true);
    });
  });

  // 6. Toggle Custom Stream Link Panel
  if (toggleCustomStreamBtn && customStreamPanel) {
    toggleCustomStreamBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const isHidden = customStreamPanel.style.display === 'none';
      customStreamPanel.style.display = isHidden ? 'block' : 'none';
      if (isHidden && customStreamInput) customStreamInput.focus();
    });
  }

  if (closeCustomStreamBtn && customStreamPanel) {
    closeCustomStreamBtn.addEventListener('click', function () {
      customStreamPanel.style.display = 'none';
    });
  }

  // 7. Apply Custom YouTube Link / ID
  function handleApplyCustom() {
    if (!customStreamInput) return;
    const val = customStreamInput.value.trim();
    const vidId = parseYouTubeId(val);

    if (vidId) {
      switchStream(vidId, true);

      if (customInputMsg) {
        customInputMsg.style.display = 'block';
        customInputMsg.style.color = '#10B981';
        customInputMsg.innerHTML =
          '✓ Live stream active! <span class="d-inline-block ms-2 text-decoration-underline" style="cursor:pointer;" id="copyShareLinkBtn">📋 Copy Share Link</span>';
        
        const copyBtn = document.getElementById('copyShareLinkBtn');
        if (copyBtn) {
          copyBtn.onclick = function() {
            if (navigator.clipboard) {
              navigator.clipboard.writeText(window.location.href);
              copyBtn.textContent = '✓ Copied!';
            }
          };
        }
        setTimeout(() => {
          if (customInputMsg) customInputMsg.style.display = 'none';
        }, 8000);
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

  if (applyCustomStreamBtn) {
    applyCustomStreamBtn.addEventListener('click', handleApplyCustom);
  }

  if (customStreamInput) {
    customStreamInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleApplyCustom();
      }
    });
  }

  // 8. Refresh Button
  if (refreshBtn && iframe) {
    refreshBtn.addEventListener('click', function () {
      const curSrc = iframe.src;
      iframe.src = '';
      setTimeout(() => {
        iframe.src = curSrc;
      }, 50);
      updateTime();
    });
  }

  // 9. Fullscreen Toggle
  function toggleFullscreen(targetElem) {
    const el = targetElem || playerFrameWrap || iframe;
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
