import React, { useEffect, useState } from 'react';

interface CellProps {
	color: 'red' | 'yellow' | null;
}

const Cell: React.FC<CellProps> = ({ color }) => {
	const [drop, setDrop] = useState(false);

	useEffect(() => {
		if (color) {
			// Déclenche l'animation après que la cellule ait été remplie
			setDrop(true);
		} else {
			// Réinitialise l'animation si la cellule est vide
			setDrop(false);
		}
	}, [color]);

	return (
		<div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center shadow-lg relative overflow-hidden">
			{color && (
				<div
					className={`w-12 h-12 rounded-full ${
						color === 'red' ? 'bg-red-500' : 'bg-yellow-500'
					} transition-transform duration-500 ease-out ${
						drop ? 'translate-y-0' : '-translate-y-full'
					}`}
				></div>
			)}
		</div>
	);
};

export default Cell;
