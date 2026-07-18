import { permanentRedirect } from "next/navigation"

/** Alias → Vowel Picker */
export default function RandomVowelGeneratorAliasPage() {
  permanentRedirect("/vowel-picker")
}
