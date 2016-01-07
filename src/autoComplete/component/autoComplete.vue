<template>
	<div class="auto-complete-container">
		<input type="text" class="input" /><slot name="button"></slot>
		<ul class="auto-complete-list">
			<li v-for="item in dataList" class="valid-item" v-on="click:chooseThisItem($index)">
				<span v-if="item.leftText" class="left-text">{{item.leftText}}</span>
				<span v-if="item.rightText" class="right-text">{{item.rightText}}</span>
				<span v-if="item.history">{{item.history}}</span>
				<span v-if="item.history" class="operation">
					<em>历史记录</em><a href="javascript:void(0);" v-on="click:deleteHistory($index)">删除</a>
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
	require('./autoComplete.css');
	module.exports={
		data:function(){
			return{
				dataList:[],
				defaultText:''
			}
		},
		methods:{
			chooseThisItem:function(){

			},
			deleteHistory:function(){

			},
			changeList:function(){

			}
		}
	}
</script>