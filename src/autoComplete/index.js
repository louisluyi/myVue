/**
 * Created by luyi on 2016/1/2.
 */
/*var Vue = require('vue');*/
var autoComplete = require('./component/autoComplete.vue');

module.exports = new Vue({
    el:'body',
    components:{
        autoComplete:autoComplete
    }
});