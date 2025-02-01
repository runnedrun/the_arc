/**
 * Import function triggers from their respective submodules:
 *
 * import {onCall} from "firebase-functions/v2/https";
 * import {onDocumentWritten} from "firebase-functions/v2/firestore";
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

import { getBeApp } from "./helpers/getBeFirestore"
import { triggerProcessJob } from "./triggers/triggerProcessJob"

getBeApp()

// Start writing functions
// https://firebase.google.com/docs/functions/typescript

export { triggerProcessJob }
