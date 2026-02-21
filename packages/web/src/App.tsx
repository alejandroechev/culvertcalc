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
import { PrintReport } from './components/PrintReport';
import { DEFAULT_FORM, type FormState } from './types';
import './index.css';

export function App() {
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
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

  // Auto-calculate on mount
  useEffect(() => { calculate(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleNew = () => {
    setForm(DEFAULT_FORM);
    setResults(null);
    setError(null);
  };

  return (
    <div className="app">
      <Toolbar
        theme={theme}
        onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
        onCalculate={calculate}
        onNew={handleNew}
        onPrint={() => window.print()}
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
              />
              <HWQChart data={results.curve} designQ={form.designQ} />
            </>
          )}
        </div>
      </div>

      {results && (
        <PrintReport
          form={form}
          controlling={results.controlling}
          geometry={results.geometry}
          curve={results.curve}
        />
      )}
    </div>
  );
}
