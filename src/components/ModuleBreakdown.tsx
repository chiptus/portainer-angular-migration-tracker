import type { ModuleStats } from "../types";

interface ModuleBreakdownProps {
	byModule: Record<string, ModuleStats>;
}

const MODULE_CONFIG: Record<string, { name: string; order: number }> = {
	docker: { name: "Docker", order: 1 },
	kubernetes: { name: "Kubernetes", order: 2 },
	portainer: { name: "Portainer", order: 3 },
	edge: { name: "Edge", order: 4 },
	azure: { name: "Azure", order: 5 },
	agent: { name: "Agent", order: 6 },
	react: { name: "React", order: 7 },
	".": { name: "Root", order: 8 },
};

export default function ModuleBreakdown({ byModule }: ModuleBreakdownProps) {
	const sortedModules = Object.entries(byModule)
		.filter(([_, stats]) => stats.angularJSFiles > 0 || stats.reactFiles > 0)
		.sort((a, b) => {
			const orderA = MODULE_CONFIG[a[0]]?.order ?? 999;
			const orderB = MODULE_CONFIG[b[0]]?.order ?? 999;
			return orderA - orderB;
		});

	return (
		<div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
			<h2 className="text-2xl font-bold mb-2 text-gray-900">
				Module Breakdown
			</h2>
			<p className="text-gray-600 text-sm mb-6">
				Migration progress by feature module
			</p>

			<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
				{sortedModules.map(([moduleKey, stats]) => {
					const total = stats.angularJSFiles + stats.reactFiles;
					const progressPercent =
						total > 0 ? (stats.reactFiles / total) * 100 : 0;

					return (
						<div
							key={moduleKey}
							className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
						>
							<div className="font-bold text-lg mb-3 text-gray-900">
								{MODULE_CONFIG[moduleKey]?.name || moduleKey}
							</div>

							<div className="space-y-2 mb-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">AngularJS:</span>
									<span className="font-semibold text-red-600">
										{stats.angularJSFiles}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">React:</span>
									<span className="font-semibold text-teal-600">
										{stats.reactFiles}
									</span>
								</div>
							</div>

							<div className="space-y-1">
								<div className="flex justify-between text-xs text-gray-500">
									<span>Progress</span>
									<span className="font-semibold">
										{progressPercent.toFixed(1)}%
									</span>
								</div>
								<div className="bg-gray-200 rounded-full h-2 overflow-hidden">
									<div
										className="bg-teal-500 h-full transition-all duration-500 rounded-full"
										style={{ width: `${progressPercent}%` }}
									/>
								</div>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
