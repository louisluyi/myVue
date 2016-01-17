<template>
	<div class="auto-complete-container" @mouseout="mouseoutContainer" @mouseover="mouseoverContainer">
		<input type="text" class="input" v-model="input" @keyup="keyupInput" @click="clickInput"/>
		<slot name="button"></slot>
		<ul class="auto-complete-list" v-show="show && dataList.length > 0 || defaultText">
			<li v-for="item in dataList" class="valid-item" :class="{'selected':$index == index}"
				@click="clickItem" @mouseover="hoverItem($index, $event)">
				<span v-if="item.leftText" class="left-text">{{item.leftText}}</span>
				<span v-if="item.rightText" class="right-text">{{item.rightText}}</span>
				<span v-if="item.history">{{item.history}}</span>
					<span v-if="item.history" class="operation">
						<em class="tip">历史记录</em><a href="javascript:void(0);" class="delete-this" @click.stop="clickDelete($index)">删除</a>
					</span>
				<input type="hidden" class="value" v-model="item.value" />
			</li>
			<li v-if="dataList.length === 0 && defaultText">
				<span class="default-text">{{defaultText}}</span>
			</li>
		</ul>
	</div>
</template>
<script>
	require('./autoComplete.styl');
	var lastValue = '',
		timer;
	module.exports = {
		data:function(){
			return {
				input:'',
				show:true,
				index:-1,
				dataList:[],
				defaultText:''
			};
		},
		computed:{
			/*input:{
				set:function(value){
					return value.trim();
				}
			}*/
		},
		methods:{
			mouseoutContainer:function(e){
				var element = e.getTarget(),
					re = e.getRelatedTarget();
				if(DOM.contains(element, re)) return;
				this.createTimer();
			},
			mouseoverContainer:function(){
				this.removeTimer();
			},
			keyupInput:function(e){
				var keyCode = e.keyCode || e.which,
					self = this;
				switch (keyCode){
					case 38:
						//up
						self.index--;
						self.selectedThisItem();
						self.chooseThisItem();
						break;
					case 40:
						//down
						self.index++;
						self.selectedThisItem();
						self.chooseThisItem();
						break;
					case 13:
						//enter
						self.chooseThisItem();
						self.show = false;
						self.$dispatch('output-value', self.input);
						break;
					default:
						self.input = self.input.trim();
						if(lastValue !== self.input){
							lastValue = self.input;
							self.$dispatch('input-change', lastValue, self.changeList);
						}
						break;
				}
			},
			clickInput:function(){
				if(!this.show) this.show = true;
			},
			clickItem:function(){
				this.chooseThisItem();
				this.show = false;
			},
			hoverItem:function(i, event){
				var target = event.currentTarget;
				if(target.tagName.toLowerCase() !== 'li') return;
				this.selectedThisItem(i);
			},
			clickDelete:function(i){
				var self = this;
				var obj = self.dataList[i];
				self.dataList.splice(i, 1);
				self.$dispatch('delete-history', obj);
			},
			createTimer:function(){
				var self = this;
				timer = setTimeout(function(){
					self.show = false;
				}, 400);
			},
			removeTimer:function(){
				timer && clearTimeout(timer);
			},
			selectedThisItem:function(index){
				if(this.dataList.length <= 0) return;
				if(index >= 0) this.index = parseInt(index);
				if(this.index >= this.dataList.length) this.index = 0;
				else if(this.index < 0) this.index = this.dataList.length - 1;
			},
			chooseThisItem:function(){
				if(this.dataList.length <= 0) return;
				if(this.index < 0 || this.index >= this.dataList.length) return;
				this.input = this.dataList[this.index].value;
			},
			changeList:function(arr, value){
				if(value !== this.input) return;
				this.dataList = arr;
			}
		}
	}
</script>