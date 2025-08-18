import { Position } from 'reactflow';
import { 
  FiDownload, 
  FiUpload, 
  FiCpu, 
  FiFileText, 
  FiFilter, 
  FiRotateCw, 
  FiGitBranch, 
  FiLayers, 
  FiClock,
  FiSearch 
} from 'react-icons/fi';


const getBaseNodeStyle = (borderColor, backgroundColor = '#fff', gradientColor = null) => ({
  background: gradientColor ? `linear-gradient(135deg, ${backgroundColor} 0%, ${gradientColor} 100%)` : backgroundColor,
  border: `2px solid ${borderColor}`,
  borderRadius: '12px',
  color: '#333',
  fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
  display: 'flex',
  flexDirection: 'column',
  minWidth: '200px',
  minHeight: '85px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  transition: 'all 0.2s ease-in-out',
  cursor: 'pointer',
  position: 'relative',
  zIndex: 1  // Ensure node is above background but handles can be above it
});

// Helper function to create consistent handle styles
const createHandleStyle = (color, position) => {
  const baseStyle = {
    background: color,
    width: '16px',
    height: '16px',
    border: '3px solid white',
    boxShadow: `0 2px 8px ${color}66`,  // Add transparency to color for shadow
    borderRadius: '50%',
    zIndex: 10,  // Ensure handles are always on top
    position: 'fixed',
    transform: 'translate(-50%, -50%)',  // Center the handle perfectly
  };

  // Add position-specific styles to center on borders
  switch (position) {
    case Position.Left:
      return {
        ...baseStyle,
        left: '0px',
        top: '50%',
      };
    case Position.Right:
      return {
        ...baseStyle,
        right: '-14px',
        top: '50%',
      };
    case Position.Top:
      return {
        ...baseStyle,
        top: '0px',
        left: '50%',
      };
    case Position.Bottom:
      return {
        ...baseStyle,
        bottom: '0px',
        left: '50%',
      };
    default:
      return baseStyle;
  }
};

export const createNodeConfig = (type, customConfig = {}) => {
  const baseConfigs = {
    input: {
      title: 'Input',
      description: 'Pass data of different types into your workflow',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 160,
      style: getBaseNodeStyle('#4A90E2', '#F8FBFF', '#E8F4FF'),
      icon: FiDownload,
      handles: [
        {
          type: 'source',
          position: Position.Right,
          id: 'value',
          style: createHandleStyle('#4A90E2', Position.Right)
        }
      ],
      fields: [
       
        {
          key: 'inputType',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
            { value: 'Number', label: 'Number' }
          ],
          defaultValue: 'Text',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        }
      ]
    },

    output: {
      title: 'Output',
      description: 'Output processed data from your workflow',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 160,
      style: getBaseNodeStyle('#FF6B6B', '#FFF8F8', '#FFE8E8'),
      icon: FiUpload,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'value',
          style: createHandleStyle('#FF6B6B', Position.Left)
        }
      ],
      fields: [

        {
          key: 'outputType',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'Image', label: 'Image' },
            { value: 'File', label: 'File' }
          ],
          defaultValue: 'Text',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        }
      ]
    },

    llm: {
      title: 'LLM',
      description: 'Large Language Model processing',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 180,
      style: getBaseNodeStyle('#8B5CF6', '#F8F4FF', '#F0E7FF'),
      icon: FiCpu,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'system',
          style: { 
            ...createHandleStyle('#8B5CF6', Position.Left),
            top: '33%'
          },
          label: 'System'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'prompt',
          style: { 
            ...createHandleStyle('#8B5CF6', Position.Left),
            top: '66%'
          },
          label: 'Prompt'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'response',
          style: createHandleStyle('#8B5CF6', Position.Right),
          label: 'Response'
        }
      ],
      fields: [
        {
          key: 'model',
          label: 'Model',
          type: 'select',
          options: [
            { value: 'gpt-4', label: 'GPT-4' },
            { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
            { value: 'claude-3', label: 'Claude 3' }
          ],
          defaultValue: 'gpt-4',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        }
      ]
    },

    text: {
      title: 'Text',
      description: 'Text processing node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 160,
      style: getBaseNodeStyle('#ff9800', '#fff3e0', '#FFE0B2'),
      icon: FiFileText,
      handles: [
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          style: createHandleStyle('#ff9800', Position.Right)
        }
      ],
      fields: [
        {
          key: 'text',
          label: 'Text',
          type: 'textarea',
          placeholder: 'Enter text...',
          defaultValue: '{{input}}',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            minHeight: '60px',
            resize: 'vertical'
          }
        }
      ]
    },

    // New node types
    filter: {
      title: 'Filter',
      description: 'Data filtering node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 180,
      style: getBaseNodeStyle('#9c27b0', '#f3e5f5', '#E1BEE7'),
      icon: FiFilter,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          style: createHandleStyle('#9c27b0', Position.Left),
          label: 'Data'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          style: createHandleStyle('#9c27b0', Position.Right),
          label: 'Filtered'
        }
      ],
      fields: [
        {
          key: 'filterType',
          label: 'Filter Type',
          type: 'select',
          options: [
            { value: 'contains', label: 'Contains' },
            { value: 'equals', label: 'Equals' },
            { value: 'regex', label: 'Regex' },
            { value: 'greater', label: 'Greater Than' },
            { value: 'less', label: 'Less Than' }
          ],
          defaultValue: 'contains',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        },
        {
          key: 'filterValue',
          label: 'Filter Value',
          type: 'text',
          placeholder: 'Enter filter criteria',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }
        }
      ]
    },

    transform: {
      title: 'Transform',
      description: 'Data transformation node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 180,
      style: getBaseNodeStyle('#00bcd4', '#e0f2f1', '#B2EBF2'),
      icon: FiRotateCw,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          style: createHandleStyle('#00bcd4', Position.Left),
          label: 'Data'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          style: createHandleStyle('#00bcd4', Position.Right),
          label: 'Transformed'
        }
      ],
      fields: [
        {
          key: 'operation',
          label: 'Operation',
          type: 'select',
          options: [
            { value: 'uppercase', label: 'Uppercase' },
            { value: 'lowercase', label: 'Lowercase' },
            { value: 'trim', label: 'Trim Spaces' },
            { value: 'replace', label: 'Find & Replace' },
            { value: 'split', label: 'Split Text' }
          ],
          defaultValue: 'uppercase',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        },
        {
          key: 'parameter',
          label: 'Parameter',
          type: 'text',
          placeholder: 'Optional parameter',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }
        }
      ]
    },

    conditional: {
      title: 'Conditional',
      description: 'Conditional logic node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 200,
      style: getBaseNodeStyle('#ff5722', '#fbe9e7', '#FFCCBC'),
      icon: FiGitBranch,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          style: {
            ...createHandleStyle('#ff5722', Position.Left),
            top: '40%'
          },
          label: 'Input'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'condition',
          style: { 
            ...createHandleStyle('#ff5722', Position.Left),
            top: '70%'
          },
          label: 'Condition'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'true',
          style: { 
            ...createHandleStyle('#ff5722', Position.Right),
            top: '30%'
          },
          label: 'True'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'false',
          style: { 
            ...createHandleStyle('#ff5722', Position.Right),
            top: '70%'
          },
          label: 'False'
        }
      ],
      fields: [
        {
          key: 'operator',
          label: 'Operator',
          type: 'select',
          options: [
            { value: 'equals', label: 'Equals' },
            { value: 'not_equals', label: 'Not Equals' },
            { value: 'contains', label: 'Contains' },
            { value: 'greater', label: 'Greater Than' },
            { value: 'less', label: 'Less Than' }
          ],
          defaultValue: 'equals',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        },
        {
          key: 'value',
          label: 'Compare Value',
          type: 'text',
          placeholder: 'Value to compare against',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }
        }
      ]
    },

    aggregator: {
      title: 'Aggregator',
      description: 'Data aggregation node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 200,
      style: getBaseNodeStyle('#8bc34a', '#f1f8e9', '#DCEDC8'),
      icon: FiLayers,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input1',
          style: { 
            ...createHandleStyle('#8bc34a', Position.Left),
            top: '25%'
          },
          label: 'Input 1'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'input2',
          style: { 
            ...createHandleStyle('#8bc34a', Position.Left),
            top: '50%'
          },
          label: 'Input 2'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'input3',
          style: { 
            ...createHandleStyle('#8bc34a', Position.Left),
            top: '75%'
          },
          label: 'Input 3'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          style: createHandleStyle('#8bc34a', Position.Right),
          label: 'Combined'
        }
      ],
      fields: [
        {
          key: 'operation',
          label: 'Operation',
          type: 'select',
          options: [
            { value: 'concat', label: 'Concatenate' },
            { value: 'merge', label: 'Merge' },
            { value: 'sum', label: 'Sum' },
            { value: 'average', label: 'Average' }
          ],
          defaultValue: 'concat',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        },
        {
          key: 'separator',
          label: 'Separator',
          type: 'text',
          placeholder: 'Optional separator',
          defaultValue: ', ',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }
        }
      ]
    },

    delay: {
      title: 'Delay',
      description: 'Delay execution node',
      width: 'auto',
      height: 'auto',
      minWidth: 280,
      minHeight: 180,
      style: getBaseNodeStyle('#e91e63', '#fce4ec', '#F8BBD9'),
      icon: FiClock,
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          style: createHandleStyle('#e91e63', Position.Left),
          label: 'Input'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          style: createHandleStyle('#e91e63', Position.Right),
          label: 'Output'
        }
      ],
      fields: [
        {
          key: 'duration',
          label: 'Duration (ms)',
          type: 'text',
          placeholder: '1000',
          defaultValue: '1000',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white'
          }
        },
        {
          key: 'unit',
          label: 'Unit',
          type: 'select',
          options: [
            { value: 'ms', label: 'Milliseconds' },
            { value: 's', label: 'Seconds' },
            { value: 'm', label: 'Minutes' }
          ],
          defaultValue: 'ms',
          style: {
            width: '100%',
            padding: '8px 12px',
            border: '1px solid #E1E5E9',
            borderRadius: '6px',
            fontSize: '14px',
            backgroundColor: 'white',
            cursor: 'pointer'
          }
        }
      ]
    }
  };

  const config = baseConfigs[type];
  if (!config) {
    throw new Error(`Unknown node type: ${type}`);
  }

  // Merge with custom configuration
  return {
    ...config,
    ...customConfig,
    style: { ...config.style, ...customConfig.style },
    handles: customConfig.handles || config.handles,
    fields: customConfig.fields || config.fields
  };
};

export const getAvailableNodeTypes = () => Object.keys({
  input: true,
  output: true,
  llm: true,
  text: true,
  filter: true,
  transform: true,
  conditional: true,
  aggregator: true,
  delay: true
});


export const SearchIcon = FiSearch;
