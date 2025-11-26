#!/bin/bash
# Simple AppImage builder using tar and self-extraction

APPDIR="TripExpenseSplitter.AppDir"
OUTPUT="TripExpenseSplitter-x86_64.AppImage"

cd "$(dirname "$0")"

# Create the tarball
tar czf app.tar.gz "$APPDIR"

# Create the self-extracting script
cat > "$OUTPUT" << 'APPIMAGE_EOF'
#!/bin/bash
# Trip Expense Splitter AppImage

# This is a self-extracting AppImage
# The tarball is appended to this script

APPIMAGE="$0"
OFFSET=$(awk '/^__TARBALL_FOLLOWS__/ { print NR + 1; exit 0; }' "$0")

# Create temp directory
TMPDIR="${TMPDIR:-/tmp}"
APPDIR="$TMPDIR/trip-expense-splitter-$$"

# Extract on first run or if changed
mkdir -p "$APPDIR"
tail -n +$OFFSET "$APPIMAGE" | tar xzf - -C "$APPDIR" 2>/dev/null

# Run the app
cd "$APPDIR/TripExpenseSplitter.AppDir"
./AppRun "$@"

# Cleanup on exit
cleanup() {
    # Don't cleanup immediately - let the server run
    # User can manually cleanup /tmp/trip-expense-splitter-* if needed
    :
}
trap cleanup EXIT

exit 0

__TARBALL_FOLLOWS__
APPIMAGE_EOF

# Append the tarball
cat app.tar.gz >> "$OUTPUT"

# Make it executable
chmod +x "$OUTPUT"

# Cleanup
rm app.tar.gz

echo "AppImage created: $OUTPUT"
ls -lh "$OUTPUT"
