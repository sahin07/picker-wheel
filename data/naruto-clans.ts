import type { NarutoEntry } from "@/types/naruto-types"

const clan = (id: string, name: string, emoji: string, village: string, blurb: string, kekkei?: string): NarutoEntry => ({
  id,
  name,
  emoji,
  category: ["clan"],
  village,
  clan: name,
  kekkeiGenkai: kekkei,
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  blurb,
})

export const narutoClans: NarutoEntry[] = [
  clan("uchiha-clan", "Uchiha", "👁️", "Hidden Leaf", "Konoha clan known for the Sharingan.", "Sharingan"),
  clan("hyuga-clan", "Hyūga", "🤍", "Hidden Leaf", "Byakugan users of the Gentle Fist.", "Byakugan"),
  clan("uzumaki-clan", "Uzumaki", "🌀", "Hidden Leaf", "Uzushiogakure lineage with huge chakra reserves."),
  clan("senju-clan", "Senju", "🌳", "Hidden Leaf", "Founding Konoha clan of Hashirama and Tobirama."),
  clan("nara-clan", "Nara", "🦌", "Hidden Leaf", "Shadow imitation specialists."),
  clan("akimichi-clan", "Akimichi", "🍖", "Hidden Leaf", "Calorie-control expansion jutsu."),
  clan("yamanaka-clan", "Yamanaka", "🌸", "Hidden Leaf", "Mind-transfer and sensory specialists."),
  clan("inuzuka-clan", "Inuzuka", "🐕", "Hidden Leaf", "Ninja-hound partners and fang techniques."),
  clan("aburame-clan", "Aburame", "🪲", "Hidden Leaf", "Insect hosts who fight with kikaichū."),
  clan("hatake-clan", "Hatake", "🐺", "Hidden Leaf", "Small Konoha clan of Kakashi and Sakumo."),
  clan("sarutobi-clan", "Sarutobi", "🔥", "Hidden Leaf", "Clan of the Third Hokage."),
  clan("lee-clan", "Lee / Gai line", "💪", "Hidden Leaf", "Taijutsu-focused students of Might Guy."),
  clan("kaguya-clan", "Kaguya", "🦴", "Hidden Mist", "Bone-based Shikotsumyaku kekkei genkai.", "Shikotsumyaku"),
  clan("hoshigaki-clan", "Hoshigaki", "🦈", "Hidden Mist", "Mist swordsmen line including Kisame."),
  clan("haku-clan", "Yuki", "❄️", "Hidden Mist", "Ice Release bloodline of Haku.", "Ice Release"),
  clan("chinoike-clan", "Chinoike", "🩸", "Hidden Stone", "Ketsuryūgan users.", "Ketsuryūgan"),
  clan("otsutsuki-clan", "Ōtsutsuki", "🌙", "—", "Celestial clan tied to chakra’s origin."),
]
