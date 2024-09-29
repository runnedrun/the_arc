A grid with green tiles, and black borders between, with each tile having a number over it, 1-16, which are clickable.
A box on the right side of the tiles, which is the elder council display, which shows a scrollable list of all messages that have been sent to the elder coucil, and a chat box to compose a new message
On the left of the tiles, there is your player display.
On the top left is a box showing the number of letters you have available, the round number, and the max number of letters you can spend on actions that round (300 - 10\*round number). Also there is a button to end your round, which will lock in the message you've composed and wait until all players have finished.

On the grid, each tile has a different colored circle indicating the player or NPC that is there. bigger circle for player. When hovered you see a name, and when you click, their information box appears on the left side. That information box also stores all the messages that have been sent to that NPC, and allows you to compose a new message.

The Arc - UI Implementation Checklist
Main Game Layout
[ ] Create a grid layout with 16 tiles (4x4)
[ ] Implement a right sidebar for the Elder Council display
[ ] Implement a left sidebar for the Player display
Tile Grid
[ ] Design green tiles with black borders
[ ] Add numbers 1-16 on each tile
[ ] Make tiles clickable
[ ] Implement colored circles on tiles to represent players/NPCs
[ ] Larger circles for players
[ ] Smaller circles for NPCs
[ ] Add hover effect to show name of player/NPC
[ ] Implement click action to show information box in left sidebar
Elder Council Display (Right Sidebar)
[ ] Create a scrollable list for all Elder Council messages
[ ] Add a chat box for composing new messages to the Elder Council
Player Display (Left Sidebar)
[ ] Create a top section showing:
[ ] Available letters count
[ ] Current round number
[ ] Max letters for actions this round (300 - 10 round number)
[ ] "End Round" button
[ ] Implement an information box for selected player/NPC
[ ] Display name and relevant info
[ ] Show a list of all messages sent to the selected entity
[ ] Add a chat box for composing new messages to the selected entity
General UI Components
[ ] Implement ShadUI for consistent styling
[ ] Create a turn indicator to show whose turn it is
[ ] Add a visual indicator for when a player has ended their turn
[ ] Implement a "Processing" overlay or animation for when the round is being processed
[ ] Add a "New Round" indicator when processing is complete
Responsive Design
[ ] Ensure the layout is responsive and works on different screen sizes
[ ] Implement a mobile-friendly version of the UI
Accessibility
[ ] Ensure proper contrast for readability
[ ] Add appropriate ARIA labels for screen readers
[ ] Implement keyboard navigation for all interactive elements
Polish and Feedback
[ ] Add subtle animations for smoother user experience (e.g., transitions between rounds)
[ ] Implement sound effects for key actions (optional)
[ ] Add tooltips for UI elements that may need explanation

# Backend game processing

1. Read all the files for a game, and then get all the messages that were sent to each tile.
2. For each NPC (not elders), get all the messages sent to the NPC and sent from the NPC, then for each NPC send the message to GPTomini along with the state of the it's tile (story), and then it has two functions
   move(tileInde: number)
   actOnTile(actionDescription:string)
3. The elder coucil is given the most recent story for every tile, along with all the actions taken on each tile this turn, and has two functions
   sendMessageToAllNPCs(message:string)
   actOnTile(tileIndex:number, actionDescription:string)

4. Loop through each tile and update it's story by passing all the messages for that tile that are unporcessed to GPT4 and have it return {newSToryEntry: string }
