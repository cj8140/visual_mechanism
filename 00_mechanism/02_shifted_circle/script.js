let r = 22;
let offset = 20;
let theta = 0;

let fixedCanvas;
let autoFlag = false;

const thetaMultiplier =25;

const motorCenter = {
    x : 100,
    y : 250
}

const graphCenter = {
    x : 250,
    y : motorCenter.y
}

function setup() {
    createCanvas(600,350);
    fixedCanvas = createGraphics(width, height);

    checkbox = createCheckbox();
    checkbox.position(265, 380);

    slider = createSlider(0, 1000, 200, 1);
    slider.position(265, 350);
    slider.size(316);

    slider_r = createSlider(0, 100, r, 1);
    slider_r.position(50, 350);
    slider_r.size(150);

    slider_offset = createSlider(0, 100, offset, 1);
    slider_offset.position(50, 380);
    slider_offset.size(150);

    drawGraph(fixedCanvas);


}
function draw() {
    if (checkbox.checked()) auto = 0;
    else auto = 1;
    background(240);
    image(fixedCanvas, 0, 0);

    if(slider_r.value() != r) {
        r= slider_r.value();
        drawGraph(fixedCanvas);
    }
    if(slider_offset.value() != offset) {
        offset= slider_offset.value();
        drawGraph(fixedCanvas);
    }
    if(offset > r) {
        slider_offset.value(r);
        offset = r;
        drawGraph(fixedCanvas);
    }
    r = slider_r.value();


    theta4draw = -theta;
    const circleCenter = {
        x : motorCenter.x + offset * cos(theta4draw),
        y : motorCenter.y + offset * sin(theta4draw)
    }

    const bottomY = motorCenter.y + sin(theta4draw) * offset - r;
    //모터 원
    strokeWeight(0);
    fill(200);
    ellipse(circleCenter.x, circleCenter.y, 2 * r);


    stroke(0);
    strokeWeight(1);
    line(circleCenter.x , circleCenter.y, motorCenter.x, motorCenter.y);
    strokeWeight(10);
    point(graphCenter.x + theta*thetaMultiplier, bottomY)
    stroke(0);

    
    strokeWeight(3);
    stroke(0);
    line(motorCenter.x-r, bottomY, motorCenter.x+r, bottomY);
    line(motorCenter.x, bottomY, motorCenter.x, bottomY-100);
    //회전 참고용 점들
    strokeWeight(10);
    stroke(255, 0, 0, 150);
    point(circleCenter.x+r*cos(theta4draw), circleCenter.y+r*sin(theta4draw));
    stroke(0, 255, 0, 150);
    point(circleCenter.x+r*cos(theta4draw+PI/2), circleCenter.y+r*sin(theta4draw+PI/2));
    stroke(0, 0, 255, 150);
    point(circleCenter.x+r*cos(theta4draw+PI), circleCenter.y+r*sin(theta4draw+PI));
    stroke(255, 0, 255, 150);
    point(circleCenter.x+r*cos(theta4draw+3*PI/2), circleCenter.y+r*sin(theta4draw+3*PI/2));

    //모터 축
    strokeWeight(7);
    stroke(0);
    point(motorCenter.x, motorCenter.y);

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
    

    canvas.strokeWeight(1);
    canvas.stroke(0);
    canvas.line(graphCenter.x - 50, graphCenter.y, graphCenter.x + maxTheta * thetaMultiplier, graphCenter.y);
    

    canvas.strokeWeight(1);
    canvas.stroke(0,0,0,100);
    canvas.line(graphCenter.x-50, motorCenter.y - r - offset, graphCenter.x + maxTheta * thetaMultiplier, motorCenter.y -r-offset);
    canvas.line(graphCenter.x-50, motorCenter.y - r + offset, graphCenter.x + maxTheta * thetaMultiplier, motorCenter.y -r+offset);
    canvas.line(graphCenter.x-50, motorCenter.y - r, graphCenter.x + maxTheta * thetaMultiplier, motorCenter.y -r);
    canvas.textSize(12);
    canvas.noStroke();
    canvas.fill(0,0,0,100);
    canvas.text("최고 높이=r+offset", graphCenter.x - 60, motorCenter.y - r - offset - 5);
    canvas.text("최저 높이=r-offset", graphCenter.x - 60, motorCenter.y - r + offset - 5);
    canvas.text("중심축=r", graphCenter.x - 60, motorCenter.y - r - 5);
    //높이 그래프
    canvas.strokeWeight(2);
    canvas.stroke(0,0,0,100);
    let max = 0;
    //그래프 그리기
    for (let i = 0; i <= maxTheta; i+= 0.001) {
        bottomY = motorCenter.y - sin(i) * offset - r
        canvas.strokeWeight(2);
        canvas.point(graphCenter.x + i*thetaMultiplier, bottomY);
    }
}
