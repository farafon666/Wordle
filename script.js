// Импортируем массив слов
import { WORDS } from './words_ru.js'

// Количество попыток
const NUMBER_OF_GUESSES = 6
// Количество оставшихся попыток
let guessesRemaining = NUMBER_OF_GUESSES
// Текущая попытка
let currentGuess = [];
// Следующая буква
let nextLetter = 0
// Загаданное слово
let rightGuessString = WORDS[Math.floor(Math.random() * WORDS.length)]

console.log(rightGuessString)

// Создание игрового поля
function initBoard() {
  // Получение доступа к блоку на странице
  let board = document.getElementById('game-board')

  // Создание строк
  for (let i = 0; i < NUMBER_OF_GUESSES; i++) {
    // Создание нового блока на странице
    let row = document.createElement('div')
    // Привязка класса, для дальнешего обращения к строке
    row.className = 'letter-row'

    // Создание отдельной клетки
    for (let j = 0; j < 5; j++) {
      // Создание нового блока на странице
      let box = document.createElement('div')
      // Привзяка к классу
      box.className = 'letter-box'
      // Вкладка блока "Буквы" в блок "Строки"
      row.appendChild(box)
    }
    // Вкладка блока "Строки" в игровое поле
    board.appendChild(row)
  }
}

// Удаление символа
function deleteLetter () {
  // Получаем доступ к текущей строке
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
  // И к последнему введённому символу
  let box = row.children[nextLetter - 1]
  // Очищаем содержимое клетки
  box.textContent  = ''
  // Убираем жирную обводку
  box.classList.remove('filled-box')
  // Удаляем последний символ из массива с нашей текущей догадкой
  currentGuess.pop()
  // Помечаем, что у нас теперь на одну свободную клетку больше
  nextLetter -= 1
}

// Подсвечиваем кнопки на экранной клавиатуре
function shadeKeyBoard (letter, color) {
  // Перебираем все кнопки виртуальной клавиатуры
  for (const elem of document.getElementsByClassName('keyboard-button')) {
    // Если текст на кнопке совпадает с текущей буквой
    if (elem.textContent === letter) {
      // Запоминаем текущий цвет буквы
      let oldColor = elem.style.backgroundColor
      // Если она была зелёной, оставляем как есть и выходим из функции
      if (oldColor === 'green') {
        return
      }

      // Если текущий цвет жёлтый, а новый не зелёный, то тоже оставляем всё как есть и выходим из функции
      if (oldColor === 'yellow' && color !== 'green') {
        return
      }

      // Делаем кнопку на клавиатуре того же цвета, что и соответствующая буква на игровом поле
      elem.style.backgroundColor = color
      // Выходим из цикла
      break
    }
  }
}

// Проверка введённого слова
function checkGuess () {
  // Получаем доступ к текущей строке
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
  // Переменная, где будет наша догадка
  let guessString = ''
  // Делаем из загаданного слова массив символов
  let rightGuess = Array.from(rightGuessString)

  // Собираем все введённые в строке буквы в одно слово
  for (const val of currentGuess) {
    guessString += val
  }

  // Если в догадку меньше 5 букв - выводим уведомление, что букв не хватает
  if (guessString.length !== 5) {
    // error означает, что уведомление будет в формате ошибки
    toastr.error('Введены не все буквы!')
    return
  }

  // Если введённого слова нет в списке возможных слов - выводим уведомление
  if (!WORDS.includes(guessString)) {
    toastr.error('Такого слова нет в списке!')
    return
  }

  // Перебираем все буквы в строке, чтобы подсветить их нужным цветом
  for (let i = 0; i < 5; i++) {
    // Убираем текущий цвет, если он был
    let letterColor = ''
    // Получаем доступ к текущей клетке
    let box = row.children[i]
    // И к текущей букву в догадке
    let letter = currentGuess[i]

    // Смотрим, на каком месте в исходном слове стоит текущая буква
    let letterPosition = rightGuess.indexOf(currentGuess[i])
    // Если такой буквы нет в исходном слове
    if (letterPosition === -1) {
      // Закрашиваем клетку серым
      letterColor = 'grey'
    } else {
      // Если позиция в слове совпадает с текущей позицией
      if (currentGuess[i] === rightGuess[i]) {
        // Закрашиваем клетку зелёным
        letterColor = 'green'
      } else {
        // Иначе закрашиваем жёлтым
        letterColor = 'yellow'
      }

      // Заменяем обработанный символ на знак решётки, чтобы не использовать его на следущем шаге цикла
      rightGuess[letterPosition] = '#'
    }

    // Применяем выбранный цвет к фону клетки
    box.style.backgroundColor = letterColor  
    // Применяем выбранный цвет к кнопке на экранной клавиатуре
    shadeKeyBoard(letter, letterColor) 
  }

  // Если мы угадали
  if (guessString === rightGuessString) {
    // Выводим сообщение об успехе
    toastr.success('Вы выиграли!')
    // Обнуляем количество попыток
    guessesRemaining = 0
    // Выходим из проверки
    return
  // В противном случает
  } else {
    // Уменьшаем счётчик попыток
    guessesRemaining -= 1
    // Обнуляем массив с символами текущей попытки
    currentGuess = []
    // Начинаем отсчёт букв занова
    nextLetter = 0

    // Если попытки закончились 
    if (guessesRemaining === 0) {
      // Выводим сообщение о проигрыше
      toastr.error('У вас не осталось попыток. Вы проиграли!')
      // Выводим загаданое слово
      toastr.error(`Загаданое слово: "${rightGuessString}"`)
    }
  }
}

// Выводим букву в клетку
function insertLetter (pressedKey) {
  // Если клетки закончились
  if (nextLetter === 5) return

  // Получаем доступ к текущей строке
  let row = document.getElementsByClassName('letter-row')[6 - guessesRemaining]
  // И к текущей клетке, где будет появляться буква
  let box = row.children[nextLetter]
  // Меняем текст в блоке с клеткой на нажатый символ
  box.textContent = pressedKey
  // Добавляем в клетку жирную обводку
  box.classList.add('filled-box')
  // Добавляем введённый символ к массиву, в котором хранится наша текущая попытка угадать слово
  currentGuess.push(pressedKey)
  // Помечаем, что дальше будем работать со следующей клеткой
  nextLetter += 1
}

// Обработчик нажатия клавиши
document.addEventListener("keydown", e => {
  // Если попыток не осталось - выходим из функции
  if (guessesRemaining === 0) return

  // Получаем код нажатой клавиши
  let pressedKey = String(e.key)

  // Если нажат Backspace и в строке есть хоть один символ 
  if (pressedKey === 'Backspace' && nextLetter !== 0) {
    // Удаляем последнюю введённую букву
    deleteLetter()
    return
  }

  // Если нажат Enter
  if (pressedKey === 'Enter') {
    // Проверяем введённое слово
    checkGuess()
    return
  }

  // Проверяем, есть ли введённый символ в русском алфавите
  let found = pressedKey.match(/[а-яА-ЯЁё]/gi)
  if (!found || found.length > 1) {
    return
  } else {
    insertLetter(pressedKey)
  }
})

// Обработчик нажатий на экранную клавиатуру
document.getElementById('keyboard-cont').addEventListener('click', e => {
  // Получаем нажатый элемент
  const target = e.target

  // Если нажали не на нашу клавиатуру - выходим из обработчика
  if (!target.classList.contains('keyboard-button')) {
    return
  }
  // Получаем текст нажатой кнопки
  let key = target.textContent

  // Имитируем нажатие этой кнопки на настоящей клавиатуре
  document.dispatchEvent(new KeyboardEvent('keydown', {'key': key}))
})

// Рисуем игровое поле
initBoard()