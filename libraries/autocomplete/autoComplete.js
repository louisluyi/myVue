/**
 * Created by luyi on 2015/12/26.
 * 自动完成下拉列表
 */

define(function(require, exports, module){
    "use strict";

    require('./autoComplete.css');
    /**
     * 基本原型
     * @param option
     * {
     *  container:包含下拉列表的元素
     *  input:输入框元素
     *  className:自定义className,
     *  clickCallback:点击下拉选项执行的函数，形式function(index, text){传入下标，文本}
     *  deleteCallback:点击删除历史记录执行的函数，形式function(index, text){传入下标，文本}
     * }
     * @constructor
     */
    var AutoComplete = function(option){
        if(!option) return;
        this.$container = $(option.container);
        if(!this.$container || this.$container.length <= 0) throw "container参数缺失";
        this.$input = $(option.input);
        if(!this.$input || this.$input.length <= 0) throw "input参数缺失";
        var sample = addSample(this);
        if(sample !== false) return sample;//已经存在实例
        this.$list = this.$container.find('.auto-complete-list').length > 0 ?
            this.$container.find('.auto-complete-list') : $('<ul class="auto-complete-list"></ul>').appendTo(this.$container);
        if(option.className){
            this.$list.addClass(option.className);
        }
        this.setClickCallback(option.clickCallback);
        this.setDeleteCallback(option.deleteCallback);
        eventHandler(this);
    }
    AutoComplete.prototype.constructor = AutoComplete;
    AutoComplete.prototype.setClickCallback = function(callback){
        if(typeof callback === 'function'){
            this.clickCallback = callback;
        }
    }
    AutoComplete.prototype.setDeleteCallback = function(callback){
        if(typeof callback === 'function'){
            this.deleteCallback = callback;
        }
    }
    AutoComplete.prototype.createList = function(dataList){
        var self = this,
            html = '<li class="valid-item"><span class="value">#text</span></li>',
            i;
        self.$list.empty();
        for(i = 0; i < dataList.length; ++i){
            self.$list.append(html.replace('#text', dataList[i] + ''));
        }
        self.selectedIndex = -1;
    }
    AutoComplete.prototype.createDoubleList = function(dataList){
        var self = this,
            html = '<li class="valid-item"><span class="left-text">#text1</span>' +
                '<span class="right-text">#text2</span><span class="value disnone">#data</span></li>',
            i;
        self.$list.empty();
        for(i = 0; i < dataList.length; ++i){
            self.$list.append(html.replace('#text1', dataList[i].leftText + '')
                .replace('#text2', dataList[i].rightText + '')
                .replace('#data', dataList[i].data + ''));
        }
        self.selectedIndex = -1;
    }
    AutoComplete.prototype.createHistoryList = function(dataList){
        var self = this,
            html = '<li class="valid-item"><span class="value history-value">#text</span>' +
                '<span class="operation"><i class="tip">搜索历史</i><i class="delete-this">删除</i></span></li>',
            i;
        self.$list.empty();
        for(i = 0; i < dataList.length; ++i){
            self.$list.append(html.replace('#text', dataList[i] + ''));
        }
        self.selectedIndex = -1;
    }
    AutoComplete.prototype.show = function(){
        var self = this;
        if(self.$list.find('li').length > 0){
            self.$container.show();
        }
    }
    AutoComplete.prototype.close = function(){
        this.$container.hide();
    }
    AutoComplete.prototype.selectLastItem = function(){
        //选择上一个
        var self = this;
        var $items = self.$list.find('.valid-item');
        if($items.length === 0) return;
        if(self.selectedIndex >= 0) $items.eq(self.selectedIndex).removeClass('selected');
        self.selectedIndex --;
        self.selectedIndex = self.selectedIndex < 0 ? $items.length - 1 : self.selectedIndex;
        self.selectThisItem();
    }
    AutoComplete.prototype.selectNextItem = function(){
        //选择下一个
        var self = this,
            $items = self.$list.find('.valid-item');
        if($items.length === 0) return;
        if(self.selectedIndex >= 0) $items.eq(self.selectedIndex).removeClass('selected');
        self.selectedIndex ++;
        self.selectedIndex = self.selectedIndex >= $items.length ? 0 : self.selectedIndex;
        self.selectThisItem();
    }
    AutoComplete.prototype.selectThisItem = function(){
        var self = this,
            $item = self.$list.find('.valid-item').eq(self.selectedIndex).addClass('selected'),
            text;
        text = $item.find('.value').html();
        self.$input.val(text);
    }
    AutoComplete.prototype.clickThisItem = function(){
        var self = this;
        self.close();
        if(!self.clickCallback) return;
        var $items = self.$list.find('.valid-item');
        if(self.selectedIndex < 0 || self.selectedIndex >= $items.length) return;
        var text = $items.eq(self.selectedIndex).find('.value').html();
        self.clickCallback(self.selectedIndex, text);
    }
    AutoComplete.prototype.hoverItem = function(item){
        if($(item).hasClass('selected')) return;
        var self = this;
        self.$list.find('.valid-item').each(function(i, e){
            if($(e).hasClass('selected')){
                $(e).removeClass('selected');
            }
            else if(e === item){
                $(e).addClass('selected')
                self.selectedIndex = i;
            }
        });
    }
    AutoComplete.prototype.deleteItem = function(item){
        var self = this,
            text = $(item).find('.value').html();
        if(self.deleteCallback){
            self.deleteCallback(self.selectedIndex, text);
        }
        $(item).remove();
    }
    AutoComplete.prototype.isEqual = function(autoComplete){
        return this.$input[0] === autoComplete.$input[0] && this.$container[0] === autoComplete.$container[0];
    }

    var addSample = function(){
        var sampleList = [];
        return function(autoComplete){
            var i;
            for(i = 0; i < sampleList.length; ++i){
                if(autoComplete.isEqual(sampleList[i])){
                    //返回已经创建的实例
                    return sampleList[i];
                }
            }
            sampleList.push(autoComplete);
            return false;
        }
    }();
    function eventHandler(autoComplete){
        autoComplete.$input.on('keyup', function(e){
            switch (e.which){
                case 38:
                    //up
                    autoComplete.selectLastItem();
                    break;
                case 40:
                    //down
                    autoComplete.selectNextItem();
                    break;
                case 13:
                    //enter
                    autoComplete.clickThisItem();
                    break;
                case 9:
                    //tab
                    autoComplete.close();
            }
        }).on('click', function(){
            autoComplete.show();
        }).on('mouseout', function(){
            autoComplete.timer = window.setTimeout(function(){
                autoComplete.close();
            }, 500);
        }).on('mouseover', function(){
            autoComplete.timer && window.clearTimeout(autoComplete.timer);
        });

        autoComplete.$list.on('mouseenter', '.valid-item', function(){
            autoComplete.hoverItem(this);
        }).on('click', '.valid-item', function(){
            autoComplete.selectThisItem();
            autoComplete.clickThisItem();
        }).on('click', '.delete-this', function(e){
            e.stopPropagation();
            autoComplete.deleteItem($(this).parent().parent());
        });

        autoComplete.$container.on('mouseleave', function(){
            autoComplete.timer = window.setTimeout(function(){
                autoComplete.close();
            }, 500);
        }).on('mouseenter', function(){
            autoComplete.timer && window.clearTimeout(autoComplete.timer);
        });
    }

    module.exports = AutoComplete;
});
