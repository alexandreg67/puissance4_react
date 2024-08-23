import Board from './components/board';

export default function Home() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
			<h1 className="text-3xl md:text-5xl font-bold text-gray-800 mb-8">
				Puissance 4
			</h1>
			<Board />
		</div>
	);
}
