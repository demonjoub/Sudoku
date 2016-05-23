var TimeSprite = cc.Sprite.extend({
    
    mm:null,
    mm1:null,
    xx:null,
    ss:null,
    ss1:null,
    
    ctor:function(type) {
        this._super();    
        
        this.mm = new cc.Sprite(res.bm_time_png,cc.rect(0,0,(160/10),20));
        this.mm1 = new cc.Sprite(res.bm_time_png,cc.rect(0,0,(160/10),20));
        this.ss = new cc.Sprite(res.bm_time_png,cc.rect(0,0,(160/10),20));
        this.ss1 = new cc.Sprite(res.bm_time_png,cc.rect(0,0,(160/10),20));
        
        this.xx = new cc.Sprite(res.t_space_png);
        
        this.mm.x = 0;
        this.mm1.x = 16;
        this.xx.x = this.mm1.x + 12; 
        this.ss.x = this.xx.x + 12;
        this.ss1.x = this.ss.x + 16;
        this.addChild(this.mm);
        this.addChild(this.mm1);
        this.addChild(this.xx);
        this.addChild(this.ss);
        this.addChild(this.ss1);
        
        this.setScale(0.9);
            
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
        
        
        var _mm = parseInt(minutes.substring(0,1)) * 16;
        var _mm1 = parseInt(minutes.substring(1,2)) * 16;
        var _ss = parseInt(sec.substring(0,1)) * 16;
        var _ss1 = parseInt(sec.substring(1,2)) * 16;
        
        this.mm.setTextureRect(cc.rect(_mm,0,16,20));
        this.mm1.setTextureRect(cc.rect(_mm1,0,16,20));
        this.ss.setTextureRect(cc.rect(_ss,0,16,20));
        this.ss1.setTextureRect(cc.rect(_ss1,0,16,20));
    }
    
});