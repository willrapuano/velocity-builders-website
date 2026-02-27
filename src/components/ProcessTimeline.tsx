type Step = {
  title: string;
  description: string;
};

type ProcessTimelineProps = {
  steps: Step[];
};

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className="relative space-y-8 border-l border-white/10 pl-6">
      {steps.map((step, index) => (
        <li key={step.title} className="space-y-2">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-emerald-400 text-sm font-semibold text-slate-900">
            {index + 1}
          </span>
          <h4 className="text-xl font-semibold text-white">{step.title}</h4>
          <p className="text-sm text-slate-300">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
