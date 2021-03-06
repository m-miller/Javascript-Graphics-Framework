//+++++++++++++++++++++++++++
//Author: Thomas Androxman
//Date  : Feb/2018
//+++++++++++++++++++++++++++
//Contains: TypeSpringCSS, TypeTriggerArea, TypeMenuCSS, TypeCSSobject, TypeTriggerArea, TypeSpringCSS, TypeUserInputSensor
//DependsOn: BasicLib.js

//===================================================================================================================================================
//Classes / Constructor-functions
//---------------------------------------------------------------------------------------------------------------------------------------------------
function TypeCSSobject (obj)
{
    //Properties Private------------
    var  CSSobject             = obj; if (!CSSobject) {Say('WARNING: (TypeCSSobject) Did not receive an object during initialization',-1); return;}
    var  origParentBox         = CSSobject.parentElement.getBoundingClientRect();
    //Note: getBoundingClientRect() --> The amount of scrolling that has been done of the viewport area (or any other scrollable element) is taken into account when computing the bounding rectangle. 
    //Note: This means that the rectangle's boundary edges (top, left, bottom, and right) change their values every time the scrolling position changes
    var  origBoundingBox        = CSSobject.getBoundingClientRect();  //the size of an element and its position relative to the viewport (also accounts for scrolling).
    var  origStyle              = getComputedStyle(obj);              //this object reference is not static, it will change if any style is set later
    var  origInlineStyle        = {cssText:CSSobject.style.cssText};  //copies any inline styles (ones inside the HTML doc using the style tag)
    var  origOpacity            = Number(origStyle.opacity);
    var  origBackgroundColor    = new TypeColor(origStyle.backgroundColor);
    var  origTextColor          = new TypeColor(origStyle.color);
    var  origBorderTopColor     = new TypeColor(origStyle.getPropertyValue("border-top-color"));
    var  origBorderLeftColor    = new TypeColor(origStyle.getPropertyValue("border-left-color"));
    var  origBorderRightColor   = new TypeColor(origStyle.getPropertyValue("border-right-color"));
    var  origBorderBottomColor  = new TypeColor(origStyle.getPropertyValue("border-bottom-color"));
    var  origBorderColor        = (origBorderTopColor.IsEqualTo(origBorderLeftColor) && origBorderTopColor.IsEqualTo(origBorderRightColor) && origBorderTopColor.IsEqualTo(origBorderBottomColor)) ? origBorderTopColor : null;
    var  origGrayscale          = 0;
    var  origZindex             = (isNaN(origStyle.zIndex))? 0 : Number(origStyle.zIndex);
    var  origWinScroll          = {left:window.pageXOffset,top:window.pageYOffset};
    
    //Methods Private --------------
    var Initialize       = function ()
    {
        var filter       = origStyle.getPropertyValue("filter");
        var webkitFilter = origStyle.getPropertyValue("-webkit-filter");
        if (filter.search("grayscale")>-1) origGrayscale = Number(100*filter.match(/\d+/));
        else if (webkitFilter.search("grayscale")>-1) origGrayscale = Number(100*webkitFilter.match(/\d+/));

        ReadInlineStyle();
    }
    
    var ReadInlineStyle  = function ()
    {
      if (CSSobject.style.cssText === "") return;
      
      var stylesArr   = CSSobject.style.cssText.split(";"); 
      var stylesCount = stylesArr.length;
    
      for (var i=0;i<stylesCount;i++)
      {
         if (stylesArr[i]==="") continue;
         
         let oneStyle = stylesArr[i].split(":"); oneStyle[0]=oneStyle[0].trim(); 
         oneStyle[0]  = oneStyle[0].replace( /\-+[a-z]/g, function(str){return str[1].toUpperCase()} );
         origInlineStyle[oneStyle[0]] = oneStyle[1];    //adding a key-value pair
      }
            
    }
    
    //Methods Public ---------------
    this.GetObjectRef    = function ()  {return CSSobject;}
    this.GetOrigBox      = function ()  {return origBoundingBox;}
    this.GetOrigScroll   = function ()  {return origWinScroll;}
    this.GetWidth        = function ()  {return origBoundingBox.width;} //{return CSSobject.offsetWidth;}
    this.GetHeight       = function ()  {return origBoundingBox.height;}//{return CSSobject.offsetHeight;}
    this.GetTop          = function ()  {return origBoundingBox.top - origParentBox.top;}
    this.GetLeft         = function ()  {return origBoundingBox.left - origParentBox.left;}
    this.GetRight        = function ()  {return origBoundingBox.right - origParentBox.left;}
    this.GetBottom       = function ()  {return origBoundingBox.bottom - origParentBox.top;}
    this.SetTop          = function (y) {CSSobject.style.top  = y + "px";}
    this.SetLeft         = function (x) {CSSobject.style.left = x + "px";}
    this.SetHidden       = function ()  {CSSobject.style.visibility = "hidden";}
    this.SetVisible      = function ()  {CSSobject.style.visibility = "visible";}
    this.ScaleOpacity    = function (r) {if (r<=0) {this.SetHidden();} else {this.SetVisible();} r = ClipValue(r,1); CSSobject.style.opacity = origOpacity*r; }
    this.TopOffOpacity   = function (r) {r = ClipValue(r,1); CSSobject.style.opacity = origOpacity+(1-origOpacity)*(1-r);}          //Splits the difference from original opacity to 100%
    this.ScaleGrayscale  = function (r)
    {
        r = ClipValue(r,1);
        var grayscaleString          = "grayscale("+Math.floor(origGrayscale*r)+"%)";
        CSSobject.style.filter       = grayscaleString;
        CSSobject.style.WebkitFilter = grayscaleString; 
    }    
    this.ApplyTransform    = function (transformStr)
    {
        CSSobject.style.transform         = transformStr;
        CSSobject.style.mstransform       = transformStr;
        CSSobject.style.WebkitTransform   = transformStr;
    }
    this.BorderColorTo     = function (targetColor,percent) 
    {
        if (origBorderColor!==null) {CSSobject.style.borderColor = origBorderColor.TransitionTo(targetColor,(percent)).GetCSScolor(); return;}
        CSSobject.style.borderTopColor    = origBorderTopColor.TransitionTo(targetColor,(percent)).GetCSScolor();
        CSSobject.style.borderLeftColor   = origBorderLeftColor.TransitionTo(targetColor,(percent)).GetCSScolor();
        CSSobject.style.borderBottomColor = origBorderBottomColor.TransitionTo(targetColor,(percent)).GetCSScolor();
        CSSobject.style.borderRightColor  = origBorderRightColor.TransitionTo(targetColor,(percent)).GetCSScolor();
    }
    this.ResetBorderColor    = function ()
    {
        CSSobject.style.borderColor       = (origInlineStyle.borderColor === undefined)? "" : origInlineStyle.borderColor;
        CSSobject.style.borderTopColor    = (origInlineStyle.borderTopColor === undefined)? "" : origInlineStyle.borderTopColor;
        CSSobject.style.borderLeftColor   = (origInlineStyle.borderLeftColor === undefined)? "" : origInlineStyle.borderLeftColor;
        CSSobject.style.borderBottomColor = (origInlineStyle.borderBottomColor === undefined)? "" : origInlineStyle.borderBottomColor;
        CSSobject.style.borderRightColor  = (origInlineStyle.borderRightColor === undefined)? "" : origInlineStyle.borderRightColor;
    }
    this.ResetStyle          = function ()                    {CSSobject.style.cssText = origInlineStyle.cssText;}
    this.ResetOpacity        = function ()                    {CSSobject.style.opacity = (origInlineStyle.opacity === undefined)? "" : origInlineStyle.opacity;}
    this.SetBorderColor      = function (targetColor)         {CSSobject.style.borderColor = (new TypeColor (targetColor)).GetCSScolor();}
    this.GetBorderColor      = function ()                    {return origBorderColor;}
    this.GetRightBorderColor = function ()                    {return origBorderRightColor;}
    this.SetZindex           = function (z)                   {CSSobject.style.zIndex=z.toString();}
    this.ResetZindex         = function ()                    {CSSobject.style.zIndex = (origInlineStyle.zIndex === undefined)? "" : origInlineStyle.zIndex;}
    this.TextColorTo         = function (tergetColor,percent) {CSSobject.style.color = origTextColor.TransitionTo(tergetColor,percent).GetCSScolor();}
    this.BackgroundColorTo   = function (tergetColor,percent) {CSSobject.style.backgroundColor = origBackgroundColor.TransitionTo(tergetColor,percent).GetCSScolor();}
    this.toString            = function ()                    {return "[TypeCSSobject]";}
        
    //Initialization
    Initialize();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function TypeGalleryZoomCell (theCell,theSlider)
{
    //Properties ----------------
    this.coreObj    = new TypeCSSobject (theCell) //this will create internally a durable copy of the original CSS style of the object
    this.slider     = theSlider;
    this.img        = theCell.getElementsByTagName('img')[0]
    this.srcSmall   = this.img.src; //rowCells[j].childNodes[0];
    this.srcBig     = this.srcSmall.replace("min","max"); 
    
    this.imgBig     = new Image();
    this.imgBig.src = this.srcBig; //Force load the image into the cache
    
    //Note: window.innerWidth = Width (in pixels) of the browser window viewport including, if rendered, the vertical scrollbar.
    //Note: coreObj.GetOrigBox() gets the position of coreObj relative to the viewport
    var origTranslVec = new TypeXYZw(window.innerWidth/2-(this.coreObj.GetOrigBox().left+this.coreObj.GetOrigBox().width/2)-8, window.innerHeight/2-(this.coreObj.GetOrigBox().top+this.coreObj.GetOrigBox().height/2));     

    //Methods -------------------
    this.Deploy   = function ()    {this.slider.SetDeploy(true);}
    this.Retract  = function ()    {this.slider.SetDeploy(false);}
    this.Draw     = function ()
    {
        var zoomFactor   = 4.0;
        var sliderState  = this.slider.UpdateState();
        var scaleTo      = 1+ sliderState * (zoomFactor-1);

        //Note: window.pageXOffset is an alias for window.scrollX. Returns the number of pixels that the document is currently scrolled horizontally
        var newTranslVec = origTranslVec.Plus(new TypeXYZw(window.pageXOffset-this.coreObj.GetOrigScroll().left, window.pageYOffset-this.coreObj.GetOrigScroll().top));
        var translateTo  = newTranslVec.ResizeTo(sliderState * newTranslVec.Length());
            
        this.coreObj.ScaleOpacity(0.1+0.9*sliderState);
        if (this.slider.GetDeploy()==true) 
        {
            //if(!(this.coreObj.GetBorderColor().IsEqualTo(this.coreObj.GetRightBorderColor()))) this.coreObj.SetBorderColor(this.coreObj.GetRightBorderColor().GetCSScolor());
            this.coreObj.SetBorderColor(this.coreObj.GetRightBorderColor().GetCSScolor());
            this.coreObj.SetZindex(5);
            this.img.src = this.srcBig;
        }
        else if (sliderState==0)
        {
            this.coreObj.ResetStyle();
            this.img.src = this.srcSmall;
        }
        var transformString = "translate("+Math.floor(translateTo.x)+"px,"+Math.floor(translateTo.y)+"px)"+"scale("+scaleTo+","+scaleTo+") ";
        this.coreObj.ApplyTransform (transformString);
    }
}
function TypeGallery (galleryObj)
{  //receives the <div> element that contains rows and cells of a gallery
    
    //Properties --------------
    var galleryCellArr = [];    //array of galleryZoomCell objects
    
    //Methods ----------------- 
    var Initialize  = function ()
    {
        var rowsArr  = galleryObj.children;
        var rowCount = rowsArr.length;
        for (let i=0;i<rowCount;i++)
        {  
            let rowCellsArr  = rowsArr[i].children;
            let rowCellCount = rowCellsArr.length;
            for (let j=0;j<rowCellCount;j++) 
            {
                //Attach (rowCellsArr[j]);
                let sliderObj    = new TypeSlider(10,0.1,false);
                let galleryCell = new TypeGalleryZoomCell(rowCellsArr[j],sliderObj);
                galleryCellArr.push(galleryCell); 

                rowCellsArr[j].onmousedown = function () {galleryCell.Deploy();};
                rowCellsArr[j].onmouseup    = function () {galleryCell.Retract();};
            }
        }
    }
    
    this.Draw = function ()
    {
      var len = galleryCellArr.length;
      for (let i=0;i<len;i++) { if (galleryCellArr[i].slider.IsActive()==false) {continue;} else {galleryCellArr[i].Draw();} }
    }
    
    //Initialization
    Initialize();
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function TypeMenuCSS ()
{
    //Properties---------------
    var buttonArr  = [];
    var state      = 0;
    
    this.triggerObj;
    this.triggerHoldObj;
    
    //Methods------------------
    this.AddButton      = function (thisObj,T,elast,mountPos,restPos,offset,moveFade) {buttonArr.push(new TypeSpringCSS(thisObj,T,elast,mountPos,restPos,offset,moveFade));}
    this.ReactTo        = function (point,reactionBiasFactor) 
    {
        if(this.triggerObj===void(0)) return;

        var trigHold = (this.triggerHoldObj===void(0))? false : (this.triggerHoldObj.ReactTo(point)>0)? false : true;
        var trig = (this.triggerObj.ReactTo(point,reactionBiasFactor)>0)? false : true; //if "point" is undefined triggerObj checks its DOM events and returns (-1 or Infinity)
        var count = buttonArr.length;
        for (var i=0;i<count;i++) 
        { 
            if (trig==false && trigHold==false) {buttonArr[i].SetDeploy(false);}
            else if (trig==true) {buttonArr[i].SetDeploy(true);}

            buttonArr[i].ReactTo(point);
        }
    }
    this.Draw      = function (ctx)
    {
        this.triggerObj.Draw(ctx); //In case the trigger object itself is in motion (rarely if ever)

        var count = buttonArr.length;
        for (var i=0;i<count;i++) {buttonArr[i].Draw(ctx);} //Draw each spring for animation
    }      
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function TypeTriggerArea(a,b,c,d) 
{
    //Private properties
    var bodyObj;
    var shapeType;
    var shape         = [];
    var isActive      = false;
    var useDOMtrigger = false;
    
    
    //Public methods
    this.SetAsRectangle = function (x1,y1,x2,y2)    {shape=[new TypeXYZw(x1,y1), new TypeXYZw(x2,y2)]; shapeType="rectangle"; Say('Shape:'+shape,-1);}
    this.SetAsCircle    = function (x1,y1,r)        {shape=[new TypeXYZw(x1,y1),r]; shapeType="circle";}
    this.GetDistanceTo  = function (point)
    {
        if (shapeType=="circle") return point.Minus(shape[0]).Length() - shape[1];
        if (shapeType=="rectangle")
        {   //returns perpendicular distance to the nearest rectangle edge
            var relPoint     = point.Minus(shape[0]);
            var relEndCorner = shape[1].Minus(shape[0]);

            //Bring the rectangle to the first quadrant
            if (relEndCorner.x<0) {relPoint.x-=2*relEndCorner.x; relEndCorner.x=-relEndCorner.x}
            if (relEndCorner.y<0) {relPoint.y-=2*relEndCorner.y; relEndCorner.y=-relEndCorner.y}
            
            //Test horizontal and vertical zones of the rectange
            if (relPoint.y>=0 && relPoint.y<=relEndCorner.y) {return (relPoint.x>=relEndCorner.x)? relPoint.x-relEndCorner.x : (relPoint.x<=0)? -relPoint.x : -1;}
            if (relPoint.x>=0 && relPoint.x<=relEndCorner.x) {return (relPoint.y>=relEndCorner.y)? relPoint.y-relEndCorner.y : (relPoint.y<=0)? -relPoint.y : -1;}
            //Test the outer corner zones
            if (relPoint.x<0 && relPoint.y<0) {return relPoint.Length();}
            if (relPoint.x>0 && relPoint.y<0) {relPoint.x-=relEndCorner.x; return relPoint.Length();}
            if (relPoint.x>0 && relPoint.y>0) {return relPoint.Minus(relEndCorner).Length();}
            if (relPoint.x<0 && relPoint.y>0) {relPoint.y-=relEndCorner.y; return relPoint.Length();}
            
            return -1;
        }
    }
    this.SetDOMtrigger = function (state)
    {
        if (!(bodyObj instanceof TypeCSSobject)) return;
        useDOMtrigger = state || false;
        if (state==true) {bodyObj.GetObjectRef().onmouseover = function() {isActive=true;}; bodyObj.GetObjectRef().onmouseout = function() {isActive=false;}; }
        else {bodyObj.GetObjectRef().onmouseover = null; bodyObj.GetObjectRef().onmouseout = null;}
    }
    this.SetBodyObject  = function (thisCSSobject) 
    {    
        bodyObj=thisCSSobject; 
        this.SetAsRectangle(bodyObj.GetLeft(),bodyObj.GetTop(),bodyObj.GetRight(),bodyObj.GetBottom());
    }
    this.ReactTo  = function (point,reactionBiasFactor)  
    { 
        if (useDOMtrigger==true  && point===void(0)) {return (isActive==true)? -1 : Infinity;}
        if (useDOMtrigger==false && point===void(0)) {return NaN;}
        if (reactionBiasFactor===void(0)) {reactionBiasFactor=1;}

        var dist = this.GetDistanceTo(point); 
        if(dist<=0) {isActive=true;} else {isActive=false;}
        if (bodyObj instanceof TypeCSSobject)
        {
            //A CSS object will react to proximity
            var bodyObjWidth  = bodyObj.GetWidth();
            var bodyObjHeight = bodyObj.GetHeight();
            var hotRad = (bodyObjWidth<bodyObjHeight)? bodyObjHeight/2 : bodyObjWidth/2;
            var ratio  = dist/(reactionBiasFactor*hotRad); //A reactionBiasFactor>1 lengthens the reaction time
            bodyObj.ScaleGrayscale(ratio);  //Carefull: this will scale the existing grayscale value. If the grayscale is 0% nothing happens.
            bodyObj.TopOffOpacity(ratio);   //Carefull: this will top off the opacity. If the original was 100%, nothing happens.
        }
        return dist;
    }
    this.toString = function ()        {return "TypeTriggerArea with bodyObj="+bodyObj};
    this.IsActive = function ()        {return isActive;}
    this.Draw     = function () {}

    //Initialization
    if      (arguments.length==3) {this.SetAsCircle(a,b,c);}
    else if (arguments.length==4) {this.SetAsRectangle(a,b,c,d);}
    else if (arguments.length<=2 && a instanceof TypeCSSobject) {this.SetBodyObject(a); this.SetDOMtrigger(b); }
    else if (arguments.length<=2 && a && a.toString().toLowerCase().indexOf("html")>-1 && a.toString().toLowerCase().indexOf("element")>-1) {this.SetBodyObject(new TypeCSSobject(a)); this.SetDOMtrigger(b);}
    
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
function TypeSpringCSS (thisObj,T,elast,fromP,toP,offset,moveFade) 
{

    //Private Properties
    var mountP;         //Starting position under tension
    var restP;          //Where it will end up at rest
    var travelVec;      //From mount to rest positions
    var travelDist;     //Length of the travel vector
    var objOffset;
    var slider;
    var targetObj;
    var hotRadius;
    var motionFade;
    
    //Public properties
    this.isReactive = true;
    
    //Private methods
    var Initialize    = function (thisObj,T,elast,fromP,toP,offset,moveFade)
    {
        //Argument gate
        if (thisObj==void(0)) {Say('WARNING: (TypeSpringCSS) Did not receive an initial object to act on',-1); return;}
        
        mountP       = new TypeXYZw(fromP);
        restP        = new TypeXYZw(toP);
        travelVec    = restP.Minus(mountP); //from mount position to resting position
        travelDist   = travelVec.Length();
        objOffset    = new TypeXYZw(offset);
        slider       = new TypeSlider(travelDist,T,elast);
        targetObj    = new TypeCSSobject (thisObj);
        hotRadius    = (targetObj.GetWidth() <= targetObj.GetHeight())? targetObj.GetHeight()*2.5 : targetObj.GetWidth()*2.5;
        
        motionFade = (moveFade===undefined)? true : moveFade;
        targetObj.SetTop(Number(mountP.y + objOffset.y));
        targetObj.SetLeft(Number(mountP.x + objOffset.x)); 
    }
      
    //Public Methods ---------------------------------------
    this.SetDeploy    = function (toThis)  {slider.SetDeploy(toThis);}
    this.IsResting    = function ()        {return (slider.GetCondition()==1.0) ? true:false;}
    this.IsStowed     = function ()        {return (slider.GetCondition()==0.0) ? true:false;}
    this.IsMoving     = function ()        {return (slider.GetCondition()==0.5) ? true:false;}
    this.GetDeflRatio = function ()        {return 1-slider.GetState();}
    this.ReactTo      = function (point)
    {
        if (slider.GetCondition()==0 || this.isReactive==false || point===undefined) return;
        var currPos  = mountP.Plus(travelVec.ResizeTo(slider.GetPosition()));
        var distance = currPos.Minus(point).Length();
        var ratio = (distance>hotRadius)? 1 : distance/hotRadius;

        //var targetBackColor    = new TypeColor(20,20,20); targetObj.BackgroundColorTo(targetBackColor,(1-ratio));
        //var targetTextColor    = new TypeColor(230,150,0); targetObj.TextColorTo(targetTextColor,(1-ratio));
        //var targetBorderColor = new TypeColor(230,150,0); targetObj.BorderColorTo(targetBorderColor,(1-ratio));
        targetObj.TopOffOpacity (ratio);        //Splits the difference from original opacity to 100%
        targetObj.ScaleGrayscale (ratio);      //Removes original grayscale (if any) depending on proximity
    }
    this.Draw = function (ctx)
    {        
        var posRatio = slider.UpdateState();
        var currPos  = mountP.Plus(travelVec.ResizeTo(slider.GetPosition()));

        if (motionFade==true && slider.GetCondition()<1) {targetObj.ScaleOpacity(posRatio);}
        targetObj.SetTop(Number(currPos.y + objOffset.y));
        targetObj.SetLeft(Number(currPos.x + objOffset.x));      
    }
    
    //Initialization
    Initialize(thisObj,T,elast,fromP,toP,offset,moveFade);
}
//---------------------------------------------------------------------------------------------------------------------------------------------------
var TypeUserInputSensor = function (domElement, contTrack, senseMouse, senseKeyboard, senseTouch)
{    //Senses user keyboard and mouse inputs of a DOM element
    //Note: DOM = Document Object Model
    
    //PRIVATE properties
    var targetElement;
    
    var keyCharBuffer;       //History of characters entered (keydown and keyup completed)
    var keyBufferExpire;     //Used to clear the buffer after an interval of inactivity between keyDown events
    var keyBufferTimer;      //The number of times the GetKeyState() method has been evoked
    
    var touchBuffer;         //History of touches entered
    var touchBufferExpire;   //Used to clear the buffer after an interval of inactivity between touch events
    var touchBufferTimer;    //
    
    var currentKeyPress;
    var currentSpecialKeys;  //State of Ctrl, Shift, alt, meta keys
    
    var domElementBox;       //the dimensions and position of the domElement's bounding rectangle (this is DOMrect object)
    var datumMousePos;       //When set, indicates the origin of a mouse drag (moving cursor while mouse is clicked)
    var currentMousePos;     //In local DOM coordinates
    var currentMouseButtons; //Stored as 0/1 bits.
    
    var currentTouches;      //An object holding referenses to touch lists (arrays)
    
    var isKeyboardTracking;  //Boolean. Enable/disable key sensing
    var isMouseTracking;     //Boolean. Enable/disable mouse sensing
    var isContinuousTracking;//Boolean. Track movement continusously (otherwise only track inside the element on mouseDown)
    var isMouseOver;         //Boolean. Cursor is currently over the element true/false
    
    var isChanged;
    
    //PRIVATE methods
    var Initialize = function (domElement, contTrack)
    {
        if (IsString(domElement)) {domElement = document.getElementById(domElement);}
        if (!domElement) {Say('WARNING: (TypeInputSensor) Did not receive a proper domElement or domElement ID string',-1); return;}
        
        targetElement        = domElement;
        isContinuousTracking = (contTrack)? true : false;
        domElementBox        = domElement.getBoundingClientRect();
        datumMousePos        = new TypeXYZw();
        currentMousePos      = new TypeXYZw();
        currentMouseButtons  = 0;
        
        currentKeyPress      = 0;
        currentSpecialKeys   = 0;
        keyCharBuffer        = ''; //This is a string with all the echoing keypresses
        keyBufferExpire      = 0;  //0:Always expired (no buffer), -1:Infinite buffer
        keyBufferTimer       = 0;  //Increments by the GetKeyState() method
        isChanged            = {mouse:void(0),keyPress:void(0),keyChar:void(0),touch:void(0)};
        
        touchBuffer          = [];
        touchBufferExpire    = 0;  //0:Always expired (no buffer), -1:Infinite buffer
        touchBufferTimer     = 0;
        currentTouches       = {anywhere:void(0), target:void(0), changed:void(0)};
        
        //Note: The 'useCapture' option of the eventListener handles whether to trigger the event during the 'capture' phase or the 'bubble' phase. HTML elements are nested like onions.
        //Note: At the "capture" phase events are triggered downward in a parent to child direction. The "bubble" phase triggers upwards from most nested child.
        //Note: Adding the same event listener twice has no effect
        //arguments: addEventListener(type, listener[, options]);    --> using {passive:true} on touch events enhances scrolling performance. (preventDefault() is now disabled)
        //arguments: addEventListener(type, listener[, useCapture]); --> useCapture defaults to 'false'
        document.addEventListener('keydown', HandleKeyDown); //keydown handles special keys as non silent. keypress is not triggered when shift or alt are pressed alone
        document.addEventListener('keyup', HandleKeyUp);
        
        //Mouse events
        domElement.addEventListener('mouseover',HandleMouseOver);
        domElement.addEventListener('mouseout',HandleMouseOut);
        domElement.addEventListener('mousedown',HandleMouseDown); //mousedown happens inside the element
        document.addEventListener  ('mouseup',HandleMouseUp);     //mouseup is detected at the document lavel
        
        //Touch events
        domElement.addEventListener("touchstart", HandleTouchStart,{passive:true});   //touch point is placed on the touch surface 
        domElement.addEventListener("touchend", HandleTouchEnd,{passive:true});       //touch point is removed from the touch surface
        domElement.addEventListener("touchcancel", HandleTouchCancel,{passive:true}); //touch point has been disrupted (for example, too many touch points are created).
        domElement.addEventListener("touchmove", HandleTouchMove,{passive:true});     //touch point is moved along the touch surface
        
        if (isContinuousTracking) {MouseMovementTracking(true);}
        
        //...to do... --> handle touch events
    }
    var SaveSpecialKeysState = function (eventObj)
    {
        //bit-0: (1) Ctrl key pressed
        //bit-1: (2) Shift key pressed
        //bit-2: (4) Alt key pressed
        //bit-3: (8) Meta key pressed
        currentSpecialKeys  |= 1*eventObj.ctrlKey;
        currentSpecialKeys  |= 2*eventObj.shiftKey;
        currentSpecialKeys  |= 4*eventObj.altKey;
        currentSpecialKeys  |= 8*eventObj.metaKey;
    }
    var HandleKeyDown   = function (eventObj) 
    {
        eventObj.preventDefault(); //default actions should not be taken as it normally would be (arrow keys no longer scroll, keypress not fired)
        currentKeyPress = (eventObj.keycode || eventObj.which);
        SaveSpecialKeysState(eventObj);

        //Register the keystroke to the buffers
        var keyAlphaNum = (currentKeyPress>= 48 && currentKeyPress<= 90);
        var keyNumpad   = (currentKeyPress>= 96 && currentKeyPress<=111);
        var keySymbols  = (currentKeyPress>=186 && currentKeyPress<=222); //brackets, commas, etc
        if(keyAlphaNum || keyNumpad || keySymbols) {keyBufferTimer=0; if (IsKeyBufferActive()) {keyCharBuffer += String.fromCharCode(currentKeyPress); isChanged.keyChar=true;}} //The echoing keys
        
        isChanged.keyPress=true;
    } 
    var HandleKeyUp     = function (eventObj) 
    {
        eventObj.preventDefault(); 
        currentSpecialKeys = 0; 
        currentKeyPress = 0;
    }
    var HandleMouseOver = function (eventObj) {isMouseOver=true;}
    var HandleMouseOut  = function (eventObj) {isMouseOver=false;}
    var HandleMouseDown = function (eventObj)
    {
        if (!isContinuousTracking) {MouseMovementTracking(true);}
        eventObj.preventDefault();
        domElementBox = targetElement.getBoundingClientRect(); //Update in case the user scrolled the window
        ComputeMousePos(eventObj);                             //determine the currentMousePos
        datumMousePos.SetEqualTo(currentMousePos);             //ensuring delta is zero
        SaveMouseButtonsState(eventObj);                       //which moused buttons were pressed during the click
        isChanged.mouse=true;
    }
    var HandleMouseUp = function (eventObj)
    {   //This event is comming from 'document'
        if (!isContinuousTracking) {MouseMovementTracking(false);} 
        eventObj.preventDefault();
        datumMousePos.SetEqualTo(currentMousePos);             //set delta to zero
        currentMouseButtons  = 0;                              //clear the saved buttons state
    }
    var HandleMouseMove   = function (eventObj) {eventObj.preventDefault(); ComputeMousePos(eventObj); isChanged.mouse=true;}
    var HandleTouchStart  = function (eventObj) 
    {
        domElementBox = targetElement.getBoundingClientRect(); //Update in case the user scrolled the window
        currentTouches.anywhere = ComputeTouchPosList(eventObj.touches);
        currentTouches.target   = ComputeTouchPosList(eventObj.targetTouches);
        currentTouches.changed  = ComputeTouchPosList(eventObj.changedTouches);
        SaveSpecialKeysState(eventObj);
        //Note: (changedTouches) For the touchstart event this must be a list of the touch points that just became active with the current event. 
        //Note: (changedTouches) For the touchmove event this must be a list of the touch points that have moved since the last event. 
        //Note: (changedTouches) For the touchend and touchcancel events this must be a list of the touch points that have just been removed from the surface
        
        //Register touch to the buffer
        var touchCount = currentTouches.target.length;
        for (let i=0; i<touchCount; i++) {touchBuffer.push(currentTouches.target[i]);}
        touchBufferTimer = 0;
        isChanged.touch=true;
    }
    var HandleTouchEnd    = function (eventObj) {}
    var HandleTouchCancel = function (eventObj) {}
    var HandleTouchMove   = function (eventObj) {}
    var ComputeMousePos   = function (eventObj)
    {
        //Note: 0,0 is top left
        currentMousePos.x = eventObj.clientX - domElementBox.left; 
        currentMousePos.y = eventObj.clientY - domElementBox.top; 
        //Note: 'clientX,Y' are coordinates relative to the browser window
        //Note: 'pageX,Y' are coordinates relative to the webpage (the top of the webpage may not be visible if scrolled)
        //Note: 'screenX,Y' are coordinates relative to the computer monitor screen (the 0,0 of the browser window changes if the user moves the window)
        return currentMousePos;
    }
    var ComputeTouchPosList = function (touchList)
    {   //Computes touch positions relative to the target element 
        //Note: any touches to the left of the element will have a negative x value
        var touchCount     = touchList.length;
        var touchPositions = [];
        
        for (let i=0; i<touchCount; i++)
        {   //Walk through the touch list
            let onePos   = new TypeXYZw();
            let oneTouch = touchList[i];
            //Note: 0,0 is top left
            onePos.x = oneTouch.clientX - domElementBox.left; 
            onePos.y = oneTouch.clientY - domElementBox.top; 
            touchPositions.push(onePos);
            //Note: 'clientX,Y' are coordinates relative to the browser window
            //Note: 'pageX,Y' are coordinates relative to the webpage (the top of the webpage may not be visible if scrolled)
            //Note: 'screenX,Y' are coordinates relative to the computer monitor screen (the 0,0 of the browser window changes if the user moves the window)
        }
        return touchPositions;
    }
    var MouseMovementTracking = function (state)
    {   //register or unregister event listeners
        //Note: tracking the mouse constatntly could be expensive. There are times where it makes sense to disable tracking
        if (state) { document.addEventListener('mousemove',HandleMouseMove);} 
        else {document.removeEventListener('mousemove',HandleMouseMove);}
    }
    var SaveMouseButtonsState = function (thisEventObj)
    {
        //bit-0:   (1) Left button
        //bit-1:   (2) Right button
        //bit-2:   (4) Middle button
        //bit-3:   (8) 4th button (typically, "Browser Back" button)
        //bit-4:  (16) 5th button (typically, "Browser Forward" button)
        
        //Note: event.buttons is undefined in Safari
        //currentMouseButtons   =     thisEventObj.buttons;
        //Note: event.button returns a single number (does not handle combination).
        //Make event.button use the same bits as event.buttons would
        currentMouseButtons   =     thisEventObj.button; if (currentMouseButtons==0) {currentMouseButtons=1;} else if (currentMouseButtons==1) {currentMouseButtons==4;}
        
        SaveSpecialKeysState(thisEventObj); //Special keys are shared by both keyboard and mouse events
    }
    var IsTouchBufferActive    = function () {return (touchBufferExpire>0 && touchBufferTimer<touchBufferExpire || touchBufferExpire<0)? true : false;}
    var IsKeyBufferActive      = function () {return (keyBufferExpire>0 && keyBufferTimer<keyBufferExpire || keyBufferExpire<0)? true : false;}
    var CheckTouchBufferExpire = function () {if(touchBuffer.length>0 && touchBufferExpire>0 && touchBufferTimer>=touchBufferExpire) {touchBuffer.length=0;} }
    var CheckKeyBufferExpire   = function () {if(keyCharBuffer!='' && keyBufferExpire>0 && keyBufferTimer>=keyBufferExpire) {keyCharBuffer='';} }
    
    //PUBLIC
    this.ClearKeyBuffer       = function () {keyCharBuffer='';}
    this.ClearTouchBuffer     = function () {touchBuffer.length=0;}
    this.SetTouchBufferExpire = function (val) {touchBufferExpire = (isNaN(val))? 0 : val;} 
    this.SetKeyBufferExpire   = function (val) {keyBufferExpire = (isNaN(val))? 0 : val;} 
    this.SetKeysAsRead        = function () {isChanged.keyPress=false; isChanged.keyChar=false;}
    this.SetTouchAsRead       = function () {isChanged.touch=false;}
    this.IsChangedTouch       = function () {return isChanged.touch;}
    this.IsChangedKeyPress    = function () {return isChanged.keyPress;}
    this.IsChangedKeyChar     = function () {return isChanged.keyChar;}
    this.IsChangedMouse       = function () {return isChanged.mouse;}
    this.IsChangedTouch       = function () {return isChanged.touch;}
    
    this.GetTouchBufferStatus = function () {return IsTouchBufferActive();}
    this.GetKeyBufferStatus   = function () {return IsKeyBufferActive();}
    this.GetMouseState        = function () 
    { 
        var mouseState = 
        {
            currentPos:currentMousePos, 
            previousPos:datumMousePos.GetCopy(), 
            delta:currentMousePos.Minus(datumMousePos), 
            buttonState:currentMouseButtons, 
            specialKeys:currentSpecialKeys,
            activeArea:domElementBox,
            isOver:isMouseOver
        };
        
        datumMousePos.SetEqualTo(currentMousePos); //Without this there would continue to be a delta even if the mouse stoped moving
        return mouseState;
    }
    this.GetKeyState = function ()
    {
        if (IsKeyBufferActive()) {keyBufferTimer += deltaT;} else {CheckKeyBufferExpire();}
        
        var keyState = {keyPressed:currentKeyPress, specialKeys:currentSpecialKeys, charBuffer:keyCharBuffer}; 
        return keyState;
    }
    this.GetTouchState = function ()
    {
        if (IsTouchBufferActive()) {touchBufferTimer += deltaT;} else {CheckTouchBufferExpire();}
     
        var touchState = {touchListAny:currentTouches.anywhere, touchListTarget:currentTouches.target, touchListChanged:currentTouches.changed, specialKeys:currentSpecialKeys, targetTouchBuffer:touchBuffer};
        return touchState;
    }
    
    //Initialization
    Initialize(domElement, contTrack);
}