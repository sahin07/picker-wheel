"use client"

import { useTeamPickerStore } from "@/stores/team-picker-store"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Crown, Users, Download, Share2, RotateCcw, Volume2, VolumeX } from "lucide-react"
import { useSettingsStore } from "@/stores/settings-store"
import { useEffect, useState, useRef } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Settings as SettingsIcon } from "lucide-react"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"

const TEAM_COLORS = [
  "#166534", // green
  "#eab308", // yellow
  "#2563eb", // blue
  "#dc2626", // red
  "#8b5cf6", // purple
  "#22c55e", // light green
  "#f59e42", // orange
  "#f472b6", // pink
  "#0ea5e9", // sky
  "#f43f5e", // rose
];

// Add TeamPickerWheel subcomponent
function TeamPickerWheel({ teams, isSpinning, currentRotation }: { teams: any[]; isSpinning: boolean; currentRotation: number }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 600; // Match the canvas size
    const center = size / 2;
    const radius = size / 2 - 22;
    ctx.clearRect(0, 0, size, size);
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate((currentRotation * Math.PI) / 180);
    if (!teams.length) {
      ctx.beginPath();
      ctx.arc(0, 0, radius, 0, 2 * Math.PI);
      ctx.fillStyle = "#e5e7eb";
      ctx.fill();
      ctx.strokeStyle = "#9ca3af";
      ctx.lineWidth = 2;
      ctx.stroke();
      ctx.restore();
      return;
    }
    const anglePerSegment = (2 * Math.PI) / teams.length;
    teams.forEach((team, index) => {
      const startAngle = index * anglePerSegment - Math.PI / 2;
      const endAngle = startAngle + anglePerSegment;
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius, startAngle, endAngle);
      ctx.closePath();
      
      // Beautiful gradient colors for wheel segments
      const gradientColors = [
        { start: "#ef4444", end: "#dc2626" }, // red gradient
        { start: "#3b82f6", end: "#2563eb" }, // blue gradient
        { start: "#10b981", end: "#059669" }, // green gradient
        { start: "#f59e0b", end: "#d97706" }, // amber gradient
        { start: "#8b5cf6", end: "#7c3aed" }, // purple gradient
        { start: "#f97316", end: "#ea580c" }, // orange gradient
        { start: "#06b6d4", end: "#0891b2" }, // cyan gradient
        { start: "#84cc16", end: "#65a30d" }, // lime gradient
        { start: "#ec4899", end: "#db2777" }, // pink gradient
        { start: "#6366f1", end: "#4f46e5" }, // indigo gradient
        { start: "#14b8a6", end: "#0d9488" }, // teal gradient
        { start: "#f43f5e", end: "#e11d48" }, // rose gradient
      ];
      
      const colorIndex = index % gradientColors.length;
      const colors = gradientColors[colorIndex];
      
      // Create gradient for each segment
      const gradient = ctx.createRadialGradient(0, 0, 0, 0, 0, radius);
      gradient.addColorStop(0, colors.start);
      gradient.addColorStop(1, colors.end);
      
      ctx.fillStyle = gradient;
      ctx.fill();
      
      // Enhanced border with gradient
      ctx.strokeStyle = "#ffffff";
      ctx.lineWidth = 4;
      ctx.stroke();
      
      // Add inner shadow effect
      ctx.save();
      ctx.globalCompositeOperation = "multiply";
      ctx.beginPath();
      ctx.moveTo(0, 0);
      ctx.arc(0, 0, radius * 0.8, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = "rgba(0, 0, 0, 0.1)";
      ctx.fill();
      ctx.restore();
      
      // Draw team name with enhanced styling
      ctx.save();
      ctx.rotate(startAngle + anglePerSegment / 2);

      // Use a better radius for text positioning
      const textRadius = radius * 0.65;
      
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      
      // Enhanced text styling
      ctx.font = "bold 16px Arial"; // Increased font size
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 3;
      
      // Better text truncation
      let displayText = team.name;
      if (team.name.length > 10) {
        displayText = team.name.substring(0, 10) + "...";
      }
      
      // Draw text with shadow effect
      ctx.strokeText(displayText, textRadius, 0);
      ctx.fillStyle = "#ffffff";
      ctx.fillText(displayText, textRadius, 0);
      
      // Add small icon or number
      const iconRadius = radius * 0.85;
      ctx.beginPath();
      ctx.arc(iconRadius * Math.cos(startAngle + anglePerSegment / 2), iconRadius * Math.sin(startAngle + anglePerSegment / 2), 12, 0, 2 * Math.PI);
      ctx.fillStyle = "rgba(255, 255, 255, 0.9)";
      ctx.fill();
      ctx.strokeStyle = "#000000";
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw team member count
      ctx.fillStyle = "#000000";
      ctx.font = "bold 12px Arial";
      const memberCount = team.members ? team.members.length : 0;
      ctx.fillText(memberCount.toString(), iconRadius * Math.cos(startAngle + anglePerSegment / 2), iconRadius * Math.sin(startAngle + anglePerSegment / 2) + 4);
      
      ctx.restore();
    });
    ctx.restore();
    
    // Enhanced center circle with gradient
    const centerGradient = ctx.createRadialGradient(center, center, 0, center, center, 45);
    centerGradient.addColorStop(0, "#1f2937");
    centerGradient.addColorStop(1, "#111827");
    
    ctx.beginPath();
    ctx.arc(center, center, 45, 0, 2 * Math.PI);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 3;
    ctx.stroke();
    
    // Add inner shadow to center
    ctx.beginPath();
    ctx.arc(center, center, 40, 0, 2 * Math.PI);
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();
    
    // Draw SPIN text in center with enhanced styling
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 18px Arial"; // Increased font size
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("SPIN", center, center);
    
    // Enhanced pointer with gradient (moved to 12 o'clock position)
    ctx.save();
    ctx.translate(center, center);
    ctx.rotate(-Math.PI / 2); // Rotate to 12 o'clock position (-90 degrees)
    
    // Create gradient for pointer
    const pointerGradient = ctx.createLinearGradient(radius - 25, -20, radius + 15, 20);
    pointerGradient.addColorStop(0, "#dc2626");
    pointerGradient.addColorStop(1, "#b91c1c");
    
    ctx.beginPath();
    ctx.moveTo(radius - 25, 0);
    ctx.lineTo(radius + 15, -20);
    ctx.lineTo(radius + 15, 20);
    ctx.closePath();
    ctx.fillStyle = pointerGradient;
    ctx.fill();
    ctx.strokeStyle = "#ffffff";
    ctx.lineWidth = 4;
    ctx.stroke();
    
    // Add pointer shadow
    ctx.beginPath();
    ctx.moveTo(radius - 20, 0);
    ctx.lineTo(radius + 10, -15);
    ctx.lineTo(radius + 10, 15);
    ctx.closePath();
    ctx.fillStyle = "rgba(0, 0, 0, 0.3)";
    ctx.fill();
    
    ctx.restore();
  }, [teams, isSpinning, currentRotation]);
  return <canvas ref={canvasRef} width={600} height={600} />;
}

export default function TeamPickerSection({ showActionButtons = false, onConfettiChange }: { showActionButtons?: boolean; onConfettiChange?: (show: boolean) => void }) {
  const { teams, participants, isGenerating, viewMode, resultTitle, exportToCSV, clearTeams, setViewMode, showGenderInResult, setShowGenderInResult, showLabelInResult, setShowLabelInResult, pickRepresentatives, setPickRepresentatives, generateTeams, customTeamNames, setCustomTeamNames, setNumberOfGroups, setMaxPeoplePerGroup, actionMode, setActionMode, eliminatedTeams, eliminateTeam, getAvailableTeams, restoreAllTeams } = useTeamPickerStore()
  const { settings } = useSettingsStore()
  const [showModal, setShowModal] = useState(false)
  const { showSpinner = false, pendingGenerate = false, setShowSpinner, setPendingGenerate } = useTeamPickerStore()

  const [showTeamNamesDialog, setShowTeamNamesDialog] = useState(false)
  const [tempTeamNames, setTempTeamNames] = useState<string[]>(customTeamNames || [])
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [spinAngle, setSpinAngle] = useState(0);
  const [currentRotation, setCurrentRotation] = useState(0);
  const [spinRotation, setSpinRotation] = useState(0);
  const [animateTeams, setAnimateTeams] = useState(false);
  const [muted, setMuted] = useState(false);
  const { selectedTeam, setSelectedTeam } = useTeamPickerStore();
  const [spinCompleted, setSpinCompleted] = useState(false);
  const [isGeneratingTeams, setIsGeneratingTeams] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [teamsJustGenerated, setTeamsJustGenerated] = useState(false);

  // Provide default no-op functions if undefined
  const safeSetShowGenderInResult = setShowGenderInResult || (() => {});
  const safeSetShowLabelInResult = setShowLabelInResult || (() => {});
  const safeSetShowSpinner = setShowSpinner || (() => {});
  const safeSetPendingGenerate = setPendingGenerate || (() => {});

  const openTeamNamesDialog = () => {
    const names = Array.from({ length: teams.length }, (_, i) => customTeamNames[i] || `Team ${i + 1}`)
    setTempTeamNames(names)
    setShowTeamNamesDialog(true)
  }
  const saveTeamNames = () => {
    setCustomTeamNames(tempTeamNames)
    setShowTeamNamesDialog(false)
  }

  useEffect(() => {
    const handler = () => setShowModal(true)
    window.addEventListener('open-groups-board', handler)
    return () => window.removeEventListener('open-groups-board', handler)
  }, [])

  // Spinner and animation logic
  useEffect(() => {
    if (isGenerating) {
      safeSetShowSpinner(true)
      setAnimateTeams(false)
      setSelectedTeam(null)
      setSpinCompleted(false) // Reset spin completed state
      setTeamsJustGenerated(false) // Reset teams just generated flag
    } else if (viewMode === "result") {
      safeSetShowSpinner(false)
      // Trigger team animation after a short delay
      setTimeout(() => setAnimateTeams(true), 500)
    }
  }, [isGenerating, viewMode])

  // Draw the spinner wheel
  useEffect(() => {
    if (!showSpinner) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const size = 240;
    const center = size / 2;
    const radius = size / 2 - 8;
    ctx.clearRect(0, 0, size, size);
    const colors = ["#b3ac3e", "#f6be23", "#2d5017", "#fff59d"];
    for (let i = 0; i < 4; i++) {
      ctx.beginPath();
      ctx.moveTo(center, center);
      ctx.arc(center, center, radius, ((i * Math.PI) / 2) + spinAngle, (((i + 1) * Math.PI) / 2) + spinAngle);
      ctx.closePath();
      ctx.fillStyle = colors[i];
      ctx.fill();
    }
    // Draw center white circle
    ctx.beginPath();
    ctx.arc(center, center, 48, 0, 2 * Math.PI);
    ctx.fillStyle = "#fff";
    ctx.fill();
  }, [showSpinner, spinAngle]);

  // Animation loop for spinning (like other wheels)
  useEffect(() => {
    if (!showSpinner) return;
    if (isGeneratingTeams) return; // Don't run animation while generating teams
    if (isProcessing) return; // Prevent multiple rapid clicks
    
    // Handle team generation when START button is clicked
    if (pendingGenerate && participants.length > 0) {
      // Show generating teams spinner
      setIsGeneratingTeams(true);
      setIsProcessing(true);
      
      // Set reasonable defaults based on participant count
      const participantCount = participants.length;
      let optimalGroups = 3;
      let optimalMaxPerGroup = 4;
      
      if (participantCount <= 6) {
        optimalGroups = 2;
        optimalMaxPerGroup = Math.ceil(participantCount / 2);
      } else if (participantCount <= 12) {
        optimalGroups = 3;
        optimalMaxPerGroup = Math.ceil(participantCount / 3);
      } else if (participantCount <= 20) {
        optimalGroups = 4;
        optimalMaxPerGroup = Math.ceil(participantCount / 4);
      } else if (participantCount <= 30) {
        optimalGroups = 5;
        optimalMaxPerGroup = Math.ceil(participantCount / 5);
              } else {
        optimalGroups = 6;
        optimalMaxPerGroup = Math.ceil(participantCount / 6);
      }
      
      // Safety limits
      optimalMaxPerGroup = Math.min(optimalMaxPerGroup, 8);
      optimalGroups = Math.min(optimalGroups, 12);
      
      // Set the calculated values
      setNumberOfGroups(optimalGroups);
      setMaxPeoplePerGroup(optimalMaxPerGroup);
      
      // Generate teams with a longer delay to show the spinner
      setTimeout(() => {
            generateTeams();
        setTeamsJustGenerated(true); // Set flag when teams are generated
        setIsGeneratingTeams(false);
        setIsProcessing(false);
            safeSetPendingGenerate(false);
        safeSetShowSpinner(false); // Stop the spinner after team generation
      }, 4000); // Increased from 2000ms to 4000ms (4 seconds)
      
      return; // Exit early to show spinner
    }
    

    
    const startTime = Date.now();
    const duration = (settings?.spinBehavior?.spinningDuration || 2.5) * 1000;
    
    // Calculate random final rotation (like other wheels)
    const baseRotations = 2400 + Math.random() * 360 + (settings?.spinBehavior?.spinningSpeedLevel || 12) * 300;
    const randomFinalAngle = Math.random() * 360;
    const finalRotation = baseRotations + randomFinalAngle;
    
    // Always start from current position and add rotations (never subtract)
    const startRotation = currentRotation;
    const totalRotation = finalRotation + (Math.floor(currentRotation / 360) + 1) * 360;
    
    // Set the target rotation
    setSpinRotation(totalRotation);

    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const rotation = startRotation + (totalRotation - startRotation) * easeOut;
      setCurrentRotation(rotation);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      } else {
        setCurrentRotation(totalRotation);
        safeSetShowSpinner(false);
        setSpinCompleted(true);
        
        // Calculate result based on final wheel position (like other wheels)
        const availableTeams = getAvailableTeams();
        if (availableTeams.length > 0) {
          const normalizedRotation = totalRotation % 360;
          const segmentAngle = 360 / availableTeams.length;
          const angleUnderPointer = (360 - normalizedRotation) % 360;
          const selectedIndex = Math.floor(angleUnderPointer / segmentAngle) % availableTeams.length;
          const selectedTeamData = availableTeams[selectedIndex];
          
          console.log('Final rotation:', totalRotation);
          console.log('Normalized rotation:', normalizedRotation);
          console.log('Angle under pointer:', angleUnderPointer);
          console.log('Segment angle:', segmentAngle);
          console.log('Selected index:', selectedIndex);
          console.log('Selected team:', selectedTeamData);
          console.log('Team members:', selectedTeamData.members);
          console.log('Members length:', selectedTeamData.members?.length);
          setSelectedTeam(selectedTeamData);
          
          // Handle elimination mode
          if (actionMode === "elimination" && selectedTeamData) {
            console.log('ELIMINATION MODE: Removing team from available options...');
            console.log('Team to eliminate:', selectedTeamData.name, 'ID:', selectedTeamData.id);
            
            // Eliminate the selected team
            eliminateTeam(selectedTeamData.id);
            
            console.log(`Elimination mode: Removed ${selectedTeamData.name} from available options.`);
          }
        }
        

      }
    };
    
    requestAnimationFrame(animate);
  }, [showSpinner, teams, settings, pendingGenerate]);

  // Play confetti and sound effects
  useEffect(() => {
    if (selectedTeam && !showSpinner && settings && viewMode === "result" && animateTeams) {
      // Trigger confetti via callback
      onConfettiChange?.(true);

      if (settings.confettiSound?.enableSound && !muted) {
        // Play custom win sound if global sound is enabled and not locally muted
        console.log('Playing sound - Global enabled:', settings.confettiSound.enableSound, 'Local muted:', muted, 'Volume:', settings.confettiSound.soundVolume);
        const audio = new Audio("/sound-win.mp3")
        audio.volume = settings.confettiSound.soundVolume || 0.5; // Volume is already a decimal
        audio.play().catch((error) => {
          console.error('Error playing sound:', error);
        });
      } else {
        console.log('Sound not playing - Global enabled:', settings.confettiSound?.enableSound, 'Local muted:', muted);
      }
      
      // Hide confetti after 4 seconds
      setTimeout(() => {
        onConfettiChange?.(false);
      }, 4000);
    }
  }, [selectedTeam, showSpinner, settings, muted, viewMode, animateTeams, onConfettiChange])

  // Voice announcement function
  const announceTeam = (teamName: string, teamIndex: number) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(`Team ${teamName} is ready!`);
      utterance.rate = 0.9;
      utterance.pitch = 1.1;
      utterance.volume = 0.8;
      
      // Stagger the announcements
      setTimeout(() => {
        speechSynthesis.speak(utterance);
      }, teamIndex * 800 + 1000); // 800ms delay between teams, start after 1s
    }
  };

  // Announce teams when animation starts
  useEffect(() => {
    if (animateTeams && teams.length > 0) {
      teams.forEach((team, index) => {
        announceTeam(team.name, index);
      });
    }
  }, [animateTeams, teams]);

  let content = null;
  content = (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 rounded-xl border-2 border-dashed border-indigo-200 p-8 relative shadow-lg overflow-visible min-w-[700px] min-h-[700px]">
      {/* Sound Control */}
      <div className="absolute top-4 right-4 z-10">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMuted((m) => !m)}
          className="w-12 h-12 p-0 bg-white/90 hover:bg-white shadow-lg border border-indigo-200 hover:border-indigo-300 transition-all duration-200"
          title={settings.confettiSound?.enableSound ? (muted ? "Unmute" : "Mute") : "Global sound disabled"}
        >
          {!settings.confettiSound?.enableSound ? (
            <VolumeX className="w-5 h-5 text-gray-400" />
          ) : muted ? (
            <VolumeX className="w-5 h-5 text-red-500" />
          ) : (
            <Volume2 className="w-5 h-5 text-indigo-600" />
          )}
        </Button>
      </div>
      
      {isGeneratingTeams ? (
        <div className="flex flex-col items-center justify-center w-full space-y-6">
          <div className="relative">
            <div className="w-80 h-80 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full flex items-center justify-center shadow-lg border-2 border-dashed border-indigo-300">
              <div className="w-24 h-24 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-spin shadow-lg flex items-center justify-center">
                <div className="w-12 h-12 bg-white rounded-full"></div>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full shadow-md">
            🚀 Generating Teams...
          </div>
          <div className="text-sm text-indigo-600 text-center max-w-md">
            Creating optimal team distribution for {participants.length} participants
          </div>
        </div>
      ) : showSpinner ? (
        <div className="flex flex-col items-center justify-center w-full space-y-6">
          <div className="relative">
                          <TeamPickerWheel teams={getAvailableTeams().map((team, i) => ({ name: team.name, color: team.color }))} isSpinning={showSpinner} currentRotation={currentRotation} />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full animate-pulse shadow-lg"></div>
            </div>
          </div>
          <div className="text-xl font-bold text-indigo-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-6 py-3 rounded-full shadow-md">
            🎯 Spinning the wheel...
          </div>
        </div>
      ) : (!teams || teams.length === 0) ? (
        <div className="flex flex-col items-center justify-center w-full space-y-6">
          <div className="text-center">
            <div className="w-20 h-20 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>
            <h3 className="text-2xl font-bold text-indigo-800 mb-3">Ready to Create Teams</h3>
            <p className="text-indigo-600 font-medium">Add participants and click START to generate teams</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center space-y-8 overflow-visible">
          <div className="relative mb-4 overflow-visible">
                          <TeamPickerWheel teams={getAvailableTeams().map((team, i) => ({ name: team.name, color: team.color }))} isSpinning={false} currentRotation={currentRotation} />
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xs font-bold">{teams.length}</span>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="text-lg font-bold text-indigo-800 bg-gradient-to-r from-indigo-100 to-purple-100 px-4 py-2 rounded-full shadow-md">
              ✨ Generated Teams
            </div>
            
            {getAvailableTeams().length === 0 ? (
            <div className="w-full max-w-sm p-4 bg-gradient-to-r from-red-100 via-pink-100 to-orange-100 rounded-lg border-2 border-red-300 shadow-md">
              <h3 className="text-lg font-bold text-red-800 mb-2 text-center">❌ All Teams Eliminated!</h3>
              <p className="text-sm text-red-700 text-center mb-3">
                All teams have been eliminated. Use "Restore All" to bring them back.
              </p>
              <Button
                onClick={restoreAllTeams}
                className="bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700 text-white font-bold py-2"
                size="sm"
              >
                🔄 Restore All Teams
              </Button>
            </div>
          ) : (
            <Button 
              onClick={() => {
                  if (isProcessing) return; // Prevent multiple clicks
                  const availableTeams = getAvailableTeams();
                  if (availableTeams.length === 0) {
                    console.log('No teams available to spin');
                    return;
                  }
                setShowSpinner(true);
                  setSpinCompleted(false); // Reset spin completed state
                setSelectedTeam(null);
              }}
                disabled={isProcessing || getAvailableTeams().length === 0}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
                size="lg"
              >
                🎯 Spin to Pick Team
              </Button>
            )}
          </div>
          
          {/* Elimination Mode Settings - Compact */}
          <div className="mt-4 p-3 bg-gradient-to-br from-orange-50 to-red-50 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center mb-2">
              <h4 className="text-sm font-semibold text-orange-800">Elimination Mode</h4>
              {eliminatedTeams.length > 0 && (
                <span className="text-xs text-orange-700 bg-orange-100 px-2 py-1 rounded-full ml-2">
                  {eliminatedTeams.length} eliminated
                </span>
              )}
            </div>
            <div className="flex items-center justify-center gap-4">
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="normal-mode-wheel"
                  name="actionModeWheel"
                  value="normal"
                  checked={actionMode === "normal"}
                  onChange={(e) => setActionMode(e.target.value as any)}
                  className="sr-only"
                />
                <label htmlFor="normal-mode-wheel" className={`text-xs cursor-pointer rounded px-2 py-1 transition-all duration-200 ${
                  actionMode === "normal" 
                    ? "bg-orange-600 text-white border border-orange-600" 
                    : "bg-white text-orange-700 border border-orange-200 hover:bg-orange-50"
                }`}>
                  🎯 Normal
                </label>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="radio"
                  id="elimination-mode-wheel"
                  name="actionModeWheel"
                  value="elimination"
                  checked={actionMode === "elimination"}
                  onChange={(e) => setActionMode(e.target.value as any)}
                  className="sr-only"
                />
                <label htmlFor="elimination-mode-wheel" className={`text-xs cursor-pointer rounded px-2 py-1 transition-all duration-200 ${
                  actionMode === "elimination" 
                    ? "bg-red-600 text-white border border-red-600" 
                    : "bg-white text-red-700 border border-red-200 hover:bg-red-50"
                }`}>
                  ❌ Elimination
                </label>
              </div>
              {actionMode === "elimination" && eliminatedTeams.length > 0 && (
                <Button
            size="sm"
                  variant="outline"
                  onClick={restoreAllTeams}
                  className="text-xs border-orange-300 text-orange-700 hover:bg-orange-50 h-6 px-2"
          >
                  Restore All
          </Button>
              )}
            </div>
            {actionMode === "elimination" && (
              <p className="text-xs text-orange-700 mt-2">
                Selected team will be removed after each spin
              </p>
            )}
          </div>
          
          {selectedTeam && (
            <div className="w-full max-w-sm p-4 bg-gradient-to-r from-green-100 via-emerald-100 to-teal-100 rounded-lg border-2 border-green-300 shadow-md transform animate-pulse">
              <h3 className="text-lg font-bold text-green-800 mb-2 text-center">🎉 Selected Team!</h3>
              <div className="flex items-center justify-center space-x-3">
                {selectedTeam.mascot && (
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center shadow-md">
                    <span className="text-2xl">{selectedTeam.mascot}</span>
                  </div>
                )}
                <div className="text-center">
                  <p className="text-lg font-bold text-green-900 mb-1">{selectedTeam.name}</p>
                  <p className="text-xs text-green-700 font-medium">
                    {selectedTeam.members?.length || 0} members
                    {selectedTeam.members && ` (${selectedTeam.members.map(m => m.name).join(', ')})`}
                  </p>
                </div>
              </div>
            </div>
          )}
          
          <div className="w-full">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {teams.map((team, index) => {
                const isEliminated = eliminatedTeams.includes(team.id);
                return (
                <Card 
                  key={team.id} 
                  className={`p-4 border-2 transition-all duration-700 ease-out shadow-lg hover:shadow-xl transform hover:scale-105 relative ${
                    animateTeams 
                      ? 'opacity-100 translate-y-0 scale-100' 
                      : 'opacity-0 translate-y-8 scale-95'
                  } ${isEliminated ? 'opacity-50 grayscale' : ''}`}
                  style={{ 
                    borderColor: isEliminated ? '#9ca3af' : team.color,
                    transitionDelay: `${index * 200}ms`,
                    background: isEliminated 
                      ? 'linear-gradient(135deg, #f3f4f6, #e5e7eb)' 
                      : `linear-gradient(135deg, ${team.color}10, ${team.color}05)`
                  }}
                >
                  {isEliminated && (
                    <div className="absolute top-2 right-2 z-10">
                      <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                        ❌ ELIMINATED
                      </div>
                    </div>
                  )}
                  <div className="flex flex-col items-center mb-3">
                    {team.mascot && (
                      <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-md mb-2">
                        <span className="text-2xl animate-bounce" aria-label="Mascot" role="img">{team.mascot}</span>
                      </div>
                    )}
                  </div>
                  <div
                    className="flex items-center gap-2 mb-4 p-3 rounded-lg text-white font-medium shadow-md"
                    style={{ 
                      background: `linear-gradient(135deg, ${team.color}, ${team.color}dd)`,
                      border: `2px solid ${team.color}`
                    }}
                  >
                    <Badge variant="secondary" className="bg-white/30 text-white font-bold">
                      {team.members.length}
                    </Badge>
                    <span className="font-bold text-lg">{team.name}</span>
                  </div>
                  <div className="space-y-2">
                    {team.members.map((member) => (
                      <div
                        key={member.id}
                        className={`flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:scale-105 ${
                          team.representative?.id === member.id 
                            ? "bg-gradient-to-r from-yellow-100 to-amber-100 border-2 border-yellow-400 shadow-md" 
                            : "bg-white hover:bg-gray-50 border border-gray-200"
                        }`}
                      >
                        {team.representative?.id === member.id && (
                          <div className="w-6 h-6 bg-gradient-to-r from-yellow-500 to-amber-500 rounded-full flex items-center justify-center shadow-sm">
                            <Crown className="h-3 w-3 text-white" />
                          </div>
                        )}
                        <span className="text-sm font-semibold text-gray-800">{member.name}</span>
                        {member.gender && showGenderInResult && (
                          <Badge variant="outline" className="text-xs font-bold">
                            {member.gender === "male" ? "♂" : "♀"}
                          </Badge>
                        )}
                        {member.label && showLabelInResult && (
                          <Badge variant="secondary" className="text-xs font-bold">
                            {member.label}
                          </Badge>
                        )}
                      </div>
                    ))}
                  </div>
                </Card>
              )})}
            </div>
          </div>
        </div>
      )}
      
      <Button 
        className="mt-8 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold w-full py-4 text-lg shadow-lg transform hover:scale-105 transition-all duration-200" 
        onClick={() => setShowModal(true)}
      >
        🎯 Open Groups Board
      </Button>
    </div>
  );

  return (
    <div className="space-y-4">
      {content}
      {showActionButtons && (
        <></>
      )}
      <Dialog open={showModal} onOpenChange={setShowModal}>
        <DialogContent className="max-w-4xl w-full bg-gradient-to-br from-indigo-50 to-purple-50 border-indigo-200 shadow-2xl">
          <DialogHeader className="bg-gradient-to-r from-indigo-100 to-purple-100 border-b border-indigo-200 rounded-t-lg p-6">
            <DialogTitle className="flex items-center justify-between text-indigo-800">
              <div className="flex items-center">
                <span className="w-3 h-3 bg-indigo-500 rounded-full mr-3"></span>
                <span className="text-2xl font-bold">🎯 Groups Board</span>
              </div>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="bg-white/80 hover:bg-white border border-indigo-200 hover:border-indigo-300 text-indigo-700 hover:text-indigo-800"
                  >
                    <SettingsIcon className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-indigo-200 shadow-lg">
                  <DropdownMenuItem onClick={exportToCSV} className="hover:bg-indigo-50">
                    <Download className="w-4 h-4 mr-2 text-indigo-600" /> Download Result (.csv)
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setPickRepresentatives && setPickRepresentatives(!pickRepresentatives)} className="hover:bg-indigo-50">
                    <Crown className="w-4 h-4 mr-2 text-yellow-600" />
                    {pickRepresentatives ? "Hide Representatives" : "Pick Representatives"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeSetShowGenderInResult(!showGenderInResult)} className="hover:bg-indigo-50">
                    <Users className="w-4 h-4 mr-2 text-blue-600" />
                    {showGenderInResult ? "Hide Gender" : "Show Gender"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => safeSetShowLabelInResult(!showLabelInResult)} className="hover:bg-indigo-50">
                    <Share2 className="w-4 h-4 mr-2 text-purple-600" />
                    {showLabelInResult ? "Hide Label" : "Show Label"}
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowModal(false)} className="hover:bg-green-50 text-green-600">
                    <span className="w-4 h-4 mr-2">✓</span> Done
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </DialogTitle>
          </DialogHeader>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {teams.map((team, index) => (
              <Card 
                key={team.id} 
                  className={`p-4 border-2 transition-all duration-700 ease-out shadow-lg hover:shadow-xl transform hover:scale-105 ${
                  animateTeams 
                    ? 'opacity-100 translate-y-0 scale-100' 
                    : 'opacity-0 translate-y-8 scale-95'
                }`}
                style={{ 
                  borderColor: team.color,
                    transitionDelay: `${index * 200}ms`,
                    background: `linear-gradient(135deg, ${team.color}10, ${team.color}05)`
                }}
              >
                <div className="flex flex-col items-center mb-2">
                  {team.mascot && (
                    <span className="text-4xl mb-1 animate-bounce" aria-label="Mascot" role="img">{team.mascot}</span>
                  )}
                </div>
                <div
                  className="flex items-center gap-2 mb-3 p-2 rounded text-white font-medium"
                  style={{ backgroundColor: team.color }}
                >
                  <Badge variant="secondary" className="bg-white/20 text-white">
                    {team.members.length}
                  </Badge>
                  <span className="font-semibold">{team.name}</span>
                </div>
                <div className="space-y-2">
                  {team.members.map((member) => (
                    <div
                      key={member.id}
                      className={`flex items-center gap-2 p-2 rounded ${
                        team.representative?.id === member.id ? "bg-yellow-100 border border-yellow-300" : "bg-gray-50"
                      }`}
                    >
                      {team.representative?.id === member.id && <Crown className="h-4 w-4 text-yellow-600" />}
                      <span className="text-sm font-medium">{member.name}</span>
                      {member.gender && showGenderInResult && (
                        <Badge variant="outline" className="text-xs">
                          {member.gender === "male" ? "♂" : "♀"}
                        </Badge>
                      )}
                      {member.label && showLabelInResult && (
                        <Badge variant="secondary" className="text-xs">
                          {member.label}
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            ))}
          </div>
          </div>
          <div className="flex justify-center gap-4 pt-6 border-t border-indigo-200">
            <Button 
              onClick={() => setShowModal(false)} 
              variant="outline" 
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold py-3 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              ✅ DONE
            </Button>
            <Button 
              onClick={clearTeams} 
              variant="outline" 
              className="flex items-center gap-2 bg-white hover:bg-red-50 border-red-300 hover:border-red-400 text-red-700 font-bold py-3 px-6 shadow-lg transform hover:scale-105 transition-all duration-200"
            >
              🗑️ Remove All Groups
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
