export interface FilePatterns {
	controllerFile?: boolean;
	serviceFile?: boolean;
	directiveFile?: boolean;
	angularImport?: boolean;
	components?: number;
	directives?: number;
	controllers?: number;
	services?: number;
	factories?: number;
	filters?: number;
	ngInject?: number;
}

export interface FileData {
	path: string;
	patterns: FilePatterns;
}

export interface Summary {
	totalAngularJSTemplates: number;
	totalAngularJSFiles: number;
	totalReactFiles: number;
	controllerFiles: number;
	serviceFiles: number;
	directiveFiles: number;
	componentRegistrations: number;
	directiveRegistrations: number;
	controllerRegistrations: number;
	serviceRegistrations: number;
	factoryRegistrations: number;
	filterRegistrations: number;
	ngInjectAnnotations: number;
	filesWithAngularImport: number;
}

export interface HtmlFileChange {
	path: string;
	commitCount: number;
}

export interface Results {
	timestamp: string;
	source: "local" | "github";
	summary: Summary;
	byDirectory: Record<string, number>;
	files: FileData[];
	mostChangedHtmlFiles?: HtmlFileChange[];
}
