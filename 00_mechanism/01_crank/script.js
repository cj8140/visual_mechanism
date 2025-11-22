let r1 = 70;
let r2 = 140;
let theta = 0;
let fixedCanvas;
let autoFlag = false;
const thetaMultiplier =25;

const simOrigin = {
    x : 100,
    y : 250
}

const graph = {
    x : 250,
    y : simOrigin.y
}
function setup() {
    createCanvas(600,350);
    fixedCanvas = createGraphics(width, height);

    checkbox = createCheckbox();
    checkbox.position(265, 380);

    slider = createSlider(0, 1000, 200, 1);
    slider.position(265, 350);
    slider.size(316);

    drawGraph(fixedCanvas);

}
function draw() {
    if (checkbox.checked()) auto = 0;
    else auto = 1;
    background(240);
    image(fixedCanvas, 0, 0);

    const p1 = {x: r1 * cos(theta), 
                y: -r1 * sin(theta)};
    const p2 = {x: 0,
                y: -(r1 * sin(theta) + sqrt(r2 * r2 - r1 * r1 * cos(theta) * cos(theta)))};

    const v = abs(r1 * cos(theta) - (r1 * r1 * cos(theta) * sin(theta)) / sqrt(r2 * r2 - r1 * r1 * cos(theta) * cos(theta)));
    stroke(0);
    strokeWeight(3);
    line(simOrigin.x , simOrigin.y, p1.x + simOrigin.x, p1.y + simOrigin.y);
    line(p1.x + simOrigin.x, p1.y + simOrigin.y, p2.x + simOrigin.x, p2.y + simOrigin.y);
    strokeWeight(2);
    stroke(0,0,0,100);
    line(graph.x + theta*thetaMultiplier, graph.y+10, graph.x + theta*thetaMultiplier, graph.y + p2.y);
    line(p2.x + simOrigin.x, p2.y + simOrigin.y, graph.x + theta*thetaMultiplier, graph.y + p2.y);
    strokeWeight(11);
    stroke(0);
    point(simOrigin.x, simOrigin.y);
    point(p1.x + simOrigin.x, p1.y + simOrigin.y);
    point(p2.x + simOrigin.x, p2.y + simOrigin.y);
    point(graph.x + theta*thetaMultiplier, graph.y + p2.y);
    if(auto) {
        theta += slider.value() / 7000;
        strokeWeight(0);
        fill(0);
        textSize(15);
        text("자동 모드. 슬라이드바로 속도 조절", 270, 337);
        autoFlag = true;
    }
    else {
        if(autoFlag) {
            slider.value(map(theta, 0, 4 * PI, 0, 1000));
        }
        autoFlag = false;
        theta = map(slider.value(), 0, 1000, 0, 4 * PI);
        strokeWeight(0);
        fill(0);
        textSize(15);
        text("수동 모드. 슬라이드바로 각도 조절",  270, 337)
    }
    if(theta > 4 * PI) {
        theta = 0;
    }
}

function drawGraph(canvas) {
    canvas.background(255);
    const maxTheta = 4 * PI;

    //x 눈금
    pis = ["0", "π/2", "π", "3π/2", "2π", "5π/2", "3π", "7π/2", "4π"];
    for (let i = 0; i <= maxTheta; i += PI/2) {
        canvas.strokeWeight(1);
        canvas.stroke(100);
        canvas.line(graph.x + i*thetaMultiplier, graph.y + 10, graph.x + i*thetaMultiplier, graph.y - r1 - r2 - 20);
       
        canvas.noStroke();
        canvas.fill(0);
        canvas.textSize(12);
        canvas.text(pis[i/(PI/2)], graph.x + i*thetaMultiplier - 10, graph.y + 25);
    }
    
    //높이 그래프
    canvas.strokeWeight(2);
    canvas.stroke(0);
    let max = 0;
    //최대값 구하기
    for (let i = 0; i <= maxTheta; i+= 0.001) {
        const v = abs(r1 * cos(i) - (r1 * r1 * cos(i) * sin(i)) / sqrt(r2 * r2 - r1 * r1 * cos(i) * cos(i)));
        if(v > max) {
            max = v;
        }
    }
    //그래프 그리기
    for (let i = 0; i <= maxTheta; i+= 0.001) {
        const p1 = {x: r1 * cos(i), 
                y: -r1 * sin(i)};
        const p2 = {x: 0,
                y: -(r1 * sin(i) + sqrt(r2 * r2 - r1 * r1 * cos(i) * cos(i)))};

        const v = - ( r1 * cos(i) + (r1 * r1 * cos(i) * sin(i)) / sqrt(r2 * r2 - r1 * r1 * cos(i) * cos(i)) );
        const absV = abs(v);
        const colorVal = map(absV, 0, max, 240, 0);
        canvas.colorMode(HSB, 360, 100, 100);
        canvas.stroke(colorVal, 60, 100);
        canvas.strokeWeight(2);
        canvas.point(graph.x + i*thetaMultiplier, graph.y + p2.y);
        canvas.strokeWeight(10);
        canvas.point(p1.x + simOrigin.x, p1.y + simOrigin.y);

    }
    canvas.colorMode(RGB, 255);
    //xy축
    canvas.strokeWeight(3);
    canvas.stroke(0);
    canvas.line(graph.x-10, graph.y, graph.x + maxTheta*thetaMultiplier, graph.y);
    canvas.line(graph.x, graph.y+10, graph.x, graph.y - r1 - r2 - 20);
    //큰원
    canvas.strokeWeight(0);
    canvas.fill(245);
    canvas.ellipse(simOrigin.x, simOrigin.y, 2 * r1);

    //고정축
    canvas.strokeWeight(7);
    canvas.stroke(200);
    canvas.line(simOrigin.x, simOrigin.y, simOrigin.x, simOrigin.y - r1 - r2 - 20);

    //원 4분할
    canvas.strokeWeight(1);
    canvas.stroke(120);
    canvas.line(simOrigin.x - r1, simOrigin.y, simOrigin.x + r1, simOrigin.y);
    canvas.line(simOrigin.x, simOrigin.y - r1, simOrigin.x, simOrigin.y + r1);
    
    //원 표기
    canvas.noStroke();
    canvas.fill(0);
    canvas.textSize(12);
    canvas.text("0", simOrigin.x+r1+5, simOrigin.y+5);
    canvas.text("π/2", simOrigin.x-10, simOrigin.y - r1 - 10);
    canvas.text("π", simOrigin.x - r1 - 15, simOrigin.y + 5);
    canvas.text("3π/2", simOrigin.x-13, simOrigin.y + r1 + 16);
}
