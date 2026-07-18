"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface TitleModalProps {
  showTitleModal: boolean
  setShowTitleModal: (show: boolean) => void
  wheelTitle: string
  setWheelTitle: (title: string) => void
  wheelDescription: string
  setWheelDescription: (description: string) => void
}

export function TitleModal({
  showTitleModal,
  setShowTitleModal,
  wheelTitle,
  setWheelTitle,
  wheelDescription,
  setWheelDescription
}: TitleModalProps) {
  const [tempTitle, setTempTitle] = useState(wheelTitle)
  const [tempDescription, setTempDescription] = useState(wheelDescription)

  const handleSave = () => {
    setWheelTitle(tempTitle)
    setWheelDescription(tempDescription)
    setShowTitleModal(false)
  }

  const handleCancel = () => {
    setTempTitle(wheelTitle)
    setTempDescription(wheelDescription)
    setShowTitleModal(false)
  }

  return (
    <Dialog open={showTitleModal} onOpenChange={setShowTitleModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Customize Wheel Title & Description</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              Title
            </Label>
            <Input
              id="title"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              className="col-span-3"
              placeholder="Enter wheel title..."
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="description" className="text-right">
              Description
            </Label>
            <Textarea
              id="description"
              value={tempDescription}
              onChange={(e) => setTempDescription(e.target.value)}
              className="col-span-3"
              placeholder="Enter wheel description..."
              rows={3}
            />
          </div>
        </div>
        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 