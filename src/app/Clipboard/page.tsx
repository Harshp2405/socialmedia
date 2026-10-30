'use client';

import { useState } from 'react';

export default function ClipDropImageGenerator() {
    const [prompt, setPrompt] = useState('');
    const [image64, setImage64] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleGenerate = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setImage64('');

        try {
            const response = await fetch('/api/clipdrop', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            });

            const data = await response.json();
            console.log(data + "Data Response Front")

            if (!response.ok) {
                throw new Error(data.error || 'Image generation failed.');
            }

            setImage64(data.image64);
        } catch (err: any) {
            setError(err.message || 'An unexpected error occurred.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <main style={{ maxWidth: '600px', margin: '0 auto', padding: '2rem' }}>
            <h1>Generate Image with ClipDrop</h1>
            <form onSubmit={handleGenerate} style={{ marginBottom: '1rem' }}>
                <input
                    type="text"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Describe your image..."
                    style={{ width: '100%', padding: '0.5rem', fontSize: '16px' }}
                    required
                />
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        marginTop: '1rem',
                        padding: '0.5rem 1rem',
                        fontSize: '16px',
                        backgroundColor: '#0070f3',
                        color: '#fff',
                        border: 'none',
                        cursor: 'pointer',
                    }}
                >
                    {loading ? 'Generating...' : 'Generate Image'}
                </button>
            </form>

            {error && <p style={{ color: 'red' }}>{error}</p>}

            {image64 && (
                <div>
                    <h2>Generated Image:</h2>
                    <img
                        src={image64}
                        alt="Generated"
                        style={{ width: '100%', border: '1px solid #ccc', marginTop: '1rem' }}
                    />
                    <a
                        href={image64}
                        download="clipdrop-image.jpg"
                        style={{
                            display: 'inline-block',
                            padding: '10px 20px',
                            backgroundColor: '#28a745',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '5px',
                        }}
                    >
                        Download Image
                    </a>
                </div>
            )}
        </main>
    );
}
