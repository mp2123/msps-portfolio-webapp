"use client";

type TrailNode = {
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type TrailLine = {
  spring: number;
  friction: number;
  nodes: TrailNode[];
};

const settings = {
  friction: 0.5,
  trails: 80,
  size: 50,
  dampening: 0.025,
  tension: 0.99,
};

const position = { x: 0, y: 0 };

function createNode(): TrailNode {
  return { x: position.x, y: position.y, vx: 0, vy: 0 };
}

function createLine(spring: number): TrailLine {
  return {
    spring: spring + 0.1 * Math.random() - 0.05,
    friction: settings.friction + 0.01 * Math.random() - 0.005,
    nodes: Array.from({ length: settings.size }, createNode),
  };
}

function updateLine(line: TrailLine) {
  let spring = line.spring;
  let node = line.nodes[0];

  node.vx += (position.x - node.x) * spring;
  node.vy += (position.y - node.y) * spring;

  for (let index = 0; index < line.nodes.length; index += 1) {
    node = line.nodes[index];

    if (index > 0) {
      const previous = line.nodes[index - 1];
      node.vx += (previous.x - node.x) * spring;
      node.vy += (previous.y - node.y) * spring;
      node.vx += previous.vx * settings.dampening;
      node.vy += previous.vy * settings.dampening;
    }

    node.vx *= line.friction;
    node.vy *= line.friction;
    node.x += node.vx;
    node.y += node.vy;
    spring *= settings.tension;
  }
}

function drawLine(ctx: CanvasRenderingContext2D, line: TrailLine) {
  let x = line.nodes[0].x;
  let y = line.nodes[0].y;

  ctx.beginPath();
  ctx.moveTo(x, y);

  for (let index = 1; index < line.nodes.length - 2; index += 1) {
    const node = line.nodes[index];
    const next = line.nodes[index + 1];
    x = 0.5 * (node.x + next.x);
    y = 0.5 * (node.y + next.y);
    ctx.quadraticCurveTo(node.x, node.y, x, y);
  }

  const penultimate = line.nodes[line.nodes.length - 2];
  const last = line.nodes[line.nodes.length - 1];
  ctx.quadraticCurveTo(penultimate.x, penultimate.y, last.x, last.y);
  ctx.stroke();
  ctx.closePath();
}

function updatePosition(event: MouseEvent | TouchEvent) {
  if ("touches" in event && event.touches.length > 0) {
    position.x = event.touches[0].pageX;
    position.y = event.touches[0].pageY;
  } else if ("clientX" in event) {
    position.x = event.clientX;
    position.y = event.clientY;
  }
}

export function renderCanvas() {
  const canvas = document.getElementById("canvas");
  if (!(canvas instanceof HTMLCanvasElement)) return;

  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let running = true;
  let huePhase = Math.random() * 2 * Math.PI;
  let lines: TrailLine[] = [];

  const resetLines = () => {
    lines = Array.from({ length: settings.trails }, (_, index) =>
      createLine(0.45 + (index / settings.trails) * 0.025),
    );
  };

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const render = () => {
    if (!running) return;

    huePhase += 0.0015;
    const hue = Math.round(285 + Math.sin(huePhase) * 85);

    ctx.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = `hsla(${hue},100%,50%,0.025)`;
    ctx.lineWidth = 10;

    for (const line of lines) {
      updateLine(line);
      drawLine(ctx, line);
    }

    window.requestAnimationFrame(render);
  };

  const startTrail = (event: MouseEvent | TouchEvent) => {
    updatePosition(event);
    resetLines();
    render();
    document.removeEventListener("mousemove", startTrail);
    document.removeEventListener("touchstart", startTrail);
    document.addEventListener("mousemove", updatePosition);
    document.addEventListener("touchmove", updatePosition);
  };

  resizeCanvas();
  document.addEventListener("mousemove", startTrail);
  document.addEventListener("touchstart", startTrail);
  window.addEventListener("resize", resizeCanvas);
  window.addEventListener("focus", () => {
    running = true;
    render();
  });
  window.addEventListener("blur", () => {
    running = false;
  });
}
