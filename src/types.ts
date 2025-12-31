export interface ModuleStats {
	angularJSFiles: number;
	reactFiles: number;
}

export interface Summary {
	totalAngularJSTemplates: number;
	totalReactFiles: number;
}

export interface HtmlFileChange {
	path: string;
	commitCount: number;
}

export interface HistorySnapshot {
	timestamp: string;
	angularJSTemplates: number;
	reactFiles: number;
}

export interface HistoryData {
	version: string;
	generated: string;
	baseline: number;
	snapshots: HistorySnapshot[];
}

export interface Results {
	timestamp: string;
	source: "local" | "github";
	summary: Summary;
	byModule: Record<string, ModuleStats>;
	mostChangedHtmlFiles?: HtmlFileChange[];
}
