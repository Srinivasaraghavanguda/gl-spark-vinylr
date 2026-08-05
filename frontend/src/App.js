import React from 'react';

function App() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center p-6">
      <div className="p-8 rounded-2xl bg-slate-900 border border-cyan-500/30 shadow-2xl shadow-cyan-500/20 text-center max-w-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-400 to-indigo-500 bg-clip-text text-transparent mb-3">
          Tailwind is Active!
        </h1>
        <p className="text-slate-400 text-sm">
          Your high-fidelity workspace is ready for the VinylR blueprint.
        </p>
      </div>
    </div>
  );
}

export default App;
