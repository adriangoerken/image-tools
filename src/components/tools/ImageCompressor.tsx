// components/ImageCompressor.tsx
import React, { useState, useRef, useCallback } from 'react';
import { MdUpload, MdDownload, MdInfo } from 'react-icons/md';
import Button from '../Atoms/Button';
import ToolCard from '../ToolCard';
import InputGrid from '../InputGrid';
import Select from '../Atoms/Select';
import { useTranslation } from 'react-i18next';

type ImageCompressorProps = {
	isActive: boolean;
};

type CompressionOptions = {
	quality: number;
	maxWidth?: number;
	maxHeight?: number;
	preserveAspectRatio: boolean;
	format: 'jpeg' | 'webp' | 'png';
	compressionStrategy: 'balanced' | 'quality' | 'size';
	smoothing: boolean;
};

type ProcessedImage = {
	url: string;
	originalSize: number;
	compressedSize: number;
	width: number;
	height: number;
};

const formatFileSize = (bytes: number): string => {
	if (bytes === 0) return '0 Bytes';
	const k = 1024;
	const sizes = ['Bytes', 'KB', 'MB'];
	const i = Math.floor(Math.log(bytes) / Math.log(k));
	return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

const getImageSize = async (url: string): Promise<number> => {
	const response = await fetch(url);
	const blob = await response.blob();
	return blob.size;
};

const ImageCompressor = ({ isActive }: ImageCompressorProps) => {
	if (!isActive) return null;

	const [t] = useTranslation('global');

	const [isProcessing, setIsProcessing] = useState(false);
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [processedImage, setProcessedImage] = useState<ProcessedImage | null>(
		null
	);
	const [options, setOptions] = useState<CompressionOptions>({
		quality: 0.8,
		preserveAspectRatio: true,
		format: 'webp',
		compressionStrategy: 'balanced',
		smoothing: true,
	});
	const canvasRef = useRef<HTMLCanvasElement>(null);

	const applyImageOptimizations = (ctx: CanvasRenderingContext2D) => {
		// Apply different optimization strategies based on selected option
		switch (options.compressionStrategy) {
			case 'quality':
				// Optimize for quality: Use better interpolation
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = 'high';
				break;
			case 'size':
				// Optimize for size: Use basic interpolation
				ctx.imageSmoothingEnabled = options.smoothing;
				ctx.imageSmoothingQuality = 'low';
				break;
			case 'balanced':
			default:
				// Balanced approach
				ctx.imageSmoothingEnabled = options.smoothing;
				ctx.imageSmoothingQuality = 'medium';
				break;
		}
	};

	const compressImage = useCallback(
		async (
			imageUrl: string,
			options: CompressionOptions
		): Promise<ProcessedImage> => {
			return new Promise((resolve, reject) => {
				const img = new Image();
				img.onload = async () => {
					const canvas = canvasRef.current;
					if (!canvas)
						return reject(new Error('Canvas not available'));

					const ctx = canvas.getContext('2d');
					if (!ctx)
						return reject(
							new Error('Canvas context not available')
						);

					// Calculate new dimensions with improved downscaling
					let newWidth = img.width;
					let newHeight = img.height;

					if (options.maxWidth && img.width > options.maxWidth) {
						newWidth = options.maxWidth;
						if (options.preserveAspectRatio) {
							newHeight =
								(img.height * options.maxWidth) / img.width;
						}
					}

					if (options.maxHeight && newHeight > options.maxHeight) {
						newHeight = options.maxHeight;
						if (options.preserveAspectRatio) {
							newWidth =
								(newWidth * options.maxHeight) / newHeight;
						}
					}

					// For large images, use stepped downscaling for better quality
					if (img.width > newWidth * 2) {
						const steps = Math.ceil(
							Math.log2(img.width / newWidth)
						);
						let stepWidth = img.width;
						let stepHeight = img.height;

						// Create temporary canvas for stepped downscaling
						const tempCanvas = document.createElement('canvas');
						const tempCtx = tempCanvas.getContext('2d');
						if (!tempCtx)
							return reject(
								new Error(
									'Temporary canvas context not available'
								)
							);

						for (let i = 0; i < steps; i++) {
							stepWidth = Math.floor(stepWidth / 2);
							stepHeight = Math.floor(stepHeight / 2);

							tempCanvas.width = stepWidth;
							tempCanvas.height = stepHeight;

							applyImageOptimizations(tempCtx);

							if (i === 0) {
								tempCtx.drawImage(
									img,
									0,
									0,
									stepWidth,
									stepHeight
								);
							} else {
								tempCtx.drawImage(
									canvas,
									0,
									0,
									stepWidth,
									stepHeight
								);
							}

							canvas.width = stepWidth;
							canvas.height = stepHeight;
							ctx.drawImage(
								tempCanvas,
								0,
								0,
								stepWidth,
								stepHeight
							);
						}
					}

					// Final resize to exact dimensions
					canvas.width = newWidth;
					canvas.height = newHeight;
					applyImageOptimizations(ctx);
					ctx.drawImage(img, 0, 0, newWidth, newHeight);

					// Determine output format and quality
					let outputFormat: string;
					let outputQuality = options.quality;

					switch (options.format) {
						case 'webp':
							outputFormat = 'image/webp';
							break;
						case 'png':
							outputFormat = 'image/png';
							outputQuality = 1; // PNG is lossless
							break;
						default:
							outputFormat = 'image/jpeg';
					}

					// Get compressed image URL
					const compressedUrl = canvas.toDataURL(
						outputFormat,
						outputQuality
					);

					// Get file sizes
					const originalSize = await getImageSize(imageUrl);
					const compressedSize = await getImageSize(compressedUrl);

					resolve({
						url: compressedUrl,
						originalSize,
						compressedSize,
						width: newWidth,
						height: newHeight,
					});
				};

				img.onerror = () => reject(new Error('Failed to load image'));
				img.src = imageUrl;
			});
		},
		[options.compressionStrategy, options.smoothing]
	);

	const handleImageUpload = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const file = e.target.files?.[0];
		if (!file) return;

		setIsProcessing(true);
		try {
			const reader = new FileReader();
			reader.onload = async (e) => {
				const imageUrl = e.target?.result as string;
				setOriginalImage(imageUrl);

				const processed = await compressImage(imageUrl, options);
				setProcessedImage(processed);
			};
			reader.readAsDataURL(file);
		} catch (error) {
			console.error('Error processing image:', error);
		} finally {
			setIsProcessing(false);
		}
	};

	const handleQualityChange = async (
		e: React.ChangeEvent<HTMLInputElement>
	) => {
		const quality = Number(e.target.value) / 100;
		setOptions((prev) => ({ ...prev, quality }));

		if (originalImage) {
			setIsProcessing(true);
			try {
				const processed = await compressImage(originalImage, {
					...options,
					quality,
				});
				setProcessedImage(processed);
			} catch (error) {
				console.error('Error updating compression:', error);
			} finally {
				setIsProcessing(false);
			}
		}
	};

	const handleDownload = () => {
		if (processedImage) {
			const link = document.createElement('a');
			link.download = 'compressed-image.jpg';
			link.href = processedImage.url;
			link.click();
		}
	};

	const handleFormatChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setOptions((prev) => ({
			...prev,
			format: e.target.value as 'jpeg' | 'webp' | 'png',
		}));
	};

	const handleStrategyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		setOptions((prev) => ({
			...prev,
			compressionStrategy: e.target.value as
				| 'balanced'
				| 'quality'
				| 'size',
		}));
	};

	const formatOptions = [
		{
			value: 'webp',
			label: t('ImageCompressor.format.selectOptions.optWebP'),
		},
		{ value: 'jpeg', label: 'JPEG' },
		{
			value: 'png',
			label: t('ImageCompressor.format.selectOptions.optPNG'),
		},
	];

	const strategyOptions = [
		{
			value: 'balanced',
			label: t('ImageCompressor.compression.selectOptions.optBalanced'),
		},
		{
			value: 'quality',
			label: t('ImageCompressor.compression.selectOptions.optQuality'),
		},
		{
			value: 'size',
			label: t('ImageCompressor.compression.selectOptions.optSize'),
		},
	];

	return (
		<ToolCard>
			<div className="p-6 space-y-6">
				<div>
					<h2 className="text-xl font-semibold">
						{t('ImageCompressor.title')}
					</h2>
					<p className="mt-1">{t('ImageCompressor.description')}</p>
				</div>

				<div className="space-y-4">
					<div>
						<label htmlFor="image-upload" className="block mb-2">
							{t('ImageCompressor.labelUpload')}
						</label>
						<div className="flex items-center space-x-4">
							<Button
								onClick={() =>
									document
										.getElementById('image-upload')
										?.click()
								}
								className="w-full flex justify-center items-center"
								disabled={isProcessing}
							>
								<MdUpload className="w-4 h-4 mr-2" />
								{isProcessing
									? t(
											'ImageCompressor.btnUpload.stateProcessing'
									  )
									: t(
											'ImageCompressor.btnUpload.stateUpload'
									  )}
							</Button>
							<input
								id="image-upload"
								type="file"
								accept="image/*"
								className="hidden"
								onChange={handleImageUpload}
								disabled={isProcessing}
							/>
						</div>
					</div>

					<InputGrid>
						<Select
							label="Format"
							value={options.format}
							onChange={(e) => handleFormatChange(e)}
							options={formatOptions}
						/>

						<Select
							label="Compression Strategy"
							value={options.compressionStrategy}
							onChange={(e) => handleStrategyChange(e)}
							options={strategyOptions}
						/>
					</InputGrid>
					<div className="flex items-center">
						<input
							type="checkbox"
							id="smoothing"
							checked={options.smoothing}
							onChange={(e) =>
								setOptions((prev) => ({
									...prev,
									smoothing: e.target.checked,
								}))
							}
							className="h-4 w-4 rounded accent-green-700"
						/>
						<label htmlFor="smoothing" className="ml-2 block">
							{t('ImageCompressor.btnSmoothing')}
						</label>
					</div>

					{originalImage && (
						<div className="space-y-4">
							<div>
								<label htmlFor="quality" className="block mb-2">
									{t('ImageCompressor.quality')} (
									{Math.round(options.quality * 100)}
									%)
								</label>
								<input
									type="range"
									id="quality"
									min="1"
									max="100"
									value={options.quality * 100}
									onChange={handleQualityChange}
									className="w-full h-2 bg-elevation-100 border rounded-lg appearance-none cursor-pointer"
								/>
							</div>

							{processedImage && (
								<div className="rounded-lg bg-elevation-100 border p-4">
									<div className="flex">
										<div className="flex-shrink-0">
											<MdInfo className="h-5 w-5 text-green-700" />
										</div>
										<div className="ml-3 flex-1 md:flex md:justify-between">
											<div className="space-y-1">
												<p>
													{t(
														'ImageCompressor.infos.infoOriginalSize'
													)}
													{formatFileSize(
														processedImage.originalSize
													)}
												</p>
												<p>
													{t(
														'ImageCompressor.infos.infoCompressedSize'
													)}
													{formatFileSize(
														processedImage.compressedSize
													)}
												</p>
												<p>
													{t(
														'ImageCompressor.infos.infoDimensions'
													)}
													{processedImage.width}×
													{processedImage.height}px
												</p>
												<p>
													{t(
														'ImageCompressor.infos.infoSavings'
													)}
													{Math.round(
														(1 -
															processedImage.compressedSize /
																processedImage.originalSize) *
															100
													)}
													%
												</p>
											</div>
										</div>
									</div>
								</div>
							)}

							<div className="grid grid-cols-2 gap-4">
								<div className="space-y-2">
									<div>Original</div>
									<div className="border rounded-lg overflow-hidden bg-gray-100">
										<img
											src={originalImage}
											alt="Original"
											className="w-full h-auto"
										/>
									</div>
								</div>
								{processedImage && (
									<div className="space-y-2">
										<div>
											{t(
												'ImageCompressor.labelCompressed'
											)}
										</div>
										<div className="border rounded-lg overflow-hidden bg-gray-100">
											<img
												src={processedImage.url}
												alt="Compressed"
												className="w-full h-auto"
											/>
										</div>
									</div>
								)}
							</div>

							{processedImage && (
								<Button
									onClick={handleDownload}
									className="w-full flex items-center justify-center"
								>
									<MdDownload className="w-4 h-4 mr-2" />
									{t('ImageCompressor.btnDownload')}
								</Button>
							)}
						</div>
					)}

					<canvas ref={canvasRef} className="hidden" />
				</div>
			</div>
		</ToolCard>
	);
};

export default ImageCompressor;
