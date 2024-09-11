import React from 'react';
import Cell from './Cell';
import { CellValue } from './Types';

type GridProps = {
	grid: (CellValue | null)[][];
	handleClick: (colIndex: number) => void;
};

const Grid: React.FC<GridProps> = ({ grid, handleClick }) => {
	return (
		<div className="grid grid-cols-7 gap-2">
			{grid.map((row, rowIndex) => (
				<React.Fragment key={rowIndex}>
					{row.map((cell, colIndex) => (
						<div key={colIndex} onClick={() => handleClick(colIndex)}>
							<Cell color={cell} />
						</div>
					))}
				</React.Fragment>
			))}
		</div>
	);
};

export default Grid;
