/**
 * Generate Next.js page.tsx for every word-picker spoke (core + expansion).
 * Run: node scripts/generate-word-picker-spokes.js
 */
const fs = require("fs")
const path = require("path")
const { execSync } = require("child_process")

const catalogPath = path.join("scripts", "word-picker-all-spokes.json")

execSync(
  `npx --yes tsx -e "import { WORD_PICKER_SPOKES } from './lib/word-picker-wheel-spokes.ts'; const entries = Object.values(WORD_PICKER_SPOKES).map(s => ({ id: s.id, path: s.path })); require('fs').writeFileSync('scripts/word-picker-all-spokes.json', JSON.stringify(entries, null, 2)); console.log('catalog', entries.length)"`,
  { stdio: "inherit" },
)

const entries = JSON.parse(fs.readFileSync(catalogPath, "utf8"))

for (const { id, path: route } of entries) {
  const seg = route.replace(/^\//, "")
  const dir = path.join("app", seg)
  fs.mkdirSync(dir, { recursive: true })
  const content = `import type { Metadata } from "next"
import WordPickerSpokeRoute, {
  wordPickerSpokeMetadata,
} from "@/components/word-picker-wheel/word-picker-spoke-route"

export const metadata: Metadata = wordPickerSpokeMetadata("${id}")

export default function Page() {
  return <WordPickerSpokeRoute spokeId="${id}" />
}
`
  fs.writeFileSync(path.join(dir, "page.tsx"), content)
}

console.log("wrote", entries.length, "spoke pages")
