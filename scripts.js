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
        gameinfo.gameover = false;
    }
    function _clearBoard() {
        const divs = document.getElementsByClassName(`square`);
        for (const div of divs) {
            div.innerText = ""
        }
    }

    function _getBoard() {
        return Object.freeze([..._board])
    }
    function checkDraw() {
        return _getBoard().every(square => square !== null)

    }
    function checkWin() {
        // These are all the lines that needs to be checked.
        const b = _getBoard();
        const r1 = b.slice(0, 3);
        const r2 = b.slice(3, 6);
        const r3 = b.slice(6, 9);
        const c1 = [b[0], b[3], b[6]]
        const c2 = [b[1], b[4], b[7]]
        const c3 = [b[2], b[5], b[8]]
        const d1 = [b[0], b[4], b[8]]
        const d2 = [b[2], b[4], b[6]]
        const all = [r1, r2, r3, c1, c2, c3, d1, d2]

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
const gameinfo = (() => {
    let _turn = gameboard.marker.X
    let gameover = false;
    let active = null

    let _p1 = null
    let _p2 = null

    function nextTurn() {
        _turn = _turn === gameboard.marker.X ? gameboard.marker.O : gameboard.marker.X
    }
    function getTurn() {
        return _turn;
    }
    function setActive() {
        active = getTurn() === _p1.marker ? _p1 : _p2;
    }

    function createPlayers(name1, name2) {
        _p1 = _createPlayer(name1, gameboard.marker.X)
        _p2 = _createPlayer(name2, gameboard.marker.O)
    }
    function _createPlayer(name, marker) {
        return playerFactory(name, marker)

    }
    return {
        nextTurn,
        getTurn,
        setActive,
        createPlayers,
        gameover,
        active
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

    const _squareDivs = document.getElementsByClassName('square')

    const replayBtn = document.getElementById('replay-btn');
    const startBtn = document.getElementById('start-btn');
    function initEventListeners() {
        for (const div of _squareDivs) {
            div.addEventListener('click', (e) => {
                if (gameinfo.gameover) return;
                const idx = div.id.split('-')[1]
                _doTurn(idx)
            })
        }
        replayBtn.addEventListener('click', (e) => {
            gameboard.resetGame();
            replayBtn.classList.remove('hidden');
        })
        startBtn.addEventListener('click', (e) => {
            const names = _getNames()
            gameinfo.createPlayers(names[0], names[1])
            console.log(names);
            _showGame();
        })
    }
    function _doTurn(idx) {
        gameinfo.setActive();
        if (gameinfo.active.makeMove(idx)) {
            gameinfo.nextTurn();
        }
        console.log(gameboard.checkWin(), gameboard.checkDraw());
        if (gameboard.checkWin() || gameboard.checkDraw()) {
            gameinfo.gameover = true;
            replayBtn.classList.remove('hidden');
        };
    }
    function _getNames() {
        const name1 = _getName('p1name')
        const name2 = _getName('p2name')
        return [ name1, name2 ]
    }
    function _getName(id) {
        return document.getElementById(id).value
    }
    function _showGame() {
        startBtn.classList.add('hidden');
        const containerDiv = document.getElementById('container')
        containerDiv.classList.remove('hidden')
    }
    return {
        initEventListeners
    }

})();
controller.initEventListeners()
