# VectorShift Frontend Technical Assessment

A comprehensive node-based workflow editor with dynamic resizing, professional styling, and full CRUD operations, integrated with a FastAPI backend for pipeline analysis.

## 🚀 Features

- **Professional Node Editor**: Modern UI with React Flow integration
- **Dynamic Node Resizing**: Text nodes automatically adjust based on content
- **Full CRUD Operations**: Create, read, update, delete nodes with validation
- **Node Management**: Minimize/expand, delete, and rename nodes
- **Undo/Redo System**: Complete history management with 50-state limit  
- **Handle System**: Enhanced connectivity with visible labels
- **Pipeline Analysis**: Backend integration for DAG validation
- **Toast Notifications**: Real-time feedback using Sonner

## 🏗️ Project Structure

```
VectorShift-Assignment-/
├── frontend/                 # React + Vite frontend
│   ├── src/
│   │   ├── components/      # Node components and configurations
│   │   │   ├── BaseNode.jsx # Core node component with dynamic sizing
│   │   │   ├── nodeConfigs.js # Node type configurations
│   │   │   └── nodeFactory.jsx # Node creation factory
│   │   ├── draggableNode.jsx # Drag and drop functionality
│   │   ├── toolbar.jsx      # Modern toolbar with search
│   │   ├── ui.jsx          # UI controls and panels
│   │   ├── submit.jsx      # Backend integration
│   │   ├── store.js        # Zustand state management
│   │   └── App.jsx         # Main application component
│   ├── package.json
│   └── vite.config.js
├── backend/                  # Python FastAPI backend
│   ├── main.py              # FastAPI application with DAG analysis
│   ├── requirements.txt     # Python dependencies
│   └── .gitignore          # Backend gitignore
└── README.md               # This file
```

## 🛠️ Installation & Setup

### Prerequisites

- **Node.js** (v18 or higher)
- **Python** (v3.8 or higher)
- **npm** or **yarn**

### 1. Clone the Repository

```bash
git clone https://github.com/Sanskargupta0/VectorShift-Assignment-.git
cd VectorShift-Assignment-
```

### 2. Frontend Setup

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will be available at: **http://localhost:5173**

### 3. Backend Setup

```bash
# Navigate to backend directory (from project root)
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate virtual environment
# On Windows:
venv\Scripts\activate
# On macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start FastAPI server
uvicorn main:app --reload
```

The backend API will be available at: **http://localhost:8000**

## 🎯 Usage Instructions

### Running Both Servers

1. **Start Backend** (Terminal 1):
```bash
cd backend
venv\Scripts\activate  # Windows
pip install -r requirements.txt
uvicorn main:app --reload
```

2. **Start Frontend** (Terminal 2):
```bash
cd frontend
npm install
npm run dev
```

3. **Access Application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

### Creating and Testing Pipelines

1. **Add Nodes**: 
   - Use the modern toolbar to search and add nodes
   - Available types: Input, Output, LLM, Text, Filter, Transform, Conditional, Aggregator, Delay

2. **Configure Nodes**:
   - Click on nodes to expand/configure
   - Text nodes automatically resize based on content
   - Rename nodes with validation (3-50 characters, unique names)

3. **Connect Nodes**:
   - Drag from output handles (right) to input handles (left)
   - Handle labels show connection types

4. **Test Pipeline**:
   - Click "Submit" button to analyze pipeline
   - Backend calculates: node count, edge count, DAG validation
   - Toast notification shows results

5. **Node Management**:
   - **Minimize/Expand**: Click minus/maximize icon
   - **Delete**: Click X icon  
   - **Undo/Redo**: Use Ctrl+Z / Ctrl+Y or toolbar buttons

## 🔧 Development

### Frontend Technologies
- **React 18**: Modern React with hooks
- **React Flow**: Node-based editor
- **Zustand**: State management with history
- **Vite**: Fast development and build tool
- **React Icons**: Feather icon set
- **Sonner**: Toast notifications

### Backend Technologies  
- **FastAPI**: Modern Python web framework
- **NetworkX**: Graph analysis and DAG detection
- **Uvicorn**: ASGI server
- **Pydantic**: Data validation

### Key Components

#### Frontend
- `BaseNode.jsx`: Core node component with dynamic sizing and controls
- `nodeConfigs.js`: Configuration for all node types with professional styling
- `store.js`: Zustand store with undo/redo and node management
- `submit.jsx`: Backend integration with API calls and toast notifications

#### Backend
- `main.py`: FastAPI app with `/pipelines/parse` endpoint for DAG analysis

## 🌟 Features Implemented

### ✅ Node System
- [x] Professional node styling with gradients and shadows
- [x] Dynamic text node resizing based on content
- [x] Node minimize/expand functionality
- [x] Node deletion with confirmation
- [x] Unique node naming with validation
- [x] Handle visibility and labeling

### ✅ User Interface  
- [x] Modern toolbar with search functionality
- [x] Undo/redo with keyboard shortcuts
- [x] Professional color scheme and typography
- [x] Responsive design and smooth transitions

### ✅ Backend Integration
- [x] FastAPI backend with CORS support
- [x] Pipeline parsing and analysis
- [x] DAG validation using NetworkX
- [x] Toast notifications for user feedback

### ✅ State Management
- [x] Zustand store with history tracking
- [x] Node and edge management
- [x] Persistent undo/redo functionality

## 🚨 Troubleshooting

### Common Issues

1. **Port Already in Use**:
   ```bash
   # Kill process using port 5173 (frontend)
   npx kill-port 5173
   
   # Kill process using port 8000 (backend)  
   npx kill-port 8000
   ```

2. **Python Virtual Environment Issues**:
   ```bash
   # Recreate virtual environment
   rm -rf venv  # or rmdir /s venv on Windows
   python -m venv venv
   venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **Node.js Dependencies**:
   ```bash
   # Clear npm cache and reinstall
   npm cache clean --force
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **CORS Issues**:
   - Ensure backend is running on port 8000
   - Check that CORS middleware is properly configured in `main.py`

## 🎨 Node Types Available

- **Input**: Data input with type selection (Text, File, Number)
- **Output**: Data output with type configuration  
- **LLM**: Language model processing with model selection
- **Text**: Dynamic text processing with auto-resizing
- **Filter**: Data filtering with various criteria
- **Transform**: Data transformation operations
- **Conditional**: Conditional logic with true/false paths
- **Aggregator**: Data aggregation with multiple inputs
- **Delay**: Execution delay with configurable duration

## 📝 API Endpoints

### POST `/pipelines/parse`
Analyzes a pipeline and returns statistics.

**Request Body**:
```json
{
  "nodes": [...],
  "edges": [...]
}
```

**Response**:
```json
{
  "num_nodes": 5,
  "num_edges": 4,  
  "is_dag": true
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit changes: `git commit -am 'Add feature'`
4. Push to branch: `git push origin feature-name`  
5. Submit a Pull Request

## 📄 License

This project is part of the VectorShift Frontend Technical Assessment.

## 🎯 Assessment Completion

This implementation successfully completes all requirements:
- ✅ Node abstraction with BaseNode component
- ✅ Dynamic text node resizing 
- ✅ Professional UI with modern styling
- ✅ Full CRUD operations with validation
- ✅ Backend integration with DAG analysis
- ✅ Toast notifications using Sonner
- ✅ Comprehensive error handling