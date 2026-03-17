# 🎮 My Games - Multi-Game Platform

A scalable React-based gaming platform that allows you to host multiple games in a single application. Start with Scratch-to-Reveal and easily add new games.

## Project Structure

```
My_Games/
├── src/
│   ├── main.jsx                    # React entry point
│   ├── App.jsx                     # Root app component with game switching
│   │
│   ├── pages/
│   │   ├── GameLauncher.jsx        # Game selection menu
│   │   └── GameView.jsx            # Game wrapper with back button
│   │
│   ├── games/
│   │   ├── ScratchReveal/          # Scratch-to-Reveal game
│   │   │   ├── index.jsx           # Main game component
│   │   │   ├── components/
│   │   │   │   ├── ImageUpload.jsx
│   │   │   │   ├── GameBoard.jsx
│   │   │   │   ├── ScratchCanvas.jsx
│   │   │   │   ├── StatsPanel.jsx          # ✨ NEW: Stats display
│   │   │   │   ├── SoundControls.jsx       # ✨ NEW: Audio controls
│   │   │   │   └── ParticleEffects.jsx     # ✨ NEW: VFX system
│   │   │   └── styles/
│   │   │       ├── ScratchReveal.css
│   │   │       ├── ImageUpload.css
│   │   │       ├── GameBoard.css
│   │   │       ├── ScratchCanvas.css
│   │   │       └── StatsPanel.css          # ✨ NEW
│   │   │
│   │   ├── PixelChef/              # ✨ NEW: Catch falling ingredients game
│   │   │   ├── index.jsx           # Game with emotional AI chef
│   │   │   └── styles/
│   │   │       └── PixelChef.css   # Energetic styling & animations
│   │   │
│   │   └── MemoryMatch/            # Template game (uncomment in registry to activate)
│   │       └── index.jsx           # Game template with inline styles
│   │
│   ├── config/
│   │   └── gameRegistry.js         # Centralized game metadata
│   │
│   ├── utils/                      # ✨ NEW: Shared utilities
│   │   ├── audioManager.js         # Web Audio API synthesizer
│   │   └── statsManager.js         # Game statistics & persistence
│   │
│   └── styles/
│       ├── App.css
│       ├── GlobalGameStyles.css
│       ├── GameLauncher.css
│       └── GameView.css
│
├── package.json
├── vite.config.js
├── index.html
├── .gitignore
└── README.md
```

## Quick Start

### Installation

```bash
cd My_Games
npm install
npm run dev
```

The app opens at `http://localhost:3000`

### Build for Production

```bash
npm run build
npm run preview
```

## How to Add a New Game

### Step 1: Create Game Folder
```bash
mkdir -p src/games/YourGameName
```

### Step 2: Create Game Component
Create `src/games/YourGameName/index.jsx`:

```jsx
function YourGame({ onBack }) {
  return (
    <div>
      <h1>Your Awesome Game</h1>
      {/* Game content here */}
      <button onClick={onBack}>Back to Launcher</button>
    </div>
  )
}

export default YourGame
```

### Step 3: Create Game Folder Structure
```bash
mkdir -p src/games/YourGameName/{components,styles}
```

### Step 4: Register in gameRegistry.js
Edit `src/config/gameRegistry.js`:

```javascript
import YourGame from '../games/YourGameName'

export const GAMES = {
  // ... existing games
  YOUR_GAME: {
    id: 'your-game',
    title: 'Your Game Title',
    description: 'Brief description of your game',
    icon: '🎮',
    emoji: '✨',
    component: YourGame,
    active: true  // Set to true to show in launcher
  }
}
```

### Step 5: Optional - Create Game Styles
Create `src/games/YourGameName/styles/YourGame.css` and import in your game component:

```jsx
import './styles/YourGame.css'
```

### Step 6: Test
1. Run `npm run dev`
2. Your game should appear in the game launcher
3. Click to play
4. Click "Back to Launcher" to return

## Game Interface Contract

Every game component must follow this interface:

```javascript
function GameComponent({ onBack }) {
  // onBack: Function to call when user wants to return to launcher

  return (
    <div>
      {/* Game UI */}
    </div>
  )
}
```

## Available Games

### ✨ Scratch-to-Reveal (Active)
- Upload multiple images
- Scratch canvas overlay to reveal images
- Progress tracking (90% threshold to complete)
- Responsive design for all devices
- Audio effects with Web Audio API
- Game statistics tracking & persistence
- Particle effects system

### 👨‍🍳 Pixel Chef (Active - Energetic Experience)
- Catch falling ingredients under time pressure
- **Emotionally Expressive Chef**: AI character shows emotions
  - 😊 Happy expression when catching good items & power-ups
  - 😞 Sad expression when hitting obstacles
  - Emotion decays naturally over time
- Three difficulty levels (30s, 60s, 90s)
- Health system (bombs cost health)
- Particle burst effects on catches
- Responsive canvas rendering
- Web Audio synthesized sound effects

### 🧠 Memory Match (Template - Inactive)
- Use as a template for creating new games
- Shows recommended folder structure
- Includes styling guidelines

## Styling

### Global Variables
Available in all games:
```css
--primary-color: #6366f1
--secondary-color: #ec4899
--success-color: #10b981
--background: #f9fafb
--surface: #ffffff
--shadow: 0 4px 6px rgba(0, 0, 0, 0.1)
```

### Responsive Breakpoints
- **Mobile**: ≤ 480px
- **Tablet**: 481px - 1024px
- **Desktop**: 1025px+

## Features

✅ **Game Switching**: Seamless transition between games with state isolation
✅ **Responsive Design**: Works perfectly on mobile, tablet, and desktop
✅ **Modular Structure**: Easy to add, remove, or update games
✅ **Lazy Loading Ready**: Can be extended for code splitting
✅ **Consistent UX**: Unified game launcher and navigation

### 🎵 Audio System
- Web Audio API synthesizer (no external files needed)
- Configurable volume & muting
- Persistent audio preferences with localStorage
- Works on web and mobile browsers

### 📊 Statistics & Persistence
- Automatic game tracking for all games
- localStorage-based persistence (survives page reload)
- Records: completion count, time tracking, fastest/slowest times, game history
- Expandable stats panel UI
- Real-time statistics visualization

### 🎮 Game Enhancement Features
- **Emotional AI Characters**: Dynamic expressions based on game events
- **Particle Effects System**: Visual feedback for game actions
- **Canvas-based Graphics**: Smooth rendering and animations
- **Touch & Keyboard Support**: Full input flexibility

## Game Development Tips

1. **Keep Games Independent**: Games should not share state or interact with each other
2. **Use React Hooks**: useState, useEffect for state management
3. **Handle Mobile Touch**: Test on mobile devices or DevTools
4. **Responsive Design**: Use media queries for different screen sizes
5. **Performance**: Optimize rendering, especially for animations

## Project Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Technologies Used

- **React 18**: UI library
- **Vite 5**: Build tool and dev server
- **CSS3**: Styling with custom properties & animations
- **HTML5 Canvas**: For game graphics and rendering
- **Web Audio API**: Sound synthesis for games
- **localStorage API**: Game statistics persistence
- **Vanilla JavaScript**: No additional dependencies

## Performance

- Initial load: ~175KB (JS + CSS gzipped)
- Production build size: 33.83 KB CSS (gzip: 6.51 KB) + 175.72 KB JS (gzip: 55.56 KB)
- Fast game switching: <100ms
- Smooth animations at 60 FPS
- Responsive to all input (mouse, touch)
- Optimized Canvas rendering with requestAnimationFrame

## Troubleshooting

### Game doesn't appear in launcher
- Check `active: true` in gameRegistry.js
- Verify import path is correct
- Check browser console for errors

### CSS not applying
- Ensure relative paths are correct
- Check that CSS files are imported in game component
- Clear browser cache

### Performance issues
- Check for unnecessary re-renders (use React DevTools)
- Optimize images
- Consider lazy loading for large assets

## Future Enhancements

### Completed ✅
- [x] Audio system (Web Audio API synthesizer)
- [x] Game statistics tracking & persistence
- [x] Emotional AI characters with dynamic expressions
- [x] Particle effects for visual feedback
- [x] Multi-game platform foundation
- [x] Responsive mobile design

### Planned 🎯
- [ ] Authentication system for user progress
- [ ] Leaderboard tracking
- [ ] Multiplayer games
- [ ] Asset management system
- [ ] Theme customization (dark mode)
- [ ] Achievement system
- [ ] Difficulty progression system

---

**Created with ❤️ using React + Vite**

Happy gaming! 🎮
