import { Link } from 'react-router-dom';

type FooterLinkProps = {
	to: string;
	text: string;
};

const FooterLink = ({ to, text }: FooterLinkProps) => {
	return (
		<Link
			to={to}
			className="hover:underline md:hover:no-underline md:border-b-2 border-transparent hover:border-white transition-all ease-in-out"
		>
			{text}
		</Link>
	);
};

export default FooterLink;
