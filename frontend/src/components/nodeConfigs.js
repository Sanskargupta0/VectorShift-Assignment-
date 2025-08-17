import { Position } from 'reactflow';

export const createNodeConfig = (type, customConfig = {}) => {
  const baseConfigs = {
    input: {
      title: 'Input',
      description: 'Data input node',
      width: 200,
      height: 120,
      style: {
        backgroundColor: '#e8f5e8',
        borderColor: '#4caf50'
      },
      handles: [
        {
          type: 'source',
          position: Position.Right,
          id: 'value'
        }
      ],
      fields: [
        {
          key: 'inputName',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter input name',
          defaultValue: 'input_1'
        },
        {
          key: 'inputType',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'File', label: 'File' },
            { value: 'Number', label: 'Number' }
          ],
          defaultValue: 'Text'
        }
      ]
    },

    output: {
      title: 'Output',
      description: 'Data output node',
      width: 200,
      height: 120,
      style: {
        backgroundColor: '#ffe8e8',
        borderColor: '#f44336'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'value'
        }
      ],
      fields: [
        {
          key: 'outputName',
          label: 'Name',
          type: 'text',
          placeholder: 'Enter output name',
          defaultValue: 'output_1'
        },
        {
          key: 'outputType',
          label: 'Type',
          type: 'select',
          options: [
            { value: 'Text', label: 'Text' },
            { value: 'Image', label: 'Image' },
            { value: 'File', label: 'File' }
          ],
          defaultValue: 'Text'
        }
      ]
    },

    llm: {
      title: 'LLM',
      description: 'Large Language Model',
      width: 220,
      height: 100,
      style: {
        backgroundColor: '#f0f8ff',
        borderColor: '#2196f3'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'system',
          style: { top: '33%' },
          label: 'System'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'prompt',
          style: { top: '66%' },
          label: 'Prompt'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'response',
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
          defaultValue: 'gpt-4'
        }
      ]
    },

    text: {
      title: 'Text',
      description: 'Text processing node',
      width: 200,
      height: 120,
      style: {
        backgroundColor: '#fff8e1',
        borderColor: '#ff9800'
      },
      handles: [
        {
          type: 'source',
          position: Position.Right,
          id: 'output'
        }
      ],
      fields: [
        {
          key: 'text',
          label: 'Text',
          type: 'textarea',
          placeholder: 'Enter text...',
          defaultValue: '{{input}}'
        }
      ]
    },

    // New node types
    filter: {
      title: 'Filter',
      description: 'Data filtering node',
      width: 200,
      height: 140,
      style: {
        backgroundColor: '#f3e5f5',
        borderColor: '#9c27b0'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          label: 'Data'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
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
          defaultValue: 'contains'
        },
        {
          key: 'filterValue',
          label: 'Filter Value',
          type: 'text',
          placeholder: 'Enter filter criteria'
        }
      ]
    },

    transform: {
      title: 'Transform',
      description: 'Data transformation node',
      width: 200,
      height: 160,
      style: {
        backgroundColor: '#e1f5fe',
        borderColor: '#00bcd4'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          label: 'Data'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
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
          defaultValue: 'uppercase'
        },
        {
          key: 'parameter',
          label: 'Parameter',
          type: 'text',
          placeholder: 'Optional parameter'
        }
      ]
    },

    conditional: {
      title: 'Conditional',
      description: 'Conditional logic node',
      width: 200,
      height: 180,
      style: {
        backgroundColor: '#fff3e0',
        borderColor: '#ff5722'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          label: 'Input'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'condition',
          style: { top: '70%' },
          label: 'Condition'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'true',
          style: { top: '30%' },
          label: 'True'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'false',
          style: { top: '70%' },
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
          defaultValue: 'equals'
        },
        {
          key: 'value',
          label: 'Compare Value',
          type: 'text',
          placeholder: 'Value to compare against'
        }
      ]
    },

    aggregator: {
      title: 'Aggregator',
      description: 'Data aggregation node',
      width: 200,
      height: 160,
      style: {
        backgroundColor: '#f1f8e9',
        borderColor: '#8bc34a'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input1',
          style: { top: '25%' },
          label: 'Input 1'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'input2',
          style: { top: '50%' },
          label: 'Input 2'
        },
        {
          type: 'target',
          position: Position.Left,
          id: 'input3',
          style: { top: '75%' },
          label: 'Input 3'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
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
          defaultValue: 'concat'
        },
        {
          key: 'separator',
          label: 'Separator',
          type: 'text',
          placeholder: 'Optional separator',
          defaultValue: ', '
        }
      ]
    },

    delay: {
      title: 'Delay',
      description: 'Delay execution node',
      width: 200,
      height: 140,
      style: {
        backgroundColor: '#fce4ec',
        borderColor: '#e91e63'
      },
      handles: [
        {
          type: 'target',
          position: Position.Left,
          id: 'input',
          label: 'Input'
        },
        {
          type: 'source',
          position: Position.Right,
          id: 'output',
          label: 'Output'
        }
      ],
      fields: [
        {
          key: 'duration',
          label: 'Duration (ms)',
          type: 'text',
          placeholder: '1000',
          defaultValue: '1000'
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
          defaultValue: 'ms'
        }
      ]
    }
  };

  const config = baseConfigs[type];
  if (!config) {
    throw new Error(`Unknown node type: ${type}`);
  }

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
