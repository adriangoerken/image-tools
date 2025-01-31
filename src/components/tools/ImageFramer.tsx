import React, { useState, useRef, useCallback, useEffect } from 'react';
import { MdUpload, MdDownload } from 'react-icons/md';
import debounce from 'lodash/debounce';
import { getColorCounts } from '../../utils/colorAnalysis';
import Button from '../Atoms/Button';
import ToolCard from '../ToolCard';
import { useTranslation } from 'react-i18next';

type ImageFramerProps = {
	isActive: boolean;
};

type ImageDimensions = {
	width: number;
	height: number;
};

const ImageFramer = ({ isActive }: ImageFramerProps) => {
	if (!isActive) return null;

	const [image, setImage] = useState<HTMLImageElement | null>(null);
	const [frameColor, setFrameColor] = useState('#000000');
	const [preview, setPreview] = useState<string | null>(null);
	const [dimensions, setDimensions] = useState<ImageDimensions | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [dominantColor, setDominantColor] = useState<string | null>(null);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const tempCanvasRef = useRef<HTMLCanvasElement>(null);
	const [t] = useTranslation('global');

	const generatePreview = useCallback(
		(img: HTMLImageElement, color: string) => {
			const canvas = canvasRef.current;
			if (!canvas) return;

			const ctx = canvas.getContext('2d');
			if (!ctx) return;

			const maxDimension = Math.max(img.width, img.height);
			canvas.width = maxDimension;
			canvas.height = maxDimension;

			ctx.fillStyle = color;
			ctx.fillRect(0, 0, canvas.width, canvas.height);

			const x = (maxDimension - img.width) / 2;
			const y = (maxDimension - img.height) / 2;

			ctx.drawImage(img, x, y);
			setPreview(canvas.toDataURL('image/png'));
		},
		[]
	);

	// Debounced version of generatePreview for color picker
	const debouncedGeneratePreview = useCallback(
		debounce((img: HTMLImageElement, color: string) => {
			generatePreview(img, color);
		}, 50),
		[]
	);

	const analyzeImageColors = (img: HTMLImageElement) => {
		const canvas = tempCanvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		// Set canvas to image dimensions
		canvas.width = img.width;
		canvas.height = img.height;

		// Draw image to analyze
		ctx.drawImage(img, 0, 0);

		// Get dominant color
		const { dominantColor, percentage } = getColorCounts(
			ctx,
			img.width,
			img.height
		);

		// Only set as frame color if it's a significant portion of the image
		if (percentage > 30) {
			const newColor = dominantColor;
			setDominantColor(newColor);
			setFrameColor(newColor);
			if (img) {
				generatePreview(img, newColor);
			}
		}
	};

	const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			setIsProcessing(true);
			const reader = new FileReader();
			reader.onload = (e) => {
				const img = new Image();
				img.onload = () => {
					setImage(img);
					setDimensions({ width: img.width, height: img.height });
					analyzeImageColors(img);
					setIsProcessing(false);
				};
				img.src = e.target?.result as string;
			};
			reader.readAsDataURL(file);
		}
	};

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newColor = e.target.value;
		setFrameColor(newColor);
		if (image) {
			debouncedGeneratePreview(image, newColor);
		}
	};

	const handleDownload = () => {
		if (preview) {
			const link = document.createElement('a');
			link.download = 'framed-image.png';
			link.href = preview;
			link.click();
		}
	};

	// Cleanup debounce on unmount
	useEffect(() => {
		return () => {
			debouncedGeneratePreview.cancel();
		};
	}, [debouncedGeneratePreview]);

	return (
		<ToolCard>
			<div className="p-6 space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-xl font-semibold">Image Framer</h2>
						<p className="mt-1">{t('ImageFramer.description')}</p>
					</div>
					{dimensions && (
						<div className="text-sm">
							Original: {dimensions.width}×{dimensions.height}px
						</div>
					)}
				</div>

				<div className="space-y-4">
					<div>
						<label htmlFor="image-upload" className="block mb-2">
							{t('ImageFramer.labelUpload')}
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
									? t('ImageFramer.btnUpload.stateProcessing')
									: t('ImageFramer.btnUpload.stateUpload')}
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

					{image && (
						<div>
							<label htmlFor="frame-color" className="block mb-2">
								{t('ImageFramer.frameColor1')}
								{dominantColor && t('ImageFramer.frameColor2')}
							</label>
							<input
								id="frame-color"
								type="color"
								value={frameColor}
								onChange={handleColorChange}
								className="w-full h-10 cursor-pointer rounded-md border"
							/>
						</div>
					)}

					{preview && (
						<div className="space-y-4">
							<div className="border rounded-lg overflow-hidden">
								<img
									src={preview}
									alt="Preview"
									className="w-full h-auto"
								/>
							</div>

							<Button
								onClick={handleDownload}
								className="w-full flex items-center justify-center"
							>
								<MdDownload className="w-4 h-4 mr-2" />
								{t('ImageFramer.btnDownload')}
							</Button>
						</div>
					)}

					<canvas ref={canvasRef} className="hidden" />
					<canvas ref={tempCanvasRef} className="hidden" />
				</div>
			</div>
		</ToolCard>
	);
};

export default ImageFramer;
