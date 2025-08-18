import { useState, useMemo } from 'react';
import { DraggableNode } from './draggableNode';
import { FiSearch, FiChevronUp, FiChevronDown} from 'react-icons/fi';

export const ToolbarToggleButton = ({ isVisible, onToggle }) => {
    return (
        <div className="nebula-toolbar-toggle">
            <button
                onClick={onToggle}
                className="nebula-toolbar-toggle__button"
                title={isVisible ? "Hide Toolbar" : "Show Toolbar"}
            >
                {isVisible ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                <span>{isVisible ? "Hide" : "Show"}</span>
            </button>
        </div>
    );
};

export const PipelineToolbar = ({ isVisible = true }) => {
    const [activeTab, setActiveTab] = useState('Start');
    const [searchQuery, setSearchQuery] = useState('');

    // Define all available nodes with their categories
    const allNodes = useMemo(() => [
        { type: 'customInput', label: 'Input', category: 'Start', tags: ['input', 'data', 'source'] },
        { type: 'customOutput', label: 'Output', category: 'Start', tags: ['output', 'result', 'destination'] },
        { type: 'llm', label: 'LLM', category: 'AI', tags: ['ai', 'llm', 'language', 'model', 'gpt'] },
        { type: 'text', label: 'Text', category: 'Objects', tags: ['text', 'string', 'content'] },
        { type: 'filter', label: 'Filter', category: 'Logic', tags: ['filter', 'condition', 'criteria'] },
        { type: 'transform', label: 'Transform', category: 'Data', tags: ['transform', 'convert', 'modify'] },
        { type: 'conditional', label: 'Conditional', category: 'Logic', tags: ['condition', 'if', 'branch', 'logic'] },
        { type: 'aggregator', label: 'Aggregator', category: 'Data', tags: ['combine', 'merge', 'aggregate'] },
        { type: 'delay', label: 'Delay', category: 'Logic', tags: ['delay', 'wait', 'timer', 'pause'] }
    ], []);

    // Define tab categories
    const tabs = ['Start', 'Objects', 'AI', 'Logic', 'Data'];

    // Filter nodes based on active tab and search query
    const filteredNodes = useMemo(() => {
        let nodes = allNodes;

        // Filter by active tab
        if (activeTab !== 'Start') {
            nodes = nodes.filter(node => node.category === activeTab);
        }

        // Filter by search query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            nodes = nodes.filter(node => 
                node.label.toLowerCase().includes(query) ||
                node.tags.some(tag => tag.includes(query))
            );
        }

        return nodes;
    }, [allNodes, activeTab, searchQuery]);

    return (
        <>
            {/* Main Toolbar */}
            {isVisible && (
                <div className="nebula-toolbar">
            {/* Header with search and tabs */}
            <div className="nebula-toolbar__header">
                <div className="nebula-toolbar__search">
                    <input
                        type="text"
                        placeholder="Search nodes..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="nebula-toolbar__search-input"
                    />
                    <div className="nebula-toolbar__search-icon">
                        <FiSearch />
                    </div>
                </div>
                
                <div className="nebula-toolbar__tabs">
                    {tabs.map((tab) => (
                        <button
                            key={tab}
                            className={`nebula-toolbar__tab ${
                                activeTab === tab ? 'nebula-toolbar__tab--active' : ''
                            }`}
                            onClick={() => setActiveTab(tab)}
                        >
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            {/* Node content grid */}
            <div className="nebula-toolbar__content">
                {filteredNodes.length > 0 ? (
                    filteredNodes.map((node) => (
                        <DraggableNode
                            key={node.type}
                            type={node.type}
                            label={node.label}
                        />
                    ))
                ) : (
                    <div style={{
                        gridColumn: '1 / -1',
                        textAlign: 'center',
                        color: 'var(--text-tertiary)',
                        padding: 'var(--spacing-lg)',
                        fontSize: '14px'
                    }}>
                        {searchQuery ? 
                            `No nodes found matching "${searchQuery}"` : 
                            `No nodes available in ${activeTab} category`
                        }
                    </div>
                )}
            </div>
                </div>
            )}
        </>
    );
};
