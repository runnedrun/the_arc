This file contains methods available for reading from firestore, from the client

## `readDoc`

**Description:**
Reads a single document from Firestore.

**Type Parameters:**

- `CollectionName extends keyof AllModels`: The name of the collection.

**Parameters:**

- `collectionName` (`CollectionName`): The name of the collection.
- `id` (`string`): The ID of the document.

**Returns:**
`Promise<AllModels[CollectionName]>`: A promise that resolves to the document data.

**Example:**

```typescript
// Read a game document
const game = await readDoc("games", "game123")

// Read a player document
const player = await readDoc("players", "player456")

// Read a valleyTile document
```

---

## `docObs`

**Description:**
Creates an observable for a Firestore document that updates with the document's data.

**Type Parameters:**

- `CollectionName extends keyof AllModels`: The name of the collection.

**Parameters:**

- `collectionName` (`CollectionName`): The name of the collection.
- `id` (`string | Observable<string>`): The ID of the document or an observable that emits document IDs.

**Returns:**
`Observable<AllModels[CollectionName] | null>`: An observable that emits the document's data or `null`.

**Example:**

```typescript
// Observe a game document
const gameObs = docObs("games", "game123")
gameObs.subscribe((game) => console.log("Game updated:", game))

// Observe a player document with dynamic ID
const playerIdObs = new BehaviorSubject("player456")
const playerObs = docObs("players", playerIdObs)
playerObs.subscribe((player) => console.log("Player updated:", player))

// Observe an NPC document
const npcObs = docObs("npcs", "npc789")
npcObs.subscribe((npc) => console.log("NPC updated:", npc))
```

---

## `queryObs`

**Description:**
Creates an observable for a Firestore query with dynamic constraints.

**Type Parameters:**

- `CollectionName extends keyof AllModels`: The name of the collection.

**Parameters:**

- `collectionName` (`CollectionName`): The name of the collection.
- `buildQuery` (`function`): A function that builds an array of query constraints or observables of constraints.

**Returns:**
`Observable<AllModels[CollectionName][]>`: An observable that emits arrays of documents matching the query.

```typescript
import { where } from 'firebase/firestore';
// Query games by status
const activeGamesObs = queryObs('games', () => [
where('status', '==', 'active')
]);
activeGamesObs.subscribe(games => console.log('Active games:', games));
// Query players by game ID
const gameIdObs = new BehaviorSubject('game123');
const playersInGameObs = queryObs('players', () => [
where('gameId', '==', gameIdObs)
]);
playersInGameObs.subscribe(players => console.log('Players in game:', players));
// Query processing jobs by status
const pendingJobsObs = queryObs('processingJob', () => [
where('status', '==', 'pending'),
where('createdAt', '>', new Date(Date.now() - 24 60 60 1000))
]);
pendingJobsObs.subscribe(jobs => console.log('Pending jobs from last 24 hours:', jobs));
```
