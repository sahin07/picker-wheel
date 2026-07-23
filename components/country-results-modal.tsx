import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock, Trophy } from "lucide-react";
import { CountryFlagImage } from "@/components/country-flag-image";

interface CountryResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: any;
  results?: any[]; // Array of all results
  aiInsights?: string[];
  isAI?: boolean;
}

export default function CountryResultsModal({ isOpen, onClose, result, results = [], aiInsights, isAI }: CountryResultsModalProps) {
  if (!isOpen) return null;

  // Use results array if available, otherwise fall back to single result
  const displayResults = results.length > 0 ? results : (result ? [result] : []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className={`w-full max-w-2xl max-h-[80vh] overflow-hidden ${isAI ? 'border-purple-200' : ''}`}>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className={isAI ? 'bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent' : ''}>
            {isAI ? 'AI Results' : 'Spin Results'} ({displayResults.length})
          </CardTitle>
          <Button variant="ghost" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto">
          {displayResults.length === 0 ? (
            <div className="text-center py-12">
              <h3 className="text-xl font-semibold mb-2">No Results</h3>
              <p className="text-gray-600">Spin the wheel to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Results List */}
              <div className="space-y-3">
                {displayResults.map((result, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isAI ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-gray-50'
                  }`}>
                    <div className="flex items-center space-x-3">
                      <div className="flex items-center justify-center w-8 h-8 bg-blue-100 text-blue-600 rounded-full text-sm font-semibold">
                        {index + 1}
                      </div>
                      <CountryFlagImage
                        country={result}
                        width={80}
                        imgClassName="h-8 w-12 rounded object-cover border border-slate-200"
                      />
                      <div>
                        <div className="font-semibold text-lg">{result.name}</div>
                        {result.region && <div className="text-sm text-gray-600">{result.region}</div>}
                        {result.capital && <div className="text-xs text-gray-500">Capital: {result.capital}</div>}
                      </div>
                    </div>
                    
                    {/* Spin timestamp if available */}
                    {result.timestamp && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Insights for the latest result */}
              {isAI && aiInsights && aiInsights.length > 0 && displayResults.length > 0 && (
                <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-600 mb-3 flex items-center gap-2">
                    <span>🧠</span>
                    AI Insights
                  </h4>
                  <div className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <div key={index} className="p-3 bg-white rounded-lg border-l-4 border-purple-400">
                        <p className="text-sm text-gray-700">{insight}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Country Details for the latest result */}
              {displayResults.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Trophy className="w-4 h-4" />
                    Latest Country Details
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="font-medium">Population:</span> {displayResults[displayResults.length - 1].population?.toLocaleString()}
                    </div>
                    <div>
                      <span className="font-medium">Area:</span> {displayResults[displayResults.length - 1].area?.toLocaleString()} km²
                    </div>
                    <div>
                      <span className="font-medium">Currency:</span> {displayResults[displayResults.length - 1].currency}
                    </div>
                    <div>
                      <span className="font-medium">Language:</span> {displayResults[displayResults.length - 1].language}
                    </div>
                    <div>
                      <span className="font-medium">Timezone:</span> {displayResults[displayResults.length - 1].timezone}
                    </div>
                    {displayResults[displayResults.length - 1].gdp && (
                      <div>
                        <span className="font-medium">GDP:</span> ${displayResults[displayResults.length - 1].gdp}B
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button 
              onClick={onClose}
              className={isAI ? 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700' : ''}
            >
              Close
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 