# Expo Tunnel Configuration Templates

This directory contains configuration templates for different development scenarios.

## Using These Templates

Copy a template to your project root and rename to `.env` or modify `app.json` accordingly.

## Available Templates

### tunnel-dev.env
For local development with tunnel connection:
```bash
cp config-templates/tunnel-dev.env .env
npm run start:tunnel
```

### tunnel-team.env
For team development with shared tunnel:
```bash
cp config-templates/tunnel-team.env .env
# Share tunnel URL with team
npm run start:tunnel
```

### lan-dev.env
For same-network development (fastest):
```bash
cp config-templates/lan-dev.env .env
npm run start:lan
```

### localhost-dev.env
For single-machine development:
```bash
cp config-templates/localhost-dev.env .env
npm run start:localhost
```

## File Structure

- `tunnel-dev.env` - Single developer tunnel setup
- `tunnel-team.env` - Team collaboration setup
- `lan-dev.env` - Local area network setup
- `localhost-dev.env` - Same machine setup
- `eas-staging.json` - Staging EAS build config
- `eas-production.json` - Production EAS build config
