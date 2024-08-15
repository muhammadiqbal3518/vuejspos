<template lang="">
    <div>
        <div id="mainCanvas" style="position: fixed;"></div>
        <div class="auth-layout-wrap">
            <div class="auth-content" style="z-index: 1;">
                <div class="card o-hidden">
                    <div class="row">
                        <div class="col-md" style="border-right: 2px solid #eee;">
                            <div class="p-4">
                                <div class="auth-logo text-center mb-4">
                                </div>
                                <h1 class="mb-3 text-18 text-center">e-Cafe</h1>
                                <small class="text-danger my-2 text-center" v-if="wPassword != ''">{{ wPassword }}</small>
                                <form @submit.prevent>
                                    <div class="form-group">
                                        <label for="email">Email <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                            </div>
                                            <input type="email" :class="mailMsg != '' ? 'form-control is-invalid' : 'form-control'" :placeholder="mailMsg != '' ?'Email Field is Required' : 'email@email.com'" v-model="email" id="email" @change="hideEmailError($event)">
                                        </div>
                                        <small class="text-danger" v-if="mailMsg != ''">
                                            {{ mailMsg }}
                                        </small>
                                    </div>
                                    <div class="form-group">
                                        <label for="showpass">Password <span class="text-danger">*</span>
                                        </label>
                                        <div class="input-group">
                                            <div class="input-group-prepend">
                                            </div>
                                            <input type="password" :class="passMsg != '' ? 'form-control is-invalid' : 'form-control'" :placeholder="passMsg != '' ? 'Password Field is Required' : 'Your Password'" v-model="password" @change="hidePassError($event)" id="showpass">
                                            <div class="input-group-append">
                                                <button type="button" class="input-group-text" @click="myFunction()">
                                                    <span id="VisiOn" class="material-symbols-outlined">
                                                        visibility
                                                    </span>
                                                    <span id="VisiOff" class="material-symbols-outlined"
                                                        style="display: none;">
                                                        visibility_off
                                                    </span>
                                                </button>
                                            </div>
                                        </div>
                                        <small class="text-danger" v-if="passMsg != ''">
                                            {{ passMsg }}
                                        </small>
                                    </div>
                                    <div class="form-group">
                                    </div>
                                    <hr>
                                    <button @click="login()" type="submit" id="button1"
                                        class="btn btn-rounded btn-primary btn-block mt-2":disabled="Process">
                                        {{ Process ? 'Logging in, Please Wait...' : 'Log In' }}
                                    </button>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
import axios from 'axios'
import router from '@/router'
import Swal from 'sweetalert2'
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            email: "",
            userName: "",
            userID: "",
            password: "",
            Process: false,
            mailMsg: '',
            passMsg: '',
            wPassword: ''
        }
    },
    methods: {
        login() {
            this.Process = true
            this.mailMsg = '';
            this.passMsg = '';
            this.wPassword = '';
            axios.post('https://sub.mykavling.store/api/auth/login', {
                email: this.email,
                password: this.password
            })
            .then(function (response) {
                const expirationDays = 7;
                Cookies.set('id', response.data.data.id, { expires: expirationDays });
                Cookies.set('name', response.data.data.name, { expires: expirationDays });
                Cookies.set('role_id', response.data.data.role_id, { expires: expirationDays });
                Cookies.set('image', response.data.data.image, { expires: expirationDays });
                Cookies.set('token', response.data.data.token, { expires: expirationDays });
                router.push({ name: 'home' })
                Swal.fire({
                    title: 'Success',
                    text: 'Successfully Authorized',
                    icon: 'success',
                    showConfirmButton: false,
                    timer: 1500
                })
            })
            .catch((error) => {
                if (error.response && error.response.status === 401) {
                    this.wPassword = 'The provided credentials are incorrect.';
                } else if (error.response.status === 422 && this.email == '') {
                    this.mailMsg = 'Masukkan Email';
                } else if (error.response.status === 422 && this.password == '') {
                    this.passMsg = 'Masukkan Password';
                }
            })
            .finally(() => this.Process = false)
        },
        myFunction() {
            var x = document.getElementById("showpass");
            var visiOn = document.getElementById("VisiOn");
            var visiOff = document.getElementById("VisiOff");
            if (x.type === "password") {
                x.type = "text";
                visiOn.style.display = "none";
                visiOff.style.display = "block";
            } else {
                x.type = "password";
                visiOn.style.display = "block";
                visiOff.style.display = "none";
            }
        }
    },
    mounted() {
        document.title = "Login";
        this.userID = Cookies.get('id')
        if(this.userID){
        router.push({ name: 'home' })
        }
    },
    hideEmailError(e){
        this.mailMsg = ''
    },
    hidePassError(e){
        this.passMsg = ''
    }
}
</script>
<style lang="">
    
</style>