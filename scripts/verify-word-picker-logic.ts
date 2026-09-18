import { WORD_PICKER_POPULAR_SPOKE_LINKS, WORD_PICKER_SPOKES, getWordPickerSpoke } from "../lib/word-picker-wheel-spokes"
import { getWordPickerUseCase } from "../lib/word-picker-wheel-use-cases"
import { pickWeightedWords } from "../lib/word-picker-multi"
import { getWordPickerMode, WORD_PICKER_CHALLENGE_MODES, pickExtraWords } from "../lib/word-picker-modes"
import { filterWords, parseWordListFile } from "../lib/word-picker-import"
import { fetchWordVocab } from "../lib/word-picker-vocab"
import fs from "fs"

async function main() {
const lines: string[] = []
const log = (msg: string) => lines.push(msg)

const missingPopular = WORD_PICKER_POPULAR_SPOKE_LINKS.filter((p) => !WORD_PICKER_SPOKES[p.id])
log(`popular ${WORD_PICKER_POPULAR_SPOKE_LINKS.length} missing ${JSON.stringify(missingPopular.map((m) => m.id))}`)
log(`total spokes ${Object.keys(WORD_PICKER_SPOKES).length}`)

const samples = [
  "easy-words",
  "classroom",
  "pictionary",
  "words-z",
  "inktober",
  "what-word-use",
  "common-words",
  "character-picker",
  "taboo",
  "feeling-word",
  "pokemon-words",
  "brainstorming",
]
for (const id of samples) {
  try {
    const s = getWordPickerSpoke(id)
    const uc = getWordPickerUseCase(s.deepLink.useCaseId)
    log(
      `${id} ok path=${s.path} words=${uc?.config.words.length ?? 0} mode=${s.deepLink.config.defaultMode ?? "-"}`,
    )
  } catch (e: any) {
    log(`${id} FAIL ${e.message}`)
  }
}

// empty word packs?
const emptyPacks: string[] = []
for (const s of Object.values(WORD_PICKER_SPOKES)) {
  const words = s.deepLink.config.words
  if (!words || words.length === 0) emptyPacks.push(s.id)
}
log(`empty packs ${emptyPacks.length} ${emptyPacks.slice(0, 20).join(",")}`)

const words = ["Apple", "Banana", "Cherry", "Date", "Elderberry"]
const opts = words.map((name, i) => ({ id: String(i), name, weight: 1, enabled: true }))
log(`pick3 ${pickWeightedWords(opts as any, 3).map((o) => o.name).join(",")}`)
log(`extra ${pickExtraWords(words, "Apple", 2).join(",")}`)
log(`parse ${JSON.stringify(parseWordListFile("a,b\nc\nd"))}`)
log(`filter ${JSON.stringify(filterWords(words, { startsWith: "A", minLength: 4 }))}`)
log(`modes ${WORD_PICKER_CHALLENGE_MODES.map((m) => m.id + ":" + m.wordCount).join(",")}`)
log(`elim forces ${getWordPickerMode("elimination")?.forcesElimination}`)

const vocab = await fetchWordVocab("Adventure")
log(`vocab ${JSON.stringify({ def: !!vocab.definition, ant: vocab.antonyms?.length, syn: vocab.synonyms?.length, letters: vocab.letterCount })}`)

fs.writeFileSync("scripts/word-picker-logic-audit.txt", lines.join("\n"))
console.log(lines.join("\n"))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
