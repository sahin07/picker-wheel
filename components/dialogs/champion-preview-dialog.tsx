import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Users, Crown, TrendingUp, Zap } from "lucide-react";
import {
  roleColors,
  popularityColors,
  difficultyColors,
} from "@/constants/lol-config";
import type { LoLChampion } from "@/types/lol-types";

interface ChampionPreviewDialogProps {
  champion: LoLChampion | null;
  onClose: () => void;
}

export function ChampionPreviewDialog({
  champion,
  onClose,
}: ChampionPreviewDialogProps) {
  return (
    <Dialog open={!!champion} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Champion Preview</DialogTitle>
        </DialogHeader>
        {champion && (
          <div className="text-center space-y-4">
            <img
              src={champion.preview || "/placeholder.svg"}
              alt={champion.name}
              className="w-32 h-32 mx-auto rounded-lg border-2"
              style={{
                borderColor:
                  roleColors[champion.role as keyof typeof roleColors],
              }}
            />
            <div>
              <h3 className="text-xl font-bold text-gray-800">
                {champion.name}
              </h3>
              <p className="text-sm text-gray-600 capitalize">
                {champion.role} • {champion.region}
              </p>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                <Badge
                  style={{
                    backgroundColor:
                      popularityColors[
                        champion.popularity as keyof typeof popularityColors
                      ],
                  }}
                  className="text-gray-800"
                >
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {champion.popularity}
                </Badge>
                <Badge
                  style={{
                    backgroundColor:
                      difficultyColors[
                        champion.difficulty as keyof typeof difficultyColors
                      ],
                  }}
                  className="text-gray-800"
                >
                  <Zap className="w-3 h-3 mr-1" />
                  {champion.difficulty}
                </Badge>
              </div>
              <div className="flex items-center justify-center gap-2 mt-2 flex-wrap">
                {champion.communityFavorite && (
                  <Badge className="bg-pink-500/20 text-pink-300 border-pink-500/30">
                    <Users className="w-3 h-3 mr-1" />
                    Community Favorite
                  </Badge>
                )}
                {champion.proPlayPresence === "high" && (
                  <Badge className="bg-yellow-500/20 text-yellow-300 border-yellow-500/30">
                    <Crown className="w-3 h-3 mr-1" />
                    Pro Play
                  </Badge>
                )}
              </div>
            </div>
            <div className="text-sm text-gray-600 space-y-2">
              <p>
                <strong className="text-gray-800">Play Style:</strong>{" "}
                {champion.playStyle}
              </p>
              <p>
                <strong className="text-gray-800">Damage Type:</strong>{" "}
                {champion.damageType}
              </p>
              <p>
                <strong className="text-gray-800">Release Year:</strong>{" "}
                {champion.releaseYear}
              </p>
              <p>
                <strong className="text-gray-800">Skins Available:</strong>{" "}
                {champion.skinCount}
              </p>
              <p>
                <strong className="text-gray-800">Esports Presence:</strong>{" "}
                {champion.esportsPresence}
              </p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
