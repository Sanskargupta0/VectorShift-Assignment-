export const SubmitButton = () => {

    return (
        <button 
            type="submit"
            style={{
                padding: '8px 16px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
            onMouseOver={(e) => e.target.style.background = '#0056b3'}
            onMouseOut={(e) => e.target.style.background = '#007bff'}
        >
            Submit Pipeline
        </button>
    );
}
