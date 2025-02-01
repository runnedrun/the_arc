import { Inngest } from "inngest"
import { createLogger, format, transports } from "winston"
const { combine, errors, timestamp } = format

const baseFormat = combine(
  timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  errors({ stack: true }),
  format((info) => {
    info.level = info.level.toUpperCase()
    return info
  })()
)

// const splunkFormat = combine(baseFormat, format.json())

const prettyFormat = combine(baseFormat, format.prettyPrint())

const logger = createLogger({
  level: "info",
  format: prettyFormat,
  handleExceptions: true,
  handleRejections: true,
  transports: [new transports.Console()],
})

// Create a client to send and receive events
export const inngest = new Inngest({ id: "my-app", logger })
