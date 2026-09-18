/**
 * Generates word-picker pack + spoke expansion for missing URLs from the pillar spec.
 * Run: node scripts/expand-word-picker-spokes.js
 */
const fs = require("fs")
const path = require("path")

const LETTERS = "abcdefghijklmnopqrstuvwxyz".split("")

/** Shared packs: id -> { category, words, accent, label, description, elimination?, defaultMode? } */
const PACKS = {
  easy: {
    category: "categories",
    accent: "sky",
    label: "Easy Words",
    description: "Simple everyday words for beginners.",
    words: ["Happy", "House", "Water", "Green", "Sleep", "Music", "Table", "Smile", "River", "Paper", "Light", "Story"],
  },
  random: {
    category: "categories",
    accent: "violet",
    label: "Random Words",
    description: "A mixed random word pack for any challenge.",
    words: ["Orbit", "Quilt", "Lantern", "Canyon", "Velvet", "Spark", "Harbor", "Mirror", "Nectar", "Bridge", "Flame", "Echo"],
  },
  weird: {
    category: "categories",
    accent: "violet",
    label: "Weird Words",
    description: "Unusual and quirky words for creative prompts.",
    words: ["Liminal", "Absquatulate", "Petrichor", "Susurrus", "Kerfuffle", "Flummox", "Bumfuzzle", "Cattywampus", "Lollygag", "Brouhaha", "Gobsmacked", "Whimsy"],
  },
  difficult: {
    category: "difficulty",
    accent: "rose",
    label: "Difficult Words",
    description: "Harder vocabulary for stretch challenges.",
    words: ["Ephemeral", "Meticulous", "Ambiguous", "Pragmatic", "Formidable", "Obsolete", "Intrinsic", "Nuanced", "Ubiquitous", "Serendipity", "Eloquent", "Resilient"],
  },
  short: {
    category: "categories",
    accent: "teal",
    label: "Short Words",
    description: "Short words for quick spins and kids.",
    words: ["Go", "Sun", "Cat", "Run", "Sky", "Box", "Map", "Joy", "Key", "Ice", "Owl", "Cup"],
  },
  positive: {
    category: "categories",
    accent: "emerald",
    label: "Positive Words",
    description: "Uplifting words for writing and class.",
    words: ["Kind", "Brave", "Hope", "Joy", "Peace", "Trust", "Grace", "Calm", "Proud", "Bright", "Gentle", "Thankful"],
  },
  negative: {
    category: "categories",
    accent: "rose",
    label: "Negative Words",
    description: "Conflict and tension words for stories (classroom-safe).",
    words: ["Fear", "Anger", "Doubt", "Storm", "Loss", "Rival", "Shadow", "Trouble", "Worry", "Cold", "Empty", "Risk"],
  },
  descriptive: {
    category: "categories",
    accent: "amber",
    label: "Descriptive Words",
    description: "Describing words for richer writing.",
    words: ["Silent", "Golden", "Ancient", "Swift", "Foggy", "Shiny", "Rugged", "Delicate", "Vivid", "Hollow", "Stormy", "Soft"],
  },
  opposite: {
    category: "categories",
    accent: "sky",
    label: "Opposite Words",
    description: "Antonym pairs and contrast words.",
    words: ["Hot", "Cold", "Up", "Down", "Day", "Night", "Big", "Small", "Fast", "Slow", "Happy", "Sad"],
  },
  rhyming: {
    category: "categories",
    accent: "violet",
    label: "Rhyming Words",
    description: "Rhyming sets for poetry and phonics.",
    words: ["Cat", "Hat", "Bat", "Light", "Night", "Bright", "Sing", "Ring", "Wing", "Blue", "True", "Glue"],
  },
  compound: {
    category: "categories",
    accent: "teal",
    label: "Compound Words",
    description: "Compound words for vocabulary practice.",
    words: ["Sunshine", "Rainbow", "Notebook", "Football", "Moonlight", "Butterfly", "Cupcake", "Spaceship", "Firefly", "Backpack", "Snowman", "Doorbell"],
  },
  adverb: {
    category: "word-type",
    accent: "amber",
    label: "Adverbs",
    description: "Adverbs for grammar and writing.",
    words: ["Quickly", "Softly", "Boldly", "Quietly", "Suddenly", "Carefully", "Happily", "Slowly", "Eagerly", "Gently", "Loudly", "Brave"],
  },
  feeling: {
    category: "word-type",
    accent: "rose",
    label: "Feeling Words",
    description: "Feeling and emotion words for acting and writing.",
    words: ["Joy", "Fear", "Pride", "Shame", "Hope", "Anger", "Calm", "Worry", "Love", "Surprise", "Relief", "Envy"],
  },
  emotion: {
    category: "word-type",
    accent: "violet",
    label: "Emotion Words",
    description: "Emotion vocabulary for drama and ESL.",
    words: ["Excited", "Nervous", "Grateful", "Lonely", "Curious", "Frustrated", "Peaceful", "Ashamed", "Confident", "Jealous", "Inspired", "Bored"],
  },
  object: {
    category: "word-type",
    accent: "sky",
    label: "Object Words",
    description: "Everyday objects for drawing and games.",
    words: ["Lamp", "Chair", "Clock", "Bottle", "Pencil", "Mirror", "Key", "Basket", "Phone", "Umbrella", "Wallet", "Candle"],
  },
  place: {
    category: "word-type",
    accent: "emerald",
    label: "Place Words",
    description: "Places and settings for stories.",
    words: ["Library", "Beach", "Castle", "Market", "Forest", "Station", "Museum", "Harbor", "Desert", "School", "Kitchen", "Bridge"],
  },
  person: {
    category: "word-type",
    accent: "amber",
    label: "Person Words",
    description: "People and roles for character prompts.",
    words: ["Teacher", "Doctor", "Pirate", "Chef", "Pilot", "Artist", "Detective", "Farmer", "Athlete", "Musician", "Explorer", "Neighbor"],
  },
  nature: {
    category: "word-type",
    accent: "teal",
    label: "Nature Words",
    description: "Nature words for writing and drawing.",
    words: ["River", "Mountain", "Leaf", "Cloud", "Stone", "Thunder", "Meadow", "Ocean", "Valley", "Bloom", "Wind", "Horizon"],
  },
  fantasy: {
    category: "special",
    accent: "violet",
    label: "Fantasy Words",
    description: "Fantasy prompts for stories and art.",
    words: ["Dragon", "Wizard", "Potion", "Castle", "Quest", "Elf", "Spell", "Portal", "Crown", "Phoenix", "Rune", "Kingdom"],
  },
  intermediate: {
    category: "difficulty",
    accent: "sky",
    label: "Intermediate Words",
    description: "Mid-level vocabulary for practice.",
    words: ["Achieve", "Balance", "Curious", "Debate", "Effort", "Flexible", "Gather", "Honest", "Invent", "Journey", "Knowledge", "Listen"],
  },
  challenging: {
    category: "difficulty",
    accent: "rose",
    label: "Challenging Words",
    description: "Challenging words for advanced learners.",
    words: ["Analyze", "Consequence", "Hypothesis", "Perspective", "Significant", "Collaborate", "Evaluate", "Interpret", "Strategy", "Evidence", "Complex", "Accurate"],
  },
  rare: {
    category: "difficulty",
    accent: "violet",
    label: "Rare Words",
    description: "Rare and uncommon English words.",
    words: ["Epiphany", "Quixotic", "Labyrinth", "Nebulous", "Pinnacle", "Relic", "Zenith", "Aura", "Cipher", "Mirage", "Oracle", "Saga"],
  },
  unusual: {
    category: "difficulty",
    accent: "amber",
    label: "Unusual Words",
    description: "Unusual words for creative challenges.",
    words: ["Gossamer", "Murmur", "Flicker", "Cobalt", "Thicket", "Driftwood", "Amber", "Whisper", "Cascade", "Ember", "Hollow", "Glimmer"],
  },
  obscure: {
    category: "difficulty",
    accent: "rose",
    label: "Obscure Words",
    description: "Obscure vocabulary stretch words.",
    words: ["Susurration", "Luminescence", "Petrichor", "Ineffable", "Ephemeral", "Sonorous", "Vestige", "Axiom", "Halcyon", "Liminal", "Ethereal", "Quintessence"],
  },
  character: {
    category: "writing",
    accent: "amber",
    label: "Character Words",
    description: "Character seeds for fiction writing.",
    words: ["Orphan", "Captain", "Rival", "Mentor", "Stranger", "Rebel", "Scholar", "Guardian", "Trickster", "Hero", "Villain", "Witness"],
  },
  setting: {
    category: "writing",
    accent: "emerald",
    label: "Setting Words",
    description: "Setting prompts for stories.",
    words: ["Lighthouse", "Underground", "Festival", "Abandoned", "Spaceship", "Village", "Lab", "Palace", "Island", "Train", "Cave", "Rooftop"],
  },
  plot: {
    category: "writing",
    accent: "rose",
    label: "Plot Words",
    description: "Plot twist and conflict words.",
    words: ["Betrayal", "Discovery", "Escape", "Secret", "Race", "Rescue", "Mistake", "Promise", "Storm", "Map", "Letter", "Deadline"],
  },
  songwriting: {
    category: "writing",
    accent: "violet",
    label: "Songwriting Words",
    description: "Lyrical words for songwriting prompts.",
    words: ["Heartbeat", "Midnight", "Highway", "Rain", "Fire", "Memory", "Silence", "Dance", "Broken", "Forever", "Echo", "Dream"],
  },
  brainstorm: {
    category: "writing",
    accent: "sky",
    label: "Brainstorm Words",
    description: "Brainstorming seeds for ideas and topics.",
    words: ["Change", "Community", "Future", "Habit", "Invention", "Nature", "Technology", "Friendship", "Travel", "Health", "Learning", "Creativity"],
  },
  reading: {
    category: "classroom",
    accent: "teal",
    label: "Reading Words",
    description: "Reading practice words for class.",
    words: ["Chapter", "Author", "Predict", "Summary", "Character", "Setting", "Main", "Detail", "Genre", "Fiction", "Fact", "Theme"],
  },
  homework: {
    category: "classroom",
    accent: "amber",
    label: "Homework Words",
    description: "Homework and study prompt words.",
    words: ["Review", "Practice", "Project", "Essay", "Quiz", "Notes", "Research", "Draft", "Edit", "Present", "Study", "Finish"],
  },
  taboo: {
    category: "games",
    accent: "rose",
    label: "Taboo Words",
    description: "Taboo-style prompt words for party games.",
    words: ["Airplane", "Birthday", "Computer", "Elephant", "Guitar", "Hospital", "Library", "Mountain", "Pizza", "Rainbow", "Soccer", "Vacation"],
  },
  association: {
    category: "games",
    accent: "violet",
    label: "Word Association",
    description: "Association game starter words.",
    words: ["Ocean", "Clock", "Fire", "Book", "Road", "Music", "Cloud", "Door", "Green", "Laugh", "Winter", "City"],
  },
  chain: {
    category: "games",
    accent: "emerald",
    label: "Word Chain",
    description: "Words for last-letter chain games.",
    words: ["Apple", "Elephant", "Tiger", "Rabbit", "Train", "Night", "Table", "Energy", "Yellow", "Water", "Rocket", "Tree"],
  },
  battle: {
    category: "games",
    accent: "amber",
    label: "Word Battle",
    description: "Competitive word challenge prompts.",
    words: ["Victory", "Challenge", "Duel", "Score", "Team", "Speed", "Strategy", "Bonus", "Combo", "Streak", "Final", "Champion"],
  },
  doodle: {
    category: "drawing",
    accent: "sky",
    label: "Doodle Words",
    description: "Simple doodle prompts.",
    words: ["Smile", "Star", "Fish", "House", "Tree", "Car", "Sun", "Heart", "Cat", "Cloud", "Boat", "Flower"],
  },
  inktober: {
    category: "drawing",
    accent: "violet",
    label: "Inktober Words",
    description: "Inktober-style drawing prompt words.",
    words: ["Mustache", "Scurry", "Spicy", "Stuck", "Build", "Husky", "Enchanted", "Spider", "Sling", "Pattern", "Snow", "Ride"],
  },
  debate: {
    category: "speaking",
    accent: "rose",
    label: "Debate Topics",
    description: "Debate topic words for speaking practice.",
    words: ["Homework", "Uniforms", "Technology", "Sports", "Environment", "Social media", "School", "Animals", "Travel", "Food", "Music", "Space"],
  },
  conversation: {
    category: "speaking",
    accent: "teal",
    label: "Conversation Words",
    description: "Conversation starters for ESL and parties.",
    words: ["Weekend", "Hobby", "Favorite", "Travel", "Food", "Movie", "Family", "Music", "Goal", "Memory", "Friend", "Season"],
  },
  kidsColor: {
    category: "kids",
    accent: "sky",
    label: "Color Words",
    description: "Color words for kids.",
    words: ["Red", "Blue", "Green", "Yellow", "Orange", "Purple", "Pink", "Black", "White", "Brown", "Gray", "Gold"],
  },
  kidsSchool: {
    category: "kids",
    accent: "amber",
    label: "School Words",
    description: "School words for kids.",
    words: ["Teacher", "Pencil", "Book", "Desk", "Friend", "Recess", "Lunch", "Bus", "Homework", "Art", "Music", "Play"],
  },
  movie: {
    category: "special",
    accent: "violet",
    label: "Movie Words",
    description: "Movie-themed word prompts.",
    words: ["Hero", "Villain", "Scene", "Script", "Camera", "Ticket", "Premiere", "Sequel", "Costume", "Director", "Trailer", "Audience"],
  },
  sports: {
    category: "special",
    accent: "emerald",
    label: "Sports Words",
    description: "Sports words for games and writing.",
    words: ["Goal", "Team", "Coach", "Race", "Score", "Trophy", "Stadium", "Pass", "Kick", "Swim", "Jump", "Champion"],
  },
  travel: {
    category: "special",
    accent: "sky",
    label: "Travel Words",
    description: "Travel words for prompts and geography fun.",
    words: ["Passport", "Airport", "Hotel", "Map", "Train", "Beach", "Backpack", "Ticket", "City", "Mountain", "Island", "Adventure"],
  },
  school: {
    category: "special",
    accent: "amber",
    label: "School Theme Words",
    description: "School-themed vocabulary.",
    words: ["Classroom", "Principal", "Locker", "Cafeteria", "Library", "Assembly", "Homework", "Grade", "Science", "History", "Gym", "Bell"],
  },
  christmas: {
    category: "special",
    accent: "emerald",
    label: "Christmas Words",
    description: "Christmas seasonal words.",
    words: ["Tree", "Gift", "Snow", "Santa", "Cookie", "Stocking", "Carol", "Lights", "Sleigh", "Star", "Family", "Joy"],
  },
  thanksgiving: {
    category: "special",
    accent: "amber",
    label: "Thanksgiving Words",
    description: "Thanksgiving seasonal words.",
    words: ["Turkey", "Gratitude", "Family", "Feast", "Pie", "Harvest", "Autumn", "Thankful", "Parade", "Corn", "Home", "Share"],
  },
  valentine: {
    category: "special",
    accent: "rose",
    label: "Valentine Words",
    description: "Valentine's Day words.",
    words: ["Heart", "Card", "Love", "Friend", "Rose", "Candy", "Kindness", "Hug", "Smile", "Letter", "Pink", "Care"],
  },
  summer: {
    category: "special",
    accent: "sky",
    label: "Summer Words",
    description: "Summer seasonal words.",
    words: ["Beach", "Sunshine", "Icecream", "Swim", "Vacation", "Picnic", "Sand", "Heat", "Camp", "Lemonade", "Bike", "Wave"],
  },
  winter: {
    category: "special",
    accent: "teal",
    label: "Winter Words",
    description: "Winter seasonal words.",
    words: ["Snow", "Ice", "Coat", "Fireplace", "Sled", "Freeze", "Boots", "Cocoa", "Storm", "Skate", "Frost", "Blanket"],
  },
  science: {
    category: "special",
    accent: "sky",
    label: "Science Words",
    description: "Science vocabulary prompts.",
    words: ["Atom", "Experiment", "Gravity", "Energy", "Molecule", "Lab", "Force", "Planet", "Cell", "Magnet", "Hypothesis", "Data"],
  },
  space: {
    category: "special",
    accent: "violet",
    label: "Space Words",
    description: "Space-themed words.",
    words: ["Rocket", "Planet", "Galaxy", "Astronaut", "Orbit", "Comet", "Moon", "Star", "Alien", "Satellite", "Nebula", "Launch"],
  },
  ocean: {
    category: "special",
    accent: "teal",
    label: "Ocean Words",
    description: "Ocean and sea words.",
    words: ["Wave", "Coral", "Shark", "Tide", "Shell", "Dolphin", "Ship", "Island", "Whale", "Current", "Beach", "Pearl"],
  },
  dinosaur: {
    category: "special",
    accent: "emerald",
    label: "Dinosaur Words",
    description: "Dinosaur words for kids and games.",
    words: ["T-Rex", "Fossil", "Raptor", "Herbivore", "Extinct", "Triceratops", "Bone", "Jurassic", "Claw", "Egg", "Roar", "Museum"],
  },
  pokemonWords: {
    category: "special",
    accent: "amber",
    label: "Pokémon Words",
    description: "Pokémon-themed word prompts (fan-safe).",
    words: ["Pikachu", "Pokéball", "Trainer", "Gym", "Battle", "Evolve", "Ash", "Catch", "Type", "Badge", "Adventure", "Team"],
  },
  minecraft: {
    category: "special",
    accent: "emerald",
    label: "Minecraft Words",
    description: "Minecraft-themed word prompts.",
    words: ["Creeper", "Diamond", "Craft", "Mine", "Block", "Village", "Nether", "Sword", "Portal", "Farm", "Biome", "Redstone"],
  },
  fortniteWords: {
    category: "special",
    accent: "violet",
    label: "Fortnite Words",
    description: "Fortnite-themed word prompts.",
    words: ["Victory", "Drop", "Build", "Shield", "Loot", "Storm", "Emote", "Squad", "Loadout", "Zone", "Glider", "Challenge"],
  },
}

/** Letter starter words (short lists per letter) */
const LETTER_WORDS = {
  a: ["Apple", "Anchor", "Artist", "Autumn", "Arrow", "Atlas", "Amber", "Astronaut", "Avenue", "Avalanche", "Axiom", "Azure"],
  b: ["Bridge", "Balloon", "Beacon", "Berry", "Brave", "Basket", "Butter", "Breeze", "Badge", "Bloom", "Book", "Boat"],
  c: ["Castle", "Cloud", "Comet", "Candle", "Canyon", "Cipher", "Coral", "Crown", "Camera", "Cookie", "Circle", "Creek"],
  d: ["Dragon", "Dream", "Desert", "Diamond", "Door", "Dance", "Dolphin", "Dawn", "Draft", "Drift", "Drum", "Doodle"],
  e: ["Echo", "Eagle", "Ember", "Engine", "Earth", "Energy", "Explore", "Envelope", "Eclipse", "Edge", "Elbow", "Event"],
  f: ["Forest", "Flame", "Falcon", "Friend", "Fountain", "Feather", "Frost", "Festival", "Frame", "Fox", "Fence", "Future"],
  g: ["Garden", "Galaxy", "Guitar", "Glow", "Giant", "Glacier", "Gold", "Gateway", "Gift", "Grain", "Groove", "Guard"],
  h: ["Harbor", "Horizon", "Heart", "Hammer", "Honey", "Helmet", "Hill", "Hunter", "Harvest", "Hive", "Hero", "House"],
  i: ["Island", "Ice", "Idea", "Iron", "Image", "Ink", "Ivory", "Igloo", "Impact", "Iris", "Item", "Invite"],
  j: ["Journey", "Jewel", "Jungle", "Jacket", "Jazz", "Jelly", "Judge", "Jump", "Journal", "Joy", "Juice", "Joker"],
  k: ["Key", "Knight", "Kite", "Kingdom", "Kitchen", "Koala", "Kernel", "Keeper", "Knot", "Knowledge", "Kick", "Kettle"],
  l: ["Lantern", "Library", "Light", "Leaf", "Ladder", "Lion", "Letter", "Lake", "Legend", "Lock", "Lunar", "Lighthouse"],
  m: ["Mountain", "Mirror", "Moon", "Map", "Market", "Music", "Magic", "Meadow", "Magnet", "Memory", "Mask", "Meteor"],
  n: ["Night", "Nature", "Notebook", "Nest", "North", "Nebula", "Needle", "Novel", "Nectar", "Number", "Nurse", "Noodle"],
  o: ["Ocean", "Orbit", "Owl", "Orange", "Oasis", "Object", "Opera", "Oxygen", "Onion", "Orchard", "Outfit", "Oven"],
  p: ["Planet", "Puzzle", "Potion", "Pirate", "Pencil", "Portal", "Penguin", "Promise", "Palace", "Pearl", "Pilot", "Picnic"],
  q: ["Quest", "Quilt", "Quiet", "Queen", "Question", "Quill", "Quartz", "Quack", "Quick", "Quote", "Quiver", "Quiz"],
  r: ["River", "Rocket", "Rainbow", "Robot", "Road", "Rose", "Rhythm", "Rescue", "Realm", "Ribbon", "Root", "Riddle"],
  s: ["Secret", "Shadow", "Star", "Storm", "Ship", "School", "Spark", "Stone", "Story", "Sun", "Sword", "Signal"],
  t: ["Treasure", "Train", "Thunder", "Tiger", "Tower", "Travel", "Ticket", "Tree", "Truth", "Telescope", "Team", "Tide"],
  u: ["Umbrella", "Universe", "Underground", "Unique", "Unit", "Urban", "Unfold", "Uplift", "Urgent", "User", "Ultra", "Utensil"],
  v: ["Valley", "Velvet", "Village", "Voyage", "Volcano", "Victory", "Vision", "Violet", "Vault", "Voice", "Virus", "Vessel"],
  w: ["Whisper", "Window", "Wizard", "Water", "Winter", "Wheel", "Wonder", "Wave", "World", "Wolf", "Writer", "Wish"],
  x: ["Xylophone", "X-ray", "Xbox", "Xenon", "Xerox", "Xmas", "Xenial", "Xeric", "Xylitol", "Xenolith", "Xyst", "Xebec"],
  y: ["Yellow", "Yacht", "Year", "Yogurt", "Youth", "Yarn", "Yawn", "Yard", "Yonder", "Yolk", "Yoga", "Yell"],
  z: ["Zebra", "Zenith", "Zone", "Zipper", "Zoo", "Zigzag", "Zero", "Zephyr", "Zest", "Zinc", "Zodiac", "Zoom"],
}

const LENGTH_WORDS = {
  2: ["Go", "Up", "Me", "We", "To", "In", "On", "At", "By", "Or", "If", "So"],
  4: ["Moon", "Tree", "Book", "Fire", "Star", "Wave", "Door", "Rain", "Bird", "Gold", "Wind", "Path"],
  6: ["Forest", "Planet", "Bridge", "Castle", "Mirror", "Rocket", "Garden", "Shadow", "Friend", "Window", "Puzzle", "Summer"],
  7: ["Journey", "Rainbow", "Village", "Thunder", "Freedom", "Diamond", "Horizon", "Silence", "Mystery", "Captain", "Lantern", "Fantasy"],
  8: ["Adventure", "Mountain", "Treasure", "Elephant", "Sunshine", "Calendar", "Sandwich", "Hospital", "Building", "Football", "Birthday", "Computer"],
  9: ["Adventure", "Celebrate", "Important", "Beautiful", "Challenge", "Discovery", "Wonderful", "Education", "Character", "Different", "Something", "Yesterday"],
  10: ["Imagination", "Friendship", "Adventurey".slice(0,10) || "Friendship", "Celebration".slice(0,10), "Understand", "Technology", "Basketball", "Strawberry", "Revolution", "Literature", "Experiment", "Atmosphere"],
}

// Fix 10-letter words properly
LENGTH_WORDS[10] = ["Friendship", "Basketball", "Strawberry", "Technology", "Literature", "Experiment", "Atmosphere", "Revolution", "Understand", "Management", "Government", "Particular"]

/** Spoke defs: [id, path, packId, category, h1, pageTitle, shortTitle, description, heroIntro, keywords, popular?] */
function seo(h1, short, desc, keywords) {
  return {
    h1,
    shortTitle: short,
    pageTitle: `${h1} | Free Random Word Spinner`,
    description: desc,
    heroIntro: desc,
    keywords,
  }
}

const SPOKES = []

function add(id, pathName, packId, category, meta, opts = {}) {
  SPOKES.push({ id, path: pathName, packId, category, ...meta, ...opts })
}

// --- Categories ---
add("easy-words", "/easy-words-wheel", "easy", "categories", seo("Easy Words Wheel", "Easy Words", "Spin easy everyday words for beginners and kids.", ["easy words wheel", "easy random words"]))
add("random-words", "/random-words-wheel", "random", "categories", seo("Random Words Wheel", "Random Words", "Spin a mixed pack of random words for any challenge.", ["random words wheel", "random word pack"]))
add("weird-words", "/weird-words-wheel", "weird", "categories", seo("Weird Words Wheel", "Weird Words", "Spin weird and quirky words for creative prompts.", ["weird words wheel", "unusual word spinner"]))
add("difficult-words", "/difficult-words-wheel", "difficult", "difficulty", seo("Difficult Words Wheel", "Difficult Words", "Spin difficult vocabulary for stretch practice.", ["difficult words wheel", "hard vocabulary spinner"]))
add("short-words", "/short-words-wheel", "short", "categories", seo("Short Words Wheel", "Short Words", "Spin short words for quick rounds.", ["short words wheel", "short word generator"]))
add("positive-words", "/positive-words-wheel", "positive", "categories", seo("Positive Words Wheel", "Positive Words", "Spin positive uplifting words.", ["positive words wheel", "positive word generator"]))
add("negative-words", "/negative-words-wheel", "negative", "categories", seo("Negative Words Wheel", "Negative Words", "Spin tension words for stories (classroom-safe).", ["negative words wheel", "conflict word spinner"]))
add("descriptive-words", "/descriptive-words-wheel", "descriptive", "categories", seo("Descriptive Words Wheel", "Descriptive Words", "Spin describing words for writing.", ["descriptive words wheel", "describing words spinner"]))
add("opposite-words", "/opposite-words-wheel", "opposite", "categories", seo("Opposite Words Wheel", "Opposite Words", "Spin opposite and contrast words.", ["opposite words wheel", "antonym word spinner"]))
add("rhyming-words", "/rhyming-words-wheel", "rhyming", "categories", seo("Rhyming Words Wheel", "Rhyming Words", "Spin rhyming words for poetry and phonics.", ["rhyming words wheel", "rhyme word generator"]))
add("compound-words", "/compound-words-wheel", "compound", "categories", seo("Compound Words Wheel", "Compound Words", "Spin compound words for vocabulary practice.", ["compound words wheel", "compound word generator"]))
add("sight-words-alt", "/sight-words-wheel", "sight", "classroom", seo("Sight Words Wheel", "Sight Words", "Spin high-frequency sight words for early readers.", ["sight words wheel", "sight word generator"]), { reuseExisting: "sight" })
add("vocabulary-words-alt", "/vocabulary-words-wheel", "vocab", "classroom", seo("Vocabulary Words Wheel", "Vocabulary Words", "Spin vocabulary words for study and ESL.", ["vocabulary words wheel"]), { reuseExisting: "vocab" })
add("action-words-alt", "/action-words-wheel", "action", "word-type", seo("Action Words Wheel", "Action Words", "Spin action verbs for games and writing.", ["action words wheel"]), { reuseExisting: "action" })
add("adverb-words", "/adverb-word-wheel", "adverb", "word-type", seo("Adverb Word Wheel", "Adverbs", "Spin random adverbs for grammar and writing.", ["adverb word wheel", "random adverb generator"]))

// Writing
add("random-story-words", "/random-story-words-wheel", "story", "writing", seo("Random Story Words Wheel", "Story Words", "Spin random story words for fiction prompts.", ["random story words"]), { reuseExisting: "story" })
add("character-picker", "/character-word-picker", "character", "writing", seo("Character Word Picker", "Characters", "Spin character seeds for stories.", ["character word picker"]))
add("setting-picker", "/setting-word-picker", "setting", "writing", seo("Setting Word Picker", "Settings", "Spin setting prompts for fiction.", ["setting word picker"]))
add("plot-generator", "/plot-word-generator", "plot", "writing", seo("Plot Word Generator", "Plot Words", "Spin plot and conflict words for stories.", ["plot word generator"]))
add("story-starter", "/story-starter-word-wheel", "story", "writing", seo("Story Starter Word Wheel", "Story Starter", "Spin story starter words.", ["story starter wheel"]), { reuseExisting: "story", defaultMode: "story" })
add("creative-writing", "/creative-writing-word-wheel", "writing", "writing", seo("Creative Writing Word Wheel", "Creative Writing", "Spin words for creative writing challenges.", ["creative writing word wheel"]), { reuseExisting: "writing" })
add("fiction-writing", "/fiction-writing-word-wheel", "story", "writing", seo("Fiction Writing Word Wheel", "Fiction Writing", "Spin fiction writing prompt words.", ["fiction writing word wheel"]), { reuseExisting: "story" })
add("writing-challenge", "/random-writing-challenge-wheel", "writing", "writing", seo("Random Writing Challenge Wheel", "Writing Challenge", "Spin a writing challenge word.", ["writing challenge wheel"]), { reuseExisting: "writing" })
add("poetry-challenge", "/poetry-challenge-word-wheel", "poetry", "writing", seo("Poetry Challenge Word Wheel", "Poetry Challenge", "Spin poetry challenge words.", ["poetry challenge wheel"]), { reuseExisting: "poetry" })
add("songwriting", "/songwriting-word-generator", "songwriting", "writing", seo("Songwriting Word Generator", "Songwriting", "Spin lyrical words for songs.", ["songwriting word generator"]))
add("theme-word", "/random-theme-word-wheel", "brainstorm", "writing", seo("Random Theme Word Wheel", "Theme Words", "Spin theme words for writing and parties.", ["random theme word wheel"]))
add("topic-word", "/random-topic-word-wheel", "brainstorm", "writing", seo("Random Topic Word Wheel", "Topic Words", "Spin topic words for essays and talks.", ["random topic word wheel"]))
add("brainstorming", "/brainstorming-word-wheel", "brainstorm", "writing", seo("Brainstorming Word Wheel", "Brainstorming", "Spin brainstorming seed words.", ["brainstorming word wheel"]))
add("for-stories", "/random-word-generator-for-stories", "story", "writing", seo("Random Word Generator for Stories", "For Stories", "Story-focused random word generator.", ["random word generator for stories"]), { reuseExisting: "story" })
add("writing-prompt-gen", "/random-writing-prompt-generator", "writing", "writing", seo("Random Writing Prompt Generator", "Writing Prompts", "Generate random writing prompt words.", ["random writing prompt generator"]), { reuseExisting: "writing" })
add("story-word-gen", "/random-story-word-generator", "story", "writing", seo("Random Story Word Generator", "Story Generator", "Generate random story words.", ["random story word generator"]), { reuseExisting: "story" })

// Classroom
add("random-vocab", "/random-vocabulary-word-wheel", "vocab", "classroom", seo("Random Vocabulary Word Wheel", "Random Vocab", "Spin a random vocabulary word.", ["random vocabulary word"]), { reuseExisting: "vocab" })
add("reading-picker", "/reading-word-picker", "reading", "classroom", seo("Reading Word Picker", "Reading Words", "Spin reading practice words.", ["reading word picker"]))
add("classroom-writing", "/classroom-writing-word-picker", "writing", "classroom", seo("Classroom Writing Word Picker", "Class Writing", "Writing words for classroom activities.", ["classroom writing word picker"]), { reuseExisting: "writing" })
add("student-vocab", "/student-vocabulary-word-wheel", "vocab", "classroom", seo("Student Vocabulary Word Wheel", "Student Vocab", "Student vocabulary practice spinner.", ["student vocabulary wheel"]), { reuseExisting: "vocab" })
add("word-of-day", "/word-of-the-day-wheel", "vocab", "classroom", seo("Word of the Day Wheel", "Word of the Day", "Spin a word-of-the-day style vocabulary pick.", ["word of the day wheel"]), { reuseExisting: "vocab" })
add("english-practice", "/english-practice-word-wheel", "esl", "classroom", seo("English Practice Word Wheel", "English Practice", "English practice words for learners.", ["english practice wheel"]), { reuseExisting: "esl" })
add("language-learning", "/language-learning-word-wheel", "esl", "classroom", seo("Language Learning Word Wheel", "Language Learning", "Language learning vocabulary spinner.", ["language learning word wheel"]), { reuseExisting: "esl" })
add("discussion", "/classroom-discussion-word-wheel", "speaking", "classroom", seo("Classroom Discussion Word Wheel", "Discussion", "Discussion prompt words for class.", ["classroom discussion word"]), { reuseExisting: "speaking" })
add("classroom-topic", "/classroom-topic-word-wheel", "brainstorm", "classroom", seo("Classroom Topic Word Wheel", "Class Topics", "Topic words for classroom talks.", ["classroom topic word"]))
add("homework", "/homework-word-picker", "homework", "classroom", seo("Homework Word Picker", "Homework", "Homework and study prompt words.", ["homework word picker"]))
add("for-teachers", "/random-word-generator-for-teachers", "classroom", "classroom", seo("Random Word Generator for Teachers", "For Teachers", "Teacher-focused vocabulary spinner.", ["random word generator for teachers"]), { reuseExisting: "classroom" })
add("for-students", "/random-word-generator-for-students", "vocab", "classroom", seo("Random Word Generator for Students", "For Students", "Student vocabulary word generator.", ["random word generator for students"]), { reuseExisting: "vocab" })
add("for-esl", "/random-word-generator-for-esl", "esl", "classroom", seo("Random Word Generator for ESL", "For ESL", "ESL vocabulary word generator.", ["random word generator for esl"]), { reuseExisting: "esl" })
add("vocab-generator", "/random-vocabulary-word-generator", "vocab", "classroom", seo("Random Vocabulary Word Generator", "Vocab Generator", "Generate random vocabulary words.", ["random vocabulary word generator"]), { reuseExisting: "vocab" })

// Games
add("guess-word", "/guess-the-word-wheel", "challenge", "games", seo("Guess the Word Wheel", "Guess the Word", "Spin a word for guessing games.", ["guess the word wheel"]), { reuseExisting: "challenge" })
add("describe-word", "/describe-the-word-wheel", "challenge", "games", seo("Describe the Word Wheel", "Describe the Word", "Spin a word to describe without saying it.", ["describe the word wheel"]), { reuseExisting: "challenge", defaultMode: "definition" })
add("act-out-word", "/act-out-the-word-wheel", "charades", "games", seo("Act Out the Word Wheel", "Act Out the Word", "Spin a word to act out.", ["act out the word wheel"]), { reuseExisting: "charades", defaultMode: "acting" })
add("draw-the-word", "/draw-the-word-wheel", "pictionary", "games", seo("Draw the Word Wheel", "Draw the Word", "Spin a word to draw.", ["draw the word wheel"]), { reuseExisting: "pictionary", defaultMode: "drawing" })
add("taboo", "/taboo-word-generator", "taboo", "games", seo("Taboo Word Generator", "Taboo Words", "Spin taboo-style game words.", ["taboo word generator"]))
add("association", "/word-association-wheel", "association", "games", seo("Word Association Wheel", "Word Association", "Spin starters for association games.", ["word association wheel"]))
add("word-chain", "/word-chain-wheel", "chain", "games", seo("Word Chain Wheel", "Word Chain", "Spin words for chain games.", ["word chain wheel"]))
add("forbidden", "/forbidden-word-challenge-wheel", "taboo", "games", seo("Forbidden Word Challenge Wheel", "Forbidden Word", "Forbidden-word style challenge spinner.", ["forbidden word challenge"]))
add("random-challenge", "/random-word-challenge-wheel", "challenge", "games", seo("Random Word Challenge Wheel", "Random Challenge", "Random word challenge spinner.", ["random word challenge"]), { reuseExisting: "challenge" })
add("speed-challenge", "/speed-word-challenge-wheel", "challenge", "games", seo("Speed Word Challenge Wheel", "Speed Challenge", "Speed round word challenges.", ["speed word challenge"]), { reuseExisting: "challenge", defaultMode: "speed" })
add("last-letter", "/last-letter-word-challenge", "chain", "games", seo("Last Letter Word Challenge", "Last Letter", "Last-letter word chain challenge.", ["last letter word challenge"]))
add("first-letter", "/first-letter-word-challenge", "random-az", "letter", seo("First Letter Word Challenge", "First Letter", "First-letter word challenge spinner.", ["first letter word challenge"]), { reuseExisting: "random-az" })
add("word-battle", "/word-battle-wheel", "battle", "games", seo("Word Battle Wheel", "Word Battle", "Competitive word battle prompts.", ["word battle wheel"]))
add("for-games", "/random-word-generator-for-games", "challenge", "games", seo("Random Word Generator for Games", "For Games", "Game-focused random word generator.", ["random word generator for games"]), { reuseExisting: "challenge" })
add("for-pictionary", "/random-word-generator-for-pictionary", "pictionary", "games", seo("Random Word Generator for Pictionary", "For Pictionary", "Pictionary word generator.", ["random word generator for pictionary"]), { reuseExisting: "pictionary", defaultMode: "drawing" })
add("for-charades", "/random-word-generator-for-charades", "charades", "games", seo("Random Word Generator for Charades", "For Charades", "Charades word generator.", ["random word generator for charades"]), { reuseExisting: "charades", defaultMode: "acting" })

// Drawing
add("art-prompt", "/art-prompt-word-generator", "drawing", "drawing", seo("Art Prompt Word Generator", "Art Prompts", "Art prompt word generator.", ["art prompt word generator"]), { reuseExisting: "drawing", defaultMode: "drawing" })
add("sketch", "/sketch-challenge-word-wheel", "drawing", "drawing", seo("Sketch Challenge Word Wheel", "Sketch Challenge", "Sketch challenge word spinner.", ["sketch challenge wheel"]), { reuseExisting: "drawing", defaultMode: "drawing" })
add("doodle", "/doodle-word-generator", "doodle", "drawing", seo("Doodle Word Generator", "Doodles", "Simple doodle word prompts.", ["doodle word generator"]), { defaultMode: "drawing" })
add("character-drawing", "/character-drawing-word-wheel", "character", "drawing", seo("Character Drawing Word Wheel", "Character Drawing", "Character drawing prompts.", ["character drawing word wheel"]), { defaultMode: "drawing" })
add("animal-drawing", "/animal-drawing-word-wheel", "animal", "drawing", seo("Animal Drawing Word Wheel", "Animal Drawing", "Animal drawing prompts.", ["animal drawing wheel"]), { reuseExisting: "animal", defaultMode: "drawing" })
add("object-drawing", "/object-drawing-word-wheel", "object", "drawing", seo("Object Drawing Word Wheel", "Object Drawing", "Object drawing prompts.", ["object drawing wheel"]), { defaultMode: "drawing" })
add("fantasy-drawing", "/fantasy-drawing-word-wheel", "fantasy", "drawing", seo("Fantasy Drawing Word Wheel", "Fantasy Drawing", "Fantasy drawing prompts.", ["fantasy drawing prompt"]), { defaultMode: "drawing" })
add("art-challenge", "/random-art-challenge-word-wheel", "drawing", "drawing", seo("Random Art Challenge Word Wheel", "Art Challenge", "Random art challenge words.", ["random art challenge"]), { reuseExisting: "drawing", defaultMode: "drawing" })
add("inktober", "/inktober-word-wheel", "inktober", "drawing", seo("Inktober Word Wheel", "Inktober", "Inktober-style drawing prompt words.", ["inktober word wheel"]), { defaultMode: "drawing" })
add("for-drawing", "/random-word-generator-for-drawing", "drawing", "drawing", seo("Random Word Generator for Drawing", "For Drawing", "Drawing-focused word generator.", ["random word generator for drawing"]), { reuseExisting: "drawing", defaultMode: "drawing" })
add("drawing-word-gen", "/random-drawing-word-generator", "drawing", "drawing", seo("Random Drawing Word Generator", "Drawing Generator", "Generate random drawing words.", ["random drawing word generator"]), { reuseExisting: "drawing", defaultMode: "drawing" })
add("what-word-draw", "/what-word-should-i-draw", "drawing", "questions", seo("What Word Should I Draw?", "What to Draw", "Spin a word to decide what to draw.", ["what word should i draw"]), { reuseExisting: "drawing", defaultMode: "drawing" })

// Speaking
add("speaking-challenge", "/speaking-challenge-word-wheel", "speaking", "speaking", seo("Speaking Challenge Word Wheel", "Speaking Challenge", "Speaking challenge word spinner.", ["speaking challenge wheel"]), { reuseExisting: "speaking" })
add("conversation", "/conversation-word-wheel", "conversation", "speaking", seo("Conversation Word Wheel", "Conversation", "Conversation starter words.", ["conversation word wheel"]))
add("debate", "/debate-topic-word-wheel", "debate", "speaking", seo("Debate Topic Word Wheel", "Debate Topics", "Debate topic word spinner.", ["debate topic generator"]))
add("public-speaking", "/public-speaking-word-picker", "speaking", "speaking", seo("Public Speaking Word Picker", "Public Speaking", "Public speaking topic words.", ["public speaking word picker"]), { reuseExisting: "speaking" })
add("impromptu", "/impromptu-speaking-word-wheel", "speaking", "speaking", seo("Impromptu Speaking Word Wheel", "Impromptu", "Impromptu speaking prompts.", ["impromptu speaking wheel"]), { reuseExisting: "speaking" })
add("charades-gen", "/charades-word-generator", "charades", "speaking", seo("Charades Word Generator", "Charades Generator", "Generate charades words.", ["charades word generator"]), { reuseExisting: "charades", defaultMode: "acting" })
add("acting-challenge", "/acting-challenge-word-wheel", "acting", "speaking", seo("Acting Challenge Word Wheel", "Acting Challenge", "Acting challenge prompts.", ["acting challenge wheel"]), { reuseExisting: "acting", defaultMode: "acting" })
add("describe-this", "/describe-this-word-wheel", "challenge", "speaking", seo("Describe This Word Wheel", "Describe This", "Describe-this-word challenge spinner.", ["describe this word"]), { reuseExisting: "challenge", defaultMode: "definition" })
add("explain-word", "/explain-the-random-word-wheel", "vocab", "speaking", seo("Explain the Random Word Wheel", "Explain the Word", "Explain a random word challenge.", ["explain the random word"]), { reuseExisting: "vocab" })
add("sixty-second", "/60-second-speaking-challenge-wheel", "speaking", "speaking", seo("60-Second Speaking Challenge Wheel", "60-Second Challenge", "60-second speaking challenge words.", ["60 second speaking challenge"]), { reuseExisting: "speaking", defaultMode: "speed" })
add("speaking-topic-gen", "/random-speaking-topic-generator", "speaking", "speaking", seo("Random Speaking Topic Generator", "Speaking Topics", "Generate speaking topics.", ["random speaking topic generator"]), { reuseExisting: "speaking" })
add("acting-prompt-gen", "/random-acting-prompt-generator", "acting", "speaking", seo("Random Acting Prompt Generator", "Acting Prompts", "Generate acting prompts.", ["random acting prompt generator"]), { reuseExisting: "acting", defaultMode: "acting" })

// Word types extras
add("describing-word", "/describing-word-wheel", "descriptive", "word-type", seo("Describing Word Wheel", "Describing Words", "Spin describing words.", ["describing word wheel"]))
add("feeling-word", "/feeling-word-wheel", "feeling", "word-type", seo("Feeling Word Wheel", "Feeling Words", "Spin feeling words.", ["feeling word wheel"]))
add("emotion-word", "/emotion-word-wheel", "emotion", "word-type", seo("Emotion Word Wheel", "Emotion Words", "Spin emotion words.", ["emotion word wheel"]))
add("animal-type", "/animal-word-wheel", "animal", "word-type", seo("Animal Word Wheel", "Animals", "Spin animal words.", ["animal word wheel"]), { reuseExisting: "animal" })
add("food-type", "/food-word-wheel", "food", "word-type", seo("Food Word Wheel", "Food", "Spin food words.", ["food word wheel"]), { reuseExisting: "food" })
add("object-word", "/object-word-wheel", "object", "word-type", seo("Object Word Wheel", "Objects", "Spin object words.", ["object word wheel"]))
add("place-word", "/place-word-wheel", "place", "word-type", seo("Place Word Wheel", "Places", "Spin place words.", ["place word wheel"]))
add("person-word", "/person-word-wheel", "person", "word-type", seo("Person Word Wheel", "People", "Spin person/role words.", ["person word wheel"]))
add("nature-word", "/nature-word-wheel", "nature", "word-type", seo("Nature Word Wheel", "Nature", "Spin nature words.", ["nature word wheel"]))
add("fantasy-word", "/fantasy-word-wheel", "fantasy", "word-type", seo("Fantasy Word Wheel", "Fantasy", "Spin fantasy words.", ["fantasy word wheel"]))

// Difficulty extras
add("intermediate", "/intermediate-words-wheel", "intermediate", "difficulty", seo("Intermediate Words Wheel", "Intermediate", "Intermediate vocabulary spinner.", ["intermediate words wheel"]))
add("challenging", "/challenging-words-wheel", "challenging", "difficulty", seo("Challenging Words Wheel", "Challenging", "Challenging vocabulary spinner.", ["challenging words wheel"]))
add("rare", "/rare-words-wheel", "rare", "difficulty", seo("Rare Words Wheel", "Rare Words", "Rare word vocabulary spinner.", ["rare words wheel"]))
add("unusual", "/unusual-words-wheel", "unusual", "difficulty", seo("Unusual Words Wheel", "Unusual Words", "Unusual word spinner.", ["unusual words wheel"]))
add("obscure", "/obscure-words-wheel", "obscure", "difficulty", seo("Obscure Words Wheel", "Obscure Words", "Obscure vocabulary spinner.", ["obscure words wheel"]))

// Letter B–Z (A and random-az exist)
for (const letter of LETTERS) {
  if (letter === "a") continue
  const L = letter.toUpperCase()
  add(
    `words-${letter}`,
    `/words-starting-with-${letter}`,
    `letter-${letter}`,
    "letter",
    seo(`Words Starting With ${L}`, `Words With ${L}`, `Spin random words that start with ${L}.`, [`words starting with ${letter}`, `letter ${letter} word wheel`]),
  )
}
add("random-by-letter", "/random-word-by-letter", "random-az", "letter", seo("Random Word by Letter", "Word by Letter", "Spin a random word from an A–Z mix.", ["random word by letter"]), { reuseExisting: "random-az" })
add("ending-letter", "/word-ending-letter-picker", "random-az", "letter", seo("Word Ending Letter Picker", "Ending Letter", "Practice words with attention to ending letters.", ["word ending letter picker"]), { reuseExisting: "random-az" })
add("long-word-gen", "/long-word-generator", "long", "length", seo("Long Word Generator", "Long Word Generator", "Generate long words for challenges.", ["long word generator"]), { reuseExisting: "long" })
add("words-3-letters", "/words-with-3-letters", "three-letter", "length", seo("Words With 3 Letters", "3 Letters", "Three-letter word spinner.", ["words with 3 letters"]), { reuseExisting: "three-letter" })
add("4-letter", "/4-letter-words-wheel", "len-4", "length", seo("4-Letter Words Wheel", "4-Letter Words", "Spin four-letter words.", ["4 letter words wheel"]))
add("6-letter", "/6-letter-words-wheel", "len-6", "length", seo("6-Letter Words Wheel", "6-Letter Words", "Spin six-letter words.", ["6 letter words wheel"]))

// Length full set
add("2-letter", "/2-letter-words-wheel", "len-2", "length", seo("2-Letter Words Wheel", "2-Letter Words", "Spin two-letter words.", ["2 letter words wheel"]))
add("7-letter", "/7-letter-words-wheel", "len-7", "length", seo("7-Letter Words Wheel", "7-Letter Words", "Spin seven-letter words.", ["7 letter words wheel"]))
add("8-letter", "/8-letter-words-wheel", "len-8", "length", seo("8-Letter Words Wheel", "8-Letter Words", "Spin eight-letter words.", ["8 letter words wheel"]))
add("9-letter", "/9-letter-words-wheel", "len-9", "length", seo("9-Letter Words Wheel", "9-Letter Words", "Spin nine-letter words.", ["9 letter words wheel"]))
add("10-letter", "/10-letter-words-wheel", "len-10", "length", seo("10-Letter Words Wheel", "10-Letter Words", "Spin ten-letter words.", ["10 letter words wheel"]))
add("longest", "/longest-words-wheel", "long", "length", seo("Longest Words Wheel", "Longest Words", "Spin among the longest challenge words.", ["longest words wheel"]), { reuseExisting: "long" })
add("random-long", "/random-long-word-wheel", "long", "length", seo("Random Long Word Wheel", "Random Long Word", "Spin a random long word.", ["random long word"]), { reuseExisting: "long" })

// Kids
add("kids-easy", "/kids-easy-word-wheel", "easy", "kids", seo("Kids Easy Word Wheel", "Kids Easy", "Easy words for kids.", ["kids easy word wheel"]))
add("kids-vocab", "/kids-vocabulary-word-wheel", "kids", "kids", seo("Kids Vocabulary Word Wheel", "Kids Vocab", "Kids vocabulary spinner.", ["kids vocabulary wheel"]), { reuseExisting: "kids" })
add("kids-animal", "/kids-animal-word-wheel", "animal", "kids", seo("Kids Animal Word Wheel", "Kids Animals", "Animal words for kids.", ["kids animal word wheel"]), { reuseExisting: "animal" })
add("kids-food", "/kids-food-word-wheel", "food", "kids", seo("Kids Food Word Wheel", "Kids Food", "Food words for kids.", ["kids food word wheel"]), { reuseExisting: "food" })
add("kids-color", "/kids-color-word-wheel", "kidsColor", "kids", seo("Kids Color Word Wheel", "Kids Colors", "Color words for kids.", ["kids color word wheel"]))
add("kids-school", "/kids-school-word-wheel", "kidsSchool", "kids", seo("Kids School Word Wheel", "Kids School", "School words for kids.", ["kids school word wheel"]))
add("kids-funny", "/kids-funny-word-wheel", "funny", "kids", seo("Kids Funny Word Wheel", "Kids Funny", "Funny words for kids.", ["kids funny word wheel"]), { reuseExisting: "funny" })
add("kids-drawing", "/kids-drawing-word-wheel", "doodle", "kids", seo("Kids Drawing Word Wheel", "Kids Drawing", "Drawing words for kids.", ["kids drawing word wheel"]), { defaultMode: "drawing" })
add("kids-story", "/kids-story-word-generator", "kids", "kids", seo("Kids Story Word Generator", "Kids Stories", "Story words for kids.", ["kids story word generator"]), { reuseExisting: "kids", defaultMode: "story" })
add("kids-charades", "/kids-charades-word-wheel", "kids", "kids", seo("Kids Charades Word Wheel", "Kids Charades", "Charades words for kids.", ["kids charades wheel"]), { reuseExisting: "kids", defaultMode: "acting" })
add("kids-pictionary", "/kids-pictionary-word-wheel", "doodle", "kids", seo("Kids Pictionary Word Wheel", "Kids Pictionary", "Pictionary words for kids.", ["kids pictionary wheel"]), { defaultMode: "drawing" })

// Party
add("party-challenge", "/party-challenge-word-wheel", "party", "party", seo("Party Challenge Word Wheel", "Party Challenge", "Party challenge word prompts.", ["party challenge word"]), { reuseExisting: "party" })
add("acting-word-party", "/acting-word-wheel", "acting", "party", seo("Acting Word Wheel", "Acting Words", "Acting word prompts for parties.", ["acting word wheel"]), { reuseExisting: "acting", defaultMode: "acting" })
add("conversation-party", "/random-conversation-word-wheel", "conversation", "party", seo("Random Conversation Word Wheel", "Conversation Word", "Random conversation words.", ["random conversation word"]))
add("charades-party-alias", "/charades-wheel", "charades", "party", seo("Charades Wheel", "Charades Wheel", "Charades word wheel for parties.", ["charades wheel"]), { reuseExisting: "charades", defaultMode: "acting" })
add("pictionary-party-alias", "/pictionary-wheel", "pictionary", "party", seo("Pictionary Wheel", "Pictionary Wheel", "Pictionary word wheel for parties.", ["pictionary wheel"]), { reuseExisting: "pictionary", defaultMode: "drawing" })

// Special
add("movie", "/movie-words-wheel", "movie", "special", seo("Movie Words Wheel", "Movie Words", "Movie-themed word spinner.", ["movie words wheel"]))
add("sports", "/sports-words-wheel", "sports", "special", seo("Sports Words Wheel", "Sports Words", "Sports-themed word spinner.", ["sports words wheel"]))
add("travel", "/travel-words-wheel", "travel", "special", seo("Travel Words Wheel", "Travel Words", "Travel-themed word spinner.", ["travel words wheel"]))
add("nature-special", "/nature-words-wheel", "nature", "special", seo("Nature Words Wheel", "Nature Words", "Nature-themed word spinner.", ["nature words wheel"]))
add("school-special", "/school-words-wheel", "school", "special", seo("School Words Wheel", "School Words", "School-themed word spinner.", ["school words wheel"]))
add("christmas", "/christmas-words-wheel", "christmas", "special", seo("Christmas Words Wheel", "Christmas", "Christmas seasonal word spinner.", ["christmas words wheel"]))
add("thanksgiving", "/thanksgiving-words-wheel", "thanksgiving", "special", seo("Thanksgiving Words Wheel", "Thanksgiving", "Thanksgiving seasonal word spinner.", ["thanksgiving words wheel"]))
add("valentines", "/valentines-words-wheel", "valentine", "special", seo("Valentine's Words Wheel", "Valentine's", "Valentine's Day word spinner.", ["valentines words wheel", "valentine words wheel"]))
add("summer", "/summer-words-wheel", "summer", "special", seo("Summer Words Wheel", "Summer", "Summer seasonal word spinner.", ["summer words wheel"]))
add("winter", "/winter-words-wheel", "winter", "special", seo("Winter Words Wheel", "Winter", "Winter seasonal word spinner.", ["winter words wheel"]))
add("fantasy-special", "/fantasy-words-wheel", "fantasy", "special", seo("Fantasy Words Wheel", "Fantasy Words", "Fantasy-themed word spinner.", ["fantasy words wheel"]))
add("science", "/science-words-wheel", "science", "special", seo("Science Words Wheel", "Science Words", "Science vocabulary spinner.", ["science words wheel"]))
add("space", "/space-words-wheel", "space", "special", seo("Space Words Wheel", "Space Words", "Space-themed word spinner.", ["space words wheel"]))
add("ocean", "/ocean-words-wheel", "ocean", "special", seo("Ocean Words Wheel", "Ocean Words", "Ocean-themed word spinner.", ["ocean words wheel"]))
add("dinosaur", "/dinosaur-words-wheel", "dinosaur", "special", seo("Dinosaur Words Wheel", "Dinosaurs", "Dinosaur word spinner.", ["dinosaur words wheel"]))
add("pokemon-words", "/pokemon-words-wheel", "pokemonWords", "special", seo("Pokémon Words Wheel", "Pokémon Words", "Pokémon-themed word spinner.", ["pokemon words wheel"]))
add("minecraft", "/minecraft-words-wheel", "minecraft", "special", seo("Minecraft Words Wheel", "Minecraft Words", "Minecraft-themed word spinner.", ["minecraft words wheel"]))
add("fortnite-words", "/fortnite-words-wheel", "fortniteWords", "special", seo("Fortnite Words Wheel", "Fortnite Words", "Fortnite-themed word spinner.", ["fortnite words wheel"]))

// Questions / SEO
add("pick-random", "/pick-a-random-word", "common", "questions", seo("Pick a Random Word", "Pick a Word", "Pick a random word instantly.", ["pick a random word"]), { reuseExisting: "common" })
add("what-random-use", "/what-random-word-should-i-use", "writing", "questions", seo("What Random Word Should I Use?", "What Word to Use", "Spin a random word to use.", ["what random word should i use"]), { reuseExisting: "writing" })
add("what-write-about-word", "/what-word-should-i-write-about", "writing", "questions", seo("What Word Should I Write About?", "Write About", "Spin a word to write about.", ["what word should i write about"]), { reuseExisting: "writing" })
add("what-story-use", "/what-word-should-i-use-in-my-story", "story", "questions", seo("What Word Should I Use in My Story?", "Story Word", "Spin a story word to use.", ["what word should i use in my story"]), { reuseExisting: "story" })
add("what-describe", "/what-word-should-i-describe", "challenge", "questions", seo("What Word Should I Describe?", "Describe Word", "Spin a word to describe.", ["what word should i describe"]), { reuseExisting: "challenge", defaultMode: "definition" })
add("what-story-use-2", "/what-word-should-i-use-for-a-story", "story", "questions", seo("What Word Should I Use for a Story?", "For a Story", "Spin a word for your story.", ["what word should i use for a story"]), { reuseExisting: "story" })
add("what-poem", "/what-word-should-i-use-for-a-poem", "poetry", "questions", seo("What Word Should I Use for a Poem?", "For a Poem", "Spin a poetry word.", ["what word should i use for a poem"]), { reuseExisting: "poetry" })
add("what-pictionary", "/what-word-should-i-use-for-pictionary", "pictionary", "questions", seo("What Word Should I Use for Pictionary?", "For Pictionary", "Spin a Pictionary word.", ["what word should i use for pictionary"]), { reuseExisting: "pictionary", defaultMode: "drawing" })
add("what-charades", "/what-word-should-i-use-for-charades", "charades", "questions", seo("What Word Should I Use for Charades?", "For Charades", "Spin a charades word.", ["what word should i use for charades"]), { reuseExisting: "charades", defaultMode: "acting" })
add("give-writing-prompt", "/give-me-a-random-writing-prompt", "writing", "questions", seo("Give Me a Random Writing Prompt", "Writing Prompt", "Get a random writing prompt word.", ["give me a random writing prompt"]), { reuseExisting: "writing" })
add("what-word-use", "/what-word-should-i-use", "common", "questions", seo("What Word Should I Use?", "What Word to Use", "Spin a word when you need one.", ["what word should i use"]), { reuseExisting: "common" })

// Use-case SEO cluster aliases that aren't redirects
add("for-drawing-already", "/random-drawing-word-wheel", "drawing", "drawing", seo("x", "x", "x", ["x"])) // skip duplicate - already exists

// Fix seo() calls that accidentally passed defaultMode wrong - clean doodle and similar
function fixSpokes() {
  // regenerate doodle entry properly - already in list with bug
}

// Clean buggy entries where seo() got extra object as keywords
for (const s of SPOKES) {
  if (!Array.isArray(s.keywords)) {
    // was corrupted - fix known ones
    if (s.id === "doodle") {
      s.keywords = ["doodle word generator"]
      s.defaultMode = "drawing"
    }
    if (s.id === "character-drawing") {
      s.keywords = ["character drawing word wheel"]
      s.defaultMode = "drawing"
    }
    if (s.id === "object-drawing") {
      s.keywords = ["object drawing wheel"]
      s.defaultMode = "drawing"
    }
    if (s.id === "fantasy-drawing") {
      s.keywords = ["fantasy drawing prompt"]
      s.defaultMode = "drawing"
    }
    if (s.id === "inktober") {
      s.keywords = ["inktober word wheel"]
      s.defaultMode = "drawing"
    }
    if (s.id === "kids-drawing") {
      s.keywords = ["kids drawing word wheel"]
      s.defaultMode = "drawing"
    }
    if (s.id === "kids-pictionary") {
      s.keywords = ["kids pictionary wheel"]
      s.defaultMode = "drawing"
    }
  }
}

// Remove accidental duplicate path entries
const EXISTING_PATHS = new Set([
  "/common-words-wheel", "/funny-words-wheel", "/writing-prompt-word-wheel", "/story-word-generator",
  "/poetry-word-picker", "/random-word-generator-for-writing", "/classroom-word-picker", "/vocabulary-word-wheel",
  "/spelling-word-wheel", "/esl-word-wheel", "/sight-word-picker", "/pictionary-word-wheel", "/charades-word-wheel",
  "/word-challenge-wheel", "/random-drawing-word-wheel", "/drawing-prompt-word-wheel", "/random-speaking-topic-wheel",
  "/acting-prompt-word-wheel", "/kids-word-wheel", "/preschool-word-wheel", "/noun-word-wheel", "/verb-word-wheel",
  "/adjective-word-wheel", "/action-word-wheel", "/beginner-words-wheel", "/advanced-words-wheel",
  "/3-letter-words-wheel", "/5-letter-words-wheel", "/long-words-wheel", "/words-starting-with-a",
  "/random-a-z-word-wheel", "/animal-words-wheel", "/food-words-wheel", "/halloween-words-wheel",
  "/party-word-generator", "/icebreaker-word-wheel", "/give-me-3-random-words", "/give-me-5-random-words",
  "/what-word-should-i-act-out", "/random-word-generator-for-kids", "/what-word-should-i-pick",
  "/what-should-i-write-about", "/give-me-a-random-word", "/what-should-i-draw",
])

const uniqueSpokes = []
const seenPaths = new Set()
for (const s of SPOKES) {
  if (EXISTING_PATHS.has(s.path) || seenPaths.has(s.path)) continue
  if (s.h1 === "x") continue
  seenPaths.add(s.path)
  uniqueSpokes.push(s)
}

// Build letter packs
for (const letter of LETTERS) {
  if (letter === "a") continue
  PACKS[`letter-${letter}`] = {
    category: "letter",
    accent: "emerald",
    label: `Words With ${letter.toUpperCase()}`,
    description: `Words starting with ${letter.toUpperCase()}.`,
    words: LETTER_WORDS[letter],
  }
}
PACKS["len-2"] = { category: "length", accent: "sky", label: "2-Letter Words", description: "Two-letter words.", words: LENGTH_WORDS[2] }
PACKS["len-4"] = { category: "length", accent: "violet", label: "4-Letter Words", description: "Four-letter words.", words: LENGTH_WORDS[4] }
PACKS["len-6"] = { category: "length", accent: "teal", label: "6-Letter Words", description: "Six-letter words.", words: LENGTH_WORDS[6] }
PACKS["len-7"] = { category: "length", accent: "amber", label: "7-Letter Words", description: "Seven-letter words.", words: LENGTH_WORDS[7] }
PACKS["len-8"] = { category: "length", accent: "rose", label: "8-Letter Words", description: "Eight-letter words.", words: LENGTH_WORDS[8] }
PACKS["len-9"] = { category: "length", accent: "emerald", label: "9-Letter Words", description: "Nine-letter words.", words: LENGTH_WORDS[9] }
PACKS["len-10"] = { category: "length", accent: "sky", label: "10-Letter Words", description: "Ten-letter words.", words: LENGTH_WORDS[10] }

const outPath = path.join("lib", "word-picker-spoke-expansion.generated.ts")
const lines = []
lines.push(`/** AUTO-GENERATED by scripts/expand-word-picker-spokes.js — do not edit by hand */`)
lines.push(`import type { WordPickerCategoryId, WordPickerUseCaseAccent } from "@/lib/word-picker-wheel-use-cases"`)
lines.push(``)
lines.push(`export type ExpansionPack = {`)
lines.push(`  id: string`)
lines.push(`  category: WordPickerCategoryId`)
lines.push(`  accent: WordPickerUseCaseAccent`)
lines.push(`  label: string`)
lines.push(`  description: string`)
lines.push(`  words: string[]`)
lines.push(`  elimination?: boolean`)
lines.push(`  defaultMode?: string`)
lines.push(`}`)
lines.push(``)
lines.push(`export type ExpansionSpoke = {`)
lines.push(`  id: string`)
lines.push(`  path: string`)
lines.push(`  category: WordPickerCategoryId`)
lines.push(`  packId: string`)
lines.push(`  reuseExisting?: string`)
lines.push(`  pageTitle: string`)
lines.push(`  description: string`)
lines.push(`  h1: string`)
lines.push(`  shortTitle: string`)
lines.push(`  heroIntro: string`)
lines.push(`  keywords: string[]`)
lines.push(`  defaultMode?: string`)
lines.push(`  popular?: boolean`)
lines.push(`  faq: { question: string; answer: string }[]`)
lines.push(`}`)
lines.push(``)
lines.push(`export const EXPANSION_PACKS: ExpansionPack[] = ${JSON.stringify(
  Object.entries(PACKS).map(([id, p]) => ({ id, ...p })),
  null,
  2,
)}`)
lines.push(``)
lines.push(`export const EXPANSION_SPOKES: ExpansionSpoke[] = ${JSON.stringify(
  uniqueSpokes.map((s) => ({
    id: s.id,
    path: s.path,
    category: s.category,
    packId: s.reuseExisting || s.packId,
    reuseExisting: s.reuseExisting || undefined,
    pageTitle: s.pageTitle,
    description: s.description,
    h1: s.h1,
    shortTitle: s.shortTitle,
    heroIntro: s.heroIntro,
    keywords: s.keywords,
    defaultMode: s.defaultMode,
    popular: s.popular,
    faq: [
      {
        question: `What is the ${s.shortTitle} wheel?`,
        answer: s.description,
      },
      {
        question: "Can I edit the word list?",
        answer: "Yes. Paste your own words or import TXT/CSV anytime.",
      },
    ],
  })),
  null,
  2,
)}`)
lines.push(``)

fs.writeFileSync(outPath, lines.join("\n"))
console.log("Wrote", outPath, "packs", Object.keys(PACKS).length, "spokes", uniqueSpokes.length)

// Also write JSON for page generation
fs.writeFileSync(
  path.join("scripts", "word-picker-expansion-paths.json"),
  JSON.stringify(uniqueSpokes.map((s) => ({ id: s.id, path: s.path })), null, 2),
)
