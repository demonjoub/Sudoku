var ScoreSprite = cc.Sprite.extend({
    mm:null,
    mm1:null,
    xx:null,
    ss:null,
    ss1:null,
    
    ctor:function(type) {
        this._super();    
        
        this.mm = new cc.Sprite(res.socre_txt_png,cc.rect(0,0,(182/10),24));
        this.mm1 = new cc.Sprite(res.socre_txt_png,cc.rect(0,0,(182/10),24));
        this.ss = new cc.Sprite(res.socre_txt_png,cc.rect(0,0,(182/10),24));
        this.ss1 = new cc.Sprite(res.socre_txt_png,cc.rect(0,0,(182/10),24));
        
        this.xx = new cc.Sprite(res.t_space_png);
        
        this.mm.x = 0;
        this.mm1.x = 16;
        this.xx.x = this.mm1.x + 14; 
        this.ss.x = this.xx.x + 12;
        this.ss1.x = this.ss.x + 16;
        this.addChild(this.mm);
        this.addChild(this.mm1);
        this.addChild(this.xx);
        this.addChild(this.ss);
        this.addChild(this.ss1);
        
        this.setScale(0.9);
            
    },
    
    setAction:function() {
        this.mm.runAction(
            new cc.Sequence(
                // 1
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 2
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 3
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 4
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 5
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 6
                new cc.DelayTime(1),
                new cc.FadeIn(0)
                
                
            )   
        );
        this.mm1.runAction(
            new cc.Sequence(
                // 1
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 2
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 3
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 4
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 5
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 6
                new cc.DelayTime(1),
                new cc.FadeIn(0)
                
                
            )   
        );
        this.xx.runAction(
            new cc.Sequence(
                // 1
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 2
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 3
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 4
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 5
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 6
                new cc.DelayTime(1),
                new cc.FadeIn(0)
                
                
            )   
        );
        
        this.ss1.runAction(
            new cc.Sequence(
                // 1
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 2
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 3
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 4
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 5
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 6
                new cc.DelayTime(1),
                new cc.FadeIn(0)
                
                
            )   
        );
        this.ss.runAction(
            new cc.Sequence(
                // 1
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 2
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 3
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 4
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 5
                new cc.DelayTime(1),
                new cc.FadeOut(0),
                new cc.DelayTime(0.5),
                new cc.FadeIn(0),
                // 6
                new cc.DelayTime(1),
                new cc.FadeIn(0)
                
                
            )   
        );
    },
    
    setTime:function(sec_time) {
        var minutes = (Math.floor(sec_time/60));
        
        var sec = (sec_time%60);
        
        if(minutes > 99) {
            minutes = 99;
            sec = 99;
        }
        
        if(minutes < 10) {
            minutes = "0"  + minutes;
        }
        minutes += "";
        if(sec < 10) {
            sec = "0" + sec;
        }
        sec += "";
        
        
        var _mm = parseInt(minutes.substring(0,1)) * (182/10);
        var _mm1 = parseInt(minutes.substring(1,2)) * (182/10);
        var _ss = parseInt(sec.substring(0,1)) * (182/10);
        var _ss1 = parseInt(sec.substring(1,2)) * (182/10);
        
        this.mm.setTextureRect(cc.rect(_mm,0,(182/10),24));
        this.mm1.setTextureRect(cc.rect(_mm1,0,(182/10),24));
        this.ss.setTextureRect(cc.rect(_ss,0,(182/10),24));
        this.ss1.setTextureRect(cc.rect(_ss1,0,(182/10),24));
    }
    
});