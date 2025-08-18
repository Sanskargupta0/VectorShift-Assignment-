import { useState, useMemo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';
import { FiMinus, FiMaximize2, FiX } from 'react-icons/fi';

export const BaseNode = ({ 
  id, 
  data, 
  config = {},
  onDelete 
}) => {
  const {
    title = 'Node',
    description = '',
    width = 'auto',
    height = 'auto',
    minWidth = 200,
    minHeight = 85,
    style = {},
    handles = [],
    fields = [],
    defaultValues = {},
    icon: IconComponent
  } = config;

  // Initialize state for all fields
  const [fieldValues, setFieldValues] = useState(() => {
    const initialValues = { ...defaultValues };
    fields.forEach(field => {
      if (data && data[field.key] !== undefined) {
        initialValues[field.key] = data[field.key];
      } else if (field.defaultValue !== undefined) {
        initialValues[field.key] = field.defaultValue;
      }
    });
    return initialValues;
  });

  // Node name state and validation
  const [nodeName, setNodeName] = useState(data?.nodeName || id);
  const [nameError, setNameError] = useState('');

  // Node control states
  const [isMinimized, setIsMinimized] = useState(false);

  // Name validation function
  const validateNodeName = useCallback((name) => {
    // Check length
    if (name.length < 3 || name.length > 50) {
      return 'Name must be 3-50 characters long';
    }
    
    // Check format (letters, numbers, underscores, must start with letter or underscore)
    const namePattern = /^[a-zA-Z_][a-zA-Z0-9_]*$/;
    if (!namePattern.test(name)) {
      return 'Name must be 3-50 characters long and can only contain letters, numbers, and underscores. Must start with a letter or underscore.';
    }
    
    // Check uniqueness
    if (data?.isNodeNameUnique && !data.isNodeNameUnique(name, id)) {
      return 'Name must be unique';
    }
    
    return '';
  }, [data, id]);

  // Handle name change with validation
  const handleNameChange = useCallback((newName) => {
    setNodeName(newName);
    const error = validateNodeName(newName);
    setNameError(error);
    
    // If no validation error, update the node data
    if (!error && data?.onNameChange) {
      data.onNameChange(id, newName);
    }
  }, [id, data, validateNodeName]);

  // Memoize the field change handler to prevent unnecessary re-renders
  const handleFieldChange = useCallback((fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  // Single toggle handler for expand/collapse
  const handleToggle = useCallback(() => {
    setIsMinimized(!isMinimized);
  }, [isMinimized]);

  // Delete handler with proper functionality
  const handleDelete = useCallback(() => {
    // Try onDelete prop first, then data.onDelete, then custom event fallback
    const deleteFunction = onDelete || data?.onDelete;
    if (deleteFunction) {
      deleteFunction(id);
    } else {
      // Fallback - dispatch custom event that parent can listen to
      window.dispatchEvent(new CustomEvent('deleteNode', { detail: { nodeId: id } }));
    }
  }, [id, onDelete, data?.onDelete]);

  // Memoize the base style to prevent unnecessary re-renders
  const baseStyle = useMemo(() => ({
    width: isMinimized ? '280px' : (width === 'auto' ? 'fit-content' : width),
    height: isMinimized ? '60px' : (height === 'auto' ? 'fit-content' : height),
    minWidth: isMinimized ? '280px' : minWidth,
    minHeight: isMinimized ? '60px' : minHeight,
    maxWidth: '400px',
    maxHeight: isMinimized ? '60px' : '600px',
    border: '2px solid #E1E5E9',
    padding: '0',
    backgroundColor: 'white',
    borderRadius: '12px',
    fontSize: '14px',
    fontFamily: '"Inter", "Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    overflow: 'hidden',
    position: 'relative',
    transition: 'all 0.3s ease-in-out',
    ...style
  }), [width, height, minWidth, minHeight, style, isMinimized]);

  // Memoize the field renderer to prevent unnecessary re-renders
  const renderField = useMemo(() => (field) => {
    const { key, label, type, options, placeholder, style: fieldStyle = {} } = field;
    const value = fieldValues[key] || '';

    const defaultFieldStyle = {
      width: '100%',
      padding: '8px 12px',
      border: '1px solid #E1E5E9',
      borderRadius: '6px',
      fontSize: '14px',
      fontFamily: 'inherit',
      outline: 'none',
      transition: 'border-color 0.2s ease',
      ...fieldStyle
    };

    const labelStyle = {
      display: 'block',
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      marginBottom: '6px',
      cursor: 'pointer'
    };

    switch (type) {
      case 'display':
        return (
          <div key={key} style={{ marginBottom: '12px' }}>
            {label && <label style={labelStyle}>{label}</label>}
            <div
              style={{
                ...defaultFieldStyle,
                backgroundColor: '#E8E7FF',
                border: '1px solid #D1C4E9',
                color: '#4A148C',
                fontWeight: '500',
                textAlign: 'center',
                cursor: 'default',
                padding: '10px 16px'
              }}
            >
              {value || placeholder}
            </div>
          </div>
        );
      case 'text':
        return (
          <div key={key} style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>{label}</label>
            <input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              style={{
                ...defaultFieldStyle,
                backgroundColor: '#F8F9FA'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
              onBlur={(e) => e.target.style.borderColor = '#E1E5E9'}
            />
          </div>
        );
      case 'select':
        return (
          <div key={key} style={{ marginBottom: '12px' }}>
            <label style={labelStyle}>{label}</label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              style={{
                ...defaultFieldStyle,
                backgroundColor: 'white',
                cursor: 'pointer'
              }}
              onFocus={(e) => e.target.style.borderColor = '#4A90E2'}
              onBlur={(e) => e.target.style.borderColor = '#E1E5E9'}
            >
              {options.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        );
      case 'textarea':
        return (
          <div key={key} style={{ marginBottom: '4px' }}>
            <label style={{ display: 'block', fontSize: '10px', marginBottom: '2px' }}>
              {label}:
            </label>
            <textarea
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              rows={2}
              style={{ 
                width: '100%', 
                fontSize: '10px', 
                padding: '2px',
                border: '1px solid #ccc',
                borderRadius: '2px',
                resize: 'vertical'
              }}
            />
          </div>
        );
      default:
        return null;
    }
  }, [fieldValues, handleFieldChange]);

  // Memoize the handle renderer to prevent unnecessary re-renders
  const renderHandle = useMemo(() => (handle, index) => {
    const {
      type,
      position,
      id: handleId,
      style: handleStyle = {},
      label
    } = handle;

    return (
      <Handle
        key={`${handleId || `${type}-${position}-${index}`}`}
        type={type}
        position={position}
        id={handleId || `${id}-${type}-${index}`}
        style={handleStyle}
      >
        {label && (
          <div style={{
            position: 'absolute',
            fontSize: '20px',
            fontWeight: 'bold',
            color: 'white',
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.8)',  // Add shadow for better readability
            whiteSpace: 'nowrap',  // Prevent label wrapping
            zIndex: 15,  // Ensure labels are above handles
            pointerEvents: 'none',  // Labels shouldn't interfere with clicking
            ...(position === Position.Left ? { right: '100%', marginRight: '8px' } : {}),
            ...(position === Position.Right ? { left: '100%', marginLeft: '8px' } : {}),
            ...(position === Position.Top ? { bottom: '100%', marginBottom: '8px' } : {}),
            ...(position === Position.Bottom ? { top: '100%', marginTop: '8px' } : {})
          }}>
            {label}
          </div>
        )}
      </Handle>
    );
  }, [id]);

  return (
    <div style={baseStyle}>
      {/* Render handles */}
      {handles.map((handle, index) => renderHandle(handle, index))}
      
      {/* Node header */}
      <div style={{ 
        padding: isMinimized ? '12px 20px 8px 20px' : '16px 20px 12px 20px',
        borderBottom: !isMinimized ? '1px solid #E1E5E9' : 'none',
        background: 'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(248,250,252,1) 100%)',
        position: 'relative'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '6px'
        }}>
          {IconComponent && (
            <IconComponent 
              size={18} 
              color="#374151"
              style={{ flexShrink: 0 }}
            />
          )}
          <h3 style={{ 
            margin: 0,
            fontSize: '16px',
            fontWeight: '600',
            color: '#111827',
            lineHeight: '1.2',
            flex: 1
          }}>
            {title}
          </h3>
          
          {/* Node Control Buttons - Just 2 buttons: Toggle and Delete */}
          <div style={{
            display: 'flex',
            gap: '4px',
            alignItems: 'center'
          }}>
            {/* Toggle Expand/Collapse Button */}
            <button
              onClick={handleToggle}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#F3F4F6';
                e.target.style.color = '#374151';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6B7280';
              }}
              title={isMinimized ? "Expand" : "Minimize"}
            >
              {isMinimized ? <FiMaximize2 size={14} /> : <FiMinus size={14} />}
            </button>
            
            {/* Delete Button */}
            <button
              onClick={handleDelete}
              style={{
                background: 'transparent',
                border: 'none',
                padding: '4px',
                cursor: 'pointer',
                borderRadius: '4px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#6B7280',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#FEE2E2';
                e.target.style.color = '#DC2626';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.color = '#6B7280';
              }}
              title="Delete"
            >
              <FiX size={14} />
            </button>
          </div>
        </div>
        {/* Description - Show in both expanded and minimized states */}
        {description && (
          <p style={{ 
            margin: 0,
            fontSize: '13px',
            color: '#6B7280',
            lineHeight: '1.4'
          }}>
            {description}
          </p>
        )}
        
        {/* Node Name Field */}
        {!isMinimized && (
          <div style={{ marginTop: '12px' }}>
            <input
              type="text"
              value={nodeName}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder={`${title.toLowerCase()}_0`}
              style={{
                width: '100%',
                padding: '8px 12px',
                fontSize: '14px',
                fontFamily: 'inherit',
                border: nameError ? '2px solid #EF4444' : '1px solid #D1D5DB',
                borderRadius: '6px',
                backgroundColor: nameError ? '#FEF2F2' : '#FFFFFF',
                color: nameError ? '#DC2626' : '#374151',
                outline: 'none',
                transition: 'all 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => {
                if (!nameError) {
                  e.target.style.borderColor = '#3B82F6';
                  e.target.style.boxShadow = '0 0 0 3px rgba(59, 130, 246, 0.1)';
                }
              }}
              onBlur={(e) => {
                if (!nameError) {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.boxShadow = 'none';
                }
              }}
            />
            {nameError && (
              <div style={{
                marginTop: '6px',
                padding: '6px 8px',
                fontSize: '12px',
                color: '#DC2626',
                backgroundColor: '#FEF2F2',
                border: '1px solid #FECACA',
                borderRadius: '4px',
                lineHeight: '1.4'
              }}>
                {nameError}
              </div>
            )}
          </div>
        )}
      </div>
      
      {/* Node content - Hidden when minimized */}
      {!isMinimized && (
        <div style={{ 
          padding: '16px 20px 20px 20px',
          backgroundColor: 'white'
        }}>
          {fields.map(renderField)}
        </div>
      
      )}
      
    </div>
  );
};
