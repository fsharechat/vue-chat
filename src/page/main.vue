<template>
  <div id="app" :class="{fullscreen: changeFullScreenMode}" ref="appRef">
    <div class="sidebar">
      <mycard></mycard>
    </div>
    <div class="main">
      <router-view></router-view>
    </div>
    <groupVideoCall></groupVideoCall>
  </div>
</template>

<script>
import mycard from '../components/mycard/mycard'
import { mapActions, mapState } from 'vuex'
import VueWebSocket from '../websocket';
import {WS_PROTOCOL,WS_IP,WS_PORT,HEART_BEAT_INTERVAL,RECONNECT_INTERVAL,BINTRAY_TYPE} from '../constant/index'
import groupVideoCall from './group/groupVideoCall'
import LocalStore  from '../websocket/store/localstore'
export default {
   components: {
     mycard,
     groupVideoCall
   },
   created () {
     //获取传递过来的参数
    let uid = this.$route.query.uid
    let target = this.$route.query.target
    let token  = this.$route.query.token
    let cid = this.$route.query.cid;
    console.log("query uid "+uid +" token "+token +" cid "+cid+" target "+target)
    if(target){
       LocalStore.setSelectTarget(target)
    }
    if(cid){
       LocalStore.setDeviceId(cid)
    }
    if(uid){
       LocalStore.setUserId(uid);
    }
    if(token){
      LocalStore.setToken(token);
    }
    if(LocalStore.isLogin()){
      this.$store.dispatch("initData");
    }
       //this.$store.dispatch('initData');
   },
   computed: {
       ...mapState([
            'changeFullScreenMode'
        ])
   },
   mounted (){
      window.onresize = () => {
        var appHeight = this.$refs.appRef.offsetHeight;
        this.$store.state.appHeight = appHeight;
      }
      //初始化时获取appHeight
      this.$store.state.appHeight = this.$refs.appRef.offsetHeight;
      document.addEventListener('visibilitychange', this.handleVisiable);
	 },
	 destroyed () {
      window.onresize = null;
      document.removeEventListener('visibilitychange', this.handleVisiable)
   },

   methods: {
    handleVisiable(e) {
        this.$store.dispatch('visibilityChange',e.target.visibilityState);
      }  
   }
   
   
}
</script>

<style lang="stylus" scoped>

#app
  &.fullscreen
    width: 100%
    height: 100%
  display: flex
  border-radius 50px
  width: 75%
  height: 80%
  background-color: #fff
  .sidebar
    width: 60px
    height: 100%
    background: #2b2c2f
  .main
    flex: 1
    height: 100%
    background: #ffffff
</style>
