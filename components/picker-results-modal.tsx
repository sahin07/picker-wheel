import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, Trophy, MapPin, Calendar, Building } from "lucide-react";
import { CountryFlagImage } from "@/components/country-flag-image";
import { countryFlagImageUrl } from "@/lib/country-wheel-canvas";

interface PickerResultsModalProps {
  isOpen: boolean;
  onClose: () => void;
  results: any[];
}

export default function PickerResultsModal({ isOpen, onClose, results }: PickerResultsModalProps) {
  if (!isOpen) return null;

  const getLeagueColor = (league: string | undefined) => {
    if (!league) return "bg-gray-100 text-gray-800 border-gray-200"
    return league === "American" ? "bg-red-100 text-red-800 border-red-200" : "bg-blue-100 text-blue-800 border-blue-200"
  }

  const getDivisionColor = (division: string | undefined) => {
    if (!division) return "bg-gray-100 text-gray-800 border-gray-200"
    const colors = {
      "East": "bg-green-100 text-green-800 border-green-200",
      "Central": "bg-purple-100 text-purple-800 border-purple-200",
      "West": "bg-orange-100 text-orange-800 border-orange-200"
    }
    return colors[division as keyof typeof colors] || "bg-gray-100 text-gray-800 border-gray-200"
  }

  const getChampionshipBadge = (count: number | undefined) => {
    if (!count || count === 0) return <Badge variant="outline" className="text-gray-500">No Championships</Badge>
    if (count >= 10) return <Badge className="bg-yellow-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
    if (count >= 5) return <Badge className="bg-orange-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
    return <Badge className="bg-blue-500 text-white"><Trophy className="w-3 h-3 mr-1" />{count} Championships</Badge>
  }

  const getTeamAge = (founded: number | undefined) => {
    if (!founded || isNaN(founded)) return null
    const currentYear = new Date().getFullYear()
    const age = currentYear - founded
    if (age >= 100) return <Badge className="bg-red-500 text-white"><Calendar className="w-3 h-3 mr-1" />Century Club ({age} years)</Badge>
    if (age >= 50) return <Badge className="bg-purple-500 text-white"><Calendar className="w-3 h-3 mr-1" />Established ({age} years)</Badge>
    return <Badge variant="outline"><Calendar className="w-3 h-3 mr-1" />{age} years old</Badge>
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border-2 border-purple-200 shadow-2xl">
        <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-purple-600 to-pink-600 text-white py-4">
          <CardTitle className="text-white font-bold text-lg">🎯 All Wheel Results ({results.length}) 🎯</CardTitle>
          <Button 
            variant="ghost" 
            onClick={onClose}
            className="text-white hover:bg-white/20 hover:text-white"
          >
            <X className="w-5 h-5" />
          </Button>
        </CardHeader>
        <CardContent className="max-h-[60vh] overflow-y-auto p-6 space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🎲</div>
              <h3 className="text-xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">No Results Yet</h3>
              <p className="text-purple-600">✨ Spin the wheel to see results here! ✨</p>
            </div>
                     ) : (
             <ul className="space-y-6">
               {results.map((result, idx) => (
                 <li key={result.id || `result-${idx}-${result.name || result.text || 'unknown'}`} className="p-5 bg-gradient-to-r from-white to-purple-50 rounded-xl border-2 border-purple-200 hover:border-purple-300 hover:shadow-lg transition-all duration-300 hover:scale-102">
                   <div className="flex items-start space-x-5">
                                         {/* Result Image/Icon */}
                     {(result.image || result.flag || result.emoji || result.code || result.id) && (
                       result.image && String(result.image).startsWith('http') ? (
                         <img src={result.image} alt={result.name || result.text} className="w-14 h-14 rounded-xl object-cover flex-shrink-0 border-3 border-purple-200 shadow-md" />
                       ) : countryFlagImageUrl(result) ? (
                         <CountryFlagImage
                           country={result}
                           width={80}
                           className="flex-shrink-0"
                           imgClassName="w-14 h-10 rounded-xl object-cover border-3 border-purple-200 shadow-md"
                         />
                       ) : result.flag ? (
                         <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-md">
                           {result.flag}
                         </div>
                       ) : result.emoji ? (
                         <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-md">
                           {result.emoji}
                         </div>
                       ) : (
                         <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-green-400 to-emerald-400 flex items-center justify-center text-2xl flex-shrink-0 text-white shadow-md">
                           {result.image}
                         </div>
                       )
                     )}
                    
                                         {/* Result Info */}
                     <div className="flex-1 min-w-0">
                       <div className="flex items-center gap-3 mb-4 flex-wrap">
                         <h3 className="font-bold text-xl text-purple-700">{result.name || result.text || 'Unknown'}</h3>
                         {result.wheelName && (
                           <Badge variant="outline" className="text-xs border-blue-300 text-blue-700 bg-blue-50">
                             {result.wheelName}
                           </Badge>
                         )}
                         {result.abbreviation && (
                           <Badge className="bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold border-0 shadow-md">{result.abbreviation}</Badge>
                         )}
                       </div>
                      
                      {/* Result Statistics - Only show if data exists */}
                      <div className="space-y-3">
                                                 {/* League and Division - Only for MLB teams */}
                         {(result.league || result.division) && (
                           <div className="flex flex-wrap gap-3">
                             {result.league && (
                               <Badge className={getLeagueColor(result.league)}>
                                 {result.league} League
                               </Badge>
                             )}
                             {result.division && (
                               <Badge className={getDivisionColor(result.division)}>
                                 {result.division} Division
                               </Badge>
                             )}
                           </div>
                         )}
                        
                                                 {/* Championships and Age - Only for MLB teams */}
                         {(result.championships !== undefined || result.founded) && (
                           <div className="flex flex-wrap gap-3">
                             {getChampionshipBadge(result.championships)}
                             {getTeamAge(result.founded)}
                           </div>
                         )}
                        
                                                 {/* Location and Venue - Only for MLB teams */}
                         {(result.city || result.homeVenue) && (
                           <div className="flex flex-wrap gap-5 text-sm text-gray-600">
                            {result.city && (
                              <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span>{result.city}</span>
                              </div>
                            )}
                            {result.homeVenue && (
                              <div className="flex items-center gap-1">
                                <Building className="w-3 h-3" />
                                <span>{result.homeVenue}</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Manager - Only for MLB teams */}
                        {result.manager && (
                          <div className="text-sm text-gray-600">
                            <span className="font-medium">Manager:</span> {result.manager}
                          </div>
                        )}
                        
                                                 {/* Generic result info for non-MLB results */}
                         {!result.league && !result.championships && !result.city && !result.manager && (
                           <div className="text-sm text-purple-600 bg-gradient-to-r from-purple-50 to-pink-50 p-3 rounded-lg border-2 border-purple-200 shadow-sm space-y-1">
                             <div><span className="font-bold">✨ Result:</span> {result.name || result.text || 'Unknown'}</div>
                             {(result.capital || result.region || result.language) && (
                               <div className="text-xs text-slate-600">
                                 {[
                                   result.capital && `Capital: ${result.capital}`,
                                   result.region,
                                   result.language,
                                 ]
                                   .filter(Boolean)
                                   .join(" · ")}
                               </div>
                             )}
                             {result.timestamp && (
                               <div className="text-xs text-gray-500">
                                 {new Date(result.timestamp).toLocaleString()}
                               </div>
                             )}
                           </div>
                         )}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
                     <div className="mt-8 flex justify-end">
             <Button 
               onClick={onClose}
               className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold shadow-lg"
             >
               Close
             </Button>
           </div>
        </CardContent>
      </Card>
    </div>
  );
} 