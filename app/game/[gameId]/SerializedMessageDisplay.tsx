import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { SerializedMessage } from "./getSerializedMessages"

export function SerializedMessageDisplay({
  message,
  onNameClick,
}: {
  message: SerializedMessage
  onNameClick: () => void
}) {
  // Show typing indicator if message is processing but has no content
  if (
    !message.content &&
    message.originalMessage.processingTriggeredAt &&
    !message.originalMessage.processedAt
  ) {
    return (
      <div className="flex items-center space-x-2 p-2">
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-100" />
        <div className="h-2 w-2 animate-bounce rounded-full bg-gray-500 delay-200" />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2">
      <div
        className={cn(
          "flex w-full items-center gap-2",
          message.align === "right" && "justify-end"
        )}
      >
        <div className="text-2xl">{message.icon}</div>
        {onNameClick ? (
          <Button
            variant="ghost"
            className="h-auto p-0 font-semibold hover:bg-transparent hover:underline"
            onClick={onNameClick}
          >
            {message.senderName}
          </Button>
        ) : (
          <div className="font-semibold">{message.senderName}</div>
        )}
      </div>
      <div
        className={cn(
          "mb-2 rounded p-2",
          message.bgColor,
          message.align === "right" && "text-right"
        )}
      >
        {message.content}
      </div>
    </div>
  )
}
