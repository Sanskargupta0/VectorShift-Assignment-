import { createWithEqualityFn } from "zustand/traditional";
import {
    addEdge,
    applyNodeChanges,
    applyEdgeChanges,
    MarkerType,
  } from 'reactflow';

export const useStore = createWithEqualityFn((set, get) => ({
    nodes: [],
    edges: [],
    history: [],
    historyStep: -1,
    getNodeID: (type) => {
        const newIDs = {...get().nodeIDs};
        if (newIDs[type] === undefined) {
            newIDs[type] = 0;
        }
        newIDs[type] += 1;
        set({nodeIDs: newIDs});
        return `${type}-${newIDs[type]}`;
    },
    
    // Generate default node name
    generateNodeName: (type) => {
        const { nodes } = get();
        const baseType = type.replace('custom', '').toLowerCase();
        let counter = 0;
        let name;
        
        do {
            name = `${baseType}_${counter}`;
            counter++;
        } while (nodes.some(node => node.data?.nodeName === name));
        
        return name;
    },
    
    // Check if node name is unique
    isNodeNameUnique: (name, excludeNodeId) => {
        const { nodes } = get();
        return !nodes.some(node => 
            node.data?.nodeName === name && node.id !== excludeNodeId
        );
    },
    
    // Update node name
    updateNodeName: (nodeId, newName) => {
        set({
            nodes: get().nodes.map(node => 
                node.id === nodeId 
                    ? { ...node, data: { ...node.data, nodeName: newName } }
                    : node
            )
        });
    },
    
    // Save current state to history
    saveToHistory: () => {
        const { nodes, edges, history, historyStep } = get();
        const newHistory = history.slice(0, historyStep + 1);
        newHistory.push({ nodes: [...nodes], edges: [...edges] });
        
        // Keep only last 50 states
        if (newHistory.length > 50) {
            newHistory.shift();
        } else {
            set({ historyStep: historyStep + 1 });
        }
        
        set({ history: newHistory });
    },
    
    // Undo action
    undo: () => {
        const { history, historyStep } = get();
        if (historyStep > 0) {
            const previousState = history[historyStep - 1];
            set({
                nodes: [...previousState.nodes],
                edges: [...previousState.edges],
                historyStep: historyStep - 1
            });
        }
    },
    
    // Redo action
    redo: () => {
        const { history, historyStep } = get();
        if (historyStep < history.length - 1) {
            const nextState = history[historyStep + 1];
            set({
                nodes: [...nextState.nodes],
                edges: [...nextState.edges],
                historyStep: historyStep + 1
            });
        }
    },
    
    // Check if undo is available
    canUndo: () => {
        const { historyStep } = get();
        return historyStep > 0;
    },
    
    // Check if redo is available
    canRedo: () => {
        const { history, historyStep } = get();
        return historyStep < history.length - 1;
    },
    
    addNode: (node) => {
        get().saveToHistory();
        set({
            nodes: [...get().nodes, node]
        });
    },
    
    deleteNode: (nodeId) => {
        get().saveToHistory();
        set({
            nodes: get().nodes.filter(node => node.id !== nodeId),
            edges: get().edges.filter(edge => edge.source !== nodeId && edge.target !== nodeId)
        });
    },
    
    onNodesChange: (changes) => {
      // Save to history before making changes (for delete, move operations)
      const hasSignificantChanges = changes.some(change => 
        change.type === 'remove' || 
        (change.type === 'position' && change.dragging === false)
      );
      
      if (hasSignificantChanges) {
        get().saveToHistory();
      }
      
      set({
        nodes: applyNodeChanges(changes, get().nodes),
      });
    },
    onEdgesChange: (changes) => {
      // Save to history before making changes (for delete operations)
      const hasSignificantChanges = changes.some(change => change.type === 'remove');
      
      if (hasSignificantChanges) {
        get().saveToHistory();
      }
      
      set({
        edges: applyEdgeChanges(changes, get().edges),
      });
    },
    onConnect: (connection) => {
      get().saveToHistory();
      set({
        edges: addEdge({...connection, type: 'smoothstep', animated: true, markerEnd: {type: MarkerType.Arrow, height: '20px', width: '20px'}}, get().edges),
      });
    },
    updateNodeField: (nodeId, fieldName, fieldValue) => {
      set({
        nodes: get().nodes.map((node) => {
          if (node.id === nodeId) {
            node.data = { ...node.data, [fieldName]: fieldValue };
          }
  
          return node;
        }),
      });
    },
  }));
