export const getColorCounts = (
	ctx: CanvasRenderingContext2D,
	width: number,
	height: number
) => {
	const imageData = ctx.getImageData(0, 0, width, height).data;
	const colorMap = new Map<string, number>();

	// Process every pixel
	for (let i = 0; i < imageData.length; i += 4) {
		const r = imageData[i];
		const g = imageData[i + 1];
		const b = imageData[i + 2];
		// Convert RGB to hex
		const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b)
			.toString(16)
			.slice(1)}`;
		colorMap.set(hex, (colorMap.get(hex) || 0) + 1);
	}

	// Find the most common color
	let maxCount = 0;
	let dominantColor = '#000000';

	colorMap.forEach((count, color) => {
		if (count > maxCount) {
			maxCount = count;
			dominantColor = color;
		}
	});

	const totalPixels = width * height;
	const percentage = (maxCount / totalPixels) * 100;

	return { dominantColor, percentage };
};
