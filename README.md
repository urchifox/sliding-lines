# Sliding Lines

A minimalist "15 Puzzle" game created as a training project to deepen practical experience with React.

## Styling Approach

I applied the CSS-in-JS approach using the Emotion library. This allowed me to:
- Manage component styles in a flexible way  
- Co-locate styles with logic for better maintainability  
- Easily adapt visual states based on component state and game progress  

Special attention was given to UI animations and smooth transitions between component states to improve the overall user experience and make interactions feel responsive and polished.

## Game Logic

The core game mechanic was implemented from scratch as a custom level generation algorithm that:
- Randomly generates solvable puzzle configurations  
- Gradually increases the difficulty as the player progresses  
- Keeps the gameplay engaging by avoiding repetitive or trivial layouts  

This approach ensures a balanced learning curve while maintaining the classic feel of the "15 Puzzle" genre.
