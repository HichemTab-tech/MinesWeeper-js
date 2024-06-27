# Minesweeper Game 🎉

Welcome to the **Minesweeper Game**! 🚀 This is a classic Minesweeper game built with JavaScript, where you can test your puzzle-solving skills and try not to explode! 💣

## How It Works 🛠️

The game board is a grid of cells, each of which may hide a mine (💣), a flag (🚩), or a number (🔢). The goal is to uncover all the cells without mines. Here’s how we’ve set it all up:

### Game Board 🕹️

- **Cells Creation**: We created a parent `<div>` and inserted lots of child `<div>`s representing the cells. Each cell contains:
    - A mine element (💣)
    - A flag element (🚩)
    - A number element (🔢)

- **Visibility**: These elements show or hide depending on the map details, revealing what's underneath the cell when clicked.

### Game Settings ⚙️

- **Size**: The number of cells is based on the selected size:
    - **Extra Small**: 9x16 grid
    - **Small**: 16x16 grid
    - **Medium**: 32x16 grid
    - **Large**: 48x64 grid _(not applicable yet because of performance issues)_
    - **Extra Large**: 100x100 grid _(not applicable yet because of performance issues)_

- **Difficulty**: The density of mines per size depends on the difficulty level:
    - **Easy**: 10% of cells contain mines 🌟
    - **Medium**: 20% of cells contain mines 💪
    - **Hard**: 40% of cells contain mines 😱
    - **Impossible**: 60% of cells contain mines 🔥

### Uncovering Cells 🔍

We’ve implemented the **Flood Fill Algorithm** to determine which squares to uncover when a square is clicked. Here’s how it works:

1. **Initial Click**: When you click on a cell, if it has no neighboring mines (number = 0), the algorithm will start uncovering all adjacent cells recursively until it reaches cells with numbers.
2. **Recursive Uncovering**: This ensures that large empty areas are uncovered quickly and efficiently, making the game smoother and more exciting!

### Additional Features 🎨

- **Flag Mode**: Toggle between uncovering cells and placing flags with a simple click! This helps you mark potential mines and avoid explosions.
- **Timer**: A ticking clock to keep you on your toes! ⏱️ We used the **[TickWatch](https://github.com/HichemTab-tech/TickWatch-js)** library by **[HichemTab-tech](https://github.com/HichemTab-tech)** to implement the timer.

### Contributions and Suggestions 💡

We’re always open to contributions and suggestions! If you have any ideas to improve the game or if you want to contribute to the project, feel free to reach out or create a pull request. Let's make this game even more fun together! 🎉


## Enjoy the Game! 🎮

We hope you have a blast playing our Minesweeper game! It's designed to be challenging and fun. So, go ahead and see if you can uncover all the cells without hitting a mine. Good luck, and happy sweeping! 🧹💣

Created with ❤️ by **[HichemTab-tech](https://github.com/HichemTab-tech)**.