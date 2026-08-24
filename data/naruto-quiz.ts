export type NarutoQuizKind = "character" | "jutsu" | "clan" | "village" | "quote"

export type NarutoQuizQuestion = {
  id: string
  kind: NarutoQuizKind
  prompt: string
  options: readonly [string, string, string, string]
  answer: string
}

export const NARUTO_QUIZ_QUESTIONS: NarutoQuizQuestion[] = [
  { id: "c1", kind: "character", prompt: "Who is the Seventh Hokage?", options: ["Kakashi Hatake", "Naruto Uzumaki", "Tsunade", "Minato Namikaze"], answer: "Naruto Uzumaki" },
  { id: "c2", kind: "character", prompt: "Which Uchiha is known as the Copy Ninja’s rival from Team 7?", options: ["Itachi Uchiha", "Obito Uchiha", "Sasuke Uchiha", "Shisui Uchiha"], answer: "Sasuke Uchiha" },
  { id: "c3", kind: "character", prompt: "Who trained Naruto in Sage Mode on Mount Myōboku?", options: ["Hiruzen Sarutobi", "Jiraiya", "Fukasaku only", "Minato Namikaze"], answer: "Jiraiya" },
  { id: "c4", kind: "character", prompt: "Who is the Fifth Kazekage?", options: ["Rasa", "Gaara", "Temari", "Kankurō"], answer: "Gaara" },
  { id: "c5", kind: "character", prompt: "Which Akatsuki member uses Samehada?", options: ["Kisame Hoshigaki", "Zabuza Momochi", "Suigetsu Hōzuki", "Hidan"], answer: "Kisame Hoshigaki" },
  { id: "c6", kind: "character", prompt: "Who is known as the Yellow Flash?", options: ["A (Fourth Raikage)", "Minato Namikaze", "Tobirama Senju", "Darui"], answer: "Minato Namikaze" },
  { id: "c7", kind: "character", prompt: "Which Hyūga uses the Gentle Fist as Team 8’s quiet prodigy?", options: ["Neji Hyūga", "Hinata Hyūga", "Hiashi Hyūga", "Hanabi Hyūga"], answer: "Hinata Hyūga" },
  { id: "c8", kind: "character", prompt: "Who is Boruto’s Team 7 teammate created by Orochimaru?", options: ["Kawaki", "Mitsuki", "Metal Lee", "Iwabee Yuino"], answer: "Mitsuki" },
  { id: "c9", kind: "character", prompt: "Which quote is closest to Naruto’s catchphrase?", options: ["I’ll become Hokage!", "Plus Ultra", "I am the hope of the universe", "Dattebayo is never used"], answer: "I’ll become Hokage!" },
  { id: "c10", kind: "character", prompt: "Who leads Root and uses Izanagi with stolen Sharingan?", options: ["Danzo Shimura", "Hiruzen Sarutobi", "Itachi Uchiha", "Kabuto Yakushi"], answer: "Danzo Shimura" },
  { id: "j1", kind: "jutsu", prompt: "Which technique did Minato invent as a spinning chakra sphere?", options: ["Chidori", "Rasengan", "Lariat", "Amaterasu"], answer: "Rasengan" },
  { id: "j2", kind: "jutsu", prompt: "Kakashi’s signature lightning thrust is called:", options: ["Chidori", "Kirin", "Lariat", "Particle Style"], answer: "Chidori" },
  { id: "j3", kind: "jutsu", prompt: "Itachi’s unending black flames are:", options: ["Fireball Jutsu", "Amaterasu", "Majestic Destroyer Flame", "Boil Release"], answer: "Amaterasu" },
  { id: "j4", kind: "jutsu", prompt: "The Hyūga close-range style that strikes tenketsu is:", options: ["Eight Inner Gates", "Gentle Fist", "Leaf Hurricane", "Shadow Imitation"], answer: "Gentle Fist" },
  { id: "j5", kind: "jutsu", prompt: "Minato’s kunai teleport is:", options: ["Kamui", "Flying Thunder God", "Amenotejikara", "Body Flicker"], answer: "Flying Thunder God" },
  { id: "j6", kind: "jutsu", prompt: "Gaara’s crushing sand bind is often called:", options: ["Sand Coffin", "Desert Layered Imperial Funeral", "Quicksand Waterfall", "Iron Sand World Method"], answer: "Sand Coffin" },
  { id: "j7", kind: "jutsu", prompt: "Hashirama’s kekkei genkai is:", options: ["Ice Release", "Wood Release", "Storm Release", "Boil Release"], answer: "Wood Release" },
  { id: "j8", kind: "jutsu", prompt: "Rock Lee’s forbidden taijutsu path opens the:", options: ["Eight Inner Gates", "Four Symbols Seal", "Five Elements Seal", "Mind Transfer"], answer: "Eight Inner Gates" },
  { id: "cl1", kind: "clan", prompt: "Which clan is known for the Sharingan?", options: ["Hyūga", "Uchiha", "Senju", "Nara"], answer: "Uchiha" },
  { id: "cl2", kind: "clan", prompt: "The Byakugan belongs to the:", options: ["Uchiha", "Hyūga", "Uzumaki", "Aburame"], answer: "Hyūga" },
  { id: "cl3", kind: "clan", prompt: "Shadow imitation is the specialty of the:", options: ["Nara", "Yamanaka", "Akimichi", "Inuzuka"], answer: "Nara" },
  { id: "cl4", kind: "clan", prompt: "Huge chakra and sealing specialties are associated with:", options: ["Uzumaki", "Hoshigaki", "Kaguya", "Hatake"], answer: "Uzumaki" },
  { id: "cl5", kind: "clan", prompt: "Insect hosts who fight with kikaichū are the:", options: ["Aburame", "Inuzuka", "Akimichi", "Yuki"], answer: "Aburame" },
  { id: "cl6", kind: "clan", prompt: "Bone-based Shikotsumyaku is the kekkei genkai of:", options: ["Kaguya", "Yuki", "Chinoike", "Hōzuki"], answer: "Kaguya" },
  { id: "v1", kind: "village", prompt: "Konoha is also called the:", options: ["Hidden Leaf", "Hidden Sand", "Hidden Mist", "Hidden Cloud"], answer: "Hidden Leaf" },
  { id: "v2", kind: "village", prompt: "Gaara’s village is the:", options: ["Hidden Stone", "Hidden Sand", "Hidden Rain", "Hidden Grass"], answer: "Hidden Sand" },
  { id: "v3", kind: "village", prompt: "The Village Hidden in the Mist is:", options: ["Kiri", "Kumo", "Iwa", "Ame"], answer: "Kiri" },
  { id: "v4", kind: "village", prompt: "Killer B’s home village is the:", options: ["Hidden Cloud", "Hidden Leaf", "Hidden Sound", "Hidden Waterfall"], answer: "Hidden Cloud" },
  { id: "v5", kind: "village", prompt: "Ōnoki led the:", options: ["Hidden Stone", "Hidden Rain", "Hidden Hot Springs", "Hidden Star"], answer: "Hidden Stone" },
  { id: "v6", kind: "village", prompt: "Pain’s village is the:", options: ["Hidden Rain", "Hidden Sound", "Hidden Grass", "Hidden Snow"], answer: "Hidden Rain" },
  { id: "v7", kind: "village", prompt: "Orochimaru founded the:", options: ["Hidden Sound", "Hidden Star", "Hidden Waterfall", "Hidden Leaf"], answer: "Hidden Sound" },
  { id: "q1", kind: "quote", prompt: "Who says a line closest to “I’ll never give up… that’s my ninja way!”?", options: ["Naruto Uzumaki", "Rock Lee", "Might Guy", "Kakashi Hatake"], answer: "Naruto Uzumaki" },
  { id: "q2", kind: "quote", prompt: "“Those who break the rules are scum, but those who abandon their friends are worse than scum” is associated with:", options: ["Obito Uchiha", "Kakashi Hatake", "Itachi Uchiha", "Might Guy"], answer: "Obito Uchiha" },
  { id: "q3", kind: "quote", prompt: "“Know pain… then you can understand true peace” is closest to:", options: ["Pain (Nagato)", "Madara Uchiha", "Danzo Shimura", "Orochimaru"], answer: "Pain (Nagato)" },
  { id: "q4", kind: "quote", prompt: "“I am always going to be one step ahead of you” fits which rival best?", options: ["Sasuke Uchiha", "Gaara", "Neji Hyūga", "Kabuto Yakushi"], answer: "Sasuke Uchiha" },
  { id: "q5", kind: "quote", prompt: "“A smile is the best way to get oneself out of a tight spot” is linked to:", options: ["Itachi Uchiha", "Shikamaru Nara", "Kakashi Hatake", "Jiraiya"], answer: "Itachi Uchiha" },
  { id: "q6", kind: "quote", prompt: "“Youth” and passionate taijutsu pep talks are the trademark of:", options: ["Might Guy", "Asuma Sarutobi", "Hiruzen Sarutobi", "Killer B"], answer: "Might Guy" },
  { id: "q7", kind: "quote", prompt: "“How troublesome” is the catchphrase vibe of:", options: ["Shikamaru Nara", "Shino Aburame", "Sai", "Choji Akimichi"], answer: "Shikamaru Nara" },
  { id: "q8", kind: "quote", prompt: "“Believe it!” / “Dattebayo!” energy belongs to:", options: ["Naruto Uzumaki", "Boruto Uzumaki", "Konohamaru Sarutobi", "Kushina Uzumaki"], answer: "Naruto Uzumaki" },
  { id: "q9", kind: "quote", prompt: "“When a man learns to love, he must bear the risk of hatred” is associated with:", options: ["Madara Uchiha", "Itachi Uchiha", "Obito Uchiha", "Hashirama Senju"], answer: "Madara Uchiha" },
  { id: "q10", kind: "quote", prompt: "Sage-like “training on Mount Myōboku” pep talk energy is closest to:", options: ["Jiraiya", "Fukasaku alone", "Hiruzen Sarutobi", "Orochimaru"], answer: "Jiraiya" },
]

export function getNarutoQuizByKind(kind: NarutoQuizKind): NarutoQuizQuestion[] {
  return NARUTO_QUIZ_QUESTIONS.filter((item) => item.kind === kind)
}
