import { HtmlFileChange } from "../types";

interface MostChangedFilesProps {
	files: HtmlFileChange[];
}

export default function MostChangedFiles({ files }: MostChangedFilesProps) {
	if (!files || files.length === 0) {
		return null;
	}

	// Find max commit count for scaling bars
	const maxCommits = Math.max(...files.map((f) => f.commitCount));

	return (
		<div className="bg-white rounded-xl p-8 mb-8 shadow-lg border border-gray-200">
			<h2 className="text-2xl font-bold mb-5 text-gray-900">
				Most Changed HTML Templates
			</h2>
			<p className="text-sm text-gray-900 opacity-70 mb-6">
				Prioritize migrating these frequently-changed templates to reduce merge
				conflicts
			</p>

			<div className="space-y-3">
				{files.map((file, index) => {
					const barWidth = (file.commitCount / maxCommits) * 100;

					return (
						<div key={file.path} className="group">
							<div className="flex items-center justify-between mb-1">
								<div className="flex items-center gap-3 flex-1 min-w-0">
									<span className="text-sm font-semibold text-gray-900 opacity-50 w-6 shrink-0">
										#{index + 1}
									</span>
									<span className="text-sm text-gray-900 truncate font-mono">
										{file.path}
									</span>
								</div>
								<span className="text-sm font-bold text-gray-600 ml-4 shrink-0">
									{file.commitCount} commits
								</span>
							</div>

							<div className="bg-gray-200 rounded-full h-2 overflow-hidden">
								<div
									className="bg-portainer-300 h-full transition-all duration-500 ease-out"
									style={{ width: `${barWidth}%` }}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
