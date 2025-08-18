import { useState, useRef, useCallback, useEffect } from 'react';
import ReactFlow, { Controls, Background, MiniMap} from 'reactflow';
import { useStore } from './store';
import { useStoreWithEqualityFn } from 'zustand/traditional';
import { shallow } from 'zustand/shallow';
import { 
  InputNode, 
  OutputNode, 
  LLMNode, 
  TextNode,
  FilterNode,
  TransformNode,
  ConditionalNode,
  AggregatorNode,
  DelayNode
} from './components/nodeFactory';
import { 
  FiMaximize2,
  FiRotateCcw,
  FiRotateCw,
  FiLock,
  FiUnlock
} from 'react-icons/fi';

import 'reactflow/dist/style.css';

const gridSize = 20;
const proOptions = { hideAttribution: true };
const nodeTypes = {
  customInput: InputNode,
  llm: LLMNode,
  customOutput: OutputNode,
  text: TextNode,
  filter: FilterNode,
  transform: TransformNode,
  conditional: ConditionalNode,
  aggregator: AggregatorNode,
  delay: DelayNode,
};

const selector = (state) => ({
  nodes: state.nodes,
  edges: state.edges,
  getNodeID: state.getNodeID,
  generateNodeName: state.generateNodeName,
  isNodeNameUnique: state.isNodeNameUnique,
  updateNodeName: state.updateNodeName,
  addNode: state.addNode,
  deleteNode: state.deleteNode,
  onNodesChange: state.onNodesChange,
  onEdgesChange: state.onEdgesChange,
  onConnect: state.onConnect,
  undo: state.undo,
  redo: state.redo,
  canUndo: state.canUndo,
  canRedo: state.canRedo,
});

export const PipelineUI = () => {
    const reactFlowWrapper = useRef(null);
    const [reactFlowInstance, setReactFlowInstance] = useState(null);
    const [zoomLevel, setZoomLevel] = useState(100);
    const [isNodesLocked, setIsNodesLocked] = useState(false);
    const {
      nodes,
      edges,
      getNodeID,
      generateNodeName,
      isNodeNameUnique,
      updateNodeName,
      addNode,
      deleteNode,
      onNodesChange,
      onEdgesChange,
      onConnect,
      undo,
      redo,
      canUndo,
      canRedo
    } = useStoreWithEqualityFn(useStore, selector, shallow);

    const getInitNodeData = useCallback((nodeID, type) => {
      const defaultName = generateNodeName(type);
      let nodeData = { 
        id: nodeID, 
        nodeType: `${type}`,
        nodeName: defaultName
      };
      return nodeData;
    }, [generateNodeName]);

    const onDrop = useCallback(
        (event) => {
          event.preventDefault();
    
          const reactFlowBounds = reactFlowWrapper.current.getBoundingClientRect();
          if (event?.dataTransfer?.getData('application/reactflow')) {
            const appData = JSON.parse(event.dataTransfer.getData('application/reactflow'));
            const type = appData?.nodeType;
      
            // check if the dropped element is valid
            if (typeof type === 'undefined' || !type) {
              return;
            }
      
            const position = reactFlowInstance.screenToFlowPosition({
              x: event.clientX - reactFlowBounds.left,
              y: event.clientY - reactFlowBounds.top,
            });

            const nodeID = getNodeID(type);
            const newNode = {
              id: nodeID,
              type,
              position,
              data: getInitNodeData(nodeID, type),
            };
      
            addNode(newNode);
          }
        },
        [reactFlowInstance, getNodeID, addNode, getInitNodeData]
    );

    const onDragOver = useCallback((event) => {
        event.preventDefault();
        event.dataTransfer.dropEffect = 'move';
    }, []);

    // Control functions
    const zoomIn = useCallback(() => {
        if (reactFlowInstance) {
            reactFlowInstance.zoomIn();
            setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100));
        }
    }, [reactFlowInstance]);

    const zoomOut = useCallback(() => {
        if (reactFlowInstance) {
            reactFlowInstance.zoomOut();
            setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100));
        }
    }, [reactFlowInstance]);

    const fitView = useCallback(() => {
        if (reactFlowInstance) {
            reactFlowInstance.fitView();
            setZoomLevel(Math.round(reactFlowInstance.getZoom() * 100));
        }
    }, [reactFlowInstance]);

    // Undo/Redo functions
    const handleUndo = useCallback(() => {
        undo();
    }, [undo]);

    const handleRedo = useCallback(() => {
        redo();
    }, [redo]);

    // Node lock function
    const toggleNodeLock = useCallback(() => {
        setIsNodesLocked(!isNodesLocked);
    }, [isNodesLocked]);

    // Handle custom delete events from nodes
    useEffect(() => {
        const handleDeleteNode = (event) => {
            const { nodeId } = event.detail;
            deleteNode(nodeId);
        };

        window.addEventListener('deleteNode', handleDeleteNode);
        return () => window.removeEventListener('deleteNode', handleDeleteNode);
    }, [deleteNode]);

    // Enhance nodes with delete function and name management
    const enhancedNodes = nodes.map(node => ({
        ...node,
        data: {
            ...node.data,
            onDelete: deleteNode,
            onNameChange: updateNodeName,
            isNodeNameUnique: isNodeNameUnique
        }
    }));

    return (
        <>
        <div ref={reactFlowWrapper} style={{
            width: '100vw', 
            height: '100vh',
            pointerEvents: 'auto' // Ensure drop events work everywhere
        }}>
            <ReactFlow
                nodes={enhancedNodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onDrop={onDrop}
                onDragOver={onDragOver}
                onInit={(instance) => {
                    setReactFlowInstance(instance);
                    setZoomLevel(Math.round(instance.getZoom() * 100));
                }}
                onMove={(event, viewport) => {
                    if (reactFlowInstance) {
                        setZoomLevel(Math.round(viewport.zoom * 100));
                    }
                }}
                nodeTypes={nodeTypes}
                proOptions={proOptions}
                snapGrid={[gridSize, gridSize]}
                connectionLineType='smoothstep'
                zoomOnScroll={true}
                zoomOnPinch={true}
                zoomOnDoubleClick={false}
                nodesDraggable={!isNodesLocked}
                nodesConnectable={!isNodesLocked}
            >
                <Background color="#aaa" gap={gridSize} />
                
                {/* ReactFlow Controls - Hidden by default, can be enabled */}
                <Controls 
                    style={{ display: 'none' }} 
                    showZoom={false}
                    showFitView={false}
                    showInteractive={false}
                />
                
                {/* Horizontal Control Panel - Top of MiniMap */}
                <div style={{
                    position: 'absolute',
                    bottom: '170px',
                    right: '20px',
                    background: 'white',
                    border: '2px solid #333',
                    borderRadius: '6px',
                    padding: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    gap: '4px',
                    zIndex: 10
                }}>
                    {/* Zoom Level Display */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        fontSize: '12px',
                        minWidth: '40px',
                        justifyContent: 'center',
                        color: 'black'
                    }}>
                        {zoomLevel}%
                    </div>
                    
                    {/* Zoom Controls */}
                    <button
                        onClick={zoomIn}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: 'white',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'black'
                        }}
                        title="Zoom In"
                    >
                        +
                    </button>
                    
                    <button
                        onClick={zoomOut}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: 'white',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            color: 'black'
                        }}
                        title="Zoom Out"
                    >
                        −
                    </button>
                    
                    <button
                        onClick={fitView}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: 'white',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            color: 'black'
                        }}
                        title="Fit View"
                    >
                        <FiMaximize2 size={14} />
                    </button>
                </div>
                
                {/* Vertical Control Panel - Left of MiniMap */}
                <div style={{
                    position: 'absolute',
                    bottom: '20px',
                    right: '220px',
                    background: 'white',
                    border: '2px solid #333',
                    borderRadius: '6px',
                    padding: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '4px',
                    zIndex: 10
                }}>
                    {/* Undo Button */}
                    <button
                        onClick={handleUndo}
                        disabled={!canUndo()}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: canUndo() ? 'white' : '#f5f5f5',
                            color: canUndo() ? 'black' : '#999',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: canUndo() ? 'pointer' : 'not-allowed'
                        }}
                        title="Undo"
                    >
                        <FiRotateCcw size={14} />
                    </button>
                    
                    {/* Redo Button */}
                    <button
                        onClick={handleRedo}
                        disabled={!canRedo()}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: canRedo() ? 'white' : '#f5f5f5',
                            color: canRedo() ? 'black' : '#999',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: canRedo() ? 'pointer' : 'not-allowed'
                        }}
                        title="Redo"
                    >
                        <FiRotateCw size={14} />
                    </button>
                    
                    {/* Node Lock Button */}
                    <button
                        onClick={toggleNodeLock}
                        style={{
                            width: '28px',
                            height: '28px',
                            border: '1px solid #333',
                            background: isNodesLocked ? '#333' : 'white',
                            color: isNodesLocked ? 'white' : 'black',
                            borderRadius: '4px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer'
                        }}
                        title={isNodesLocked ? "Unlock Nodes (Enable Node Dragging & Connections)" : "Lock Nodes (Disable Node Dragging & Connections)"}
                    >
                        {isNodesLocked ? <FiLock size={14} /> : <FiUnlock size={14} />}
                    </button>
                    
                   
                </div>
                
                {/* Standard MiniMap */}
                <MiniMap
                    nodeColor={(node) => {
                        const colorMap = {
                            customInput: '#4CAF50',
                            customOutput: '#f44336',
                            llm: '#2196f3',
                            text: '#ff9800',
                            filter: '#9c27b0',
                            transform: '#00bcd4',
                            conditional: '#ff5722',
                            aggregator: '#8bc34a',
                            delay: '#e91e63'
                        };
                        return colorMap[node.type] || '#999';
                    }}
                />
            </ReactFlow>
        </div>
        </>
    )
}
