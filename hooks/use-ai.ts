import type { ChallengeMode, AIResponse } from "@/types/letter-picker"

export function useAI() {
  const getAIResponse = async (letter: string, challengeMode: ChallengeMode): Promise<AIResponse> => {
    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 2000))

    // Generate contextual responses based on letter and challenge mode
    const responses = generateAIResponses(letter, challengeMode)
    
    return responses
  }

  const generateAIResponses = (letter: string, challengeMode: ChallengeMode): AIResponse => {
    const letterUpper = letter.toUpperCase()
    const letterLower = letter.toLowerCase()

    const baseEncouragement = `Great! You got the letter "${letterUpper}". Let's see what you can create with it!`
    
    switch (challengeMode) {
      case "word-building":
        return {
          encouragement: baseEncouragement,
          challenge: `Find as many words as you can that start with the letter "${letterUpper}". Think of nouns, verbs, adjectives, and even names!`,
          hints: [
            `Think of common everyday objects that start with "${letterUpper}"`,
            `Consider action words (verbs) that begin with "${letterUpper}"`,
            `Don't forget about names of people, places, or things`,
            `Try thinking of words in different categories: animals, food, colors, etc.`
          ],
          examples: getWordExamples(letterUpper),
        }

      case "story-mode":
        return {
          encouragement: `Perfect! The letter "${letterUpper}" will be the star of our story today.`,
          challenge: `Create a short story where the main character's name starts with "${letterUpper}" and they go on an adventure.`,
          hints: [
            `Start by thinking of a name that begins with "${letterUpper}"`,
            `What kind of adventure could this character have?`,
            `Include other words that start with "${letterUpper}" in your story`,
            `Make it fun and imaginative!`
          ],
          examples: getWordExamples(letterUpper),
          story: `Once upon a time, there was a brave ${getRandomAdjective(letterUpper)} ${getRandomNoun(letterUpper)} named ${getRandomName(letterUpper)}. ${getRandomName(letterUpper)} loved to ${getRandomVerb(letterUpper)} and one day decided to go on an amazing adventure...`
        }

      case "rhyme-time":
        return {
          encouragement: `Excellent! Let's find some rhyming words with "${letterUpper}"!`,
          challenge: `Find words that rhyme with words starting with "${letterUpper}". For example, if you think of "cat" (starting with C), you could rhyme it with "hat", "bat", "rat", etc.`,
          hints: [
            `Think of simple words that start with "${letterUpper}"`,
            `Look for words that end with the same sound`,
            `Don't worry about spelling - focus on the sound`,
            `Try different word families and patterns`
          ],
          examples: getRhymingExamples(letterUpper),
        }

      case "quick-fire":
        return {
          encouragement: `Ready for a speed challenge with "${letterUpper}"?`,
          challenge: `You have 30 seconds to find as many words as possible starting with "${letterUpper}". Go fast, but make sure they're real words!`,
          hints: [
            `Think quickly - don't overthink!`,
            `Start with simple, common words`,
            `Use different word types: nouns, verbs, adjectives`,
            `Remember, speed is key in this challenge!`
          ],
          examples: getWordExamples(letterUpper).slice(0, 5), // Fewer examples for quick-fire
        }

      default:
        return {
          encouragement: baseEncouragement,
          hints: [`Think of words starting with "${letterUpper}"`],
          examples: getWordExamples(letterUpper),
        }
    }
  }

  const getWordExamples = (letter: string): string[] => {
    const wordLists: Record<string, string[]> = {
      A: ["Apple", "Amazing", "Adventure", "Animal", "Art", "Air", "Answer", "Action"],
      B: ["Beautiful", "Brave", "Book", "Blue", "Big", "Bright", "Busy", "Best"],
      C: ["Creative", "Colorful", "Cat", "Car", "Cool", "Clever", "Careful", "Curious"],
      D: ["Delightful", "Dance", "Dream", "Dog", "Day", "Deep", "Daring", "Different"],
      E: ["Excellent", "Exciting", "Elephant", "Energy", "Easy", "Elegant", "Enormous", "Every"],
      F: ["Fantastic", "Fun", "Friend", "Fast", "Fresh", "Friendly", "Famous", "Free"],
      G: ["Great", "Good", "Green", "Giant", "Gentle", "Glorious", "Grateful", "Growing"],
      H: ["Happy", "Helpful", "House", "Heart", "High", "Huge", "Healthy", "Honest"],
      I: ["Incredible", "Interesting", "Ice", "Idea", "Important", "Imaginative", "Intelligent", "Inspiring"],
      J: ["Joyful", "Jump", "Just", "Jolly", "Jewel", "Journey", "Jubilant", "Jovial"],
      K: ["Kind", "Keep", "King", "Kite", "Knowledge", "Kindly", "Keen", "Known"],
      L: ["Lovely", "Light", "Love", "Large", "Laugh", "Learn", "Lucky", "Lively"],
      M: ["Magnificent", "Magic", "Music", "Mountain", "Mighty", "Merry", "Mysterious", "Marvelous"],
      N: ["Nice", "New", "Nature", "Night", "Noble", "Natural", "Neat", "Nurturing"],
      O: ["Outstanding", "Ocean", "Open", "Orange", "Original", "Optimistic", "Outdoor", "Organized"],
      P: ["Perfect", "Play", "Peace", "Purple", "Powerful", "Pretty", "Patient", "Proud"],
      Q: ["Quick", "Quiet", "Queen", "Quality", "Question", "Quirky", "Quaint", "Quench"],
      R: ["Remarkable", "Rainbow", "Run", "Red", "Ready", "Radiant", "Reliable", "Respectful"],
      S: ["Super", "Sun", "Star", "Sweet", "Strong", "Smart", "Special", "Smile"],
      T: ["Terrific", "Tree", "Time", "True", "Tall", "Tender", "Trustworthy", "Thankful"],
      U: ["Unique", "Useful", "Up", "Understanding", "Unusual", "United", "Uplifting", "Universe"],
      V: ["Valuable", "Voice", "Victory", "Vibrant", "Vast", "Virtuous", "Vivid", "Vital"],
      W: ["Wonderful", "World", "Water", "Warm", "Wise", "Wild", "Worthy", "Winning"],
      X: ["Excellent", "Extra", "X-ray", "Xenial", "Xenon", "Xerox", "Xylophone", "Xenophile"],
      Y: ["Young", "Yellow", "Yes", "Year", "Youthful", "Yummy", "Yearning", "Yielding"],
      Z: ["Zesty", "Zoo", "Zero", "Zigzag", "Zealous", "Zany", "Zen", "Zillion"]
    }

    return wordLists[letter] || ["Word", "Wonderful", "Wheel", "Winner"]
  }

  const getRhymingExamples = (letter: string): string[] => {
    const rhymingLists: Record<string, string[]> = {
      A: ["cat-hat", "bat-rat", "mat-sat", "pat-fat"],
      B: ["bee-tree", "see-free", "key-me", "tea-sea"],
      C: ["cat-hat", "bat-rat", "mat-sat", "pat-fat"],
      D: ["dog-log", "fog-bog", "jog-hog", "smog-frog"],
      E: ["bed-red", "head-said", "led-fed", "wed-shed"],
      F: ["fun-sun", "run-bun", "gun-one", "done-son"],
      G: ["go-so", "no-know", "low-slow", "row-blow"],
      H: ["hat-cat", "bat-rat", "mat-sat", "pat-fat"],
      I: ["ice-nice", "rice-mice", "dice-spice", "price-twice"],
      J: ["jump-bump", "lump-hump", "pump-thump", "stump-clump"],
      K: ["keep-sleep", "deep-sheep", "weep-creep", "steep-sweep"],
      L: ["light-bright", "night-right", "sight-might", "flight-tight"],
      M: ["man-can", "fan-pan", "ran-tan", "plan-scan"],
      N: ["night-light", "bright-right", "sight-might", "flight-tight"],
      O: ["old-cold", "gold-fold", "sold-told", "bold-hold"],
      P: ["play-day", "say-way", "may-stay", "ray-gray"],
      Q: ["quick-sick", "tick-pick", "lick-stick", "brick-trick"],
      R: ["run-fun", "sun-bun", "gun-one", "done-son"],
      S: ["sun-fun", "run-bun", "gun-one", "done-son"],
      T: ["time-rhyme", "lime-chime", "dime-climb", "prime-slime"],
      U: ["up-cup", "pup-sup", "butter-nutter", "utter-shutter"],
      V: ["very-merry", "cherry-berry", "ferry-terry", "sherry-jerry"],
      W: ["way-day", "say-play", "may-stay", "ray-gray"],
      X: ["box-fox", "socks-rocks", "locks-clocks", "blocks-stocks"],
      Y: ["you-blue", "true-few", "new-view", "crew-flew"],
      Z: ["zoo-blue", "true-few", "new-view", "crew-flew"]
    }

    return rhymingLists[letter] || ["cat-hat", "dog-log", "sun-fun", "day-play"]
  }

  const getRandomAdjective = (letter: string): string => {
    const adjectives = getWordExamples(letter).filter(word => 
      word.length > 3 && word.endsWith('ful') || word.endsWith('ous') || word.endsWith('al')
    )
    return adjectives[Math.floor(Math.random() * adjectives.length)] || "Amazing"
  }

  const getRandomNoun = (letter: string): string => {
    const nouns = getWordExamples(letter).filter(word => word.length <= 6)
    return nouns[Math.floor(Math.random() * nouns.length)] || "Hero"
  }

  const getRandomVerb = (letter: string): string => {
    const verbs = getWordExamples(letter).filter(word => 
      word.endsWith('ing') || word.endsWith('ed') || word.length <= 5
    )
    return verbs[Math.floor(Math.random() * verbs.length)] || "Explore"
  }

  const getRandomName = (letter: string): string => {
    const names = getWordExamples(letter).filter(word => word.length <= 5)
    return names[Math.floor(Math.random() * names.length)] || "Alex"
  }

  return {
    getAIResponse,
  }
} 