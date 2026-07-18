"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useWheelPicker } from "@/hooks/use-wheel-picker"
import { useGameModes } from "@/hooks/use-game-modes"
import Header from "@/components/header"
import { ToolPageTitle } from "@/components/tool-favorite-star"
import Footer from "@/components/footer"
import SettingsPanel from "@/components/settings-panel"
import { ToastProvider } from "@/contexts/toast-context"
import { SettingsProvider } from "@/contexts/settings-context"
import { useSettingsStore } from "@/stores/settings-store"
import { useWheelManagerStore } from "@/stores/wheel-manager-store"
import { WheelDisplay } from "@/components/image-picker/wheel-display"
import { WheelControls } from "@/components/image-picker/wheel-controls"
import { WheelInputs } from "@/components/image-picker/wheel-inputs"
import { GameStatusBar } from "@/components/image-picker/games/game-status-bar"
import { BingoCard } from "@/components/image-picker/games/bingo-card"
import { MemoryChallenge } from "@/components/image-picker/games/memory-challenge"
import { SequenceMatch } from "@/components/image-picker/games/sequence-match"
import { ResultsDialog } from "@/components/image-picker/results-dialog"
import { TitleModal } from "@/components/image-picker/title-modal"
import { GameSelectionDialog } from "@/components/image-picker/game-selection-dialog"
import React from "react"
import Confetti from "react-confetti"
import { useSettings } from "@/contexts/settings-context"
import type { WheelItem } from "@/lib/types"

// Helper: Default sample images
const SAMPLE_IMAGES: WheelItem[] = [
  {
    id: "sample-1",
    text: "Sample Image 1",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+1",
  },
  {
    id: "sample-2",
    text: "Sample Image 2",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+2",
  },
  {
    id: "sample-3",
    text: "Sample Image 3",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+3",
  },
  {
    id: "sample-4",
    text: "Sample Image 4",
    enabled: true,
    count: 0,
    imageUrl: "/placeholder.svg?height=100&width=100&text=Sample+4",
  },
];

function InnerImagePickerWheelPage() {
  // Move all logic and hooks here
  const [showSettings, setShowSettings] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showTitleModal, setShowTitleModal] = useState(false)
  const [showConfetti, setShowConfetti] = useState(false)
  const [muted, setMuted] = useState(false)
  const [toolMuted, setToolMuted] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const { settings, loadFromDatabase: loadSettings } = useSettingsStore()
  const { getCurrentWheel, updateWheelData, setCurrentTool, createNewWheel, currentWheelId } = useWheelManagerStore();
  const { settings: globalSettings } = useSettings();
  const [wheelItems, setWheelItems] = useState<WheelItem[]>(SAMPLE_IMAGES.map(img => ({ ...img })));
  // Always derive enabledItems from wheelItems
  const enabledItems = wheelItems.filter(item => item.enabled !== false);
  const prevWheelId = useRef<string | null>(null);

  // Switch wheel functionality (like number picker tool)
  useEffect(() => {
    setCurrentTool("image-picker-wheel");
    if (typeof window !== "undefined") {
      const wheel = getCurrentWheel();
      if (!wheel) {
        createNewWheel("image-picker-wheel", "My Image Picker Wheel");
      }
    }
  }, [setCurrentTool, getCurrentWheel, createNewWheel]);

  // Unified sync for all item actions
  const syncWheelItems = useCallback((items: WheelItem[]) => {
    setWheelItems(items);
    const wheel = getCurrentWheel();
    if (wheel) {
      updateWheelData(wheel.toolType, wheel.id, { wheelItems: items });
    }
  }, [getCurrentWheel, updateWheelData]);

  // Add custom item
  const handleAddCustomItem = () => {
    if (!customInput.trim()) return;
    const newItem: WheelItem = {
      id: `custom-${Date.now()}`,
      text: customInput.trim(),
      enabled: true,
      count: 0,
    };
    syncWheelItems([...wheelItems, newItem]);
    setCustomInput("");
  };

  // Remove item
  const handleRemoveItem = (id: string) => {
    syncWheelItems(wheelItems.filter(item => item.id !== id));
  };

  // Toggle item enabled
  const handleToggleItem = (id: string) => {
    syncWheelItems(wheelItems.map(item => item.id === id ? { ...item, enabled: !item.enabled } : item));
  };

  // Reset counts
  const handleResetCounts = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, count: 0 })));
  };

  // Remove all items
  const handleRemoveAll = () => {
    syncWheelItems([]);
  };

  // Enable all inputs
  const enableAllInputs = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, enabled: true })));
  };

  // Disable all inputs
  const disableAllInputs = () => {
    syncWheelItems(wheelItems.map(item => ({ ...item, enabled: false })));
  };

  // Image upload
  const handleImageUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;
    const newItems: WheelItem[] = [];
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const url = URL.createObjectURL(file);
      newItems.push({
        id: `uploaded-${Date.now()}-${i}`,
        text: file.name,
        enabled: true,
        count: 0,
        imageUrl: url,
        imageFile: file,
      });
    }
    syncWheelItems([...wheelItems, ...newItems]);
  }, [wheelItems, syncWheelItems]);

  // WheelPickerWebsite logic from new context
  const { currentTool, numberRange, setNumberRange, settings: wheelSettings, setSettings, isSpinning, setIsSpinning, selectedItem, setSelectedItem, wheelRotation, setWheelRotation, results, setResults, customInput, setCustomInput, wheelTitle, setWheelTitle, wheelDescription, setWheelDescription, fileInputRef } = useWheelPicker();

  // Load wheel data when switching wheels
  useEffect(() => {
    const wheel = getCurrentWheel();
    if (!wheel) return;
    
    // Check if this is a different wheel (wheel switching)
    if (prevWheelId.current !== wheel.id) {
      console.log('Switching to wheel:', wheel.id, wheel.name, wheel.data);
      
      let loadedWheelItems: WheelItem[] = [];
      let loadedResults: any[] = [];
      let loadedSelectedItem: any = null;
      
      if (wheel.data) {
        // Load wheelItems (the main data)
        if ('wheelItems' in wheel.data && Array.isArray((wheel.data as any).wheelItems)) {
          loadedWheelItems = (wheel.data as any).wheelItems as WheelItem[];
          console.log('Loaded wheelItems:', loadedWheelItems);
        }
        
        // Load other saved data
        if ('recentResults' in wheel.data && Array.isArray((wheel.data as any).recentResults)) {
          loadedResults = (wheel.data as any).recentResults;
          console.log('Loaded results:', loadedResults);
        }
        
        if ('lastResult' in wheel.data && (wheel.data as any).lastResult) {
          loadedSelectedItem = (wheel.data as any).lastResult;
          console.log('Loaded selectedItem:', loadedSelectedItem);
        }
      }
      
      // Always clear results and selected item first
      setResults([]);
      setSelectedItem(null);
      
      // Update wheel items - handle different cases
      if (loadedWheelItems.length > 0) {
        // Wheel has saved data
        setWheelItems(loadedWheelItems);
        console.log('Setting wheelItems to loaded data');
      } else {
        // Wheel has no data - check if this is a new wheel or existing empty wheel
        const wheelCreationTime = new Date(wheel.createdAt).getTime();
        const now = Date.now();
        const isNewWheel = (now - wheelCreationTime) < 30000; // Consider wheel "new" if created within last 30 seconds
        
        if (isNewWheel) {
          // New wheel - show sample images
          setWheelItems(SAMPLE_IMAGES.map(img => ({ ...img })));
          console.log('Setting wheelItems to sample images (new wheel)');
        } else {
          // Existing wheel with no data - show empty
          setWheelItems([]);
          console.log('Setting wheelItems to empty array (existing wheel with no data)');
        }
      }
      
      // Update results and selected item only if they exist
      if (loadedResults.length > 0) {
        setResults(loadedResults);
      }
      
      if (loadedSelectedItem) {
        setSelectedItem(loadedSelectedItem);
      }
      
      prevWheelId.current = wheel.id;
    }
  }, [getCurrentWheel, updateWheelData, setResults, setSelectedItem]);

  // Force wheel data reset when wheel ID changes
  useEffect(() => {
    if (!currentWheelId) return;
    
    const wheel = getCurrentWheel();
    if (!wheel) return;
    
    console.log('Wheel ID changed to:', currentWheelId, 'Wheel data:', wheel.data);
    
    // ALWAYS clear all state first - no exceptions
    setResults([]);
    setSelectedItem(null);
    setWheelItems([]);
    
    // Wait a moment to ensure state is cleared, then load wheel-specific data
    setTimeout(() => {
      if (wheel.data && 'wheelItems' in wheel.data && Array.isArray((wheel.data as any).wheelItems)) {
        const wheelItems = (wheel.data as any).wheelItems;
        if (wheelItems.length > 0) {
          // Wheel has saved data - load it
          setWheelItems(wheelItems);
          console.log('Loaded wheel data:', wheelItems.length, 'items for wheel', currentWheelId);
          
          // Load results and selected item
          if ((wheel.data as any).recentResults && Array.isArray((wheel.data as any).recentResults)) {
            setResults((wheel.data as any).recentResults);
          }
          if ((wheel.data as any).lastResult) {
            setSelectedItem((wheel.data as any).lastResult);
          }
        } else {
          // Wheel has empty data - check if new or existing
          const wheelCreationTime = new Date(wheel.createdAt).getTime();
          const now = Date.now();
          const isNewWheel = (now - wheelCreationTime) < 30000; // Consider wheel "new" if created within last 30 seconds
          
          if (isNewWheel) {
            setWheelItems(SAMPLE_IMAGES.map(img => ({ ...img })));
            console.log('New wheel - showing sample images');
          } else {
            console.log('Existing wheel with no data - keeping empty');
          }
        }
      } else {
        // Wheel has no data structure - check if new or existing
        const wheelCreationTime = new Date(wheel.createdAt).getTime();
        const now = Date.now();
        const isNewWheel = (now - wheelCreationTime) < 30000; // Consider wheel "new" if created within last 30 seconds
        
        if (isNewWheel) {
          setWheelItems(SAMPLE_IMAGES.map(img => ({ ...img })));
          console.log('New wheel - showing sample images');
        } else {
          console.log('Existing wheel with no data - keeping empty');
        }
      }
    }, 100);
  }, [currentWheelId, setResults, setSelectedItem]);

  // Save wheel data to wheel manager store whenever wheelItems changes
  useEffect(() => {
    const wheel = getCurrentWheel();
    if (wheel && wheelItems.length > 0) {
      updateWheelData("image-picker-wheel", wheel.id, {
        wheelItems: wheelItems,
        totalSpins: results.length,
        lastResult: selectedItem,
        recentResults: results.slice(-10), // Keep last 10 results
      });
    }
  }, [wheelItems, results, selectedItem, getCurrentWheel, updateWheelData]);

  const {
    gameMode,
    setGameMode,
    bingoCard,
    createBingoCard,
    memoryChallenge,
    startMemoryChallenge,
    collectionProgress,
    startCollectionRace,
    sequenceTarget,
    sequenceProgress,
    startSequenceMatch,
    gameTimer,
    isGameActive,
    gameStats,
    setGameStats,
    handleGameSpin,
    resetGame,
  } = useGameModes({
    enabledItems,
    selectedItem,
    setSelectedItem,
  })

  const spinWheel = () => {
    if (enabledItems.length === 0) return
    setIsSpinning(true)
    const randomRotation = Math.random() * 360 + 2160 // Increased from 1440 to 2160 (6-7 full rotations)
    setWheelRotation((prev) => prev + randomRotation)
    setTimeout(() => {
      const finalRotation = (wheelRotation + randomRotation) % 360
      const normalizedAngle = (360 - finalRotation) % 360
      const segmentIndex = Math.floor(normalizedAngle / segmentAngle) % enabledItems.length
      const selected = enabledItems[segmentIndex]
      setSelectedItem(selected)
      setResults((prev) => [selected, ...prev])
      setGameStats((prev) => ({ ...prev, totalSpins: prev.totalSpins + 1 }))
      handleGameSpin(selected)
      if (wheelSettings.actionMode === "elimination") {
        setWheelItems((prev) => prev.map((item) => (item.id === selected.id ? { ...item, enabled: false } : item)))
      } else if (wheelSettings.actionMode === "accumulation") {
        setWheelItems((prev) =>
          prev.map((item) => (item.id === selected.id ? { ...item, count: item.count + 1 } : item)),
        )
      }
      setIsSpinning(false)
    }, wheelSettings.spinDuration * 1000)
  }

  useEffect(() => {
    if (selectedItem && !isSpinning) {
      if (settings.confettiSound?.enableConfetti) {
        setShowConfetti(true)
        setTimeout(() => setShowConfetti(false), 5000)
      }
      if (globalSettings.confettiSound?.enableSound && !toolMuted) {
        const audio = new Audio("/sound-win.mp3")
        audio.volume = globalSettings.confettiSound.soundVolume || 0.5
        audio.play().catch(() => {})
      }
    }
  }, [selectedItem, isSpinning, globalSettings.confettiSound, toolMuted])

  // Always calculate enabledItems and segmentAngle from current wheelItems
  // enabledItems is now always derived from wheelItems
  // (do not redeclare enabledItems)
  const segmentAngle = enabledItems.length > 0 ? 360 / enabledItems.length : 0;

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{
        backgroundColor: settings.appearance?.backgroundColor,
        backgroundImage: settings.appearance?.backgroundImage
          ? `url(${settings.appearance.backgroundImage})`
          : undefined,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} numberOfPieces={400} recycle={false} style={{ position: 'fixed', top: 0, left: 0, pointerEvents: 'none', zIndex: 1000 }} />
      )}
      <Header onOpenSettings={() => setShowSettings(true)} onOpenGames={() => setShowGames(true)} />
      <main className="w-full px-4 py-8 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <ToolPageTitle title="Image Picker Wheel" toolType="image-picker-wheel" />
          <p className="text-gray-600">Upload pictures and select one visually at random</p>
        </div>
        {gameMode !== "normal" && (
          <GameStatusBar
            gameMode={gameMode}
            isGameActive={isGameActive}
            gameTimer={gameTimer}
            gameStats={gameStats}
            resetGame={resetGame}
            bingoCard={bingoCard}
            memoryChallenge={memoryChallenge}
            collectionProgress={collectionProgress}
            enabledItems={enabledItems}
            sequenceTarget={sequenceTarget}
            sequenceProgress={sequenceProgress}
          />
        )}
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-center">
                  {wheelTitle}
                  {wheelDescription && <p className="text-sm text-gray-600 font-normal mt-1">{wheelDescription}</p>}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col items-center space-y-6">
                <WheelDisplay
                  enabledItems={enabledItems}
                  segmentAngle={segmentAngle}
                  wheelRotation={wheelRotation}
                  settings={wheelSettings}
                  isSpinning={isSpinning}
                  spinWheel={spinWheel}
                  selectedItem={selectedItem}
                  currentTool={currentTool}
                  gameMode={gameMode}
                  bingoCard={bingoCard}
                  memoryChallenge={memoryChallenge}
                  collectionProgress={collectionProgress}
                  sequenceTarget={sequenceTarget}
                  sequenceProgress={sequenceProgress}
                  setShowResults={setShowResults}
                  isFullscreen={isFullscreen}
                  results={results}
                />
                <WheelControls
                  settings={wheelSettings}
                  selectedItem={selectedItem}
                  currentTool={currentTool}
                  setShowResults={setShowResults}
                  isFullscreen={isFullscreen}
                  setIsFullscreen={setIsFullscreen}
                  toolMuted={toolMuted}
                  setToolMuted={setToolMuted}
                />
              </CardContent>
            </Card>
          </div>
          <div className="space-y-6">
            {gameMode === "bingo" && bingoCard && <BingoCard bingoCard={bingoCard} currentTool={currentTool} />}
            {gameMode === "memory" && memoryChallenge && (
              <MemoryChallenge memoryChallenge={memoryChallenge} currentTool={currentTool} />
            )}
            {gameMode === "sequence" && sequenceTarget.length > 0 && (
              <SequenceMatch
                sequenceTarget={sequenceTarget}
                sequenceProgress={sequenceProgress}
                currentTool={currentTool}
              />
            )}
            <WheelInputs
              currentTool={currentTool}
              enabledItems={enabledItems}
              wheelItems={wheelItems}
              settings={wheelSettings}
              customInput={customInput}
              setCustomInput={setCustomInput}
              addCustomItem={handleAddCustomItem}
              removeItem={handleRemoveItem}
              toggleItem={handleToggleItem}
              resetCounts={handleResetCounts}
              removeAllInputs={handleRemoveAll}
              disableAllInputs={disableAllInputs}
              enableAllInputs={enableAllInputs}
              setShowTitleModal={setShowTitleModal}
              handleImageUpload={handleImageUpload}
              fileInputRef={fileInputRef as React.RefObject<HTMLInputElement>}
              numberRange={numberRange}
              setNumberRange={setNumberRange}
              syncWheelItems={syncWheelItems}
            />
          </div>
        </div>
      </main>
      <GameSelectionDialog
        showGames={showGames}
        setShowGames={setShowGames}
        gameStats={gameStats}
        gameMode={gameMode}
        setGameMode={setGameMode}
        enabledItems={enabledItems}
        createBingoCard={createBingoCard}
        startMemoryChallenge={startMemoryChallenge}
        startCollectionRace={startCollectionRace}
        startSequenceMatch={startSequenceMatch}
        resetGame={resetGame}
      />
      <TitleModal
        showTitleModal={showTitleModal}
        setShowTitleModal={setShowTitleModal}
        wheelTitle={wheelTitle}
        setWheelTitle={setWheelTitle}
        wheelDescription={wheelDescription}
        setWheelDescription={setWheelDescription}
      />
      <ResultsDialog
        showResults={showResults}
        setShowResults={setShowResults}
        results={results}
        currentTool={currentTool}
      />
      <Footer />
      <SettingsPanel isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  )
}

export default function ImagePickerWheelPage() {
  return (
    <SettingsProvider>
      <ToastProvider>
        <InnerImagePickerWheelPage />
      </ToastProvider>
    </SettingsProvider>
  )
}
