!function(){for(var n=0,i=["ms","moz","webkit","o"],e=0;e<i.length&&!window.requestAnimationFrame;++e)window.requestAnimationFrame=window[i[e]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[i[e]+"CancelAnimationFrame"]||window[i[e]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(i){var e=(new Date).getTime(),a=Math.max(0,16-(e-n)),o=window.setTimeout(function(){i(e+a)},a);return n=e+a,o}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(n){clearTimeout(n)}),window.RAF=window.requestAnimFrame=window.requestAnimationFrame}();
!function(){function t(){}function i(){this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0}function s(){this.MST=0,this.MAT=300,this.fx="easeBoth",this.complete=t,this.moving=!1,this.infinity=!1,this.alternate=!1,this.repeats=0}function h(){s.call(this),this.visible=!0,this.worldAlpha=1,this.alpha=1,this.scaleX=1,this.scaleY=1,this.skewX=0,this.skewY=0,this.rotation=0,this.rotationCache=0,this._sr=0,this._cr=1,this.x=0,this.y=0,this.pivotX=0,this.pivotY=0,this.mask=t,this.parent=null,this.worldTransform=new i}function e(){JC.DisplayObject.call(this),this.cds=[]}function o(t){JC.Container.call(this),this.image=t.image,this._imageW=this.image.width,this._imageH=this.image.height,this.width=t.width||this._imageW,this.height=t.height||this._imageH,this.regX=this.width>>1,this.regY=this.height>>1,this._cF=0,this.count=t.count||1,this.sH=t.sH||0,this.sW=t.sW||0,this.loop=!1,this.repeatF=0,this.preTime=Date.now(),this.interval=60}function n(){JC.Container.call(this),this.cacheCanvas=null}function r(t,i,s){JC.Container.call(this),this.text=t,this.font=i,this.color=s,this.textAlign="center",this.textBaseline="middle",this.outline=0,this.lineWidth=1,this.US=!1,this.UF=!0}function a(t,i){JC.Container.call(this),this.canvas=document.getElementById(t),this.ctx=this.canvas.getContext("2d"),this.cds=[],this.canvas.style.backgroundColor=i||"transparent",this.autoClear=!0,this.width=this.canvas.width,this.height=this.canvas.height,"imageSmoothingEnabled"in this.ctx?this.ctx.imageSmoothingEnabled=!0:"webkitImageSmoothingEnabled"in this.ctx?this.ctx.webkitImageSmoothingEnabled=!0:"mozImageSmoothingEnabled"in this.ctx?this.ctx.mozImageSmoothingEnabled=!0:"oImageSmoothingEnabled"in this.ctx&&(this.ctx.oImageSmoothingEnabled=!0)}window.JC=window.JC||{},JC.DTR=Math.PI/180,JC.Matrix=i,i.prototype.fromArray=function(t){this.a=t[0],this.b=t[1],this.c=t[3],this.d=t[4],this.tx=t[2],this.ty=t[5]},i.prototype.toArray=function(t){this.array||(this.array=new JC2D.Float32Array(9));var i=this.array;return t?(i[0]=this.a,i[1]=this.b,i[2]=0,i[3]=this.c,i[4]=this.d,i[5]=0,i[6]=this.tx,i[7]=this.ty,i[8]=1):(i[0]=this.a,i[1]=this.c,i[2]=this.tx,i[3]=this.b,i[4]=this.d,i[5]=this.ty,i[6]=0,i[7]=0,i[8]=1),i},i.prototype.apply=function(t,i){return i=i||{},i.x=this.a*t.x+this.c*t.y+this.tx,i.y=this.b*t.x+this.d*t.y+this.ty,i},i.prototype.applyInverse=function(t,i){var s=1/(this.a*this.d+this.c*-this.b);return i.x=this.d*s*t.x+-this.c*s*t.y+(this.ty*this.c-this.tx*this.d)*s,i.y=this.a*s*t.y+-this.b*s*t.x+(-this.ty*this.a+this.tx*this.b)*s,i},i.prototype.translate=function(t,i){return this.tx+=t,this.ty+=i,this},i.prototype.scale=function(t,i){return this.a*=t,this.d*=i,this.c*=t,this.b*=i,this.tx*=t,this.ty*=i,this},i.prototype.rotate=function(t){var i=Math.cos(t),s=Math.sin(t),h=this.a,e=this.c,o=this.tx;return this.a=h*i-this.b*s,this.b=h*s+this.b*i,this.c=e*i-this.d*s,this.d=e*s+this.d*i,this.tx=o*i-this.ty*s,this.ty=o*s+this.ty*i,this},i.prototype.append=function(t){var i=this.a,s=this.b,h=this.c,e=this.d;return this.a=t.a*i+t.b*h,this.b=t.a*s+t.b*e,this.c=t.c*i+t.d*h,this.d=t.c*s+t.d*e,this.tx=t.tx*i+t.ty*h+this.tx,this.ty=t.tx*s+t.ty*e+this.ty,this},i.prototype.identity=function(){return this.a=1,this.b=0,this.c=0,this.d=1,this.tx=0,this.ty=0,this},JC.identityMatrix=new i,s.prototype.moveTween=function(t){this.MST=Date.now(),this.MATR=t.attr||this.MATR,this.MAT=t.time||this.MAT,this.fx=t.fx||this.fx,this.complete=t.complete||this.complete,this.infinity=t.infinity||this.infinity,this.alternate=t.alternate||this.alternate,this.repeats=t.repeats||this.repeats,this.moving=!0,this.MATRC={};for(var i in this.MATR)this.MATRC[i]=this[i]},s.prototype.manager=function(){if(this.moving){var i=Date.now();i<this.MST+this.MAT?this.nextPose():(this.setVal(this.MATR),this.repeats>0||this.infinity?(this.repeats>0&&--this.repeats,this.alternate?this.moveTween({attr:this.MATRC}):(this.setVal(this.MATRC),this.moveTween({attr:this.MATR}))):(this.moving=!1,this.complete(),i>this.MST&&(this.complete=t)))}},s.prototype.nextPose=function(){var t=Date.now()-this.MST;for(var i in this.MATR)this[i]=JC.TWEEN[this.fx](t,this.MATRC[i],this.MATR[i]-this.MATRC[i],this.MAT)},JC.DisplayObject=h,h.prototype=Object.create(s.prototype),h.prototype.constructor=JC.DisplayObject,h.prototype.isVisible=function(){return!!(this.visible&&this.alpha>0&&this.scaleX*this.scaleY>0)},h.prototype.removeMask=function(){this.mask=t},h.prototype.setVal=function(t){if(void 0!==t)for(var i in t)void 0!==this[i]&&(this[i]=t[i])},h.prototype.updateMe=function(){var t,i,s,h,e,o,n=this.parent.worldTransform,r=this.worldTransform;this.rotation%360?(this.rotation!==this.rotationCache&&(this.rotationCache=this.rotation,this._sr=Math.sin(this.rotation*JC.DTR),this._cr=Math.cos(this.rotation*JC.DTR)),t=this._cr*this.scaleX,i=this._sr*this.scaleX,s=-this._sr*this.scaleY,h=this._cr*this.scaleY,e=this.x,o=this.y,(this.pivotX||this.pivotY)&&(e-=this.pivotX*t+this.pivotY*s,o-=this.pivotX*i+this.pivotY*h),r.a=t*n.a+i*n.c,r.b=t*n.b+i*n.d,r.c=s*n.a+h*n.c,r.d=s*n.b+h*n.d,r.tx=e*n.a+o*n.c+n.tx,r.ty=e*n.b+o*n.d+n.ty):(t=this.scaleX,h=this.scaleY,e=this.x-this.pivotX*t,o=this.y-this.pivotY*h,r.a=t*n.a,r.b=t*n.b,r.c=h*n.c,r.d=h*n.d,r.tx=e*n.a+o*n.c+n.tx,r.ty=e*n.b+o*n.d+n.ty),this.worldAlpha=this.alpha*this.parent.worldAlpha},h.prototype.updateTransform=function(){this.manager(),this.updateMe()},h.prototype.setTransform=function(t){var i=this.worldTransform;t.globalAlpha=this.worldAlpha,t.setTransform(i.a,i.b,i.c,i.d,i.tx,i.ty)},JC.Container=e,e.prototype=Object.create(JC.DisplayObject.prototype),e.prototype.constructor=JC.Container,e.prototype.addChilds=function(t){if(void 0===t)return t;var i=arguments.length;if(i>1){for(var s=0;i>s;s++)this.addChilds(arguments[s]);return arguments[i-1]}return t.parent&&t.parent.removeChilds(t),t.parent=this,this.cds.push(t),t},e.prototype.removeChilds=function(){var t=arguments.length;if(t>1)for(var i=0;t>i;i++)this.removeChilds(arguments[i]);else if(1===t)for(var s=0;s<this.cds.length;s++)this.cds[s]===arguments[0]&&(this.cds[s].parent=null,this.cds.splice(s,1),s--)},e.prototype.updateTransform=function(){this.manager(),this.updateMe(),this.cds.length>0&&this.updateChilds()},e.prototype.updateChilds=function(){for(var t=0,i=this.cds.length;i>t;t++){var s=this.cds[t];s.updateTransform()}},e.prototype.render=function(t){t.save(),this.setTransform(t),this.mask(t),this.renderMe(t),this.cds.length>0&&this.renderChilds(t),t.restore()},e.prototype.renderMe=function(){return!0},e.prototype.renderChilds=function(t){for(var i=0,s=this.cds.length;s>i;i++){var h=this.cds[i];h.isVisible()&&h.render(t)}},JC.Sprite=o,o.prototype=Object.create(JC.Container.prototype),o.prototype.constructor=JC.Sprite,o.prototype.getFramePos=function(){var t={x:this.sW,y:this.sH};if(this._cF>0){var i=this._imageW/this.width>>0,s=this.sW/this.width>>0,h=this.sH/this.height>>0,e=h+(s+this._cF)/i>>0,o=(s+this._cF)%i;t.x=o*this.width,t.y=e*this.height}return t},o.prototype.renderMe=function(t){var i=this.getFramePos();t.drawImage(this.image,i.x,i.y,this.width,this.height,-this.regX,-this.regY,this.width,this.height),this.upFS()},o.prototype.upFS=function(){if(this.canFrames){var t=Date.now(),i=t-this.preTime>this.interval;i&&(this._cF++,this.preTime=t),this._cF>=this.count&&(this.repeatF<=0&&!this.loop&&(this.canFrames=!1,this.onEnd()),this._cF=0,this.loop||this.repeatF--)}},o.prototype.goFrames=function(i){this.count<=1||(this.canFrames=!0,this.loop=i.loop||!1,this.repeatF=i.repeatF||0,this.onEnd=i.end||t,this.preTime=Date.now(),this._cF=0)},JC.Graphics=n,n.prototype=Object.create(JC.Container.prototype),n.prototype.constructor=JC.Graphics,n.prototype.renderMe=function(t){this.cached||this.cache?(this.cache&&(this.cacheCanvas=this.cacheCanvas||document.createElement("canvas"),this.width=this.cacheCanvas.width=this.session.width,this.height=this.cacheCanvas.height=this.session.height,this._ctx=this.cacheCanvas.getContext("2d"),this._ctx.clearRect(0,0,this.width,this.height),this._ctx.save(),this._ctx.setTransform(1,0,0,1,this.session.center.x,this.session.center.y),this.draw(this._ctx),this._ctx.restore(),this.cached=!0,this.cache=!1),this.cacheCanvas&&t.drawImage(this.cacheCanvas,0,0,this.width,this.height,-this.session.center.x,-this.session.center.x,this.width,this.height)):this.draw(t)},n.prototype.drawCall=function(i,s){"function"==typeof i&&(s=s||{},this.cache=s.cache||!1,this.cached=!1,this.session=s.session||{center:{x:0,y:0},width:100,height:100},this.draw=i||t)},JC.Text=r,r.prototype=Object.create(JC.Container.prototype),r.prototype.constructor=JC.Text,r.prototype.renderMe=function(t){t.font=this.font,t.textAlign=this.textAlign,t.textBaseline=this.textBaseline,this.UF&&(t.fillStyle=this.color,t.fillText(this.text,0,0)),this.US&&(t.lineWidth=this.lineWidth,t.strokeStyle=this.color,t.strokeText(this.text,0,0))},JC.Stage=a,a.prototype=Object.create(JC.Container.prototype),a.prototype.constructor=JC.Stage,a.prototype.resize=function(t,i){this.width=this.canvas.width=t,this.height=this.canvas.height=i},a.prototype.render=function(){this.updateChilds(),this.renderChilds()},a.prototype.renderChilds=function(){this.ctx.setTransform(1,0,0,1,0,0),this.autoClear&&this.ctx.clearRect(0,0,this.width,this.height);for(var t=0,i=this.cds.length;i>t;t++){var s=this.cds[t];s.isVisible()&&s.render(this.ctx)}},"undefined"!=typeof exports?("undefined"!=typeof module&&module.exports&&(exports=module.exports=JC),exports.JC=JC):"undefined"!=typeof define&&define.amd&&define(JC)}();
!function(){function t(t){this.sprite={},this.OKNum=0,this.errNum=0,this.totalNum=0,this.imagesLoad(t)}window.JC=window.JC||{},t.prototype.imagesLoad=function(t){var i=this;for(var o in t)this.sprite[o]=new Image,this.totalNum++,this.sprite[o].onload=function(){i.OKNum++,i.OKNum>=i.totalNum&&i.imagesLoaded()},this.sprite[o].onerror=function(){i.errNum++},this.sprite[o].src=t[o]},t.prototype.imagesLoaded=null,t.prototype.getResult=function(t){return this.sprite[t]},JC.ImagesLoad=t}();
!function(){window.JC=window.JC||{},JC.TWEEN={easeBoth:function(n,i,t,e){return(n/=e/2)<1?t/2*n*n+i:-t/2*(--n*(n-2)-1)+i},extend:function(n){if(n)for(var i in n)"extend"!==i&&n[i]&&(this[i]=n[i])}}}();
//# sourceMappingURL=../maps/jcc2d.js.map
