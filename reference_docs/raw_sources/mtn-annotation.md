<filetree>
Project Structure:
├── src
│   ├── components
│   │   ├── DetailView.tsx
│   │   ├── EventContextPanel.tsx
│   │   ├── NavigationControls.tsx
│   │   ├── PatientInfo.tsx
│   │   ├── TimeSeriesPanel.tsx
│   │   └── TimelineOverview.tsx
│   ├── contexts
│   │   └── TimeRangeContext.tsx
│   ├── types
│   │   └── annotations.ts
│   ├── utils
│   │   ├── aiAnnotationGenerator.ts
│   │   └── artifactGenerator.ts
│   ├── App.css
│   ├── App.tsx
│   ├── index.css
│   ├── main.tsx
│   └── vite-env.d.ts
├── eslint.config.js
├── index.html
├── package.json
├── start-demo.sh
├── tsconfig.app.json
├── tsconfig.json
├── tsconfig.node.json
└── vite.config.ts

</filetree>

<source_code>
eslint.config.js
```
import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  { ignores: ['dist'] },
  {
    extends: [js.configs.recommended, ...tseslint.configs.recommended],
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
    },
  },
)
```

index.html
```
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vite + React + TS</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

package.json
```
{
  "name": "clinical-viz",
  "private": true,
  "version": "0.1.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "lint": "eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0",
    "preview": "vite preview"
  },
  "dependencies": {
    "@emotion/react": "^11.11.3",
    "@emotion/styled": "^11.11.0",
    "@mui/icons-material": "^5.15.6",
    "@mui/material": "^5.15.6",
    "@tanstack/react-query": "^5.17.19",
    "@types/react-plotly.js": "^2.6.3",
    "d3": "^7.8.5",
    "date-fns": "^3.3.1",
    "plotly.js-dist": "^2.35.3",
    "plotly.js-dist-min": "^2.28.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-plotly.js": "^2.6.0",
    "react-virtualized": "^9.22.5",
    "recharts": "^2.15.0"
  },
  "devDependencies": {
    "@types/d3": "^7.4.3",
    "@types/plotly.js": "^2.12.30",
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@types/react-virtualized": "^9.21.29",
    "@typescript-eslint/eslint-plugin": "^5.62.0",
    "@typescript-eslint/parser": "^5.62.0",
    "@vitejs/plugin-react": "^4.2.1",
    "eslint": "^8.55.0",
    "eslint-plugin-react-hooks": "^4.6.0",
    "eslint-plugin-react-refresh": "^0.4.5",
    "typescript": "^5.7.2",
    "vite": "^5.0.8"
  }
}
```

start-demo.sh
```
#!/bin/bash

# Clinical Data Visualization System - Demo Setup Script
# This script sets up and starts the clinical visualization demo

set -e  # Exit on any error

# Default configuration
PORT="5173"
HOST="false"
AUTO_OPEN="true"

echo "🏥 Clinical Data Visualization System - Demo Setup"
echo "=================================================="

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✓${NC} $1"
}

print_info() {
    echo -e "${BLUE}ℹ${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Function to check if port is in use
check_port() {
    local port=$1
    lsof -Pi :$port -sTCP:LISTEN -t >/dev/null 2>&1
}

# Function to kill processes on a port
kill_port() {
    local port=$1
    local pids=$(lsof -ti:$port 2>/dev/null)
    if [ ! -z "$pids" ]; then
        print_warning "Killing existing process on port $port"
        kill -9 $pids
        sleep 2
    fi
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed!"
        echo ""
        echo "Please install Node.js (version 18 or higher):"
        echo "  - macOS: brew install node"
        echo "  - Or visit: https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node --version | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ required. Current version: $(node --version)"
        exit 1
    fi
    
    print_status "Node.js $(node --version) detected"
}

# Check if npm is installed
check_npm() {
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed!"
        exit 1
    fi
    print_status "npm $(npm --version) detected"
}

# Install dependencies
install_dependencies() {
    print_info "Installing project dependencies..."
    
    if [ -f "package-lock.json" ]; then
        npm ci
    else
        npm install
    fi
    
    print_status "Dependencies installed successfully"
}

# Build the project
build_project() {
    print_info "Building the project..."
    npm run build
    print_status "Project built successfully"
}

# Function to show usage
show_usage() {
    echo "🏥 Clinical Data Visualization System - Demo Setup"
    echo ""
    echo "Usage: $0 [OPTIONS]"
    echo ""
    echo "PORT OPTIONS:"
    echo "  -p, --port PORT               Frontend port (default: 5173)"
    echo ""
    echo "NETWORK OPTIONS:"
    echo "  --host                        Enable remote access"
    echo "  -n, --no-open                Don't automatically open browser"
    echo ""
    echo "SETUP OPTIONS:"
    echo "  --help                        Show this help message"
    echo ""
    echo "EXAMPLES:"
    echo "  # Default setup (port 5173)"
    echo "  $0"
    echo ""
    echo "  # Custom port"
    echo "  $0 --port 3005"
    echo ""
    echo "  # Enable remote access"
    echo "  $0 --host"
    echo ""
    echo "  # Custom port with remote access"
    echo "  $0 -p 8080 --host --no-open"
    echo ""
}

# Start the development server
start_server() {
    # Clean up any existing processes on the port
    kill_port "$PORT"
    
    print_info "Starting the development server on port $PORT..."
    echo ""
    
    # Build URL for display
    local host_display="localhost"
    if [ "$HOST" = "true" ]; then
        host_display=$(hostname -I | awk '{print $1}' 2>/dev/null || echo "localhost")
    fi
    
    print_status "🚀 Demo will open at: http://$host_display:$PORT"
    print_info "Press Ctrl+C to stop the server"
    echo ""
    
    # Set environment variables for Vite
    export VITE_PORT="$PORT"
    export PORT="$PORT"
    if [ "$HOST" = "true" ]; then
        export VITE_HOST="true"
    fi
    
    # Auto-open browser if requested
    if [ "$AUTO_OPEN" = "true" ]; then
        # Start server in background briefly to allow browser to open
        npm run dev -- --port "$PORT" $([ "$HOST" = "true" ] && echo "--host") &
        SERVER_PID=$!
        
        # Wait a moment then open browser
        sleep 2
        
        print_info "Opening browser..."
        if command -v open &> /dev/null; then
            open "http://localhost:$PORT"
        elif command -v xdg-open &> /dev/null; then
            xdg-open "http://localhost:$PORT"
        elif command -v start &> /dev/null; then
            start "http://localhost:$PORT"
        else
            print_warning "Could not auto-open browser. Please open: http://localhost:$PORT"
        fi
        
        # Bring server to foreground
        fg
    else
        # Start server normally
        npm run dev -- --port "$PORT" $([ "$HOST" = "true" ] && echo "--host")
    fi
}

# Cleanup function for graceful shutdown
cleanup() {
    echo ""
    print_info "Shutting down demo server..."
    
    # Kill any processes on the configured port
    kill_port "$PORT"
    
    print_status "Demo server shut down successfully!"
    exit 0
}

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        -p|--port)
            PORT="$2"
            shift 2
            ;;
        --host)
            HOST="true"
            shift
            ;;
        -n|--no-open)
            AUTO_OPEN="false"
            shift
            ;;
        --help)
            show_usage
            exit 0
            ;;
        *)
            print_error "Unknown option: $1"
            echo "Use --help for usage information"
            exit 1
            ;;
    esac
done

# Set up signal handling for graceful shutdown
trap cleanup SIGINT SIGTERM

# Main execution
main() {
    print_info "Checking system requirements..."
    check_node
    check_npm
    
    echo ""
    print_info "Setting up the demo..."
    install_dependencies
    
    echo ""
    print_info "Verifying build..."
    build_project
    
    echo ""
    print_info "🎉 Setup complete! Starting the demo..."
    echo ""
    print_status "Features available in this demo:"
    echo "  • Interactive timeline visualization"
    echo "  • Real-time physiological data (ECG, PPG, Heart Rate)"
    echo "  • AI-powered anomaly detection"
    echo "  • Annotation and bookmarking system"
    echo "  • Clinical event tracking"
    echo ""
    
    start_server
}

# Run the main function
main "$@"
```

tsconfig.app.json
```
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.app.tsbuildinfo",
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["src"]
}
```

tsconfig.json
```
{
  "files": [],
  "references": [
    { "path": "./tsconfig.app.json" },
    { "path": "./tsconfig.node.json" }
  ]
}
```

tsconfig.node.json
```
{
  "compilerOptions": {
    "tsBuildInfoFile": "./node_modules/.tmp/tsconfig.node.tsbuildinfo",
    "target": "ES2022",
    "lib": ["ES2023"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "isolatedModules": true,
    "moduleDetection": "force",
    "noEmit": true,

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedSideEffectImports": true
  },
  "include": ["vite.config.ts"]
}
```

vite.config.ts
```
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: parseInt(process.env.VITE_PORT || process.env.PORT || '5173'),
    host: process.env.VITE_HOST === 'true' ? '0.0.0.0' : 'localhost'
  }
})
```

src/App.css
```
#root {
  max-width: 1280px;
  margin: 0 auto;
  padding: 2rem;
  text-align: center;
}

.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
  transition: filter 300ms;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.react:hover {
  filter: drop-shadow(0 0 2em #61dafbaa);
}

@keyframes logo-spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@media (prefers-reduced-motion: no-preference) {
  a:nth-of-type(2) .logo {
    animation: logo-spin infinite 20s linear;
  }
}

.card {
  padding: 2em;
}

.read-the-docs {
  color: #888;
}
```

src/App.tsx
```
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import TimelineOverview from './components/TimelineOverview';
import DetailView from './components/DetailView';
import NavigationControls from './components/NavigationControls';
import { TimeRangeProvider } from './contexts/TimeRangeContext';

const theme = createTheme({
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
    fontSize: 14,
    h6: {
      fontSize: '1.25rem',
      fontWeight: 600,
    },
    subtitle1: {
      fontSize: '1.1rem',
    },
    subtitle2: {
      fontSize: '1rem',
      fontWeight: 600,
    },
    body1: {
      fontSize: '1rem',
    },
    body2: {
      fontSize: '0.95rem',
    },
    caption: {
      fontSize: '0.9rem',
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          margin: 0,
          padding: 0,
          overflow: 'hidden',
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontSize: '0.9rem',
          height: 28,
        },
        sizeSmall: {
          fontSize: '0.85rem',
          height: 24,
        },
      },
    },
    MuiTab: {
      styleOverrides: {
        root: {
          fontSize: '0.95rem',
          minHeight: 48,
        },
      },
    },
    MuiListItem: {
      styleOverrides: {
        root: {
          paddingTop: 12,
          paddingBottom: 12,
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          padding: 10,
        },
        sizeSmall: {
          padding: 8,
        },
      },
    },
  },
  spacing: 8,
  palette: {
    mode: 'light',
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
    background: {
      default: '#fafafa',
      paper: '#ffffff',
    },
    divider: 'rgba(0, 0, 0, 0.08)',
  },
});

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <TimeRangeProvider>
          <Box sx={{ 
            height: '100vh', 
            width: '100vw',
            display: 'flex', 
            flexDirection: 'column',
            overflow: 'hidden',
            bgcolor: 'background.default',
          }}>
            {/* Timeline Overview with data availability matrix */}
            <Box sx={{ height: '15%', minHeight: 120, p: 2 }}>
              <TimelineOverview />
            </Box>
            
            {/* Main content area */}
            <Box sx={{ 
              height: '80%', 
              display: 'flex',
              overflow: 'hidden',
            }}>
              <DetailView />
            </Box>
            
            {/* Navigation controls */}
            <Box sx={{ 
              height: '5%', 
              minHeight: 48,
              borderTop: 1,
              borderColor: 'divider',
            }}>
              <NavigationControls />
            </Box>
          </Box>
        </TimeRangeProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
```

src/index.css
```
:root {
  font-family: Inter, system-ui, Avenir, Helvetica, Arial, sans-serif;
  line-height: 1.5;
  font-weight: 400;

  color-scheme: light dark;
  color: rgba(255, 255, 255, 0.87);
  background-color: #242424;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

a {
  font-weight: 500;
  color: #646cff;
  text-decoration: inherit;
}
a:hover {
  color: #535bf2;
}

body {
  margin: 0;
  display: flex;
  place-items: center;
  min-width: 320px;
  min-height: 100vh;
}

h1 {
  font-size: 3.2em;
  line-height: 1.1;
}

button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  background-color: #1a1a1a;
  cursor: pointer;
  transition: border-color 0.25s;
}
button:hover {
  border-color: #646cff;
}
button:focus,
button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

@media (prefers-color-scheme: light) {
  :root {
    color: #213547;
    background-color: #ffffff;
  }
  a:hover {
    color: #747bff;
  }
  button {
    background-color: #f9f9f9;
  }
}

/* Add Plotly-specific styles */
.js-plotly-plot {
  width: 100% !important;
  height: 100% !important;
}

.js-plotly-plot .plotly {
  width: 100% !important;
  height: 100% !important;
}

.plot-container.plotly {
  width: 100% !important;
  height: 100% !important;
}

/* Ensure parent containers have proper height */
html, body, #root {
  height: 100%;
  margin: 0;
  padding: 0;
  overflow: hidden;
}

/* Reset any conflicting styles */
body {
  display: block;
  place-items: initial;
}

/* Ensure proper box-sizing */
* {
  box-sizing: border-box;
}
```

src/main.tsx
```
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
```

src/vite-env.d.ts
```
/// <reference types="vite/client" />
```

src/contexts/TimeRangeContext.tsx
```
import React, { createContext, useContext, useState } from 'react';

interface TimeRange {
  start: Date;
  end: Date;
  zoom: number;
}

interface FocusRegion {
  start: Date;
  end: Date;
  timeSeriesType?: string;
}

interface TimeRangeContextType {
  timeRange: TimeRange;
  selectedTimeRange: TimeRange | null;
  setSelectedTimeRange: (range: TimeRange | null) => void;
  focusRegion: FocusRegion | null;
  setFocusRegion: (region: FocusRegion | null) => void;
}

const TimeRangeContext = createContext<TimeRangeContextType | undefined>(undefined);

export const TimeRangeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const now = new Date();
  const defaultRange = {
    start: new Date(now.getTime() - 4 * 60 * 60 * 1000), // 4 hours ago
    end: now,
    zoom: 1,
  };

  const [timeRange] = useState<TimeRange>(defaultRange);
  const [selectedTimeRange, setSelectedTimeRange] = useState<TimeRange | null>(null);
  const [focusRegion, setFocusRegion] = useState<FocusRegion | null>(null);

  return (
    <TimeRangeContext.Provider value={{ 
      timeRange, 
      selectedTimeRange, 
      setSelectedTimeRange,
      focusRegion,
      setFocusRegion
    }}>
      {children}
    </TimeRangeContext.Provider>
  );
};

export const useTimeRange = () => {
  const context = useContext(TimeRangeContext);
  if (context === undefined) {
    throw new Error('useTimeRange must be used within a TimeRangeProvider');
  }
  return context;
}; 
```

src/components/DetailView.tsx
```
import { Box, Paper } from '@mui/material';
import { useState, useEffect } from 'react';
import TimeSeriesPanel from './TimeSeriesPanel';
import EventContextPanel from './EventContextPanel';
import PatientInfo from './PatientInfo';
import { TimeSeriesAnnotation, AIAnnotation, AnnotationEvent } from '../types/annotations';
import { createPhysiologicalSignalsWithArtifacts } from '../utils/artifactGenerator';
import { generateAIAnnotations } from '../utils/aiAnnotationGenerator';
import { useTimeRange } from '../contexts/TimeRangeContext';

const timeSeriesConfig = [
  { id: 'heart_rate', label: 'Heart Rate', height: '20%' },
  { id: 'ecg', label: 'ECG', height: '25%' },
  { id: 'ppg', label: 'PPG', height: '20%' },
  { id: 'medications', label: 'Medications', height: '15%' },
  { id: 'labs', label: 'Labs', height: '20%' },
];

const DetailView = () => {
  const { selectedTimeRange, timeRange } = useTimeRange();
  const [events, setEvents] = useState<AnnotationEvent[]>([
    {
      id: '1',
      timestamp: new Date(),
      type: 'medication',
      title: 'Administered Medication',
      description: 'Administered 500mg of Acetaminophen',
      category: 'medication',
    },
    {
      id: '2',
      timestamp: new Date(Date.now() - 1000 * 60 * 30),
      type: 'note',
      title: 'Nurse Note',
      description: 'Patient reports feeling better after medication. Vital signs stable.',
      category: 'nursing',
    },
  ]);

  const [aiAnnotations, setAIAnnotations] = useState<AIAnnotation[]>([]);

  // Generate AI annotations when time range changes
  useEffect(() => {
    const currentRange = selectedTimeRange || timeRange;
    const points = 1000;
    
    // 🔍 DEBUG: CRITICAL - Log AI annotation generation time range
    console.log("🚨 DETAILVIEW - AI ANNOTATION GENERATION:", {
      currentRange: {
        start: currentRange.start.toISOString(),
        end: currentRange.end.toISOString(),
        startTime: currentRange.start.toLocaleTimeString(),
        endTime: currentRange.end.toLocaleTimeString()
      },
      dataSource: selectedTimeRange ? 'selectedTimeRange' : 'defaultTimeRange',
      selectedTimeRange: selectedTimeRange ? {
        start: selectedTimeRange.start.toISOString(),
        end: selectedTimeRange.end.toISOString()
      } : null,
      defaultTimeRange: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString()
      },
      timeRangeMatch: {
        selectedEqualsDefault: selectedTimeRange ? 
          selectedTimeRange.start.getTime() === timeRange.start.getTime() && 
          selectedTimeRange.end.getTime() === timeRange.end.getTime() : 
          'selectedTimeRange is null'
      }
    });

    // Generate one set of signal generators that all signal types will use
    // This ensures consistent artifact placement across all signals
    const signalGenerators = createPhysiologicalSignalsWithArtifacts(
      currentRange.start, 
      currentRange.end, 
      points
    );
    
    // Collect artifacts from all signal types, but avoid duplicates for shared anomalies
    const allArtifactsMap = new Map<string, any>();
    
    ['heart_rate', 'ecg', 'ppg'].forEach(signalType => {
      const artifacts = signalGenerators[signalType]?.getArtifactsInRange(
        currentRange.start, 
        currentRange.end
      ) || [];
      
      // 🔍 DEBUG: Log artifacts summary only
      if (artifacts.length > 0) {
        console.log(`🔍 ${signalType}: ${artifacts.length} artifacts at ${artifacts.map(a => 
          `${((a.timestamp.getTime() - currentRange.start.getTime()) / (currentRange.end.getTime() - currentRange.start.getTime()) * 100).toFixed(0)}%`
        ).join(', ')}`);
      }
      
      artifacts.forEach(artifact => {
        // Create unique key for shared anomalies (same timestamp + type)
        // But keep separate entries for signal-specific noise
        const uniqueKey = artifact.type === 'anomaly' 
          ? `${artifact.type}-${artifact.timestamp.getTime()}-${artifact.duration}`
          : `${artifact.type}-${artifact.timestamp.getTime()}-${artifact.timeSeriesType}`;
        
        if (!allArtifactsMap.has(uniqueKey)) {
          allArtifactsMap.set(uniqueKey, artifact);
        }
      });
    });
    
    const allArtifacts = Array.from(allArtifactsMap.values());

    // 🔍 DEBUG: Log final summary
    console.log("🔍 Final AI Annotations:", {
      count: allArtifacts.length,
      types: allArtifacts.reduce((acc, a) => {
        acc[a.type] = (acc[a.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    });

    // Generate AI annotations from artifacts
    const newAIAnnotations = generateAIAnnotations(allArtifacts);
    
    // 🔍 DEBUG: Log generated AI annotations
    console.log("🔍 Generated AI Annotations:", newAIAnnotations.map(a => ({
      id: a.id,
      artifactType: a.artifactType,
      timeSeriesType: a.timeSeriesType,
      startTime: a.startTime.toISOString(),
      endTime: a.endTime.toISOString(),
      percentOfRange: ((a.startTime.getTime() - currentRange.start.getTime()) / (currentRange.end.getTime() - currentRange.start.getTime())) * 100
    })));
    
    setAIAnnotations(newAIAnnotations);
  }, [selectedTimeRange, timeRange]);

  const handleAnnotationCreate = (annotation: TimeSeriesAnnotation) => {
    const newEvent: AnnotationEvent = {
      id: annotation.id,
      timestamp: annotation.startTime,
      type: 'annotation',
      title: `${annotation.timeSeriesType} Annotation`,
      description: annotation.notes || '',
      timeSeriesType: annotation.timeSeriesType,
      startTime: annotation.startTime,
      endTime: annotation.endTime,
      tags: annotation.tags || [],
      annotation: annotation,
    };
    setEvents(prevEvents => [...prevEvents, newEvent]);
  };

  const handleAnnotationUpdate = (updatedEvent: AnnotationEvent) => {
    setEvents(prevEvents => prevEvents.map(event => 
      event.id === updatedEvent.id ? updatedEvent : event
    ));
  };

  const handleAIAnnotationUpdate = (updatedAnnotation: AIAnnotation) => {
    setAIAnnotations(prevAnnotations => 
      prevAnnotations.map(annotation => 
        annotation.id === updatedAnnotation.id ? updatedAnnotation : annotation
      )
    );
  };

  return (
    <Box sx={{ 
      display: 'flex', 
      width: '100%', 
      height: '100%',
      overflow: 'hidden',
    }}>
      {/* Left panel - Patient Info */}
      <Paper 
        elevation={3}
        sx={{ 
          width: '15%', 
          minWidth: 200,
          overflow: 'auto',
          borderRadius: 0,
        }}
      >
        <PatientInfo />
      </Paper>

      {/* Center panel - Stacked Time Series */}
      <Box sx={{ 
        width: '65%',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        '&::-webkit-scrollbar': {
          width: '8px',
          height: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,.2)',
          borderRadius: '4px',
        },
      }}>
        {timeSeriesConfig.map((config, index) => (
          <Box 
            key={config.id}
            sx={{ 
              height: config.height,
              minHeight: 150,
              position: 'relative',
              borderBottom: index < timeSeriesConfig.length - 1 ? 1 : 0,
              borderColor: 'divider',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Box sx={{ flex: 1, position: 'relative', minHeight: 0 }}>
              <TimeSeriesPanel 
                type={config.id} 
                onAnnotationCreate={handleAnnotationCreate}
                aiAnnotations={aiAnnotations}
                onAIAnnotationUpdate={handleAIAnnotationUpdate}
              />
            </Box>
          </Box>
        ))}
      </Box>

      {/* Right panel - Events and Notes */}
      <Paper 
        elevation={3}
        sx={{ 
          width: '20%',
          minWidth: 300,
          display: 'flex',
          flexDirection: 'column',
          borderRadius: 0,
        }}
      >
        <EventContextPanel 
          events={events}
          onAnnotationUpdate={handleAnnotationUpdate}
          aiAnnotations={aiAnnotations}
          onAIAnnotationUpdate={handleAIAnnotationUpdate}
        />
      </Paper>
    </Box>
  );
};

export default DetailView; 
```

src/components/EventContextPanel.tsx
```
import { useState, useEffect } from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemText,
  Typography,
  Tabs,
  Tab,
  IconButton,
  Chip,
  Paper,
  TextField,
  Stack,
  Button,
  Autocomplete,
  ButtonGroup,
  Badge,
} from '@mui/material';
import {
  Event as EventIcon,
  Note as NoteIcon,
  LocalHospital as MedicationIcon,
  Timeline as TimelineIcon,
  ExpandMore,
  ExpandLess,
  Edit as EditIcon,
  Save as SaveIcon,
  Label as LabelIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  SmartToy as AIIcon,
} from '@mui/icons-material';
import { AnnotationEvent, AIAnnotation } from '../types/annotations';
import { getArtifactColor, getArtifactIcon } from '../utils/aiAnnotationGenerator';
import { useTimeRange } from '../contexts/TimeRangeContext';

interface EventContextPanelProps {
  events: AnnotationEvent[];
  onAnnotationUpdate?: (event: AnnotationEvent) => void;
  aiAnnotations?: AIAnnotation[];
  onAIAnnotationUpdate?: (annotation: AIAnnotation) => void;
}

// Common tags for suggestions
const commonTags = [
  'Important',
  'Follow-up',
  'Review',
  'Abnormal',
  'Normal',
  'Critical',
  'Stable',
  'Unstable',
  'Intervention',
  'Medication',
];

const EventContextPanel = ({ 
  events, 
  onAnnotationUpdate, 
  aiAnnotations = [], 
  onAIAnnotationUpdate 
}: EventContextPanelProps) => {
  const { setFocusRegion, focusRegion } = useTimeRange();
  const [activeTab, setActiveTab] = useState(0);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const [editingEvent, setEditingEvent] = useState<string | null>(null);
  const [editingTags, setEditingTags] = useState<string[]>([]);
  const [editingNotes, setEditingNotes] = useState('');
  const [customTag, setCustomTag] = useState('');
  const [focusedAnnotationId, setFocusedAnnotationId] = useState<string | null>(null);

  // Clear focus when switching away from AI Findings tab
  useEffect(() => {
    if (activeTab !== 4) { // 4 is the AI Findings tab
      setFocusRegion(null);
      setFocusedAnnotationId(null);
    }
  }, [activeTab, setFocusRegion]);

  const handleAnnotationSave = (event: AnnotationEvent) => {
    if (!onAnnotationUpdate) return;

    const updatedEvent = {
      ...event,
      description: editingNotes,
      tags: editingTags,
    };
    onAnnotationUpdate(updatedEvent);
    setEditingEvent(null);
  };

  const handleStartEditing = (event: AnnotationEvent) => {
    setEditingEvent(event.id);
    setEditingTags(event.tags || []);
    setEditingNotes(event.description || '');
    setExpandedEvent(event.id);
  };

  const handleAIAnnotationApproval = (annotation: AIAnnotation, approved: boolean) => {
    if (!onAIAnnotationUpdate) return;

    const updatedAnnotation: AIAnnotation = {
      ...annotation,
      approvalStatus: approved ? 'approved' : 'rejected',
      approvedBy: 'User',
      approvedAt: new Date(),
    };
    
    onAIAnnotationUpdate(updatedAnnotation);
  };

  const handleAIAnnotationClick = (annotation: AIAnnotation) => {
    // Toggle behavior: if this annotation is already focused, clear it; otherwise set it
    if (focusedAnnotationId === annotation.id) {
      // Clicking the same annotation again - clear the focus
      setFocusRegion(null);
      setFocusedAnnotationId(null);
    } else {
      // Clicking a different annotation - set focus to this one
      setFocusRegion({
        start: annotation.startTime,
        end: annotation.endTime,
        timeSeriesType: annotation.timeSeriesType
      });
      setFocusedAnnotationId(annotation.id);
    }
  };

  const handleAddCustomTag = () => {
    if (customTag && !editingTags.includes(customTag)) {
      setEditingTags([...editingTags, customTag]);
      setCustomTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setEditingTags(editingTags.filter(tag => tag !== tagToRemove));
  };

  const getEventIcon = (type: AnnotationEvent['type']) => {
    switch (type) {
      case 'medication':
        return <MedicationIcon color="primary" />;
      case 'note':
        return <NoteIcon color="action" />;
      case 'annotation':
        return <TimelineIcon color="info" />;
      case 'event':
        return <EventIcon color="secondary" />;
    }
  };

  const getSeverityColor = (severity?: AnnotationEvent['severity']) => {
    switch (severity) {
      case 'high':
        return 'error';
      case 'medium':
        return 'warning';
      case 'low':
        return 'success';
      default:
        return 'default';
    }
  };

  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Tabs
        value={activeTab}
        onChange={(_, newValue) => setActiveTab(newValue)}
        sx={{ borderBottom: 1, borderColor: 'divider' }}
      >
        <Tab label="All Events" />
        <Tab label="Notes" />
        <Tab label="Medications" />
        <Tab label="Annotations" />
        <Tab 
          label={
            <Badge 
              badgeContent={aiAnnotations.filter(a => a.approvalStatus === 'pending').length}
              color="warning"
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AIIcon fontSize="small" />
                AI Findings
              </Box>
            </Badge>
          }
        />
      </Tabs>

      <List sx={{ flexGrow: 1, overflow: 'auto' }}>
        {activeTab === 4 ? 
          // AI Annotations Tab - 🔧 FIX: Sort chronologically (oldest first) instead of newest first
          // This matches user expectation for timeline viewing - events should flow chronologically
          aiAnnotations
            .sort((a, b) => a.startTime.getTime() - b.startTime.getTime()) // Changed from descending to ascending
            .map(annotation => (
                              <Paper
                  key={annotation.id}
                  elevation={focusedAnnotationId === annotation.id ? 3 : 1}
                  sx={{ 
                    m: 1,
                    border: focusedAnnotationId === annotation.id ? 3 : 
                            annotation.approvalStatus === 'pending' ? 2 : 1,
                    borderColor: focusedAnnotationId === annotation.id ? 'primary.main' :
                                 annotation.approvalStatus === 'pending' ? 'warning.main' : 'divider',
                    backgroundColor: focusedAnnotationId === annotation.id ? 'action.selected' : 'background.paper'
                  }}
              >
                <ListItem
                  button
                  onClick={() => handleAIAnnotationClick(annotation)}
                  sx={{ 
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: 'action.hover'
                    }
                  }}
                >
                  <Box sx={{ mr: 2 }}>
                    <AIIcon 
                      sx={{ 
                        color: getArtifactColor(annotation.artifactType),
                        fontSize: 32 
                      }} 
                    />
                  </Box>
                  <ListItemText
                    primary={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <Typography variant="subtitle2">
                          {getArtifactIcon(annotation.artifactType)} {annotation.artifactType.replace('_', ' ')}
                        </Typography>
                        <Chip 
                          label={`${(annotation.confidence * 100).toFixed(0)}%`}
                          size="small"
                          color={annotation.confidence > 0.8 ? 'success' : 
                                 annotation.confidence > 0.6 ? 'warning' : 'default'}
                        />
                        <Chip 
                          label={annotation.approvalStatus}
                          size="small"
                          color={annotation.approvalStatus === 'approved' ? 'success' : 
                                 annotation.approvalStatus === 'rejected' ? 'error' : 'warning'}
                        />
                      </Box>
                    }
                    secondary={
                      <Box>
                        <Typography variant="body2" sx={{ mb: 1 }}>
                          {annotation.detectionReason}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {annotation.timeSeriesType} • {annotation.startTime.toLocaleTimeString()} - {annotation.endTime.toLocaleTimeString()}
                        </Typography>
                        {annotation.approvalStatus === 'pending' && (
                          <Box sx={{ mt: 1 }}>
                            <ButtonGroup size="small">
                              <Button
                                variant="contained"
                                color="success"
                                startIcon={<CheckIcon />}
                                onClick={() => handleAIAnnotationApproval(annotation, true)}
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outlined"
                                color="error"
                                startIcon={<CloseIcon />}
                                onClick={() => handleAIAnnotationApproval(annotation, false)}
                              >
                                Reject
                              </Button>
                            </ButtonGroup>
                          </Box>
                        )}
                      </Box>
                    }
                  />
                </ListItem>
              </Paper>
            ))
        :
          // Regular Events Tabs
          events
            .filter(event => {
              if (activeTab === 1) return event.type === 'note';
              if (activeTab === 2) return event.type === 'medication';
              if (activeTab === 3) return event.type === 'annotation';
              return true;
            })
          .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
          .map(event => (
            <Paper
              key={event.id}
              elevation={1}
              sx={{ m: 1 }}
            >
              <ListItem
                secondaryAction={
                  <Stack direction="row" spacing={1}>
                    {event.type === 'annotation' && (
                      <IconButton
                        edge="end"
                        onClick={() => {
                          if (editingEvent === event.id) {
                            handleAnnotationSave(event);
                          } else {
                            handleStartEditing(event);
                          }
                        }}
                      >
                        {editingEvent === event.id ? <SaveIcon /> : <EditIcon />}
                      </IconButton>
                    )}
                    <IconButton
                      edge="end"
                      onClick={() => setExpandedEvent(
                        expandedEvent === event.id ? null : event.id
                      )}
                    >
                      {expandedEvent === event.id ? <ExpandLess /> : <ExpandMore />}
                    </IconButton>
                  </Stack>
                }
              >
                <Box sx={{ mr: 2 }}>
                  {getEventIcon(event.type)}
                </Box>
                <ListItemText
                  primary={
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="subtitle2">
                        {event.title}
                      </Typography>
                      {event.severity && (
                        <Chip
                          label={event.severity}
                          size="small"
                          color={getSeverityColor(event.severity)}
                        />
                      )}
                    </Box>
                  }
                  secondary={
                    <>
                      <Typography variant="caption" display="block">
                        {event.type === 'annotation' && event.startTime && event.endTime ? (
                          `${event.startTime.toLocaleTimeString()} - ${event.endTime.toLocaleTimeString()}`
                        ) : (
                          event.timestamp.toLocaleTimeString()
                        )}
                      </Typography>
                      {event.category && (
                        <Chip
                          label={event.category}
                          size="small"
                          variant="outlined"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                      {event.tags && event.tags.length > 0 && (
                        <Box sx={{ mt: 0.5, display: 'flex', gap: 0.5, flexWrap: 'wrap' }}>
                          {event.tags.map((tag, index) => (
                            <Chip
                              key={index}
                              label={tag}
                              size="small"
                              color="info"
                              variant="outlined"
                              onDelete={
                                editingEvent === event.id 
                                  ? () => handleRemoveTag(tag)
                                  : undefined
                              }
                            />
                          ))}
                        </Box>
                      )}
                    </>
                  }
                />
              </ListItem>
              {expandedEvent === event.id && (
                <Box sx={{ p: 2, pt: 0 }}>
                  {editingEvent === event.id ? (
                    <Stack spacing={2}>
                      <Box>
                        <Typography variant="caption" color="textSecondary" sx={{ mb: 1, display: 'block' }}>
                          Tags
                        </Typography>
                        <Stack spacing={1}>
                          <Autocomplete
                            multiple
                            freeSolo
                            options={commonTags.filter(tag => !editingTags.includes(tag))}
                            value={editingTags}
                            onChange={(_, newValue) => setEditingTags(newValue as string[])}
                            renderTags={(value, getTagProps) =>
                              value.map((tag, index) => (
                                <Chip
                                  {...getTagProps({ index })}
                                  key={tag}
                                  label={tag}
                                  size="small"
                                  color="info"
                                  variant="outlined"
                                />
                              ))
                            }
                            renderInput={(params) => (
                              <TextField
                                {...params}
                                variant="outlined"
                                size="small"
                                placeholder="Add tags..."
                              />
                            )}
                          />
                        </Stack>
                      </Box>
                      <TextField
                        label="Notes"
                        value={editingNotes}
                        onChange={(e) => setEditingNotes(e.target.value)}
                        multiline
                        rows={3}
                        size="small"
                        fullWidth
                      />
                    </Stack>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                  )}
                </Box>
              )}
            </Paper>
          ))}
      </List>
    </Box>
  );
};

export default EventContextPanel; 
```

src/components/NavigationControls.tsx
```
import {
  Box,
  IconButton,
  Slider,
  Typography,
  ButtonGroup,
  Button,
  Tooltip,
} from '@mui/material';
import {
  ZoomIn,
  ZoomOut,
  SkipPrevious,
  SkipNext,
  Bookmark,
  BookmarkBorder,
} from '@mui/icons-material';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { useState } from 'react';

const NavigationControls = () => {
  const { timeRange, selectedTimeRange, setSelectedTimeRange } = useTimeRange();
  const [localZoom, setLocalZoom] = useState(1);

  const handleZoomIn = () => {
    setLocalZoom(localZoom * 1.5);
    // For zoom, we can show visual feedback but keep the actual time range unchanged
    // The time series components can use the zoom level for display purposes
  };

  const handleZoomOut = () => {
    setLocalZoom(localZoom / 1.5);
  };

  const handleTimeRangeChange = (event: Event, newValue: number | number[]) => {
    const value = newValue as number;
    const timeSpan = timeRange.end.getTime() - timeRange.start.getTime();
    const newStart = new Date(timeRange.start.getTime() + (timeSpan * value) / 100);
    const newEnd = new Date(newStart.getTime() + timeSpan);
    
    setSelectedTimeRange({
      start: newStart,
      end: newEnd,
      zoom: localZoom,
    });
  };

  return (
    <Box sx={{
      display: 'flex',
      alignItems: 'center',
      px: 2,
      height: '100%',
      borderTop: 1,
      borderColor: 'divider',
    }}>
      {/* Zoom Controls */}
      <ButtonGroup size="small" sx={{ mr: 2 }}>
        <Tooltip title="Zoom Out">
          <IconButton onClick={handleZoomOut}>
            <ZoomOut />
          </IconButton>
        </Tooltip>
        <Tooltip title="Zoom In">
          <IconButton onClick={handleZoomIn}>
            <ZoomIn />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      {/* Navigation Controls */}
      <ButtonGroup size="small" sx={{ mr: 2 }}>
        <Tooltip title="Previous Event">
          <IconButton>
            <SkipPrevious />
          </IconButton>
        </Tooltip>
        <Tooltip title="Next Event">
          <IconButton>
            <SkipNext />
          </IconButton>
        </Tooltip>
      </ButtonGroup>

      {/* Time Range Slider */}
      <Box sx={{ flexGrow: 1, mx: 2 }}>
        <Slider
          size="small"
          defaultValue={0}
          aria-label="Time Range"
          valueLabelDisplay="auto"
          onChange={handleTimeRangeChange}
        />
      </Box>

      {/* Time Display */}
      <Typography variant="caption" sx={{ mx: 2, whiteSpace: 'nowrap' }}>
        {(selectedTimeRange || timeRange).start.toLocaleString()} - {(selectedTimeRange || timeRange).end.toLocaleString()}
        {localZoom !== 1 && ` (${localZoom.toFixed(1)}x)`}
      </Typography>

      {/* Bookmark Control */}
      <Tooltip title="Bookmark Current View">
        <IconButton size="small">
          <BookmarkBorder />
        </IconButton>
      </Tooltip>
    </Box>
  );
};

export default NavigationControls; 
```

src/components/PatientInfo.tsx
```
import {
  Box,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Chip,
  Avatar,
} from '@mui/material';
import { Person } from '@mui/icons-material';

interface PatientData {
  id: string;
  name: string;
  age: number;
  gender: string;
  dob: string;
  mrn: string;
  admissionDate: string;
  primaryDiagnosis: string;
  allergies: string[];
  vitals: {
    bp: string;
    hr: number;
    temp: number;
    spo2: number;
  };
}

const mockPatient: PatientData = {
  id: '12345',
  name: 'John Doe',
  age: 45,
  gender: 'Male',
  dob: '1978-05-15',
  mrn: 'MRN123456',
  admissionDate: '2024-01-15',
  primaryDiagnosis: 'Acute Myocardial Infarction',
  allergies: ['Penicillin', 'Sulfa Drugs'],
  vitals: {
    bp: '120/80',
    hr: 72,
    temp: 37.2,
    spo2: 98,
  },
};

const PatientInfo = () => {
  return (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Header with patient basic info */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
        <Avatar sx={{ bgcolor: 'primary.main', mr: 2 }}>
          <Person />
        </Avatar>
        <Box>
          <Typography variant="h6" component="div">
            {mockPatient.name}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {mockPatient.gender}, {mockPatient.age} years
          </Typography>
        </Box>
      </Box>

      <Divider />

      {/* Patient details list */}
      <List dense>
        <ListItem>
          <ListItemText
            primary="MRN"
            secondary={mockPatient.mrn}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="DOB"
            secondary={mockPatient.dob}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Admission Date"
            secondary={mockPatient.admissionDate}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Primary Diagnosis"
            secondary={mockPatient.primaryDiagnosis}
          />
        </ListItem>
      </List>

      <Divider />

      {/* Current Vitals */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, px: 2 }}>
        Current Vitals
      </Typography>
      <List dense>
        <ListItem>
          <ListItemText
            primary="Blood Pressure"
            secondary={mockPatient.vitals.bp}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Heart Rate"
            secondary={`${mockPatient.vitals.hr} bpm`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="Temperature"
            secondary={`${mockPatient.vitals.temp}°C`}
          />
        </ListItem>
        <ListItem>
          <ListItemText
            primary="SpO2"
            secondary={`${mockPatient.vitals.spo2}%`}
          />
        </ListItem>
      </List>

      <Divider />

      {/* Allergies */}
      <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, px: 2 }}>
        Allergies
      </Typography>
      <Box sx={{ px: 2, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
        {mockPatient.allergies.map((allergy, index) => (
          <Chip
            key={index}
            label={allergy}
            color="error"
            size="small"
            variant="outlined"
          />
        ))}
      </Box>
    </Box>
  );
};

export default PatientInfo; 
```

src/components/TimeSeriesPanel.tsx
```
import { useEffect, useRef, useState } from 'react';
import { Box, ButtonGroup, IconButton, Tooltip } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ClearIcon from '@mui/icons-material/Clear';
import Plot from 'react-plotly.js';
import { useTimeRange } from '../contexts/TimeRangeContext';
import { TimeSeriesAnnotation, AIAnnotation, HumanAnnotation } from '../types/annotations';
import { createPhysiologicalSignalsWithArtifacts } from '../utils/artifactGenerator';
import { generateAIAnnotations, getArtifactColor } from '../utils/aiAnnotationGenerator';

interface TimeSeriesData {
  timestamp: Date;
  value: number | null;
}

interface MedicationData {
  timestamp: Date;
  name: string;
  dose: string;
  route: string;
}

interface LabData {
  timestamp: Date;
  name: string;
  value: number;
  unit: string;
  referenceRange: string;
}

interface TimeSeriesPanelProps {
  type: string;
  onAnnotationCreate?: (annotation: TimeSeriesAnnotation) => void;
  aiAnnotations?: AIAnnotation[];
  onAIAnnotationUpdate?: (annotation: AIAnnotation) => void;
}

interface TypeConfig {
  color: string;
  yLabel: string;
  generateValue?: (i: number) => number | null;
}

interface PhysiologicalState {
  heartRate: number;
  baselineNoise: number;
  isGap: boolean;
}

// Removed old signal generation system - now using createPhysiologicalSignalsWithArtifacts exclusively

const typeConfig: Record<string, TypeConfig> = {
  heart_rate: {
    color: '#4caf50',
    yLabel: 'Heart Rate (bpm)',
  },
  ecg: {
    color: '#2196f3',
    yLabel: 'ECG (mV)',
  },
  ppg: {
    color: '#ff9800',
    yLabel: 'PPG (au)',
  },
  medications: {
    color: '#f44336',
    yLabel: 'Medications',
  },
  labs: {
    color: '#9c27b0',
    yLabel: 'Lab Results',
  },
};

const generateMockMedications = (startTime: Date, endTime: Date): MedicationData[] => {
  const medications = [
    { name: 'Acetaminophen', dose: '500mg', route: 'PO' },
    { name: 'Lisinopril', dose: '10mg', route: 'PO' },
    { name: 'Metoprolol', dose: '25mg', route: 'PO' },
    { name: 'Normal Saline', dose: '1000mL', route: 'IV' },
  ];

  const timeSpan = endTime.getTime() - startTime.getTime();
  const numEvents = 5;
  
  return Array.from({ length: numEvents }, (_, i) => ({
    timestamp: new Date(startTime.getTime() + (timeSpan * (i + Math.random() * 0.5)) / numEvents),
    ...medications[Math.floor(Math.random() * medications.length)],
  }));
};

const generateMockLabs = (startTime: Date, endTime: Date): LabData[] => {
  const labs = [
    { name: 'Glucose', unit: 'mg/dL', baseline: 100, variation: 20, referenceRange: '70-140' },
    { name: 'Potassium', unit: 'mEq/L', baseline: 4, variation: 0.5, referenceRange: '3.5-5.0' },
    { name: 'Sodium', unit: 'mEq/L', baseline: 140, variation: 5, referenceRange: '135-145' },
    { name: 'Creatinine', unit: 'mg/dL', baseline: 1.0, variation: 0.3, referenceRange: '0.7-1.3' },
    { name: 'Hemoglobin', unit: 'g/dL', baseline: 14, variation: 2, referenceRange: '12-16' },
  ];

  const timeSpan = endTime.getTime() - startTime.getTime();
  const numEvents = 8;
  
  return Array.from({ length: numEvents }, (_, i) => {
    const lab = labs[Math.floor(Math.random() * labs.length)];
    return {
      timestamp: new Date(startTime.getTime() + (timeSpan * (i + Math.random() * 0.5)) / numEvents),
      name: lab.name,
      value: lab.baseline + (Math.random() - 0.5) * 2 * lab.variation,
      unit: lab.unit,
      referenceRange: lab.referenceRange,
    };
  });
};

interface Selection {
  startTime: Date;
  endTime: Date;
  xRange: [number, number];
  yRange: [number, number];
}

const TimeSeriesPanel = ({ 
  type, 
  onAnnotationCreate, 
  aiAnnotations = [], 
  onAIAnnotationUpdate 
}: TimeSeriesPanelProps) => {
  const { selectedTimeRange, timeRange, focusRegion } = useTimeRange();
  const [data, setData] = useState<TimeSeriesData[]>([]);
  const [medicationData, setMedicationData] = useState<MedicationData[]>([]);
  const [labData, setLabData] = useState<LabData[]>([]);
  const [currentSelection, setCurrentSelection] = useState<Selection | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const currentRange = selectedTimeRange || timeRange;

    // 🔍 DEBUG: CRITICAL - Log plot data generation time range
    console.log(`🚨 ${type} - PLOT DATA GENERATION:`, {
      currentRange: {
        start: currentRange.start.toISOString(),
        end: currentRange.end.toISOString(),
        startTime: currentRange.start.toLocaleTimeString(),
        endTime: currentRange.end.toLocaleTimeString()
      },
      dataSource: selectedTimeRange ? 'selectedTimeRange' : 'defaultTimeRange',
      timeRangeMatch: {
        selectedEqualsDefault: selectedTimeRange ? 
          selectedTimeRange.start.getTime() === timeRange.start.getTime() && 
          selectedTimeRange.end.getTime() === timeRange.end.getTime() : 
          'selectedTimeRange is null'
      }
    });

    if (type === 'medications') {
      setMedicationData(generateMockMedications(currentRange.start, currentRange.end));
    } else if (type === 'labs') {
      setLabData(generateMockLabs(currentRange.start, currentRange.end));
    } else {
      const points = 1000;
      const step = (currentRange.end.getTime() - currentRange.start.getTime()) / points;
      
      // 🔍 DEBUG: Log the step calculation and first few data points
      console.log(`🚨 ${type} - SIGNAL GENERATION:`, {
        points: points,
        step: step,
        stepMinutes: step / (1000 * 60),
        firstTimestamp: new Date(currentRange.start.getTime()).toISOString(),
        secondTimestamp: new Date(currentRange.start.getTime() + step).toISOString(),
        lastTimestamp: new Date(currentRange.start.getTime() + step * (points - 1)).toISOString()
      });
      
      // Use the new artifact-enhanced signal generation
      const signalGenerators = createPhysiologicalSignalsWithArtifacts(
        currentRange.start, 
        currentRange.end, 
        points
      );
      
      const mockData: TimeSeriesData[] = [];
      for (let i = 0; i < points; i++) {
        const value = signalGenerators[type]?.generateValue(i) ?? null;
        mockData.push({
          timestamp: new Date(currentRange.start.getTime() + step * i),
          value,
        });
      }
      setData(mockData);
      
      // 🔍 DEBUG: Log the actual data range
      if (mockData.length > 0) {
        console.log(`🚨 ${type} - ACTUAL PLOT DATA RANGE:`, {
          firstDataPoint: mockData[0].timestamp.toISOString(),
          lastDataPoint: mockData[mockData.length - 1].timestamp.toISOString(),
          dataPointCount: mockData.length,
          timeSpanMs: mockData[mockData.length - 1].timestamp.getTime() - mockData[0].timestamp.getTime()
        });
      }
    }
  }, [type, selectedTimeRange, timeRange]);

  const handleSelection = (eventData: any) => {
    if (!eventData || !eventData.range) {
      return;
    }

    const range = eventData.range;
    
    // 🔍 DEBUG: CRITICAL - Log how human selections work
    console.log(`🚨 ${type} - HUMAN SELECTION DEBUG:`, {
      rawRangeX0: range.x[0],
      rawRangeX1: range.x[1],
      convertedStartTime: new Date(range.x[0]).toISOString(),
      convertedEndTime: new Date(range.x[1]).toISOString(),
      rangeType: typeof range.x[0],
      isDateString: typeof range.x[0] === 'string' && !isNaN(Date.parse(range.x[0]))
    });
    
    setCurrentSelection({
      startTime: new Date(range.x[0]),
      endTime: new Date(range.x[1]),
      xRange: [range.x[0], range.x[1]],
      yRange: [range.y[0], range.y[1]],
    });
  };

  const handleConfirmSelection = () => {
    if (!currentSelection) return;

    const annotation: HumanAnnotation = {
      id: `annotation-${Date.now()}`,
      source: 'human' as const,
      startTime: currentSelection.startTime,
      endTime: currentSelection.endTime,
      timeSeriesType: type,
      tags: [],
      notes: '',
      createdBy: 'User',
      createdAt: new Date(),
    };

    if (onAnnotationCreate) {
      onAnnotationCreate(annotation);
    }
    setCurrentSelection(null);
  };

  const handleCancelSelection = () => {
    setCurrentSelection(null);
  };

  const getAIAnnotationShapes = () => {
    const currentRange = selectedTimeRange || timeRange;
    const filteredAnnotations = aiAnnotations.filter(annotation => annotation.timeSeriesType === type);
    
    // 🔍 DEBUG: CRITICAL TIME SYNCHRONIZATION CHECK
    console.log(`🚨 ${type} - TIME SYNC DEBUG:`, {
      currentPlotRange: {
        start: currentRange.start.toISOString(),
        end: currentRange.end.toISOString(),
        startTime: currentRange.start.toLocaleTimeString(),
        endTime: currentRange.end.toLocaleTimeString()
      },
      selectedTimeRange: selectedTimeRange ? {
        start: selectedTimeRange.start.toISOString(),
        end: selectedTimeRange.end.toISOString()
      } : null,
      defaultTimeRange: {
        start: timeRange.start.toISOString(),
        end: timeRange.end.toISOString()
      }
    });
    
    // 🔍 DEBUG: Check each AI annotation timing
    if (filteredAnnotations.length > 0) {
      console.log(`🚨 ${type} - AI ANNOTATION TIMING:`, filteredAnnotations.map(annotation => ({
        id: annotation.id,
        artifactType: annotation.artifactType,
        cardDisplayTime: `${annotation.startTime.toLocaleTimeString()} - ${annotation.endTime.toLocaleTimeString()}`,
        actualTimestamp: annotation.startTime.toISOString(),
        endTimestamp: annotation.endTime.toISOString(),
        isWithinPlotRange: annotation.startTime >= currentRange.start && annotation.endTime <= currentRange.end,
        percentPositionStart: ((annotation.startTime.getTime() - currentRange.start.getTime()) / (currentRange.end.getTime() - currentRange.start.getTime()) * 100).toFixed(2) + '%',
        percentPositionEnd: ((annotation.endTime.getTime() - currentRange.start.getTime()) / (currentRange.end.getTime() - currentRange.start.getTime()) * 100).toFixed(2) + '%',
        shapeX0: annotation.startTime.toISOString(),
        shapeX1: annotation.endTime.toISOString()
      })));
    }
    
    return filteredAnnotations.map(annotation => {
        const color = getArtifactColor(annotation.artifactType);
        const opacity = annotation.approvalStatus === 'approved' ? 0.4 : 
                        annotation.approvalStatus === 'rejected' ? 0.1 : 0.25;
        
        // 🔧 CRITICAL FIX: Use Date objects directly instead of ISO strings
        // This matches how human selections work and how plot data is structured
        // Human selections use: x0: currentSelection.xRange[0] (raw values)
        // Plot data uses: x: data.map(d => d.timestamp) (Date objects)
        // AI annotations should also use Date objects for consistency
        return {
          type: 'rect',
          xref: 'x',
          yref: 'paper',
          x0: annotation.startTime,  // Use Date object directly, not .toISOString()
          x1: annotation.endTime,   // Use Date object directly, not .toISOString()
          y0: 0,
          y1: 1,
          fillcolor: `${color}${Math.round(opacity * 255).toString(16).padStart(2, '0')}`,
          line: {
            color: color,
            width: annotation.approvalStatus === 'pending' ? 2 : 1,
            dash: 'dot', // Distinguish AI annotations with dotted lines
          },
        };
      });
  };

  const getVisualDebuggingShapes = () => {
    // 🔍 DEBUG: Add visual markers to verify time range positioning
    const currentRange = selectedTimeRange || timeRange;
    const timeSpan = currentRange.end.getTime() - currentRange.start.getTime();
    
    const debugShapes: any[] = [];
    
    // Add vertical lines at 25%, 50%, 75% to verify positioning
    const debugPositions = [0.25, 0.5, 0.75];
    debugPositions.forEach((position, index) => {
      const timestamp = new Date(currentRange.start.getTime() + (timeSpan * position));
      debugShapes.push({
        type: 'line',
        xref: 'x',
        yref: 'paper',
        x0: timestamp,  // Use Date object directly, not .toISOString()
        x1: timestamp,  // Use Date object directly, not .toISOString()
        y0: 0,
        y1: 1,
        line: {
          color: '#ff0000',
          width: 1,
          dash: 'dash',
        },
        opacity: 0.3,
      });
    });
    
    return debugShapes;
  };

  const getFocusRegionShape = () => {
    if (!focusRegion || (focusRegion.timeSeriesType && focusRegion.timeSeriesType !== type)) {
      return [];
    }
    
    return [{
      type: 'rect',
      xref: 'x',
      yref: 'paper',
      x0: focusRegion.start,  // Use Date object directly, not .toISOString()
      x1: focusRegion.end,    // Use Date object directly, not .toISOString()
      y0: 0,
      y1: 1,
      fillcolor: 'rgba(255, 193, 7, 0.3)', // Bright yellow/amber for focus
      line: {
        color: '#ff9800', // Orange border
        width: 3,
        dash: 'solid', // Solid line to distinguish from AI annotations
      },
    }];
  };

  const getSelectionShape = () => {
    if (!currentSelection) return [];
    
    return [{
      type: 'rect',
      xref: 'x',
      yref: 'paper',
      x0: currentSelection.xRange[0],
      x1: currentSelection.xRange[1],
      y0: 0,
      y1: 1,
      fillcolor: 'rgba(33, 150, 243, 0.2)',
      line: {
        color: 'rgb(33, 150, 243)',
        width: 1,
      },
    }];
  };

  const config = typeConfig[type];

  const plotLayout = {
    autosize: true,
    margin: { t: 20, r: 60, b: 50, l: 70 },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    xaxis: {
      type: 'date' as const,
      rangeslider: { visible: false },
      gridcolor: '#eee',
      showgrid: true,
      tickfont: { size: 13 },
      tickformat: '%H:%M',
      nticks: 8,
      ticklen: 8,
      tickwidth: 1.5,
      tickangle: 0,
    },
    yaxis: {
      title: {
        text: config.yLabel,
        font: { size: 14 },
        standoff: 10,
      },
      fixedrange: false,
      gridcolor: '#eee',
      showgrid: true,
      tickfont: { size: 13 },
      ticklen: 8,
      tickwidth: 1.5,
      nticks: 6,
    },
    showlegend: false,
    dragmode: 'select',
    selectdirection: 'h',
    shapes: [...getAIAnnotationShapes(), ...getFocusRegionShape(), ...getSelectionShape(), ...getVisualDebuggingShapes()],
    font: {
      family: '"Inter", "Roboto", sans-serif',
      size: 13,
    },
  };

  const plotConfig = {
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'autoScale2d', 'resetScale2d',
      'hoverClosestCartesian', 'hoverCompareCartesian',
      'toggleSpikelines',
    ],
    displaylogo: false,
    responsive: true,
    scrollZoom: true,
    modeBarButtons: [['select2d', 'lasso2d', 'zoom2d', 'pan2d', 'resetScale2d']],
    toImageButtonOptions: {
      format: 'svg',
      filename: 'plot',
      height: 500,
      width: 700,
      scale: 2,
    },
  };

  const SelectionButtons = () => (
    currentSelection ? (
      <ButtonGroup
        sx={{
          position: 'absolute',
          top: 8,
          right: 8,
          zIndex: 1,
          backgroundColor: 'background.paper',
          boxShadow: 1,
          borderRadius: 1,
        }}
      >
        <Tooltip title="Confirm Selection">
          <IconButton
            size="small"
            onClick={handleConfirmSelection}
            sx={{ color: 'success.main' }}
          >
            <CheckIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title="Cancel Selection">
          <IconButton
            size="small"
            onClick={handleCancelSelection}
            sx={{ color: 'error.main' }}
          >
            <ClearIcon />
          </IconButton>
        </Tooltip>
      </ButtonGroup>
    ) : null
  );

  if (type === 'medications') {
    return (
      <Box sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SelectionButtons />
        <Plot
          data={[{
            x: medicationData.map(d => d.timestamp),
            y: medicationData.map(d => d.name),
            text: medicationData.map(d => `${d.dose} ${d.route}`),
            type: 'scatter',
            mode: 'markers',
            marker: { 
              color: config.color,
              size: 14,
              symbol: 'diamond',
              line: {
                width: 1.5,
                color: 'white',
              },
            },
            hoverinfo: 'text',
            hoverlabel: { 
              bgcolor: 'white',
              font: { size: 13 },
            },
          }]}
          layout={{
            ...plotLayout,
            margin: { t: 20, r: 140, b: 50, l: 140 },
          }}
          config={plotConfig}
          style={{
            width: '100%',
            height: '100%',
          }}
          useResizeHandler={true}
          onSelected={handleSelection}
        />
      </Box>
    );
  }

  if (type === 'labs') {
    return (
      <Box sx={{ 
        height: '100%', 
        width: '100%', 
        position: 'relative',
        bgcolor: 'background.paper',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
      }}>
        <SelectionButtons />
        <Plot
          data={[{
            x: labData.map(d => d.timestamp),
            y: labData.map(d => d.name),
            text: labData.map(d => `${d.name}<br>${d.value.toFixed(1)} ${d.unit}<br>Range: ${d.referenceRange}`),
            type: 'scatter',
            mode: 'markers',
            marker: { 
              color: config.color,
              size: 14,
              symbol: 'square',
              line: {
                width: 1.5,
                color: 'white',
              },
            },
            hoverinfo: 'text',
            hoverlabel: { 
              bgcolor: 'white',
              font: { size: 13 },
            },
          }]}
          layout={{
            ...plotLayout,
            margin: { t: 20, r: 140, b: 50, l: 140 },
            yaxis: {
              ...plotLayout.yaxis,
              title: {
                text: 'Lab Tests',
                font: { size: 14 },
                standoff: 10,
              },
              type: 'category',
              categoryorder: 'category ascending',
            },
          }}
          config={plotConfig}
          style={{
            width: '100%',
            height: '100%',
          }}
          useResizeHandler={true}
          onSelected={handleSelection}
        />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      height: '100%', 
      width: '100%', 
      position: 'relative',
      bgcolor: 'background.paper',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden',
    }}>
      <SelectionButtons />
      <div ref={containerRef} style={{ flex: 1, position: 'relative', minHeight: 0 }}>
        <Plot
          data={[{
            x: data.map(d => d.timestamp),
            y: data.map(d => d.value),
            type: 'scatter',
            mode: 'lines',
            line: { 
              color: config.color,
              width: 2,
            },
            connectgaps: false,
            name: type,
          }]}
          layout={plotLayout}
          config={plotConfig}
          style={{
            width: '100%',
            height: '100%',
          }}
          useResizeHandler={true}
          onSelected={handleSelection}
        />
      </div>
    </Box>
  );
};

export default TimeSeriesPanel; 
```

src/components/TimelineOverview.tsx
```
import { useEffect, useState } from 'react';
import { Box, Paper } from '@mui/material';
import Plot from 'react-plotly.js';
import { useTimeRange } from '../contexts/TimeRangeContext';

interface DataPoint {
  timestamp: Date;
  type: string;
  hasData: boolean;
}

interface Event {
  timestamp: Date;
  type: string;
  name?: string;
}

const dataTypes = ['heart_rate', 'ecg', 'ppg', 'medications', 'labs'];
const typeColors = {
  heart_rate: '#4caf50',
  ecg: '#2196f3',
  ppg: '#ff9800',
  medications: '#f44336',
  labs: '#9c27b0',
};

const generateMockEvents = (startTime: Date, endTime: Date): Event[] => {
  const events: Event[] = [];
  const timeSpan = endTime.getTime() - startTime.getTime();

  // Generate medication events
  const medicationEvents = 5;
  for (let i = 0; i < medicationEvents; i++) {
    events.push({
      timestamp: new Date(startTime.getTime() + (timeSpan * (i + Math.random() * 0.5)) / medicationEvents),
      type: 'medications',
    });
  }

  // Generate lab events
  const labEvents = 4;
  for (let i = 0; i < labEvents; i++) {
    events.push({
      timestamp: new Date(startTime.getTime() + (timeSpan * (i + Math.random() * 0.5)) / labEvents),
      type: 'labs',
    });
  }

  return events;
};

const TimelineOverview = () => {
  const { timeRange, setSelectedTimeRange } = useTimeRange();
  const [dataAvailability, setDataAvailability] = useState<DataPoint[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  useEffect(() => {
    // Generate continuous data availability
    const points = 100;
    const step = (timeRange.end.getTime() - timeRange.start.getTime()) / points;
    const mockData: DataPoint[] = [];

    // Generate continuous data for time series
    ['heart_rate', 'ecg', 'ppg'].forEach(type => {
      let hasData = Math.random() > 0.3;
      const changeProb = 0.1; // Probability of data availability changing
      let currentSegment: DataPoint[] = [];

      for (let i = 0; i < points; i++) {
        // Randomly change data availability with low probability
        if (Math.random() < changeProb) {
          hasData = !hasData;
          if (currentSegment.length > 0) {
            mockData.push(...currentSegment);
            currentSegment = [];
          }
        }

        currentSegment.push({
          timestamp: new Date(timeRange.start.getTime() + step * i),
          type,
          hasData,
        });
      }

      if (currentSegment.length > 0) {
        mockData.push(...currentSegment);
      }
    });

    // Generate events
    const mockEvents = generateMockEvents(timeRange.start, timeRange.end);
    setEvents(mockEvents);
    setDataAvailability(mockData);
  }, [timeRange]);

  const handleSelection = (eventData: any) => {
    if (!eventData || !eventData.range) return;

    const range = eventData.range;
    setSelectedTimeRange({
      start: new Date(range.x[0]),
      end: new Date(range.x[1]),
      zoom: timeRange.zoom,
    });
  };

  // Create traces for continuous data
  const dataTraces = ['heart_rate', 'ecg', 'ppg'].flatMap(type => {
    const typeData = dataAvailability.filter(d => d.type === type);
    const segments: DataPoint[][] = [];
    let currentSegment: DataPoint[] = [];

    // Split data into segments based on hasData
    typeData.forEach((point, i) => {
      if (i > 0 && point.hasData !== typeData[i - 1].hasData) {
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
          currentSegment = [];
        }
      }
      currentSegment.push(point);
    });
    if (currentSegment.length > 0) {
      segments.push(currentSegment);
    }

    // Create a trace for each segment
    return segments.map(segment => ({
      x: segment.map(d => d.timestamp),
      y: Array(segment.length).fill(type),
      type: 'scatter',
      mode: segment[0].hasData ? 'lines' : 'lines',
      name: type.toUpperCase(),
      line: {
        color: typeColors[type as keyof typeof typeColors],
        width: 20,
      },
      opacity: segment[0].hasData ? 0.8 : 0.15,
      showlegend: false,
      hoverinfo: 'x',
    }));
  });

  // Create traces for events
  const eventTraces = ['medications', 'labs'].map(type => {
    const typeEvents = events.filter(e => e.type === type);
    return {
      x: typeEvents.map(e => e.timestamp),
      y: Array(typeEvents.length).fill(type),
      type: 'scatter',
      mode: 'markers',
      name: type.toUpperCase(),
      marker: {
        color: typeColors[type as keyof typeof typeColors],
        size: 16,
        symbol: 'square',
        line: {
          width: 1,
          color: 'white',
        },
      },
      showlegend: false,
      hoverinfo: 'x',
    };
  });

  const layout = {
    autosize: true,
    margin: { t: 10, r: 60, b: 50, l: 70 },
    paper_bgcolor: '#ffffff',
    plot_bgcolor: '#ffffff',
    xaxis: {
      type: 'date',
      rangeslider: { visible: false },
      gridcolor: '#eee',
      showgrid: true,
      tickfont: { size: 13 },
      tickformat: '%H:%M',
      nticks: 8,
      ticklen: 8,
      tickwidth: 1.5,
      tickangle: 0,
    },
    yaxis: {
      tickfont: { size: 14 },
      ticklen: 8,
      tickwidth: 1.5,
      gridcolor: '#eee',
      showgrid: true,
      fixedrange: true,
    },
    dragmode: 'select',
    selectdirection: 'h',
    font: {
      family: '"Inter", "Roboto", sans-serif',
      size: 14,
    },
  };

  const config = {
    displayModeBar: true,
    modeBarButtonsToRemove: [
      'autoScale2d', 'resetScale2d',
      'hoverClosestCartesian', 'hoverCompareCartesian',
      'toggleSpikelines',
    ],
    displaylogo: false,
    responsive: true,
    scrollZoom: false,
    modeBarButtons: [['select2d', 'zoom2d', 'pan2d', 'resetScale2d']],
  };

  return (
    <Paper 
      elevation={3}
      sx={{ 
        height: '100%', 
        p: 1,
        borderRadius: 0,
      }}
    >
      <Box sx={{ height: '100%', width: '100%' }}>
        <Plot
          data={[...dataTraces, ...eventTraces]}
          layout={layout}
          config={config}
          style={{
            width: '100%',
            height: '100%',
          }}
          useResizeHandler={true}
          onSelected={handleSelection}
        />
      </Box>
    </Paper>
  );
};

export default TimelineOverview; 
```

src/types/annotations.ts
```
export interface BaseAnnotation {
  id: string;
  startTime: Date;
  endTime: Date;
  timeSeriesType: string;
  tags: string[];
  notes: string;
}

export interface HumanAnnotation extends BaseAnnotation {
  source: 'human';
  createdBy: string;
  createdAt: Date;
}

export interface AIAnnotation extends BaseAnnotation {
  source: 'ai';
  artifactType: 'anomaly' | 'noise';
  confidence: number; // 0-1 score
  approvalStatus: 'pending' | 'approved' | 'rejected';
  approvedBy?: string;
  approvedAt?: Date;
  aiModel: string;
  detectionReason: string; // Why the AI flagged this region
}

export type TimeSeriesAnnotation = HumanAnnotation | AIAnnotation;

export interface AnnotationEvent {
  id: string;
  timestamp: Date;
  type: 'medication' | 'note' | 'event' | 'annotation';
  title: string;
  description: string;
  severity?: 'low' | 'medium' | 'high';
  category?: string;
  timeSeriesType?: string;
  startTime?: Date;
  endTime?: Date;
  tags?: string[];
  annotation?: TimeSeriesAnnotation; // Link to the actual annotation
}

export interface ArtifactDefinition {
  timestamp: Date;
  type: 'anomaly' | 'noise';
  duration: number; // milliseconds
  severity: 'low' | 'medium' | 'high';
  timeSeriesType: string;
  description: string;
} 
```

src/utils/aiAnnotationGenerator.ts
```
import { AIAnnotation, ArtifactDefinition } from '../types/annotations';

export const generateAIAnnotations = (
  artifacts: ArtifactDefinition[],
  aiModelName = 'MTN-CardioNet-v2.1'
): AIAnnotation[] => {
  return artifacts.map((artifact, index) => {
    const confidence = generateConfidenceScore(artifact);
    const detectionReason = generateDetectionReason(artifact);
    
    return {
      id: `ai-annotation-${Date.now()}-${index}`,
      source: 'ai' as const,
      startTime: artifact.timestamp,
      endTime: new Date(artifact.timestamp.getTime() + artifact.duration),
      timeSeriesType: artifact.timeSeriesType,
      artifactType: artifact.type,
      confidence,
      approvalStatus: 'pending' as const,
      aiModel: aiModelName,
      detectionReason,
      tags: generateTags(artifact),
      notes: generateNotes(artifact, confidence)
    };
  });
};

const generateConfidenceScore = (artifact: ArtifactDefinition): number => {
  // Generate realistic confidence scores based on artifact type and severity
  const baseConfidence = {
    'anomaly': 0.75,
    'noise': 0.82
  }[artifact.type];

  const severityModifier = {
    'low': -0.1,
    'medium': 0,
    'high': 0.1
  }[artifact.severity];

  // Add some randomness but keep it realistic
  const randomModifier = (Math.random() - 0.5) * 0.12;
  
  return Math.min(0.95, Math.max(0.55, baseConfidence + severityModifier + randomModifier));
};

const generateDetectionReason = (artifact: ArtifactDefinition): string => {
  const reasons = {
    'anomaly': [
      'Statistical outlier detected: >3σ from baseline',
      'Unexpected signal morphology pattern identified',
      'Sudden amplitude variation exceeds normal range',
      'Signal frequency content deviates from expected pattern',
      'Multi-feature analysis indicates anomalous behavior',
      'Pattern correlation with baseline <0.7'
    ],
    'noise': [
      'Signal-to-noise ratio below 15dB threshold',
      'High-frequency interference detected (>40Hz)',
      'Motion artifacts identified in signal',
      'Baseline drift exceeds ±2mV threshold',
      'Electromagnetic interference pattern detected',
      'Sensor impedance variation indicates noise'
    ]
  };

  const options = reasons[artifact.type];
  return options[Math.floor(Math.random() * options.length)];
};

const generateTags = (artifact: ArtifactDefinition): string[] => {
  const baseTags = ['AI-Generated'];
  
  // Add severity tag
  baseTags.push(`${artifact.severity}-severity`);
  
  // Add artifact-specific tags
  const typeSpecificTags = {
    'anomaly': ['Unexpected', 'Investigation-Required', 'Clinical-Review'],
    'noise': ['Signal-Quality', 'Technical-Issue', 'Artifact']
  };

  baseTags.push(...typeSpecificTags[artifact.type]);
  
  return baseTags;
};

const generateNotes = (artifact: ArtifactDefinition, confidence: number): string => {
  const confidenceDescription = confidence > 0.8 ? 'high confidence' : 
                                confidence > 0.6 ? 'moderate confidence' : 'low confidence';
  
  const templates = {
    'anomaly': `Unusual signal pattern detected with ${confidenceDescription}. ${artifact.description}. Duration: ${(artifact.duration / 1000).toFixed(1)}s. Manual review recommended to determine clinical significance.`,
    
    'noise': `Signal quality issue identified with ${confidenceDescription}. ${artifact.description}. Duration: ${(artifact.duration / 1000).toFixed(1)}s. May affect interpretation of surrounding data.`
  };

  return templates[artifact.type];
};

export const getArtifactColor = (artifactType: ArtifactDefinition['type']): string => {
  const colors = {
    'anomaly': '#e91e63',    // Pink/magenta - stands out for unexpected patterns
    'noise': '#9e9e9e'       // Grey - neutral for signal quality issues
  };
  
  return colors[artifactType];
};

export const getArtifactIcon = (artifactType: ArtifactDefinition['type']): string => {
  const icons = {
    'anomaly': '⚠️',  // Warning sign for unexpected patterns
    'noise': '📡'     // Signal/antenna for interference/noise
  };
  
  return icons[artifactType];
}; 
```

src/utils/artifactGenerator.ts
```
import { ArtifactDefinition } from '../types/annotations';

interface PhysiologicalState {
  heartRate: number;
  baselineNoise: number;
  isGap: boolean;
  artifacts: ArtifactDefinition[];
}

export interface SignalWithArtifacts {
  generateValue: (i: number) => number | null;
  getArtifactsInRange: (startTime: Date, endTime: Date) => ArtifactDefinition[];
}

export const createPhysiologicalSignalsWithArtifacts = (
  startTime: Date,
  endTime: Date,
  totalPoints: number
): Record<string, SignalWithArtifacts> => {
  const timeSpan = endTime.getTime() - startTime.getTime();
  const step = timeSpan / totalPoints;
  
  let state: PhysiologicalState = {
    heartRate: 70,
    baselineNoise: 0,
    isGap: false,
    artifacts: []
  };
  
  let lastActivitySpike = 0;
  let currentActivityLevel = 0;

  // Pre-generate shared artifacts across all signal types to ensure consistency
  const generateSharedArtifacts = (): Record<string, ArtifactDefinition[]> => {
    // 🔧 FIX: Use full time range instead of restricted "meaningful" range
    // Previous issue: artifacts were only placed in 35%-90% of timespan
    // This caused AI annotations to appear shifted right on the timeline
    const meaningfulStart = startTime.getTime(); // Start at 0% instead of 35%
    const meaningfulEnd = endTime.getTime();     // End at 100% instead of 90%
    const meaningfulSpan = meaningfulEnd - meaningfulStart;
    
    // 🔍 DEBUG: Log artifact positioning calculation (simplified)
    console.log("🔧 Artifact Generator:", {
      timeSpan: `${(meaningfulSpan / (1000 * 60)).toFixed(1)}min`,
      fullRange: meaningfulSpan === timeSpan
    });
    
    const artifactsByType: Record<string, ArtifactDefinition[]> = {
      heart_rate: [],
      ecg: [],
      ppg: []
    };
    
    // Generate fixed number of anomaly events at predictable positions
    // 🔧 FIX: Spread anomalies across the full time range for better distribution
    const anomalyPositions = [0.1, 0.25, 0.5, 0.75, 0.9]; // Better distribution across full range
    const anomalyCount = anomalyPositions.length;
    
    for (let i = 0; i < anomalyCount; i++) {
      const position = anomalyPositions[i];
      const timestamp = new Date(meaningfulStart + (meaningfulSpan * position));
      const duration = 5000; // Fixed 5 second duration for consistency
      const severity = i % 2 === 0 ? 'high' : 'medium' as 'high' | 'medium';
      
      // Add the same anomaly to all signal types for consistency
      ['heart_rate', 'ecg', 'ppg'].forEach(signalType => {
        artifactsByType[signalType].push({
          timestamp,
          type: 'anomaly',
          duration,
          severity,
          timeSeriesType: signalType,
          description: 'Unexpected signal pattern detected'
        });
      });
    }

    // Generate predictable noise events per signal type
    // 🔧 FIX: Spread noise across full range and reduce overlap
    const noisePositions = [0.2, 0.6]; // Fixed positions for noise, spread across full range
    ['heart_rate', 'ecg', 'ppg'].forEach((signalType, signalIndex) => {
      noisePositions.forEach((position, noiseIndex) => {
        // Offset noise slightly for different signal types to avoid overlap
        const offsetPosition = position + (signalIndex * 0.03); // Reduced offset
        const timestamp = new Date(meaningfulStart + (meaningfulSpan * offsetPosition));
        
        artifactsByType[signalType].push({
          timestamp,
          type: 'noise',
          duration: 3000, // Fixed 3 second duration
          severity: 'low' as 'low',
          timeSeriesType: signalType,
          description: 'Signal noise/interference detected'
        });
      });
    });

    // 🔍 DEBUG: Log final artifact summary
    console.log("🔧 Generated artifacts:", Object.entries(artifactsByType).map(([type, artifacts]) => 
      `${type}: ${artifacts.length} (${artifacts.map(a => a.type).join(',')})`
    ).join(' | '));

    return artifactsByType;
  };

  const sharedArtifacts = generateSharedArtifacts();

  // Use shared artifacts for consistency across signal types
  const generateArtifacts = (timeSeriesType: string): ArtifactDefinition[] => {
    return sharedArtifacts[timeSeriesType] || [];
  };

  const updateState = (i: number) => {
    // Gap handling
    if (!state.isGap && Math.random() < 0.05) state.isGap = true;
    else if (state.isGap && Math.random() < 0.2) state.isGap = false;

    // Base circadian rhythm (24-hour cycle)
    const hoursInDay = (i % 300) / 12.5;
    const circadianComponent = Math.sin((hoursInDay - 3) * Math.PI / 12) * 10;

    // Activity spikes
    if (i - lastActivitySpike > 50 && Math.random() < 0.01) {
      lastActivitySpike = i;
      currentActivityLevel = 20 + Math.random() * 30;
    }
    if (currentActivityLevel > 0) {
      currentActivityLevel *= 0.95;
    }

    // Update heart rate
    state.heartRate = 70 + circadianComponent + currentActivityLevel;
    
    // Update baseline noise
    state.baselineNoise = (state.baselineNoise * 0.95) + (Math.random() - 0.5) * 0.1;

    return state;
  };

  const applyArtifacts = (value: number, i: number, artifacts: ArtifactDefinition[], timeSeriesType: string): number => {
    const currentTime = new Date(startTime.getTime() + step * i);
    
    for (const artifact of artifacts) {
      const artifactEnd = new Date(artifact.timestamp.getTime() + artifact.duration);
      
      if (currentTime >= artifact.timestamp && currentTime <= artifactEnd) {
        switch (artifact.type) {
          case 'noise':
            // Add significant noise/interference to the signal
            const noiseIntensity = artifact.severity === 'high' ? 0.5 : 0.3;
            return value + (Math.random() - 0.5) * value * noiseIntensity;
            
          case 'anomaly':
            // Create obvious anomalous patterns that are clearly visible
            const progress = (currentTime.getTime() - artifact.timestamp.getTime()) / artifact.duration;
            const anomalyIntensity = artifact.severity === 'high' ? 0.8 : 0.4;
            
            if (timeSeriesType === 'heart_rate') {
              // Create irregular heart rate spikes/drops
              return value + Math.sin(progress * Math.PI * 4) * value * anomalyIntensity;
            } else if (timeSeriesType === 'ecg') {
              // Create irregular ECG morphology
              return value * (1 + Math.sin(progress * Math.PI * 6) * anomalyIntensity);
            } else if (timeSeriesType === 'ppg') {
              // Create PPG amplitude variations
              return value * (1 + Math.cos(progress * Math.PI * 3) * anomalyIntensity);
            }
            break;
        }
      }
    }
    
    return value;
  };

  const createSignalGenerator = (timeSeriesType: string, baseGenerator: (i: number) => number | null): SignalWithArtifacts => {
    const artifacts = generateArtifacts(timeSeriesType);
    
    return {
      generateValue: (i: number) => {
        const baseValue = baseGenerator(i);
        if (baseValue === null) return null;
        
        return applyArtifacts(baseValue, i, artifacts, timeSeriesType);
      },
      getArtifactsInRange: (rangeStart: Date, rangeEnd: Date) => {
        return artifacts.filter(artifact => {
          const artifactEnd = new Date(artifact.timestamp.getTime() + artifact.duration);
          return artifact.timestamp <= rangeEnd && artifactEnd >= rangeStart;
        });
      }
    };
  };

  return {
    heart_rate: createSignalGenerator('heart_rate', (i: number) => {
      const state = updateState(i);
      if (state.isGap) return null;
      return state.heartRate + (Math.random() - 0.5) * 3;
    }),
    
    ecg: createSignalGenerator('ecg', (i: number) => {
      const state = updateState(i);
      if (state.isGap) return null;

      // Convert heart rate to beat interval
      const beatInterval = 60 / state.heartRate;
      const phase = (i % (beatInterval * 10)) / beatInterval;

      // Simplified ECG waveform generation
      const qrs = Math.exp(-Math.pow((phase % 1) - 0.2, 2) / 0.001) * 15; // QRS complex
      const t = Math.exp(-Math.pow((phase % 1) - 0.4, 2) / 0.01) * 5;     // T wave
      const p = Math.exp(-Math.pow((phase % 1) - 0.08, 2) / 0.002) * 2;   // P wave

      return (qrs + t + p) + state.baselineNoise;
    }),
    
    ppg: createSignalGenerator('ppg', (i: number) => {
      const state = updateState(i);
      if (state.isGap) return null;

      // Convert heart rate to beat interval
      const beatInterval = 60 / state.heartRate;
      const phase = (i % (beatInterval * 10)) / beatInterval;

      // Simplified PPG waveform
      const systolic = Math.exp(-Math.pow((phase % 1) - 0.2, 2) / 0.02) * 8;
      const dicroticNotch = Math.exp(-Math.pow((phase % 1) - 0.4, 2) / 0.01) * 2;
      
      // Add respiratory modulation
      const respirationRate = 15; // breaths per minute
      const respirationPeriod = 60 / respirationRate;
      const respirationPhase = (i % (respirationPeriod * 10)) / respirationPeriod;
      const respirationEffect = Math.sin(respirationPhase * 2 * Math.PI) * 0.2;

      return (systolic + dicroticNotch) * (1 + respirationEffect) + state.baselineNoise;
    })
  };
}; 
```

</source_code>