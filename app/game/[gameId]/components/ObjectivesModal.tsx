import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { objectiveScoringFrequency } from "@/functions/src/triggers/processRound/objectiveScoringFrequency"
import { isNil, last } from "lodash-es"
import { useContext, useState } from "react"
import { GameInterfaceContext } from "../GameInterfaceContext"
import { useObjectives } from "../useObjectives"

export function ObjectivesModal({
  isOpen,
  onClose,
}: {
  isOpen: boolean
  onClose: () => void
}) {
  const { secretObjectives, publicObjectives } = useObjectives()

  const secretObjective = last(secretObjectives)
  const publicObjective = last(publicObjectives)

  console.log(isOpen)

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
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
  const { currentRound } = useContext(GameInterfaceContext)
  const nextObjectiveScoringRound = isNil(currentRound?.index)
    ? null
    : objectiveScoringFrequency -
      (currentRound.index % objectiveScoringFrequency)

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="text-blue-600 hover:underline"
      >
        View Objectives{" "}
        {!isNil(nextObjectiveScoringRound) &&
          `(scored in ${nextObjectiveScoringRound} rounds)`}
      </button>
      <ObjectivesModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
