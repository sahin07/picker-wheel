import type { NarutoCategory, NarutoEntry, NarutoEra } from "@/types/naruto-types"
import { narutoChallenges } from "@/data/naruto-challenges"
import { narutoClans } from "@/data/naruto-clans"
import { narutoJutsu } from "@/data/naruto-jutsu"
import { narutoKekkei, narutoNatures, narutoRanks, narutoSummons } from "@/data/naruto-natures"
import { narutoVillages } from "@/data/naruto-villages"

const c = (
  id: string,
  name: string,
  emoji: string,
  category: NarutoCategory[],
  era: NarutoEra[],
  extra: Partial<NarutoEntry> = {},
): NarutoEntry => ({
  id,
  name,
  emoji,
  category,
  era,
  preview: `/placeholder.svg?text=${encodeURIComponent(name)}`,
  ...extra,
})

export const narutoCharacters: NarutoEntry[] = [
  c("naruto-uzumaki", "Naruto Uzumaki", "🦊", ["main", "jinchuriki", "hokage", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Uzumaki", rank: "Hokage", natures: ["Wind"], summon: "Toads",
    signatureJutsu: ["Rasengan", "Shadow Clone"], blurb: "Seventh Hokage and jinchūriki of Kurama.",
  }),
  c("sasuke-uchiha", "Sasuke Uchiha", "⚡", ["main", "uchiha", "shinobi", "villain"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Uchiha", rank: "Shadow Hokage", natures: ["Fire", "Lightning"], kekkeiGenkai: "Sharingan",
    summon: "Hawks", signatureJutsu: ["Chidori", "Amaterasu"], blurb: "Last Uchiha avenger turned ally of Konoha.",
  }),
  c("sakura-haruno", "Sakura Haruno", "🌸", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Jōnin", natures: ["Earth"], summon: "Katsuyu",
    signatureJutsu: ["Chakra Enhanced Strength"], blurb: "Tsunade’s student and a top medical ninja.",
  }),
  c("kakashi-hatake", "Kakashi Hatake", "📖", ["main", "sensei", "hokage", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Hatake", rank: "Hokage", natures: ["Lightning"], kekkeiGenkai: "Sharingan",
    summon: "Ninken", signatureJutsu: ["Chidori", "Kamui"], blurb: "Copy Ninja and Sixth Hokage.",
  }),
  c("sai", "Sai", "🖌️", ["main", "shinobi"], ["shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Anbu",
    signatureJutsu: ["Super Beast Imitating Drawing"], blurb: "Root artist who joins Team 7.",
  }),
  c("yamato", "Yamato", "🪵", ["main", "sensei", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", rank: "Anbu", kekkeiGenkai: "Wood Release",
    signatureJutsu: ["Wood Release"], blurb: "Captain Yamato, Hashirama-cell wood user.",
  }),
  c("shikamaru-nara", "Shikamaru Nara", "🦌", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Nara", rank: "Jōnin",
    signatureJutsu: ["Shadow Imitation"], blurb: "Lazy genius strategist of Team 10.",
  }),
  c("choji-akimichi", "Chōji Akimichi", "🍖", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Akimichi", rank: "Jōnin",
    signatureJutsu: ["Multi-Size Technique"], blurb: "Loyal Akimichi of the Ino–Shika–Chō trio.",
  }),
  c("ino-yamanaka", "Ino Yamanaka", "💐", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Yamanaka", rank: "Jōnin",
    signatureJutsu: ["Mind Transfer"], blurb: "Mind-transfer specialist and florist.",
  }),
  c("hinata-hyuga", "Hinata Hyūga", "🤍", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Hyūga", rank: "Chūnin", kekkeiGenkai: "Byakugan",
    signatureJutsu: ["Gentle Fist"], blurb: "Hyūga heiress and Naruto’s partner.",
  }),
  c("kiba-inuzuka", "Kiba Inuzuka", "🐕", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Inuzuka", rank: "Chūnin", summon: "Akamaru",
    signatureJutsu: ["Fang Over Fang"], blurb: "Inuzuka tracker with ninken Akamaru.",
  }),
  c("shino-aburame", "Shino Aburame", "🪲", ["main", "sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Aburame", rank: "Jōnin",
    signatureJutsu: ["Parasitic Destruction Insects"], blurb: "Quiet insect host of Team 8.",
  }),
  c("neji-hyuga", "Neji Hyūga", "☯️", ["main", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Hyūga", rank: "Jōnin", kekkeiGenkai: "Byakugan",
    signatureJutsu: ["Eight Trigrams"], blurb: "Hyūga prodigy of the branch family.",
  }),
  c("rock-lee", "Rock Lee", "💪", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Jōnin",
    signatureJutsu: ["Eight Inner Gates"], blurb: "Taijutsu specialist who cannot use ninjutsu.",
  }),
  c("tenten", "Tenten", "🎯", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Chūnin",
    signatureJutsu: ["Twin Rising Dragons"], blurb: "Weapon specialist of Team Guy.",
  }),
  c("might-guy", "Might Guy", "🐢", ["main", "sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", rank: "Jōnin",
    signatureJutsu: ["Eight Inner Gates"], blurb: "Konoha’s sublimely green beast of taijutsu.",
  }),
  c("asuma-sarutobi", "Asuma Sarutobi", "🚬", ["main", "sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Sarutobi", rank: "Jōnin", natures: ["Wind"],
    blurb: "Team 10’s veteran jōnin sensei.",
  }),
  c("kurenai-yuhi", "Kurenai Yūhi", "🌹", ["main", "sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", rank: "Jōnin",
    blurb: "Team 8’s genjutsu specialist.",
  }),
  c("iruka-umino", "Iruka Umino", "📕", ["main", "sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Chūnin",
    blurb: "Academy teacher who first believed in Naruto.",
  }),
  c("konohamaru-sarutobi", "Konohamaru Sarutobi", "🔥", ["main", "sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Sarutobi", rank: "Jōnin",
    signatureJutsu: ["Rasengan"], blurb: "Third Hokage’s grandson and Boruto’s teacher.",
  }),
  c("minato-namikaze", "Minato Namikaze", "⚡", ["main", "hokage", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", rank: "Hokage", natures: ["Wind"], summon: "Toads",
    signatureJutsu: ["Flying Thunder God", "Rasengan"], blurb: "Fourth Hokage, the Yellow Flash.",
  }),
  c("kushina-uzumaki", "Kushina Uzumaki", "🌶️", ["main", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uzumaki",
    blurb: "Red Hot-Blooded Habanero and prior Nine-Tails jinchūriki.",
  }),
  c("hashirama-senju", "Hashirama Senju", "🌳", ["main", "hokage", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Senju", rank: "Hokage", kekkeiGenkai: "Wood Release",
    signatureJutsu: ["Wood Release"], blurb: "First Hokage and founder of Konoha.",
  }),
  c("tobirama-senju", "Tobirama Senju", "💧", ["main", "hokage", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Senju", rank: "Hokage", natures: ["Water"],
    signatureJutsu: ["Flying Thunder God"], blurb: "Second Hokage and inventor of many jutsu.",
  }),
  c("hiruzen-sarutobi", "Hiruzen Sarutobi", "🐒", ["main", "hokage", "sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Sarutobi", rank: "Hokage",
    signatureJutsu: ["Reaper Death Seal"], blurb: "Third Hokage, the Professor.",
  }),
  c("tsunade", "Tsunade", "🐌", ["main", "hokage", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Senju", rank: "Hokage", summon: "Katsuyu",
    signatureJutsu: ["Creation Rebirth"], blurb: "Fifth Hokage and legendary Sannin medic.",
  }),
  c("jiraiya", "Jiraiya", "🐸", ["main", "sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", rank: "Sannin", summon: "Toads",
    signatureJutsu: ["Rasengan", "Sage Mode"], blurb: "Toad Sage who trained Minato and Naruto.",
  }),
  c("orochimaru", "Orochimaru", "🐍", ["main", "villain", "sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Sound", rank: "Sannin", summon: "Snakes",
    signatureJutsu: ["Edo Tensei"], blurb: "Sannin scientist of immortality experiments.",
  }),
  c("itachi-uchiha", "Itachi Uchiha", "🐦‍⬛", ["main", "uchiha", "akatsuki", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", rank: "Anbu", kekkeiGenkai: "Sharingan", summon: "Crows",
    signatureJutsu: ["Amaterasu", "Tsukuyomi"], blurb: "Akatsuki spy who protected Konoha in secret.",
  }),
  c("shisui-uchiha", "Shisui Uchiha", "🌀", ["uchiha", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", kekkeiGenkai: "Sharingan",
    signatureJutsu: ["Kotoamatsukami"], blurb: "Uchiha prodigy of genjutsu.",
  }),
  c("obito-uchiha", "Obito Uchiha", "🎭", ["main", "uchiha", "akatsuki", "villain", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", kekkeiGenkai: "Sharingan",
    signatureJutsu: ["Kamui"], blurb: "Masked man who led the Fourth Shinobi World War.",
  }),
  c("madara-uchiha", "Madara Uchiha", "⚔️", ["main", "uchiha", "villain", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", rank: "Clan head", kekkeiGenkai: "Sharingan",
    signatureJutsu: ["Susanoo", "Limbo"], blurb: "Co-founder of Konoha and Infinite Tsukuyomi architect.",
  }),
  c("fugaku-uchiha", "Fugaku Uchiha", "👁️", ["uchiha", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", kekkeiGenkai: "Sharingan",
    blurb: "Uchiha clan head and father of Itachi and Sasuke.",
  }),
  c("mikoto-uchiha", "Mikoto Uchiha", "🌙", ["uchiha", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha",
    blurb: "Mother of Itachi and Sasuke.",
  }),
  c("sarada-uchiha", "Sarada Uchiha", "👓", ["main", "uchiha", "shinobi"], ["boruto"], {
    village: "Hidden Leaf", clan: "Uchiha", rank: "Chūnin", kekkeiGenkai: "Sharingan",
    signatureJutsu: ["Chidori", "Fireball"], blurb: "Sasuke and Sakura’s daughter on Team 7.",
  }),
  c("boruto-uzumaki", "Boruto Uzumaki", "⚡", ["main", "shinobi"], ["boruto"], {
    village: "Hidden Leaf", clan: "Uzumaki", rank: "Genin", natures: ["Lightning", "Wind"],
    signatureJutsu: ["Vanishing Rasengan"], blurb: "Naruto’s son and Karma vessel.",
  }),
  c("himawari-uzumaki", "Himawari Uzumaki", "🌻", ["main", "shinobi"], ["boruto"], {
    village: "Hidden Leaf", clan: "Uzumaki", kekkeiGenkai: "Byakugan",
    blurb: "Naruto and Hinata’s daughter with a gentle Byakugan.",
  }),
  c("mitsuki", "Mitsuki", "🐍", ["main", "shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "Genin", summon: "Snakes",
    signatureJutsu: ["Sage Transformation"], blurb: "Orochimaru’s synthetic son on Team 7.",
  }),
  c("kawaki", "Kawaki", "🔩", ["main", "villain", "shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "—",
    signatureJutsu: ["Karma", "Kāma"], blurb: "Kara vessel adopted into the Uzumaki home.",
  }),
  c("gaara", "Gaara", "🏜️", ["main", "jinchuriki", "kage", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Sand", rank: "Kazekage", natures: ["Earth"], kekkeiGenkai: "Magnet Release",
    signatureJutsu: ["Sand Coffin"], blurb: "Fifth Kazekage and former One-Tail jinchūriki.",
  }),
  c("temari", "Temari", "🪭", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Sand", rank: "Jōnin", natures: ["Wind"],
    signatureJutsu: ["Summoning: Giant Sickle Weasel"], blurb: "Sand Village wind specialist.",
  }),
  c("kankuro", "Kankurō", "🎎", ["main", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Sand", rank: "Jōnin",
    signatureJutsu: ["Puppet Technique"], blurb: "Sand puppeteer and Gaara’s brother.",
  }),
  c("chiyo", "Chiyo", "👵", ["shinobi"], ["shippuden"], {
    village: "Hidden Sand", rank: "Elder",
    signatureJutsu: ["Puppet Technique", "One’s Own Life Reincarnation"], blurb: "Honored Sister of Suna.",
  }),
  c("killer-bee", "Killer B", "🎤", ["main", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Cloud", rank: "Jinchūriki", natures: ["Lightning"],
    signatureJutsu: ["Lariat", "Tailed Beast Bomb"], blurb: "Eight-Tails jinchūriki and rapper.",
  }),
  c("ay", "A (Fourth Raikage)", "💥", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Cloud", rank: "Raikage", natures: ["Lightning"],
    signatureJutsu: ["Lariat"], blurb: "Lightning-cloak Raikage of the Cloud.",
  }),
  c("mei-terumi", "Mei Terumī", "♨️", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Mist", rank: "Mizukage", kekkeiGenkai: "Lava Release",
    signatureJutsu: ["Boil Release"], blurb: "Fifth Mizukage with two kekkei genkai.",
  }),
  c("onoki", "Ōnoki", "🪨", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Stone", rank: "Tsuchikage",
    signatureJutsu: ["Particle Style"], blurb: "Third Tsuchikage, Fence-Sitter of Iwa.",
  }),
  c("kurotsuchi", "Kurotsuchi", "🌋", ["kage", "shinobi"], ["shippuden", "boruto"], {
    village: "Hidden Stone", rank: "Tsuchikage", kekkeiGenkai: "Lava Release",
    blurb: "Fourth Tsuchikage after Ōnoki.",
  }),
  c("darui", "Darui", "⛈️", ["kage", "shinobi"], ["shippuden", "boruto"], {
    village: "Hidden Cloud", rank: "Raikage", kekkeiGenkai: "Storm Release",
    blurb: "Fifth Raikage and former right-hand of A.",
  }),
  c("chojuro", "Chōjūrō", "🗡️", ["kage", "shinobi"], ["shippuden", "boruto"], {
    village: "Hidden Mist", rank: "Mizukage",
    signatureJutsu: ["Hiramekarei"], blurb: "Sixth Mizukage and former Seven Swordsmen member.",
  }),
  c("shikaku-nara", "Shikaku Nara", "♟️", ["sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Nara", rank: "Jōnin",
    blurb: "Konoha’s chief strategist and Shikamaru’s father.",
  }),
  c("inoichi-yamanaka", "Inoichi Yamanaka", "🔮", ["sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Yamanaka", rank: "Jōnin",
    blurb: "Konoha intel chief and Ino’s father.",
  }),
  c("choza-akimichi", "Chōza Akimichi", "🍔", ["sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", clan: "Akimichi", rank: "Jōnin",
    blurb: "Ino–Shika–Chō veteran and Chōji’s father.",
  }),
  c("hiashi-hyuga", "Hiashi Hyūga", "👁️‍🗨️", ["sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", clan: "Hyūga", kekkeiGenkai: "Byakugan",
    blurb: "Hyūga clan head and Hinata’s father.",
  }),
  c("pain", "Pain (Nagato)", "🟣", ["villain", "akatsuki", "jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Rain", clan: "Uzumaki", kekkeiGenkai: "Rinnegan",
    signatureJutsu: ["Almighty Push", "Planetary Devastation"], blurb: "Akatsuki leader who attacked Konoha.",
  }),
  c("konan", "Konan", "📄", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Rain",
    signatureJutsu: ["Dance of the Shikigami"], blurb: "Angel of the Akatsuki and paper user.",
  }),
  c("kisame-hoshigaki", "Kisame Hoshigaki", "🦈", ["villain", "akatsuki", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Mist", clan: "Hoshigaki",
    signatureJutsu: ["Samehada"], blurb: "Monster of the Hidden Mist.",
  }),
  c("deidara", "Deidara", "💥", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Stone", natures: ["Earth"],
    signatureJutsu: ["Explosive Clay"], blurb: "Artist of the Akatsuki who explodes his art.",
  }),
  c("sasori", "Sasori", "🎎", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Sand",
    signatureJutsu: ["Red Secret Technique"], blurb: "Puppet of the Akatsuki, Sasori of the Red Sand.",
  }),
  c("hidan", "Hidan", "⛓️", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Hot Springs",
    signatureJutsu: ["Jashin ritual"], blurb: "Immortal Jashinist of the Akatsuki.",
  }),
  c("kakuzu", "Kakuzu", "🧵", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Waterfall",
    signatureJutsu: ["Earth Grudge Fear"], blurb: "Bounty hunter with five hearts.",
  }),
  c("zetsu", "Zetsu", "🪴", ["villain", "akatsuki"], ["shippuden"], {
    signatureJutsu: ["Mayfly"], blurb: "Black and White Zetsu, Madara’s will given form.",
  }),
  c("tobi", "Tobi", "🟠", ["villain", "akatsuki", "uchiha"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", kekkeiGenkai: "Sharingan",
    blurb: "Masked Akatsuki member (Obito’s public face).",
  }),
  c("yahiko", "Yahiko", "🧡", ["shinobi"], ["shippuden"], {
    village: "Hidden Rain",
    blurb: "Ame orphan whose body became the Deva Path.",
  }),
  c("kabuto-yakushi", "Kabuto Yakushi", "👓", ["villain", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Sound",
    signatureJutsu: ["Edo Tensei", "Sage Mode"], blurb: "Orochimaru’s spy turned snake sage.",
  }),
  c("danzo-shimura", "Danzō Shimura", "🩹", ["villain", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", rank: "Elder", kekkeiGenkai: "Sharingan",
    signatureJutsu: ["Izanagi"], blurb: "Root founder who coveted the Hokage seat.",
  }),
  c("kaguya-otsutsuki", "Kaguya Ōtsutsuki", "🐰", ["villain"], ["shippuden"], {
    clan: "Ōtsutsuki", kekkeiGenkai: "Rinne Sharingan",
    signatureJutsu: ["All-Killing Ash Bones"], blurb: "Progenitor of chakra on Earth.",
  }),
  c("momoshiki-otsutsuki", "Momoshiki Ōtsutsuki", "🧿", ["villain"], ["boruto"], {
    clan: "Ōtsutsuki",
    blurb: "Ōtsutsuki who marked Boruto with Karma.",
  }),
  c("isshiki-otsutsuki", "Isshiki Ōtsutsuki", "📐", ["villain"], ["boruto"], {
    clan: "Ōtsutsuki",
    blurb: "Ōtsutsuki who used Jigen as a vessel.",
  }),
  c("zabuza-momochi", "Zabuza Momochi", "🗡️", ["villain", "shinobi"], ["part1"], {
    village: "Hidden Mist",
    signatureJutsu: ["Silent Killing", "Hidden Mist"], blurb: "Demon of the Hidden Mist.",
  }),
  c("haku", "Haku", "❄️", ["shinobi"], ["part1"], {
    village: "Hidden Mist", clan: "Yuki", kekkeiGenkai: "Ice Release",
    signatureJutsu: ["Demonic Ice Mirrors"], blurb: "Zabuza’s protector with Ice Release.",
  }),
  c("kimimaro", "Kimimaro", "🦴", ["villain", "shinobi"], ["part1"], {
    village: "Hidden Sound", clan: "Kaguya", kekkeiGenkai: "Shikotsumyaku",
    signatureJutsu: ["Dance of the Seedling Ferns"], blurb: "Orochimaru’s last Kaguya clan heir.",
  }),
  c("jiraiya-pain-arc", "Hanzo", "🔥", ["villain", "kage", "shinobi"], ["shippuden"], {
    village: "Hidden Rain", rank: "Leader",
    blurb: "Salamander Hanzō who named the Sannin.",
  }),
  c("hanzo", "Hanzō of the Salamander", "🦎", ["villain", "kage", "shinobi"], ["shippuden"], {
    village: "Hidden Rain",
    blurb: "Ame warlord defeated by Pain.",
  }),
  c("yugito", "Yugito Nii", "🐱", ["jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Cloud",
    blurb: "Two-Tails jinchūriki of the Cloud.",
  }),
  c("yagura", "Yagura Karatachi", "🫧", ["jinchuriki", "kage", "shinobi"], ["shippuden"], {
    village: "Hidden Mist", rank: "Mizukage",
    blurb: "Fourth Mizukage and Three-Tails jinchūriki.",
  }),
  c("roshi", "Rōshi", "🌋", ["jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Stone", kekkeiGenkai: "Lava Release",
    blurb: "Four-Tails jinchūriki of Iwa.",
  }),
  c("han", "Han", "🔥", ["jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Stone",
    blurb: "Five-Tails jinchūriki in steam armor.",
  }),
  c("utakata", "Utakata", "🧼", ["jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Mist",
    blurb: "Six-Tails jinchūriki wanderer.",
  }),
  c("fu", "Fū", "🦋", ["jinchuriki", "shinobi"], ["shippuden"], {
    village: "Hidden Waterfall",
    blurb: "Seven-Tails jinchūriki of Taki.",
  }),
  c("kurama", "Kurama (Nine-Tails)", "🦊", ["jinchuriki"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf",
    blurb: "Nine-Tailed Beast sealed in Naruto.",
  }),
  c("shukaku", "Shukaku (One-Tail)", "🦝", ["jinchuriki"], ["part1", "shippuden"], {
    village: "Hidden Sand",
    blurb: "One-Tailed Beast of Suna.",
  }),
  c("gyuki", "Gyūki (Eight-Tails)", "🐙", ["jinchuriki"], ["shippuden"], {
    village: "Hidden Cloud",
    blurb: "Eight-Tailed Beast partnered with Killer B.",
  }),
  c("anko-mitarashi", "Anko Mitarashi", "🍡", ["sensei", "shinobi"], ["part1", "shippuden", "boruto"], {
    village: "Hidden Leaf", rank: "Tokubetsu Jōnin", summon: "Snakes",
    blurb: "Orochimaru’s former student and chūnin exam proctor.",
  }),
  c("ibiki-morino", "Ibiki Morino", "🧠", ["sensei", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", rank: "Tokubetsu Jōnin",
    blurb: "Torture and Interrogation specialist.",
  }),
  c("genma-shiranui", "Genma Shiranui", "🍡", ["shinobi"], ["part1", "shippuden"], {
    village: "Hidden Leaf", rank: "Tokubetsu Jōnin",
    blurb: "Senbon-in-mouth elite jōnin.",
  }),
  c("raikage-a3", "A (Third Raikage)", "🛡️", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Cloud", rank: "Raikage", natures: ["Lightning"],
    blurb: "Strongest shield of the Cloud Village.",
  }),
  c("mu", "Mū", "👻", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Stone", rank: "Tsuchikage",
    signatureJutsu: ["Particle Style"], blurb: "Second Tsuchikage, the Non-Person.",
  }),
  c("gengetsu", "Gengetsu Hōzuki", "🫧", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Mist", rank: "Mizukage",
    blurb: "Second Mizukage of the Hōzuki clan.",
  }),
  c("retosand", "Reto", "🌵", ["kage", "shinobi"], ["shippuden"], {
    village: "Hidden Sand", rank: "Kazekage",
    blurb: "First Kazekage of Suna.",
  }),
  c("rasa", "Rasa", "🥇", ["kage", "shinobi"], ["part1", "shippuden"], {
    village: "Hidden Sand", rank: "Kazekage", kekkeiGenkai: "Magnet Release",
    blurb: "Fourth Kazekage and Gaara’s father.",
  }),
  c("shisui-copy", "Izuna Uchiha", "🗡️", ["uchiha", "shinobi"], ["shippuden"], {
    village: "Hidden Leaf", clan: "Uchiha", kekkeiGenkai: "Sharingan",
    blurb: "Madara’s brother in the founding era.",
  }),
  c("nagato", "Nagato", "🧡", ["villain", "akatsuki", "shinobi"], ["shippuden"], {
    village: "Hidden Rain", clan: "Uzumaki", kekkeiGenkai: "Rinnegan",
    blurb: "Ame orphan who became Pain.",
  }),
  c("suigetsu", "Suigetsu Hōzuki", "💧", ["shinobi"], ["shippuden"], {
    village: "Hidden Mist", natures: ["Water"],
    signatureJutsu: ["Hydrification"], blurb: "Taka swordsman who wants all seven blades.",
  }),
  c("juugo", "Jūgo", "😡", ["shinobi"], ["shippuden"], {
    village: "Hidden Sound",
    signatureJutsu: ["Sage Transformation"], blurb: "Cursed-seal source of Taka.",
  }),
  c("karin", "Karin", "👓", ["shinobi"], ["shippuden"], {
    village: "Hidden Grass", clan: "Uzumaki",
    signatureJutsu: ["Mind’s Eye of Kagura"], blurb: "Uzumaki sensor of Taka.",
  }),
  c("jiraiya-student", "Nagato (child)", "🧒", ["shinobi"], ["shippuden"], {
    village: "Hidden Rain",
    blurb: "Jiraiya’s Ame student before the Rinnegan war.",
  }),
  c("shino-clone-skip", "Denki Kaminarimon", "💡", ["shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "Genin",
    blurb: "Academy classmate of Boruto with gadget ninjutsu.",
  }),
  c("iwabe", "Iwabee Yuino", "🧱", ["shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "Genin", natures: ["Earth"],
    blurb: "Earth-style classmate of Boruto.",
  }),
  c("metal-lee", "Metal Lee", "🥋", ["shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "Genin",
    signatureJutsu: ["Primary Lotus"], blurb: "Rock Lee’s son and taijutsu prodigy.",
  }),
  c("sumire", "Sumire Kakei", "💜", ["shinobi"], ["boruto"], {
    village: "Hidden Leaf", rank: "Genin",
    blurb: "Scientific ninja tools researcher and former Nue host.",
  }),
  c("delta", "Delta", "🤖", ["villain"], ["boruto"], {
    blurb: "Kara inner with scientific ninja tools.",
  }),
  c("code", "Code", "✖️", ["villain"], ["boruto"], {
    blurb: "Kara inner obsessed with Isshiki’s will.",
  }),
  c("jigen", "Jigen", "🕯️", ["villain"], ["boruto"], {
    blurb: "Kara leader and vessel of Isshiki.",
  }),
  c("ama", "Amado", "🧪", ["shinobi"], ["boruto"], {
    village: "Hidden Leaf",
    blurb: "Kara scientist who defected to Konoha.",
  }),
]

export function getNarutoCharacters(): NarutoEntry[] {
  return narutoCharacters
}

export function getAllNarutoEntries(): NarutoEntry[] {
  return [
    ...narutoCharacters,
    ...narutoVillages,
    ...narutoClans,
    ...narutoJutsu,
    ...narutoChallenges,
    ...narutoNatures,
    ...narutoKekkei,
    ...narutoRanks,
    ...narutoSummons,
  ]
}

export function filterByCategory(category: NarutoCategory): NarutoEntry[] {
  return getAllNarutoEntries().filter((item) => item.category.includes(category))
}

export function filterByEra(era: NarutoEra): NarutoEntry[] {
  return narutoCharacters.filter((item) => item.era?.includes(era))
}

export function findNarutoEntry(id: string): NarutoEntry | undefined {
  return getAllNarutoEntries().find((item) => item.id === id)
}
