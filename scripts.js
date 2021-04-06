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
    }
    function _clearBoard() {
        const divs = document.getElementsByClassName(`square`);
        for (const div of divs) {
            div.innerText = ""
        }
    }

    return {
        marker,
        setSquare,
        resetGame
    }

})();
const turn = (() => {
    let _turn = 'X'

    function nextTurn() {
        _turn = _turn === 'X' ? 'O' : 'X'
    }
    function getTurn() {
        return _turn;
    }
    return {
        nextTurn,
        getTurn
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

    function initEventListeners() {
        for (const div of _squareDivs) {
            div.addEventListener('click', (e) => {
                const idx = div.id.split('-')[1]
                doTurn(idx)
            })
        }
    }
    function doTurn(idx) {
        const active = turn.getTurn() === _p1.marker ? _p1 : _p2;
        if(active.makeMove(idx)){

            turn.nextTurn();
        } else{

        }
    }
    return {
        initEventListeners
    }

})();
controller.initEventListeners()