# Expo Tunnel Setup Guide

This guide provides comprehensive instructions for using Expo Tunnel with the MegaX Employee App.

## What is Expo Tunnel?

Expo Tunnel is a feature that exposes your local development server to the internet through a secure tunnel. This allows you to:
- Test your app on physical devices without being on the same network
- Share development URLs with team members
- Access your app from anywhere with an internet connection
- Bypass firewall and NAT restrictions

## Quick Start

### Starting Development with Tunnel (Recommended)

```bash
# Start tunnel for all platforms
npm run start:tunnel

# Or start tunnel for specific platform
npm run android:tunnel    # Android with tunnel
npm run ios:tunnel        # iOS with tunnel
```

### Alternative Connection Modes

```bash
# LAN mode (same local network)
npm run start:lan

# Localhost only (same machine)
npm run start:localhost

# Default (auto-selects best mode)
npm run start
```

## Building for Tunnel Development

### Development Build with Tunnel Support

Create a development build that uses tunnel connection:

```bash
npm run build:dev
```

This creates internal distribution builds for testing with tunnel.

### Tunnel Preview Build

For staging/testing environments:

```bash
npm run build:tunnel
```

## Configuration

### Update app.json for Tunnel

The `app.json` is already configured with Update support. For tunnel development, ensure:

```json
{
  "expo": {
    "updates": {
      "enabled": true,
      "checkAutomatically": "ON_APP_RESUME",
      "fallbackToCacheTimeout": 30000
    }
  }
}
```

### EAS Configuration (eas.json)

Tunnel-specific build profiles are configured:

- **tunnel-preview**: Development build with tunnel support
- **development**: Internal distribution for testing
- **production**: Production-ready build

## Setting Up EAS Update

To enable Over-The-Air (OTA) updates with tunnel:

### 1. Login to EAS

```bash
eas login
```

### 2. Link Your Project

```bash
eas project:info
```

### 3. Send Updates via Tunnel

```bash
npm run tunnel:update
```

This pushes code updates to your app without rebuilding.

## Deployment Workflows

### Local Development Workflow

```bash
# 1. Start tunnel dev server
npm run start:tunnel

# 2. Build internal APK for testing (optional)
npm run build:dev

# 3. Scan QR code or open tunnel URL on device

# 4. Make code changes - they hot reload
# Changes sync automatically via tunnel
```

### Team Testing Workflow

```bash
# 1. Start tunnel
npm run start:tunnel
# The tunnel URL will be displayed: exp://xxxxx.tunnels.expo.dev

# 2. Share the tunnel URL with team members

# 3. Team members scan QR or paste URL in Expo Go app

# 4. Changes hot reload for all connected devices
```

### Production Deployment Workflow

```bash
# 1. Build for production
npm run build:all

# 2. Submit to stores
npm run submit:all
```

## Troubleshooting

### QR Code Not Scanning

1. Ensure both devices are connected to internet (tunnel works anywhere)
2. Use a good QR code reader or Expo Go app
3. Try the tunnel URL directly if QR fails
4. Check internet connection quality

### Tunnel Connection Fails

```bash
# Restart tunnel
npm run start:tunnel

# Or use LAN mode if on same network
npm run start:lan
```

### Update Not Syncing

1. Check internet connection
2. Force reload app: `r` in terminal, `Ctrl+Shift+R` in Expo Go
3. Verify update channel in eas.json
4. Run: `npm run tunnel:update`

### Authentication Issues

```bash
# Logout and login again
eas logout
eas login
```

## Network Settings

### For Firewalls/Corporate Networks

If tunnel fails behind corporate firewall:
1. Try LAN mode (`npm run start:lan`) if on same network
2. Request whitelist of `*.tunnels.expo.dev` domains
3. Check SSH tunnel: `expo start --tunnel --clear`

### VPN Considerations

- Tunnel may be slower over VPN
- Use LAN mode if VPN is optional
- Tunnel is more reliable if VPN is required

## Performance Notes

- **Tunnel**: 100-300ms latency (good for most development)
- **LAN**: 0-50ms latency (best performance, same network only)
- **Localhost**: Instant (same machine only)

## Advanced Usage

### Custom Update Channels

```bash
# Create custom channel
eas update --channel staging

# Deploy to custom channel
eas update --platform all --channel staging
```

### Monitoring Tunnel Connection

```bash
# Verbose tunnel logging
expo start --tunnel --verbose
```

### Building with Custom Runtime Version

```bash
# Set in app.json:
{
  "expo": {
    "runtimeVersion": "1.0.0"
  }
}

# Then rebuild and update
npm run build:all
npm run tunnel:update
```

## Security Best Practices

1. **Tunnel URLs are temporary** - they expire after app restart
2. **Share URLs carefully** - anyone with URL can access your dev server
3. **Use authentication** - implement proper auth in your actual app
4. **Keep secrets out of tunnel** - never commit API keys or credentials
5. **Use .env files** for sensitive data (recommended)

## Related Commands

```bash
npm run start          # Default start (auto mode)
npm run start:tunnel   # Tunnel mode
npm run start:lan      # LAN mode
npm run start:localhost # Localhost only
npm run build:dev      # Dev build for testing
npm run build:tunnel   # Tunnel preview build
npm run tunnel:update  # Push OTA updates
```

## Documentation Files

- [README.md](./README.md) - Project overview
- [DEVELOPMENT_GUIDE.md](./DEVELOPMENT_GUIDE.md) - Development setup
- [SETUP_GUIDE.md](./SETUP_GUIDE.md) - Initial setup instructions
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md) - API reference

## Support

For more information:
- [Expo Tunnel Documentation](https://docs.expo.dev/build/build-reference/#tunnel)
- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Expo CLI Reference](https://docs.expo.dev/more/expo-cli/)
