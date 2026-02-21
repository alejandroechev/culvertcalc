import type { FormState } from '../types';
import type { CulvertShape, InletType, PipeMaterial } from '@culvertcalc/engine';
import { MANNINGS_N } from '@culvertcalc/engine';
import { CrossSection } from './CrossSection';

interface Props {
  form: FormState;
  onChange: (f: FormState) => void;
}

export function InputForm({ form, onChange }: Props) {
  const set = <K extends keyof FormState>(key: K, val: FormState[K]) =>
    onChange({ ...form, [key]: val });

  const setNum = (key: keyof FormState, val: string) => {
    const n = parseFloat(val);
    if (!isNaN(n)) set(key, n as FormState[typeof key]);
  };

  return (
    <div className="sidebar">
      <div className="card">
        <h2>Culvert Geometry</h2>
        <div className="form-group">
          <label>Shape</label>
          <select value={form.shape}
            onChange={e => set('shape', e.target.value as CulvertShape)}>
            <option value="circular">Circular</option>
            <option value="rectangular">Rectangular (Box)</option>
            <option value="elliptical">Elliptical</option>
          </select>
        </div>

        {form.shape === 'circular' ? (
          <div className="form-group">
            <label>Diameter (ft)</label>
            <input type="number" step="0.25" min="0.5" value={form.diameter}
              onChange={e => setNum('diameter', e.target.value)} />
          </div>
        ) : (
          <div className="form-row">
            <div className="form-group">
              <label>Span (ft)</label>
              <input type="number" step="0.25" min="0.5" value={form.span}
                onChange={e => setNum('span', e.target.value)} />
            </div>
            <div className="form-group">
              <label>Rise (ft)</label>
              <input type="number" step="0.25" min="0.5" value={form.rise}
                onChange={e => setNum('rise', e.target.value)} />
            </div>
          </div>
        )}

        <CrossSection shape={form.shape}
          dim1={form.shape === 'circular' ? form.diameter : form.span}
          dim2={form.rise} />

        <div className="form-group">
          <label>Inlet Type</label>
          <select value={form.inletType}
            onChange={e => set('inletType', e.target.value as InletType)}>
            <option value="headwall">Headwall</option>
            <option value="mitered">Mitered to slope</option>
            <option value="projecting">Projecting</option>
          </select>
        </div>

        <div className="form-group">
          <label>Material (Manning's n = {MANNINGS_N[form.material]})</label>
          <select value={form.material}
            onChange={e => set('material', e.target.value as PipeMaterial)}>
            <option value="concrete">Concrete (n=0.012)</option>
            <option value="cmp">CMP (n=0.024)</option>
            <option value="hdpe">HDPE (n=0.012)</option>
            <option value="pvc">PVC (n=0.009)</option>
            <option value="steel">Steel (n=0.012)</option>
          </select>
        </div>
      </div>

      <div className="card">
        <h2>Flow & Hydraulics</h2>
        <div className="form-group">
          <label>Design Flow Q (cfs)</label>
          <input type="number" step="5" min="1" value={form.designQ}
            onChange={e => setNum('designQ', e.target.value)} />
        </div>
        <div className="form-group">
          <label>Tailwater Depth (ft)</label>
          <input type="number" step="0.5" min="0" value={form.tailwater}
            onChange={e => setNum('tailwater', e.target.value)} />
        </div>
        <div className="form-row">
          <div className="form-group">
            <label>Length (ft)</label>
            <input type="number" step="10" min="10" value={form.length}
              onChange={e => setNum('length', e.target.value)} />
          </div>
          <div className="form-group">
            <label>Slope (ft/ft)</label>
            <input type="number" step="0.005" min="0.001" value={form.slope}
              onChange={e => setNum('slope', e.target.value)} />
          </div>
        </div>
      </div>
    </div>
  );
}
