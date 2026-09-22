export function ToolHowTo({ steps }: { steps: string[] }) {
  return <ol className="step-list">{steps.map((step, index) => <li className="step" key={step}><span className="step-number">0{index + 1}</span><p>{step}</p></li>)}</ol>;
}