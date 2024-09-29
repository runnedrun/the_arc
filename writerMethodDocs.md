# Writer Methods Documentation

This document provides an overview of the methods available for writing to firestore from the client.

## `fbSet<CollectionName>(collectionName, docId, data)`

Sets data for a document in a specified collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `docId`: The ID of the document
  - `data`: The data to be set (partial)
- **Returns**: A Promise resolving to the document reference.

**Example**:

```typescript
const gameData = {
  name: "Epic Adventure",
  players: 4,
  status: "active",
}
await fbSet<"games">("games", "game123", gameData)
```

## `fbDelete<CollectionName>(collectionName, docId)`

Deletes a document from a specified collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `docId`: The ID of the document to delete
- **Returns**: A Promise that resolves when the deletion is complete.

**Example**

```typescript
await fbDelete<"players">("players", "player456")
```

## `fbUpdate<CollectionName>(collectionName, docId, data)`

Updates a document in a specified collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `docId`: The ID of the document to update
  - `data`: The data to update (partial)
- **Returns**: A Promise resolving to the updated document reference.

**Example**

```typescript
const updateData = {
  health: 80,
  inventory: ["potion", "sword"],
}
await fbUpdate<"players">("players", "player789", updateData)
```

## `fbCreate<Key>(collectionName, data, opts?)`

Creates a new document in a specified collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `data`: The data for the new document
  - `opts`: Optional creation options (e.g., custom ID)
- **Returns**: A Promise resolving to the new document reference.

**Example**:

```typescript
const npcData = {
  name: "Shopkeeper",
  location: "Town Square",
  dialogue: ["Welcome!", "What would you like to buy?"],
}
await fbCreate<"npcs">("npcs", npcData)
```

## `fbBatchSet<CollectionName>(collectionName, records, getDocKey?, batchSize?)`

Performs a batch set operation for multiple records in a collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `records`: An array of records to be set
  - `getDocKey`: Optional function to generate document keys
  - `batchSize`: Optional batch size (default: 100)
- **Returns**: A Promise that resolves when all batches are committed.

```typescript
const valleyTiles = [
{ x: 0, y: 0, type: "grass" },
{ x: 1, y: 0, type: "water" },
{ x: 2, y: 0, type: "mountain" }
];

await fbBatchSet<"valleyTiles">("valleyTiles", valleyTiles, (tile) => ${tile.x}_${tile.y});
```

## `fbBatchDelete<CollectionName>(collectionName, recordIds, batchSize?)`

Performs a batch delete operation for multiple records in a collection.

- **Parameters**:
  - `collectionName`: The name of the collection
  - `recordIds`: An array of record IDs to be deleted
  - `batchSize`: Optional batch size (default: 100)
- **Returns**: A Promise that resolves when all batches are committed.

**Example**:

```typescript
const messageIdsToDelete = ["msg1", "msg2", "msg3", "msg4"]
await fbBatchDelete<"messages">("messages", messageIdsToDelete)
```
