import Phaser from "phaser";
import { DIFFICULTIES, GAME_DURATION_SECONDS, MAX_MISSES } from "@/lib/constants";
import { getPlayground } from "@/lib/playgrounds";
import type { Difficulty, GameStats, ObjectColor, ObjectTheme, PlaygroundId, RuntimeGameUpdate } from "@/types/game";
import { randomInt, sampleUnique } from "@/utils/random";
import { calculateAccuracy, calculateHitScore } from "@/utils/scoring";

interface WhackSceneConfig {
  rows: number;
  cols: number;
  difficulty: Difficulty;
  playground: PlaygroundId;
  objectTheme: ObjectTheme;
  objectColor: ObjectColor;
  onUpdate: (update: RuntimeGameUpdate) => void;
  onGameOver: (stats: GameStats) => void;
  onSound: (sound: "hit" | "combo" | "gameover") => void;
}

interface ActiveTarget {
  holeIndex: number;
  group: Phaser.GameObjects.Container;
  isCactus: boolean;
  deadline: number;
}

const palette: Record<Exclude<ObjectColor, "random">, number> = {
  red: 0xfb7185,
  blue: 0x38bdf8,
  green: 0x4ade80,
  yellow: 0xfacc15,
  purple: 0xc084fc
};

export class WhackScene extends Phaser.Scene {
  private settings: WhackSceneConfig;
  private holes: { x: number; y: number; radius: number }[] = [];
  private activeTargets = new Map<number, ActiveTarget>();
  private recentPositions: number[] = [];
  private spawnEvent?: Phaser.Time.TimerEvent;
  private timerEvent?: Phaser.Time.TimerEvent;
  private score = 0;
  private hits = 0;
  private misses = 0;
  private combo = 0;
  private highestCombo = 0;
  private elapsedSeconds = 0;
  private ended = false;

  constructor(settings: WhackSceneConfig) {
    super("WhackScene");
    this.settings = settings;
  }

  create() {
    this.cameras.main.setBackgroundColor("rgba(0,0,0,0)");
    this.drawBoard();
    this.startTimers();
    this.emitUpdate();
  }

  update(time: number) {
    if (this.ended) {
      return;
    }

    for (const target of [...this.activeTargets.values()]) {
      if (target.deadline <= time) {
        this.removeTarget(target.holeIndex, !target.isCactus);
      }
    }
  }

  private drawBoard() {
    const theme = getPlayground(this.settings.playground);
    const width = this.scale.width;
    const height = this.scale.height;
    const gap = Math.min(width / (this.settings.cols + 1), height / (this.settings.rows + 1));
    const radius = Math.max(14, Math.min(38, gap * 0.28));
    const startX = width / 2 - ((this.settings.cols - 1) * gap) / 2;
    const startY = height / 2 - ((this.settings.rows - 1) * gap) / 2;

    this.add
      .rectangle(width / 2, height / 2, width - 6, height - 6, 0xffffff, 0.035)
      .setStrokeStyle(2, Phaser.Display.Color.HexStringToColor(theme.accent).color, 0.28);

    for (let row = 0; row < this.settings.rows; row += 1) {
      for (let col = 0; col < this.settings.cols; col += 1) {
        const x = startX + col * gap;
        const y = startY + row * gap;
        const holeIndex = row * this.settings.cols + col;
        this.holes[holeIndex] = { x, y, radius };
        this.add.ellipse(x, y + radius * 0.28, radius * 2.35, radius * 0.92, 0x020617, 0.72);
        this.add.ellipse(x, y, radius * 2.1, radius * 1.05, Phaser.Display.Color.HexStringToColor(theme.hole).color, 0.96);
        this.add.ellipse(x, y - radius * 0.1, radius * 1.58, radius * 0.54, 0xffffff, 0.045);
      }
    }
  }

  private startTimers() {
    const difficulty = DIFFICULTIES[this.settings.difficulty];
    this.spawnEvent = this.time.addEvent({
      delay: difficulty.spawnInterval,
      loop: true,
      callback: () => this.spawnWave()
    });

    this.timerEvent = this.time.addEvent({
      delay: 1000,
      loop: true,
      callback: () => {
        this.elapsedSeconds += 1;
        this.emitUpdate();
        if (this.elapsedSeconds >= GAME_DURATION_SECONDS) {
          this.endGame("manual");
        }
      }
    });

    this.spawnWave();
  }

  private spawnWave() {
    if (this.ended) {
      return;
    }

    const difficulty = DIFFICULTIES[this.settings.difficulty];
    const pressure = 1 + Math.min(this.elapsedSeconds / GAME_DURATION_SECONDS, 1) * 0.42;
    const available = this.holes.map((_, index) => index).filter((index) => !this.activeTargets.has(index));
    const maxDesired = Math.min(difficulty.maxActive[1], available.length);
    const minDesired = Math.min(difficulty.maxActive[0], maxDesired);
    if (maxDesired <= 0) {
      return;
    }

    const targetCount = Math.min(maxDesired, randomInt(minDesired, maxDesired));
    const positions = sampleUnique(available, targetCount, this.recentPositions);
    this.recentPositions = [...positions, ...this.recentPositions].slice(0, Math.max(4, this.settings.cols));

    positions.forEach((holeIndex) => {
      const isCactus = Math.random() < difficulty.cactusChance * pressure;
      const visibleDuration = Math.max(420, difficulty.visibleDuration / pressure);
      this.createTarget(holeIndex, isCactus, visibleDuration);
    });
  }

  private createTarget(holeIndex: number, isCactus: boolean, duration: number) {
    const hole = this.holes[holeIndex];
    const color = this.pickColor();
    const group = this.add.container(hole.x, hole.y + hole.radius * 0.6);

    if (isCactus) {
      const body = this.add.rectangle(0, -hole.radius * 0.35, hole.radius * 0.72, hole.radius * 1.55, 0x16a34a, 1);
      const armLeft = this.add.rectangle(-hole.radius * 0.45, -hole.radius * 0.45, hole.radius * 0.28, hole.radius * 0.72, 0x22c55e, 1);
      const armRight = this.add.rectangle(hole.radius * 0.45, -hole.radius * 0.18, hole.radius * 0.28, hole.radius * 0.62, 0x22c55e, 1);
      group.add([body, armLeft, armRight]);
    } else {
      const body = this.add.ellipse(0, -hole.radius * 0.45, hole.radius * 1.35, hole.radius * 1.55, color, 1);
      const face = this.add.circle(0, -hole.radius * 0.57, hole.radius * 0.44, 0xffffff, 0.18);
      const leftEye = this.add.circle(-hole.radius * 0.22, -hole.radius * 0.62, hole.radius * 0.065, 0x020617, 1);
      const rightEye = this.add.circle(hole.radius * 0.22, -hole.radius * 0.62, hole.radius * 0.065, 0x020617, 1);
      const label = this.add
        .text(0, -hole.radius * 0.22, this.targetGlyph(), { fontFamily: "Arial", fontSize: `${Math.max(13, hole.radius * 0.58)}px` })
        .setOrigin(0.5);
      group.add([body, face, leftEye, rightEye, label]);
    }

    const hitZone = this.add.circle(0, -hole.radius * 0.45, hole.radius * 1.25, 0xffffff, 0.001);
    hitZone.setInteractive({ useHandCursor: true });
    hitZone.on("pointerdown", () => this.handleTargetClick(holeIndex));
    group.add(hitZone);
    group.scale = 0.1;
    this.tweens.add({ targets: group, y: hole.y - hole.radius * 0.2, scale: 1, ease: "Back.Out", duration: 150 });
    this.activeTargets.set(holeIndex, {
      holeIndex,
      group,
      isCactus,
      deadline: this.time.now + duration
    });
  }

  private handleTargetClick(holeIndex: number) {
    const target = this.activeTargets.get(holeIndex);
    if (!target || this.ended) {
      return;
    }

    if (target.isCactus) {
      this.cameras.main.shake(260, 0.018);
      this.settings.onSound("gameover");
      this.endGame("cactus");
      return;
    }

    const difficulty = DIFFICULTIES[this.settings.difficulty];
    this.hits += 1;
    this.combo += 1;
    this.highestCombo = Math.max(this.highestCombo, this.combo);
    this.score += calculateHitScore(difficulty.scoreMultiplier, this.combo, this.elapsedSeconds);
    this.settings.onSound(this.combo > 0 && this.combo % 5 === 0 ? "combo" : "hit");
    this.burst(target.group.x, target.group.y, 0xffffff);
    this.removeTarget(holeIndex, false);
    this.emitUpdate();
  }

  private removeTarget(holeIndex: number, countMiss: boolean) {
    const target = this.activeTargets.get(holeIndex);
    if (!target) {
      return;
    }

    this.activeTargets.delete(holeIndex);
    this.tweens.add({
      targets: target.group,
      y: target.group.y + 18,
      alpha: 0,
      scale: 0.25,
      duration: 120,
      onComplete: () => target.group.destroy()
    });

    if (countMiss && !this.ended) {
      this.misses += 1;
      this.combo = 0;
      this.emitUpdate();
      if (this.misses >= MAX_MISSES) {
        this.endGame("misses");
      }
    }
  }

  private burst(x: number, y: number, color: number) {
    for (let index = 0; index < 10; index += 1) {
      const dot = this.add.circle(x, y, randomInt(2, 4), color, 0.8);
      this.tweens.add({
        targets: dot,
        x: x + randomInt(-38, 38),
        y: y + randomInt(-48, 18),
        alpha: 0,
        scale: 0,
        duration: 320,
        onComplete: () => dot.destroy()
      });
    }
  }

  private pickColor() {
    if (this.settings.objectColor === "random") {
      const colors = Object.values(palette);
      return colors[randomInt(0, colors.length - 1)];
    }

    return palette[this.settings.objectColor];
  }

  private targetGlyph() {
    const glyphs: Record<ObjectTheme, string[]> = {
      animals: ["M", "B", "F", "P"],
      fruits: ["A", "C", "L", "B"],
      monsters: ["!", "?", "#", "*"],
      robots: ["01", "AI", "RX", "ZX"],
      random: ["M", "A", "!", "01"]
    };
    const set = glyphs[this.settings.objectTheme];
    return set[randomInt(0, set.length - 1)];
  }

  private emitUpdate() {
    this.settings.onUpdate({
      score: this.score,
      misses: this.misses,
      combo: this.combo,
      highestCombo: this.highestCombo,
      hits: this.hits,
      elapsedSeconds: this.elapsedSeconds,
      accuracy: calculateAccuracy(this.hits, this.misses)
    });
  }

  private endGame(reason: GameStats["gameOverReason"]) {
    if (this.ended) {
      return;
    }

    this.ended = true;
    this.spawnEvent?.remove(false);
    this.timerEvent?.remove(false);
    this.activeTargets.forEach((target) => target.group.destroy());
    this.activeTargets.clear();
    this.settings.onGameOver({
      score: this.score,
      hits: this.hits,
      misses: this.misses,
      combo: this.combo,
      highestCombo: this.highestCombo,
      elapsedSeconds: this.elapsedSeconds,
      accuracy: calculateAccuracy(this.hits, this.misses),
      difficulty: this.settings.difficulty,
      playground: this.settings.playground,
      gameOverReason: reason
    });
  }
}
