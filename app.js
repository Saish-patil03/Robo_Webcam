/**
 * Robot Camera Live Stream Application
 * Handles mobile IP camera feed connection, localStorage caching, and status indicators.
 */

(function () {
  'use strict';

  const STORAGE_KEY = 'robot_camera_ip_url';

  // DOM Elements
  const urlInput = document.getElementById('stream-url');
  const btnConnect = document.getElementById('btn-connect');
  const btnDisconnect = document.getElementById('btn-disconnect');
  const presetButtons = document.querySelectorAll('.preset-btn');
  const statusBadge = document.getElementById('status-badge');
  const cameraFeed = document.getElementById('camera-feed');
  const streamPlaceholder = document.getElementById('stream-placeholder');
  const placeholderTitle = document.getElementById('placeholder-title');
  const placeholderMsg = document.getElementById('placeholder-msg');
  const feedOverlay = document.getElementById('feed-overlay');
  const btnFullscreen = document.getElementById('btn-fullscreen');
  const streamCard = document.querySelector('.stream-card');

  let connectionTimer = null;

  // Set Status Badge & UI State
  function setStatus(state, message) {
    statusBadge.className = 'status-badge ' + state;

    if (state === 'connected') {
      statusBadge.innerHTML = '<span class="status-dot"></span> Live';
      cameraFeed.style.display = 'block';
      streamPlaceholder.style.display = 'none';
      feedOverlay.style.display = 'flex';
    } else if (state === 'connecting') {
      statusBadge.innerHTML = '<span class="status-dot"></span> Connecting...';
      cameraFeed.style.display = 'none';
      streamPlaceholder.style.display = 'block';
      feedOverlay.style.display = 'none';
      placeholderTitle.textContent = 'Connecting to Camera...';
      placeholderMsg.textContent = 'Contacting ' + (urlInput.value || 'stream') + '. Please verify your phone camera server is running.';
    } else if (state === 'error') {
      statusBadge.innerHTML = '<span class="status-dot"></span> Connection Failed';
      cameraFeed.style.display = 'none';
      streamPlaceholder.style.display = 'block';
      feedOverlay.style.display = 'none';
      placeholderTitle.textContent = 'Unable to Connect';
      placeholderMsg.textContent = message || 'Could not load camera stream. Verify the IP address, port, and ensure your phone is on the same Wi-Fi network.';
    } else {
      statusBadge.innerHTML = '<span class="status-dot"></span> Disconnected';
      cameraFeed.style.display = 'none';
      streamPlaceholder.style.display = 'block';
      feedOverlay.style.display = 'none';
      placeholderTitle.textContent = 'No Camera Connected';
      placeholderMsg.textContent = 'Enter your mobile phone IP Webcam link below and click Connect to start the live video feed.';
    }
  }

  // Smart URL Normalization
  function normalizeUrl(rawUrl) {
    let url = rawUrl.trim();
    
    // IP Webcam and most mobile apps broadcast plain HTTP, not HTTPS
    if (url.startsWith('https://')) {
      url = 'http://' + url.slice(8);
    } else if (!url.startsWith('http://')) {
      url = 'http://' + url;
    }

    // If port 8080 is specified without an endpoint, append /video
    try {
      const parsed = new URL(url);
      if ((parsed.pathname === '/' || parsed.pathname === '') && parsed.port === '8080') {
        url = url.replace(/\/+$/, '') + '/video';
      }
    } catch (e) {
      if (url.endsWith(':8080') || url.endsWith(':8080/')) {
        url = url.replace(/\/+$/, '') + '/video';
      }
    }

    return url;
  }

  // Connect to IP Webcam Stream
  function connectStream(rawUrl) {
    if (!rawUrl || !rawUrl.trim()) {
      alert('Please enter a valid IP camera stream URL (e.g. http://172.16.237.254:8080/video)');
      return;
    }

    const cleanUrl = normalizeUrl(rawUrl);
    urlInput.value = cleanUrl;

    // Remember in localStorage
    try {
      localStorage.setItem(STORAGE_KEY, cleanUrl);
    } catch (e) {
      console.warn('localStorage unavailable', e);
    }

    // Clear any previous timeout
    if (connectionTimer) {
      clearTimeout(connectionTimer);
      connectionTimer = null;
    }

    setStatus('connecting');

    // Reset image
    cameraFeed.src = '';

    let isSuccess = false;

    cameraFeed.onload = function () {
      if (isSuccess) return;
      isSuccess = true;
      if (connectionTimer) clearTimeout(connectionTimer);
      setStatus('connected');
    };

    cameraFeed.onerror = function () {
      if (isSuccess) return;
      if (connectionTimer) clearTimeout(connectionTimer);
      setStatus('error', 'Stream failed to load. Ensure your phone and computer are on the same Wi-Fi subnet and the IP Webcam app is active.');
    };

    // 6-second connection timeout guard
    connectionTimer = setTimeout(function () {
      if (!isSuccess) {
        cameraFeed.src = '';
        setStatus('error', 'Connection timed out. Check that the IP and port are correct and the phone camera server is started.');
      }
    }, 6000);

    // Assign URL to trigger MJPEG stream loading
    cameraFeed.src = cleanUrl;
  }

  // Disconnect Stream
  function disconnectStream() {
    if (connectionTimer) {
      clearTimeout(connectionTimer);
      connectionTimer = null;
    }
    cameraFeed.src = '';
    setStatus('disconnected');
  }

  // Event Listeners
  btnConnect.addEventListener('click', function () {
    connectStream(urlInput.value);
  });

  urlInput.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') {
      connectStream(urlInput.value);
    }
  });

  btnDisconnect.addEventListener('click', disconnectStream);

  // Quick Preset Buttons
  presetButtons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      const targetUrl = btn.getAttribute('data-url');
      if (targetUrl) {
        urlInput.value = targetUrl;
        connectStream(targetUrl);
      }
    });
  });

  // Fullscreen Toggle
  btnFullscreen.addEventListener('click', function () {
    if (!document.fullscreenElement) {
      streamCard.requestFullscreen().catch(function (err) {
        console.error('Fullscreen request failed:', err);
      });
    } else {
      document.exitFullscreen();
    }
  });

  // Initialize: Load cached URL or set initial disconnected state
  const savedUrl = localStorage.getItem(STORAGE_KEY);
  if (savedUrl && savedUrl.trim()) {
    urlInput.value = savedUrl.trim();
    connectStream(savedUrl.trim());
  } else {
    setStatus('disconnected');
  }

})();
