import type { RefObject } from "react";
import type { LoLChampion } from "@/types/lol-types";
import { roleColors, popularityColors } from "@/constants/lol-config";

interface WheelComponentProps {
  items: LoLChampion[];
  rotation: number;
  isSpinning: boolean;
  spinDuration: number;
  wheelRef: RefObject<HTMLDivElement>;
  displayMode?: "emoji-name" | "emoji" | "name";
  currentTheme?: string;
  onManualSelect?: (champion: LoLChampion) => void;
  actionMode?: "normal" | "elimination" | "manual";
}

export function WheelComponent({
  items,
  rotation,
  isSpinning,
  spinDuration,
  wheelRef,
  displayMode = "emoji-name",
  currentTheme = "classic",
  onManualSelect,
  actionMode = "normal",
}: WheelComponentProps) {
  const segmentAngle = items.length > 0 ? 360 / items.length : 0;
  const radius = 300; // Match Fortnite wheel size
  const centerX = 350; // Match Fortnite wheel size
  const centerY = 350; // Match Fortnite wheel size
  const wheelSize = 700; // Match Fortnite wheel size

  // Show empty wheel when no champions are selected
  if (items.length === 0) {
    return (
      <div className="relative">
        <div ref={wheelRef}>
          <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl">
            {/* Empty wheel circle */}
            <circle
              cx={centerX}
              cy={centerY}
              r={radius}
              fill="#f3f4f6"
              stroke="#d1d5db"
              strokeWidth="3"
            />
            {/* Center text */}
            <text
              x={centerX}
              y={centerY - 20}
              fill="#6b7280"
              fontSize="18"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              No Champions Selected
            </text>
            <text
              x={centerX}
              y={centerY + 10}
              fill="#9ca3af"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
            >
              Select champions to start spinning
            </text>
            {/* Center spin button */}
            <circle
              cx={centerX}
              cy={centerY + 80}
              r="40"
              fill="#374151"
              stroke="#1f2937"
              strokeWidth="2"
            />
            <text
              x={centerX}
              y={centerY + 80}
              fill="white"
              fontSize="14"
              textAnchor="middle"
              dominantBaseline="middle"
              fontWeight="bold"
            >
              SPIN
            </text>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="relative">
      <div
        ref={wheelRef}
        style={{
          transform: `rotate(${rotation}deg)`,
          transition: isSpinning
            ? `transform ${spinDuration}s cubic-bezier(0.23, 1, 0.32, 1)`
            : "none",
        }}
      >
        <svg width={wheelSize} height={wheelSize} className="drop-shadow-2xl">
          {/* Enhanced glow effects */}
          <defs>
            <filter id="glow">
              <feGaussianBlur stdDeviation="4" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
            <filter id="strongGlow">
              <feGaussianBlur stdDeviation="6" result="coloredBlur" />
              <feMerge>
                <feMergeNode in="coloredBlur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {items.map((champion, index) => {
            const startAngle = index * segmentAngle;
            const endAngle = (index + 1) * segmentAngle;
            const startAngleRad = (startAngle * Math.PI) / 180;
            const endAngleRad = (endAngle * Math.PI) / 180;

            const x1 = centerX + radius * Math.cos(startAngleRad);
            const y1 = centerY + radius * Math.sin(startAngleRad);
            const x2 = centerX + radius * Math.cos(endAngleRad);
            const y2 = centerY + radius * Math.sin(endAngleRad);

            const largeArcFlag = segmentAngle > 180 ? 1 : 0;

            const pathData = [
              `M ${centerX} ${centerY}`,
              `L ${x1} ${y1}`,
              `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
              "Z",
            ].join(" ");

            const textAngle = startAngle + segmentAngle / 2;
            const textRadius = radius * 0.7;
            const textX =
              centerX + textRadius * Math.cos((textAngle * Math.PI) / 180);
            const textY =
              centerY + textRadius * Math.sin((textAngle * Math.PI) / 180);

            // Use role color as primary, popularity as accent
            const roleColor =
              roleColors[champion.role as keyof typeof roleColors] || "#6B7280";
            const popularityColor =
              popularityColors[
                champion.popularity as keyof typeof popularityColors
              ] || "#6B7280";

            // Create gradient effect for S-tier champions
            const isSTier = champion.popularity === "S-tier";

            return (
              <g key={champion.id}>
                <path
                  d={pathData}
                  fill={roleColor}
                  stroke={isSTier ? popularityColor : "#ffffff"}
                  strokeWidth={isSTier ? "3" : "2"}
                  opacity={0.9}
                  filter={
                    isSTier
                      ? "url(#strongGlow)"
                      : champion.communityFavorite
                      ? "url(#glow)"
                      : undefined
                  }
                  style={{
                    cursor: actionMode === "manual" ? "pointer" : "default",
                  }}
                  onClick={() => {
                    if (actionMode === "manual" && onManualSelect) {
                      onManualSelect(champion);
                    }
                  }}
                />
                {/* Inner accent for S-tier champions */}
                {isSTier && (
                  <path
                    d={pathData}
                    fill="none"
                    stroke={popularityColor}
                    strokeWidth="1"
                    opacity={0.6}
                    transform={`scale(0.8) translate(${centerX * 0.2}, ${
                      centerY * 0.2
                    })`}
                  />
                )}
                {/* Render based on display mode */}
                {displayMode === "emoji-name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="16"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.emoji}{" "}
                    {champion.name.length > 8
                      ? champion.name.substring(0, 6) + "..."
                      : champion.name}
                  </text>
                )}

                {displayMode === "emoji" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="28"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.emoji}
                  </text>
                )}

                {displayMode === "name" && (
                  <text
                    x={textX}
                    y={textY}
                    fill="white"
                    fontSize="14"
                    fontWeight="bold"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    transform={`rotate(${textAngle}, ${textX}, ${textY})`}
                    style={{ textShadow: "2px 2px 4px rgba(0,0,0,0.8)" }}
                  >
                    {champion.name.length > 12
                      ? champion.name.substring(0, 10) + "..."
                      : champion.name}
                  </text>
                )}
              </g>
            );
          })}

          {/* Center circle */}
          <circle
            cx={centerX}
            cy={centerY}
            r="60"
            fill="#1f2937"
            stroke="#ffffff"
            strokeWidth="4"
          />
          <text
            x={centerX}
            y={centerY}
            fill="white"
            fontSize="20"
            fontWeight="bold"
            textAnchor="middle"
            dominantBaseline="middle"
          >
            SPIN
          </text>
        </svg>
      </div>

      {/* Pointer - pointing left towards wheel (3 o'clock position) */}
      <div className="absolute top-1/2 right-8 transform -translate-y-1/2">
        <div className="w-0 h-0 border-t-[20px] border-b-[20px] border-r-[40px] border-t-transparent border-b-transparent border-r-red-600"></div>
      </div>
    </div>
  );
}
