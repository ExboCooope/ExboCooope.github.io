/**
 * Created by Exbo on 2017/1/2.
 */
hyz.resolution={
    script:function(){

        var w=document.body.clientWidth;
        var h=document.body.clientHeight-40;
        var q=w/640>h/480?h/480:w/640;
        if(q!=this.scale || w!=this.w || h!=this.h){
            this.scale=q;
            this.w=w;
            this.h=h;
            stgResizeCanvas("frame",(w-q*stg_width)/2+q*16,(h-q*stg_height)/2+q*16,0,0,608,stg_frame_h,q);
            stgResizeCanvas("ui",(w-q*stg_width)/2,(h-q*stg_height)/2,0,0,stg_width,stg_height,q);
            stgResizeCanvas("back",(w-q*stg_width)/2,(h-q*stg_height)/2,0,0,stg_width,stg_height,q);
            stgResizeCanvas("pause",(w-q*stg_width)/2,(h-q*stg_height)/2,0,0,stg_width,stg_height,q);
            var z=document.getElementById("1");
            z.style.top=h+"px";
            z.style.left=((w-q*480)/2)+"px";
        }
    },
    refresh:function(){
        this.w=0;
        this.script();
    }
};

hyz.left_screen_object={};
hyz.right_screen_object={};
hyz.left_bg_object={};
hyz.right_bg_object={};
hyz.full_screen_object={};
hyz.full_bg_object={};


hyz.left_pool=[];
hyz.right_pool=[];

function hyzAddObject(object,side){
    if(side){
        object.sid=side;
    }
    stgAddObject(object);
}



hyz.main_menu=new MenuHolderA1([100,100],[0,50],ife_loader);
hyz.item_start=new TextMenuItem("开始",1,1,null,1);

hyz.item_playreplay=new TextMenuItem("回放",1,0,null,1);
hyz.item_savereplay=new TextMenuItem("保存回放",1,0,null,0);
hyz.main_menu.pushItems(hyz.item_start,hyz.item_playreplay,hyz.item_savereplay);
hyz.item_playreplay.on_select={
    init:function(){replayStartLevel(0);}
};

hyz.item_savereplay.on_select={
    init:function(){
        var a=new Date();
        var b= _replay_common_data[0].data[0]+""+ a.toJSON();
        hyz.item_savereplay.selectable=false;
        downloadFile(b+".rpy",packReplay());
        stgDeleteSelf();
    }
};



function gLoadMenuSystem(){
    // stg_players_number=1;
    var a;
    var ks2;
    var g_keysetter_reset={script:function(){
        g_keysetter.active=1;
        tf2();
        stgDeleteSelf();
    }};
    var tf2=function(){

        for(var i in g_ks){
            g_keysetter.menu_pool[i].mtext=" " + g_ks[i]+" "+temp_key[i].toString();
        }
    };
    var tf3=function(){

        for(var i in g_ks){
            g_keysetter.menu_pool[i].mtext=" " + g_ks[i];
        }
    };
    var g_keysetter2_reset={init:function(){
        g_keysetter2.active=0;
        stg_target.menu_item.render.text="[???]";
        checkKeyChange();
    },script:function(){
        var k=checkKeyChange();
        if(k.length){
            temp_key[stg_target.menu_item.kid][stg_target.menu_item.kc]=k[0];
            var ta=stg_target.parent.select_id;
            stg_target.parent.gDeleteMenu();
            ks2(stg_target.menu_item.kid);
            stgAddObject(g_keysetter2);
            g_keysetter2.select_id=ta;
            stgDeleteSelf();
            TextMenuItem.sellock=1;
            TextMenuItem.backlock=1;
        }
    }};
    var g_keysetter2_add={init:function(){
        g_keysetter2.active=0;
        stg_target.menu_item.render.text="[???]";
        checkKeyChange();
    },script:function(){
        var k=checkKeyChange();
        if(k.length){
            temp_key[stg_target.menu_item.kid][stg_target.menu_item.kc]=k[0];
            g_keysetter2.gDeleteMenu();
            var ta=g_keysetter2.select_id;
            ks2(stg_target.menu_item.kid);
            stgAddObject(g_keysetter2);
            g_keysetter2.select_id=ta;
            stgDeleteSelf();
            TextMenuItem.sellock=1;
            TextMenuItem.backlock=1;
        }
    }};

    g_keysetter=new MenuHolderA1([40,40],[0,30],hyz.main_menu);


    var tf=function() {
        for (var i in g_ks) {
            a = new TextMenuItem(" " + g_ks[i], 1, 1, {kid: i, script: function () {

                ks2=function(thisid) {
                    tf3();
                    g_keysetter2 = new MenuHolderA1([300, 40], [0, 30], g_keysetter_reset);

                    for (var j in temp_key[thisid]) {
                        var b = new TextMenuItem("[" + temp_key[thisid][j] + "]", 1, 1, g_keysetter2_reset, 0);
                        b.kid = thisid;
                        b.kc = j;
                        b.kt = b;
                        g_keysetter2.pushItem(b);
                    }
                    b = new TextMenuItem("[+]", 1, 1, g_keysetter2_reset, 0);
                    b.kid = thisid;
                    b.kc = temp_key[thisid].length;
                    b.kt = b;
                    g_keysetter2.pushItem(b);
                    var b = new TextMenuItem("Remove", 1, 1, {kid: thisid,script: function () {
                        if (temp_key[stg_target.kid].length > 1) {
                            delete temp_key[stg_target.kid][temp_key[stg_target.kid].length - 1];
                            temp_key[stg_target.kid].length=temp_key[stg_target.kid].length-1;
                            g_keysetter2.gDeleteMenu();
                            var ta=g_keysetter2.select_id-1;
                            ks2(stg_target.kid);
                            stgAddObject(g_keysetter2);
                            g_keysetter2.select_id=ta;

                        }else{
                            stgAddObject(g_keysetter2);
                        }
                        stgDeleteSelf();
                    }}, 1);
                    g_keysetter2.pushItem(b);
                    stgAddObject(g_keysetter2);
                };
                ks2(stg_target.kid);
                g_keysetter.active=0;
                stgDeleteSelf();
            }}, 0);
            g_keysetter.pushItem(a);
        }
        a = new TextMenuItem("保存", 1, 1,{script:function(){stgDeleteSelf();_key_map[g_keysetter.slot]=clone(temp_key);stgSaveKeyMap();}}, 0);
        g_keysetter.pushItem(a);
        a = new TextMenuItem("返回", 1, 1,hyz.main_menu, 1);
        g_keysetter.pushItem(a);
        tf2();
    };
    hyz.key_setter=new TextMenuItem("键位设置(1P)",1,1,{init:function(){temp_key=clone(_key_map[0]);stgDeleteSelf();g_keysetter.slot=0;tf2();stgAddObject(g_keysetter)}},1);
    hyz.key_setter2=new TextMenuItem("键位设置(2P)",1,1,{init:function(){temp_key=clone(_key_map[1]);stgDeleteSelf();g_keysetter.slot=1;tf2();stgAddObject(g_keysetter)}},1);
    temp_key=clone(_key_map[0]);
    tf();
    hyz.main_menu.pushItem( hyz.key_setter);
    hyz.main_menu.pushItem( hyz.key_setter2);



}


var temp_key=_key_map;

var g_keysetter={};
var g_keysetter2={};
var g_ks=["射击","低速","雷","上","下","左","右","暂停","replay加速","特殊1","特殊2"];


var hyz_pause_menu=new MenuHolderA1([400,240],[0,30],hyz_pause_menu);
hyz_pause_menu.a1=new TextMenuItem("继续",1,1,{script:function(){   //stgHideCanvas("pause");
    _stgChangeGameState(stg_const.GAME_RUNNING);
    stgDeleteObject(hyz.pause_script); stgResumeSE("BGM");
    //default_ui_shader.procedure_1.pool[3].alpha=0;
    stgHideCanvas("pause");
}},1);
hyz_pause_menu.a2=new TextMenuItem("结束游戏",1,1,{script:function(){
    stgCloseLevel();
    stgDeleteSelf();
    stgHideCanvas("pause");
    //default_ui_shader.procedure_1.pool[3].alpha=0;
}},1);

hyz_pause_menu.pushItem(hyz_pause_menu.a1);
hyz_pause_menu.pushItem(hyz_pause_menu.a2);

hyz.pause_script={canvas:null,lock:0};
hyz.pause_script.init=function(){
    MenuHolderA1.sellock=1;
    if(!this.canvas){
        this.canvas=stgCreateCanvas("pause",640,480,stg_const.TEX_CANVAS2D);
    }
    stgAddObject(hyz.resolution);
    stgShowCanvas("pause",0,0,0,0,10);
    stgClearCanvas("pause");
    hyz.resolution.scale=0;//refresh
    // stgPauseSE("BGM");
    // stgHideCanvas("ui");
    // stgHideCanvas("back");
    // stgHideCanvas("frame");


    var a2 = new StgProcedure("pause", 0, 100);
    a2.o_width=640;
    a2.o_height=480;
    a2.shader_order = ["testShader2"];
    stg_procedures["drawPause"] = a2;
    stg_display = ["drawPause"];//,"drawUI"];

    var cobj1=new StgObject;
    cobj1.render=new StgRender("testShader2");
    miscApplyAttr(cobj1.render, {type: 3, x: 16, y: 16, w: 608, h: 448, texture: "frame"});
    cobj1.layer = 0;
    cobj1.pos = [0, 0, 0];
    cobj1.rotate = [0, 0, 0];
    cobj1.t=0;
    cobj1.render.alpha=20;
    cobj1.script=function(){
        if(cobj1.t<15){
            var dx=Math.random()*8-4;
            var dy=Math.random()*8-4;

            miscApplyAttr(cobj1.render, {type: 3,color:"#A00", x: 16+dx, y: 16+dy, w: 608, h: 448, texture: "frame"});
            cobj1.t++;
        }else{
            stgAddObject(hyz_pause_menu);
            stgDeleteObject(cobj1);
        }
    };
   // stgAddObject(cobj1);
    stgAddObject(hyz_pause_menu);
    this.lock=1;
};

var hyz_system_script={};

hyz_system_script.init=function(){
    this.fps_drawer=new RenderText(300, 464);
    var a=new HyzHitChainShower();
    hyzAddObject(a,1);
};

hyz_system_script.script=function(){

    stg_common_data.current_combo_time[0];



    if(stg_replay_end==1){
        stgCloseLevel();
        stg_in_replay=0;
        stg_replay_end=0;
    }
    this.fps_drawer.render.text="" + (stg_fps >> 0) + " FPS";
};

function loadHyzFont(){
    stgCreateImageTexture("font_ascii","res/ascii.png");
    renderCreate2DTemplateA2("ascii","font_ascii",0,0,14,14,18,6,0,1);
    renderCreate2DTemplateA1("ascii_num","font_ascii",0,248,8,8,8,0,0,1);
}

function HyzFontHolder1(){
    this.value="";
    this.objlist=[];
    this.time=30;
}
HyzFontHolder1.prototype.script=function(){
    var n=this.value.length;
    var a=this.objlist;
    for(var i=0;i<n;i++){
        if(!a[i]) {
            a[i] = {};
            a[i].render = new StgRender("sprite_shader");
            stgAddObject(a[i]);
            a[i].base={target:this,auto_remove:1};
        }
        a[i].layer=this.layer;
        a[i].pos[0]=this.pos[0]-8*n+8*i;
        a[i].pos[1]=this.pos[1];
        renderApply2DTemplate(a[i].render,"ascii_num",+this.value[i]);
        a[i].update=true;
    }
    for(i=n;i< a.length;i++){
        if(a[i]){
            stgDeleteObject(a[i]);
            delete a[i];
        }
    }
    this.time--;
    if(this.time<=0)stgDeleteSelf();
};

function HyzFontHolder2(){
    this.value="";
    this.objlist=[];
    this.single_width=8;
    this.scale=[1,1];
    this.color=[1,1,1,1];
}
HyzFontHolder2.prototype.script=function(){
    var n=this.value.length;
    var a=this.objlist;
    for(var i=0;i<n;i++){
        if(!a[i]) {
            a[i] = {};
            a[i].render = new StgRender("sprite_shader");
            stgAddObject(a[i]);
            a[i].base={target:this,auto_remove:true};
        }
        a[i].layer=this.layer;
        a[i].pos[0]=this.pos[0]-this.single_width*n+this.single_width*i;
        a[i].pos[1]=this.pos[1];
        renderApply2DTemplate3(a[i].render,"ascii",this.value.charCodeAt(i)-32);
        a[i].render.color=this.color;
        a[i].render.scale[0]=this.scale[0];
        a[i].render.scale[1]=this.scale[1];
        a[i].update=true;
    }
    for(i=n;i< a.length;i++){
        if(a[i]){
            stgDeleteObject(a[i]);
            delete a[i];
        }
    }
};

function HyzHitChainShower() {

}
HyzHitChainShower.prototype.init=function(){
    this.obj1=new HyzFontHolder2();
    stgSetPositionA1(this.obj1,65,16);
    stgAddObject(this.obj1);
    stgBindDelete(this.obj1,this);
    this.obj1.color=[1,0.7,0.7];
    this.obj2=new HyzFontHolder2();
    stgSetPositionA1(this.obj2,65,36);
    stgAddObject(this.obj2);
    stgBindDelete(this.obj2,this);
    this.obj2.color=[1,0.7,0.7];
    this.obj1.layer=70;
    this.obj2.layer=70;
};
HyzHitChainShower.prototype.script=function(){

    var a=hyzGetHitChain();
    if(a>99)a=99;
    var s=""+a+"Hit";
    if(a<10)s='0'+s;
    this.obj1.value=s;
    a=hyzGetHitScore();
    if(a>999999)a=999999;
    s=""+a;
    while(s.length<6){
        s="0"+s;
    }
    this.obj2.value=s;
};




function hyzGetHitTime(sid){
    sid=sid||stg_target.sid;
    if(sid>0)return stg_common_data.current_combo_time[sid-1];
    return 0;
}
function hyzSetHitTime(sid,time){
    sid=sid||stg_target.sid;
    if(time>120)time=120;
    if(time<0)time=0;
    if(sid>0)stg_common_data.current_combo_time[sid-1]=time;
}
function hyzGetHitChain(sid){
    sid=sid||stg_target.sid;
    if(sid>0)return stg_common_data.current_hit[sid-1];
    return 0;
}
function hyzSetHitChain(sid,hitcount){
    sid=sid||stg_target.sid;
    if(hitcount<0)hitcount=0;
    if(sid>0)stg_common_data.current_hit[sid-1]=hitcount;
}
function hyzGetHitScore(sid){
    sid=sid||stg_target.sid;
    if(sid>0)return stg_common_data.current_chain_score[sid-1];
    return 0;
}
function hyzSetHitScore(sid,score){
    sid=sid||stg_target.sid;
    if(score>999999)score=999999;
    stg_common_data.current_chain_score[sid-1]=score;
    return 0;
}
function hyzGetSpellLevel(sid){
    sid=sid||stg_target.sid;
    if(sid>0)return stg_common_data.current_spell_level[sid-1];
    return 0;
}
function hyzSetSpellLevel(sid,hitcount){
    sid=sid||stg_target.sid;
    if(hitcount<0)hitcount=0;
    if(hitcount>16)hitcount=16;
    if(sid>0) stg_common_data.current_spell_level[sid-1]=hitcount;
}
function hyzGetBossLevel(sid){
    sid=sid||stg_target.sid;
    if(sid>0)return stg_common_data.current_boss_level[sid-1];
    return 0;
}
function hyzSetBossLevel(sid,hitcount){
    sid=sid||stg_target.sid;
    if(hitcount<0)hitcount=0;
    if(hitcount>16)hitcount=16;
    if(sid>0) stg_common_data.current_boss_level[sid-1]=hitcount;
}


function hyzGetKey(sid,keyid){
    sid=sid||stg_target.sid;
    return keyid===undefined?stg_players[sid-1].key:stg_players[sid-1].key[keyid];
}
function hyzDefaultPlayerChainSystem(){
    var a=hyzGetHitTime();
    var b=hyzGetHitScore();
    var c=hyzGetHitChain();
    if(a==0 && c!=0){
        hyzSetHitChain(0);
        hyzSetHitScore(0);
    }else{
        hyzSetHitTime(a-1);
    }
}
function hyzDefaultPlayerChargeSystem(){

}
function hyzGetSuperPauseTime(){
    return stg_super_pause_time;
}

function hyzSetSuperPauseTime(time){
    _stg_super_pause_time=time;
}
function hyzObjSetIgnoreSuperPauseTime(obj,ignore){
    obj.ignore_super_pause=ignore;
}
function stgBindDelete(obj,baseobj){
    obj.base={target:baseobj,auto_remove:true};
}
function hyzGetPlayer(sid){
    sid=sid||stg_target.sid;
    return stg_players[sid-1];
}
hyz.battle_style=0;
function hyzSetBattleStyle(style,changetype){
    if(hyz.battle_style!=style){
        hyz.battle_style=style;
        if(style==1){
            //change from 2 -> 1(large)
            for(var i=0;i<_pool.length;i++){
                var a=_pool[i];
                if(a.sid==2){
                    var pos= a.pos;
                    if(pos){
                        stgSetPositionA1(a,pos[0]+320,pos[1]);
                    }
                }
            }

            stg_frame_w=608;

            stgDeleteObject(hyz.left_bg_object);
            stgDeleteObject(hyz.right_bg_object);
            stgDeleteObject(hyz.left_screen_object);
            stgDeleteObject(hyz.right_screen_object);
            hyzAddObject(hyz.full_bg_object,0);
            hyzAddObject(hyz.full_screen_object,0);
            hyz.base[2][0]=320;

            stg_display = ["drawBackground","drawFullBGFrame","drawFullFrame",
                "drawCombineFrame","drawUI"];

        }else if(style==0){

            if(changetype==0) {
                for (var i = 0; i < _pool.length; i++) {
                    var a = _pool[i];
                    if (a.sid == 2) {
                        var pos = a.pos;
                        if (pos) {
                            stgSetPositionA1(a, pos[0] - 320, pos[1]);
                        }
                    }
                }
            }else if(changetype==1){
                for (var i = 0; i < _pool.length; i++) {
                    var a = _pool[i];
                    var pos = a.pos;
                    if (pos) {
                        if (a.type == stg_const.OBJ_ENEMY || a.type == stg_const.OBJ_BULLET) {

                            if (pos[0] > 304) {
                                stgSetPositionA1(a, pos[0] - 320, pos[1]);
                                a.sid = 2;
                            } else {
                                a.sid = 1;
                            }
                        }
                        else {
                            if (a.sid == 2) {
                                stgSetPositionA1(a, pos[0] - 320, pos[1]);
                            }
                        }
                    }
                }
            }

            stg_frame_w=288;
            hyz.base[2][0]=0;
            hyzAddObject(hyz.left_bg_object,1);
            hyzAddObject(hyz.right_bg_object,2);
            hyzAddObject(hyz.left_screen_object,0);
            hyzAddObject(hyz.right_screen_object,0);
            stgDeleteObject(hyz.full_bg_object);
            stgDeleteObject(hyz.full_screen_object);
            hyzSetPositionA1(hyz.right_bg_object,0,0);

            stg_display = ["drawBackground","drawBGFrame","drawLeftFrame",
                "drawRightFrame","drawCombineFrame","drawUI"];

        }


    }
}

hyz.base=[[0,0],[0,0],[0,0],[0,0]];

function hyzSetPositionA1(target,x,y){
    if(!target.pos){
        target.pos=[];

    }
    var sid=target.sid||stg_target.sid||0;
    x=x+hyz.base[sid][0];
    y=y+hyz.base[sid][1];
    target.pos[0]=x;
    target.pos[1]=y;
    if(target.move){
        target.move.pos[0]=x;
        target.move.pos[1]=y;
    }
}