# Description of Game front end

## Game overview:

I am creating a 4-player browser game where players become tribal leaders in a shared valley, each pursuing their own secret vision for its future over 40 rounds (years) of play. Players influence the valley's development by spending letters (the game's primary resource) to send messages to AI historians who record each tile's evolving story, interact with AI-controlled tribe members, and petition the Elder Council (a powerful AI entity), while managing the challenge of diminishing direct influence as their characters age.

## Front end description

You are helping me build the main front end interface, in this nextjs application. The front end will consist of:

### Map

A grid with green tiles, and black borders between, with each tile having a number over it, 1-16, which are clickable.

## Elder Council display

A box on the right side of the tiles, which is the elder council display, which shows a scrollable list of all messages that have been sent to the elder coucil, and a chat box to compose a new message

## player display

On the left of the tiles, there is your player display.
On the top left is a box showing the number of letters you have available, the round number, and the max number of letters you can spend on actions that round (300 - 10\*round number). Also there is a button to end your round, which will lock in the message you've composed and wait until all players have finished.

On the grid, each tile has a different colored circle indicating the player or NPC that is there. bigger circle for player. When hovered you see a name, and when you click, their information box appears on the left side. That information box also stores all the messages that have been sent to that NPC, and allows you to compose a new message.
