/**
 * Created by Exbo on 2017/4/16.
 */
var luastg={};
function luaMoveTo(x,y,frames,mode,obj){
    obj=obj||stg_target;
    if(!obj.lua)obj.lua={};
    obj.lua.move={};
    obj.lua.move.mod=mode;
    obj.lua.move.spos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.lpos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.tpos=[x,y];
    obj.lua.move.frame=frames;
    obj.lua.move.cframe=0;
    obj.lua.move.script=mode?bezier42:clamp;
    obj.after_move=luastg.moveTo;
}
function luaBezierMoveTo(poslist,frames,obj){
    obj=obj||stg_target;
    if(!obj.lua)obj.lua={};
    obj.lua.move={};
    obj.lua.move.spos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.lpos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.tpos=poslist;
    obj.lua.move.frame=frames;
    obj.lua.move.cframe=0;

    obj.after_move=luastg.bmoveTo;
}
function luaSmoothBezierMoveTo(rate,pos,frames,obj){
    obj=obj||stg_target;
    if(!obj.lua)obj.lua={};
    obj.lua.move={};
    obj.lua.move.spos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.lpos=[obj.pos[0],obj.pos[1]];
    obj.lua.move.tpos=[extendlength(obj.pos,obj.move?obj.move.speed_angle:0,rate),pos];
    obj.lua.move.frame=frames;
    obj.lua.move.cframe=0;

    obj.after_move=luastg.bmoveTo;
}

luastg.moveTo=function(){
    var a=this.lua.move;
    a.cframe++;
    var f= a.cframe/ a.frame;
    stgSetPositionSpeedAngleA1(this, a.lpos, [a.script(a.spos[0], a.tpos[0],f), a.script(a.spos[1], a.tpos[1],f)]);
    if(a.cframe== a.frame){
        this.after_move=0;
    }
    a.lpos[0]=this.pos[0];
    a.lpos[1]=this.pos[1];
};
function beziern(target,poss,posl,f){
    var n=posl.length;
    var q=1-f;
    if(n==1){
        target[0]=q*poss[0]+f*posl[0][0];
        target[1]=q*poss[1]+f*posl[0][1];
    }else if(n==2){
        target[0]=q*q*poss[0]+2*q*f*posl[0][0]+f*f*posl[1][0];
        target[1]=q*q*poss[1]+2*q*f*posl[0][1]+f*f*posl[1][1];
    }else if(n>=3){
        target[0]=q*q*q*poss[0]+3*q*q*f*posl[0][0]+3*f*q*f*posl[1][0]+f*f*f*posl[2][0];
        target[1]=q*q*q*poss[1]+3*q*q*f*posl[0][1]+3*f*q*f*posl[1][1]+f*f*f*posl[2][1];
    }
}
luastg.bmoveTo=function(){
    var a=this.lua.move;
    a.cframe++;
    var f= a.cframe/ a.frame;
    beziern(this.pos, a.spos,a.tpos,f);
    stgSetPositionSpeedAngleA1(this, a.lpos, this.pos);
    if(a.cframe== a.frame){
        this.after_move=0;
    }
    a.lpos[0]=this.pos[0];
    a.lpos[1]=this.pos[1];
};

luastg.BossResourceHolder=function(ImageName,xs,ys,standi,lefti,righti,spelli,boss){
    this.resname=ImageName+"_lua";
    var tw=stg_textures[ImageName].width;
    var th=stg_textures[ImageName].height;
    renderCreate2DTemplateA2(this.resname,ImageName,0,0,tw/xs,th/ys,xs,ys,0,1);
    this.render=new StgRender("sprite_shader");
    this.boss=boss;
    this.base=new StgBase(boss,stg_const.BASE_NONE,1);
    this.resolve_move=1;
    this.animes=[standi,righti,lefti,spelli];
    this.xs=xs;
    this.layer=stg_const.LAYER_ENEMY;
    stgEnableMove(this);
};

luastg.BossResourceHolder.prototype.on_move=function() {
    this.pos[0]=this.boss.pos[0];
    this.pos[1]=this.boss.pos[1];
};
luastg.BossResourceHolder.prototype.init=function() {
    this.anime=0;
    this.animei=0;
    this.animef=0;
    this.cast=0;
};
luastg.BossResourceHolder.prototype.script=function(){
    //获得当前动作
    var angle=this.move.speed?this.move.speed_angle/PI180:90;
    var ani=0;
    if(angle>135 && angle<225){
        ani=2;
    }else if(angle<45 || angle>315){
        ani=1;
    }
    if(this.boss.cast){
        ani=3;
    }

    if(this.anime==ani){
        this.animef++;
        if(this.animef>6){
            this.animef=0;
            this.animei++;
            if(this.animei>=this.animes[ani][0]){
                this.animei=this.animes[ani][1];
            }
            renderApply2DTemplate3(this.render,this.resname,ani*this.xs+this.animei);
            this.update=1;
        }
    }else{
        this.animef=0;
        this.animei=0;
        this.anime=ani;
        renderApply2DTemplate3(this.render,this.resname,ani*this.xs+this.animei);
        this.update=1;
    }
};


luastg.general={};
luastg.general.define=function(svar){

};

luastg.task={};
luastg.task.wait=function(itime){

};

var luastg_runtime={};

luastg._replace_function=function(v){
    return v.search(/\d/)?"luastg_runtime."+v:v;
}

luastg._expressions={};

luastg.express=function(sexpr){
    if(luastg._expressions[sexpr]){
        return luastg._expressions[sexpr];
    }
    var a= sexpr.replace(/\w+/g,luastg._replace_function);
    var s="luastg._tempfunction=function(){return "+a+";}";
    eval(s);
    luastg._expressions[sexpr]=luastg._tempfunction;
    return luastg._tempfunction;
}

function luaSetPosition(x,y,obj){
    obj=obj||stg_target;
    stgSetPositionA1(obj,x+stg_frame_w/2,stg_frame_h/2-y);
}