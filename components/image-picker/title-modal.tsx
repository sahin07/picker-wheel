"use client"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

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
  setWheelDescription,
}: TitleModalProps) {
  console.log('TitleModal rendered with showTitleModal:', showTitleModal)
  return (
    <Dialog open={showTitleModal} onOpenChange={setShowTitleModal}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Modify Title & Description</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="wheel-title">Tool Title</Label>
            <Input
              id="wheel-title"
              value={wheelTitle}
              onChange={(e) => setWheelTitle(e.target.value)}
              placeholder="Enter wheel title..."
            />
          </div>
          <div>
            <Label htmlFor="wheel-description">Tool Description</Label>
            <Input
              id="wheel-description"
              value={wheelDescription}
              onChange={(e) => setWheelDescription(e.target.value)}
              placeholder="Enter wheel description..."
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setShowTitleModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowTitleModal(false)}>Save</Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
