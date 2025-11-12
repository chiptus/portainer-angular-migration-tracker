import { Summary } from "../types";

interface MigrationProgressProps {
  summary: Summary;
}

export default function MigrationProgress({ summary }: MigrationProgressProps) {
  // Baseline from commit b23c0f25e feat(app): introduce react configurations [EE-1809] (#646)
  const BASELINE_ANGULARJS_TEMPLATES = 391;

  const progressPercent =
    (1 - summary.totalAngularJSTemplates / BASELINE_ANGULARJS_TEMPLATES) * 100;
  const remainingTemplates = summary.totalAngularJSTemplates;

  return (
    <div className="bg-white rounded-xl p-8 mb-8 shadow-xl">
      <h2 className="text-2xl font-bold mb-5 text-gray-800">
        Migration Progress
      </h2>

      <div className="bg-gray-200 rounded-full h-10 overflow-hidden relative">
        <div
          className="bg-linear-to-r from-indigo-600 to-purple-700 h-full flex items-center justify-center text-white font-bold transition-all duration-1000 ease-out"
          style={{ width: `${progressPercent}%` }}
        >
          {progressPercent > 10 &&
            `${progressPercent.toFixed(1)}% Migrated to React`}
        </div>
      </div>

      <p className="mt-4 text-center text-gray-600">
        {remainingTemplates} / {BASELINE_ANGULARJS_TEMPLATES} AngularJS files
        remaining
      </p>
      <p className="mt-2 text-center text-sm text-gray-500">
        ~{summary.totalReactFiles} React components
      </p>
    </div>
  );
}
