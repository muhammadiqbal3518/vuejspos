<script>
import { RouterView } from 'vue-router'
import Navbar from '@/components/Navbar.vue'
import Cookies from 'js-cookie';
export default {
  components: {
    Navbar
  },
  data() {
    return {
      userName: '',
      roleId: '',
      image: ''
    }
  },
  mounted() {
    this.updateUserData();
  },
  watch: {
    $route() {
      this.updateUserData();
    }
  },
  methods: {
    updateUserData() {
      this.userName = Cookies.get("name");
      this.image = Cookies.get("image");
      this.roleId = Cookies.get("role_id");
    },
  }
}
</script>

<template>
  <div style="background-color: #e3f2fd;">
    <div v-touch:swipe.left="onSwipeLeft" v-touch:swipe.right="onSwipeRight">
      <transition name="navi" mode="out-in">
        <Navbar v-if="$route.name != 'login'" :name="userName" :role="roleId" :image="image" />
      </transition>
      <router-view v-slot="{ Component, route }">
        <Transition name="route" mode="out-in">
          <component :is="Component" :key="route.fullPath"></component>
        </Transition>
      </router-view>
    </div>
  </div>
</template>

<style scoped>
.route-enter-from {
  /* transform: translateX(120px); */
  opacity: 0;
}
.route-enter-active {
  transition: all 0.4s ease-out;
}
.route-leave-to {
  /* transform: translateX(-120px); */
  opacity: 0;
}
.route-leave-active {
  transition: all 0.4s ease-in;
}
.navi-enter-from {
  transform: translateY(-100);
  opacity: 0;
}
.navi-enter-active {
  transition: all 0.4s ease-out;
}
.navi-leave-to {
  transform: translateY(-100);
  opacity: 0;
}
.navi-leave-active {
  transition: all 0.4s ease-in;
}

</style>
