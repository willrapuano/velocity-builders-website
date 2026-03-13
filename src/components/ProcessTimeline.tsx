type Step = { title: string; description: string };
type ProcessTimelineProps = { steps: Step[] };

export function ProcessTimeline({ steps }: ProcessTimelineProps) {
  return (
    <ol className="relative space-y-8 border-l-2 border-blue-200 pl-6">
      {steps.map((step, index) => (
        <li key={step.title} className="space-y-2">
          <span className="absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white">
            {index + 1}
          </span>
          <h4 className="text-xl font-bold text-gray-900">{step.title}</h4>
          <p className="text-sm text-gray-600">{step.description}</p>
        </li>
      ))}
    </ol>
  );
}
