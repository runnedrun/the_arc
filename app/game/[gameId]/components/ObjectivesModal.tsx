import { GameInterfaceContext } from "../GameInterfaceContext"
import { useContext } from "react"
import { useObs } from "@/data/useObs"
import { queryObs } from "@/data/readerFe"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useState } from "react"
import { useObjectives } from "../useObjectives"
import { last } from "lodash-es"

export function ObjectivesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { currentRound, currentPlayer, game } = useContext(GameInterfaceContext)

  const { secretObjectives, publicObjectives } = useObjectives()

  const secretObjective = last(secretObjectives)
  const publicObjective = last(publicObjectives)

  console.log(isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Current Objectives</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold">Secret Objective</h3>
            <p className="text-gray-700">
              {secretObjective?.content || "No secret objective"}
            </p>
          </div>

          <div>
            <h3 className="text-lg font-semibold">Public Objective</h3>
            <p className="text-gray-700">
              {publicObjective?.content || "No public objective"}
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ObjectivesButton() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:underline"
      >
        View Objectives
      </button>
      <ObjectivesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
