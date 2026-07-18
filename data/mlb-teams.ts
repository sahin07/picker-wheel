export interface MLBTeam {
  id: string
  name: string
  abbreviation: string
  league: "American" | "National"
  division: string
  city: string
  logo: string
  primaryColor: string
  secondaryColor: string
  founded: number
  championships: number
  homeVenue: string
  manager: string
  owner: string
}

export type ActionMode = "normal" | "elimination" | "manual"

export const mlbTeams: MLBTeam[] = [
  // American League
  // AL East
  {
    id: "nyy",
    name: "New York Yankees",
    abbreviation: "NYY",
    league: "American",
    division: "East",
    city: "New York",
    logo: "🏟️",
    primaryColor: "#0C2340",
    secondaryColor: "#C4CED4",
    founded: 1901,
    championships: 27,
    homeVenue: "Yankee Stadium",
    manager: "Aaron Boone",
    owner: "Yankee Global Enterprises"
  },
  {
    id: "bos",
    name: "Boston Red Sox",
    abbreviation: "BOS",
    league: "American",
    division: "East",
    city: "Boston",
    logo: "🧦",
    primaryColor: "#BD3039",
    secondaryColor: "#0C2340",
    founded: 1901,
    championships: 9,
    homeVenue: "Fenway Park",
    manager: "Alex Cora",
    owner: "Fenway Sports Group"
  },
  {
    id: "bal",
    name: "Baltimore Orioles",
    abbreviation: "BAL",
    league: "American",
    division: "East",
    city: "Baltimore",
    logo: "🐦",
    primaryColor: "#DF4601",
    secondaryColor: "#000000",
    founded: 1901,
    championships: 3,
    homeVenue: "Oriole Park at Camden Yards",
    manager: "Brandon Hyde",
    owner: "Baltimore Orioles Limited Partnership"
  },
  {
    id: "tb",
    name: "Tampa Bay Rays",
    abbreviation: "TB",
    league: "American",
    division: "East",
    city: "Tampa Bay",
    logo: "☀️",
    primaryColor: "#092C5C",
    secondaryColor: "#8FBCE6",
    founded: 1998,
    championships: 0,
    homeVenue: "Tropicana Field",
    manager: "Kevin Cash",
    owner: "Stuart Sternberg"
  },
  {
    id: "tor",
    name: "Toronto Blue Jays",
    abbreviation: "TOR",
    league: "American",
    division: "East",
    city: "Toronto",
    logo: "🐦",
    primaryColor: "#134A8E",
    secondaryColor: "#1D2D5C",
    founded: 1977,
    championships: 2,
    homeVenue: "Rogers Centre",
    manager: "John Schneider",
    owner: "Rogers Communications"
  },

  // AL Central
  {
    id: "cws",
    name: "Chicago White Sox",
    abbreviation: "CWS",
    league: "American",
    division: "Central",
    city: "Chicago",
    logo: "⚾",
    primaryColor: "#27251F",
    secondaryColor: "#C4CED4",
    founded: 1901,
    championships: 3,
    homeVenue: "Guaranteed Rate Field",
    manager: "Pedro Grifol",
    owner: "Jerry Reinsdorf"
  },
  {
    id: "cle",
    name: "Cleveland Guardians",
    abbreviation: "CLE",
    league: "American",
    division: "Central",
    city: "Cleveland",
    logo: "🔴",
    primaryColor: "#E31937",
    secondaryColor: "#0C2340",
    founded: 1901,
    championships: 2,
    homeVenue: "Progressive Field",
    manager: "Stephen Vogt",
    owner: "Larry Dolan"
  },
  {
    id: "det",
    name: "Detroit Tigers",
    abbreviation: "DET",
    league: "American",
    division: "Central",
    city: "Detroit",
    logo: "🐅",
    primaryColor: "#0C2340",
    secondaryColor: "#FA4616",
    founded: 1901,
    championships: 4,
    homeVenue: "Comerica Park",
    manager: "A.J. Hinch",
    owner: "Christopher Ilitch"
  },
  {
    id: "kc",
    name: "Kansas City Royals",
    abbreviation: "KC",
    league: "American",
    division: "Central",
    city: "Kansas City",
    logo: "👑",
    primaryColor: "#004687",
    secondaryColor: "#BD9B60",
    founded: 1969,
    championships: 2,
    homeVenue: "Kauffman Stadium",
    manager: "Matt Quatraro",
    owner: "John Sherman"
  },
  {
    id: "min",
    name: "Minnesota Twins",
    abbreviation: "MIN",
    league: "American",
    division: "Central",
    city: "Minneapolis",
    logo: "⚾",
    primaryColor: "#002B5C",
    secondaryColor: "#D31145",
    founded: 1901,
    championships: 3,
    homeVenue: "Target Field",
    manager: "Rocco Baldelli",
    owner: "Jim Pohlad"
  },

  // AL West
  {
    id: "hou",
    name: "Houston Astros",
    abbreviation: "HOU",
    league: "American",
    division: "West",
    city: "Houston",
    logo: "⭐",
    primaryColor: "#002D62",
    secondaryColor: "#EB6E1F",
    founded: 1962,
    championships: 2,
    homeVenue: "Minute Maid Park",
    manager: "Joe Espada",
    owner: "Jim Crane"
  },
  {
    id: "laa",
    name: "Los Angeles Angels",
    abbreviation: "LAA",
    league: "American",
    division: "West",
    city: "Anaheim",
    logo: "😇",
    primaryColor: "#BA0021",
    secondaryColor: "#003263",
    founded: 1961,
    championships: 1,
    homeVenue: "Angel Stadium",
    manager: "Ron Washington",
    owner: "Arte Moreno"
  },
  {
    id: "oak",
    name: "Oakland Athletics",
    abbreviation: "OAK",
    league: "American",
    division: "West",
    city: "Oakland",
    logo: "🟢",
    primaryColor: "#003831",
    secondaryColor: "#EFB21E",
    founded: 1901,
    championships: 9,
    homeVenue: "Oakland Coliseum",
    manager: "Mark Kotsay",
    owner: "John Fisher"
  },
  {
    id: "sea",
    name: "Seattle Mariners",
    abbreviation: "SEA",
    league: "American",
    division: "West",
    city: "Seattle",
    logo: "⚓",
    primaryColor: "#0C2C56",
    secondaryColor: "#005C5C",
    founded: 1977,
    championships: 0,
    homeVenue: "T-Mobile Park",
    manager: "Scott Servais",
    owner: "John Stanton"
  },
  {
    id: "tex",
    name: "Texas Rangers",
    abbreviation: "TEX",
    league: "American",
    division: "West",
    city: "Arlington",
    logo: "🤠",
    primaryColor: "#003278",
    secondaryColor: "#C0111F",
    founded: 1961,
    championships: 1,
    homeVenue: "Globe Life Field",
    manager: "Bruce Bochy",
    owner: "Ray Davis"
  },

  // National League
  // NL East
  {
    id: "atl",
    name: "Atlanta Braves",
    abbreviation: "ATL",
    league: "National",
    division: "East",
    city: "Atlanta",
    logo: "🪓",
    primaryColor: "#CE1141",
    secondaryColor: "#13274F",
    founded: 1871,
    championships: 4,
    homeVenue: "Truist Park",
    manager: "Brian Snitker",
    owner: "Liberty Media"
  },
  {
    id: "mia",
    name: "Miami Marlins",
    abbreviation: "MIA",
    league: "National",
    division: "East",
    city: "Miami",
    logo: "🐠",
    primaryColor: "#00A3E0",
    secondaryColor: "#EF3340",
    founded: 1993,
    championships: 2,
    homeVenue: "loanDepot park",
    manager: "Skip Schumaker",
    owner: "Bruce Sherman"
  },
  {
    id: "nym",
    name: "New York Mets",
    abbreviation: "NYM",
    league: "National",
    division: "East",
    city: "New York",
    logo: "⚾",
    primaryColor: "#002D72",
    secondaryColor: "#FF5910",
    founded: 1962,
    championships: 2,
    homeVenue: "Citi Field",
    manager: "Carlos Mendoza",
    owner: "Steve Cohen"
  },
  {
    id: "phi",
    name: "Philadelphia Phillies",
    abbreviation: "PHI",
    league: "National",
    division: "East",
    city: "Philadelphia",
    logo: "🔔",
    primaryColor: "#E81828",
    secondaryColor: "#002D72",
    founded: 1883,
    championships: 2,
    homeVenue: "Citizens Bank Park",
    manager: "Rob Thomson",
    owner: "John Middleton"
  },
  {
    id: "was",
    name: "Washington Nationals",
    abbreviation: "WAS",
    league: "National",
    division: "East",
    city: "Washington",
    logo: "🏛️",
    primaryColor: "#AB0003",
    secondaryColor: "#14225A",
    founded: 1969,
    championships: 1,
    homeVenue: "Nationals Park",
    manager: "Dave Martinez",
    owner: "Lerner Family"
  },

  // NL Central
  {
    id: "chc",
    name: "Chicago Cubs",
    abbreviation: "CHC",
    league: "National",
    division: "Central",
    city: "Chicago",
    logo: "🐻",
    primaryColor: "#0E3386",
    secondaryColor: "#CC3433",
    founded: 1876,
    championships: 3,
    homeVenue: "Wrigley Field",
    manager: "Craig Counsell",
    owner: "Tom Ricketts"
  },
  {
    id: "cin",
    name: "Cincinnati Reds",
    abbreviation: "CIN",
    league: "National",
    division: "Central",
    city: "Cincinnati",
    logo: "🔴",
    primaryColor: "#C6011F",
    secondaryColor: "#000000",
    founded: 1882,
    championships: 5,
    homeVenue: "Great American Ball Park",
    manager: "David Bell",
    owner: "Bob Castellini"
  },
  {
    id: "mil",
    name: "Milwaukee Brewers",
    abbreviation: "MIL",
    league: "National",
    division: "Central",
    city: "Milwaukee",
    logo: "🍺",
    primaryColor: "#0A2351",
    secondaryColor: "#B6922E",
    founded: 1969,
    championships: 0,
    homeVenue: "American Family Field",
    manager: "Pat Murphy",
    owner: "Mark Attanasio"
  },
  {
    id: "pit",
    name: "Pittsburgh Pirates",
    abbreviation: "PIT",
    league: "National",
    division: "Central",
    city: "Pittsburgh",
    logo: "🏴‍☠️",
    primaryColor: "#27251F",
    secondaryColor: "#FDB827",
    founded: 1882,
    championships: 5,
    homeVenue: "PNC Park",
    manager: "Derek Shelton",
    owner: "Bob Nutting"
  },
  {
    id: "stl",
    name: "St. Louis Cardinals",
    abbreviation: "STL",
    league: "National",
    division: "Central",
    city: "St. Louis",
    logo: "🐦",
    primaryColor: "#C41E3A",
    secondaryColor: "#0C2340",
    founded: 1882,
    championships: 11,
    homeVenue: "Busch Stadium",
    manager: "Oliver Marmol",
    owner: "William DeWitt Jr."
  },

  // NL West
  {
    id: "ari",
    name: "Arizona Diamondbacks",
    abbreviation: "ARI",
    league: "National",
    division: "West",
    city: "Phoenix",
    logo: "🐍",
    primaryColor: "#A71930",
    secondaryColor: "#E3D4AD",
    founded: 1998,
    championships: 1,
    homeVenue: "Chase Field",
    manager: "Torey Lovullo",
    owner: "Ken Kendrick"
  },
  {
    id: "col",
    name: "Colorado Rockies",
    abbreviation: "COL",
    league: "National",
    division: "West",
    city: "Denver",
    logo: "🏔️",
    primaryColor: "#33006F",
    secondaryColor: "#C4CED4",
    founded: 1993,
    championships: 0,
    homeVenue: "Coors Field",
    manager: "Bud Black",
    owner: "Dick Monfort"
  },
  {
    id: "lad",
    name: "Los Angeles Dodgers",
    abbreviation: "LAD",
    league: "National",
    division: "West",
    city: "Los Angeles",
    logo: "⚾",
    primaryColor: "#005A9C",
    secondaryColor: "#EF3E42",
    founded: 1884,
    championships: 7,
    homeVenue: "Dodger Stadium",
    manager: "Dave Roberts",
    owner: "Guggenheim Baseball Management"
  },
  {
    id: "sd",
    name: "San Diego Padres",
    abbreviation: "SD",
    league: "National",
    division: "West",
    city: "San Diego",
    logo: "🌴",
    primaryColor: "#2F241D",
    secondaryColor: "#FFC425",
    founded: 1969,
    championships: 0,
    homeVenue: "Petco Park",
    manager: "Mike Shildt",
    owner: "Peter Seidler"
  },
  {
    id: "sf",
    name: "San Francisco Giants",
    abbreviation: "SF",
    league: "National",
    division: "West",
    city: "San Francisco",
    logo: "⚾",
    primaryColor: "#FD5A1E",
    secondaryColor: "#27251F",
    founded: 1883,
    championships: 8,
    homeVenue: "Oracle Park",
    manager: "Bob Melvin",
    owner: "Charles Johnson"
  }
]

// New organized structure by league and division
export const mlbTeamsByLeague = {
  american: {
    central: [
      { id: 'cws', name: 'Chicago White Sox', logo: '⚾', colors: ['#27251F', '#C4CED4'] },
      { id: 'cle', name: 'Cleveland Guardians', logo: '🔴', colors: ['#E31937', '#0C2340'] },
      { id: 'det', name: 'Detroit Tigers', logo: '🐅', colors: ['#0C2340', '#FA4616'] },
      { id: 'kc', name: 'Kansas City Royals', logo: '👑', colors: ['#004687', '#BD9B60'] },
      { id: 'min', name: 'Minnesota Twins', logo: '⚾', colors: ['#002B5C', '#D31145'] }
    ],
    east: [
      { id: 'bal', name: 'Baltimore Orioles', logo: '🐦', colors: ['#DF4601', '#000000'] },
      { id: 'bos', name: 'Boston Red Sox', logo: '🧦', colors: ['#BD3039', '#0C2340'] },
      { id: 'nyy', name: 'New York Yankees', logo: '🏟️', colors: ['#0C2340', '#C4CED4'] },
      { id: 'tb', name: 'Tampa Bay Rays', logo: '☀️', colors: ['#092C5C', '#8FBCE6'] },
      { id: 'tor', name: 'Toronto Blue Jays', logo: '🐦', colors: ['#134A8E', '#1D2D5C'] }
    ],
    west: [
      { id: 'hou', name: 'Houston Astros', logo: '⭐', colors: ['#002D62', '#EB6E1F'] },
      { id: 'laa', name: 'Los Angeles Angels', logo: '😇', colors: ['#BA0021', '#003263'] },
      { id: 'oak', name: 'Oakland Athletics', logo: '🟢', colors: ['#003831', '#EFB21E'] },
      { id: 'sea', name: 'Seattle Mariners', logo: '⚓', colors: ['#0C2C56', '#005C5C'] },
      { id: 'tex', name: 'Texas Rangers', logo: '🤠', colors: ['#003278', '#C0111F'] }
    ]
  },
  national: {
    central: [
      { id: 'chc', name: 'Chicago Cubs', logo: '🐻', colors: ['#0E3386', '#CC3433'] },
      { id: 'cin', name: 'Cincinnati Reds', logo: '🔴', colors: ['#C6011F', '#000000'] },
      { id: 'mil', name: 'Milwaukee Brewers', logo: '🍺', colors: ['#0A2351', '#B6922E'] },
      { id: 'pit', name: 'Pittsburgh Pirates', logo: '🏴‍☠️', colors: ['#27251F', '#FDB827'] },
      { id: 'stl', name: 'St. Louis Cardinals', logo: '🐦', colors: ['#C41E3A', '#0C2340'] }
    ],
    east: [
      { id: 'atl', name: 'Atlanta Braves', logo: '🪓', colors: ['#CE1141', '#13274F'] },
      { id: 'mia', name: 'Miami Marlins', logo: '🐠', colors: ['#00A3E0', '#EF3340'] },
      { id: 'nym', name: 'New York Mets', logo: '⚾', colors: ['#002D72', '#FF5910'] },
      { id: 'phi', name: 'Philadelphia Phillies', logo: '🔔', colors: ['#E81828', '#002D72'] },
      { id: 'was', name: 'Washington Nationals', logo: '🏛️', colors: ['#AB0003', '#14225A'] }
    ],
    west: [
      { id: 'ari', name: 'Arizona Diamondbacks', logo: '🐍', colors: ['#A71930', '#E3D4AD'] },
      { id: 'col', name: 'Colorado Rockies', logo: '🏔️', colors: ['#33006F', '#C4CED4'] },
      { id: 'lad', name: 'Los Angeles Dodgers', logo: '⚾', colors: ['#005A9C', '#EF3E42'] },
      { id: 'sd', name: 'San Diego Padres', logo: '🌴', colors: ['#2F241D', '#FFC425'] },
      { id: 'sf', name: 'San Francisco Giants', logo: '⚾', colors: ['#FD5A1E', '#27251F'] }
    ]
  }
}

export function getMLBTeamsByLeague(league: "American" | "National" | "all"): MLBTeam[] {
  if (league === "all") {
    return mlbTeams
  }
  return mlbTeams.filter(team => team.league === league)
}

export function getMLBTeamsByDivision(division: string): MLBTeam[] {
  return mlbTeams.filter(team => team.division === division)
}

export function getMLBTeamById(id: string): MLBTeam | undefined {
  return mlbTeams.find(team => team.id === id)
}

export function getMLBTeamsByLeagueAndDivision(league: "American" | "National", division: string): MLBTeam[] {
  return mlbTeams.filter(team => team.league === league && team.division === division)
}

export const mlbLeagues = [
  { id: "all", name: "All Teams", count: 30 },
  { id: "American", name: "American League", count: 15 },
  { id: "National", name: "National League", count: 15 }
]

export const mlbDivisions = [
  { id: "AL East", name: "American League East", league: "American" },
  { id: "AL Central", name: "American League Central", league: "American" },
  { id: "AL West", name: "American League West", league: "American" },
  { id: "NL East", name: "National League East", league: "National" },
  { id: "NL Central", name: "National League Central", league: "National" },
  { id: "NL West", name: "National League West", league: "National" }
] 