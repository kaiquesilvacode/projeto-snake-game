const canvas = document.querySelector("canvas") //cria uma variavel para a tag canvas
const ctx = canvas.getContext("2d") //retorna algo que pode ser visto como uma lousa em branco que a gente usa para desenhar coisas na tela

const score = document.querySelector(".score--value")
const finalScore = document.querySelector(".final-score > span")
const menu = document.querySelector(".menu-screen")
const buttonPlay = document.querySelector(".btn-play")

const audio = new Audio('../assets/audio.mp3')

const size = 30

const initialPosition = { x: 270, y:240}

let snake = [initialPosition]

const incrementScore = () => { // soma o score
    score.innerText = +score.innerText + 10
}

const randomNumber = (min, max) => { //gera um número aleatório com um minimo e maximo
    return Math.round(Math.random() * (max - min)+ min)
}

const randomPosition = () => { //gera uma posição aleatória dentro dos limites
    const number = randomNumber(0, canvas.width - size)
    return Math.round(number / 30) *30
}

const randomColor = () => { //gera uma cor aleatória
    const red = randomNumber(0, 255)
    const green = randomNumber(0, 255)
    const blue = randomNumber(0, 255)

    return `rgb(${red}, ${green}, ${blue})`
}

const food = { //gera em uma posição e cor aleatória
    x: randomPosition(),
    y: randomPosition(),
    color: randomColor()
}

let direction, loopId

const drawFood = () => { //desenha a comida

    const { x, y, color } = food //desestruturação de objetos

    ctx.shadowColor = color //define a cor da sombra como a mesma cor do alimento
    ctx.shadowBlur = 6 //aplica um desfoque à sombra
    ctx.fillStyle = food.color //define a cor do alimento
    ctx.fillRect(food.x, food.y, size, size) //desenha a comida
    ctx.shadowBlur = 0 //Remove o desfoque de sombra depois de desenhar
}

const drawSnake = () => { //desenha a cobra
    ctx.fillStyle = "#ddd" //cor do corpo da cobra
    
    snake.forEach((position, index) => { //itera sobre cada parte do corpo da cobra (um array de posições x e y)

        if (index == snake.length - 1) { //verifica se é o último elemento do array, ou seja, a cabeça da cobra
            ctx.fillStyle = "white" //cor da cabeça da cobra
        }
        ctx.fillRect(position.x, position.y, size, size) //desenha um quadrado em determinadas coordenadas x e y, e define o tamanho
    })
}

const moveSnake = () => { //implementa o movimento da cobra
    if (!direction) return // se ainda não há direção definida, não faz nada

    const head = snake[snake.length -1] //pega a cabeça atual da cobra
    
    snake.shift() //remove o primeiro segmento do corpo (o "rabo")

    // move a cabeça para a nova direção, adicionando uma nova posição no final
    if (direction == "right") {
        snake.push({ x: head.x + size, y: head.y})
    }

    if (direction == "left") {
        snake.push({ x: head.x - size, y: head.y})
    }

    if (direction == "down") {
        snake.push({ x: head.x, y: head.y + size})
    }

    if (direction == "up") {
        snake.push({ x: head.x, y: head.y - size})
    }
}

const drawGrid = () => { //desenha uma grade
    ctx.lineWidth = 1 //define a espessura das linhas
    ctx.strokeStyle = "#191919" //define a cor das linhas

    for (let i = 30; i < canvas.width; i += 30) {
        ctx.beginPath() //indica que uma linha será traçada
        ctx.lineTo(i, 0) //linha vertical de cima
        ctx.lineTo(i, 600) //até embaixo
        ctx.stroke()

        ctx.beginPath()
        ctx.lineTo(0, i) //linha horizontal da esquerda
        ctx.lineTo(600, i)// até a direita
        ctx.stroke()
    }

    
}

const checkEat = () => {
    const head = snake[snake.length - 1]

    if (head.x == food.x && head.y == food.y) {
        incrementScore()
        snake.push(head)
        audio.play()

        let x = randomPosition()
        let y = randomPosition()

        while (snake.find((position) => position.x == x && position.y == y)) {
            x = randomPosition()
            y = randomPosition()
        }

        food.x = x
        food.y = y
        color = randomColor
    }
}

const checkCollision = () => {
    const head = snake[snake.length - 1]
    const canvasLimit = canvas.width - size
    const neckIndex = snake.length - 2

    const wallCollision = head.x < 0 || head.x > canvasLimit || head.y < 0 || head.y > canvasLimit

    const selfCollision = snake.find((position, index) => {
        return index < neckIndex && position.x == head.x && position.y == head.y
    })

    if (wallCollision || selfCollision) {
        gameOver()
    }
}

const gameOver = () => {
    direction = undefined

    menu.style.display = "flex"
    finalScore.innerText = score.innerText
    canvas.style.filter = "blur(2px)"
}

const gameLoop = () => {
    clearInterval(loopId)

    ctx.clearRect(0, 0, 600, 600)
    drawGrid()
    drawFood()
    moveSnake()
    drawSnake()
    checkEat()
    checkCollision()

    loopId = setTimeout(() => {
        gameLoop()
    } , 300)
}

gameLoop()

document.addEventListener("keydown", ({ key }) => {
    if (key == "ArrowRight" && direction != "left") {
        direction = "right"
    }

    if (key == "ArrowLeft" && direction != "left") {
        direction = "left"
    }

    if (key == "ArrowDown" && direction != "up") {
        direction = "down"
    }

    if (key == "ArrowUp" && direction != "down") {
        direction = "up"
    }
})

buttonPlay.addEventListener("click", () => {
    score.innerText = "00"
    menu.style.display = "none"
    canvas.style.filter = "none"

    snake = [initialPosition]
})