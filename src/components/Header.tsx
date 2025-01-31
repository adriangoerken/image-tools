import { useState } from 'react';
import { MdMenu, MdClose } from 'react-icons/md';
import Container from './Container';
import { Tool } from '../lib/type';

interface HeaderProps {
	activeTool: string;
	setActiveTool: (id: string) => void;
	tools: Tool[];
}

const Header = ({ activeTool, setActiveTool, tools }: HeaderProps) => {
	const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

	const toggleMobileMenu = () => {
		setIsMobileMenuOpen(!isMobileMenuOpen);
	};

	return (
		<header>
			<Container>
				<div className="flex justify-between">
					<div className="flex-shrink-0 flex items-center">
						<h1 className="text-2xl font-bold">Image Tools</h1>
					</div>

					{/* Desktop navigation */}
					<nav className="hidden md:flex gap-6">
						{tools.map((tool) => (
							<button
								key={tool.id}
								onClick={() => setActiveTool(tool.id)}
								className={`inline-flex items-center p-2 border-b-2 hover:border-green-800 transition-all ease-in-out ${
									activeTool === tool.id
										? 'border-green-700'
										: 'border-transparent'
								}`}
							>
								<tool.icon className="h-4 w-4 mr-2" />
								{tool.name}
							</button>
						))}
					</nav>

					{/* Mobile menu button */}
					<div className="md:hidden flex items-center">
						<button
							onClick={toggleMobileMenu}
							className="focus:outline-none"
						>
							{isMobileMenuOpen ? (
								<MdClose className="h-6 w-6" />
							) : (
								<MdMenu className="h-6 w-6" />
							)}
						</button>
					</div>
				</div>

				{/* Mobile navigation */}
				{isMobileMenuOpen && (
					<nav className="md:hidden">
						<div className="flex flex-col items-center gap-2 mt-4">
							{tools.map((tool) => (
								<button
									key={tool.id}
									onClick={() => {
										setActiveTool(tool.id);
										setIsMobileMenuOpen(false);
									}}
									className={`inline-flex items-center px-3 py-2 ${
										activeTool === tool.id
											? 'text-green-700'
											: ''
									}`}
								>
									<tool.icon className="h-4 w-4 mr-2" />
									{tool.name}
								</button>
							))}
						</div>
					</nav>
				)}
			</Container>
		</header>
	);
};

export default Header;
