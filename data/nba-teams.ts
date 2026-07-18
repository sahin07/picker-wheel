export interface NBATeam {
  id: string
  name: string
  abbreviation: string
  // Use "league" to match existing generic components; values are Eastern/Western
  league: "Eastern" | "Western"
  division: "Atlantic" | "Central" | "Southeast" | "Northwest" | "Pacific" | "Southwest"
  city: string
  // For now, use emoji or external logo URL. You can replace with real logos later.
  logo: string
  primaryColor: string
  secondaryColor: string
  founded: number
  championships: number
  // Keep field names aligned with MLB components for reusability
  homeVenue: string
  manager: string
  owner: string
}

export type ActionMode = "normal" | "elimination" | "manual"

export const nbaTeams: NBATeam[] = [
  // Eastern Conference - Atlantic
  {
    id: "bos",
    name: "Boston Celtics",
    abbreviation: "BOS",
    league: "Eastern",
    division: "Atlantic",
    city: "Boston",
    logo: "🍀",
    primaryColor: "#007A33",
    secondaryColor: "#BA9653",
    founded: 1946,
    championships: 18,
    homeVenue: "TD Garden",
    manager: "Joe Mazzulla",
    owner: "Boston Basketball Partners"
  },
  {
    id: "bkn",
    name: "Brooklyn Nets",
    abbreviation: "BKN",
    league: "Eastern",
    division: "Atlantic",
    city: "Brooklyn",
    logo: "🖤",
    primaryColor: "#000000",
    secondaryColor: "#FFFFFF",
    founded: 1967,
    championships: 0,
    homeVenue: "Barclays Center",
    manager: "Jordi Fernández",
    owner: "Joe Tsai"
  },
  {
    id: "nyk",
    name: "New York Knicks",
    abbreviation: "NYK",
    league: "Eastern",
    division: "Atlantic",
    city: "New York",
    logo: "🗽",
    primaryColor: "#006BB6",
    secondaryColor: "#F58426",
    founded: 1946,
    championships: 2,
    homeVenue: "Madison Square Garden",
    manager: "Tom Thibodeau",
    owner: "James L. Dolan"
  },
  {
    id: "phi",
    name: "Philadelphia 76ers",
    abbreviation: "PHI",
    league: "Eastern",
    division: "Atlantic",
    city: "Philadelphia",
    logo: "🔔",
    primaryColor: "#006BB6",
    secondaryColor: "#ED174C",
    founded: 1946,
    championships: 3,
    homeVenue: "Wells Fargo Center",
    manager: "Nick Nurse",
    owner: "Harris Blitzer Sports & Entertainment"
  },
  {
    id: "tor",
    name: "Toronto Raptors",
    abbreviation: "TOR",
    league: "Eastern",
    division: "Atlantic",
    city: "Toronto",
    logo: "🦖",
    primaryColor: "#CE1141",
    secondaryColor: "#000000",
    founded: 1995,
    championships: 1,
    homeVenue: "Scotiabank Arena",
    manager: "Darko Rajaković",
    owner: "Maple Leaf Sports & Entertainment"
  },

  // Eastern Conference - Central
  {
    id: "chi",
    name: "Chicago Bulls",
    abbreviation: "CHI",
    league: "Eastern",
    division: "Central",
    city: "Chicago",
    logo: "🐂",
    primaryColor: "#CE1141",
    secondaryColor: "#000000",
    founded: 1966,
    championships: 6,
    homeVenue: "United Center",
    manager: "Billy Donovan",
    owner: "Jerry Reinsdorf"
  },
  {
    id: "cle",
    name: "Cleveland Cavaliers",
    abbreviation: "CLE",
    league: "Eastern",
    division: "Central",
    city: "Cleveland",
    logo: "🛡️",
    primaryColor: "#6F263D",
    secondaryColor: "#FFB81C",
    founded: 1970,
    championships: 1,
    homeVenue: "Rocket Mortgage FieldHouse",
    manager: "Kenny Atkinson",
    owner: "Dan Gilbert"
  },
  {
    id: "det",
    name: "Detroit Pistons",
    abbreviation: "DET",
    league: "Eastern",
    division: "Central",
    city: "Detroit",
    logo: "🔧",
    primaryColor: "#C8102E",
    secondaryColor: "#1D428A",
    founded: 1941,
    championships: 3,
    homeVenue: "Little Caesars Arena",
    manager: "J.B. Bickerstaff",
    owner: "Tom Gores"
  },
  {
    id: "ind",
    name: "Indiana Pacers",
    abbreviation: "IND",
    league: "Eastern",
    division: "Central",
    city: "Indianapolis",
    logo: "🏁",
    primaryColor: "#002D62",
    secondaryColor: "#FDBB30",
    founded: 1967,
    championships: 0,
    homeVenue: "Gainbridge Fieldhouse",
    manager: "Rick Carlisle",
    owner: "Herb Simon"
  },
  {
    id: "mil",
    name: "Milwaukee Bucks",
    abbreviation: "MIL",
    league: "Eastern",
    division: "Central",
    city: "Milwaukee",
    logo: "🦌",
    primaryColor: "#00471B",
    secondaryColor: "#EEE1C6",
    founded: 1968,
    championships: 2,
    homeVenue: "Fiserv Forum",
    manager: "Doc Rivers",
    owner: "Wes Edens & Jimmy Haslam"
  },

  // Eastern Conference - Southeast
  {
    id: "atl",
    name: "Atlanta Hawks",
    abbreviation: "ATL",
    league: "Eastern",
    division: "Southeast",
    city: "Atlanta",
    logo: "🦅",
    primaryColor: "#E03A3E",
    secondaryColor: "#C1D32F",
    founded: 1946,
    championships: 1,
    homeVenue: "State Farm Arena",
    manager: "Quin Snyder",
    owner: "Tony Ressler"
  },
  {
    id: "cha",
    name: "Charlotte Hornets",
    abbreviation: "CHA",
    league: "Eastern",
    division: "Southeast",
    city: "Charlotte",
    logo: "🦋",
    primaryColor: "#1D1160",
    secondaryColor: "#00788C",
    founded: 1988,
    championships: 0,
    homeVenue: "Spectrum Center",
    manager: "Charles Lee",
    owner: "Gabe Plotkin & Rick Schnall"
  },
  {
    id: "mia",
    name: "Miami Heat",
    abbreviation: "MIA",
    league: "Eastern",
    division: "Southeast",
    city: "Miami",
    logo: "🔥",
    primaryColor: "#98002E",
    secondaryColor: "#F9A01B",
    founded: 1988,
    championships: 3,
    homeVenue: "Kaseya Center",
    manager: "Erik Spoelstra",
    owner: "Micky Arison"
  },
  {
    id: "orl",
    name: "Orlando Magic",
    abbreviation: "ORL",
    league: "Eastern",
    division: "Southeast",
    city: "Orlando",
    logo: "✨",
    primaryColor: "#0077C0",
    secondaryColor: "#C4CED4",
    founded: 1989,
    championships: 0,
    homeVenue: "Kia Center",
    manager: "Jamahl Mosley",
    owner: "DeVos family"
  },
  {
    id: "was",
    name: "Washington Wizards",
    abbreviation: "WAS",
    league: "Eastern",
    division: "Southeast",
    city: "Washington",
    logo: "🔮",
    primaryColor: "#002B5C",
    secondaryColor: "#E31837",
    founded: 1961,
    championships: 1,
    homeVenue: "Capital One Arena",
    manager: "Brian Keefe",
    owner: "Monumental Sports & Entertainment"
  },

  // Western Conference - Northwest
  {
    id: "den",
    name: "Denver Nuggets",
    abbreviation: "DEN",
    league: "Western",
    division: "Northwest",
    city: "Denver",
    logo: "⛏️",
    primaryColor: "#0E2240",
    secondaryColor: "#FEC524",
    founded: 1967,
    championships: 1,
    homeVenue: "Ball Arena",
    manager: "Michael Malone",
    owner: "Kroenke Sports & Entertainment"
  },
  {
    id: "min",
    name: "Minnesota Timberwolves",
    abbreviation: "MIN",
    league: "Western",
    division: "Northwest",
    city: "Minneapolis",
    logo: "🐺",
    primaryColor: "#0C2340",
    secondaryColor: "#236192",
    founded: 1989,
    championships: 0,
    homeVenue: "Target Center",
    manager: "Chris Finch",
    owner: "Marc Lore & Alex Rodriguez"
  },
  {
    id: "okc",
    name: "Oklahoma City Thunder",
    abbreviation: "OKC",
    league: "Western",
    division: "Northwest",
    city: "Oklahoma City",
    logo: "⚡",
    primaryColor: "#007AC1",
    secondaryColor: "#EF3B24",
    founded: 1967,
    championships: 1,
    homeVenue: "Paycom Center",
    manager: "Mark Daigneault",
    owner: "Clay Bennett"
  },
  {
    id: "por",
    name: "Portland Trail Blazers",
    abbreviation: "POR",
    league: "Western",
    division: "Northwest",
    city: "Portland",
    logo: "🌀",
    primaryColor: "#E03A3E",
    secondaryColor: "#000000",
    founded: 1970,
    championships: 1,
    homeVenue: "Moda Center",
    manager: "Chauncey Billups",
    owner: "Jody Allen"
  },
  {
    id: "uta",
    name: "Utah Jazz",
    abbreviation: "UTA",
    league: "Western",
    division: "Northwest",
    city: "Salt Lake City",
    logo: "🎵",
    primaryColor: "#002B5C",
    secondaryColor: "#F9A01B",
    founded: 1974,
    championships: 0,
    homeVenue: "Delta Center",
    manager: "Will Hardy",
    owner: "Ryan Smith"
  },

  // Western Conference - Pacific
  {
    id: "gsw",
    name: "Golden State Warriors",
    abbreviation: "GSW",
    league: "Western",
    division: "Pacific",
    city: "San Francisco",
    logo: "🌁",
    primaryColor: "#1D428A",
    secondaryColor: "#FFC72C",
    founded: 1946,
    championships: 7,
    homeVenue: "Chase Center",
    manager: "Steve Kerr",
    owner: "Joe Lacob & Peter Guber"
  },
  {
    id: "lac",
    name: "LA Clippers",
    abbreviation: "LAC",
    league: "Western",
    division: "Pacific",
    city: "Los Angeles",
    logo: "⚓",
    primaryColor: "#C8102E",
    secondaryColor: "#1D428A",
    founded: 1970,
    championships: 0,
    homeVenue: "Intuit Dome",
    manager: "Tyronn Lue",
    owner: "Steve Ballmer"
  },
  {
    id: "lal",
    name: "Los Angeles Lakers",
    abbreviation: "LAL",
    league: "Western",
    division: "Pacific",
    city: "Los Angeles",
    logo: "💜",
    primaryColor: "#552583",
    secondaryColor: "#FDB927",
    founded: 1947,
    championships: 17,
    homeVenue: "Crypto.com Arena",
    manager: "JJ Redick",
    owner: "Jeanie Buss"
  },
  {
    id: "phx",
    name: "Phoenix Suns",
    abbreviation: "PHX",
    league: "Western",
    division: "Pacific",
    city: "Phoenix",
    logo: "☀️",
    primaryColor: "#1D1160",
    secondaryColor: "#E56020",
    founded: 1968,
    championships: 0,
    homeVenue: "Footprint Center",
    manager: "Mike Budenholzer",
    owner: "Mat Ishbia"
  },
  {
    id: "sac",
    name: "Sacramento Kings",
    abbreviation: "SAC",
    league: "Western",
    division: "Pacific",
    city: "Sacramento",
    logo: "👑",
    primaryColor: "#5A2D81",
    secondaryColor: "#63727A",
    founded: 1923,
    championships: 1,
    homeVenue: "Golden 1 Center",
    manager: "Mike Brown",
    owner: "Vivek Ranadivé"
  },

  // Western Conference - Southwest
  {
    id: "dal",
    name: "Dallas Mavericks",
    abbreviation: "DAL",
    league: "Western",
    division: "Southwest",
    city: "Dallas",
    logo: "🐎",
    primaryColor: "#00538C",
    secondaryColor: "#B8C4CA",
    founded: 1980,
    championships: 1,
    homeVenue: "American Airlines Center",
    manager: "Jason Kidd",
    owner: "Mark Cuban (minority), Adelson/Dumont families"
  },
  {
    id: "hou",
    name: "Houston Rockets",
    abbreviation: "HOU",
    league: "Western",
    division: "Southwest",
    city: "Houston",
    logo: "🚀",
    primaryColor: "#CE1141",
    secondaryColor: "#C4CED4",
    founded: 1967,
    championships: 2,
    homeVenue: "Toyota Center",
    manager: "Ime Udoka",
    owner: "Tilman Fertitta"
  },
  {
    id: "mem",
    name: "Memphis Grizzlies",
    abbreviation: "MEM",
    league: "Western",
    division: "Southwest",
    city: "Memphis",
    logo: "🐻",
    primaryColor: "#5D76A9",
    secondaryColor: "#12173F",
    founded: 1995,
    championships: 0,
    homeVenue: "FedExForum",
    manager: "Taylor Jenkins",
    owner: "Robert Pera"
  },
  {
    id: "nop",
    name: "New Orleans Pelicans",
    abbreviation: "NOP",
    league: "Western",
    division: "Southwest",
    city: "New Orleans",
    logo: "🦅",
    primaryColor: "#0C2340",
    secondaryColor: "#C8102E",
    founded: 2002,
    championships: 0,
    homeVenue: "Smoothie King Center",
    manager: "Willie Green",
    owner: "Gayle Benson"
  },
  {
    id: "sas",
    name: "San Antonio Spurs",
    abbreviation: "SAS",
    league: "Western",
    division: "Southwest",
    city: "San Antonio",
    logo: "⚙️",
    primaryColor: "#000000",
    secondaryColor: "#C4CED4",
    founded: 1967,
    championships: 5,
    homeVenue: "Frost Bank Center",
    manager: "Gregg Popovich",
    owner: "Spurs Sports & Entertainment"
  }
]

export function getNBATeamsByConference(conference: "Eastern" | "Western" | "all"): NBATeam[] {
  if (conference === "all") return nbaTeams
  return nbaTeams.filter(t => t.league === conference)
}

export const nbaConferences = [
  { id: "all", name: "All Teams", count: 30 },
  { id: "Eastern", name: "Eastern", count: 15 },
  { id: "Western", name: "Western", count: 15 }
]

export const nbaDivisions: Array<{ id: string; name: string; league: "Eastern" | "Western" }> = [
  { id: "Atlantic", name: "Eastern Atlantic", league: "Eastern" },
  { id: "Central", name: "Eastern Central", league: "Eastern" },
  { id: "Southeast", name: "Eastern Southeast", league: "Eastern" },
  { id: "Northwest", name: "Western Northwest", league: "Western" },
  { id: "Pacific", name: "Western Pacific", league: "Western" },
  { id: "Southwest", name: "Western Southwest", league: "Western" }
]


