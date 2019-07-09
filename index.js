class Game {
    score = 0;
    lines = 0;
    level = 0;
    playfield = this.createPlayfield();
    activePiece = {
        posX: 0,
        posY: 0,
        blocks: [
            [0, 1, 0],
            [1, 1, 1],
            [0, 0, 0],
        ],
    };

    getState() {
        const playfield = this.createPlayfield();

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < this.activePiece.blocks.length; y++) {
            for (let x = 0; x < this.activePiece.blocks[y].length; x++) {
                if(this.activePiece.blocks[y][x]) {
                    playfield[this.activePiece.posY + y][this.activePiece.posX + x] = this.activePiece.blocks[y][x];
                }
            }
        }

        return {
            playfield,
        }
    }

    createPlayfield() {
        const playfield = [];

        for (let y = 0; y < 20; y++) {
            playfield[y] = [];
            for (let x = 0; x < 10; x++) {
                playfield[y][x] = 0;
            }
        }

        return playfield;
    }

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
        if (this.hasCollision()) {
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
                if (clockwise) {
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

class View {
    constructor(element, width, height, rows, colomns) {
        this.element = element;
        this.width = width;
        this.height = height;
        this.colomns = colomns;
        this.blockWidth = this.width / colomns;
        this.blockHeight = this.height / rows;


        this.canvas = document.createElement('canvas');
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.context = this.canvas.getContext('2d');

        this.element.appendChild(this.canvas);
    }

    render({ playfield }) {
        this.clearScreen();
        this.renderPlayfield(playfield);
    }

    clearScreen() {
        this.context.clearRect(0,0,this.width, this.height);
    }

    renderPlayfield(playfield) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                if (block) {
                    this.context.fillStyle = 'red';
                    this.context.strokeStyle = 'black';
                    this.context.lineWidth = '2px';

                    this.context.fillRect(
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight
                    )
                }
            }
        }
    }

}



const root = document.querySelector('#root');

const game = new Game();

const view = new View(root, 320, 640, 20, 10);

window.game = game;
window.view = view;

document.addEventListener('keydown', event => {
    switch (event.keyCode) {
        case 37: //Left
            game.movePieceLeft();
            view.render(game.getState());
            break;
        case 38: //Up
            game.rotatePiece();
            view.render(game.getState());
            break;
        case 39: // Right
            game.movePieceRight();
            view.render(game.getState());
            break;
        case 40: //Down
            game.movePieceDown();
            view.render(game.getState());
            break;
    }
})

view.render(game.getState());

console.log(game);