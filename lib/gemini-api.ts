// Gemini API integration for team management suggestions

interface GeminiRequest {
  contents: {
    parts: {
      text: string;
    }[];
  }[];
}

interface GeminiResponse {
  candidates: {
    content: {
      parts: {
        text: string;
      }[];
    };
  }[];
}

export class GeminiAPI {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent';

  constructor(apiKey: string) {
    this.apiKey = apiKey;
  }

  async generateResponse(prompt: string): Promise<string> {
    try {
      const request: GeminiRequest = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      };

      const response = await fetch(`${this.baseUrl}?key=${this.apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: GeminiResponse = await response.json();
      
      if (data.candidates && data.candidates.length > 0) {
        return data.candidates[0].content.parts[0].text;
      } else {
        throw new Error('No response from Gemini API');
      }
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      throw error;
    }
  }

  // Generate team optimization suggestions
  async generateTeamSuggestions(context: {
    participants: number;
    teams: number;
    numberOfGroups: number;
    maxPeoplePerGroup: number;
    distributionMode: string;
    participantNames: string[];
    participantGenders: string[];
    participantLabels: string[];
  }): Promise<string> {
    const prompt = `You are an expert team management AI assistant. Analyze the following team configuration and provide specific, actionable suggestions for optimization:

**Current Configuration:**
- ${context.participants} participants: ${context.participantNames.join(', ')}
- ${context.numberOfGroups} groups
- Max ${context.maxPeoplePerGroup} people per group
- Distribution mode: ${context.distributionMode}
- Gender distribution: ${context.participantGenders.length > 0 ? context.participantGenders.join(', ') : 'Not specified'}
- Labels: ${context.participantLabels.length > 0 ? context.participantLabels.join(', ') : 'None'}

**Please provide:**
1. Analysis of the current setup
2. Specific optimization suggestions
3. Recommended changes with reasoning
4. Expected benefits of the changes

Keep your response concise, practical, and actionable. Focus on team dynamics, collaboration, and individual participation.`;

    return this.generateResponse(prompt);
  }

  // Generate team analysis
  async analyzeTeams(teams: any[]): Promise<string> {
    const teamInfo = teams.map(team => ({
      name: team.name,
      members: team.members.length,
      memberNames: team.members.map((m: any) => m.name).join(', '),
      genderDistribution: team.members.reduce((acc: any, m: any) => {
        acc[m.gender || 'other'] = (acc[m.gender || 'other'] || 0) + 1;
        return acc;
      }, {}),
      hasRepresentative: !!team.representative
    }));

    const prompt = `You are an expert team analysis AI. Analyze the following teams and provide insights:

**Teams:**
${teamInfo.map((team, index) => `
Team ${index + 1} (${team.name}):
- ${team.members} members: ${team.memberNames}
- Gender distribution: ${JSON.stringify(team.genderDistribution)}
- Has representative: ${team.hasRepresentative ? 'Yes' : 'No'}
`).join('\n')}

**Please provide:**
1. Team balance analysis
2. Strengths and weaknesses of each team
3. Suggestions for improvement
4. Overall team dynamics assessment

Focus on collaboration potential, diversity, and team effectiveness.`;

    return this.generateResponse(prompt);
  }

  // Answer specific questions about team management
  async answerQuestion(question: string, context: any): Promise<string> {
    const prompt = `You are an expert team management AI assistant. Answer the following question about team organization:

**Context:**
- ${context.participants} participants
- ${context.numberOfGroups} groups
- Distribution mode: ${context.distributionMode}
- Current setup details: ${JSON.stringify(context, null, 2)}

**Question:** ${question}

Provide a helpful, specific answer that addresses the question directly. If the question is about optimization, provide actionable suggestions. If it's about analysis, give detailed insights. Keep your response conversational but professional.`;

    return this.generateResponse(prompt);
  }
}

// Fallback responses when API is not available
export const fallbackResponses = {
  teamOptimization: [
    "Based on your current setup, I recommend using 4-6 members per team for optimal collaboration and participation.",
    "Consider enabling gender-based distribution to ensure balanced representation across all teams.",
    "Your teams are well-balanced. Consider adding representatives to improve team coordination.",
    "The label-based distribution would work well with your current participant mix.",
    "I suggest adding more participants to create more diverse and dynamic teams."
  ],
  
  analysis: [
    "Your current team configuration shows good balance and diversity.",
    "The teams appear well-structured for effective collaboration.",
    "Consider redistributing members to improve gender balance.",
    "The team sizes are optimal for individual participation.",
    "Your distribution strategy is working well for the current setup."
  ],
  
  suggestions: [
    "Try reducing team sizes to 4-5 members for better individual participation.",
    "Enable gender-based distribution for more balanced teams.",
    "Consider using label-based distribution for specialized teams.",
    "Add team representatives to improve coordination.",
    "Increase the number of teams for better group dynamics."
  ]
};

export function getRandomFallbackResponse(type: keyof typeof fallbackResponses): string {
  const responses = fallbackResponses[type];
  return responses[Math.floor(Math.random() * responses.length)];
}
