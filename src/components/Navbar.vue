<template lang="">
    <div>
        <nav class="navbar navbar-expand-lg" style="background-color: #e3f2fd;" data-bs-theme="light">
            <div class="container-fluid">
                <RouterLink class="navbar-brand" to="/profile">
                    <img :src="url + image" alt="Logo" class="d-inline-block align-text-top" style="width:35px;height:35px;border-radius:50%;">
                    {{ name }}
                </RouterLink>
                <button class="navbar-toggler" type="button" @click="addShowClass()">
                    <span class="material-symbols-outlined">
                        menu
                    </span>
                </button>
                <div :class="{'navbar-collapse collapse': true, show: isShow}" id="addShowClass">
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                        <!-- manager -->
                        <li v-if="role == 4" class="nav-item">
                            <RouterLink :class="$route.name == 'home' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/">Home</RouterLink>
                        </li>
                        <li v-if="role == 4" class="nav-item">
                            <RouterLink :class="$route.name == 'product' ? 'nav-link text-primary' : 'nav-link'" to="/product">Product</RouterLink>
                        </li>
                        <li v-if="role == 4" class="nav-item dropdown">
                            <a
                                :class="$route.name == 'order' || $route.name == 'orderlist' || $route.name == 'orderReport' ? 'btn btn-outline-primary dropdown-toggle' : 'btn btn-default dropdown-toggle'"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                            >
                                Order Menu
                            </a>
                            
                            <transition name="drop" appear>
                                <ul class="dropdown-menu">
                                    <li>
                                        <RouterLink :class="$route.name == 'order' ? 'dropdown-item active' : 'dropdown-item'" to="/order">Order</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink :class="$route.name == 'orderlist' ? 'dropdown-item active' : 'dropdown-item'" to="/order-list">Order List</RouterLink>
                                    </li>
                                    <li>
                                        <RouterLink :class="$route.name == 'orderReport' ? 'dropdown-item active' : 'dropdown-item'" to="/order-report">Order Report</RouterLink>
                                    </li>
                                </ul>
                            </transition>
                        </li>
                        <li v-if="role == 4" class="nav-item">
                            <RouterLink :class="$route.name == 'user' ? 'nav-link text-primary' : 'nav-link'" to="/user">User</RouterLink>
                        </li>
                        <!-- waiters -->
                        <!-- Access : profile, home, order, orderlist -->
                        <li v-if="role == 1" class="nav-item">
                            <RouterLink :class="$route.name == 'home' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/">Home</RouterLink>
                        </li>
                        <li v-if="role == 1" class="nav-item">
                            <RouterLink :class="$route.name == 'order' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/order">Order</RouterLink>
                        </li>
                        <li v-if="role == 1" class="nav-item">
                            <RouterLink :class="$route.name == 'orderlist' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/order-list">Order List</RouterLink>
                        </li>
                        <li v-if="role == 2 || role == 3" class="nav-item">
                            <RouterLink :class="$route.name == 'home' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/">Home</RouterLink>
                        </li>
                        <li v-if="role == 2 || role == 3" class="nav-item">
                            <RouterLink :class="$route.name == 'orderlist' ? 'nav-link text-primary' : 'nav-link'" aria-current="page" to="/order-list">Order List</RouterLink>
                        </li>
                    </ul>
                    <div class="d-flex">
                        <a class="text-primary mx-3" @click="toggleFullScreen()" style="cursor:pointer;">
                            <span class="material-symbols-outlined">
                                fullscreen
                            </span>
                        </a>
                        <a class="text-primary mx-3" @click="logout()" style="cursor:pointer;">
                            <span class="material-symbols-outlined">
                                logout
                            </span>
                        </a>
                    </div>
                </div>
            </div>
        </nav>
    </div>
</template>
<script>
import router from '@/router'
import axios from 'axios'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
export default {
    props: ['name', 'role', 'image'],
    data() {
        return {
            isShow: false,
            url: 'https://sub.mykavling.store/public/public/users/',
            isDropdownOpen: false,
        };
    },
    methods: {
        addShowClass() {
            this.isShow = !this.isShow;
        },
        logout() {
            $('#sidebarModal').modal('hide');
            Swal.fire({
                title: 'Apakah Anda yakin?',
                text: 'Anda akan keluar dari akun.',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Logout!'
            }).then((result) => {
                if (result.isConfirmed) {
                    // Jika pengguna mengklik "Ya", lanjutkan proses logout
                    axios.get('https://sub.mykavling.store/api/auth/logout', {
                        headers: {
                            "Authorization" : `Bearer ${Cookies.get('token')}`
                        }
                    })
                    .then(function (response) {
                        Swal.fire({
                            icon: "success",
                            title: "Goodbye",
                            title: "Berhasil Logout",
                            showConfirmButton: false,
                            timer: 1500
                        });
                        Cookies.remove('name')
                        Cookies.remove('role_id')
                        Cookies.remove('image')
                        Cookies.remove('id')
                        Cookies.remove('token')
                        router.push({ name: 'login' })
                    })
                    .catch(function (error) {
                        if(error.response.status == 401){
                            Cookies.remove('name')
                            Cookies.remove('role_id')
                            Cookies.remove('token')
                            Cookies.remove('image')
                            Cookies.remove('id')
                            router.push({ name: 'login' })
                        }
                    })
                } else if(result.dismiss){
                    Swal.fire({
                    title: "Cancelled",
                    text: "You're Still Authorized Dude!!!",
                    icon: "info",
                    showConfirmButton: false,
                    timer: 1500
                    });
                }
            })
        },
        toggleFullScreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen();
        } else {
            if (document.exitFullscreen) {
            document.exitFullscreen();
            }
        }
        },
    }
}
</script>
<style>
    .drop-enter-from, .drop-leave-to {
        opacity: 0;
        transform: scale(0.4px), translateY(-20px);
    }
    .drop-enter-to, .drop-leave-from {
        opacity: 1;
        transform: scale(1px), translateY(1);
    }
    .drop-enter-active, .drop-leave-active {
        transition: all 0.4s ease-out;
    }
</style>