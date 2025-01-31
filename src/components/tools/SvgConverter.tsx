import React, { useState, useRef } from 'react';
import Button from '../Atoms/Button';
import ToolCard from '../ToolCard';
import { MdUpload } from 'react-icons/md';
import NumberInput from '../Atoms/NumberInput';
import InputGrid from '../InputGrid';
import { useTranslation } from 'react-i18next';

type SvgConverterProps = {
	isActive: boolean;
};

const SvgConverter = ({ isActive }: SvgConverterProps) => {
	if (!isActive) return null;

	const [svgFile, setSvgFile] = useState<File | null>(null);
	const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
	const [backgroundColor, setBackgroundColor] = useState('#ffffff');
	const [isTransparent, setIsTransparent] = useState(false);
	const [isConverting, setIsConverting] = useState(false);
	const canvasRef = useRef<HTMLCanvasElement>(null);
	const [t] = useTranslation('global');

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0];
		if (file && file.type === 'image/svg+xml') {
			setSvgFile(file);
		}
	};

	const convertSvgToPng = async () => {
		if (!svgFile || !canvasRef.current) return;

		setIsConverting(true);
		try {
			// 1. Load SVG file
			const svgText = await svgFile.text();
			const parser = new DOMParser();
			const svgDoc = parser.parseFromString(svgText, 'image/svg+xml');
			const svgElement = svgDoc.documentElement;

			// 2. Create image from SVG
			const img = new Image();
			const svgBlob = new Blob([svgText], { type: 'image/svg+xml' });
			const url = URL.createObjectURL(svgBlob);

			img.onload = () => {
				// 3. Draw to canvas
				const canvas = canvasRef.current!;
				const ctx = canvas.getContext('2d')!;

				// Set canvas dimensions
				canvas.width = dimensions.width;
				canvas.height = dimensions.height;

				// Clear canvas and set background if not transparent
				ctx.clearRect(0, 0, canvas.width, canvas.height);
				if (!isTransparent) {
					ctx.fillStyle = backgroundColor;
					ctx.fillRect(0, 0, canvas.width, canvas.height);
				}

				// Calculate scaling to fit the SVG
				const scale = Math.min(
					dimensions.width / img.width,
					dimensions.height / img.height
				);
				const x = (dimensions.width - img.width * scale) / 2;
				const y = (dimensions.height - img.height * scale) / 2;

				// Draw SVG
				ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

				// 4. Convert to PNG
				const pngUrl = canvas.toDataURL('image/png');

				// 5. Trigger download
				const link = document.createElement('a');
				link.download = svgFile.name.replace('.svg', '.png');
				link.href = pngUrl;
				link.click();

				URL.revokeObjectURL(url);
				setIsConverting(false);
			};

			img.src = url;
		} catch (error) {
			console.error('Error converting SVG:', error);
			setIsConverting(false);
		}
	};

	const handleWidthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDimensions((prev) => ({
			...prev,
			width: parseInt(e.target.value) || 0,
		}));
	};

	const handleHeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setDimensions((prev) => ({
			...prev,
			height: parseInt(e.target.value) || 0,
		}));
	};

	return (
		<ToolCard>
			<div className="p-6 space-y-6">
				<h2 className="text-xl font-semibold">
					{t('SvgConverter.title')}
				</h2>
				<p>{t('SvgConverter.description')}</p>

				<div className="space-y-4">
					<div>
						<label htmlFor="svg-upload" className="block mb-2">
							{t('SvgConverter.labelUpload')}
						</label>
						<div className="flex items-center space-x-4">
							<Button
								onClick={() =>
									document
										.getElementById('svg-upload')
										?.click()
								}
								className="w-full flex justify-center items-center"
							>
								<MdUpload className="w-4 h-4 mr-2" />
								{t('SvgConverter.btnUpload')}
							</Button>
							<input
								id="svg-upload"
								type="file"
								accept=".svg"
								className="hidden"
								onChange={handleFileChange}
							/>
						</div>
					</div>

					<InputGrid>
						<NumberInput
							label={t('SvgConverter.dimensions.dimWidth')}
							value={dimensions.width}
							onChange={(e) => handleWidthChange(e)}
						/>
						<NumberInput
							label={t('SvgConverter.dimensions.dimHeight')}
							value={dimensions.height}
							onChange={(e) => handleHeightChange(e)}
						/>
					</InputGrid>

					<div className="flex items-center space-x-4">
						<div className="flex items-center">
							<input
								type="checkbox"
								id="transparent"
								checked={isTransparent}
								onChange={(e) =>
									setIsTransparent(e.target.checked)
								}
								className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
							/>
							<label htmlFor="transparent" className="ml-2 block">
								{t('SvgConverter.btnTransBackground')}
							</label>
						</div>
					</div>

					{!isTransparent && (
						<div>
							<label className="block">
								{t('SvgConverter.labelBackgroundColor')}
							</label>
							<input
								type="color"
								value={backgroundColor}
								onChange={(e) =>
									setBackgroundColor(e.target.value)
								}
								className="w-full h-10 cursor-pointer rounded-md border"
								disabled={isTransparent}
							/>
						</div>
					)}

					<Button
						onClick={convertSvgToPng}
						disabled={!svgFile || isConverting}
						className="w-full flex items-center justify-center disabled:cursor-not-allowed"
					>
						{isConverting
							? t('SvgConverter.btnDownload.stateProcessing')
							: t('SvgConverter.btnDownload.stateDownload')}
					</Button>
				</div>

				<canvas ref={canvasRef} style={{ display: 'none' }} />
			</div>
		</ToolCard>
	);
};

export default SvgConverter;
