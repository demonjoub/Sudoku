var ButtonControl = cc.Sprite.extend({
    type:0,
    number:0,
    
    ctor:function(type) {
        this._super();  
        this.setTextureRect(cc.rect(0,0,41,44));
        this.opacity = 0;
        if(type >= 1 && type <= 9) {
            this.type = "res/btn_game/b" + type + ".png";
        }
        else {
             this.type = "res/btn_game/" + type + ".png";
        }
        this.number = type;
    },
    onEnter:function() {
        this._super();
        if(this.number == "") {
            return;
        }
        var spr0 = new cc.Sprite();
        spr0.setTextureRect(cc.rect(0, 0, 41, 44));
        spr0.opacity = 0;
        var img = new cc.Sprite(this.type);
        img.setScale(0.9);
        img.x = spr0.width/2;
        img.y = spr0.height/2;
        spr0.addChild(img);
        var item = new cc.MenuItemSprite(
            spr0, 
            new cc.Sprite(this.type),
            this.isSelectNumber,
            this
        );
        
        
        var btn = new cc.Menu(item);
        btn.x = this.width/2;
        btn.y = this.height/2;
        this.addChild(btn);
    },
    isSelectNumber:function(pSender) {
        var game = this.parent;
        if(game.game_pause == true) {
            return;
        }
        var flag = false;
        var blockArr = game.blockArr;
        var memo_flag = game.memo_flag;
        
        if(this.number == "memo") {
            var spr0 = new cc.Sprite();
            spr0.setTextureRect(cc.rect(0, 0, 41, 44));
            spr0.opacity = 0;
            var img = new cc.Sprite(this.type);
            img.setScale(0.9);
            img.x = spr0.width/2;
            img.y = spr0.height/2;
            spr0.addChild(img);
            var item = new cc.MenuItemSprite(
                spr0, 
                new cc.Sprite(this.type),
                this.isSelectNumber,
                this
            );
            
            
            if(memo_flag == false) {
                var img_new = new cc.Sprite(res.memo2_png);
                img.texture = img_new.texture;
            }
            game.memo_flag = !game.memo_flag;
            
            var menu = pSender.parent;
            menu.removeChild(pSender);
            menu.addChild(item);
            
            return;
        }
        else if(this.number == "del") { 
            
            
            for(var i = 0; i < blockArr.length; i++) {
                for(var j = 0; j < blockArr[i].length; j++) {
                    if(blockArr[i][j].active == true) {
                        obj = blockArr[i][j];
                        obj.setNumber(0);            
                        break;
                    }
                }
            }
            
            if(obj != null) {
                obj.checkNullBlock();
            }
            game.addNumberUndo();
            return;
        }
        else if(this.number == "undo") {
            game.removeBlockFail();
            game.undoNumber();
            return;
        }
        else {
            if(memo_flag == true) {
                // add memo 
                for(var i = 0; i < blockArr.length; i++) {
                    for(var j = 0; j < blockArr[i].length; j++) {
                        if(blockArr[i][j].active == true) {
                            obj = blockArr[i][j];
                            obj.setNumberMemo(this.number);
                            
                        }
                    }
                }
                if(obj != null) {
                    obj.checkNullBlock();
                }
                return;
            }
            else {
                game.removeBlockFail();
                // add number
                for(var i = 0; i < blockArr.length; i++) {
                    for(var j = 0; j < blockArr[i].length; j++) {
                        if(blockArr[i][j].active == true) {
                            obj = blockArr[i][j];
                            obj.setNumber(this.number);            
                            break;
                        }
                    }
                }
                game.addNumberUndo();
            }
        }
        
        if(obj != null) {
            obj.checkNullBlock();
        }
        game.isCheckActiveBlock();
        game.onCheckGameEnd();
    }
});
















