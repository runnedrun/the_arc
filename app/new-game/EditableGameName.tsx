import { useState } from "react"
import { Input } from "@/components/ui/input"
import { fbSet } from "@/data/writerFe"

interface EditableGameNameProps {
  gameId: string
  initialName: string
}

export const EditableGameName: React.FC<EditableGameNameProps> = ({
  gameId,
  initialName,
}) => {
  const [isEditing, setIsEditing] = useState(false)
  const [name, setName] = useState(initialName)

  const handleDoubleClick = () => {
    setIsEditing(true)
  }

  const handleBlur = async () => {
    setIsEditing(false)
    if (name !== initialName) {
      await fbSet("games", gameId, { name })
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleBlur()
    }
    if (e.key === "Escape") {
      setName(initialName)
      setIsEditing(false)
    }
  }

  if (isEditing) {
    return (
      <Input
        value={name}
        onChange={(e) => setName(e.target.value)}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        autoFocus
        className="max-w-[200px]"
      />
    )
  }

  return (
    <span onDoubleClick={handleDoubleClick} className="text-gray-800">
      {name}
    </span>
  )
}
