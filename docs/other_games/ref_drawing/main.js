title = "";

description = `
`;

characters = [
  `
llllll
ll l l
ll l l
llllll
 l  l
 l  l
`,
];

options = {
  isShowingScore: false,
  viewSize: { x: 200, y: 100 },
};

let drawingButtons;
let currentDrawing;
let currentColor;
let colorButtons;
const drawingFunctions = {
  box: box,
  rect: rect,
  bar: bar,
  line: line,
  arc: arc,
  text: text,
  char: char,
};

function update() {
  if (ticks === 0) {
    currentDrawing = "box";
    currentColor = "red";
    drawingButtons = Object.keys(drawingFunctions).map((d, i) =>
      getButton({
        pos: vec(115, 10 + i * 9),
        size: vec(38, 7),
        text: d,
        isToggle: true,
        onClick: () => {
          currentDrawing = d;
        },
      })
    );
    drawingButtons.forEach((db) => (db.toggleGroup = drawingButtons));
    drawingButtons[0].isSelected = true;
    colorButtons = [
      "red",
      "green",
      "yellow",
      "blue",
      "purple",
      "cyan",
      "black",
    ].map((c, i) =>
      getButton({
        pos: vec(160, 10 + i * 9),
        size: vec(38, 7),
        text: c,
        isToggle: true,
        onClick: () => {
          currentColor = c;
        },
      })
    );
    colorButtons.forEach((cb) => (cb.toggleGroup = colorButtons));
    colorButtons[0].isSelected = true;
  }
  let params;
  if (currentDrawing === "box") {
    params = [
      50,
      50,
      floor((input.pos.x - 50) * 2),
      floor((input.pos.y - 50) * 2),
    ];
  } else if (currentDrawing === "rect") {
    params = [50, 50, floor(input.pos.x - 50), floor(input.pos.y - 50)];
  } else if (currentDrawing === "bar") {
    params = [
      50,
      50,
      floor(input.pos.distanceTo(50, 50) * 2),
      5,
      floor(input.pos.angleTo(50, 50) * 100) / 100,
      0.5,
    ];
  } else if (currentDrawing === "line") {
    params = [50, 50, floor(input.pos.x), floor(input.pos.y), 5];
  } else if (currentDrawing === "arc") {
    const ip = vec(input.pos).sub(50, 50);
    params = [50, 50, floor(ip.length), 5, 0, floor(ip.angle * 10) / 10];
  } else {
    params = ["a", floor(input.pos.x), floor(input.pos.y)];
  }
  color(currentColor);
  drawingFunctions[currentDrawing].apply(this, params);
  color("blue");
  text("drawing", 115, 5, { isSmallText: true });
  text("color", 160, 5, { isSmallText: true });
  drawingButtons.forEach((db) => updateButton(db));
  colorButtons.forEach((cb) => updateButton(cb));
  color("black");
  text(`color("${currentColor}");`, 5, 5, { isSmallText: true });
  text(`${currentDrawing}(`, 5, 12, { isSmallText: true });
  if (params.length <= 4) {
    const l = params
      .map((p, i) => {
        const q =
          (currentDrawing === "text" || currentDrawing === "char") && i === 0
            ? `"`
            : "";
        return `${q}${p}${q}${i < params.length - 1 ? ", " : ""}`;
      })
      .join("");
    text(`${l}`, 12, 19, { isSmallText: true });
    text(");", 5, 26, { isSmallText: true });
  } else {
    let l1 = "",
      l2 = "";
    params.forEach((p, i) => {
      if (i < 4) {
        l1 += `${p}, `;
      } else {
        l2 += `${p}${i < params.length - 1 ? ", " : ""}`;
      }
    });
    text(l1, 12, 19, { isSmallText: true });
    text(`${l2}`, 12, 26, { isSmallText: true });
    text(");", 5, 33, { isSmallText: true });
  }
}
