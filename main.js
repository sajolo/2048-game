// Definir la clase de las celdas
class Tile {
    constructor(value, row, col) {
        this.value = value || 0; // Valor de la celda, 0 si no se proporciona
        this.row = row || 0; // Fila de la celda, 0 si no se proporciona
        this.col = col || 0; // Columna de la celda, 0 si no se proporciona
        this.merged = false; // Indica si esta celda se ha combinado en este turno
    }
}

// Parámetros del juego
const size = 4; // Tamaño del tablero de juego
let board = []; // Tablero de juego como un arreglo de arreglos
let score = 0; // Puntuación inicial del juego

// Inicializar el tablero
function initBoard() {
    board = []; // Limpiar el tablero actual
    for (let i = 0; i < size; i++) {
        let row = []; // Crear una nueva fila
        for (let j = 0; j < size; j++) {
            row.push(new Tile()); // Añadir una nueva celda a la fila
        }
        board.push(row); // Añadir la fila al tablero
    }
    addRandomTile(); // Añadir un número aleatorio
    addRandomTile(); // Añadir otro número aleatorio
    drawBoard(); // Dibujar el tablero en el HTML
}

// Añadir un número aleatorio en el tablero
function addRandomTile() {
    let emptyTiles = []; // Arreglo para guardar las celdas vacías
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (board[i][j].value == 0) { // Si la celda está vacía
                emptyTiles.push({row: i, col: j}); // Añadir a la lista de celdas vacías
            }
        }
    }
    if (emptyTiles.length > 0) {
        let randomIndex = Math.floor(Math.random() * emptyTiles.length); // Elegir un índice aleatorio
        let tile = emptyTiles[randomIndex]; // Obtener una celda vacía aleatoria
        board[tile.row][tile.col] = new Tile(Math.random() < 0.9 ? 2 : 4); // Asignar un 2 o un 4 a la celda
    }
}

// Dibujar el tablero en el HTML
function drawBoard() {
    const boardContainer = document.getElementById('tablero-juego');
    boardContainer.innerHTML = ''; // Limpiar el tablero actual en HTML
    board.forEach(row => {
        row.forEach(tile => {
            let tileElement = document.createElement('div'); // Crear un nuevo div para la celda
            tileElement.className = `tile value-${tile.value}`; // Asignar una clase basada en el valor
            tileElement.textContent = tile.value > 0 ? tile.value : ''; // Mostrar el valor
            boardContainer.appendChild(tileElement); // Añadir la celda al contenedor del tablero
        });
    });
}

// Función para verificar si hay celdas vacías
function isBoardFull() {
    return board.every(row => row.every(tile => tile.value !== 0));
}

// Función para verificar si se pueden combinar celdas adyacentes
function canCombine() {
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            if (i < size - 1 && board[i][j].value === board[i + 1][j].value) return true;
            if (j < size - 1 && board[i][j].value === board[i][j + 1].value) return true;
        }
    }
    return false;
}

// Función para verificar si el juego ha terminado
function checkGameOver() {
    if (!isBoardFull() && !canCombine()) {
        alert("¡Juego terminado! Puntuación final: " + score);
        return true;
    }
    return false;
}

// Manejar la entrada del usuario
function move(direction) {
    let hasChanged = false;
    let addScore = 0;

    // Preparar el tablero para el movimiento
    for (let i = 0; i < size; i++) {
        for (let j = 0; j < size; j++) {
            board[i][j].merged = false;
        }
    }

    // Función para mover las celdas
    function slide(row) {
        let arr = row.filter(tile => tile.value);
        let missing = size - arr.length;
        let zeros = Array(missing).fill(new Tile());
        arr = direction === 'right' || direction === 'down' ? zeros.concat(arr) : arr.concat(zeros);
        return arr;
    }

    // Función para combinar las celdas
    function combine(row) {
        for (let i = size - 1; i > 0; i--) {
            let a = row[i];
            let b = row[i - 1];
            if (a.value && a.value === b.value && !a.merged && !b.merged) {
                a.value *= 2;
                b.value = 0;
                a.merged = true;
                addScore += a.value;
                hasChanged = true;
            }
        }
        return row;
    }

    // Rotar el tablero para facilitar el movimiento
    function rotateBoard() {
        let newBoard = [];
        for (let i = 0; i < size; i++) {
            let row = [];
            for (let j = 0; j < size; j++) {
                row.push(board[j][i]);
            }
            newBoard.push(row);
        }
        board = newBoard;
    }

    // Mover y combinar las celdas
    for (let i = 0; i < size; i++) {
        let row = board[i];
        let originalRow = [...row]; // Clona la fila original para comparación después del movimiento

        row = slide(row);
        row = combine(row);
        row = slide(row); // Necesario para casos en los que las combinaciones dejan espacios vacíos
        board[i] = row;

        // Verificar si la fila cambió durante este movimiento
        if (!hasChanged && originalRow.some((tile, index) => tile.value !== row[index].value)) {
            hasChanged = true;
        }
    }

    // Rotar el tablero de nuevo a su orientación original
    if (direction === 'up' || direction === 'down') rotateBoard();

    // Añadir un número aleatorio si el tablero cambió y actualizar la puntuación
    if (hasChanged) {
        addRandomTile();
        score += addScore;
        document.getElementById('puntaje').textContent = score;
    }

    // Redibujar el tablero para reflejar los cambios
    drawBoard();

    // Verificar si el juego ha terminado
    
}

// Listener para el teclado
document.addEventListener('keydown', function(event) {
    if (event.key === 'ArrowUp') {
        move('up'); // Mover arriba
    } else if (event.key === 'ArrowDown') {
        move('down'); // Mover abajo
    } else if (event.key === 'ArrowLeft') {
        move('left'); // Mover izquierda
    } else if (event.key === 'ArrowRight') {
        move('right'); // Mover derecha
    }
});

// Iniciar el juego
initBoard(); // Función para iniciar y configurar el juego
