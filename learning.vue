<!--用于记录学习Vue中遇到的问题，难点-->
绑定：v-bind:something可以缩写为:something，v-on:something可以缩写为@something，例如
<component :msg="" @show=""></component>
<!-- 默认为单向绑定 -->
<child :msg="parentMsg"></child>

<!-- 双向绑定 -->
<child :msg.sync="parentMsg"></child>

<!-- 单次绑定 -->
<child :msg.once="parentMsg"></child>