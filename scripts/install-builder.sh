#!/usr/bin/env bash
# Installation script for builder packages

echo "Installing builder packages dependencies..."

# Check for bun
if command -v bun &> /dev/null; then
    echo "Using Bun..."
    bun install
    exit 0
fi

# Check for pnpm
if command -v pnpm &> /dev/null; then
    echo "Using pnpm..."
    # pnpm doesn't support catalog: in the same way, use npm instead
fi

# Fall back to npm with manual resolution
echo "Using npm (manual resolution)..."

# Install in each package manually
cd packages/builder-core
npm install
cd ../builder-api
npm install --legacy-peer-deps 2>/dev/null || npm install --force
cd ../builder
npm install --legacy-peer-deps 2>/dev/null || npm install --force

echo "Installation complete!"
