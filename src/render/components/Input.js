
// 事件监听函数
let wheelFlag1 = true
let wheelFlag2 = false
let wheelClick
let direction=0
function stopWheel() {
    if (wheelFlag2) {
      wheelFlag1 = true
      wheelFlag2 = false
      direction=0
    }
  }
  let event={
    currentKey:null,// 当前摁键
    currentWheel:null//当前滚轮事件
  }
class Input{
    constructor(){
        this._keyMap = {};
        this.events = [];
       
       
        // 添加键盘事件
        this.AddKeyDownListner(this._onKeyDown);
        this.AddKeyUpListner(this._onKeyUp);
        this.AddMouseWheelListener()
    }
    AddMouseWheelListener(){
        document.onmousewheel = this.mouseWheel; // 非火狐
        document.addEventListener('DOMMouseScroll', this.mouseWheel, false) // 火狐
    }
    mouseWheel(event){
        let eventObj = event || window.event
        if (eventObj.wheelDelta) { // 非火狐
          // 滚动距离
          if (wheelFlag1) {
            if (eventObj.wheelDelta > 0) {
              event.currentWheel='up'
              direction=-1

            } else {
              direction=1
             event.currentWheel='down'
            }
            wheelFlag1 = false
            wheelFlag2 = true
            wheelClick = setTimeout(stopWheel, 200)
          } else {
            clearTimeout(wheelClick)
            wheelClick = setTimeout(stopWheel, 150)
          }
  
        } else if (eventObj.detail) {
           // 事件对象
        //   console.log(eventObj)
          // 滚动距离
        //   console.log(eventObj.detail)
          if (wheelFlag1) {
            if (eventObj.detail > 0) {
            } else {
            }
            this.wheelFlag1 = false
            this.wheelFlag2 = true
            this.wheelClick = setTimeout(this.stopWheel, 200)
          } else {
            clearTimeout(this.wheelClick)
            this.wheelClick = setTimeout(this.stopWheel, 150)
          }
  
        }
    }
    _OnMouseWheel(){
        return direction;
    }
    _addEventListner(element, type, callback){
        element.addEventListener(type, callback);
        this.events.push({element, type, callback});
    }
    _removeEventListener(element,type,callback){
        element.removeEventListener(type,callback);
    }

    AddKeyDownListner(callback){
        this._addEventListner(document, 'keydown', callback);
    }

    AddKeyUpListner(callback){
        this._addEventListner(document, 'keyup', callback);
    }

    AddMouseMoveListner(callback){
        this._addEventListner(document, 'mousemove', callback);
    }
    removeMouseMoveListener(callback){
        this._removeEventListener(document, 'mousemove', callback);
    }

    AddClickListner(callback){
        this._addEventListner(document.body, 'click', callback);
    }

    AddMouseDownListner(callback){
        this._addEventListner(document.body, 'mousedown', callback);
    }

    AddMouseUpListner(callback){
        this._addEventListner(document.body, 'mouseup', callback);
    }
    AddMouseOutListner(callback){
        this._addEventListner(document.body, 'mouseout', callback);
    }
    RemoveMouseMoveListener(callback){
        this._addEventListner(document.body, 'mouseout', callback);
    }
    _onKeyDown = (event) => {
        this._keyMap[event.code] = 1;
        event.currentKey=event.code
    }

    _onKeyUp = (event) => {
        this._keyMap[event.code] = 0;
    }

    GetKeyDown(code){
        return this._keyMap[code] === undefined ? 0 : this._keyMap[code];
    }
    removeEventListener(e){
        e.element.removeEventListener(e.type, e.callback);
    }
    ClearEventListners(){
        this.events.forEach(e=>{
            e.element.removeEventListener(e.type, e.callback);
        });

        this.events = [];
        document.onmousewheel = null; // 非火狐
        document.removeEventListener('DOMMouseScroll', this.mouseWheel, false) // 火狐
    }
    AddEvent(){
        this.AddKeyDownListner(this._onKeyDown);
        this.AddKeyUpListner(this._onKeyUp);
        this.AddMouseWheelListener()
    }
    getKeyAndWheel(){
      return event
    }
}

const inputInstance = new Input();
export default inputInstance;