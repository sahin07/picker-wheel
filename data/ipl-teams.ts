export interface IPLTeam {
  id: string
  name: string
  abbreviation: string
  city: string
  logo: string
  primaryColor: string
  secondaryColor: string
  founded: number
  championships: number
  homeVenue: string
  captain: string
  owner: string
}

export const iplTeams: IPLTeam[] = [
  {
    id: "csk",
    name: "Chennai Super Kings",
    abbreviation: "CSK",
    city: "Chennai",
    logo: "🦁",
    primaryColor: "#FFFF00",
    secondaryColor: "#000080",
    founded: 2008,
    championships: 5,
    homeVenue: "M. A. Chidambaram Stadium",
    captain: "MS Dhoni",
    owner: "India Cements"
  },
  {
    id: "mi",
    name: "Mumbai Indians",
    abbreviation: "MI",
    city: "Mumbai",
    logo: "🔵",
    primaryColor: "#004BA0",
    secondaryColor: "#D1D5DB",
    founded: 2008,
    championships: 5,
    homeVenue: "Wankhede Stadium",
    captain: "Hardik Pandya",
    owner: "Reliance Industries"
  },
  {
    id: "kkr",
    name: "Kolkata Knight Riders",
    abbreviation: "KKR",
    city: "Kolkata",
    logo: "🟣",
    primaryColor: "#2E0854",
    secondaryColor: "#FFD700",
    founded: 2008,
    championships: 2,
    homeVenue: "Eden Gardens",
    captain: "Shreyas Iyer",
    owner: "Knight Riders Sports"
  },
  {
    id: "rcb",
    name: "Royal Challengers Bangalore",
    abbreviation: "RCB",
    city: "Bangalore",
    logo: "🔴",
    primaryColor: "#D1171C",
    secondaryColor: "#000000",
    founded: 2008,
    championships: 0,
    homeVenue: "M. Chinnaswamy Stadium",
    captain: "Faf du Plessis",
    owner: "United Spirits"
  },
  {
    id: "dc",
    name: "Delhi Capitals",
    abbreviation: "DC",
    city: "Delhi",
    logo: "🔵",
    primaryColor: "#0078BC",
    secondaryColor: "#FF0000",
    founded: 2008,
    championships: 0,
    homeVenue: "Arun Jaitley Stadium",
    captain: "Rishabh Pant",
    owner: "GMR Group & JSW Group"
  },
  {
    id: "pbks",
    name: "Punjab Kings",
    abbreviation: "PBKS",
    city: "Mohali",
    logo: "🔴",
    primaryColor: "#ED1B24",
    secondaryColor: "#000000",
    founded: 2008,
    championships: 0,
    homeVenue: "IS Bindra Stadium",
    captain: "Shikhar Dhawan",
    owner: "Mohit Burman, Ness Wadia, Preity Zinta"
  },
  {
    id: "rr",
    name: "Rajasthan Royals",
    abbreviation: "RR",
    city: "Jaipur",
    logo: "🔵",
    primaryColor: "#254AA5",
    secondaryColor: "#FFD700",
    founded: 2008,
    championships: 1,
    homeVenue: "Sawai Mansingh Stadium",
    captain: "Sanju Samson",
    owner: "Manoj Badale"
  },
  {
    id: "srh",
    name: "Sunrisers Hyderabad",
    abbreviation: "SRH",
    city: "Hyderabad",
    logo: "🟠",
    primaryColor: "#FF822A",
    secondaryColor: "#000000",
    founded: 2013,
    championships: 1,
    homeVenue: "Rajiv Gandhi Stadium",
    captain: "Pat Cummins",
    owner: "Kalanithi Maran"
  },
  {
    id: "gt",
    name: "Gujarat Titans",
    abbreviation: "GT",
    city: "Ahmedabad",
    logo: "🟢",
    primaryColor: "#1C1C1C",
    secondaryColor: "#00D4AA",
    founded: 2022,
    championships: 1,
    homeVenue: "Narendra Modi Stadium",
    captain: "Shubman Gill",
    owner: "CVC Capital Partners"
  },
  {
    id: "lsg",
    name: "Lucknow Super Giants",
    abbreviation: "LSG",
    city: "Lucknow",
    logo: "🔵",
    primaryColor: "#A7C5EB",
    secondaryColor: "#FF6B35",
    founded: 2022,
    championships: 0,
    homeVenue: "BRSABV Ekana Stadium",
    captain: "KL Rahul",
    owner: "RPSG Group"
  }
]

// Organized by performance tiers
export const iplTeamsByTier = {
  champions: iplTeams.filter(team => team.championships > 0),
  consistent: iplTeams.filter(team => team.championships === 0 && team.founded <= 2010),
  newTeams: iplTeams.filter(team => team.founded >= 2022)
}

// Get teams by city
export function getIPLTeamsByCity(city: string): IPLTeam[] {
  return iplTeams.filter(team => team.city.toLowerCase().includes(city.toLowerCase()))
}

// Get teams by performance
export function getIPLTeamsByPerformance(minChampionships: number = 0): IPLTeam[] {
  return iplTeams.filter(team => team.championships >= minChampionships)
}

// Get random IPL teams
export function getRandomIPLTeams(count: number): IPLTeam[] {
  const shuffled = [...iplTeams].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, count)
}
