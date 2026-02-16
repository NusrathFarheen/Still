# How to Run the Still App

## The Problem
You don't have Python or Node.js installed, and PowerShell HTTP server needs admin permissions.

## Easiest Solutions

### ✅ Option 1: VS Code Live Server (BEST)

1. **Install Live Server extension** (if not already installed):
   - Open VS Code
   - Go to Extensions (Ctrl+Shift+X)
   - Search for "Live Server"
   - Install it

2. **Run the app**:
   - Right-click `index.html` in VS Code
   - Select "Open with Live Server"
   - App opens at `http://127.0.0.1:5500` or similar

### ✅ Option 2: Install Python (Quick)

Windows makes this super easy:

```powershell
# This will open Microsoft Store to install Python
python

# After installation, run:
cd d:\PROJECTS\STILL\Still
python -m http.server 5173
```

Then open: `http://localhost:5173`

### ✅ Option 3: Direct File Open (Limited)

You can double-click `index.html` to open it directly, BUT:
- ❌ Camera won't work (needs localhost/HTTPS)
- ❌ Some features may not work
- ✅ You can see the design

---

## For Mobile Testing

Once you have a server running:

1. Get your PC's IP:
   ```powershell
   ipconfig
   ```
   Look for IPv4 Address (e.g., `192.168.1.100`)

2. On your phone (same WiFi):
   - Open browser
   - Go to: `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`

---

## What I Recommend

**Install Python from Microsoft Store** - it's the quickest:
1. Open PowerShell
2. Type `python` and press Enter
3. Microsoft Store will open
4. Click "Get" to install
5. Once done, run the server:
   ```powershell
   cd d:\PROJECTS\STILL\Still
   python -m http.server 5173
   ```

This takes about 2 minutes and you'll have it forever! 🚀
