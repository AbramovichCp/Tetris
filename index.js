class Game {
    score = 0;
    lines = 0;
    level = 0;
    playfield = this.createPlayfield();
    activePiece = this.createPiece();
    nextPiece = this.createPiece();

    getState() {
        const playfield = this.createPlayfield();
        const {
            posX,
            posY,
            blocks
        } = this.activePiece;

        for (let y = 0; y < this.playfield.length; y++) {
            playfield[y] = [];
            for (let x = 0; x < this.playfield[y].length; x++) {
                playfield[y][x] = this.playfield[y][x];
            }
        }

        for (let y = 0; y < blocks.length; y++) {
            for (let x = 0; x < blocks[y].length; x++) {
                if (blocks[y][x]) {
                    playfield[posY + y][posX + x] = blocks[y][x];
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

    createPiece() {
        const index = Math.floor(Math.random() * 6);
        const type = 'IJLOSTZ' [index];
        const piece = {};

        switch (type) {
            case 'I':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [1, 1, 1, 1],
                    [0, 0, 0, 0],
                    [0, 0, 0, 0],
                ];
                break;
            case 'J':
                piece.blocks = [
                    [0, 0, 0],
                    [2, 2, 2],
                    [0, 0, 2],
                ];
                break;
            case 'L':
                piece.blocks = [
                    [0, 0, 0],
                    [3, 3, 3],
                    [3, 0, 0],
                ];
                break;
            case 'O':
                piece.blocks = [
                    [0, 0, 0, 0],
                    [0, 4, 4, 0],
                    [0, 4, 4, 0],
                    [0, 0, 0, 0],
                ];
                break;
            case 'S':
                piece.blocks = [
                    [0, 0, 0],
                    [0, 5, 5],
                    [5, 5, 0],
                ];
                break;
            case 'T':
                piece.blocks = [
                    [0, 0, 0],
                    [6, 6, 6],
                    [0, 6, 0],
                ];
                break;
            case 'Z':
                piece.blocks = [
                    [0, 0, 0],
                    [7, 7, 0],
                    [0, 7, 7],
                ];
                break;
            default:
                throw new Error('Undefined piece');

        }

        piece.posX = Math.floor((10 - piece.blocks[0].length) / 2);
        piece.posY = 0;
        return piece;
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
            this.updatePieces();
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

    updatePieces() {
        this.activePiece = this.nextPiece;
        this.nextPiece = this.createPiece();
    }
}

class View {
    static colors = {
        '1': 'lightblue',
        '2': 'royalblue',
        '3': 'orange',
        '4': 'yellow',
        '5': 'green',
        '6': 'blueviolet',
        '7': 'crimson',
    }
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

    render({
        playfield
    }) {
        this.clearScreen();
        this.renderPlayfield(playfield);
    }

    clearScreen() {
        this.context.clearRect(0, 0, this.width, this.height);
    }

    renderPlayfield(playfield) {
        for (let y = 0; y < playfield.length; y++) {
            const line = playfield[y];
            for (let x = 0; x < line.length; x++) {
                const block = line[x];
                if (block) {
                    this.renderBlock(
                        x * this.blockWidth,
                        y * this.blockHeight,
                        this.blockWidth,
                        this.blockHeight,
                        View.colors[block]
                    );
                }
            }
        }
    }

    renderBlock(x, y, width, height, color) {
        this.context.fillStyle = color;
        this.context.strokeStyle = 'black';
        this.context.lineWidth = '2px';

        this.context.fillRect(x, y, width, height);
        this.context.strokeRect(x, y, width, height)

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