#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_DIR="$ROOT_DIR"

apply_patch_file() {
  local patch_file="$1"
  echo "Applying patch: $patch_file"
  git -C "$REPO_DIR" apply --index "$patch_file"
}

apply_zip_file() {
  local zip_file="$1"
  local tmp_dir
  tmp_dir="$(mktemp -d)"
  trap 'rm -rf "$tmp_dir"' RETURN

  echo "Extracting zip: $zip_file"
  unzip -q "$zip_file" -d "$tmp_dir"

  local patch_candidate
  patch_candidate="$(find "$tmp_dir" -type f \( -name '*.patch' -o -name '*.diff' \) | head -n 1 || true)"

  if [[ -z "$patch_candidate" ]]; then
    echo "No .patch/.diff found inside zip: $zip_file" >&2
    return 1
  fi

  apply_patch_file "$patch_candidate"
}

mapfile -t artifacts < <(
  find "$REPO_DIR" -type f \( -name '*.patch' -o -name '*.diff' -o -name '*.zip' \) \
    -not -path '*/node_modules/*' \
    -not -path '*/.git/*'
)

if [[ ${#artifacts[@]} -eq 0 ]]; then
  echo "No patch/zip artifacts found outside node_modules/.git." >&2
  exit 1
fi

for artifact in "${artifacts[@]}"; do
  case "$artifact" in
    *.patch|*.diff)
      apply_patch_file "$artifact"
      ;;
    *.zip)
      apply_zip_file "$artifact"
      ;;
  esac
done

echo "Artifact application complete."
