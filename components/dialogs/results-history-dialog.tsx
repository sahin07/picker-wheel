"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, Trash2, Share2, Users, Crown } from "lucide-react";
import { roleColors, popularityColors } from "@/constants/lol-config";
import type { SpinResult } from "@/types/lol-types";

interface ResultsHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  results: SpinResult[];
  onClearResults: () => void;
}

export function ResultsHistoryDialog({
  open,
  onOpenChange,
  results,
  onClearResults,
}: ResultsHistoryDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            🏆 LoL Champion Selection History ({results.length} spins)
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {results.length === 0 ? (
            <p className="text-center text-gray-600">
              No champions selected yet. Spin the wheel to start your League
              journey!
            </p>
          ) : (
            <>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {results.length} champions selected
                </span>
                <div className="space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      const exportData = results.map((result, index) => ({
                        rank: index + 1,
                        champion: result.champion.name,
                        role: result.champion.role,
                        region: result.champion.region,
                        difficulty: result.champion.difficulty,
                        popularity: result.champion.popularity,
                        timestamp: result.timestamp.toLocaleString(),
                        wheelName: (result as any).wheelName || "Current Wheel",
                      }));

                      const csvContent = [
                        "Rank,Champion,Role,Region,Difficulty,Popularity,Timestamp,Wheel Name",
                        ...exportData.map(
                          (row) =>
                            `${row.rank},"${row.champion}","${row.role}","${row.region}","${row.difficulty}","${row.popularity}","${row.timestamp}","${row.wheelName}"`
                        ),
                      ].join("\n");

                      const blob = new Blob([csvContent], { type: "text/csv" });
                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");
                      a.href = url;
                      a.download = `lol-champion-results-${
                        new Date().toISOString().split("T")[0]
                      }.csv`;
                      document.body.appendChild(a);
                      a.click();
                      document.body.removeChild(a);
                      window.URL.revokeObjectURL(url);
                    }}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Export
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onClearResults}
                    className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </div>
              <div className="max-h-96 overflow-y-auto space-y-3">
                {results.map((result, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg border">
                    {/* Main Result Row */}
                    <div className="flex items-center space-x-3 mb-3">
                      <div className="text-2xl">{result.champion.emoji}</div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {result.champion.name}
                          {(result as any).wheelName && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-xs bg-blue-50 text-blue-700"
                            >
                              {(result as any).wheelName}
                            </Badge>
                          )}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge
                            style={{
                              backgroundColor:
                                roleColors[
                                  result.champion
                                    .role as keyof typeof roleColors
                                ],
                            }}
                            className="text-white text-xs"
                          >
                            {result.champion.role}
                          </Badge>
                          <Badge
                            style={{
                              backgroundColor:
                                popularityColors[
                                  result.champion
                                    .popularity as keyof typeof popularityColors
                                ],
                            }}
                            className="text-white text-xs"
                          >
                            {result.champion.popularity}
                          </Badge>
                          <Badge
                            variant="outline"
                            className="text-gray-600 text-xs"
                          >
                            {result.champion.region}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-sm text-gray-500">
                        #{results.length - index}
                      </div>
                    </div>

                    {/* Enhanced Details */}
                    <div className="space-y-2 pt-3 border-t border-gray-200">
                      <div className="grid grid-cols-2 gap-4 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Crown className="w-3 h-3 text-yellow-500" />
                            <span>Difficulty</span>
                          </div>
                          <span className="font-medium">
                            {result.champion.difficulty}
                          </span>
                        </div>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1">
                            <Users className="w-3 h-3 text-blue-500" />
                            <span>Region</span>
                          </div>
                          <span className="font-medium">
                            {result.champion.region}
                          </span>
                        </div>
                      </div>

                      {/* Special Features */}
                      <div className="flex items-center gap-2 text-xs">
                        {result.champion.communityFavorite && (
                          <Badge
                            variant="outline"
                            className="bg-pink-50 text-pink-700 border-pink-200"
                          >
                            <Users className="w-3 h-3 mr-1" />
                            Community Favorite
                          </Badge>
                        )}
                        {result.champion.proPlayPresence === "high" && (
                          <Badge
                            variant="outline"
                            className="bg-yellow-50 text-yellow-700 border-yellow-200"
                          >
                            <Crown className="w-3 h-3 mr-1" />
                            Pro Play
                          </Badge>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-xs text-gray-500">
                        {result.timestamp.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Summary Stats */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📊 Summary</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Spins:</span>
                    <span className="font-semibold ml-2">{results.length}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Unique Champions:</span>
                    <span className="font-semibold ml-2">
                      {new Set(results.map((r) => r.champion.id)).size}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Most Recent:</span>
                    <span className="font-semibold ml-2">
                      {results[0]?.champion.name}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">First Spin:</span>
                    <span className="font-semibold ml-2">
                      {results[results.length - 1]?.champion.name}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const shareText =
                      `🏆 My LoL Champion Selection History (${results.length} spins)\n\n` +
                      `Most Recent: ${results[0]?.champion.name}\n` +
                      `Unique Champions: ${
                        new Set(results.map((r) => r.champion.id)).size
                      }\n\n` +
                      `Top 5 Champions:\n` +
                      results
                        .slice(0, 5)
                        .map(
                          (result, index) =>
                            `${index + 1}. ${result.champion.name} (${
                              result.champion.role
                            })`
                        )
                        .join("\n") +
                      `\n\nGenerated by LoL Champions Picker Wheel`;

                    if (navigator.share) {
                      navigator
                        .share({
                          title: "LoL Champion Selection History",
                          text: shareText,
                        })
                        .catch(console.error);
                    } else {
                      navigator.clipboard
                        .writeText(shareText)
                        .then(() => {
                          alert("Results copied to clipboard!");
                        })
                        .catch(() => {
                          alert("Unable to copy to clipboard");
                        });
                    }
                  }}
                >
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Results
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    const exportData = results.map((result, index) => ({
                      rank: index + 1,
                      champion: result.champion.name,
                      role: result.champion.role,
                      region: result.champion.region,
                      difficulty: result.champion.difficulty,
                      popularity: result.champion.popularity,
                      timestamp: result.timestamp.toLocaleString(),
                      wheelName: (result as any).wheelName || "Current Wheel",
                    }));

                    const csvContent = [
                      "Rank,Champion,Role,Region,Difficulty,Popularity,Timestamp,Wheel Name",
                      ...exportData.map(
                        (row) =>
                          `${row.rank},"${row.champion}","${row.role}","${row.region}","${row.difficulty}","${row.popularity}","${row.timestamp}","${row.wheelName}"`
                      ),
                    ].join("\n");

                    const blob = new Blob([csvContent], { type: "text/csv" });
                    const url = window.URL.createObjectURL(blob);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = `lol-champion-results-${
                      new Date().toISOString().split("T")[0]
                    }.csv`;
                    document.body.appendChild(a);
                    a.click();
                    document.body.removeChild(a);
                    window.URL.revokeObjectURL(url);
                  }}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
              </div>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
