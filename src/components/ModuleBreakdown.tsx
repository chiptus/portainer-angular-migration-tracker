import type { ModuleStats } from "../types";

interface ModuleBreakdownProps {
	byModule: Record<string, ModuleStats>;
}

const TARGET_MODULES = [
	"docker",
	"kubernetes",
	"portainer",
	"edge",
	"azure",
	"agent",
];

const MODULE_DISPLAY_NAMES: Record<string, string> = {
	docker: "Docker",
	kubernetes: "Kubernetes",
	portainer: "Portainer",
	edge: "Edge",
	azure: "Azure",
	agent: "Agent",
};

export default function ModuleBreakdown({ byModule }: ModuleBreakdownProps) {
	console.log({ byModule });
	const moduleCards = TARGET_MODULES.map((moduleKey) => {
		// Get AngularJS stats from app/{module}
		const angularStats = byModule[moduleKey] || {
			angularJSFiles: 0,
			reactFiles: 0,
		};

		// Get React stats from app/react/{module}
		const reactStats = byModule[`react/${moduleKey}`] || {
			angularJSFiles: 0,
			reactFiles: 0,
		};

		return {
			name: MODULE_DISPLAY_NAMES[moduleKey],
			angularJS: angularStats.angularJSFiles,
			react: reactStats.reactFiles,
			total: angularStats.angularJSFiles + reactStats.reactFiles,
		};
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
				{moduleCards.map((module) => {
					const progressPercent =
						module.total > 0 ? (module.react / module.total) * 100 : 0;

					return (
						<div
							key={module.name}
							className="bg-gray-50 rounded-lg p-5 border border-gray-200 hover:shadow-md transition-shadow"
						>
							<div className="font-bold text-lg mb-3 text-gray-900">
								{module.name}
							</div>

							<div className="space-y-2 mb-3">
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">AngularJS:</span>
									<span className="font-semibold text-red-600">
										{module.angularJS}
									</span>
								</div>
								<div className="flex justify-between text-sm">
									<span className="text-gray-600">React:</span>
									<span className="font-semibold text-teal-600">
										{module.react}
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
