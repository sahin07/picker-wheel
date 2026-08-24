export type NarutoCategory =
  | "main"
  | "villain"
  | "akatsuki"
  | "hokage"
  | "uchiha"
  | "jinchuriki"
  | "kage"
  | "sensei"
  | "shinobi"
  | "village"
  | "clan"
  | "jutsu"
  | "challenge"
  | "nature"
  | "rank"
  | "summon"
  | "kekkei"

export type NarutoEra = "part1" | "shippuden" | "boruto"

export type NarutoEntry = {
  id: string
  name: string
  emoji: string
  preview?: string
  category: NarutoCategory[]
  era?: NarutoEra[]
  village?: string
  clan?: string
  rank?: string
  natures?: string[]
  kekkeiGenkai?: string
  summon?: string
  signatureJutsu?: string[]
  blurb?: string
  custom?: boolean
  imageUrl?: string
}

export type DisplayMode = "emoji-name" | "emoji" | "name"
export type ActionMode = "normal" | "elimination" | "manual"

export type SpinResult = {
  character: NarutoEntry
  timestamp: Date
}

export type NarutoFunMode =
  | "spin"
  | "who-are-you"
  | "build-ninja"
  | "team"
  | "fight"
  | "challenge"
