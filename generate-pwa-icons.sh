#!/bin/bash
# PWA Icon Generator Script
# Converts SVG logo to PNG icons required for PWA installation

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}==================================${NC}"
echo -e "${BLUE}PWA Icon Generator${NC}"
echo -e "${BLUE}==================================${NC}"

# Check if ImageMagick is installed
if ! command -v magick &> /dev/null; then
    echo -e "${RED}❌ ImageMagick not found!${NC}"
    echo ""
    echo "Install ImageMagick:"
    echo "  Windows: winget install ImageMagick.ImageMagick"
    echo "  Mac: brew install imagemagick"
    echo "  Linux: sudo apt-get install imagemagick"
    exit 1
fi

echo -e "${GREEN}✓ ImageMagick found${NC}"

# Change to frontend directory
cd "$(dirname "$0")/frontend" || exit 1
echo -e "${GREEN}✓ Changed to frontend directory${NC}"

# Check if logo.svg exists
if [ ! -f "public/logo.svg" ]; then
    echo -e "${RED}❌ public/logo.svg not found!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Found public/logo.svg${NC}"
echo ""

# Generate 192x192 icon
echo -e "${BLUE}Generating 192x192 icon...${NC}"
magick convert -background white -size 192x192 public/logo.svg public/pwa-192x192.png
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created public/pwa-192x192.png${NC}"
else
    echo -e "${RED}❌ Failed to create 192x192 icon${NC}"
    exit 1
fi

# Generate 512x512 icon
echo -e "${BLUE}Generating 512x512 icon...${NC}"
magick convert -background white -size 512x512 public/logo.svg public/pwa-512x512.png
if [ $? -eq 0 ]; then
    echo -e "${GREEN}✓ Created public/pwa-512x512.png${NC}"
else
    echo -e "${RED}❌ Failed to create 512x512 icon${NC}"
    exit 1
fi

# Verify icons were created
echo ""
echo -e "${BLUE}Verifying icons...${NC}"

if [ -f "public/pwa-192x192.png" ]; then
    SIZE=$(wc -c < "public/pwa-192x192.png")
    echo -e "${GREEN}✓ pwa-192x192.png ($(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo $SIZE bytes))${NC}"
else
    echo -e "${RED}❌ pwa-192x192.png not created${NC}"
    exit 1
fi

if [ -f "public/pwa-512x512.png" ]; then
    SIZE=$(wc -c < "public/pwa-512x512.png")
    echo -e "${GREEN}✓ pwa-512x512.png ($(numfmt --to=iec-i --suffix=B $SIZE 2>/dev/null || echo $SIZE bytes))${NC}"
else
    echo -e "${RED}❌ pwa-512x512.png not created${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}==================================${NC}"
echo -e "${GREEN}✓ PWA Icons Generated Successfully!${NC}"
echo -e "${GREEN}==================================${NC}"
echo ""
echo "Next steps:"
echo "  1. npm run build"
echo "  2. npm run preview"
echo "  3. Visit http://localhost:4173 on Android Chrome"
echo "  4. Install the app!"
echo ""
