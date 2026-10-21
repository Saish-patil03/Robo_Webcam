# Robot Camera Live Stream Dashboard

A modern, responsive, and lightweight web dashboard for streaming live camera feeds from a mobile phone (or microcontroller/IP camera) directly to your computer browser. Designed specifically for teleoperation, robotics vision, and remote monitoring.

![Live Stream Dashboard Preview](https://img.shields.io/badge/Theme-Dark%20Industrial-0284c7)
![Stack](https://img.shields.io/badge/Stack-HTML5%20%7C%20CSS3%20%7C%20Vanilla%20JS-10b981)
![Zero Dependencies](https://img.shields.io/badge/Dependencies-Zero-success)

---

## 🌟 Features

- **Low-Latency Live Streaming**: Efficiently renders real-time MJPEG camera streams using responsive HTML5 `<img>` elements.
- **Smart URL Normalization**: Automatically converts accidental `https://` inputs to `http://` and appends `/video` endpoints if omitted.
- **Persistent Storage**: Remembers your last-used camera stream link in the browser's `localStorage` so it reconnects automatically on refresh.
- **Live Status Indicators**: Real-time badges for `Live`, `Connecting...`, `Connection Failed`, and `Disconnected`.
- **Quick-Connect Presets**: One-click configuration for standard IP Webcam, DroidCam, and ESP32-CAM formats.
- **Fullscreen Mode**: Dedicated full-screen monitor view for teleoperation or remote inspection.
- **Zero External Dependencies**: Pure vanilla HTML5, CSS3, and modern ES6 JavaScript.

---

## 🚀 Quick Start

### Option 1: Run the Local Server (Recommended)
Running a local HTTP server avoids browser security restrictions when accessing local network cameras.

**Using Ruby (pre-installed on macOS):**
```bash
ruby server.rb
```

**Using Python:**
```bash
python3 -m http.server 3000
```

Open your browser to: **`http://localhost:3000`**

---

### Option 2: Open Directly in Browser
You can open `index.html` directly in any web browser without running a server:
- On macOS: double-click `index.html` or run `open index.html`
- On Windows / Linux: open `index.html` with Chrome, Safari, Firefox, or Edge

---

## 📱 Mobile Phone Camera Setup Guide

### 1. Android: Using "IP Webcam"
1. Install **IP Webcam** by Pavel Khlebovich from the Google Play Store.
2. Connect your phone and laptop to the **same Wi-Fi network** (or connect your laptop to your phone's personal hotspot).
3. Open the app, scroll to the bottom, and tap **"Start server"**.
4. Note the IP address displayed on your phone screen 
5. In the dashboard input field, enter:
   ```text
   http://<your-phone-ip>:8080/video
   ```
   
6. Click **Connect**.

---

### 2. Android / iOS: Using "DroidCam"
1. Install **DroidCam** from Google Play or Apple App Store.
2. Connect your phone and laptop to the same Wi-Fi network.
3. Open the app to view the Wi-Fi IP and port (default is `4747`).
4. In the dashboard, enter:
   ```text
   http://<your-phone-ip>:4747/video
   ```
5. Click **Connect**.

---

### 3. ESP32-CAM / Microcontrollers
If using an ESP32-CAM running the standard CameraWebServer sketch:
```text
http://<esp32-ip>:81/stream
```

---

## 🔍 Troubleshooting Tips

| Issue | Cause | Solution |
| :--- | :--- | :--- |
| **Connection Failed** | Using `https://` instead of `http://` | Mobile IP camera apps broadcast plain unencrypted HTTP. Use `http://` instead of `https://`. |
| **Black screen / Error** | Missing `/video` path | IP and port alone (`:8080`) load the phone's web UI. Make sure to specify the stream path (`:8080/video`). |
| **Connection Timed Out** | Different Wi-Fi networks | Make sure both devices are on the exact same Wi-Fi subnet, or connect your laptop to your phone's hotspot. |
| **Server Offline** | Phone server not running | Tap "Start server" inside your mobile camera app. |

---

## 📂 Project Structure

```text
robot-camera-dashboard/
├── index.html        # Main dashboard UI
├── css/
│   └── styles.css    # Modern dark industrial theme
├── js/
│   └── app.js        # Stream connection logic, URL normalization & localStorage
├── server.rb         # Lightweight zero-dependency server script
└── README.md         # Documentation & setup guide
```
