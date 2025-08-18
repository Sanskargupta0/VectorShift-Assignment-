import { useStore } from './store';
import { toast } from 'sonner';

// Get API base URL from environment variables
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';
const API_TIMEOUT = parseInt(import.meta.env.VITE_API_TIMEOUT) || 10000;
const DEBUG_LOGS = import.meta.env.VITE_DEBUG_LOGS === 'true';

export const SubmitButton = () => {
    const { nodes, edges } = useStore();

    const handleSubmit = async () => {
        try {
            // Show loading toast
            const loadingToast = toast.loading('Analyzing pipeline...');
            
            // Prepare the data in the format expected by the backend
            const pipelineData = {
                nodes: nodes.map(node => ({
                    id: node.id,
                    type: node.type,
                    data: node.data || {}
                })),
                edges: edges.map(edge => ({
                    id: edge.id,
                    source: edge.source,
                    target: edge.target
                }))
            };

            if (DEBUG_LOGS) {
                console.log('Submitting pipeline to:', `${API_BASE_URL}/pipelines/parse`);
                console.log('Pipeline data:', pipelineData);
            }

            // Create AbortController for timeout
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

            try {
                // Send request to backend
                const response = await fetch(`${API_BASE_URL}/pipelines/parse`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                    },
                    body: JSON.stringify(pipelineData),
                    signal: controller.signal
                });

                // Clear timeout on successful response
                clearTimeout(timeoutId);

                // Dismiss loading toast
                toast.dismiss(loadingToast);

                if (!response.ok) {
                    const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
                    throw new Error(errorData.detail || `HTTP error! status: ${response.status}`);
                }

                const result = await response.json();
                
                if (DEBUG_LOGS) {
                    console.log('Backend response:', result);
                }

                // Show success toast with results
                const dagStatus = result.is_dag ? '✅ Valid DAG' : '❌ Not a DAG (contains cycles)';
                const message = `Pipeline Analysis:\n• Nodes: ${result.num_nodes}\n• Edges: ${result.num_edges}\n• Status: ${dagStatus}`;
                
                toast.success('Pipeline Analysis Complete!', {
                    description: message,
                    duration: 5000,
                    action: {
                        label: 'Details',
                        onClick: () => {
                            alert(`Detailed Results:\n\nNumber of Nodes: ${result.num_nodes}\nNumber of Edges: ${result.num_edges}\nIs Valid DAG: ${result.is_dag ? 'Yes' : 'No'}\n\n${result.is_dag ? 'Your pipeline is a valid Directed Acyclic Graph!' : 'Your pipeline contains cycles and is not a valid DAG.'}`);
                        }
                    }
                });

            } catch (fetchError) {
                // Clear timeout on error
                clearTimeout(timeoutId);
                throw fetchError;
            }

        } catch (error) {
            console.error('Error submitting pipeline:', error);
            
            // Dismiss loading toast if it exists
            toast.dismiss();
            
            // Handle different error types
            let errorMessage = 'Please check your connection and try again';
            
            if (error.name === 'AbortError') {
                errorMessage = `Request timeout after ${API_TIMEOUT/1000} seconds`;
            } else if (error.message.includes('Failed to fetch')) {
                errorMessage = `Cannot connect to backend at ${API_BASE_URL}. Please make sure the server is running.`;
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            // Show error toast
            toast.error('Failed to analyze pipeline', {
                description: errorMessage,
                duration: 6000,
                action: {
                    label: 'Retry',
                    onClick: () => handleSubmit()
                }
            });
        }
    };

    return (
        <button 
            onClick={handleSubmit}
            type="button"
            style={{
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                boxShadow: '0 2px 6px rgba(0,123,255,0.3)',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
            }}
            onMouseOver={(e) => {
                e.target.style.background = '#0056b3';
                e.target.style.transform = 'translateY(-1px)';
                e.target.style.boxShadow = '0 4px 8px rgba(0,123,255,0.4)';
            }}
            onMouseOut={(e) => {
                e.target.style.background = '#007bff';
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 2px 6px rgba(0,123,255,0.3)';
            }}
        >
            🚀 Submit Pipeline
        </button>
    );
}
