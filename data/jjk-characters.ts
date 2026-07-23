import type { JjkCategory, JjkEntry } from "@/types/jjk-types"

const entry = (
  id: string,
  name: string,
  emoji: string,
  category: JjkCategory[],
  extra: Partial<JjkEntry> = {},
): JjkEntry => ({
  id,
  name,
  emoji,
  category,
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  ...extra,
})

export const jjkCharacters: JjkEntry[] = [
  entry("yuji-itadori", "Yuji Itadori", "👊", ["main", "student"], { school: "Tokyo Jujutsu High" }),
  entry("megumi-fushiguro", "Megumi Fushiguro", "🐺", ["main", "student"], { school: "Tokyo Jujutsu High", clan: "Zenin" }),
  entry("nobara-kugisaki", "Nobara Kugisaki", "🔨", ["main", "student"], { school: "Tokyo Jujutsu High" }),
  entry("satoru-gojo", "Satoru Gojo", "🔵", ["main", "teacher", "special_grade"], { school: "Tokyo Jujutsu High", clan: "Gojo" }),
  entry("suguru-geto", "Suguru Geto", "🌀", ["main", "villain", "special_grade"]),
  entry("ryomen-sukuna", "Ryomen Sukuna", "👹", ["main", "villain", "special_grade"]),
  entry("yuta-okkotsu", "Yuta Okkotsu", "💍", ["main", "student", "special_grade"], { school: "Tokyo Jujutsu High" }),
  entry("maki-zenin", "Maki Zenin", "🥋", ["main", "student"], { school: "Tokyo Jujutsu High", clan: "Zenin" }),
  entry("toge-inumaki", "Toge Inumaki", "🍙", ["main", "student"], { school: "Tokyo Jujutsu High", clan: "Inumaki" }),
  entry("panda", "Panda", "🐼", ["main", "student"], { school: "Tokyo Jujutsu High" }),
  entry("kinji-hakari", "Kinji Hakari", "🎰", ["student"], { school: "Tokyo Jujutsu High" }),
  entry("kirara-hoshi", "Kirara Hoshi", "⭐", ["student"], { school: "Tokyo Jujutsu High" }),
  entry("mai-zenin", "Mai Zenin", "🔫", ["student"], { school: "Kyoto Jujutsu High", clan: "Zenin" }),
  entry("aoi-todo", "Aoi Todo", "👏", ["student", "grade_1"], { school: "Kyoto Jujutsu High" }),
  entry("kasumi-miwa", "Kasumi Miwa", "⚔️", ["student"], { school: "Kyoto Jujutsu High" }),
  entry("kokichi-muta", "Kokichi Muta", "🤖", ["student"], { school: "Kyoto Jujutsu High" }),
  entry("momo-nishimiya", "Momo Nishimiya", "🧹", ["student"], { school: "Kyoto Jujutsu High" }),
  entry("noritoshi-kamo", "Noritoshi Kamo", "🏹", ["student"], { school: "Kyoto Jujutsu High", clan: "Kamo" }),
  entry("nanako-hasaba", "Nanako Hasaba", "📱", ["villain"]),
  entry("mimiko-hasaba", "Mimiko Hasaba", "🪢", ["villain"]),
  entry("kento-nanami", "Kento Nanami", "👔", ["teacher", "grade_1"]),
  entry("mei-mei", "Mei Mei", "🐦‍⬛", ["grade_1"]),
  entry("atsuyo-kusakabe", "Atsuya Kusakabe", "🗡️", ["teacher", "grade_1"], { school: "Tokyo Jujutsu High" }),
  entry("takuma-ino", "Takuma Ino", "🎭", ["grade_1"]),
  entry("utahime-iori", "Utahime Iori", "🎤", ["teacher"], { school: "Kyoto Jujutsu High" }),
  entry("masamichi-yaga", "Masamichi Yaga", "🧸", ["teacher"], { school: "Tokyo Jujutsu High" }),
  entry("yoshinobu-gakuganji", "Yoshinobu Gakuganji", "🎸", ["teacher"], { school: "Kyoto Jujutsu High" }),
  entry("shoko-ieiri", "Shoko Ieiri", "🩺", ["teacher"], { school: "Tokyo Jujutsu High" }),
  entry("akari-nitta", "Akari Nitta", "📋", ["teacher"]),
  entry("toji-fushiguro", "Toji Fushiguro", "⛓️", ["villain"], { clan: "Zenin" }),
  entry("choso", "Choso", "🩸", ["main", "villain", "special_grade"]),
  entry("kenjaku", "Kenjaku", "🧠", ["villain", "special_grade"]),
  entry("mahito", "Mahito", "🖐️", ["villain", "cursed_spirit", "special_grade"]),
  entry("jogo", "Jogo", "🌋", ["villain", "cursed_spirit", "special_grade"]),
  entry("hanami", "Hanami", "🌳", ["villain", "cursed_spirit", "special_grade"]),
  entry("dagon", "Dagon", "🌊", ["villain", "cursed_spirit", "special_grade"]),
  entry("rika", "Rika", "💜", ["cursed_spirit", "special_grade"]),
  entry("smallpox-deity", "Smallpox Deity", "⚰️", ["cursed_spirit", "special_grade"]),
  entry("kurourushi", "Kurourushi", "🪳", ["cursed_spirit", "special_grade"]),
  entry("finger-bearer", "Finger Bearer", "☠️", ["cursed_spirit", "special_grade"]),
  entry("eso", "Eso", "🩸", ["villain", "cursed_spirit"]),
  entry("kechizu", "Kechizu", "🧪", ["villain", "cursed_spirit"]),
  entry("naoya-zenin", "Naoya Zenin", "💨", ["villain", "grade_1"], { clan: "Zenin" }),
  entry("haruta-shigemo", "Haruta Shigemo", "🤡", ["villain"]),
  entry("jiro-awasaka", "Jiro Awasaka", "🔄", ["villain"]),
  entry("uraume", "Uraume", "🧊", ["villain"]),
  entry("yorozu", "Yorozu", "🪲", ["villain"]),
  entry("hajime-kashimo", "Hajime Kashimo", "⚡", ["villain"]),
  entry("hiromi-higuruma", "Hiromi Higuruma", "⚖️", ["main"]),
  entry("fumihiko-takaba", "Fumihiko Takaba", "😂", ["main"]),
  entry("hana-kurusu", "Hana Kurusu", "🪽", ["main"]),
  entry("angel", "Angel", "📯", ["main"]),
  entry("remi", "Remi", "🦂", ["villain"]),
  entry("reggie-star", "Reggie Star", "🧾", ["villain"]),
  entry("ryu-ishigori", "Ryu Ishigori", "💥", ["villain"]),
  entry("takako-uro", "Takako Uro", "🌌", ["villain"]),
  entry("dhruv-lakdawalla", "Dhruv Lakdawalla", "🐘", ["villain"]),
  entry("charles-bernard", "Charles Bernard", "✒️", ["villain"]),
  entry("junpei-yoshino", "Junpei Yoshino", "🪼", ["student"]),
  entry("yuki-tsukumo", "Yuki Tsukumo", "🌟", ["special_grade"]),
  entry("master-tengen", "Master Tengen", "🧿", ["special_grade"]),
]

export const jjkTechniques: JjkEntry[] = [
  entry("tech-limitless", "Limitless", "♾️", ["technique"]),
  entry("tech-six-eyes", "Six Eyes", "👁️", ["technique"]),
  entry("tech-ten-shadows", "Ten Shadows Technique", "🐺", ["technique"]),
  entry("tech-shrine", "Shrine", "⛩️", ["technique"]),
  entry("tech-straw-doll", "Straw Doll Technique", "🔨", ["technique"]),
  entry("tech-cursed-speech", "Cursed Speech", "🗣️", ["technique"]),
  entry("tech-boogie-woogie", "Boogie Woogie", "👏", ["technique"]),
  entry("tech-idle-transfiguration", "Idle Transfiguration", "🖐️", ["technique"]),
  entry("tech-blood-manipulation", "Blood Manipulation", "🩸", ["technique"]),
  entry("tech-ratio", "Ratio Technique", "7️⃣", ["technique"]),
  entry("tech-copy", "Copy", "📋", ["technique"]),
  entry("tech-jackpot", "Private Pure Love Train", "🎰", ["technique"]),
]

export const jjkDomains: JjkEntry[] = [
  entry("domain-infinite-void", "Unlimited Void", "🌌", ["domain"]),
  entry("domain-malevolent-shrine", "Malevolent Shrine", "⛩️", ["domain"]),
  entry("domain-chimera-shadow", "Chimera Shadow Garden", "🌑", ["domain"]),
  entry("domain-self-embodiment", "Self-Embodiment of Perfection", "🖐️", ["domain"]),
  entry("domain-coffin-iron-mountain", "Coffin of the Iron Mountain", "🌋", ["domain"]),
  entry("domain-horizon-captivating-skandha", "Horizon of the Captivating Skandha", "🌊", ["domain"]),
  entry("domain-deadly-sentencing", "Deadly Sentencing", "⚖️", ["domain"]),
  entry("domain-authentic-mutual-love", "Authentic Mutual Love", "💍", ["domain"]),
]

export function getAllJjkEntries(): JjkEntry[] {
  return [...jjkCharacters, ...jjkTechniques, ...jjkDomains]
}

export function filterByCategory(category: JjkCategory): JjkEntry[] {
  return getAllJjkEntries().filter((item) => item.category.includes(category))
}
