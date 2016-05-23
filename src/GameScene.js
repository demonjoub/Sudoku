var GameScene = cc.Scene.extend({
    
    mode:0, // 0 easy , 1 normal , 3 hard 
    sudokuArr:null, 
    blockArr:null,
    
    undoArr:null, 
    flagTurn:false,
    ustart:false,
    ucount:0,
    
    memo_flag:false,
    
    game_time:0,
    game_pause:false,
    
    TimerBGTAG:11,
    popupPauseTag:12,
    bgTag:13,
    
    test:true,
    
    pat : [
            [1,1,1,2,2,2,1,1,1],
            [1,1,1,2,2,2,1,1,1],
            [1,1,1,2,2,2,1,1,1],
            [2,2,2,1,1,1,2,2,2],
            [2,2,2,1,1,1,2,2,2],
            [2,2,2,1,1,1,2,2,2],
            [1,1,1,2,2,2,1,1,1],
            [1,1,1,2,2,2,1,1,1],
            [1,1,1,2,2,2,1,1,1]
        ],
    
    ctor:function(mode) {
        this._super();
        this.mode = mode;
        
        // create bg 
        var bg = new cc.Sprite(res.bg_game_png);
        bg.x = GAME_DESIGN_WIDTH/2;
        bg.y = GAME_DESIGN_HEIGHT/2;
        this.addChild(bg);
        
        var bg2 = new cc.Sprite(res.bg_png);
        bg2.x = GAME_DESIGN_WIDTH/2;
        bg2.y = GAME_DESIGN_HEIGHT/2;
        this.addChild(bg2);
        
        // create btn pause
        var spr_pause = new cc.Sprite();
        spr_pause.setTextureRect(cc.rect(0, 0, 50, 35));
        spr_pause.setOpacity(0);
        var img_pause = new cc.Sprite(res.btn_pause_png);
        img_pause.setScale(0.9);
        spr_pause.addChild(img_pause);
        img_pause.x = spr_pause.width/2;
        img_pause.y = spr_pause.height/2;
    
        var btn_item = new cc.MenuItemSprite(
            spr_pause, 
            new cc.Sprite(res.btn_pause_png),
            null, 
            this.isGamePause,
            this
        );
        var btn_pause = new cc.Menu(btn_item);
        btn_pause.x = spr_pause.width/2 + 10;
        btn_pause.y = GAME_DESIGN_HEIGHT - (spr_pause.height/2 + 10);
        this.addChild(btn_pause);
        // time 
        var time_bg = new cc.Sprite(res.bg_time);
        time_bg.x = GAME_DESIGN_WIDTH - (time_bg.width/2 + 10);
        time_bg.y = btn_pause.y;
        this.addChild(time_bg);
        
        var timeTxt = new cc.Sprite(res.time_txt_png);
        timeTxt.x = (time_bg.width/2) - 40; 
        timeTxt.y = (time_bg.height/2) - 2;
        time_bg.addChild(timeTxt);
        
        var game_time_spr = new TimeSprite();
        game_time_spr.x = time_bg.width/2;
        game_time_spr.y = (time_bg.height/2) - 2;
        time_bg.setTag(this.TimerBGTAG);
        game_time_spr.setTag(1);
        time_bg.addChild(game_time_spr);
        
        var res_name = res.easy_txt_png;
        if(this.mode == 1) {
            res_name = res.normal_txt_png;
        }
        else if(this.mode == 2) {
            res_name = res.hard_txt_png;
        }
        var spr_mode = new cc.Sprite(res_name);
        spr_mode.x = 110; 
        spr_mode.y = GAME_DESIGN_HEIGHT - 30;
        this.addChild(spr_mode);
    }, 
    
    onEnter:function() {
        this._super();
        // draw table 
        this.undoArr = new Array();
        this.flagTurn = false;
        this.ustart = false;
        this.ucount = 0;
        // =
        this.isDrawTableSudoku();
        this.isDrawBtnControl();
        
        this.addNumberUndo();
        this.scheduleOnce(this.setSchedule, 0.5);
    },
    
    setSchedule:function(dt) {
        this.schedule(this.StartTimer, 1.0);
    },
    
    StartTimer:function(dt) {
        if(this.game_pause == true) {
            return;
        }
        this.game_time += 1;
        var time_bg = this.getChildByTag(this.TimerBGTAG);
        var time_trick = time_bg.getChildByTag(1);
        time_trick.setTime(this.game_time);
    },
    
    isDrawTableSudoku:function() {
        var len = 0;
        var kkk = 1;
        var margine_x = GAME_DESIGN_WIDTH/2 - ((new SudokuBlock().width+1)*9)/2 - 1;
        var margine_y = GAME_DESIGN_HEIGHT - 80;
        var panding_x = 0;
        var panding_y = 0;
        
        this.sudokuArr = new Array();
        for(var i = 0 ; i < 81; i++) {
            this.sudokuArr.push(0);
        }
        
        this.blockArr = new Array();
        for(var i = 0; i < 9 ; i++) {
            this.blockArr.push(new Array());
            for(var j = 0 ; j < 9; j++) {
                this.blockArr[i].push(0);
            }
        }
        
        var sudoku_number_arr = new Array();
        sudoku_number_arr = this.solve(this.sudokuArr);
        console.log(sudoku_number_arr);
        sudoku_number_arr = this.isGanarateRandom(sudoku_number_arr);
        console.log(sudoku_number_arr);
        
        for(var i = 0 ; i < 9 ;i++) {
            panding_x = 0;
            
            for(var j = 0 ; j < 9 ; j++) {
                var num = sudoku_number_arr[i*9+j];
                var block = new SudokuBlock();
                block.setAnchorPoint(0,0);
                block.x = margine_x + ((block.width+1)*j) + panding_x;
                block.y = margine_y - ((block.height+1)*i) - panding_y;
                block.setBlock(this.pat[i][j]);
                block.setNumber(num);
                if(num == 0) {
                    block.SetEnabledButton(false);
                }
                else {
                    block.SetEnabledButton(true);
                }
                this.addChild(block);
                this.blockArr[i][j] = block;
                if((j+1) % 3 == 0) {
                    panding_x += 1;
                    kkk++;
                }
                
            }
            
            if((i+1) % 3 == 0) {
                panding_y += 1;
                
            }
        }
    },
    
    isDrawBtnControl:function() {
        var btnArr = [1,2,3,4,5,"undo","del"];
        var margine_x = GAME_DESIGN_WIDTH/2 - ((41+2)*7)/2;
        for(var i = 0 ; i < btnArr.length; i++)     {
            var btn = new ButtonControl(btnArr[i]);
            btn.setAnchorPoint(0,0);
            btn.x = margine_x + (btn.width+2)*i;
            btn.y = 93;
            this.addChild(btn);    
        }
        margine_x = GAME_DESIGN_WIDTH/2 - ((41+2)*6)/2;
        btnArr = [6,7,8,9,"" ,"memo"];//,"undo"];
        for(var i = 0 ; i < btnArr.length; i++) {
            var btn = new ButtonControl(btnArr[i]);
            btn.setAnchorPoint(0,0);
            btn.x = margine_x + (btn.width+2)*i;
            btn.y = 53;
            this.addChild(btn);    
        }
    },
    
    isCheckActiveBlock:function() {
        
        for(var i = 0 ; i < this.blockArr.length; i++) {
            for(var j = 0 ; j < this.blockArr[i].length ;j++){
                var obj = this.blockArr[i][j];
                
                if(obj.active == true) {    
                    
                    obj.removeActiveBlock();
                }
            }
        }
    },
    
    onCheckGameEnd:function(){
        // test
        if(this.test == true) {
            this.gameWin();
            return;
        }
        
        
        // check blockArr not null 
        for(var i = 0 ; i < this.blockArr.length; i++) {
            for(var j = 0; j < this.blockArr.length; j++) {
                var number = this.blockArr[i][j].number;
                if(number == ""  || number == 0) {
                    return;
                }
            }
        }
        
        console.log("check wind")
        var w_flag = true;
        var checkFlag = new Array();
        var w_objArr = new Array();
        var fail_objArr = new Array();
        var numx = 0;
        var endArr = [1,2,3,4,5,6,7,8,9];
        
        var rowx_fail_arr = new Array();
        var colx_fail_arr = new Array();
        var tbx_fail_arr = new Array();
        
        for(var i = 0 ; i < this.blockArr.length; i++) {
            rowx_fail_arr.push(new Array()); 
            for(var j = 0; j < this.blockArr.length; j++) {
                numx = this.blockArr[i][j].number;
                
                rowx_fail_arr[i].push(this.blockArr[i][j]);
                
                checkFlag.push(numx);
                
                w_objArr.push(this.blockArr[i][j]);
                
                if(j == this.blockArr[i].length - 1) {
                    checkFlag.sort();
                    for(var k = 0; k < endArr.length; k++) {
                        if(checkFlag[k] != endArr[k]) {
                            w_flag = false;
                        }
                    }
                    checkFlag = new Array();
                    w_objArr = new Array();
                }
            }
        }
        
        
        // # for check rows
        
        checkFlag = new Array();
        w_objArr = new Array();
        for(var i = 0; i < this.blockArr.length; i++) {
            
            colx_fail_arr.push(new Array());
            
            for(var j = 0; j < this.blockArr[i].length; j++) {
                numx = this.blockArr[j][i].number;
                
                colx_fail_arr[i].push(this.blockArr[j][i]);
                
                checkFlag.push(numx);
                
                w_objArr.push(this.blockArr[j][i]);
                
                if(j == this.blockArr[i].length - 1) {
                    checkFlag.sort();
                    for(var k = 0 ; k < endArr.length; k++) {
                        if(checkFlag[k] != endArr[k]) {                            
                            w_flag = false;
                        }
                    }
                    checkFlag = new Array();
                    w_objArr = new Array();
                }
            }
        }
        // # for check colx
        
        checkFlag = new Array();
		w_objArr = new Array();
        var tbArr= [
                    [1,1] ,[1,4] ,[1,7],
                    [4,1] ,[4,4] ,[4,7],
                    [7,1] ,[7,4] ,[7,7]
                   ];
        for(var i = 0 ; i < tbArr.length; i++) {
            var px = (Math.floor((tbArr[i])[0]/3) * 3);
            var py = (Math.floor((tbArr[i])[1]/3) * 3);		
            
            
            tbx_fail_arr.push(new Array());
            
            for(var l = px; l < px+3 ;l++) {
                for(var k = py ; k < py + 3 ; k++) {
                    numx = this.blockArr[l][k].number;
                    checkFlag.push(numx);
                    
                    tbx_fail_arr[i].push(this.blockArr[l][k]);
                    
                    w_objArr.push(this.blockArr[l][k]);
                    if(checkFlag.length == endArr.length) {
                        checkFlag.sort();
                        for(var j = 0; j < endArr.length; j++) {
                            if(checkFlag[j] != endArr[j]) {
                                w_flag = false;
                            }
                        }
                    }
                    checkFlag = new Array();
                }
            }
        }
        
        // new 05/11/2016
        // check left - right
        for(var i = 0; i < rowx_fail_arr.length; i++) {
            for(var j = 0; j < rowx_fail_arr[i].length; j++) {
                
                
                if(rowx_fail_arr[i][j].LOCK == false) {
                    var numx = rowx_fail_arr[i][j].number;
                    for(var k = 0 ; k < rowx_fail_arr[i].length; k++) {
                        if(numx == rowx_fail_arr[i][k].number && j != k) {
                            fail_objArr.push(rowx_fail_arr[i][j]);
                        }
                    }
                }
            }
            // console.log("==============")
        }
        
        for(var i = 0; i < colx_fail_arr.length; i++) {
            for(var j = 0; j < colx_fail_arr[i].length; j++) {
                if(colx_fail_arr[i][j].LOCK == false) {
                    var numx = colx_fail_arr[i][j].number;
                    for(var k = 0 ; k < colx_fail_arr[i].length; k++) {
                        if(numx == colx_fail_arr[i][k].number && j != k) {
                            fail_objArr.push(colx_fail_arr[i][j]);
                        }
                    }
                }
            }
        }
        
        for(var i = 0; i < tbx_fail_arr.length; i++) {
            for(var j = 0; j < tbx_fail_arr[i].length; j++) {
                if(tbx_fail_arr[i][j].LOCK == false) {
                    var numx = tbx_fail_arr[i][j].number;
                    for(var k = 0 ; k < tbx_fail_arr[i].length; k++) {
                        if(numx == tbx_fail_arr[i][k].number && j != k) {
                            fail_objArr.push(tbx_fail_arr[i][j]);
                        }
                    }
                }
            }
            // console.log("==============")
        }
        // end
        
   
        
        
        
        if(w_flag == false) {
            
            for(i = 0; i < fail_objArr.length; i++) {
                fail_objArr[i].isFailBlock();
            }
            
            
            var btn_item = new cc.MenuItemSprite(
                new cc.Sprite(res.black_png), 
                null,
                this.game2wwnull,
                this
            );
            btn_item.setAnchorPoint(0,0);
            var btn = new cc.Menu(btn_item);
            btn.setAnchorPoint(0,0);
            btn.x = 0;
            btn.y = 0;
            this.addChild(btn);
            
            var spr = new cc.Sprite(res.warning_alert_png);
            spr.x = GAME_DESIGN_WIDTH/2;
            spr.y = GAME_DESIGN_HEIGHT/2 + 30;
            this.addChild(spr);
            
            var that = this;
            this.game_pause = true;
            var actionDone = new cc.CallFunc.create(function() {
                that.removeChild(spr);
                that.removeChild(btn);
                that.game_pause = false;
            } , this);
            
            spr.runAction(
                new cc.Sequence(
                    new cc.DelayTime(3),
                    actionDone
                )
            );
            
        }
        else {
            
            this.gameWin();
        }
    },
    
    gameWin:function() {
        var btn_item = new cc.MenuItemSprite(
            new cc.Sprite(res.black_png), 
            null,
            this.game2wwnull,
            this
        );
        btn_item.setAnchorPoint(0,0);
        var btn = new cc.Menu(btn_item);
        btn.setAnchorPoint(0,0);
        btn.x = 0;
        btn.y = 0;
        this.addChild(btn);
        
        var game_clear_spr = new cc.Sprite(res.game_clear_png);
        game_clear_spr.x = GAME_DESIGN_WIDTH/2;
        game_clear_spr.y = GAME_DESIGN_HEIGHT/2 + 35;
        this.addChild(game_clear_spr);
        var that = this;
        this.scheduleOnce(function() {
            that.removeChild(btn);
            that.removeChild(game_clear_spr);
            that.showScore();
        }, 2);
        this.unschedule(this.StartTimer);
    },
    
    showScore:function() {
        if(this.test == true) {
            this.game_time = RandomRange(60,500);
        }
        var current_time = RandomRange(60,500);//this.game_time;
        console.log(current_time);
        // === 
        var btn_item = new cc.MenuItemSprite(
            new cc.Sprite(res.black_png), 
            null,
            this.game2wwnull,
            this
        );
        btn_item.setAnchorPoint(0,0);
        var btn = new cc.Menu(btn_item);
        btn.setAnchorPoint(0,0);
        btn.x = 0;
        btn.y = 0;
        this.addChild(btn); 
        
        var bg = new cc.Sprite(res.game_result_popup_png);
        bg.x = GAME_DESIGN_WIDTH/2;
        bg.y = GAME_DESIGN_HEIGHT/2 + 40;
        this.addChild(bg);
        
        var result_title = new cc.Sprite(res.game_result_title_png);
        result_title.x = bg.width/2;
        result_title.y = bg.height - 15;
        bg.addChild(result_title);
        
        // restart
        var spr_restart = new cc.Sprite();
        spr_restart.setTextureRect(cc.rect(0, 0, 108, 44));
        spr_restart.setOpacity(0);
        var img_restart = new cc.Sprite(res.btn_restart_png);
        img_restart.setScale(0.9);
        spr_restart.addChild(img_restart);
        img_restart.x = spr_restart.width/2;
        img_restart.y = spr_restart.height/2;
    
        var btn_item = new cc.MenuItemSprite(
            spr_restart, 
            new cc.Sprite(res.btn_restart_png),
            null, 
            this.isRestartGame,
            this
        );
        var btn_restart = new cc.Menu(btn_item);
        btn_restart.x = (bg.width/2 - (btn_restart.width/3)) + 35;
        btn_restart.y = -25;
        bg.addChild(btn_restart);
        // top 
        var spr_restart = new cc.Sprite();
        spr_restart.setTextureRect(cc.rect(0, 0, 108, 44));
        spr_restart.setOpacity(0);
        var img_restart = new cc.Sprite(res.btn_title_png);
        img_restart.setScale(0.9);
        spr_restart.addChild(img_restart);
        img_restart.x = spr_restart.width/2;
        img_restart.y = spr_restart.height/2;
    
        var btn_item = new cc.MenuItemSprite(
            spr_restart, 
            new cc.Sprite(res.btn_title_png),
            null, 
            this.isGameTop,
            this
        );
        var btn_restart = new cc.Menu(btn_item);
        btn_restart.x = (bg.width/2 + (btn_restart.width/3)) - 35;
        btn_restart.y = -25;
        bg.addChild(btn_restart);
        
        var txt = new cc.Sprite(res.record_txt_png);
        txt.x = bg.width/2 - 50;
        txt.y = bg.height/2;
        bg.addChild(txt);
        
        var flag = false;
        if(current_time < BEST_RECORD[this.mode]) {
            // new best recode 
            flag = true;
            BEST_RECORD[this.mode] = current_time;
        }
        else if(BEST_RECORD[this.mode] == 0){
            // new record
            BEST_RECORD[this.mode] = current_time;
            flag = true;
        }
        
        var easy_spr_score = new ScoreSprite();
        easy_spr_score.setAnchorPoint(0,0);
        easy_spr_score.x = 200;
        easy_spr_score.y = 222;
        easy_spr_score.setTime(BEST_RECORD[0]);
        bg.addChild(easy_spr_score);
        
        var normal_spr_score = new ScoreSprite();
        normal_spr_score.setAnchorPoint(0,0);
        normal_spr_score.x = 200;
        normal_spr_score.y = 180;
        normal_spr_score.setTime(BEST_RECORD[1]);
        bg.addChild(normal_spr_score);
        
        var hard_spr_score = new ScoreSprite();
        hard_spr_score.setAnchorPoint(0,0);
        hard_spr_score.x = 200;
        hard_spr_score.y = 138;
        hard_spr_score.setTime(BEST_RECORD[2]);
        bg.addChild(hard_spr_score);
        
        var curr_socre = new ScoreSprite();
        curr_socre.setAnchorPoint(0,0);
        curr_socre.x = 200;
        curr_socre.y = 70;
        curr_socre.setTime(current_time);
        bg.addChild(curr_socre);
        
        var res_mode = res.easy_txt_png;
        if(this.mode == 1) {
            res_mode = res.normal_txt_png;
        }
        else if(this.mode == 2) {
            res_mode = res.hard_txt_png;
        }
        var spr_txt = new cc.Sprite(res_mode);
        spr_txt.setAnchorPoint(0,0);
        spr_txt.x = 90;
        spr_txt.y = 84;
        bg.addChild(spr_txt);
        
        
        if(flag == true) {
            if(this.mode == 0) {
                easy_spr_score.setAction();
            }
            else if(this.mode == 1){
                normal_spr_score.setAction();
            }
            else if(this.mode == 2) {
                hard_spr_score.setAction();
            }
        }
        else {
            curr_socre.setAction();
        }
        
        
    },
    
    isRestartGame:function(pSender) {
        var black = new cc.Color(0,0,0);
        cc.director.runScene(new cc.TransitionFade(1, new GameScene(this.mode)), black);  
    },
    
    isGamePause:function(pSender) {
        this.game_pause = true;
        var btn_item = new cc.MenuItemSprite(
            new cc.Sprite(res.black_png), 
            null,
            this.game2wwnull,
            this
        );
        btn_item.setAnchorPoint(0,0);
        var btn = new cc.Menu(btn_item);
        btn.setAnchorPoint(0,0);
        btn.x = 0;
        btn.y = 0;
        btn.setTag(this.bgTag);
        this.addChild(btn);
        
        var bg_popup = new cc.Sprite(res.bg_popup_png);
        bg_popup.x = GAME_DESIGN_WIDTH/2;
        bg_popup.y = GAME_DESIGN_HEIGHT/2 + 30;
        this.addChild(bg_popup);
        var popup_title = new cc.Sprite(res.pause_title_png);
        popup_title.x = bg_popup.width/2;
        popup_title.y = bg_popup.height - 50;
        bg_popup.addChild(popup_title);
        
        // create btn resume
        var spr_pause = new cc.Sprite();
        spr_pause.setTextureRect(cc.rect(0, 0, 215, 57));
        spr_pause.setOpacity(0);
        var img_pause = new cc.Sprite(res.game_pause_resume_png);
        img_pause.setScale(0.9);
        spr_pause.addChild(img_pause);
        img_pause.x = spr_pause.width/2;
        img_pause.y = spr_pause.height/2;
    
        var btn_item = new cc.MenuItemSprite(
            spr_pause, 
            new cc.Sprite(res.game_pause_resume_png),
            null, 
            this.isGameResume,
            this
        );
        var btn_resume = new cc.Menu(btn_item);
        btn_resume.x = bg_popup.width/2;
        btn_resume.y = bg_popup.height/2 - 24;
        bg_popup.addChild(btn_resume);
        
        // create btn top
        var spr_pause = new cc.Sprite();
        spr_pause.setTextureRect(cc.rect(0, 0, 215, 57));
        spr_pause.setOpacity(0);
        var img_pause = new cc.Sprite(res.game_pause_top_png);
        img_pause.setScale(0.9);
        spr_pause.addChild(img_pause);
        img_pause.x = spr_pause.width/2;
        img_pause.y = spr_pause.height/2;
    
        var btn_item = new cc.MenuItemSprite(
            spr_pause, 
            new cc.Sprite(res.game_pause_top_png),
            null, 
            this.isGameTop,
            this
        );
        var btn_top = new cc.Menu(btn_item);
        btn_top.x = bg_popup.width/2;
        btn_top.y = bg_popup.height/2 - spr_pause.height - 34;
        bg_popup.addChild(btn_top);
        
        // sound eff on/off
        var spr_pause = new cc.Sprite();
        spr_pause.setTextureRect(cc.rect(0, 0, 115, 38));
        spr_pause.setOpacity(0);
        var img_pause = new cc.Sprite(res.btn_effect_on_png);
        img_pause.setScale(0.9);
        spr_pause.addChild(img_pause);
        img_pause.x = spr_pause.width/2;
        img_pause.y = spr_pause.height/2; 
        var btn_item = new cc.MenuItemSprite(
            spr_pause, 
            new cc.Sprite(res.btn_effect_on_png),
            null, 
            this.isSoundEffect,
            this
        );
        var btn_effect = new cc.Menu(btn_item);
        btn_effect.x = bg_popup.width/2;
        btn_effect.y = bg_popup.height/2 + 44;
        bg_popup.addChild(btn_effect);
        
        bg_popup.setTag(this.popupPauseTag);
        
    },
    
    isSoundEffect:function(pSender) {
        
    },
    
    isGameTop:function(pSender){
        var black = new cc.Color(0,0,0);
        cc.director.runScene(new cc.TransitionFade(1, new MainScene()), black);  
    },
    
    isGameResume:function(pSender) {
        var spr = this.getChildByTag(this.popupPauseTag);
        this.removeChild(spr);
        var bg = this.getChildByTag(this.bgTag);
        this.removeChild(bg);
        this.game_pause = false;
    },
    
    undoNumber:function() {
        
        if(this.ucount >= this.undoArr.length) {
            this.ucount = (this.undoArr.length - 1);
        }
        
        
        if(this.ucount - 1 >= 0) {
            
            this.flagTurn = true;
            this.ucount--;
            var obj = new Array();
            obj = this.undoArr[this.ucount];
            
            if(obj == null) return;
            
            for(var i = 0 ; i < this.blockArr.length; i++) {
                for(var j = 0 ; j < this.blockArr[i].length; j++) {
                    var block_obj = this.blockArr[i][j];
                    var number = obj[i][j];
                    if(block_obj.LOCK == false) {
                        
						block_obj.setNumber(number);
                    }

                }
            }
        }
    },
    
    addNumberUndo:function() {
        var objArr = new Array();
        var them = new Array();
        
        var cnt = 0;
        var len = this.undoArr.length;
        if(this.flagTurn == true) {
            if(this.ucount == 0) {
					this.undoArr.splice(1,this.undoArr.length);
				}
				else if(this.ucount < len) {
					this.undoArr.splice(this.ucount+1 , this.undoArr.length);
				}
				else if(this.ucount == len) {
				
				}
				this.flagTurn = false;
        }
        
        for(var i = 0 ; i < this.blockArr.length; i++) {
            objArr.push(new Array());
            for(var j = 0; j < this.blockArr[i].length; j++) {
                objArr[i].push(this.blockArr[i][j].number);
            }
        }
         
         if(this.ustart == false) {
             this.undoArr.push(objArr);
             this.ustart = true;
         }
         else {
             this.undoArr.push(objArr);
         }
        this.ucount = this.undoArr.length;
    },
    
    removeBlockFail:function() {
        for(var i = 0; i < this.blockArr.length; i++) {
            for(var j = 0; j < this.blockArr[i].length; j++) {
                if(this.blockArr[i][j].LOCK == false && this.blockArr[i][j].fail == true) {
                    this.blockArr[i][j].removeFailBloxk();
                }
            }
        }
    },
    
    isGanarateRandom:function(arr) {
        var new_arr = arr;
        var len = new_arr.length;
        
        if(this.mode == 0) {
            var cal_len = Math.floor(len*0.05);
            while(cal_len > 0) {
                var rx = RandomRange(0,len);
                if(new_arr[rx] != 0) {
                    new_arr[rx] = 0;
                    cal_len+=-1;
                }
            }
        }
        else if(this.mode == 1) {
            var cal_len = Math.floor(len*0.55);
            while(cal_len > 0) {
                var rx = RandomRange(0,len);
                if(new_arr[rx] != 0) {
                    new_arr[rx] = 0;
                    cal_len+=-1;
                }  
            }
        }
        else if(this.mode == 2) {
            var cal_len = Math.floor(len*0.75);
            while(cal_len > 0) {
                var rx = RandomRange(0,len);
                if(new_arr[rx] != 0) {
                    new_arr[rx] = 0;
                    cal_len+=-1;
                }  
            }
        }
        return new_arr;
    },
    
    solve:function(sudoku) {
        var saved = new Array();
        var saved_sudo = new Array();
        var i = 0;
        var next_move , what_to_try, attempt; 
        while(!this.is_solved_sudoku(sudoku)) {
            i+=1;
            next_move = this.scan_sudoku_for_unique(sudoku);
            if(next_move == false) {
                next_move = saved.pop();
                sudoku = saved_sudo.pop();
            }
            what_to_try = this.next_random(next_move);
            attempt = this.determine_random_possible_value(next_move,what_to_try);
            if(next_move[what_to_try].length > 1) {
                next_move[what_to_try] = this.remove_attempt(next_move[what_to_try],attempt);
                saved.push(next_move.slice());
                saved_sudo.push(sudoku.slice());
            }
            sudoku[what_to_try] = attempt;
        }
        return sudoku;
    },
    
    determine_random_possible_value:function(possible,cell) {
        var random_picked = Math.floor(Math.random() * possible[cell].length);
        return possible[cell][random_picked];
    },
    
    
    next_random:function(possible) {
        var mai = 9;
        var min_choices = 0;
        for (var i=0; i<=80; i++) {
            if (possible[i]!=undefined) {
                if ((possible[i].length<=mai) && (possible[i].length>0)) {
                    mai = possible[i].length;
                    min_choices = i;
                }
            }
        }
        return min_choices;
    },
    
    
    scan_sudoku_for_unique:function(sudoku) {
        var possible = new Array();
        for (var i=0; i<=80; i++) {
            if (sudoku[i] == 0) {
                possible[i] = new Array();
                possible[i] = this.determine_possible_values(i,sudoku);
                if (possible[i].length==0) {
                    return false;
                }
            }
        }
        return possible;
    },
    
    determine_possible_values:function(cell,sudoku) {
        var possible = new Array();
        for (var i=1; i<=9; i++) {
            if (this.is_possible_number(cell,i,sudoku)) {
                possible.unshift(i);
            }
        }
        return possible;
    },
    is_possible_number:function(cell,number,sudoku) {
        var row = this.return_row(cell);
        var col = this.return_col(cell);
        var block = this.return_block(cell);
        return this.is_possible_row(number,row,sudoku) && this.is_possible_col(number,col,sudoku) && this.is_possible_block(number,block,sudoku);
    },
    
    
    is_solved_sudoku:function(sudoku) {
        for (var i=0; i<=8; i++) {
            if (!this.is_correct_block(i,sudoku) || !this.is_correct_row(i,sudoku) || !this.is_correct_col(i,sudoku)) {
                return false;
            }
        }
        return true;
    },
    
    is_correct_block:function(block,sudoku) {
        var right_sequence = new Array(1,2,3,4,5,6,7,8,9);
        var block_temp= new Array();
        for (var i=0; i<=8; i++) {
            block_temp[i] = sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)];
        }
        block_temp.sort();
        return block_temp.join() == right_sequence.join();
    },
    
    is_correct_col:function(col,sudoku) {
        var right_sequence = new Array(1,2,3,4,5,6,7,8,9);
        var col_temp= new Array();
        for (var i=0; i<=8; i++) {
            col_temp[i] = sudoku[col+i*9];
        }
        col_temp.sort();
        return col_temp.join() == right_sequence.join();
    },
    
    is_correct_row:function(row,sudoku) {
        var right_sequence = new Array(1,2,3,4,5,6,7,8,9);
        var row_temp= new Array();
        for (var i=0; i<=8; i++) {
            row_temp[i] = sudoku[row*9+i];
        }
        row_temp.sort();
        return row_temp.join() == right_sequence.join();
    },
    
    
    return_row:function(cell) {
        return Math.floor(cell / 9);
    },
    
    
    return_col:function(cell) {
        return cell % 9;
    },
    
    
    return_block:function(cell) {
        return Math.floor(this.return_row(cell) / 3) * 3 + Math.floor(this.return_col(cell) / 3);
    },
    
    is_possible_row:function(number,row,sudoku) {
        var possible = true;
        for (var i=0; i<=8; i++) {
            if (sudoku[row*9+i] == number) {
                possible = false;
                break;
            }
        }
        return possible;
    },
    
     is_possible_col:function(number,col,sudoku) {
        var possible = true;
        for (var i=0; i<=8; i++) {
            if (sudoku[col+9*i] == number) {
                possible = false;
                break;
            }
        }
        return possible;
    },
    
    is_possible_block:function(number,block,sudoku) {
        var possible = true;
        for (var i=0; i<=8; i++) {
            if (sudoku[Math.floor(block/3)*27+i%3+9*Math.floor(i/3)+3*(block%3)] == number) {
                possible = false;
                break;
            }
        }
        return possible;
    },
    
    remove_attempt:function(attempt_array,number) {
        var new_array = new Array();
        for (var i=0; i<attempt_array.length; i++) {
            if (attempt_array[i] != number) {
                new_array.unshift(attempt_array[i]);
            }
        }
        return new_array;
    },
    
    
});