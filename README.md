# Blood Donations - React TypeScript App

A modern React application built with TypeScript, Vite, and a well-organized component structure.

## 🚀 Features

- ⚡ **Vite** for fast development and building
- 🔷 **TypeScript** for type safety
- ⚛️ **React 19** with functional components
- 🎯 **ESLint** for code linting
- 🎨 **Prettier** for code formatting
- 🏗️ **Well-organized folder structure**
- 🪝 **Custom hooks** (localStorage, fetch)
- 🧩 **Reusable components** with TypeScript interfaces
- 📱 **Responsive design** (basic styling)

## 📁 Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Button.tsx
│   ├── Header.tsx
│   ├── UserCard.tsx
│   └── index.ts
├── hooks/              # Custom React hooks
│   └── index.ts
├── pages/              # Page components
│   └── Home.tsx
├── types/              # TypeScript type definitions
│   └── index.ts
├── utils/              # Utility functions
│   └── index.ts
├── styles/             # Additional styles (currently empty)
├── App.tsx
└── main.tsx
```

## 🛠️ Available Scripts

- `npm run dev` - Start the development server
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting
- `npm run type-check` - Run TypeScript type checking

## 🚦 Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser and visit:**
   ```
   http://localhost:5173/
   ```

## 🧪 Development Workflow

1. **Type checking:**
   ```bash
   npm run type-check
   ```

2. **Linting:**
   ```bash
   npm run lint
   ```

3. **Format code:**
   ```bash
   npm run format
   ```

4. **Build for production:**
   ```bash
   npm run build
   ```

## 🎯 Example Components

### Button Component
A reusable button with TypeScript props:
- Multiple variants (primary, secondary, danger)
- Different sizes (small, medium, large)
- Disabled state support

### Header Component
Navigation header with user information and logout functionality.

### UserCard Component
Displays user information with edit and delete actions.

## 🪝 Custom Hooks

### useLocalStorage
Type-safe localStorage management with React state synchronization.

### useFetch
Generic data fetching hook with loading and error states.

## 🔧 Configuration

- **TypeScript**: Configured with strict mode
- **ESLint**: React and TypeScript rules
- **Prettier**: Code formatting with consistent style
- **Vite**: Fast build tool and dev server

## 🎨 Styling

Currently using inline styles for simplicity. You can easily extend this by:
- Adding CSS modules
- Integrating Tailwind CSS
- Using styled-components
- Adding a component library like Material-UI or Chakra UI

## 🚀 Next Steps

Consider adding:
- React Router for navigation
- State management (Zustand, Redux Toolkit)
- API integration
- Unit tests (Jest, React Testing Library)
- E2E tests (Playwright, Cypress)
- Component storybook
- CI/CD pipeline
