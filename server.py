#!/usr/bin/env python3
"""
Lightweight Local HTTP Server for Robot Manipulator Dashboard
Runs on http://localhost:3000 (or specified port)
Helps avoid browser CORS and file:// protocol restrictions when loading IP camera feeds.
"""

import http.server
import socket
import socketserver
import os
import sys

PORT = 3000

def get_local_ip():
    """Detect LAN IP address for easy mobile pairing."""
    s = socket.socket(socket.AF_INET, socket.SOCK_DGRAM)
    try:
        # doesn't even have to be reachable
        s.connect(('10.255.255.255', 1))
        ip = s.getsockname()[0]
    except Exception:
        ip = '127.0.0.1'
    finally:
        s.close()
    return ip

class CustomHandler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Enable CORS headers for camera streams and assets
        self.send_header('Access-Control-Allow-Origin', '*')
        self.send_header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
        self.send_header('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type')
        self.send_header('Cache-Control', 'no-cache, no-store, must-revalidate')
        super().end_headers()

def main():
    web_dir = os.path.dirname(os.path.abspath(__file__))
    os.chdir(web_dir)
    
    port = PORT
    if len(sys.argv) > 1:
        try:
            port = int(sys.argv[1])
        except ValueError:
            pass

    local_ip = get_local_ip()

    socketserver.TCPServer.allow_reuse_address = True
    with socketserver.TCPServer(("", port), CustomHandler) as httpd:
        print("=" * 68)
        print("🤖 TITAN-6X ROBOT TELEOPERATION DASHBOARD SERVER")
        print("=" * 68)
        print(f" ▸ Local Access:     http://localhost:{port}")
        print(f" ▸ Network Access:   http://{local_ip}:{port}")
        print("=" * 68)
        print("💡 QUICK SETUP GUIDE FOR MOBILE CAMERA:")
        print(" 1. Install 'IP Webcam' (Android) or 'DroidCam' / 'EpocCam' (iOS/Android).")
        print(" 2. Connect phone & computer to the same Wi-Fi network.")
        print(f"    (Computer subnet detected: {'.'.join(local_ip.split('.')[:3])}.X)")
        print(" 3. Tap 'Start Server' in the mobile app.")
        print(" 4. Paste the URL (e.g. http://<phone-ip>:8080/video) into the dashboard.")
        print("=" * 68)
        print("Press Ctrl+C to stop server.\n")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down server. Goodbye!")

if __name__ == '__main__':
    main()
