#!/usr/bin/env bash
set -euo pipefail

SOURCE_ROOT="${1:-/Users/stephenbeale/Desktop/Facilitator-AI}"
OUT_DIR="docs/knowledge/facilitator"
INDEX_FILE="${OUT_DIR}/SOURCE_INDEX.md"
BRIEF_FILE="${OUT_DIR}/KNOWLEDGE_BRIEF.md"

mkdir -p "${OUT_DIR}"

echo "# Facilitator-AI Source Index" > "${INDEX_FILE}"
echo >> "${INDEX_FILE}"
echo "Generated: $(date -u +'%Y-%m-%dT%H:%M:%SZ')" >> "${INDEX_FILE}"
echo >> "${INDEX_FILE}"

for section in "Core framework" "MAPS MDMA-AT" "Psychedelic Integration" "Sharing Circles" "Trauma Informed" "Underground Safety" "Crisis Intervention"; do
  section_path="${SOURCE_ROOT}/${section}"
  echo "## ${section}" >> "${INDEX_FILE}"
  if [ -d "${section_path}" ]; then
    find "${section_path}" -maxdepth 2 -type f \
      ! -name '.DS_Store' \
      | sed "s#${SOURCE_ROOT}/#- #" \
      | sort >> "${INDEX_FILE}"
  else
    echo "- (missing) ${section_path}" >> "${INDEX_FILE}"
  fi
  echo >> "${INDEX_FILE}"
done

cat > "${BRIEF_FILE}" <<'BRIEF'
# Facilitator-AI Knowledge Brief

## Safety Baseline
- Trauma-informed practice and underground safety remain ON by default.
- In high-risk states, prioritize stabilization, grounding, and escalation to crisis support.
- Do not coerce meaning-making or interpretation while dysregulated.

## Specialist Focus Areas
- MAPS MDMA-AT: preparation-session-integration continuity, consent and pacing.
- Psychedelic Integration: convert insights into specific post-session actions.
- Sharing Circles: non-directive structure, no cross-talk, confidentiality, bounded timing.
- Crisis Intervention: de-escalation and safe handoff pathways.

## Notes
- This brief is intentionally concise; the full source inventory is in SOURCE_INDEX.md.
- Re-run scripts/build_facilitator_knowledge_pack.sh after source library updates.
BRIEF

# Append compact extracts from JSON corpora when present
{
  echo
  echo "## JSON Extracts"
  for json_file in \
    "${SOURCE_ROOT}/Core framework"/*.json \
    "${SOURCE_ROOT}/Psychedelic Integration"/*.json \
    "${SOURCE_ROOT}/Trauma Informed"/*.json \
    "${SOURCE_ROOT}/Crisis Intervention"/*.json
  do
    [ -f "${json_file}" ] || continue
    echo
    echo "### $(basename "${json_file}")"
    jq -r '.[0].text // .[0].content // .[0].body // empty' "${json_file}" 2>/dev/null \
      | tr '\n' ' ' \
      | sed -E 's/[[:space:]]+/ /g' \
      | cut -c1-1200
  done
} >> "${BRIEF_FILE}"

echo "Wrote ${INDEX_FILE} and ${BRIEF_FILE}"
