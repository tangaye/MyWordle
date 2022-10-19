const game = {
    domElements: {
        keyboardContainer: document.querySelector('.game-keyboard'),
        keyboardButtons: document.querySelectorAll('.btn-alpha')
    },
    board: [[], [], [], [], [], []],
    word: 'yearn',
    currentRow: 0,
    classes: {
        validTileLetter: "tile__letter--valid",
        invalidTileLetter: "tile__letter--invalid",
        tileLetterExists: "tile__letter--exists",
        invalidRow: "board__row--invalid"
    },
    lettersMap: {},
    keys: {
        alpha: ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'],
        enter: "Enter",
        backspace: "Backspace"
    }
}

onkeyup = event => handleKeyUp(event)
onclick = event => handleOnClick(event)

const handleKeyUp = event => {

    if (event.isComposing || event.keyCode === 229) return

    const key = event.key

    if (game.keys.alpha.includes(key)) setTile(key)
    if (game.keys.backspace === key) unsetTile()
    if (game.keys.enter === key) validateRow()

    return
}

const handleOnClick = event => {

    const target = event.target
    const value = target.dataset.value
    const targetClassList = Array.from(target.classList)

    if (targetClassList.includes('btn-alpha')) setTile(value)

    if (targetClassList.includes('btn-del')) unsetTile()

    if (targetClassList.includes('btn-enter')) validateRow()

}

const getCurrentRow = () => game.board[game.currentRow]

const getCurrentRowEl = () => document.querySelector(`.board__row--${game.currentRow}`)

const toggleRowTile = ({el, value, borderColor}) => {
   el.textContent = value
   el.style.borderColor = borderColor
}

const letterExists = letter => game.word.includes(letter)

const letterPositionValid = (letter, letterIndex) => {
    const position = Array.from(game.word).findIndex(item => item === letter)
    return position === letterIndex
}

const toggleTileClass = (el, className) => el.classList.add(className)

const toggleLetterButtons = () => {

    game.domElements.keyboardButtons.forEach(button => {

        const letter = button.dataset.value
        const btnClasses = Array.from(button.classList)

        //If btn has a valid class don't add any class
        if (!btnClasses.includes(game.classes.validTileLetter)) {
            button.classList.add(game.lettersMap[letter])
        }
    })
}

const toggleRowClasses = className => getCurrentRowEl().classList.add(className)

const setTile = value =>
{
    const row = getCurrentRow()
    const rowEl = getCurrentRowEl()

    if (row.length > 4) return

    row.push(value.toUpperCase())

    const rowLastItemIndex = row.length - 1
    const rowLastItemValue = row[rowLastItemIndex]

    toggleRowTile({
        el: rowEl.children[rowLastItemIndex],
        value: rowLastItemValue,
        borderColor: "#878A8C"
    })
}

const unsetTile = () => {

    // 1. get row
    const row = getCurrentRow()
    const rowEl = getCurrentRowEl()
    const rowLength = row.length

    if (rowLength === 0) return

    // 2. get last item index
    const rowLastItemIndex = rowLength - 1

    // 3. remove item from board el
    toggleRowTile({
        el: rowEl.children[rowLastItemIndex],
        value: "",
        borderColor: "#d3d6da"
    })

    // 3. remove item from board
    row.pop()
}

const validateRow = () => {

    const row = getCurrentRow()
    const rowEl = getCurrentRowEl()

    if (row.length <= 4) return toggleRowClasses(game.classes.invalidRow)

    row.forEach((letter, index) => {

        letter = letter.toLowerCase()

        const rowChild = rowEl.children[index]

        if (letterPositionValid(letter, index)) {

            toggleTileClass(rowChild, game.classes.validTileLetter)
            game.lettersMap[letter] = game.classes.validTileLetter
        }

        else if (letterExists(letter)) {
            toggleTileClass(rowChild, game.classes.tileLetterExists)
            game.lettersMap[letter] = game.classes.tileLetterExists
        }

        else {
            toggleTileClass(rowChild, game.classes.invalidTileLetter)
            game.lettersMap[letter] = game.classes.invalidTileLetter
        }

    })

    game.currentRow++

    toggleLetterButtons()
}

