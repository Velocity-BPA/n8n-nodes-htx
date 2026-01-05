#!/bin/bash

# Copyright (c) Velocity BPA, LLC
# Licensed under the Business Source License 1.1
# Commercial use requires a separate commercial license.
# See LICENSE file for details.

set -e

echo "🏗️ Building n8n-nodes-htx..."

# Clean previous build
echo "🧹 Cleaning previous build..."
rm -rf dist/

# Install dependencies
echo "📦 Installing dependencies..."
npm install

# Run build
echo "⚙️ Compiling TypeScript..."
npm run build

echo "✅ Build complete!"
echo ""
echo "📁 Output: ./dist/"
