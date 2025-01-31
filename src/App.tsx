import { BrowserRouter, Route, Routes } from 'react-router-dom';
import MainLayout from './Layouts/MainLayout';
import IndexPage from './pages/IndexPage';
import ImprintPage from './pages/ImprintPage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<MainLayout />}>
					<Route index element={<IndexPage />} />
					<Route path="imprint" element={<ImprintPage />} />
					<Route
						path="privacy-policy"
						element={<PrivacyPolicyPage />}
					/>
					{/* 404 page */}
					<Route path="*" element={<NotFoundPage />} />
				</Route>
			</Routes>
		</BrowserRouter>
	);
}

export default App;
