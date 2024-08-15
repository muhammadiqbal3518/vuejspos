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
    onSwipeLeft() {
      // Handle swipe left
      if (this.roleId == 4){
        if (this.$route.name === 'profile') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'product' });
        } else if (this.$route.name === 'product') {
          this.$router.push({ name: 'order' });
        } else if (this.$route.name === 'order') {
          this.$router.push({ name: 'orderlist' });
        } else if (this.$route.name === 'orderlist') {
          this.$router.push({ name: 'orderReport' });
        } else if (this.$route.name === 'orderReport') {
          this.$router.push({ name: 'user' });
        }
      } else if (this.roleId == 1) {
        // jika role waiters hak akses profile, home, order, order list, order detail
        if (this.$route.name === 'profile') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'order' });
        } else if (this.$route.name === 'order') {
          this.$router.push({ name: 'orderlist' });
        }
      } else if (this.roleId == 2 || this.roleId == 3) {
        // jika role waiters hak akses profile, home, order, order list, order detail
        if (this.$route.name === 'profile') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'orderlist' });
        }
      }
    },
    onSwipeRight() {
      // Handle swipe right
      if (this.roleId == 4){
        if (this.$route.name === 'user') {
          this.$router.push({ name: 'orderReport' });
        } else if (this.$route.name === 'orderReport') {
          this.$router.push({ name: 'orderlist' });
        } else if (this.$route.name === 'orderlist') {
          this.$router.push({ name: 'order' });
        } else if (this.$route.name === 'order') {
          this.$router.push({ name: 'product' });
        } else if (this.$route.name === 'product') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'profile' });
        }
      } else if (this.roleId == 1) {
        // waiters
        if (this.$route.name === 'orderlist') {
          this.$router.push({ name: 'order' });
        } else if (this.$route.name === 'order') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'profile' });
        }
      } else if (this.roleId == 2 || this.roleId == 3) {
        // chef dan cashier hanya profile, home, order list
        if (this.$route.name === 'orderlist') {
          this.$router.push({ name: 'home' });
        } else if (this.$route.name === 'home') {
          this.$router.push({ name: 'profile' });
        }
      }
    }
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
