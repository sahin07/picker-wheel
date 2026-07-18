import { Country, getCountriesByRegion } from '@/data/countries'

export interface CountryAnalysis {
  country: Country
  insights: {
    cultural: string[]
    economic: string[]
    geographic: string[]
    travel: string[]
  }
  recommendations: string[]
  funFacts: string[]
  compatibility: number // 0-100
}

export interface CountrySuggestion {
  countries: Country[]
  reason: string
  category: 'culture' | 'economy' | 'geography' | 'travel' | 'education' | 'business'
}

export interface CountryComparison {
  countries: Country[]
  analysis: {
    similarities: string[]
    differences: string[]
    recommendations: string[]
  }
}

export interface TravelRecommendation {
  countries: Country[]
  reason: string
  bestTime: string
  highlights: string[]
  tips: string[]
}

// Simulated AI functions for country analysis and recommendations

export function generateCountryAnalysis(country: Country): CountryAnalysis {
  const insights = {
    cultural: [
      `Rich cultural heritage with ${country.language} as the primary language`,
      `Capital city ${country.capital} offers unique cultural experiences`,
      `Population of ${country.population.toLocaleString()} creates diverse cultural landscape`
    ],
    economic: [
      country.gdp ? `GDP of $${country.gdp}B indicates ${country.gdp > 100 ? 'strong' : 'developing'} economy` : 'Economic data available for detailed analysis',
      `Currency: ${country.currency}`,
      `Located in ${country.region} with strategic economic position`
    ],
    geographic: [
      `Covers ${country.area.toLocaleString()} km² of ${country.continent}`,
      `Timezone: ${country.timezone}`,
      `Part of ${country.region} region`
    ],
    travel: [
      `Capital ${country.capital} is a must-visit destination`,
      `Best time to visit varies by season`,
      `Rich in cultural and historical attractions`
    ]
  }

  const recommendations = [
    `Explore the capital city ${country.capital}`,
    `Learn about ${country.language} culture and traditions`,
    `Visit during local festivals and celebrations`,
    `Try local cuisine and traditional dishes`
  ]

  const funFacts = [
    `${country.flag} ${country.name} has a population of ${country.population.toLocaleString()}`,
    `The capital ${country.capital} is located in the ${country.timezone} timezone`,
    `This country uses ${country.currency} as its currency`,
    `It's part of the ${country.region} region in ${country.continent}`
  ]

  return {
    country,
    insights,
    recommendations,
    funFacts,
    compatibility: Math.floor(Math.random() * 40) + 60 // 60-100
  }
  }

export function suggestCountriesByCategory(category: string, preferences: string[] = []): CountrySuggestion {
  const categories = {
    culture: {
      reason: 'Cultural diversity and heritage',
      countries: ['France', 'Italy', 'Japan', 'India', 'Mexico', 'Egypt', 'Greece', 'Thailand']
    },
    economy: {
      reason: 'Economic opportunities and business environment',
      countries: ['United States', 'Germany', 'Japan', 'United Kingdom', 'Canada', 'Australia', 'Singapore', 'Switzerland']
    },
    geography: {
      reason: 'Geographic diversity and natural beauty',
      countries: ['Canada', 'Australia', 'Brazil', 'Norway', 'New Zealand', 'Chile', 'Iceland', 'South Africa']
    },
    travel: {
      reason: 'Tourist-friendly destinations',
      countries: ['Thailand', 'Spain', 'Italy', 'Japan', 'Australia', 'Canada', 'New Zealand', 'Portugal']
    },
    education: {
      reason: 'Educational opportunities and institutions',
      countries: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Sweden', 'Switzerland']
    },
    business: {
      reason: 'Business-friendly environment',
      countries: ['Singapore', 'Switzerland', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Netherlands', 'Denmark']
    }
  }

  const selected = categories[category as keyof typeof categories] || categories.culture
  
  // Get all countries to find real data
  const allCountries = getCountriesByRegion('all')
  
  return {
    countries: selected.countries.map(name => {
      // Try to find the real country data
      const realCountry = allCountries?.find(c => 
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(c.name.toLowerCase())
      )
      
      // Return real country data if found, otherwise use placeholder
      return realCountry || {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        flag: '🏳️',
        region: 'Various',
        code: name.substring(0, 2).toUpperCase(),
        capital: 'Capital City',
        population: 1000000,
        area: 100000,
        currency: 'Local Currency',
        language: 'Local Language',
        continent: 'Various',
        timezone: 'UTC+0'
      }
    }),
    reason: selected.reason,
    category: category as any
  }
}

export function generateTravelRecommendations(interests: string[], budget: 'low' | 'medium' | 'high'): TravelRecommendation {
  const recommendations = {
    low: {
      countries: ['Thailand', 'Vietnam', 'Portugal', 'Mexico', 'Morocco', 'India', 'Peru', 'Colombia'],
      reason: 'Budget-friendly destinations with rich experiences',
      bestTime: 'Off-peak seasons for better prices',
      highlights: ['Local markets', 'Street food', 'Cultural festivals', 'Natural attractions'],
      tips: ['Book in advance', 'Travel during shoulder season', 'Stay in local accommodations', 'Use public transportation']
    },
    medium: {
      countries: ['Spain', 'Italy', 'Greece', 'Japan', 'Australia', 'Canada', 'New Zealand', 'Chile'],
      reason: 'Balanced cost and quality experiences',
      bestTime: 'Spring or Fall for optimal weather and prices',
      highlights: ['Historic sites', 'Gourmet dining', 'Adventure activities', 'Cultural experiences'],
      tips: ['Mix luxury and budget options', 'Book tours in advance', 'Explore beyond major cities', 'Try local experiences']
    },
    high: {
      countries: ['Switzerland', 'Norway', 'Iceland', 'Japan', 'Australia', 'Canada', 'New Zealand', 'United States'],
      reason: 'Premium destinations with luxury experiences',
      bestTime: 'Any time - premium destinations offer year-round appeal',
      highlights: ['Luxury accommodations', 'Fine dining', 'Exclusive experiences', 'Premium services'],
      tips: ['Book luxury accommodations early', 'Consider private tours', 'Experience local luxury', 'Plan for premium activities']
    }
  }

  const selected = recommendations[budget]
  
  // Get all countries to find real data
  const allCountries = getCountriesByRegion('all')

  return {
    countries: selected.countries.map(name => {
      // Try to find the real country data
      const realCountry = allCountries?.find(c => 
        c.name.toLowerCase() === name.toLowerCase() ||
        c.name.toLowerCase().includes(name.toLowerCase()) ||
        name.toLowerCase().includes(c.name.toLowerCase())
      )
      
      // Return real country data if found, otherwise use placeholder
      return realCountry || {
        id: name.toLowerCase().replace(/\s+/g, '-'),
        name,
        flag: '🏳️',
        region: 'Various',
        code: name.substring(0, 2).toUpperCase(),
        capital: 'Capital City',
        population: 1000000,
        area: 100000,
        currency: 'Local Currency',
        language: 'Local Language',
        continent: 'Various',
        timezone: 'UTC+0'
      }
    }),
    reason: selected.reason,
    bestTime: selected.bestTime,
    highlights: selected.highlights,
    tips: selected.tips
  }
}

export function compareCountries(countries: Country[]): CountryComparison {
  if (countries.length < 2) {
    return {
      countries,
      analysis: {
        similarities: ['Need at least 2 countries for comparison'],
        differences: [],
        recommendations: []
      }
    }
  }

  const similarities = [
    'All countries offer unique cultural experiences',
    'Each has distinct geographic features',
    'Rich in history and traditions',
    'Diverse population and languages'
  ]

  const differences = countries.map(country => 
    `${country.name}: ${country.currency}, ${country.language}, ${country.region}`
  )

  const recommendations = [
    'Visit each country to experience their unique culture',
    'Learn about local customs and traditions',
    'Try local cuisine in each destination',
    'Explore both urban and rural areas'
  ]

  return {
    countries,
    analysis: {
      similarities,
      differences,
      recommendations
    }
  }
}

export function generateIntelligentCountrySuggestions(
  userPreferences: string[],
  previousSelections: Country[],
  context: 'travel' | 'education' | 'business' | 'culture' = 'travel'
): Country[] {
  // Simulate AI-based recommendations based on user preferences and history
  const recommendations = {
    travel: ['Thailand', 'Japan', 'Italy', 'Spain', 'Australia', 'Canada', 'New Zealand', 'Portugal'],
    education: ['United States', 'United Kingdom', 'Canada', 'Australia', 'Germany', 'Netherlands', 'Sweden', 'Switzerland'],
    business: ['Singapore', 'Switzerland', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Netherlands', 'Denmark'],
    culture: ['France', 'Italy', 'Japan', 'India', 'Mexico', 'Egypt', 'Greece', 'Thailand']
  }

  const suggestedNames = recommendations[context]
  
  // Get all countries to find real data
  const allCountries = getCountriesByRegion('all')
  
  return suggestedNames.map(name => {
    // Try to find the real country data
    const realCountry = allCountries?.find(c => 
      c.name.toLowerCase() === name.toLowerCase() ||
      c.name.toLowerCase().includes(name.toLowerCase()) ||
      name.toLowerCase().includes(c.name.toLowerCase())
    )
    
    // Return real country data if found, otherwise use placeholder
    return realCountry || {
      id: name.toLowerCase().replace(/\s+/g, '-'),
      name,
      flag: '🏳️',
      region: 'Various',
      code: name.substring(0, 2).toUpperCase(),
      capital: 'Capital City',
      population: 1000000,
      area: 100000,
      currency: 'Local Currency',
      language: 'Local Language',
      continent: 'Various',
      timezone: 'UTC+0'
    }
  })
}

export function analyzeCountryPreferences(selectedCountries: Country[]): {
  preferredRegions: string[]
  preferredCharacteristics: string[]
  recommendations: string[]
} {
  const regions = selectedCountries.map(c => c.region)
  const uniqueRegions = [...new Set(regions)]
  
  const characteristics = []
  if (selectedCountries.some(c => c.population > 50000000)) characteristics.push('Large population')
  if (selectedCountries.some(c => c.area > 1000000)) characteristics.push('Large area')
  if (selectedCountries.some(c => c.gdp && c.gdp > 100)) characteristics.push('High GDP')
  if (selectedCountries.some(c => c.continent === 'Europe')) characteristics.push('European countries')
  if (selectedCountries.some(c => c.continent === 'Asia')) characteristics.push('Asian countries')

  const recommendations = [
    'Consider exploring countries in similar regions',
    'Try countries with different characteristics for variety',
    'Explore countries with similar economic profiles',
    'Consider geographic diversity in your selections'
  ]

  return {
    preferredRegions: uniqueRegions,
    preferredCharacteristics: characteristics,
    recommendations
  }
} 