const canvas = document.querySelector("canvas")
const c = canvas.getContext("2d")

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.2

class Sprite {
    constructor({ position, velocity, color = "red", offset}) {
        this.position = position
        this.velocity = velocity
        this.width = 50
        this.height = 150
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset,
            width: 100,
            height: 50,
        }
        this.color = color
        this.isAttacking
        this.health = 100
    }

    draw() {
        c.fillStyle = this.color
        c.fillRect(this.position.x, this.position.y, this.width, this.height)

        // attack box
        if (this.isAttacking) {
            c.fillStyle = "#e76f51"
            c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)
        }
    }

    update() {
        this.draw()
        this.attackBox.position.x = this.position.x + this.attackBox.offset.x
        this.attackBox.position.y = this.position.y + this.attackBox.offset.y

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        } else this.velocity.y += gravity 
    }

    attack() {
        this.isAttacking = true
        setTimeout(() => {
            this.isAttacking = false
        }, 100);
    }
}

const player = new Sprite({
    position: {
        x: 150,
        y: 150
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "#2a9d8f",
    offset: {
        x: 0,
        y: 0
    }
})

const enemy = new Sprite({
    position: {
        x: canvas.width - 200,
        y: 150
    },
    velocity: {
        x: 0,
        y: 0
    },
    color: "#e9c46a",
    offset: {
        x: -50,
        y: 0
    }
})

const keys = {
    a: {
        pressed: false
    },
    d: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}

function rectanngularColision({
    rectangle1,
    rectangle2
}) {
    return(
        rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
    )
}

function resetGame(){
    window.location.reload();
}

function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = "#264653"
    c.fillRect(0, 0, canvas.width, canvas.height)
    player.update()
    enemy.update()

    player.velocity.x = 0
    enemy.velocity.x = 0
    
    // player movement
    if (keys.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
    } else if (keys.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
    }

    // enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
    } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
    }

    // detect for colision
    if (
        rectanngularColision({
            rectangle1: player,
            rectangle2: enemy
        }) &&
        player.isAttacking
    ) {
        player.isAttacking = false
        enemy.health -= 20
        document.querySelector("#enemyHealth").style.width = enemy.health + "%"
        if (enemy.health <= 0) { 
            setTimeout(() => {
                alert("Player one wins")
                resetGame()
            }, 100);
        }
    }
    if (
        rectanngularColision({
            rectangle1: enemy,
            rectangle2: player
        }) &&
        enemy.isAttacking
    ) {
        enemy.isAttacking = false
        player.health -= 20
        document.querySelector("#playerHealth").style.width = player.health + "%"
        if (player.health <= 0) { 
            setTimeout(() => {
                alert("Player two wins")
                resetGame()
            }, 100);
        }
    }
}

animate()

window.addEventListener("keydown", (event) => {
    switch (event.key) {
        case "w":
            player.velocity.y = -10
            break
        case "a":
            keys.a.pressed = true
            player.lastKey = "a"
            break
        case "d":
            keys.d.pressed = true
            player.lastKey = "d"
            break
        case " ":
            player.attack();
            break

        case "ArrowUp":
            enemy.velocity.y = -10
            break
        case "ArrowRight":
            keys.ArrowRight.pressed = true
            enemy.lastKey = "ArrowRight"
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = true
            enemy.lastKey = "ArrowLeft"
            break
        case "Control":
            enemy.attack();
            break
    }
})

window.addEventListener("keyup", (event) => {
    switch (event.key) {
        case "a":
            keys.a.pressed = false
            break
        case "d":
            keys.d.pressed = false
            break
    }

    // enemy keys
    switch (event.key) {
        case "ArrowRight":
            keys.ArrowRight.pressed = false
            break
        case "ArrowLeft":
            keys.ArrowLeft.pressed = false
            break
    }
})