# Playbook: Adapting from `new/` Updates

## Overview

When a `new/` folder appears at the project root containing updated files, use this
playbook to integrate them safely.

## Steps

### 1. Survey the `new/` contents

```bash
find new -type f | sort
```

Identify:
- **Modified files** — files that exist in both `new/` and the root
- **New files** — files in `new/` that don't exist in the root
- **New assets** — images or other assets in `new/study-images/` (or similar dirs)

### 2. Diff existing files against their counterparts

```bash
for f in $(find new/Skin-Resolute-brand-review -type f -name '*.html' -o -name '*.css' -o -name '*.js'); do
  base=$(basename "$f")
  if [ -f "$base" ]; then
    diff -q "$f" "$base" && echo "IDENTICAL: $base" || echo "DIFFERS: $base"
  else
    echo "NEW FILE: $base"
  fi
done
```

### 3. Copy updates

```bash
cp -R new/Skin-Resolute-brand-review/* .
cp -R new/study-images/* study-images/
```

Or use `rsync` for more control:

```bash
rsync -av --ignore-existing new/study-images/ study-images/
```

### 4. Verify all image references resolve

```bash
rg --no-filename 'study-images/[^\"'"'"',]+' --only-matching *.html | sort -u \
  | while IFS= read -r ref; do
      file="${ref#study-images/}"
      if [ ! -f "study-images/$file" ]; then
        echo "MISSING: $ref"
      fi
    done
```

### 5. Check for multi-image patterns

`reference.html` uses arrays for entries that show two images side-by-side
(e.g., anatomy diagrams with base + alternate views). When a file references
a two-element array like:

```javascript
cn1:['study-images/foo.svg','study-images/foo-2.png'],
```

Both files must exist. If the first is missing:
- Check if it's an SVG meant to be downloaded from Wikimedia Commons
  (source URL is in the `SOURCE_LINKS` object)
- Download it: `curl -sLo study-images/foo.svg "<direct-url>"`
- Never flatten the array to a single string — the two-image display is intentional

### 6. Handle `study-helper-v2.html` vs `study-helper.html`

- `study-helper-v2.html` is the current version in the root
- If `new/` contains `study-helper.html` (without "v2"), it's a different file
- Compare with `study-helper-v2.html` to decide whether to copy or rename

### 7. Clean up

```bash
rm -rf new
```

### Common pitfalls

| Pitfall | How to avoid |
|---------|-------------|
| Missing SVG anatomy diagrams | Check `SOURCE_LINKS` in `reference.html` for the Wikimedia URL and download |
| Flattening multi-image arrays | Keep array syntax — the code renders two `<img>` tags side-by-side |
| Forgetting to copy `new/study-images/` | Always check for an assets directory in `new/` |
| Overwriting images without checking | Use `rsync --ignore-existing` or diff first |
