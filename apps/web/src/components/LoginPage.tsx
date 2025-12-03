import React, { useState, useEffect } from 'react';

const API_BASE = 'http://127.0.0.1:3001';

interface Track {
  success: boolean;
  title?: string;
  filename?: string;
  duration?: number;
  prompt?: string;
  error?: string;
  trackIndex?: number;
}

interface AnalysisResult {
  estimatedAge: number;
  ageRange: string;
  confidence: number;
  reasoning: string[];
  musicGeneration: string;
  insights: string;
  topGenres: string[];
  musicPrompts: Array<{ title: string; prompt: string }>;
}

export function LoginPage() {
  const [status, setStatus] = useState<'idle' | 'authenticating' | 'fetching' | 'analyzing' | 'generating' | 'complete'>('idle');
  const [progress, setProgress] = useState('');
  const [error, setError] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);

  useEffect(() => {
    // Check if we're returning from Spotify auth
    // Parse query params from hash (e.g., #login?success=true)
    const hash = window.location.hash;
    const queryString = hash.includes('?') ? hash.split('?')[1] : '';
    const urlParams = new URLSearchParams(queryString);

    if (urlParams.get('success') === 'true') {
      setStatus('fetching');
      startAutomatedFlow();
    }
  }, []);

  const handleSpotifyLogin = () => {
    setStatus('authenticating');
    window.location.href = `${API_BASE}/auth/login`;
  };

  const startAutomatedFlow = async () => {
    try {
      // Step 1: Fetch and save Spotify data
      setProgress('Fetching your Spotify data...');
      await Promise.all([
        fetchAndSave('/stats/top-artists?time_range=medium_term&limit=50', '/stats/save-top-artists?time_range=medium_term&limit=50'),
        fetchAndSave('/stats/top-tracks?time_range=medium_term&limit=50', '/stats/save-top-tracks?time_range=medium_term&limit=50'),
        fetchAndSave('/stats/recently-played?limit=50', '/stats/save-recently-played?limit=50')
      ]);

      // Step 2: AI Analysis
      setStatus('analyzing');
      setProgress('Analyzing your music taste with AI...');

      const aiResponse = await fetch(`${API_BASE}/ai/guess-music-age`, {
        method: 'POST',
        credentials: 'include'
      });

      if (!aiResponse.ok) throw new Error('Failed to analyze music');

      const aiData = await aiResponse.json();
      setAnalysis(aiData.analysis);

      // Step 3: Generate music previews
      setStatus('generating');
      setProgress('Generating 8 preview tracks (20s each)...');

      const response = await fetch(`${API_BASE}/music/generate-from-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          analysis: aiData.analysis,
          duration: 20
        })
      });

      if (!response.ok) throw new Error('Failed to generate music');

      // Handle SSE stream
      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'complete') {
              setTracks(data.tracks);
              setStatus('complete');
              setProgress('');
            } else if (data.current) {
              setProgress(`Generating track ${data.current}/${data.total}...`);
            }
          }
        }
      }
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setStatus('idle');
    }
  };

  const fetchAndSave = async (fetchPath: string, savePath: string) => {
    const fetchRes = await fetch(`${API_BASE}${fetchPath}`, { credentials: 'include' });
    if (!fetchRes.ok) throw new Error(`Failed to fetch ${fetchPath}`);
    const data = await fetchRes.json();

    const saveRes = await fetch(`${API_BASE}${savePath}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ data })
    });
    if (!saveRes.ok) throw new Error(`Failed to save ${savePath}`);
  };

  const expandTrack = async (trackIndex: number, prompt: string, title: string) => {
    const btn = document.getElementById(`expand-btn-${trackIndex}`);
    if (btn) {
      btn.textContent = '⏳ Expanding...';
      (btn as HTMLButtonElement).disabled = true;
    }

    try {
      const response = await fetch(`${API_BASE}/music/expand-track`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ prompt, trackIndex })
      });

      if (!response.ok) throw new Error('Failed to expand track');

      const reader = response.body!.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = JSON.parse(line.slice(6));

            if (data.type === 'complete') {
              // Update track in state
              setTracks(prev => prev.map((t, i) =>
                i === trackIndex ? { ...t, ...data.result, duration: 120 } : t
              ));

              if (btn) {
                btn.textContent = '✅ Expanded!';
                btn.style.background = 'rgba(0,255,0,0.3)';
              }
            }
          }
        }
      }
    } catch (err: any) {
      if (btn) {
        btn.textContent = '❌ Failed';
        (btn as HTMLButtonElement).disabled = false;
      }
      alert(`Failed to expand track: ${err.message}`);
    }
  };

  return (
    <div className="login-page">
      <div className="login-image" aria-hidden="true" />
      <div className="login-form">
        <h1>Eleven Labs Wrap 2025</h1>

        {status === 'idle' && (
          <button
            type="button"
            className="primary spotify-btn"
            onClick={handleSpotifyLogin}
          >
            Authenticate with Spotify
          </button>
        )}

        {status === 'authenticating' && (
          <p style={{ color: '#fff', marginTop: '20px' }}>Redirecting to Spotify...</p>
        )}

        {(status === 'fetching' || status === 'analyzing' || status === 'generating') && (
          <div style={{ color: '#fff', marginTop: '20px' }}>
            <div className="spinner" style={{ margin: '0 auto 20px', width: '40px', height: '40px', border: '4px solid rgba(255,255,255,0.3)', borderTop: '4px solid #fff', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
            <p>{progress}</p>
          </div>
        )}

        {error && (
          <div style={{ color: '#ff5555', marginTop: '20px', padding: '15px', background: 'rgba(255,85,85,0.1)', borderRadius: '8px' }}>
            ❌ {error}
          </div>
        )}

        {status === 'complete' && analysis && (
          <div style={{ color: '#fff', marginTop: '20px', maxHeight: '70vh', overflowY: 'auto' }}>
            <h2 style={{ marginBottom: '20px' }}>Your Music Analysis</h2>

            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '20px', borderRadius: '12px', marginBottom: '20px' }}>
              <h3>Estimated Age: {analysis.estimatedAge}</h3>
              <p><strong>Music Generation:</strong> {analysis.musicGeneration}</p>
              <p>{analysis.insights}</p>
              <p><strong>Top Genres:</strong> {analysis.topGenres.join(', ')}</p>
            </div>

            <h3 style={{ marginBottom: '15px' }}>Generated Previews (20s each)</h3>

            {tracks.map((track, i) => {
              if (!track.success) {
                return (
                  <div key={i} style={{ padding: '10px', background: 'rgba(255,0,0,0.1)', borderRadius: '8px', margin: '10px 0' }}>
                    ❌ Track {i + 1}: {track.error}
                  </div>
                );
              }

              const promptObj = analysis.musicPrompts[i];
              const title = track.title || promptObj?.title || `Track ${i + 1}`;

              return (
                <div key={i} style={{ padding: '15px', background: 'rgba(0,255,0,0.1)', borderRadius: '8px', margin: '10px 0', border: '1px solid rgba(0,255,0,0.2)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ flex: 1 }}>
                      <strong>✅ {title}</strong>
                      <span style={{ opacity: 0.7, fontSize: '0.9em', marginLeft: '10px' }}>({track.duration}s {track.duration === 20 ? 'preview' : 'full'})</span>
                      <br />
                      <small style={{ opacity: 0.8 }}>{track.filename}</small>
                    </div>
                    {track.duration === 20 && (
                      <button
                        id={`expand-btn-${i}`}
                        onClick={() => expandTrack(i, promptObj.prompt, title)}
                        className="spotify-btn"
                        style={{ padding: '8px 16px', fontSize: '0.9rem', width: 'auto', marginLeft: '10px' }}
                      >
                        ⏩ Expand to 120s
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => window.location.reload()}
              className="spotify-btn"
              style={{ marginTop: '20px', width: '100%' }}
            >
              🔄 Start Over
            </button>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}
