import { useState, useCallback, useEffect } from 'react';
import {
  computeDesignPoint, generateRatingCurve,
  type RatingCurveInput, type RatingCurvePoint,
  type ControllingResult, type InletControlResult, type OutletControlResult, type GeometryResult,
  type CulvertDimensions,
} from '@culvertcalc/engine';
import { Toolbar } from './components/Toolbar';
import { InputForm } from './components/InputForm';
import { HWQChart } from './components/HWQChart';
import { ResultsSummary } from './components/ResultsSummary';
import { openReport } from './components/openReport';
import { DEFAULT_FORM, type FormState } from './types';
import { SAMPLES } from './samples';
import './index.css';

function loadTheme(): 'light' | 'dark' {
  try {
    const stored = localStorage.getItem('culvertcalc-theme');
    if (stored === 'dark' || stored === 'light') return stored;
  } catch { /* ignore */ }
  return 'light';
}

export function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [theme, setTheme] = useState<'light' | 'dark'>(loadTheme);
  const [results, setResults] = useState<{
    controlling: ControllingResult;
    inlet: InletControlResult;
    outlet: OutletControlResult;
    geometry: GeometryResult;
    curve: RatingCurvePoint[];
  } | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    try { localStorage.setItem('culvertcalc-theme', theme); } catch { /* ignore */ }
  }, [theme]);

  const buildDimensions = useCallback((f: FormState): CulvertDimensions => {
    if (f.shape === 'circular') return { shape: 'circular', diameter: f.diameter };
    return { shape: f.shape, span: f.span, rise: f.rise };
  }, []);

  const calculate = useCallback(() => {
    try {
      setError(null);
      const input: RatingCurveInput = {
        dimensions: buildDimensions(form),
        inletType: form.inletType,
        material: form.material,
        designQ: form.designQ,
        length: form.length,
        slope: form.slope,
        tailwater: form.tailwater,
      };

      const dp = computeDesignPoint(input);
      const curve = generateRatingCurve(input);

      setResults({
        controlling: dp.controlling,
        inlet: dp.inlet,
        outlet: dp.outlet,
        geometry: dp.geometry,
        curve,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Calculation error');
      setResults(null);
    }
  }, [form, buildDimensions]);

  // Auto-calculate on form change
  useEffect(() => { calculate(); }, [calculate]);

  const handleNew = () => {
    setForm(DEFAULT_FORM);
    setResults(null);
    setError(null);
  };

  const handleLoadSample = useCallback((id: string) => {
    const sample = SAMPLES.find(s => s.id === id);
    if (!sample) return;
    setForm(sample.data);
    setError(null);
  }, []);

  const handleReport = useCallback(() => {
    if (!results) return;
    openReport({
      form,
      controlling: results.controlling,
      geometry: results.geometry,
      curve: results.curve,
    });
  }, [form, results]);

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onNew={handleNew}
        onReport={handleReport}
        onLoadSample={handleLoadSample}
      />

      {error && (
        <div className="card" style={{ borderColor: 'var(--danger)', color: 'var(--danger)' }}>
          ⚠ {error}
        </div>
      )}

      <div className="main-grid">
        <InputForm form={form} onChange={setForm} />

        <div className="results-panel">
          {results && (
            <>
              <ResultsSummary
                controlling={results.controlling}
                inlet={results.inlet}
                outlet={results.outlet}
                geometry={results.geometry}
                designQ={form.designQ}
                curve={results.curve}
              />
              <HWQChart data={results.curve} designQ={form.designQ} />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
