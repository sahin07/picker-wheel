import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Share2, Copy, Users, Crown, TrendingUp, Zap } from "lucide-react";
import {
  roleColors,
  popularityColors,
  difficultyColors,
} from "@/constants/lol-config";
import type { SpinResult } from "@/types/lol-types";

interface ResultDialogProps {
  result: SpinResult | null;
  onClose: () => void;
  open?: boolean;
}

export function ResultDialog({ result, onClose, open }: ResultDialogProps) {
  return (
    <Dialog open={open && !!result} onOpenChange={onClose}>
      <DialogContent className="bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800 flex items-center gap-2">
            🎉 Your Champion Awaits!
          </DialogTitle>
        </DialogHeader>
        {result && (
          <div className="text-center space-y-4">
            <div
              className="w-32 h-32 mx-auto rounded-lg border-2 flex items-center justify-center text-6xl"
              style={{
                borderColor:
                  roleColors[result.champion.role as keyof typeof roleColors],
                backgroundColor: "#f8f9fa",
              }}
            >
              {result.champion.emoji}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-800">
                {result.champion.name}
              </h3>
              <p className="text-lg text-gray-600 capitalize">
                {result.champion.role} • {result.champion.region}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <Badge
                  style={{
                    backgroundColor:
                      popularityColors[
                        result.champion
                          .popularity as keyof typeof popularityColors
                      ],
                  }}
                  className="text-gray-800"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {result.champion.popularity.toUpperCase()}
                </Badge>
                <Badge
                  style={{
                    backgroundColor:
                      difficultyColors[
                        result.champion
                          .difficulty as keyof typeof difficultyColors
                      ],
                  }}
                  className="text-gray-800"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {result.champion.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2">
                {result.champion.communityFavorite && (
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    <Users className="w-3 h-3 mr-1" />
                    Community Favorite
                  </Badge>
                )}
                {result.champion.proPlayPresence === "high" && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro Play
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600">
              <p>
                Play Style:{" "}
                <span className="text-gray-800">
                  {result.champion.playStyle}
                </span>{" "}
                • Damage:{" "}
                <span className="text-gray-800">
                  {result.champion.damageType}
                </span>{" "}
                • Released:{" "}
                <span className="text-gray-800">
                  {result.champion.releaseYear}
                </span>
              </p>
            </div>
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
              >
                <Share2 className="w-4 h-4 mr-2" />
                Share
              </Button>
              <Button
                variant="outline"
                size="sm"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 bg-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
