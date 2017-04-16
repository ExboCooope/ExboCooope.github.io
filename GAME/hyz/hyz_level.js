/**
 * Created by Exbo on 2017/1/2.
 */
hyz.level_commondata_template= {
    players: ['reimu', 'reimu'],
    pal: [0, 1],
    game_type: 0,
    current_hit:[99,30],
    current_chain_score:[9102,30140],
    current_combo_time:[120,120],
    BGM:"some",
    place:"some",
    control:[0,-1]
};

hyz.set_up_frame_object={
    init:function(){
        stgAddObject(hyz.resolution);
        stgShowCanvas("frame",0,0,0,0,5);
        stg_display = ["drawBackground","drawBGFrame","drawLeftFrame",
            "drawRightFrame","drawCombineFrame","drawUI"];
        hyz.resolution.refresh();
        stgAddObject(hyz.left_bg_object);
        stgAddObject(hyz.right_bg_object);
        stgAddObject(hyz.left_screen_object);
        stgAddObject(hyz.right_screen_object);
        stgAddObject(hyz.dot_pool);
        stgDeleteSelf();
    }
};

hyz.level={};
hyz.level.init=function(){
    stgAddObject(hyz.set_up_frame_object);
    stgAddObject(background_controller);
    stgAddObject(background_01);
    stg_players[0].sid=1;
    stg_common_data.current_hit=[0,0];
    stg_common_data.current_chain_score=[0,0];
    stg_common_data.current_combo_time=[0,0];
    stg_common_data.current_charge_max=[100,100];
    stg_common_data.current_charge=[0,0];
    stg_common_data.current_spell_level=[6,6];
    stg_common_data.current_boss_level=[6,6];


    // var e1=new Hyz_enemy(0,0);
  //  hyzAddObject(e1,1);
 //   stgAddObject(hyz.enemy_maker);
    var test_object={};
    test_object.render=new StgRender("basic_shader");
    test_object.render.texture="123";

    test_object.on_render=function(gl){
        if(!test_object.render.buffer){
           // test_object.render.buffer=[gl.createBuffer(),gl.createBuffer(),gl.createBuffer()];
            var a=WGLA.newBuffer(gl,4,2,3,WGLConst.DATA_FLOAT);
            a.buffer.set([50,50,50,100,100,50]);
            a.uploadData();
           // var a=new Float32Array([50,50,50,100,100,50]);
            var b=new Float32Array([1,0,0,1,0,1,0,1,0,0,1,1]);
            var c=new Float32Array([0,0,0,1,1,0]);
            test_object.render.buffer=[a,b,c];
            //gl.bindBuffer(gl.ARRAY_BUFFER,test_object.render.buffer[0]);
           // gl.bufferData(gl.ARRAY_BUFFER,a,gl.STATIC_DRAW);
           // gl.bindBuffer(gl.ARRAY_BUFFER,test_object.render.buffer[1]);
          //  gl.bufferData(gl.ARRAY_BUFFER,b,gl.STATIC_DRAW);
          //  gl.bindBuffer(gl.ARRAY_BUFFER,test_object.render.buffer[2]);
          //  gl.bufferData(gl.ARRAY_BUFFER,c,gl.STATIC_DRAW);
        }
        _webGlUniformInput(hyzPrimitive2DShader, "texture",stg_textures["3dTex2"]);
       // _webGlUniformInput(hyzPrimitive2DShader, "aPosition",test_object.render.buffer[0]);
        GlBufferInput(hyzPrimitive2DShader, "aPosition",test_object.render.buffer[0]);
        _webGlUniformInput(hyzPrimitive2DShader, "aColor",test_object.render.buffer[1]);
        _webGlUniformInput(hyzPrimitive2DShader, "aTexture",test_object.render.buffer[2]);
        gl.drawArrays(gl.TRIANGLES,0,3);
    }
    test_object.layer=75;
    hyzAddObject(test_object,1);

    var test2=new HeadedLaserA1(30,10+stg_rand(stg_frame_w-10),100,8);
    test2.layer=78;
    test2.script=function(){
        if(this.frame==1)stgEnableMove();
        if(this.frame%120==1){
            var a=hyzGetPlayer();

        //    luaMoveTo(a.pos[0], a.pos[1],100,0);
            var k=this.frame==1?[stg_rand(stg_frame_w),stg_rand(70)]:extendlength(this.pos,this.move.speed_angle,50);
           var z=this.frame%240==1?[a.pos[0], a.pos[1]]:[stg_rand(stg_frame_w),stg_rand(70)];
            luaBezierMoveTo([k,[stg_rand(stg_frame_w),stg_rand(70)],z],120);
        }
//        stgSetPositionA1(this,70+60*sin(this.frame*5*PI180),70+60*cos(this.frame*5*PI180));
    };
    hyzAddObject(test2,1);



//    hyzAddObject(a,1);

    a=new HyzFontHolder2();
    a.value="a12345!";
    stgSetPositionA1(a,100,30);
    a.layer=24;
    a.sid=1;
    hyzAddObject(a,1);
    this.chain1=a;
    this.f=0;
};
hyz.level.script=function(){
    this.f++;
    this.chain1.value=""+stg_common_data.current_hit[0];
    /*
    if(this.f%6==0) {
        var blt;
        blt = stgCreateShotA1(144 - 8, 400, 12, 270, "plMainShot2", 0, 0);
        blt.damage = 15;
        blt.sid=2;
        blt.side=stg_const.SIDE_PLAYER;
        blt = stgCreateShotA1(144 + 8, 400, 12, 270, "plMainShot2", 0, 0);
        blt.damage = 15;
        blt.sid=2;
        blt.side=stg_const.SIDE_PLAYER;
    }*/
   // stg_players[1].key[stg_const.KEY_SHOT]=1;

    if(this.frame%60==1){
        var l=hyzGetSpellLevel(2);
        hyzSetSpellLevel(2,l+1);
       // var a=new Player_Remilia.ChargeShooter2(stg_rand(stg_frame_w),90,l);
      //  var a=new Player_Remilia.ChargeShooter(stg_rand(stg_frame_w),90,l);
      //  var a=new Player_Remilia.ExShooter(stg_rand(stg_frame_w),90);
     //   hyzAddObject(a,1);
    }

};

hyz.enemy_maker={};
hyz.enemy_maker.init=function(){
    this.clocks=[500,500];
    this.current_id=[0,0];
    this.current_p=[0,0];
};
hyz.enemy_maker.script=function(){
    for(var i=0;i<2;i++){
        this.clocks[i]++;
        var tcnt=24*6;
        if(stg_players[i]){
            if(stg_players[i].key){
                if(stg_players[i].key[stg_const.KEY_SLOW]){
                    tcnt*=2;
                }
            }
        }
        if(this.clocks[i]>tcnt) {
            this.clocks[i] = 0;
            this.current_id[i] = Math.floor(stg_rand(0, Hyz_enemy.waypoint.length));
            this.current_p[i] = stg_rnd() > 0.5 ? 1 : 0;
        }
        if(this.clocks[i]%24==0){
            var j=this.clocks[i]/24;
            if(j<6) {
                var q = 0;
                if (this.current_p[i] == 0 && this.current_id[i]!=12 && this.current_id[i]!=13) {
                    if (j == 0) {
                        q = 2;
                    } else if (j == 1) {
                        q = 1;
                    }
                } else {
                    if (j == 5) {
                        q = 2;
                    } else if (j == 4) {
                        q = 1;
                    }
                }
                var ene = new Hyz_enemy(q, this.current_id[i]);
                hyzAddObject(ene, i + 1);
            }
        }
    }
};

stg_level_templates["hyz_level"]=hyz.level;

function Hyz_enemy(type,path){
    this.path=path;
    this.enetype=type;
}
Hyz_enemy.typearrays=[
        [0,0,32,32],
        [0,128,48,48],
        [0,224,64,64]
    ];
Hyz_enemy.waypoint=[
    [144-50,-10,45,0,140,1,135,0,400],
    [144+50,-10,135,0,140,-1,135,0,400],
    [20,-10,90,0,90,-1,135,0,400],
    [288-20,-10,90,0,90,1,135,0,400],
    [70,-10,90,0,90,-1,135,0,400],
    [288-70,-10,90,0,90,1,135,0,400],
    [-10,100,0,0,400],
    [-10,200,0,0,400],
    [-10,300,0,0,400],
    [288+10,100,180,0,400],
    [288+10,200,180,0,400],
    [288+10,300,180,0,400],
    [20,458,270,0,90,1,135,0,400],
    [288-20,458,270,0,90,-1,135,0,400]
];
Hyz_enemy.prototype.init=function(){
    var imd=Hyz_enemy.typearrays[this.enetype];
    this.wp=Hyz_enemy.waypoint[this.path];
    this.inscreen_flag=false;
    this.move=new StgMove();
    hyzSetPositionA1(this,this.wp[0],this.wp[1]);
    stgApplyEnemy(this);
    this.life=40;
    this.move.speed=1.5;
    this.move.speed_angle=this.wp[2]*PI180;
    this.tick=0;
    this.hd=3;

    this.hitby=new StgHitDef();
    this.hitby.range=12;
    this.hitdef=new StgHitDef();
    this.hitdef.range=12;


    var img=new EnemyFairyHolder(this,imd[0],imd[1],imd[2],imd[3]);
    stgAddObject(img);
};
Hyz_enemy.prototype.script=function(){
    this.tick++;
    if(this.tick>this.wp[this.hd+1]){
        this.tick=0;
        this.hd+=2;
    }
    this.move.speed_angle+=this.wp[this.hd]*PI180;

    if(this.pos[0]>0 && this.pos[0]<stg_frame_w && this.pos[1]>0 && this.pos[1]<stg_frame_h){
        this.inscreen_flag=true;
    }else{
        if(this.inscreen_flag==true){
            stgDeleteSelf();
        }
    }

    if(this.life<0){
        var p=this.hit_by_list;
        var flag=0;
        for(var pi in p){
            if(!p[pi].keep_chain){
                stg_common_data.current_hit[this.sid-1]=0;
                flag=1;
            }
        }
        stg_common_data.current_hit[this.sid-1]++;
        stg_common_data.current_combo_time[this.sid-1]+=40;
        if(stg_common_data.current_combo_time[this.sid-1]>120)stg_common_data.current_combo_time[this.sid-1]=120;
        stgDeleteSelf();
        stgAddObject(new Hyz_boom(this.pos[0],this.pos[1],1+this.enetype*0.2));
        stgAddObject(new HyzCrossEffect(this.sid-1,this.sid,this.pos,3-this.sid,[stg_rand(0,288),stg_rand(0,144)],60,1,0));
    }
};

function Hyz_boom(x,y,scale){
    stgSetPositionA1(this,x,y);
    this.render=new StgRender("sprite_shader");
    this.sc=scale;
    renderApply2DTemplate(this.render,"ene_boom",0);
    this.layer=stg_const.LAYER_HINT;
}
Hyz_boom.prototype.init=function(){
    this.tick=0;
    this.render.scale[0]=0;
    this.render.scale[1]=0;
    this.damage=3;
    this.hitdef=new StgHitDef();
    this.keep_chain=true;

};
Hyz_boom.prototype.script=function(){
    this.tick++;
    var sc=this.tick/20*(1+this.sc*0.5);
    this.render.scale[0]=sc;
    this.render.scale[1]=sc;
    this.update=true;
    this.side=stg_const.SIDE_PLAYER;
    this.hitdef.range=20+sc*20;
    hyzCancelDotBullet(this.pos,40+this.sc*10,this.sid);
    if(this.tick>20){
        stgDeleteSelf();
    }
};

hyz.dot_pool={pool:[]};
hyz.dot_pool.init=function(){
    this.pool=[];
};
hyz.dot_pool.script=function(){
    for(var i=0;i<this.pool.length;i++){
        if(this.pool[i]){
            if(this.pool[i].remove){
                delete this.pool[i];
            }
        }
    }
};
hyz.dot_pool.add=function(obj){
    for(var i=0;i<this.pool.length;i++){
        if(!this.pool[i]){
            this.pool[i]=obj;
            return;
        }
    }
    this.pool.push(obj);
};
hyzCancelDotBullet=function(pos,r,sid){
    var a=hyz.dot_pool.pool;
    for(var i=0;i<a.length;i++){
        if(a[i]){
            if(!a[i].remove && a[i].sid==sid){
                if(sqrt2(pos,a[i].pos)<r) {
                    stgDeleteObject(a[i]);
                    var b=new HyzFontHolder1();
                    var s=hyzGetHitScore();
                   // var c=hyzGetHitChain();
                    s=s+100;
                    hyzSetHitScore(0,s);
                    if(s>999999)s=999999;
                    b.value=""+s;
                    stgSetPositionA1(b,a[i].pos[0],a[i].pos[1]);
                    b.layer=70;
                    stgAddObject(b);
                    stg_common_data.current_hit[sid-1]++;
                    stgAddObject(new HyzCrossEffect(sid-1,sid,a[i].pos,3-sid,[stg_rand(0,288),stg_rand(0,144)],60,1,0));
                    delete a[i];
                }
            }
        }
    }
};


function HyzCrossEffect(type,sid1,pos1,sid2,pos2,time,scale,finishfunction){
    this.t=time;
    this.pos=[0,0,0];
    this.opos=[0,0];
    this.tpos=[0,0];
    this.tick=0;
    this.rotate=[0,0,0];
    this.finishf=finishfunction;
    this.layer=250;
    hyzSpriteShader.layer_blend[250]=1;
    hyzGetFramePos(sid1,pos1,this.pos);
    this.opos[0]=this.pos[0];
    this.opos[1]=this.pos[1];
    this.fx=pos2[0];
    this.fy=pos2[1];
    this.tsid=sid2;
    hyzGetFramePos(sid2,pos2,this.tpos);
    this.tp=type;
    this.render=new StgRender("sprite_shader");
    this.sc=scale;
    this.render.scale[0]=scale;
    this.render.scale[1]=scale;
    renderApply2DTemplate(this.render,"bounce_"+type,0);
}
HyzCrossEffect.prototype.script=function(){
    this.sid=0;
    this.tick++;
   if(this.tick%6==0){
       renderApply2DTemplate(this.render,"bounce_"+this.tp,(this.tick/6)%4);
       this.update=true;
   }
    this.pos[0]=(this.tpos[0]-this.opos[0])*this.tick/this.t+this.opos[0];
    this.pos[1]=(this.tpos[1]-this.opos[1])*this.tick/this.t+this.opos[1];
    if(this.tick>this.t){
        stgDeleteSelf();
        if(this.finishf==0){
            this.side=stg_const.SIDE_ENEMY;
            stgCreateShotA1(this.fx,this.fy,stg_rand(1,3),stg_rand(60,120),"tDD",6,0).sid=this.tsid;
        }
    }
}
function hyzGetFramePos(sid,pos,outpos){
    if(sid==0 || sid==1){
        outpos[0]=pos[0];
        outpos[1]=pos[1];
    }else {
        outpos[0] = pos[0] + 336;
        outpos[1]=pos[1];
    }
}


