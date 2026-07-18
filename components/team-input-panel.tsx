"use client"

import type React from "react"

import { useState } from "react"
import { useTeamPickerStore } from "@/stores/team-picker-store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Eye, Edit3, FileText, Settings, Users, Plus, Trash2, Upload, Info, Grid, EyeOff, Sparkles, Zap } from "lucide-react"
import { useEffect } from "react"
import { useWheelManagerStore } from "@/stores/wheel-manager-store";

export default function TeamInputPanel() {
  const wheelManager = useWheelManagerStore();
  const wheel = wheelManager.getCurrentWheel();
  const {
    participants,
    teams,
    distributionMode,
    numberOfGroups,
    maxPeoplePerGroup,
    pickRepresentatives,
    customTeamNames,
    toolTitle,
    toolDescription,
    resultTitle,
    addParticipant,
    removeParticipant,
    updateParticipant,
    setDistributionMode,
    setNumberOfGroups,
    setMaxPeoplePerGroup,
    setPickRepresentatives,
    setCustomTeamNames,
    generateTeams,
    setToolTitle,
    setToolDescription,
    setResultTitle,
    importFromCSV,
    pickQuantity,
    setPickQuantity,
    showGenderInResult,
    setShowGenderInResult,
    showLabelInResult,
    setShowLabelInResult,
    presetGroups = [],
    setPresetGroups,
    clearTeams,
    setViewMode,
    viewMode,
    setShowSpinner,
    setPendingGenerate,
    setSelectedTeam,
    actionMode,
    eliminatedTeams,
    setActionMode,
    eliminateTeam,
    restoreAllTeams,
    getAvailableTeams,
  } = useTeamPickerStore();

  // Sync Zustand store with wheel data on wheel change
  useEffect(() => {
    if (wheel && wheel.data) {
      const data = wheel.data as any;
      useTeamPickerStore.setState({
        participants: data.participants || [],
        teams: data.teams || [],
        distributionMode: data.distributionMode || "default",
        numberOfGroups: data.numberOfGroups || 2,
        maxPeoplePerGroup: data.maxPeoplePerGroup || 1,
        pickRepresentatives: data.pickRepresentatives ?? true,
        customTeamNames: data.customTeamNames || [],
        toolTitle: data.toolTitle || "Team Picker Wheel",
        toolDescription: data.toolDescription || "Randomize people into groups",
        resultTitle: data.resultTitle || "RESULT",
        pickQuantity: data.pickQuantity,
        showGenderInResult: data.showGenderInResult ?? true,
        showLabelInResult: data.showLabelInResult ?? true,
        presetGroups: data.presetGroups || [],
        viewMode: data.viewMode || "input",
        actionMode: data.actionMode || "normal",
        eliminatedTeams: data.eliminatedTeams || [],
      });
    }
  }, [wheel?.id]);

  // Update wheel data when Team Picker state changes
  useEffect(() => {
    if (wheel) {
      wheelManager.updateWheelData("team-picker", wheel.id, {
        participants,
        teams,
        distributionMode,
        numberOfGroups,
        maxPeoplePerGroup,
        pickRepresentatives,
        customTeamNames,
        toolTitle,
        toolDescription,
        resultTitle,
        pickQuantity,
        showGenderInResult,
        showLabelInResult,
        presetGroups: presetGroups || [],
        viewMode,
        actionMode,
        eliminatedTeams,
      });
    }
  }, [participants, teams, distributionMode, numberOfGroups, maxPeoplePerGroup, pickRepresentatives, customTeamNames, toolTitle, toolDescription, resultTitle, pickQuantity, showGenderInResult, showLabelInResult, presetGroups, viewMode, actionMode, eliminatedTeams, wheel?.id]);

  const [newParticipantName, setNewParticipantName] = useState("")
  const [bulkInput, setBulkInput] = useState("")
  const [showTitleEditor, setShowTitleEditor] = useState(false)
  const [showTeamNamesDialog, setShowTeamNamesDialog] = useState(false)
  const [tempTeamNames, setTempTeamNames] = useState<string[]>([])
  const [showPresetDialog, setShowPresetDialog] = useState(false)
  const [zones, setZones] = useState<string[][]>([])
  const [zoneSelections, setZoneSelections] = useState<{ [zone: number]: string[] }>({})
  const [showInputsVisible, setShowInputsVisible] = useState(true)

  useEffect(() => {
    if (showPresetDialog) {
      setPresetGroups && setPresetGroups(presetGroups)
    }
  }, [showPresetDialog])

  // Sync local state with store on open
  useEffect(() => {
    if (showPresetDialog && presetGroups) {
      setLocalPresetGroups(presetGroups)
    }
  }, [showPresetDialog])

  const [localPresetGroups, setLocalPresetGroups] = useState<string[][]>(presetGroups || [])

  const handleAddParticipant = () => {
    const name = newParticipantName.trim();
    if (!name) return;
    const isDuplicate = participants.some(
      (p) => p.name.trim().toLowerCase() === name.toLowerCase()
    );
    if (isDuplicate) {
      alert("Participant with this name already exists.");
      return;
    }
    console.log('Adding participant:', { name });
    addParticipant({ name });
    setNewParticipantName("");
  }

  const handleBulkImport = () => {
    if (bulkInput.trim()) {
      const names = bulkInput.split("\n").filter((name) => name.trim())
      names.forEach((name) => {
        addParticipant({ name: name.trim() })
      })
      setBulkInput("")
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type === "text/csv") {
      const reader = new FileReader()
      reader.onload = (e) => {
        const content = e.target?.result as string
        importFromCSV(content)
      }
      reader.readAsText(file)
    }
  }

  const handleNumberOfGroupsChange = (value: string) => {
    const num = Number.parseInt(value)
    if (!isNaN(num) && num > 0) {
      setNumberOfGroups(num)
    }
  }

  const handleMaxPeopleChange = (value: string) => {
    const num = Number.parseInt(value)
    if (!isNaN(num) && num > 0) {
      setMaxPeoplePerGroup(num)
    }
  }

  const openTeamNamesDialog = () => {
    const names = Array.from({ length: numberOfGroups }, (_, i) => customTeamNames[i] || `Team ${i + 1}`)
    setTempTeamNames(names)
    setShowTeamNamesDialog(true)
  }

  const saveTeamNames = () => {
    setCustomTeamNames(tempTeamNames)
    setShowTeamNamesDialog(false)
  }

  const exportParticipantsToCSV = () => {
    const csv = participants.map(p => p.name).join("\n")
    const blob = new Blob([csv], { type: "text/csv" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "participants.csv"
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Inputs Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200 shadow-lg">
        <CardHeader className="bg-gradient-to-r from-blue-100 to-indigo-100 border-b border-blue-200">
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-800 flex items-center">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              <Users className="h-5 w-5 mr-2" />
              {toolTitle || "1. INPUTS"}
            </CardTitle>
            {toolDescription && <div className="text-sm text-blue-600 font-medium">{toolDescription}</div>}
            <div className="flex gap-2 items-center">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowTitleEditor(!showTitleEditor)}
                className="bg-white/80 hover:bg-white border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setShowInputsVisible(v => !v)}
                className="bg-white/80 hover:bg-white border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
              >
                <Eye className="h-4 w-4" />
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={exportParticipantsToCSV}
                className="bg-white/80 hover:bg-white border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
              >
                <FileText className="h-4 w-4" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    className="bg-white/80 hover:bg-white border border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800"
                  >
                    <Settings className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-white border-blue-200 shadow-lg">
                  <DropdownMenuItem onClick={() => setShowTitleEditor(true)} className="hover:bg-blue-50">
                    <Edit3 className="w-4 h-4 mr-2 text-yellow-600" /> Modify Title & Desc.
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setShowPresetDialog(true)} className="hover:bg-blue-50">
                    <Grid className="w-4 h-4 mr-2 text-yellow-600" /> Preset Group Members
                  </DropdownMenuItem>
                  {distributionMode === "gender" && (
                    <DropdownMenuItem onClick={() => setShowGenderInResult && setShowGenderInResult(!showGenderInResult)} className="hover:bg-blue-50">
                      <EyeOff className="w-4 h-4 mr-2 text-yellow-600" />
                      {showGenderInResult ? "Hide Gender" : "Show Gender/Label"}
                    </DropdownMenuItem>
                  )}
                  {distributionMode === "label" && (
                    <DropdownMenuItem onClick={() => setShowLabelInResult && setShowLabelInResult(!showLabelInResult)} className="hover:bg-blue-50">
                      <EyeOff className="w-4 h-4 mr-2 text-yellow-600" />
                      {showLabelInResult ? "Hide Label" : "Show Gender/Label"}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuItem onClick={() => participants.forEach(p => removeParticipant(p.id))} className="hover:bg-red-50 text-red-600">
                    <Trash2 className="w-4 h-4 mr-2" /> Remove All Inputs
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardHeader>
        {showInputsVisible && (
          <CardContent className="bg-gradient-to-br from-blue-50 to-indigo-50">
            {showTitleEditor && (
              <div className="space-y-4 mb-6 p-4 bg-gradient-to-r from-blue-100 to-indigo-100 rounded-xl border border-blue-200">
                <div>
                  <Label htmlFor="tool-title" className="text-blue-800 font-semibold">Tool Title</Label>
                  <Input 
                    id="tool-title" 
                    value={toolTitle} 
                    onChange={(e) => setToolTitle(e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="tool-description" className="text-blue-800 font-semibold">Tool Description</Label>
                  <Input
                    id="tool-description"
                    value={toolDescription}
                    onChange={(e) => setToolDescription(e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
                <div>
                  <Label htmlFor="result-title" className="text-blue-800 font-semibold">Result Title</Label>
                  <Input 
                    id="result-title" 
                    value={resultTitle} 
                    onChange={(e) => setResultTitle(e.target.value)}
                    className="mt-1 border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                  />
                </div>
              </div>
            )}

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200 mb-4">
              <Tabs defaultValue="single" className="w-full">
                <TabsList className="grid w-full grid-cols-3 bg-white border border-green-200">
                  <TabsTrigger 
                    value="single" 
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    Add One by One
                  </TabsTrigger>
                  <TabsTrigger 
                    value="bulk"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    Bulk Import
                  </TabsTrigger>
                  <TabsTrigger 
                    value="ai"
                    className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-600 data-[state=active]:to-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md"
                  >
                    <Sparkles className="h-4 w-4 mr-1" />
                    AI Setup
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="single" className="space-y-3 mt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter participant name..."
                      value={newParticipantName}
                      onChange={(e) => setNewParticipantName(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleAddParticipant()}
                      className="border-green-200 focus:border-green-400 focus:ring-green-400"
                    />
                    <Button 
                      onClick={handleAddParticipant} 
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="bulk" className="space-y-3 mt-4">
                  <Textarea
                    placeholder="Enter names (one per line)..."
                    value={bulkInput}
                    onChange={(e) => setBulkInput(e.target.value)}
                    rows={4}
                    className="border-green-200 focus:border-green-400 focus:ring-green-400"
                  />
                  <div className="flex gap-2">
                    <Button 
                      onClick={handleBulkImport} 
                      size="sm"
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
                    >
                      Import Names
                    </Button>
                    <div className="relative">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={handleFileUpload}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="border-green-200 hover:border-green-400 hover:bg-green-50 text-green-700"
                      >
                        <Upload className="h-4 w-4 mr-2" />
                        Upload CSV
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                
                {/* AI Quick Setup */}
                <TabsContent value="ai" className="space-y-3 mt-4">
                  <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4 border border-purple-200">
                    <div className="flex items-center gap-2 mb-3">
                      <Sparkles className="h-5 w-5 text-purple-600" />
                      <h4 className="font-semibold text-purple-800">AI Quick Setup</h4>
                    </div>
                    <p className="text-sm text-purple-700 mb-4">
                      Let AI help you quickly set up optimal team configurations based on your participants.
                    </p>
                    <div className="space-y-3">
                                             <Button 
                         onClick={() => {
                           // Set reasonable defaults for team optimization
                           setNumberOfGroups(3);
                           setMaxPeoplePerGroup(4);
                           setDistributionMode('default');
                           console.log('Team settings optimized:', {
                             numberOfGroups: 3,
                             maxPeoplePerGroup: 4,
                             distributionMode: 'default'
                           });
                         }}
                         size="sm"
                         className="w-full bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                       >
                         <Zap className="h-4 w-4 mr-2" />
                         Optimize Team Settings
                       </Button>
                                             <Button 
                         onClick={() => {
                           const sampleNames = [
                             'Alice Johnson', 'Bob Smith', 'Carol Davis', 'David Wilson',
                             'Eva Brown', 'Frank Miller', 'Grace Lee', 'Henry Taylor',
                             'Ivy Chen', 'Jack Anderson', 'Kate Martinez', 'Liam O\'Connor'
                           ];
                           console.log('Adding sample participants...');
                           sampleNames.forEach(name => {
                             console.log('Adding participant:', name);
                             addParticipant({ name });
                           });
                         }}
                        size="sm"
                        variant="outline"
                        className="w-full border-purple-200 text-purple-700 hover:bg-purple-50"
                      >
                        <Users className="h-4 w-4 mr-2" />
                        Add Sample Participants
                      </Button>
                    </div>
                  </div>
                </TabsContent>
                             </Tabs>
             </div>

             {/* Participants List */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
              <div className="flex items-center mb-3">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                <h4 className="font-semibold text-purple-800">Participants List</h4>
              </div>
                             <div className="space-y-2 max-h-40 overflow-y-auto">
                 {console.log('Participants in render:', participants)}
                 {participants.length === 0 && (
                   <div className="text-center py-4 text-gray-500">
                     <p>No participants added yet. Use the tabs above to add participants.</p>
                   </div>
                 )}
                 {participants.map((participant) => (
                  <div key={participant.id} className="flex items-center gap-2 p-3 bg-white rounded-lg border border-purple-200 hover:bg-purple-50 transition-colors">
                    <Input
                      className="flex-1 text-sm border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      value={participant.name}
                      onChange={e => updateParticipant(participant.id, { name: e.target.value })}
                      aria-label="Participant name"
                    />
                    {distributionMode === "gender" && showGenderInResult && (
                      <div className="flex gap-1">
                        <Button
                          variant={participant.gender === "male" ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full px-2 py-1 text-xs ${
                            participant.gender === "male" 
                              ? "bg-blue-600 text-white" 
                              : "border-blue-200 text-blue-700 hover:bg-blue-50"
                          }`}
                          onClick={() => updateParticipant(participant.id, { gender: "male" })}
                          title="Male"
                        >
                          ♂
                        </Button>
                        <Button
                          variant={participant.gender === "female" ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full px-2 py-1 text-xs ${
                            participant.gender === "female" 
                              ? "bg-pink-600 text-white" 
                              : "border-pink-200 text-pink-700 hover:bg-pink-50"
                          }`}
                          onClick={() => updateParticipant(participant.id, { gender: "female" })}
                          title="Female"
                        >
                          ♀
                        </Button>
                        <Button
                          variant={!participant.gender ? "default" : "outline"}
                          size="sm"
                          className={`rounded-full px-2 py-1 text-xs ${
                            !participant.gender 
                              ? "bg-gray-600 text-white" 
                              : "border-gray-200 text-gray-700 hover:bg-gray-50"
                          }`}
                          onClick={() => updateParticipant(participant.id, { gender: undefined })}
                          title="Unset"
                        >
                          ⚪
                        </Button>
                      </div>
                    )}
                    {distributionMode === "label" && showLabelInResult && (
                      <Input
                        placeholder="Label"
                        value={participant.label || ""}
                        onChange={(e) => updateParticipant(participant.id, { label: e.target.value })}
                        className="w-20 h-8 border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                      />
                    )}
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeParticipant(participant.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>

              {participants.length > 0 && (
                <div className="mt-3 text-sm text-purple-700 font-medium flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Total participants: {participants.length}
                </div>
              )}
            </div>
          </CardContent>
        )}
      </Card>

             {/* Controller Section */}
       <Card className="bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200 shadow-lg">
         <CardHeader className="bg-gradient-to-r from-orange-100 to-amber-100 border-b border-orange-200">
           <CardTitle className="text-orange-800 flex items-center">
             <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
             2. CONTROLLER
           </CardTitle>
         </CardHeader>
         <CardContent className="space-y-4 bg-gradient-to-br from-orange-50 to-amber-50">
                     <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 border border-blue-200">
             <Label className="text-blue-800 font-semibold mb-3 block">Distribute equally based on:</Label>
             <div className="grid grid-cols-3 gap-3">
               <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                 distributionMode === "default" 
                   ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25" 
                   : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-blue-200 hover:border-blue-300"
               }`}>
                 <input
                   type="radio"
                   name="distribution"
                   checked={distributionMode === "default"}
                   onChange={() => setDistributionMode("default")}
                   className="sr-only"
                 />
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                   distributionMode === "default" ? "bg-white/20" : "bg-blue-100"
                 }`}>
                   <span className="text-lg">🎯</span>
                 </div>
                 <span className={`text-xs font-semibold ${distributionMode === "default" ? "text-white" : "text-blue-700"}`}>
                   Default
                 </span>
               </label>
               
               <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                 distributionMode === "gender" 
                   ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25" 
                   : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-blue-200 hover:border-blue-300"
               }`}>
                 <input
                   type="radio"
                   name="distribution"
                   checked={distributionMode === "gender"}
                   onChange={() => setDistributionMode("gender")}
                   className="sr-only"
                 />
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                   distributionMode === "gender" ? "bg-white/20" : "bg-blue-100"
                 }`}>
                   <span className="text-lg">👥</span>
                 </div>
                 <span className={`text-xs font-semibold ${distributionMode === "gender" ? "text-white" : "text-blue-700"}`}>
                   Gender
                 </span>
               </label>
               
               <label className={`flex flex-col items-center space-y-2 p-4 rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-105 ${
                 distributionMode === "label" 
                   ? "bg-gradient-to-br from-blue-500 to-indigo-500 text-white shadow-lg shadow-blue-500/25" 
                   : "bg-white hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 border border-blue-200 hover:border-blue-300"
               }`}>
                 <input
                   type="radio"
                   name="distribution"
                   checked={distributionMode === "label"}
                   onChange={() => setDistributionMode("label")}
                   className="sr-only"
                 />
                 <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                   distributionMode === "label" ? "bg-white/20" : "bg-blue-100"
                 }`}>
                   <span className="text-lg">🏷️</span>
                 </div>
                 <span className={`text-xs font-semibold ${distributionMode === "label" ? "text-white" : "text-blue-700"}`}>
                   Label
                 </span>
               </label>
             </div>
           </div>

                     <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
             <h4 className="font-semibold text-green-800 mb-3 flex items-center">
               <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
               Settings
             </h4>
             <div className="space-y-4">
               {distributionMode === "gender" && (
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                   <Checkbox
                     id="show-gender-in-result"
                     checked={!!showGenderInResult}
                     onCheckedChange={checked => setShowGenderInResult && setShowGenderInResult(!!checked)}
                     className="text-green-600"
                   />
                   <Label htmlFor="show-gender-in-result" className="text-green-700 font-medium">Show gender in result?</Label>
                 </div>
               )}
               {distributionMode === "label" && (
                 <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-200">
                   <Checkbox
                     id="show-label-in-result"
                     checked={!!showLabelInResult}
                     onCheckedChange={checked => setShowLabelInResult && setShowLabelInResult(!!checked)}
                     className="text-green-600"
                   />
                   <Label htmlFor="show-label-in-result" className="text-green-700 font-medium">Show label in result?</Label>
                 </div>
               )}

               <div className="p-3 bg-white rounded-lg border border-green-200">
                 <Label htmlFor="pick-quantity" className="text-green-700 font-medium flex items-center gap-2 mb-2">
                   Pick quantity
                   <span className="relative group">
                     <Info className="w-4 h-4 text-green-500 cursor-pointer" />
                     <span className="absolute left-6 top-0 z-10 hidden group-hover:block bg-green-800 text-white text-xs rounded px-2 py-1 w-64 shadow-lg">
                       Decide how many inputs will be randomly arranged for grouping. Only available in Default mode.
                     </span>
                   </span>
                 </Label>
                 <div className="flex items-center gap-2">
                   <Input
                     id="pick-quantity"
                     type="number"
                     min={1}
                     max={participants.length}
                     value={pickQuantity ?? participants.length}
                     onChange={e => setPickQuantity && setPickQuantity(Number(e.target.value))}
                     className="w-24 border-green-200 focus:border-green-400 focus:ring-green-400"
                   />
                   <span className="text-xs text-green-600 font-medium">/ {participants.length}</span>
                 </div>
               </div>

               <div className="p-3 bg-white rounded-lg border border-green-200">
                 <Label htmlFor="num-groups" className="text-green-700 font-medium mb-2 block">
                   Number of groups
                 </Label>
                 <Input
                   id="num-groups"
                   type="number"
                   min="1"
                   max="100"
                   value={numberOfGroups}
                   onChange={(e) => handleNumberOfGroupsChange(e.target.value)}
                   className="border-green-200 focus:border-green-400 focus:ring-green-400"
                 />
                 <div className="text-xs text-green-600 mt-1">OR (Set either one)</div>
               </div>

               <div className="p-3 bg-white rounded-lg border border-green-200">
                 <Label htmlFor="max-people" className="text-green-700 font-medium mb-2 block">
                   Max people/group
                 </Label>
                 <Input
                   id="max-people"
                   type="number"
                   min="1"
                   value={maxPeoplePerGroup}
                   onChange={(e) => handleMaxPeopleChange(e.target.value)}
                   className="border-green-200 focus:border-green-400 focus:ring-green-400"
                 />
               </div>
             </div>
           </div>

                     <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-4 border border-purple-200">
             <div className="flex items-center gap-3 p-3 bg-white rounded-lg border border-purple-200">
               <Checkbox
                 id="pick-representatives"
                 checked={pickRepresentatives}
                 onCheckedChange={(checked) => setPickRepresentatives(checked as boolean)}
                 className="text-purple-600"
               />
               <Label htmlFor="pick-representatives" className="text-purple-700 font-medium">
                 Pick representatives?
               </Label>
             </div>
           </div>

           <div className="space-y-3">
             <Button
               onClick={() => {
                 if (setViewMode) setViewMode("input");
                 if (setShowSpinner) setShowSpinner(true);
                 if (setPendingGenerate) setPendingGenerate(true);
                 // Reset selected team when START button is clicked
                 if (setSelectedTeam) setSelectedTeam(null);
               }}
               className="w-full bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold py-4 text-lg shadow-lg shadow-orange-500/25 transform hover:scale-105 transition-all duration-200"
               disabled={participants.length < 2}
             >
               {teams.length > 0 ? "🔄 Regenerate Teams" : "🚀 Generate Teams"}
             </Button>
             <Button 
               variant="outline" 
               className="w-full bg-white hover:bg-gray-50 border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3" 
               onClick={clearTeams}
             >
               🗑️ Remove All Groups
             </Button>
             <Button 
               variant="outline" 
               className="w-full bg-white hover:bg-blue-50 border-blue-300 hover:border-blue-400 text-blue-700 font-medium py-3" 
               onClick={openTeamNamesDialog}
             >
               ✏️ Set Team Names
             </Button>
           

            <Dialog open={showTeamNamesDialog} onOpenChange={setShowTeamNamesDialog}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Set Team Names</DialogTitle>
                </DialogHeader>
                <div className="space-y-3 max-h-60 overflow-y-auto">
                  {tempTeamNames.map((name, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Label className="w-16">Team {index + 1}:</Label>
                      <Input
                        value={name}
                        onChange={(e) => {
                          const newNames = [...tempTeamNames]
                          newNames[index] = e.target.value
                          setTempTeamNames(newNames)
                        }}
                      />
                    </div>
                  ))}
                </div>
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowTeamNamesDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={saveTeamNames}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={showPresetDialog} onOpenChange={open => {
              setShowPresetDialog(open)
              if (!open && setPresetGroups) setPresetGroups(zones)
            }}>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Preset Group Members <span className="ml-1 text-gray-400 cursor-pointer" title="Only available for Default distribution. Set this after done setting the CONTROLLER. Click info above for guide.">ℹ️</span></DialogTitle>
                </DialogHeader>
                <div className="text-sm font-bold text-center mb-2">Only available for Default distribution. Set this after done setting the CONTROLLER. Click info above for guide.</div>
                <div className="flex flex-col items-center gap-2">
                  <Button className="bg-yellow-600 text-white mb-2" onClick={() => setZones([...zones, []])}>Add Zone</Button>
                  {zones.map((zone, idx) => (
                    <div key={idx} className="flex items-center gap-2 w-full">
                      <span className="w-16">Zone {idx + 1}</span>
                      <Select
                        multiple
                        value={zoneSelections[idx] || []}
                        onValueChange={vals => {
                          setZoneSelections({ ...zoneSelections, [idx]: vals })
                          const newZones = [...zones]
                          newZones[idx] = vals
                          setZones(newZones)
                        }}
                      >
                        <SelectTrigger className="w-48">
                          <SelectValue placeholder="Select participants" />
                        </SelectTrigger>
                        <SelectContent>
                          {participants.map(p => (
                            <SelectItem key={p.id} value={p.id}>
                              <Checkbox checked={zoneSelections[idx]?.includes(p.id) || false} /> {p.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button variant="ghost" size="icon" onClick={() => {
                        setZones(zones.filter((_, i) => i !== idx))
                        const newSelections = { ...zoneSelections }
                        delete newSelections[idx]
                        setZoneSelections(newSelections)
                      }}><Trash2 className="w-4 h-4 text-red-600" /></Button>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between mt-4">
                  <Button variant="destructive" onClick={() => setShowPresetDialog(false)}>Cancel</Button>
                  <Button className="bg-yellow-600 text-white" onClick={() => { setPresetGroups && setPresetGroups(zones); setShowPresetDialog(false); }}>Save</Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 