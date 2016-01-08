/**
 * Created by luyi on 2016/1/8.
 */
var Vue = require('vue');
var searchAutoComplete = require('../../components/autoComplete/autoComplete.vue');

new Vue({
    el:'body',
    components:{
        searchAutoComplete:searchAutoComplete
    },
    methods:{
        inputChange:function(value, callback){
            var arr = [];
            for(var i = 0; i < 10; ++i){
                arr.push({
                    leftText:'vue-loader' + i,
                    rightText:'autocomplete' + i,
                    value:'luyi' + i
                });
            }
            if(typeof callback === "function") callback(arr, value);
        },
        hoverBtn:function(){
            this.$broadcast('show-list');
        },
        clickBtn:function(){
            //this.$broadcast('')
        }
    }
});