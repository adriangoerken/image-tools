import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { Tool } from '../lib/type';
import Container from '../components/Container';

interface ContextType {
	activeTool: string;
	tools: Tool[];
}

const IndexPage: React.FC = () => {
	const { activeTool, tools } = useOutletContext<ContextType>();

	return (
		<main>
			<Container>
				{tools.map((tool) => (
					<tool.component
						key={tool.id}
						isActive={activeTool === tool.id}
					/>
				))}
			</Container>
		</main>
	);
};

export default IndexPage;
