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

    hasCollision() {
        const {
            posX,
            posY,
            blocks,
        } = this.activePiece;

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if(
                    blocks[y][x] &&
                    ((this.playfield[posY + y] === undefined || this.playfield[posY + y][posX] === undefined) ||
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
                if(blocks[y][x]){
                    this.playfield[posY + y][posX + x] = blocks[y][x];
                }
            }
        }
    }
}

const game = new Game();

window.game = game;

console.log(game);