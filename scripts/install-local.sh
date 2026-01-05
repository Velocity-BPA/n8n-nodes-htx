#!/bin/bash

# Copyright (c) Velocity BPA, LLC
# Licensed under the Business Source License 1.1
# Commercial use requires a separate commercial license.
# See LICENSE file for details.

set -e

echo "📦 Installing n8n-nodes-htx locally..."

# Build the project
./scripts/build.sh

# Create n8n custom directory if it doesn't exist
mkdir -p ~/.n8n/custom

# Remove existing symlink if present
rm -f ~/.n8n/custom/n8n-nodes-htx

# Create symlink
ln -s "$(pwd)" ~/.n8n/custom/n8n-nodes-htx

echo "✅ Installation complete!"
echo ""
echo "🔄 Please restart n8n to load the new node."
echo ""
echo "📍 Node installed at: ~/.n8n/custom/n8n-nodes-htx"
