import { useState, useMemo, useCallback } from 'react';
import { Handle, Position } from 'reactflow';

export const BaseNode = ({ 
  id, 
  data, 
  config = {} 
}) => {
  const {
    title = 'Node',
    description = '',
    width = 200,
    height = 80,
    style = {},
    handles = [],
    fields = [],
    defaultValues = {}
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

  // Memoize the field change handler to prevent unnecessary re-renders
  const handleFieldChange = useCallback((fieldKey, value) => {
    setFieldValues(prev => ({
      ...prev,
      [fieldKey]: value
    }));
  }, []);

  // Memoize the base style to prevent unnecessary re-renders
  const baseStyle = useMemo(() => ({
    width,
    height,
    border: '1px solid black',
    padding: '8px',
    backgroundColor: 'white',
    borderRadius: '4px',
    fontSize: '12px',
    ...style
  }), [width, height, style]);

  // Memoize the field renderer to prevent unnecessary re-renders
  const renderField = useMemo(() => (field) => {
    const { key, label, type, options, placeholder } = field;
    const value = fieldValues[key] || '';

    switch (type) {
      case 'text':
        return (
          <div key={key} style={{ marginBottom: '4px' }}>
            <label style={{ display: 'block', fontSize: '10px', marginBottom: '2px' }}>
              {label}:
            </label>
            <input
              type="text"
              value={value}
              placeholder={placeholder}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              style={{ 
                width: '100%', 
                fontSize: '10px', 
                padding: '2px',
                border: '1px solid #ccc',
                borderRadius: '2px'
              }}
            />
          </div>
        );
      case 'select':
        return (
          <div key={key} style={{ marginBottom: '4px' }}>
            <label style={{ display: 'block', fontSize: '10px', marginBottom: '2px' }}>
              {label}:
            </label>
            <select
              value={value}
              onChange={(e) => handleFieldChange(key, e.target.value)}
              style={{ 
                width: '100%', 
                fontSize: '10px', 
                padding: '2px',
                border: '1px solid #ccc',
                borderRadius: '2px'
              }}
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
            fontSize: '8px',
            color: '#666',
            ...(position === Position.Left ? { right: '100%', marginRight: '4px' } : {}),
            ...(position === Position.Right ? { left: '100%', marginLeft: '4px' } : {}),
            ...(position === Position.Top ? { bottom: '100%', marginBottom: '4px' } : {}),
            ...(position === Position.Bottom ? { top: '100%', marginTop: '4px' } : {})
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
        fontWeight: 'bold', 
        marginBottom: description ? '4px' : '8px',
        textAlign: 'center',
        fontSize: '12px'
      }}>
        {title}
      </div>
      
      {/* Node description */}
      {description && (
        <div style={{ 
          fontSize: '10px', 
          color: '#666', 
          marginBottom: '8px',
          textAlign: 'center'
        }}>
          {description}
        </div>
      )}
      
      {/* Render fields */}
      <div style={{ flex: 1 }}>
        {fields.map(field => renderField(field))}
      </div>
    </div>
  );
};
