import { createNodeConfig } from './components/nodeConfigs';

export const DraggableNode = ({ type, label }) => {
    const onDragStart = (event, nodeType) => {
      const appData = { nodeType }
      event.target.style.cursor = 'grabbing';
      event.dataTransfer.setData('application/reactflow', JSON.stringify(appData));
      event.dataTransfer.effectAllowed = 'move';
    };

    
    const getConfigType = (nodeType) => {
      const typeMap = {
        'customInput': 'input',
        'customOutput': 'output',
        'llm': 'llm',
        'text': 'text',
        'filter': 'filter',
        'transform': 'transform',
        'conditional': 'conditional',
        'aggregator': 'aggregator',
        'delay': 'delay'
      };
      return typeMap[nodeType] || 'input';
    };

    // Get CSS class for node type
    const getNodeClassName = (nodeType) => {
      const classMap = {
        'customInput': 'nebula-node--input',
        'customOutput': 'nebula-node--output',
        'llm': 'nebula-node--llm',
        'text': 'nebula-node--text',
        'filter': 'nebula-node--filter',
        'transform': 'nebula-node--transform',
        'conditional': 'nebula-node--conditional',
        'aggregator': 'nebula-node--aggregator',
        'delay': 'nebula-node--delay'
      };
      return classMap[nodeType] || 'nebula-node--default';
    };

    const configType = getConfigType(type);
    const config = createNodeConfig(configType);
    const IconComponent = config.icon;
    const className = getNodeClassName(type);
  
    return (
      <div
        className={`nebula-node ${className}`}
        onDragStart={(event) => onDragStart(event, type)}
        onDragEnd={(event) => (event.target.style.cursor = 'grab')}
        draggable
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: '8px'
        }}
      >
        <div className="nebula-node__icon" style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          {IconComponent && <IconComponent size={24} />}
        </div>
        <div className="nebula-node__label">
          {label}
        </div>
      </div>
    );
  };
