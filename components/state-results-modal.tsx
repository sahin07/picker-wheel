import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, Clock } from "lucide-react";

interface StateResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  result?: any;
  results?: any[]; // Array of all results
  aiInsights?: string[];
  isAI?: boolean;
}

export default function StateResultsModal({ isOpen, onClose, result, results = [], aiInsights, isAI }: StateResultsModalProps) {
  if (!isOpen) return null;

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
              <h3 className="text-xl font-semibold mb-2">No Results Yet</h3>
              <p className="text-gray-600">Spin the wheel to see results here.</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="space-y-3">
                {displayResults.map((result, index) => (
                  <div key={index} className={`flex items-center space-x-4 p-4 rounded-lg border ${
                    isAI ? 'bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200' : 'bg-gray-50'
                  }`}>
                    {result.flag && <span className="text-3xl">{result.flag}</span>}
                    <div className="flex-1">
                      <div className="font-semibold text-lg">{result.name}</div>
                      {result.country && <div className="text-sm text-gray-600">{result.country}</div>}
                      {result.capital && <div className="text-xs text-gray-500">Capital: {result.capital}</div>}
                      {result.abbreviation && <div className="text-xs text-gray-500">Abbreviation: {result.abbreviation}</div>}
                    </div>
                    {result.timestamp && (
                      <div className="flex items-center gap-1 text-xs text-gray-500 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(result.timestamp).toLocaleTimeString()}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* AI Insights */}
              {isAI && aiInsights && aiInsights.length > 0 && (
                <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border border-purple-200">
                  <h4 className="font-semibold text-purple-800 mb-3">🤖 AI Insights</h4>
                  <ul className="space-y-2">
                    {aiInsights.map((insight, index) => (
                      <li key={index} className="text-sm text-purple-700 flex items-start gap-2">
                        <span className="text-purple-500 mt-1">•</span>
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Latest State Details */}
              {displayResults.length > 0 && (
                <div className="mt-6 p-4 bg-gray-50 rounded-lg border">
                  <h4 className="font-semibold text-gray-800 mb-3">Latest State Details</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-gray-600">Name:</span>
                      <span className="ml-2">{displayResults[displayResults.length - 1].name}</span>
                    </div>
                    <div>
                      <span className="font-medium text-gray-600">Country:</span>
                      <span className="ml-2">{displayResults[displayResults.length - 1].country}</span>
                    </div>
                    {displayResults[displayResults.length - 1].capital && (
                      <div>
                        <span className="font-medium text-gray-600">Capital:</span>
                        <span className="ml-2">{displayResults[displayResults.length - 1].capital}</span>
                      </div>
                    )}
                    {displayResults[displayResults.length - 1].abbreviation && (
                      <div>
                        <span className="font-medium text-gray-600">Abbreviation:</span>
                        <span className="ml-2">{displayResults[displayResults.length - 1].abbreviation}</span>
                      </div>
                    )}
                    {displayResults[displayResults.length - 1].population && (
                      <div>
                        <span className="font-medium text-gray-600">Population:</span>
                        <span className="ml-2">{displayResults[displayResults.length - 1].population.toLocaleString()}</span>
                      </div>
                    )}
                    {displayResults[displayResults.length - 1].area && (
                      <div>
                        <span className="font-medium text-gray-600">Area:</span>
                        <span className="ml-2">{displayResults[displayResults.length - 1].area.toLocaleString()} km²</span>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
          <div className="mt-6 flex justify-end">
            <Button onClick={onClose}>Close</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 