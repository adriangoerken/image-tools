interface ExtendedNavigator extends Navigator {
	userLanguage?: string;
	browserLanguage?: string;
}

export const getLanguage = () => {
	const extendedNavigator = navigator as ExtendedNavigator;
	return (
		extendedNavigator.language ||
		extendedNavigator.userLanguage ||
		extendedNavigator.browserLanguage ||
		'en-US'
	);
};
