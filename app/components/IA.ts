export interface IAGameState {
	grid: number[][]; // 0 = empty, 1 = player 1, 2 = IA
	nbLigne: number;
	nbColonne: number;
}

const IA = {
	choixColonne(gameState: IAGameState): number {
		const tabColonne = this.getTableauCellulesPossibles(gameState);
		let meilleurColonne = 0;
		let tabMeilleurColonne = [0];

		for (let i = 1; i < tabColonne.length; i++) {
			if (tabColonne[i] > tabColonne[meilleurColonne]) {
				meilleurColonne = i;
				tabMeilleurColonne = [i];
			} else if (tabColonne[i] === tabColonne[meilleurColonne]) {
				tabMeilleurColonne.push(i);
			}
		}

		return tabMeilleurColonne[
			Math.floor(Math.random() * tabMeilleurColonne.length)
		];
	},

	getTableauCellulesPossibles(gameState: IAGameState): number[] {
		const { nbColonne } = gameState;
		const tabColonne: number[] = [];
		for (let i = 0; i < nbColonne; i++) {
			const ligne = this.retournerLigneCaseVideColonne(gameState, i);
			tabColonne.push(this.getPoidsCellule(gameState, ligne, i));
		}
		return tabColonne;
	},

	retournerLigneCaseVideColonne(
		gameState: IAGameState,
		colonne: number
	): number {
		for (let ligne = gameState.nbLigne - 1; ligne >= 0; ligne--) {
			if (gameState.grid[ligne][colonne] === 0) {
				return ligne;
			}
		}
		return -1; // Colonne pleine
	},

	getPoidsCellule(
		gameState: IAGameState,
		ligne: number,
		colonne: number
	): number {
		if (ligne === -1) return 0; // La colonne est pleine
		if (this.verifGagner(gameState, ligne, colonne, 2)) return 100;
		if (this.verifGagner(gameState, ligne, colonne, 1)) return 99;

		if (this.coupPerdant(gameState, ligne, colonne, 2)) return 0;

		let poids = 0;
		if (this.positionDefensive(gameState, ligne, colonne, 1)) poids += 20;
		if (this.positionDefensive(gameState, ligne, colonne, 2)) poids += 20; // Attaque
		poids += this.getPoidsBase(ligne, colonne);

		return poids;
	},

	positionDefensive(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		const { grid } = gameState;
		let cpt = 1;

		if (grid[ligne][colonne + 1] === joueur) {
			cpt++;
			if (grid[ligne][colonne + 2] === joueur && grid[ligne][colonne + 3] === 0)
				cpt++;
		}

		if (grid[ligne][colonne - 1] === joueur) {
			cpt++;
			if (grid[ligne][colonne - 2] === joueur && grid[ligne][colonne - 3] === 0)
				cpt++;
		}

		return cpt > 2;
	},

	getPoidsBase(ligne: number, colonne: number): number {
		const poidsLigne = [1, 2, 3, 4, 3, 2];
		const poidsColonne = [1, 2, 3, 3, 3, 2, 1];

		return poidsLigne[ligne] * poidsColonne[colonne];
	},

	verifGagner(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		return (
			this.verifGagnerLigne(gameState, ligne, colonne, joueur) ||
			this.verifGagnerColonne(gameState, ligne, colonne, joueur) ||
			this.verifGagnerDiagonale(gameState, ligne, colonne, joueur)
		);
	},

	verifGagnerLigne(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		const { grid } = gameState;
		let cpt = 1;

		if (grid[ligne][colonne + 1] === joueur) {
			cpt++;
			if (grid[ligne][colonne + 2] === joueur) {
				cpt++;
				if (grid[ligne][colonne + 3] === joueur) {
					cpt++;
				}
			}
		}
		if (grid[ligne][colonne - 1] === joueur) {
			cpt++;
			if (grid[ligne][colonne - 2] === joueur) {
				cpt++;
				if (grid[ligne][colonne - 3] === joueur) {
					cpt++;
				}
			}
		}
		return cpt > 3;
	},

	verifGagnerColonne(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		const { grid } = gameState;
		let cpt = 1;
		if (ligne < 3) {
			if (grid[ligne + 1][colonne] === joueur) {
				cpt++;
				if (grid[ligne + 2][colonne] === joueur) {
					cpt++;
					if (grid[ligne + 3][colonne] === joueur) {
						cpt++;
					}
				}
			}
		}
		return cpt > 3;
	},

	verifGagnerDiagonale(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		const { grid, nbColonne, nbLigne } = gameState;
		let cpt = 1;

		if (
			ligne - 1 >= 0 &&
			colonne + 1 < nbColonne &&
			grid[ligne - 1][colonne + 1] === joueur
		) {
			cpt++;
			if (
				ligne - 2 >= 0 &&
				colonne + 2 < nbColonne &&
				grid[ligne - 2][colonne + 2] === joueur
			) {
				cpt++;
				if (
					ligne - 3 >= 0 &&
					colonne + 3 < nbColonne &&
					grid[ligne - 3][colonne + 3] === joueur
				) {
					cpt++;
				}
			}
		}

		if (
			ligne + 1 < nbLigne &&
			colonne - 1 >= 0 &&
			grid[ligne + 1][colonne - 1] === joueur
		) {
			cpt++;
			if (
				ligne + 2 < nbLigne &&
				colonne - 2 >= 0 &&
				grid[ligne + 2][colonne - 2] === joueur
			) {
				cpt++;
				if (
					ligne + 3 < nbLigne &&
					colonne - 3 >= 0 &&
					grid[ligne + 3][colonne - 3] === joueur
				) {
					cpt++;
				}
			}
		}

		if (cpt > 3) return true;

		cpt = 1;
		if (
			ligne - 1 >= 0 &&
			colonne - 1 >= 0 &&
			grid[ligne - 1][colonne - 1] === joueur
		) {
			cpt++;
			if (
				ligne - 2 >= 0 &&
				colonne - 2 >= 0 &&
				grid[ligne - 2][colonne - 2] === joueur
			) {
				cpt++;
				if (
					ligne - 3 >= 0 &&
					colonne - 3 >= 0 &&
					grid[ligne - 3][colonne - 3] === joueur
				) {
					cpt++;
				}
			}
		}

		if (
			ligne + 1 < nbLigne &&
			colonne + 1 < nbColonne &&
			grid[ligne + 1][colonne + 1] === joueur
		) {
			cpt++;
			if (
				ligne + 2 < nbLigne &&
				colonne + 2 < nbColonne &&
				grid[ligne + 2][colonne + 2] === joueur
			) {
				cpt++;
				if (
					ligne + 3 < nbLigne &&
					colonne + 3 < nbColonne &&
					grid[ligne + 3][colonne + 3] === joueur
				) {
					cpt++;
				}
			}
		}

		return cpt > 3;
	},

	coupPerdant(
		gameState: IAGameState,
		ligne: number,
		colonne: number,
		joueur: number
	): boolean {
		return (
			ligne - 1 === 0 && this.verifGagner(gameState, ligne - 1, colonne, 1)
		);
	},
};

export default IA;
