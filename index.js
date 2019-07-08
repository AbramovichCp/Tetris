class Game {
    score = 0;
    lines = 0;
    level = 0;
    playfield = [
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
    ];
    activePiece = {
        posX: 0,
        posY: 0,
        blocks: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
    };

    movePieceLeft() {
        this.activePiece.posX -= 1;

        if (this.hasCollision()) {
            this.activePiece.posX += 1;
        }
    }

    movePieceRight() {
        this.activePiece.posX += 1;

        if (this.hasCollision()) {
            this.activePiece.posX -= 1;
        }
    }

    movePieceDown() {
        this.activePiece.posY += 1;

        if (this.hasCollision()) {
            this.activePiece.posY -= 1;
            this.lockPiece();
        }
    }

    rotatePiece() {
        this.rotateBlock();
        if(this.hasCollision()) {
            this.rotateBlock(false);
        }
    }

    rotateBlock(clockwise = true) {
        const blocks = this.activePiece.blocks;
        const length = blocks.length;

        const x = Math.floor(length / 2);
        const y = length - 1;

        for (let i = 0; i < x; i++) {
            for (let j = i; j < y; j++) {
                const temp = blocks[i][j];
                if(clockwise) {
                    blocks[i][j] = blocks[y - j][i];
                    blocks[y - j][i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[j][y - i];
                    blocks[j][y - i] = temp;
                } else {
                    blocks[i][j] = blocks[j][y - i];
                    blocks[j][y - i] = blocks[y - i][y - j];
                    blocks[y - i][y - j] = blocks[y - j][i];
                    blocks[y - j][i] = temp;
                }
            }
        }
    }

    hasCollision() {
        const {
            posX,
            posY,
            blocks,
        } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (
                    blocks[y][x] &&
                    ((this.playfield[posY + y] === undefined || this.playfield[posY + y][posX + x] === undefined) ||
                        this.playfield[posY + y][posX + x]
                    )
                ) {
                    return true;
                }
            }
        }
        return false;
    }

    lockPiece() {
        const {
            posX,
            posY,
            blocks
        } = this.activePiece;
        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    this.playfield[posY + y][posX + x] = blocks[y][x];
                }
            }
        }
    }
}

const game = new Game();

window.game = game;

console.log(game);