"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";

interface SettingsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  spinSpeed: number[];
  spinDuration: number[];
  enableSound: boolean;
  enableConfetti: boolean;
  backgroundColor: string;
  onSpinSpeedChange: (value: number[]) => void;
  onSpinDurationChange: (value: number[]) => void;
  onSoundChange: (value: boolean) => void;
  onConfettiChange: (value: boolean) => void;
  onBackgroundColorChange: (value: string) => void;
}

export function SettingsDialog({
  open,
  onOpenChange,
  spinSpeed,
  spinDuration,
  enableSound,
  enableConfetti,
  backgroundColor,
  onSpinSpeedChange,
  onSpinDurationChange,
  onSoundChange,
  onConfettiChange,
  onBackgroundColorChange,
}: SettingsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md bg-white border-gray-200">
        <DialogHeader>
          <DialogTitle className="text-gray-800">Wheel Settings</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">
              Spin Speed
            </Label>
            <Slider
              value={spinSpeed}
              onValueChange={onSpinSpeedChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">
              Level {spinSpeed[0]}
            </div>
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">
              Spin Duration
            </Label>
            <Slider
              value={spinDuration}
              onValueChange={onSpinDurationChange}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
            <div className="text-xs text-gray-600 mt-1">
              {spinDuration[0]} seconds
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="sound" className="text-gray-800">
              Enable Sound
            </Label>
            <Switch
              id="sound"
              checked={enableSound}
              onCheckedChange={onSoundChange}
            />
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="confetti" className="text-gray-800">
              Enable Confetti
            </Label>
            <Switch
              id="confetti"
              checked={enableConfetti}
              onCheckedChange={onConfettiChange}
            />
          </div>

          <div>
            <Label className="text-sm font-medium mb-2 block text-gray-800">
              Background Color
            </Label>
            <Input
              type="color"
              value={backgroundColor}
              onChange={(e) => onBackgroundColorChange(e.target.value)}
              className="w-full h-10 bg-white border-gray-200"
            />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
