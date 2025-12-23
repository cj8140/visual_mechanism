
let link1length = 100;
let link2length = 100;

let link1Center = {
    x : 200,
    y : 250
}

let link2Center = {
    x : 600,
    y : 250
}

let link1Joint = {
    length : link1length,
    angle  : 90,
    x : 0,
    y : 0
}

let link2Joint = {
    length : 0,
    angle  : 90,
    x : link2Center.x,
    y : link2Center.y - link2length
}

let link1End = {
    length : 200,
    angle  : 0,
    x : 0,
    y : 0
}

let link2End = {
    length : 200,
    angle  : 0,
    x : 0,
    y : 0
}

let link2EndAlter = {
    length : 200,
    angle  : 0,
    x : 0,
    y : 0
}

let limitAngle = {          // last possible angle
    min : 0,
    max : 180
}

let linkLength = 200;

let adder = 1;

let fixedCanvas;

function initializeSliders() {
    const slider1 = document.getElementById('slider1');
    const slider2 = document.getElementById('slider2');
    const slider3 = document.getElementById('slider3');
    const slider4 = document.getElementById('slider4');
    const value1 = document.getElementById('value1');
    const value2 = document.getElementById('value2');
    const value3 = document.getElementById('value3');
    const value4 = document.getElementById('value4');

    function updateMechanism() {
        link1Joint.angle = 90;
        link1Joint.x = link1Center.x;
        link1Joint.y = link1Center.y - link1Joint.length;
        link2Joint.angle = 90;
        link2Joint.x = link2Center.x;
        link2Joint.y = link2Center.y - link2Joint.length;
        linkLength = dist(link1Joint.x, link1Joint.y, link2Joint.x, link2Joint.y);
        drawImage();
    }

    // Slider1 (Link1 Length)
    slider1.addEventListener('input', () => {
        link1length = parseFloat(slider1.value);
        link1Joint.length = link1length;
        value1.value = link1length;
        updateMechanism();
    });
    value1.addEventListener('input', () => {
        link1length = parseFloat(value1.value);
        link1Joint.length = link1length;
        slider1.value = link1length;
        updateMechanism();
    });

    // Slider2 (Link2 Length)
    slider2.addEventListener('input', () => {
        link2length = parseFloat(slider2.value);
        link2Joint.length = link2length;
        value2.value = link2length;
        updateMechanism();
    });
    value2.addEventListener('input', () => {
        link2length = parseFloat(value2.value);
        link2Joint.length = link2length;
        slider2.value = link2length;
        updateMechanism();
    });

    // Slider3 (Link2 Center X)
    slider3.addEventListener('input', () => {
        link2Center.x = parseFloat(slider3.value);
        value3.value = link2Center.x;
        updateMechanism();
    });
    value3.addEventListener('input', () => {
        link2Center.x = parseFloat(value3.value);
        slider3.value = link2Center.x;
        updateMechanism();
    });

    // Slider4 (Link2 Center Y)
    slider4.addEventListener('input', () => {
        link2Center.y = parseFloat(slider4.value);
        value4.value = link2Center.y;
        updateMechanism();
    });
    value4.addEventListener('input', () => {
        link2Center.y = parseFloat(value4.value);
        slider4.value = link2Center.y;
        updateMechanism();
    });
}

function setup() {
    let container = document.getElementById('canvas-container');
    let p = createCanvas(800, 400);
    p.parent('canvas-container');
    fixedCanvas = createGraphics(width, height);
    
    initializeSliders();

    link1Joint.angle = 90;
    link2Joint.angle = 90;
    link2Joint.length = abs(link2Joint.y-link2Center.y);
    link1Joint.x = link1Center.x + link1Joint.length * cos(radians(link1Joint.angle));
    link1Joint.y = link1Center.y - link1Joint.length * sin(radians(link1Joint.angle));
    linkLength = dist(link1Joint.x, link1Joint.y, link2Joint.x, link2Joint.y);
    
    drawImage();
}

function draw() {
    background(250);
    image(fixedCanvas, 0, 0);
    let cal = calculatePoints();

    // Draw Lines
    strokeWeight(3);
    stroke(0);
    // Link1
    line(link1Center.x, link1Center.y, link1End.x, link1End.y);
    // Link2
    line(link2Center.x, link2Center.y, link2End.x, link2End.y);
    // Coupler
    line(link1Joint.x, link1Joint.y, link2Joint.x, link2Joint.y);

    // Draw Points
    strokeWeight(10);
    // Origin points
    stroke(0);
    point(link1Center.x, link1Center.y);
    point(link2Center.x, link2Center.y);

    // Link1 end point
    stroke(255, 0, 0);
    point(link1Joint.x, link1Joint.y);
    // Link2 end point
    stroke(0, 0, 255);
    point(link2Joint.x, link2Joint.y);

    // if(cal) {
    //     link1Joint.angle += adder;
    // }
    // if(cal == false || link1Joint.angle > 180 || link1Joint.angle < 0) {
    //     adder *= -1;
    //     link1Joint.angle += adder*2;
    // }
}
function angleSetter() {
    let x = mouseX;
    let y = mouseY;
    let angle  = degrees(atan2(link1Center.y - y, x - link1Center.x));
    if (angle < 0) angle += 360;
    if(angle < limitAngle.min) angle = limitAngle.min;
    if(angle > limitAngle.max) {
        if(angle > 270)
            angle = limitAngle.min;
        else
            angle = limitAngle.max;
    }
    link1Joint.angle = angle;
    // console.log(calculatePoints(), 'at angle:', angle);
}

function mouseDragged() {
    if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    angleSetter();
}

function mousePressed() {
    if(mouseX < 0 || mouseX > width || mouseY < 0 || mouseY > height) return;
    angleSetter();
}

function calculatePoints() {
    link1Joint.x = link1Center.x + link1Joint.length * cos(radians(link1Joint.angle));
    link1Joint.y = link1Center.y - link1Joint.length * sin(radians(link1Joint.angle));
    link1End.x = link1Center.x + link1End.length * cos(radians(link1Joint.angle));
    link1End.y = link1Center.y - link1End.length * sin(radians(link1Joint.angle));

    // Link2 end point calculation
    let elbow = getElbow(link1Joint, link2Center, linkLength, link2Joint.length, 1);
    if(elbow){
        link2Joint.x = elbow.x;
        link2Joint.y = elbow.y;
        link2Joint.angle = -degrees(atan2(link2Joint.y - link2Center.y, link2Joint.x - link2Center.x));
        link2End.x = link2Center.x + link2End.length * cos(radians(link2Joint.angle));
        link2End.y = link2Center.y - link2End.length * sin(radians(link2Joint.angle));
        link2EndAlter.x = elbow.x_alter;
        link2EndAlter.y = elbow.y_alter;
        return true;
    }
    return false;
}

function drawImage() {
    fixedCanvas.background(240);
    adder = 2;
    link1Joint.angle = 0;
    while( !calculatePoints() ) {
        link1Joint.angle+=0.01;
    }
    console.log("initial angle:", link1Joint.angle);
    limitAngle.min = link1Joint.angle;
    while(calculatePoints() && link1Joint.angle <= 360) {
        fixedCanvas.strokeWeight(3);
        fixedCanvas.stroke(255, 0,0);
        fixedCanvas.point(link1Joint.x, link1Joint.y);
        fixedCanvas.point(link1End.x, link1End.y);
        // Link2 end point
        fixedCanvas.stroke(0, 0, 255);
        fixedCanvas.point(link2Joint.x, link2Joint.y);
        fixedCanvas.point(link2End.x, link2End.y);
        link1Joint.angle += adder;
    }
    console.log("final angle:", link1Joint.angle);
    link1Joint.angle -= adder;
    limitAngle.max = link1Joint.angle;
    adder = 0.5;
    link1Joint.angle = 90;
    console.log("Image Completed");
}

function getElbow(P1, P2, r1, r2) {
    let dx = P2.x - P1.x;
    let dy = P2.y - P1.y;
    let d = sqrt(dx * dx + dy * dy);

    // 1. 기구학적 한계 체크 (링크가 닿지 않는 경우)
    if (d > r1 + r2 || d < abs(r1 - r2)) {
        return null; 
    }

    // 2. 수학적 중간값 a, h 계산
    let a = (r1 * r1 - r2 * r2 + d * d) / (2 * d);
    let h = sqrt(max(0, r1 * r1 - a * a));

    // 3. 수선의 발 P0 계산
    let x0 = P1.x + (a * dx) / d;
    let y0 = P1.y + (a * dy) / d;

    // 4. 최종 좌표 계산 (flip이 1이면 위쪽, -1이면 아래쪽 해 선택)
    let rx = (dy * h) / d;
    let ry = -(dx * h) / d;

    return {
        x: x0 + rx,
        y: y0 + ry,
        x_alter: x0 - rx,
        y_alter: y0 - ry
    };
}