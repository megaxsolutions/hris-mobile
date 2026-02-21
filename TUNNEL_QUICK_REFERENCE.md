# Expo Tunnel Quick Reference

## Fastest Way to Get Started

```bash
# 1. Install dependencies
npm install

# 2. Start tunnel dev server
npm run start:tunnel

# 3. Scan QR code with Expo Go app or mobile camera
#    (You'll see the tunnel URL in terminal, e.g., exp://xxxxx.tunnels.expo.dev)

# 4. App opens on your device - changes hot reload automatically!
```

## Common Commands

### Starting Development

```bash
npm run start:tunnel      # Tunnel (best for remote/team testing)
npm run start:lan         # LAN (fastest, same network only)
npm run start:localhost   # Localhost (same machine only)
npm run start             # Auto mode (best available)
```

### Platform-Specific

```bash
npm run android:tunnel    # Android device/emulator with tunnel
npm run ios:tunnel        # iOS device/simulator with tunnel
npm run web               # Web browser
```

### Building

```bash
npm run build:dev         # Internal dev build
npm run build:android     # Android app bundle
npm run build:ios         # iOS archive
npm run build:all         # Both platforms
npm run build:tunnel      # Tunnel-enabled preview
```

### Updates & Testing

```bash
npm run tunnel:update     # Push code updates (no rebuild)
npm run build:tunnel      # Build with tunnel support
npm run preview:android   # Preview build for Android
npm run preview:ios       # Preview build for iOS
```

## Tunnel URL Sharing

When you run `npm run start:tunnel`, you get a URL like:
```
exp://xxxxx.tunnels.expo.dev
```

Share this URL with team members to:
- Test with Expo Go app (Android/iOS)
- Share development version
- Remote collaboration

⚠️ **Note**: URL changes when you restart tunnel, expires after app restart

## VS Code Terminal Tips

```bash
# Clear terminal while keeping tunnel running
clear                 # Linux/Mac
cls                   # Windows PowerShell

# Force reload app in Expo Go
# Press 'r' in terminal where tunnel is running

# Show logs with filtering
# Press 'j' for Android reverse debugger
# Press 'i' for iOS simulator
```

## Troubleshooting One-Liners

```bash
# Restart tunnel
npm run start:tunnel

# Use LAN if tunnel fails
npm run start:lan

# Clear cache and restart
expo start --tunnel --clear

# Check tunnel status
node scripts/tunnel-helper.js status

# View configuration
node scripts/tunnel-helper.js config

# Reset to defaults
node scripts/tunnel-helper.js reset
```

## Connection Mode Comparison

| Mode | Speed | Range | Same Network | Notes |
|------|-------|-------|--------------|-------|
| **Tunnel** | Good | Global | ✓ | Best for remote testing, works anywhere |
| **LAN** | Fast | Local only | ✓ Required | Best performance, home/office only |
| **Localhost** | Instant | Same machine | ✓ | Device testing on development machine |

## Team Development Workflow

```bash
# Developer 1: Start tunnel
npm run start:tunnel
# Shows: exp://abc123.tunnels.expo.dev

# Everyone else: Scan QR or paste URL in Expo Go
# Changes are instantly visible to all connected devices
# No rebuilds needed!

# Push updates (optional):
npm run tunnel:update
```

## Using with Physical Device

### Android
1. Install Expo Go from Google Play
2. Tap "Scan QR code" button
3. Scan QR code from terminal output
4. App opens automatically

### iOS
1. Install Expo Go from App Store
2. Open Expo Go app
3. Scan QR code with iPhone camera
4. App opens in Expo Go

## Environment Setup

Copy environment template:
```bash
cp .env.example .env
# Edit .env with your settings
```

Key variables:
- `TUNNEL_MODE` - Connection type (tunnel/lan/localhost)
- `EXPO_UPDATE_CHANNEL` - Update channel name
- `REACT_NATIVE_API_URL` - Backend API endpoint

## File Locations

- **Main config**: `app.json`
- **Build profiles**: `eas.json`
- **npm scripts**: `package.json`
- **Environment**: `.env.example` (copy to `.env`)
- **Helper script**: `scripts/tunnel-helper.js`
- **Full guide**: `TUNNEL_SETUP.md`

## Resources

- [Expo Documentation](https://docs.expo.dev)
- [Tunnel Guide](./TUNNEL_SETUP.md)
- [Development Guide](./DEVELOPMENT_GUIDE.md)
- Full docs: [DOCUMENTATION_INDEX.md](./DOCUMENTATION_INDEX.md)

## One-Command Deployment

```bash
# Local testing → Production
npm run start:tunnel     # Develop locally with tunnel
npm run tunnel:update    # Push updates (optional)
npm run build:all        # Build for stores
npm run submit:all       # Submit to app stores
```
