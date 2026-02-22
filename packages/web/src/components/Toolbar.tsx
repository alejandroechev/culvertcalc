import { SAMPLES } from '../samples';

interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onCalculate: () => void;
  onNew: () => void;
  onPrint: () => void;
  onLoadSample: (id: string) => void;
}

export function Toolbar({ theme, onToggleTheme, onCalculate, onNew, onPrint, onLoadSample }: Props) {
  return (
    <div className="toolbar no-print">
      <h1>🔧 CulvertCalc</h1>
      <div className="toolbar-actions">
        <button onClick={onNew}>New</button>
        <select
          value=""
          onChange={e => { if (e.target.value) onLoadSample(e.target.value); }}
          title="Load a sample dataset"
        >
          <option value="" disabled>📂 Samples</option>
          {SAMPLES.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
        <button className="primary" onClick={onCalculate}>Calculate</button>
        <button onClick={onPrint}>📄 Report</button>
        <button onClick={() => window.open('/intro.html', '_blank')} title="Domain guide">📖 Guide</button>
        <button onClick={() => window.open('https://github.com/alejandroechev/culvertcalc/issues/new', '_blank')} title="Feedback">💬 Feedback</button>
        <button onClick={onToggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>
    </div>
  );
}
