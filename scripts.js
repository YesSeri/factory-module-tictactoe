'use strict'
const gameboard = (() => {
    const _board = Array(9).fill(null)
    const marker = { X: 'X', O: 'O' }
    Object.freeze(marker)

    function setSquare(marker, idx) {
        if (_board[idx] === null) {
            _board[idx] = marker;
            return true;
        }
        return false
    }
    function resetGame() {
        for (let i = 0; i < _board.length; i++) {
            _board[i] = null
        }
        _clearBoard()
        turn.gameover = false;
    }
    function _clearBoard() {
        const divs = document.getElementsByClassName(`square`);
        for (const div of divs) {
            div.innerText = ""
        }
    }
    
    function _getBoard(){
        return Object.freeze([..._board])
    }
    function checkDraw() {
        return _getBoard().every(square => square !== null)

    }
    function checkWin() {
        // These are all the lines that needs to be checked.
        const b = _getBoard();
        const r1 = b.slice(0,3);
        const r2 = b.slice(3,6);
        const r3 = b.slice(6,9);
        const c1 = [b[0], b[3], b[6]]
        const c2 = [b[1], b[4], b[7]]
        const c3 = [b[2], b[5], b[8]]
        const d1 = [b[0], b[4], b[8]]
        const d2 = [b[2], b[4], b[6]]
        const all = [r1,r2,r3,c1,c2,c3,d1,d2]
        
        // Returns true if there is a winning line.
        return all.some(el => {
            if (el[0] !== null && el[0] === el[1] && el[0] === el[2]) return true
            return false;
        })
    }

    return {
        marker,
        setSquare,
        resetGame,
        checkWin,
        checkDraw,
        _getBoard
    }

})();
const turn = (() => {
    let _turn = gameboard.marker.X
    let gameover = false;

    function nextTurn() {
        _turn = _turn === gameboard.marker.X ? gameboard.marker.O : gameboard.marker.X
    }
    function getTurn() {
        return _turn;
    }
    return {
        nextTurn,
        getTurn,
        gameover
    }
})();
function playerFactory(name, marker) {

    const makeMove = (idx) => {
        if (gameboard.setSquare(marker, idx)) {
            _showMove(idx)
            return true;
        };
        return false;
    };
    const _showMove = (idx) => {
        const div = document.getElementById(`square-${idx}`);
        div.innerText = marker
    }

    return { name, marker, makeMove }
}

const controller = (() => {

    const _p1 = playerFactory('hank', gameboard.marker.X)
    const _p2 = playerFactory('alia', gameboard.marker.O)

    const _squareDivs = document.getElementsByClassName('square')

    const replayBtn = document.getElementById('replay-button');
    function initEventListeners() {
        for (const div of _squareDivs) {
            div.addEventListener('click', (e) => {
                if(turn.gameover) return;
                const idx = div.id.split('-')[1]
                doTurn(idx)
            })
            replayBtn.addEventListener('click', (e) => {
                gameboard.resetGame();
                replayBtn.classList.remove('hidden');
            })
        }
    }
    function doTurn(idx) {
        const active = turn.getTurn() === _p1.marker ? _p1 : _p2;
        if(active.makeMove(idx)){
            turn.nextTurn();
        } 
        console.log(gameboard.checkWin(), gameboard.checkDraw());
        if(gameboard.checkWin() || gameboard.checkDraw()) {
            turn.gameover = true;
            replayBtn.classList.remove('hidden');
        };
    }
    return {
        initEventListeners
    }

})();
controller.initEventListeners()
