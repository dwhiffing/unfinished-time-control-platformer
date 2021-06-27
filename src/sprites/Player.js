import { Bullet } from './Bullet'

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, object) {
    super(scene, object.x, object.y, 'tilemap')
    this.scene = scene
    this.walk = this.walk.bind(this)
    this.stop = this.stop.bind(this)
    this.die = this.die.bind(this)
    this.jump = this.jump.bind(this)
    scene.add.existing(this)
    scene.physics.world.enable(this)
    this.body.setGravityY(500)
    this.direction = { left: false, right: false, up: false, down: false }

    this.type = object.name
    this.name = 'player'
    this.canShoot = true
    this.canMove = true
    this.unlocks = {
      speed: 1,
      health: 1,
      armor: 0,
      jump: 0,
      gun: 1,
    }
    this.jumpCount = 1

    this.gun = this.scene.add
      .image(this.x, this.y, 'tilemap', 52)
      .setDepth(99)
      .setAlpha(0)

    this.body.setMaxVelocity(600, 600)
    this.body.useDamping = true
    this.setDrag(0.8, 1)
    this.setSize(7, 11)
    this.setOffset(5, 5)
    this.setDepth(2)
    this.setAlpha(1)

    this.particles = this.scene.add.particles('tilemap')
    this.jumpEmitter = this.particles.createEmitter(JUMP_PARTICLE_CONFIG).stop()
    this.walkEmitter = this.particles.createEmitter(WALK_PARTICLE_CONFIG).stop()

    this.speed = 90
    this.maxHealth = 100
    this.health = this.maxHealth
    // this.scene.ammoText.text = this.ammo.toString()
    this.scene.healthText.text = this.health.toString()

    this.bullets = scene.add.group({
      classType: Bullet,
      maxSize: 10,
      runChildUpdate: true,
    })

    scene.cameras.main.startFollow(this, true, 0.1, 0.1, 0, 5)

    scene.anims.create({
      key: `idle`,
      frameRate: 4,
      repeat: -1,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 153,
        end: 154,
      }),
    })
    this.walkAnim = scene.anims.create({
      key: `walk`,
      frameRate: 6,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 151,
        end: 152,
      }),
    })
    scene.anims.create({
      key: `jump`,
      frameRate: 5,
      frames: scene.anims.generateFrameNames('tilemap', {
        start: 155,
        end: 156,
      }),
    })
  }

  walk() {
    if (!this.canMove) return
    let speed = this.speed

    if (this.body.onFloor()) {
      if (!this.walkEmitter.on) {
        this.walkEmitter.flow(300 - 100)
        if (!this.runSoundCallback) {
          this.runSoundCallback = this.scene.time.addEvent({
            delay: 500 - 120,
            repeat: -1,
            callback: () => {
              this.scene.sound.play('hit2', {
                rate: Phaser.Math.RND.between(3, 6) / 10,
                volume: 0.2,
              })
            },
          })
        }
      }
      this.anims.play(`walk`, true)
    }
    if (
      this.body.onFloor() ||
      (this.body.velocity.x < speed && this.body.velocity.x > -speed)
    ) {
      const velo = this.direction.left
        ? -speed
        : this.direction.right
        ? speed
        : 0
      this.body.setVelocityX(velo)
    }

    this.flipX = this.direction.left
  }

  stop() {
    if (!this.canMove) return
    if (this.body.onFloor()) {
      this.walkEmitter.stop()
      this.anims.play(`idle`, true)
    }
  }

  update() {
    if (!this.body) return

    this.walkEmitter.setPosition(this.x + (this.flipX ? 2 : -2), this.y + 6)
    this.jumpEmitter.setPosition(this.x + (this.flipX ? 2 : -2), this.y + 6)
    this.gun.setPosition(this.x + (this.flipX ? -5 : 5), this.y + 3)
    this.gun.flipX = this.flipX

    if (!this.body.onFloor()) {
      this.inAir = true
      if (this.walkEmitter.on) this.walkEmitter.stop()
    }

    if (this.body.onFloor() && this.inAir) {
      this.inAir = false
      this.jumpCount = 1
      this.jumpEmitter.explode(20)
      this.scene.sound.play('hit2', {
        rate: Phaser.Math.RND.between(9, 10) / 10,
        volume: 0.5,
      })
    } else {
      this.body.setAllowGravity(true)
    }

    if (!this.direction.left && !this.direction.right) {
      this.runSoundCallback && this.runSoundCallback.remove()
      this.runSoundCallback = null
      this.stop()
    } else {
      this.walk()
    }

    if (this.direction.shoot) {
      this.shoot(1, this.direction.shoot)
    }
  }

  unlock(name) {
    this.unlocks[name] = this.unlocks[name] || 0
    this.unlocks[name]++

    this.scene.sound.play('upgrade')

    this.scene.upgradeText.setText(`${upgradeText} UPGRADE ${extraText}`)
    this.scene.time.addEvent({
      delay: 6000,
      callback: () => this.scene.upgradeText.setText(''),
    })
  }

  heal(amount) {
    this.health += amount
    if (this.health > this.maxHealth) {
      this.health = this.maxHealth
    }

    this.scene.healthText.text = this.health.toString()
  }

  jump(amount) {
    this.direction.jump = false

    if (!this.canMove) return
    if (this.direction.down && this.canFall) {
      return this.fall()
    }

    if (this.jumpCount > 0) {
      this.jumpCount--
      this.jumpEmitter.explode(20)
      this.scene.sound.play('jump', {
        rate: Phaser.Math.RND.between(8, 10) / 10,
      })
      if (this.anims) this.anims.play(`jump`, true)

      const diff = (amount + 80) / 240
      this.body && this.body.setVelocityY(-200 * diff)
    }
  }

  fall() {
    if (this.body.onFloor() && this.canFall) {
      this.body.setVelocityY(20)
      this.scene.level.playerCollider.active = false
      this.scene.time.addEvent({
        delay: 400,
        callback: () => {
          this.scene.level.playerCollider.active = true
        },
      })
    }
  }

  damage(amount) {
    if (this.justDamaged) return

    this.justDamaged = true
    this.scene.cameras.main.shake(100, 0.015)
    this.health -= amount
    this.setTintFill(0xffffff)
    this.scene.sound.play('hit', {
      rate: Phaser.Math.RND.between(8, 10) / 10,
    })
    if (this.health <= 0) this.die()

    this.scene.healthText.text = this.health.toString()
    this.setVelocity(this.flipX ? 100 : -100, -100)
    this.canMove = false
    this.scene.time.addEvent({
      delay: 250,
      callback: () => {
        this.canMove = true
        this.clearTint()
      },
    })
    this.scene.time.addEvent({
      delay: 1000,
      callback: () => {
        this.justDamaged = false
      },
    })
  }

  die() {
    this.scene.cameras.main.shake(200, 0.02)
    this.scene.time.addEvent({
      delay: 500,
      callback: () => {
        this.scene.sound.muted = true
        this.scene.scene.restart()
        this.destroy()
      },
    })
  }

  shoot() {
    if (!this.canShoot) return

    const bullet = this.bullets.get()
    if (!bullet) return

    this.canShoot = false
    this.direction.shoot = 0

    this.scene.time.addEvent({
      delay: 200,
      callback: () => (this.canShoot = true),
    })

    const { up, down, left, right } = this.direction
    const dX = up || (down && !(left || right)) ? 0 : this.flipX ? -1 : 1

    bullet.fire(this.x, this.y + 2, dX, up ? -1 : down ? 1 : 0, 50)
    this.scene.sound.play('shoot', {
      rate: Phaser.Math.RND.between(8, 10) / 10,
    })
  }
}

const JUMP_PARTICLE_CONFIG = {
  frame: 15,
  x: 0,
  y: 0,
  lifespan: { min: 300, max: 900 },
  speedX: { min: -30, max: 30 },
  speedY: { min: -20, max: 20 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -10,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.2, end: 0 },
}

const WALK_PARTICLE_CONFIG = {
  frame: 15,
  x: 0,
  y: 0,
  lifespan: { min: 300, max: 900 },
  speedX: { min: -10, max: 10 },
  speedY: { min: -10, max: -2 },
  angle: { min: 0, max: 360 },
  rotate: { min: 0, max: 360 },
  gravityY: -20,
  alpha: { start: 0.5, end: 0 },
  scale: { start: 0.2, end: 0 },
  quantity: 1,
}
