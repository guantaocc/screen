/**
 * 绘制九宫格
 */

// 枚举的cursor
const EW_RESIZE = "ew-resize"
const NW_RESIZE = "nw-resize"
const NE_RESIZE = "ne-resize"
const NS_RESIZE = "ns-resize"

// 裁剪区域的8个点
class Point {
  constructor(x, y, direction, cursor) {
    this.x = x
    this.y = y
    this.direction = direction
    this.cursor = cursor
  }
}

function caller(fn, self){
  return function(){
    let [event, ...args] = arguments
    fn.call(event, event, self, ...args)
  }
}

export default class PageScreenshot {
  constructor(options) {
    this.init()
    this.options = { ...options, ...this.options }
    const { zIndex } = this.options;
    this.loadingDom.className = "page-screenshot-spinner";
    this.loadingDom.style.zIndex = zIndex + "";
    this.loadingDom.setAttribute("data-html2canvas-ignore", "true");
    this.loadingDom.innerHTML = `
    <div class="spinner">
        <div class="spinner-container container1">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
        <div class="spinner-container container2">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
        <div class="spinner-container container3">
            <div class="circle1"></div>
            <div class="circle2"></div>
            <div class="circle3"></div>
            <div class="circle4"></div>
        </div>
    </div>`;
    this.initMask()
  }

  init() {
    this.options = {
      dotRadius: 3,
      borderColor: "red",
      saveFileName: "截图",
      zIndex: 5000,
      ignoreElements: () => false
    }
    this.loadingDom = document.createElement("div")
    this.maskCanvas = document.createElement("canvas")
    // 起始点在裁剪框的左上角
    this.startPoint = { x: 0, y: 0, direction: 'LEFTOP'}

    // RIGHTOP
    // LEFTBOTTOM
    // RIGHTBOTTOM

    this.points = []
    this.clipInfo = null
    // 包装 this 监听器进行清除
    this.mouseMoveListener = caller(this.onMousemove, this)
  }

  initMask() {
    const { innerWidth, innerHeight } = window;
    this.maskCanvas.style.position = 'fixed';
    this.maskCanvas.style.top = "0px";
    this.maskCanvas.style.left = "0px";
    this.maskCanvas.style.right = "0px";
    this.maskCanvas.style.bottom = "0px";
    this.maskCanvas.style.zIndex = 4000;
    this.maskCanvas.width = innerWidth;
    this.maskCanvas.height = innerHeight;
    this.addEventListener()
  }

  render(){
    if(this.clipInfo){
      // 更新鼠标移动事件
      this.loadingDom.style.left = this.clipInfo.x + 'px'
      this.loadingDom.style.top = this.clipInfo.y + 'px'
      this.loadingDom.style.width = this.clipInfo.w + 'px'
      this.loadingDom.style.height = this.clipInfo.h + 'px'
    }
  }

  startCapture() {

  }

  addEventListener() {
    document.addEventListener("mousedown", this.onMousedown.bind(this));
    document.addEventListener("mouseup", this.onMouseup.bind(this))
  }

  removeEventListener() {

  }

  onMousedown({ clientX: x, clientY: y }) {
    // 无裁剪区域, 没有点
    if (this.points.length <= 0) {
      this.startPoint = { x: x, y: y, direction: 'LEFTOP' };
    }

    const point = this.mouseInPoints(x, y);
    if (point) {
      this.isDotDrag = true;
      this.startPoint = { x, y };
      this.dotDirection = true == point ? point : point.direction;
    }
    document.addEventListener("mousemove", this.mouseMoveListener);
  }

  // 拖拽
  onMousemove({clientX, clientY}, self) {
    let { x, y } = self.startPoint;
    // console.log(self);
    // 判断方向
    if(clientX >= x){
      self.startPoint.direction = clientY >= y ? 'LEFTOP': 'LEFTBOTTOM'
    } else {
      self.startPoint.direction = clientY >= y ? 'RIGHTOP': 'RIGHTBOTTOM'
    }
    self.clipInfo = {
      x: Math.min(x, clientX),
      y: Math.min(y, clientY),
      w: Math.abs(clientX - x),
      h: Math.abs(clientY - y)
    };
    console.log(x, y);
    self.render()
  }

  // 根据方向计算
  caculateClipPosition(){
    // 上，右, 下, 左四个点的坐标, canvas裁切
    
  }

  // 停止
  onMouseup(){
    this.points = []
    document.removeEventListener("mousemove", this.mouseMoveListener);
    console.log("up");
  }

  mouseInPoints(clientX, clientY) {
    let { dotRadius = 3 } = this.options;
    //当绘画涂鸦区存在绘画时，不允许改变裁剪区域
    if (this.clipInfo) {
      let { x, y, w, h } = this.clipInfo;
      let current = this.points.find(({ x, y }) => clientX > x - dotRadius && clientX < x + dotRadius && clientY < y + dotRadius && clientY > y - dotRadius);
      if (!current) {//鼠标没有落在八个点上，判断是否在裁剪区域内部
        return clientX > x && clientX < x + w && clientY > y && clientY < y + h;
      }
      return current;
    }
    return false;
  }
}
