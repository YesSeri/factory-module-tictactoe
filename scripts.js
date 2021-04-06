'use strict'
const displayController = (() => {

})();
const gameboard = (() => {
    const _board = Array(9).fill(null)
    const marker = { X: 'X', O: 'O' }
    Object.freeze(marker)

    function setSquare(marker, idx) {
        if (_board[idx] === null) {
            _board[idx] = marker;
            return true;
        }
        console.log(_board);
        return false
    }

    return {
        marker,
        setSquare
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
            _showMove(idx);
        } else {
            console.error('Move could not be made. Please choose an empty square.')
        }
    };
    const _showMove = (idx) => {
        const div = document.getElementById(`square-${idx}`);
        div.innerText = marker
    }
    return { name, marker, makeMove }
}
const p1 = playerFactory('hank', gameboard.marker.X)
const p2 = playerFactory('alia', gameboard.marker.O)
p1.makeMove(1)
p2.makeMove(1)