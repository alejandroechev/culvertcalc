interface Props {
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  onCalculate: () => void;
  onNew: () => void;
  onPrint: () => void;
}

export function Toolbar({ theme, onToggleTheme, onCalculate, onNew, onPrint }: Props) {
  return (
    <div className="toolbar no-print">
      <h1>🔧 CulvertCalc</h1>
      <div className="toolbar-actions">
        <button onClick={onNew}>New</button>
        <button className="primary" onClick={onCalculate}>Calculate</button>
        <button onClick={onPrint}>📄 Report</button>
        <button onClick={onToggleTheme}>{theme === 'light' ? '🌙' : '☀️'}</button>
      </div>
    </div>
  );
}
