var MainScene = cc.Scene.extend({
    ctor:function() {
        this._super();
        
        var bg = new cc.Sprite(res.sudoku_bg);
        bg.x = GAME_DESIGN_WIDTH/2;
        bg.y = GAME_DESIGN_HEIGHT/2;
        this.addChild(bg);
        
        var game_title = new cc.Sprite(res.game_title_png);
        this.addChild(game_title);
        game_title.x = GAME_DESIGN_WIDTH/2;
        game_title.y = GAME_DESIGN_HEIGHT - 100;
        // 163 , 48
        var play_img = new cc.Sprite();
        play_img.setTextureRect(cc.rect(0,0,163, 48));
        play_img.setOpacity(0);
        var play_spr = new cc.Sprite(res.btn_play_png);
        play_spr.setScale(0.9);
        play_img.addChild(play_spr);
        play_spr.x = play_img.width/2;
        play_spr.y = play_img.height/2;
        var btn_item = new cc.MenuItemSprite(
            play_img, 
            new cc.Sprite(res.btn_play_png),
            null, 
            this.isNextScene,
            this
        );
        var btn_play = new cc.Menu(btn_item);
        btn_play.x = GAME_DESIGN_WIDTH/2;
        btn_play.y = 120;
        this.addChild(btn_play);
    }, 
    
    onEnter:function() {
        this._super();
    },
    
    isNextScene:function() {
        // var trans = new cc.TransitionCrossFade(1,new SelectMode());
        var trans = new cc.TransitionFade(1,new SelectMode(),new cc.Color(0,0,0));
        cc.director.runScene(trans);
    }
});


var SelectMode = cc.Scene.extend({
    
    ctor:function() {
        this._super();
        var bg = new cc.Sprite(res.sudoku_bg);
        bg.x = GAME_DESIGN_WIDTH/2;
        bg.y = GAME_DESIGN_HEIGHT/2;
        this.addChild(bg);
        
        var bg_layer = new cc.Sprite(res.black_png);
        bg_layer.x = GAME_DESIGN_WIDTH/2;
        bg_layer.y = GAME_DESIGN_HEIGHT/2;
        this.addChild(bg_layer);
        
        var game_title = new cc.Sprite(res.diff_title_png);
        this.addChild(game_title);
        game_title.x = GAME_DESIGN_WIDTH/2;
        game_title.y = GAME_DESIGN_HEIGHT - 100;
        
        var btn_arr = [res.btn_easy_png , res.btn_normal_png , res.btn_hard_png];
        for(var i = 0 ; i < 3; i++) {
            var play_img = new cc.Sprite();
            play_img.setTextureRect(cc.rect(0,0,163, 48));
            play_img.setOpacity(0);
            var play_spr = new cc.Sprite(btn_arr[i]);
            play_spr.setScale(0.9);
            play_img.addChild(play_spr);
            play_spr.x = play_img.width/2;
            play_spr.y = play_img.height/2;
            var btn_item = new cc.MenuItemSprite(
                play_img, 
                new cc.Sprite(btn_arr[i]),
                null, 
                this.isNextScene,
                this
            );
            btn_item.setTag((i+1));
            var btn_play = new cc.Menu(btn_item);
            btn_play.x = GAME_DESIGN_WIDTH/2;
            btn_play.y = 310 - ((play_img.height+10)*i);
            this.addChild(btn_play);   
        }
    },
    
    onEnter:function() {
        this._super();  
    },
    
    isNextScene:function(pSender) {
        var mode = pSender.getTag() - 1;
        
        var black = new cc.Color(0,0,0);
        cc.director.runScene(new cc.TransitionFade(1, new GameScene(mode)), black);
    },
    
});




