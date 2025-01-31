export type ProcessedImage = {
	originalUrl: string;
	processedUrl: string;
	filename: string;
	processedAt: Date;
};

export type Tool = {
	id: string;
	name: string;
	icon: React.FC<{ className?: string }>;
	component: React.FC<{ isActive: boolean }>;
};
