var SudokuBlock = cc.Sprite.extend({
   
    memo:[],
    number:0,
    
    numberTag:11,
    activeTag:12,
    failTag:13,
    
    LOCK:false, 
    memoArr:null,
    active :false,
    fail:false,
    
    
    ctor:function() {
        this._super(res.block1_png);   
        
        var number_spr = new cc.Sprite(res.bm_num2_png, cc.rect(0,0,(152/10),22));
        number_spr.x = this.width/2;
        number_spr.y = this.height/2;
        number_spr.setTag(this.numberTag);
        this.addChild(number_spr);
        number_spr.zIndex = 9;
    },
    
    onEnter:function() {
        this.fail = false;
        this._super();
    },
    
    
    SetEnabledButton:function(flag) {
        for(var i = 0; i < 9 ;i++) {
            this.memo.push(false);
        }
        
        this.LOCK = flag;
        if(flag == false) {
            // unlock btn click
            // add memo 
            var cnt = 0; 
            this.memoArr = new Array();
            for(var i = 0 ; i < 3 ; i++) {
                for(var j = 0 ; j < 3 ; j++) {
                    cnt++;
                    var memo_num = new cc.Sprite(res.bm_num2_png,cc.rect(0,0,(152/10),22));
                    var _nn = (cnt)*memo_num.width;
                    memo_num.setTextureRect(cc.rect(_nn,0,152/10,22));
                    memo_num.setScale(0.4);
                    memo_num.x = ((this.width/2) - (memo_num.width*0.4)-2) + (((memo_num.width*0.4)+2) * j);
                    memo_num.y = ((this.height/2) + (memo_num.height*0.4)+2) - (((memo_num.height*0.4)+2)*i);
                    if(this.memo[cnt-1] == false) {
                        memo_num.visible = false;
                    }
                    this.addChild(memo_num);
                    memo_num.zIndex = 8;
                    this.memoArr.push(memo_num);
                    
                }
            }
            // add btn 
            var btn_spr = new cc.Sprite();
            btn_spr.setTextureRect(cc.rect(0,0 ,this.width , this.height));
            btn_spr.setColor(new cc.Color(255,0,0));
            btn_spr.opacity = 0;
            btn_spr.setAnchorPoint(0,0);
            var btn_item = new cc.MenuItemSprite(
                btn_spr,
                null,
                this.isActiveBlock,
                this
            );
            btn_item.setAnchorPoint(0,0);
            btn_item.setTag(1);
            var btn = new cc.Menu(btn_item);
            btn.setAnchorPoint(0,0);
            btn.x = 0 ;
            btn.y = 0;
            btn.setTag(this.btnTag);
            this.addChild(btn);
            
            var number_spr = this.getChildByTag(this.numberTag);
            var spr_new = new cc.Sprite(res.bm_num1_png);
            number_spr.texture = spr_new.texture;
        }
    },
    
    removeActiveBlock:function(){
        var spr = this.getChildByTag(this.activeTag);
        this.removeChild(spr);
        this.active = false;
    },
    
    isActiveBlock:function(pSender) {
    
        var game = this.parent;
        if(game.game_pause == true) {
            return;
        }
        game.removeBlockFail();
        game.isCheckActiveBlock();
        
        if(this.active == false) {
            this.active = true;
            var btn_spr = new cc.Sprite();
            btn_spr.setTextureRect(cc.rect(0,0 ,this.width , this.height));
            btn_spr.setColor(new cc.Color(255,255,0));
            btn_spr.setTag(this.activeTag);
            this.addChild(btn_spr);
            btn_spr.x = this.width/2;
            btn_spr.y = this.height/2;
        }
    },
    
    setBlock:function(k) {
        
        if( k % 2 == 0) {
            var spr = new cc.Sprite(res.block0_png);
            this.texture = spr.texture;
        }
        else {
            var spr = new cc.Sprite(res.block1_png);
            this.texture = spr.texture;
        }
    },
    
    setNumber:function(nn) {
        var number_spr = this.getChildByTag(this.numberTag);
        var _x = (nn) * (152/10);
        number_spr.setTextureRect(cc.rect(_x, 0, (152/10), 22));
        this.number = nn;
    },
    
    getNumber:function() {
        return this.number;   
    },
    
    setNumberMemo:function(nn) {
        // #05/10/2016
        this.memo[nn-1] = !this.memo[nn-1];
        for(var i = 0; i < this.memoArr.length; i++) {
            if(this.memo[i] == true) {
                this.memoArr[i].visible = true;
            }
            else {
                this.memoArr[i].visible = false;
            }
        }
    },
    
    removeFailBloxk:function() {
        
        this.fail = false;
        var spr = this.getChildByTag(this.failTag);
        if(spr != null) {
            console.log("remove");
            this.removeChild(spr);
        }
    },
    
    checkNullBlock:function() {
        var memoArr = this.memoArr;
        
        if(this.number != 0 || this.number != "") {
            for(var i = 0 ; i < memoArr.length; i++) {
                this.memoArr[i].visible = false;
            }
        }
        else {
            for(var i = 0 ; i < memoArr.length; i++) { 
                if(this.memo[i] != 0) {
                    this.memoArr[i].visible = true;
                }
            }
        }
    },
    
    isFailBlock:function() {
        if(this.fail == true) {
            return;
        }
        
        var _width = this.width;
        var _height = this.height;
        
        this.fail = true;
        
        
        var spr = new cc.Sprite();
        spr.setTextureRect(cc.rect(0,0 ,this.width , this.height));
        spr.setColor(new cc.Color(0,144,155));
        spr.setTag(this.failTag);
        spr.zIndex = 1;
        this.addChild(spr);
        spr.x = this.width/2;
        spr.y = this.height/2;

        
    }
});





