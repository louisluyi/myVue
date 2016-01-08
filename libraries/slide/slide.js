/**
 * Created by luyi on 2015/12/8.
 * 图片轮播，带有按钮
 */
define(function(require, exports, module){
    require('./slide.css');
    /**
     * @param option
     * {
     *   container:轮播图片的父元素
     *   selector:轮播图片的选择器，默认为'img',
     *   interval:默认为2000ms，即2秒
     * }
     * @constructor
     */
    var Slide = function(option){
        if(!option || !option.container || option.container.nodeType !== 1) throw "必要参数缺失";
        this.$container = $(option.container).addClass('slide-container');
        this.$imgArray = $(option.container).find(option.selector || 'img').addClass('slide-item');
        this.interval = parseInt(option.interval) || 2000;
        this.breakIndex = 0;//轮播被打断时自动加1
        this.preventChange = false;//是否禁止打断轮播
        if(this.$imgArray.length <= 1) return;
        this.init();
    }
    Slide.prototype.init = function(){
        var self = this;
        var $slideList = self.$slideList = $('<div class="slide-list"></div>'),
            $btnList = self.$btnList = $('<p class="slide-btn-list"></p>');
        var $slideBtn;
        self.$imgArray.each(function(i, e){
            $slideBtn = $('<a href="javascript:void(0);" class="slide-btn"></a>').appendTo($btnList);
            if(i === 0){
                $slideBtn.addClass('current-btn');
            }
            $slideList.append(e);
        });
        $slideList.appendTo(self.$container);
        $btnList.css('marginLeft', -(self.$imgArray.length * 20 - 10) / 2 + 'px').appendTo(self.$container);//计算居中

        self.eventHandler();
        window.setTimeout(function(){
            self.changeToNextImg(1, self.breakIndex, true);
        }, self.interval);
    }
    Slide.prototype.eventHandler = function(){
        var self = this;
        self.$imgArray.on('mouseenter', function(){
            hoverImg(self);
        }).on('mouseleave', function(){
            leaveImg(self, this)
        });
        self.$btnList.find('.slide-btn').on('mouseup', function(){
            clickBtn(self, this);
        });
    }
    /**
     * 切换到下一张图片
     * @param img_index 要切换到的图片的下标
     * @param breakIndex 用于指示当前轮播是否已经被打断
     * @param showNext 是否要继续展示下一张图片
     */
    Slide.prototype.changeToNextImg = function(img_index, breakIndex, showNext){
        var self = this;
        var width = 0;
        if(breakIndex < self.breakIndex) return; //说明这次轮播已经被打断了
        if(img_index >= self.$imgArray.length){
            img_index = 0;
        }
        //计算偏移宽度
        self.$imgArray.each(function(i, e){
            if(i >= img_index){
                return false;
            }
            width += $(e).outerWidth();
        });
        self.preventChange = true;//动画过程中禁止打断
        self.$slideList.animate({
            'left' : 0 - width
        }, 300, function(){
            //动画结束
            self.preventChange = false;
            self.$btnList.find('.current-btn').removeClass('current-btn');
            self.$btnList.find('.slide-btn').eq(img_index).addClass('current-btn');
            if(showNext === true){
                //是否要继续显示下一张
                img_index ++;
                if(img_index >= self.$imgArray.length){
                    img_index = 0;
                }
                window.setTimeout(function(){
                    self.changeToNextImg(img_index, breakIndex, true)
                }, self.interval);
            }
        });
    }
    //以下是各个事件绑定的方法
    function hoverImg(slide){
        if(slide.preventChange === true) return;//动画中禁止切换
        slide.breakIndex ++;//增加下标打断之前轮播
    }
    function leaveImg(slide, img){
        if(slide.preventChange === true) return;
        var index = -1, tempIndex;
        slide.$imgArray.each(function(i, e){
            if(e === img){
                index = i;
                return false;
            }
        });
        if(index < 0) return;
        tempIndex = ++slide.breakIndex; //增加下标打断之前轮播
        window.setTimeout(function(){
            slide.changeToNextImg(index + 1, tempIndex, true);
        }, slide.interval);
    }
    function clickBtn(slide, btn){
        if(slide.preventChange === true) return;
        var index = -1, tempIndex;
        if($(btn).hasClass('current-btn')) return;
        slide.$btnList.find('.slide-btn').each(function(i, e){
            if(e === btn){
                index = i;
                return false;
            }
        });
        if(index < 0) return;
        tempIndex = ++slide.breakIndex; //增加下标打断之前轮播
        slide.changeToNextImg(index, tempIndex, true);//显示对应的图片，无需延后
    }

    module.exports = Slide;
});