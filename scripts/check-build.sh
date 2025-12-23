#!/bin/bash

# Build check script to prevent unnecessary builds
# This script checks if there are actual code changes that require a rebuild

echo "🔍 Checking if build is necessary..."

# Get the list of changed files
CHANGED_FILES=$(git diff --name-only HEAD^ HEAD 2>/dev/null || git diff --name-only HEAD)

# If no changes detected, exit
if [ -z "$CHANGED_FILES" ]; then
  echo "✅ No changes detected. Skipping build."
  exit 0
fi

# Files that should trigger a build
BUILD_TRIGGERS=(
  "src/"
  "components/"
  "hooks/"
  "App.tsx"
  "index.tsx"
  "package.json"
  "package-lock.json"
  "vite.config.ts"
  "tsconfig.json"
  "index.html"
  "constants.ts"
  "types.ts"
)

# Check if any changed file matches build triggers
NEEDS_BUILD=false

for file in $CHANGED_FILES; do
  for trigger in "${BUILD_TRIGGERS[@]}"; do
    if [[ "$file" == *"$trigger"* ]] || [[ "$file" == "$trigger" ]]; then
      NEEDS_BUILD=true
      echo "📝 Found relevant change: $file"
      break
    fi
  done
done

# Check for documentation-only changes
DOC_ONLY=true
for file in $CHANGED_FILES; do
  if [[ "$file" != *.md ]] && [[ "$file" != "README.md" ]] && [[ "$file" != ".gitignore" ]] && [[ "$file" != ".vercelignore" ]]; then
    DOC_ONLY=false
    break
  fi
done

if [ "$DOC_ONLY" = true ]; then
  echo "📚 Documentation-only changes detected. Build not required."
  exit 0
fi

if [ "$NEEDS_BUILD" = true ]; then
  echo "✅ Build required. Proceeding with build..."
  exit 0
else
  echo "⏭️  No build-triggering changes detected. Skipping build."
  exit 0
fi

