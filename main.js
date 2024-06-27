import '@minesweeper/scss/style.scss';
import 'jquery';
import 'tickwatchjs';
import * as svgs from './src/js/svgs.js';

const clockParts = ['seconds', {minutes: 99}];

const DIFFICULTY = {
    EASY: 'easy',
    MEDIUM: 'medium',
    HARD: 'hard',
    IMPOSSIBLE: 'impossible',
}

const SIZES = {
    EXTRA_SMALL: 'extra-small',
    SMALL: 'small',
    MEDIUM: 'medium',
    LARGE: 'large',
    EXTRA_LARGE: 'extra-large',
    CUSTOM: 'custom',
}

let settings = {
    difficulty: DIFFICULTY.IMPOSSIBLE,
    size: SIZES.MEDIUM,
}

const timePassingElement = $('.time-passing');
timePassingElement.TickWatch({
    partsKeys: clockParts,
    activeCellClass: 'active-seven-segments-cell',
    inactiveCellClass: 'inactive-seven-segments-cell',
});

const minesNumberElement = $('.mines-number');
minesNumberElement.TickWatch({
    displayOnly: true,
    displaySize: 3,
});

$('[data-difficulty],[data-size]').on('click', function () {
    if ($(this).attr('data-difficulty')) {
        settings.difficulty = $(this).attr('data-difficulty');
    }
    if ($(this).attr('data-size')) {
        settings.size = $(this).attr('data-size');
    }
    synchronizeSettingsDropdown();
});

function synchronizeSettingsDropdown() {
    $('[data-difficulty]').removeClass('active');
    $('[data-difficulty="'+settings.difficulty+'"]').addClass('active');
    $('[data-size]').removeClass('active');
    $('[data-size="'+settings.size+'"]').addClass('active');
    localStorage.setItem('settings', JSON.stringify(settings));
    startGame();
}

const modeFlagIcon = $('.marker-mode.marker-mode-flag');
const modeSeekerIcon = $('.marker-mode.marker-mode-seeker');
$('.switch-marker-btn').on('click', function() {
    modeFlagIcon.toggleClass('selected');
    modeSeekerIcon.toggleClass('selected');
});

const cellSize = 20;
function createCellElements(map) {
    let container = $(".cells-wrapper");
    container.empty();
    let [rows, cols] = [map.length, map[0].length];
    container.css({width: cellSize*cols, height: cellSize*rows});
    container.css('grid-template-columns', `repeat(${cols}, ${cellSize}px)`);
    for(let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let cell = $('<div/>', { class: 'cell' });
            cell.attr('data-row', j);
            cell.attr('data-col', i);
            cell.attr('data-number', map[j][i].number);

            let numberWrapper = $('<div/>', { class: 'number-wrapper cell-content' });
            let numberSpan = $('<span/>').text(map[j][i].number === 0 ? '' : map[j][i].number);
            numberWrapper.append(numberSpan);

            let bombeWrapper = $('<div/>', { class: `bombe-wrapper cell-content${map[j][i].hasBombe ? ' hasBombe' : ''}` });
            let bombeImage = $(svgs.bombeSVG);
            bombeWrapper.append(bombeImage);

            let cellCover = $('<div/>', { class: 'cell-cover cell-content' });

            let flagWrapper = $('<div/>', { class: `flag-wrapper cell-content${map[j][i].hasFlag ? ' hasFlag' : ''}` });
            let flagImage = $(svgs.flagSVG);
            flagWrapper.append(flagImage);

            // Append created elements to cell div
            cell.append(numberWrapper, bombeWrapper, cellCover, flagWrapper);

            // Append cell div to container
            container.append(cell);
        }
    }
}

let bombesNumber = 0;

$(document).ready(function () {
    //get settings from localstorage first if exist
    let settingsFromLocalStorage = localStorage.getItem('settings');
    if (settingsFromLocalStorage) {
        settings = JSON.parse(settingsFromLocalStorage);
    }
    synchronizeSettingsDropdown();
});

$(document).on('click', '.board:not(.lost, .won) .cell', function() {
    if (!$('.marker-mode-flag').hasClass('selected')) {
        clickOnCell($(this));
    }
    else{
        contextOnCell($(this));
    }
});

$(document).on('contextmenu', '.board:not(.lost, .won) .cell', function(e) {
    e.preventDefault();
    if ($('.marker-mode-flag').hasClass('selected')) {
        clickOnCell($(this));
    }
    else{
        contextOnCell($(this));
    }
});

function startGame() {
    buildBoard();
}

$('.restart-btn-img').on('click', function () {
    startGame();
});

let gameStarted = false;

function clickOnCell($cell) {
    if (!gameStarted) {
        gameStarted = true;
        timePassingElement.TickWatch('start');
    }
    uncoverCell($cell);
    let [j, i] = [parseInt($cell.attr('data-row')), parseInt($cell.attr('data-col'))];
    map[j][i].clicked = true;
    if (map[j][i].hasBombe) {
        uncoverAllCells();
        $cell.addClass('explored-bomb');
        $('.board').addClass('lost');
        gameStarted = false;
        timePassingElement.TickWatch('stop');
        return;
    }
    if (map[j][i].number !== 0) return;
    for (const direction of directions) {
        let neighbor = getNeighbor(map, j, i, direction);
        if (
            neighbor.i !== -1 &&
            neighbor.j !== -1 &&
            !map[neighbor.j][neighbor.i].hasBombe &&
            !map[neighbor.j][neighbor.i].hasFlag &&
            !map[neighbor.j][neighbor.i].clicked
        ) {
            clickOnCell($(`.cell[data-row="${neighbor.j}"][data-col="${neighbor.i}"]`));
        }
    }
}

function contextOnCell($cell) {
    if (!$cell.find('.flag-wrapper').hasClass('hasFlag') && bombesNumber === 0) {
        alert('You have no more bombe flags');
        return;
    }
    $cell.find('.flag-wrapper').toggleClass('hasFlag');
    let [j, i] = [parseInt($cell.attr('data-row')), parseInt($cell.attr('data-col'))];
    map[j][i].hasFlag = $cell.find('.flag-wrapper').hasClass('hasFlag');
    if ($cell.find('.flag-wrapper').hasClass('hasFlag')) {
        changeBombesNumber(-1);
    }
    else{
        changeBombesNumber(+1);
    }
    if (bombesNumber === 0) {
        for (let k = 0; k < map.length; k++) {
            for (let l = 0; l < map[k].length; l++) {
                if (map[k][l].hasFlag !== map[k][l].hasBombe) return;
            }
        }
        won();
    }
}

function changeBombesNumber(plus) {
    bombesNumber+=plus;
    minesNumberElement.TickWatch('set', bombesNumber);
}

function won() {
    uncoverAllCells();
    $('.board').addClass('won');
    gameStarted = false;
    timePassingElement.TickWatch('stop');
    // noinspection JSCheckFunctionSignatures
    alert("You WON !!!\nYou won in "+timePassingElement.TickWatch('get'));
}

function uncoverCell($cell) {
    $cell.find('.cell-cover').hide();
    $cell.find('.flag-wrapper').removeClass('hasFlag');
}

function uncoverAllCells() {
    for (let k = 0; k < map.length; k++) {
        for (let l = 0; l < map[k].length; l++) {
            uncoverCell($(`.cell[data-row="${k}"][data-col="${l}"]`));
        }
    }
}

function getRowsAndCols() {
    switch (settings.size) {
        case SIZES.EXTRA_SMALL:
            return [9, 16];
        case SIZES.SMALL:
            return [16, 16];
        case SIZES.MEDIUM:
            return [32, 16];
        case SIZES.LARGE:
            return [48, 64];
        case SIZES.EXTRA_LARGE:
            return [100, 100];
        default:
            return [0, 0];
    }
}

function buildBoard() {
    let [rows, cols] = getRowsAndCols();
    gameStarted = false;
    timePassingElement.TickWatch('stop');
    timePassingElement.TickWatch('clear');
    $('.cell').removeClass('explored-bomb')
    $('.flag-wrapper').removeClass('hasFlag');
    $('.board').removeClass('lost won');
    $('.cell-cover').show();
    createMap(rows, cols);
    for (let k = 0; k < map.length; k++) {
        for (let l = 0; l < map[k].length; l++) {
            if (map[k][l].hasFlag) {
                changeBombesNumber(-1);
            }
        }
    }
    createCellElements(map);
}

function getBombeDensity() {
    switch (settings.difficulty) {
        case DIFFICULTY.EASY:
            return 0.1;
        case DIFFICULTY.MEDIUM:
            return 0.2;
        case DIFFICULTY.HARD:
            return 0.4;
        case DIFFICULTY.IMPOSSIBLE:
            return 0.6;
        default:
            return 0;
    }
}

let map;
function createMap(rows, cols, bombesWithFlag = 0) {
    let maxBombesCount = getBombeDensity()*(rows*cols);
    bombesNumber = maxBombesCount;
    map = [];
    for(let j = 0; j < rows; j++) {
        map.push([]);
        for (let i = 0; i < cols; i++) {
            map[j].push({
                hasBombe: false,
                hasFlag: false,
                clicked: false,
                number: 0,
            });
        }
    }

    changeBombesNumber(0);
    let bombesCountSet = 0;
    let x = 0;
    while(bombesCountSet<maxBombesCount) {
        let randomCol = Math.floor(Math.random() * cols);
        let randomRow = Math.floor(Math.random() * rows);
        if ([0, rows-1].includes(randomRow) && [0, cols-1].includes(randomCol)) {
            continue;
        }
        if(!map[randomRow][randomCol].hasBombe) {
            map[randomRow][randomCol].hasBombe = true;
            bombesCountSet++;
            if ((bombesWithFlag > 0 && x < bombesWithFlag) || (bombesWithFlag < 0 && x < (bombesNumber + bombesWithFlag))) {
                map[randomRow][randomCol].hasFlag = true;
                x++;
            }
        }
    }

    for(let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
            let number = 0;
            for (const direction of directions) {
                let neighbor = getNeighbor(map, j, i, direction);
                if (neighbor.i !== -1 && neighbor.j !== -1 && map[neighbor.j][neighbor.i].hasBombe) {
                    number++;
                }
            }
            map[j][i].number = number;
        }
    }

    window.map = map;
}

const directions = ["top","top-right","right","right-bottom","bottom","bottom-left","left","left-top"];

/**
 * @typedef CellData
 * @property {boolean} hasBombe
 * @property {boolean} hasFlag
 * @property {boolean} clicked
 * @property {number} number
 */

/**
 * @param {CellData[][]}map
 * @param {number} i
 * @param {number} j
 * @param { "top"|"top-right"|"right"|"right-bottom"|"bottom"|"bottom-left"|"left"|"left-top" } direction
 */
function getNeighbor(map, j, i, direction) {
    let [rows, cols] = [map.length, map[0].length];
    let newCords = {
        i: i,
        j: j
    };
    switch (direction) {
        case "top":
            newCords.j = getSmaller(j);
            break;
        case "top-right":
            newCords.i = getBigger(i, cols);
            newCords.j = getSmaller(j);
            break;
        case "right":
            newCords.i = getBigger(i, cols);
            break;
        case "right-bottom":
            newCords.i = getBigger(i, cols);
            newCords.j = getBigger(j, rows);
            break;
        case "bottom":
            newCords.j = getBigger(j, rows);
            break;
        case "bottom-left":
            newCords.i = getSmaller(i);
            newCords.j = getBigger(j, rows);
            break;
        case "left":
            newCords.i = getSmaller(i);
            break;
        case "left-top":
            newCords.i = getSmaller(i);
            newCords.j = getSmaller(j);
            break;
    }
    return newCords;
}

function getSmaller(x) {
    return x === 0 ? -1 : (x-1);
}

function getBigger(x, max) {
    return x === (max-1) ? -1 : (x+1);
}

const toggleCheatMode = () => {
    $('.board').toggleClass('cheating-mode');
}
window.toggleCheatMode = toggleCheatMode;