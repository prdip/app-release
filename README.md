# Tauri App Release & Auto-Updater Repository

This repository hosts the auto-update release manifests (`.json`) and web assets for the **jkjwell** desktop application built with Tauri, Rust, and React.

- **GitHub Repository**: [https://github.com/prdip/app-release](https://github.com/prdip/app-release)
- **Raw Updater Endpoint**: `https://raw.githubusercontent.com/prdip/app-release/main/jkjwell.json`

---

## 📁 Repository Structure

```text
├── assets/
│   ├── index-DcJZRJ7J.css      # Web UI styles
│   └── index-DfKjUuaR.js       # Web UI scripts
├── approve.png                 # Status icon
├── index.html                  # Web release / landing interface
├── jkjwell.json                # Main jkjwell desktop updater release manifest
├── logo.png                    # App logo
├── rejected.png                # Status icon
├── vite.svg                    # Vite icon
├── package.json                # Release manager configuration
└── scripts/
    └── update-release.mjs      # Interactive CLI tool to update release JSONs
```

---

## 🔄 Manifest Format (`jkjwell.json`)

The JSON manifest provides Tauri's auto-updater with the latest version information, release notes, signature, and binary download URL:

```json
{
  "version": "v0.0.1",
  "notes": "app version 0.0.1 update for jkjwell",
  "pub_date": "2026-08-14T00:00:00Z",
  "platforms": {
    "windows-x86_64": {
      "signature": "dW50cnVzdGVkIGNvbW1lbnQ6IHNpZ25hdHVyZSBmcm9t...",
      "url": "https://github.com/prdip/app-release/releases/download/v1/jkjwell_0.0.1_x64-setup.exe"
    }
  }
}
```

---

## 🚀 How to Publish a New Update

### Option 1: Using the Interactive CLI Script

Run the following command in terminal:
```bash
node scripts/update-release.mjs
```
The script will prompt you to:
1. Select the JSON file to update (`jkjwell.json`)
2. Enter the new version (e.g. `v0.0.2` or `0.0.2`)
3. Enter release notes
4. Enter the binary download URL (e.g. `https://github.com/prdip/app-release/releases/download/v0.0.2/jkjwell_0.0.2_x64-setup.exe`)
5. Paste the signature string or provide the path to your `.sig` file

### Option 2: Manual Edit

1. Open [`jkjwell.json`](file:///D:/github/app-release/jkjwell.json).
2. Change `"version"` to your new release tag (e.g. `"v0.0.2"`).
3. Update `"notes"` with changelog description.
4. Update `"pub_date"` with current UTC timestamp (e.g. `"2026-08-17T00:00:00Z"`).
5. In `"platforms" -> "windows-x86_64"`:
   - Paste the contents of your `.sig` signature file into `"signature"`.
   - Update `"url"` with the GitHub Release asset download link.
6. Commit and push:
   ```bash
   git add .
   git commit -m "Release v0.0.2 update for jkjwell"
   git push origin main
   ```

---

## ⚙️ Configuring Your Tauri React Application

In your Tauri project's `tauri.conf.json`, set the updater endpoint to point to this repository:

### For Tauri v2 (`@tauri-apps/plugin-updater`):
```json
{
  "plugins": {
    "updater": {
      "pubkey": "<YOUR_TAURI_UPDATER_PUBLIC_KEY>",
      "endpoints": [
        "https://raw.githubusercontent.com/prdip/app-release/main/jkjwell.json"
      ]
    }
  }
}
```

### For Tauri v1:
```json
{
  "tauri": {
    "updater": {
      "active": true,
      "pubkey": "<YOUR_TAURI_UPDATER_PUBLIC_KEY>",
      "endpoints": [
        "https://raw.githubusercontent.com/prdip/app-release/main/jkjwell.json"
      ]
    }
  }
}
```
