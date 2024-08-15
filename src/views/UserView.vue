<template lang="">
    <div>
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <button type="button" class="btn btn-success" @click="modalCreate()">
                                Create User
                            </button>
                        </div>
                        <div class="card-body" style="overflow-y: auto; max-height: 550px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable">
                                    <thead>
                                        <tr>
                                            <th class="text-left">#</th>
                                            <th class="text-left">Image</th>
                                            <th class="text-left">Name</th>
                                            <th class="text-left">Email</th>
                                            <th class="text-left">Role</th>
                                            <th class="text-left">Action</th>
                                        </tr>
                                    </thead>
                                    <transition-group tag="tbody" appear
                                        @before-enter="beforeEnter"
                                        @enter="enter"
                                        @before-leave="beforeLeave"
                                        @leave="leave"
                                        @move="move"
                                    >
                                        <tr v-for="(user, index) in data" :key="user.id" :data-index="index">
                                            <td class="text-left">{{ data.indexOf(user) + 1 }}</td>
                                            <td class="text-left">
                                                <img v-if="user.image"height="35px"width="35px":src="url + user.image"class="img" style="border-radius:50%;" />
                                                <img v-else height="35px"width="35px"src="@/assets/image/default_image-1024.webp"class="img"style="border-radius:50%;"/>
                                            </td>
                                            <td class="text-left">{{ user.name }}</td>
                                            <td class="text-left">{{ user.email }}</td>
                                            <td class="text-left">
                                                {{ user.role_id == 1 ? 'Waiters' : user.role_id == 2 ? 'Chef' : user.role_id == 3 ? 'Chasier' : user.role_id == 4 ? 'Manager' : '' }}
                                            </td>
                                            <td class="text-left">
                                                <button class="btn btn-sm btn-primary mx-1" type="button" @click="editModal(user.id)">
                                                    Edit
                                                </button>
                                                <button v-if="user.id != userID" class="btn btn-sm btn-danger mx-1" type="button" @click="hapus(user.id)">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </transition-group>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <!-- modal create user -->
        <div class="modal fade" id="modalCreateUser" tabindex="-1"aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="postNewUser()">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Create User</h5>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="Name" class="form-label">
                                            User Name
                                        </label>
                                        <input type="text" v-model="name" class="form-control" id="Name" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="Email" class="form-label">
                                            Email
                                        </label>
                                        <input type="email" v-model="email" class="form-control" id="Email" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="Password" class="form-label">
                                            Password
                                        </label>
                                        <input type="password" v-model="password" class="form-control" id="Password" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="userRole" class="form-label">
                                            Role
                                        </label>
                                        <select class="form-control" id="userRole" v-model="role">
                                            <option class="text-center" value="1">Waiters</option>
                                            <option class="text-center" value="2">Chef</option>
                                            <option class="text-center" value="3">Cashier</option>
                                            <option class="text-center" value="4">Manager</option>
                                        </select>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="image">Product Image</label>
                                        <input type="file" @change="imageChanged($event)" class="form-control"id="image"accept="image/jpeg, image/png"/>
                                        <small class="text-danger">*Accepted file only JPG and PNG</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="submit" class="btn btn-primary":disabled="processing">
                                {{ processing ? "Saving ..." : "Submit" }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- modal create user -->
        <!-- modal update user -->
        <div class="modal fade" id="modalUpdateUser" tabindex="-1"aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="updateUser(userData.id)">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title">Update User</h5>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12" v-if="processing2 == false">
                                    <div class="mb-3">
                                        <label for="userName" class="form-label">
                                            User Name
                                        </label>
                                        <input type="text" v-model="userData.name" class="form-control" id="userName" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="userEmail" class="form-label">
                                            Email
                                        </label>
                                        <input type="email" v-model="userData.email" class="form-control" id="userEmail" />
                                    </div>
                                    <div class="mb-3">
                                        <label for="userPassword" class="form-label">
                                            Password
                                        </label>
                                        <input type="password" v-model="password" class="form-control" id="userPassword" />
                                    </div>
                                    <div class="mb-3" v-if="userID != userData.id">
                                        <label class="form-label" for="img">User Image</label>
                                        <input type="file" @change="imageChanged($event)" class="form-control"id="img"accept="image/jpeg, image/png"/>
                                        <small class="text-danger">*Accepted file only JPG and PNG</small>
                                        <div class="mx-3 my-3">
                                            <p>Current Image</p>
                                            <img v-if="userData.image" height="100px" width="100px" :src="url + userData.image" class="img" />
                                            <img v-else height="100px" width="100px" src="@/assets/image/default_image-1024.webp" class="img" />
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12" v-if="processing2 == true">
                                    <div class="text-center">
                                        <div class="spinner-border text-primary" role="status">
                                            <span class="visually-hidden"></span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="submit" class="btn btn-primary":disabled="processing">
                                {{ processing ? "Saving ..." : "Submit" }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <!-- modal update user -->
    </div>
</template>
<script>
import axios from "axios";
import router from "@/router";
import Swal from "sweetalert2";
import gsap from "gsap";
import Cookies from "js-cookie";
export default {
    setup() {
        // gsap animation
        const beforeEnter = (el) => {
            el.style.opacity = 0;
            el.style.transform = 'scale(0.5)';
        }
        const enter = (el, done) => {
            gsap.to(el, {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                onComplete: done,
                delay: el.dataset.index * 0.1
            })
        }
        const beforeLeave = (el) => {
            el.style.opacity = 1;
            el.style.transform = 'scale(1)';
        }
        const leave = (el, done) => {
            gsap.to(el, {
                opacity: 0,
                scale: 0,
                duration: 0.5,
                onComplete: done,
            })
        }
        const move = (el) => {
            el.style.transition = 'all 0.4s ease'
        }
        return { beforeEnter, enter, beforeLeave, leave, move }
    },
    data() {
        return {
            roleId: '',
            data: [],
            url: "https://sub.mykavling.store/public/public/users/",
            processing: false,
            processing2: false,
            name: '',
            email: '',
            password: '',
            file: '',
            role: '',
            userID: '',
            userData: '',
            image:''
        }
    },
    mounted() {
        document.title = "Users";
        this.userID = Cookies.get("id");
        this.roleId = Cookies.get("role_id");
        if (!this.userID) {
            router.push({ name: "login" });
        }
        if (this.roleId != 4) {
            router.push({ name: "home" });
        }
        this.getUsers()
    },
    methods: {
        getUsers(){
            axios.get("https://sub.mykavling.store/api/user", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            })
            .then((response) => {
                this.data = response.data.data
            })
            .catch(function(error) {
                if (error.response.status == 401) {
                    Cookies.remove("email");
                    Cookies.remove("name");
                    Cookies.remove("role_id");
                    Cookies.remove("token");
                    Cookies.remove("image");
                    Cookies.remove("id");
                    router.push({ name: "login" });
                }
            }).finally(() => {
                // $("#loadingModal").modal("hide");
            });
        },
        modalCreate(){
            $("#modalCreateUser").modal("show");
        },
        postNewUser() {
            if(this.name == '' || this.email == '' || this.password == '' || this.role == '') {
                Swal.fire({
                title: "Validation Error",
                text: "Name, Email, Password, Role Field is Required",
                icon: "error",
                });
                return;
            }
            let formData = new FormData();
            formData.append('name', this.name);
            formData.append('email', this.email);
            formData.append('password', this.password);
            formData.append('role_id', this.role);
            formData.append("image_file", this.file);
            this.processing = true
            axios.post('https://sub.mykavling.store/api/user', formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                Swal.fire({
                    title: 'Congratulation!!!',
                    text: 'Berhasil Menambahkan User Baru',
                    icon: 'success'
                });
                this.name = ''
                this.email = ''
                this.password = ''
                this.role = ''
                this.file = ''
                this.getUsers()
                $("#modalCreateUser").modal("hide");
            })
            .catch(function (error) {
            if (error.response.status == 401) {
                Cookies.remove("email");
                Cookies.remove("name");
                Cookies.remove("role_id");
                Cookies.remove("token");
                Cookies.remove("image");
                Cookies.remove("id");
                router.push({ name: "login" });
            }
            console.log(error);
            console.log("Error While Fetching Items");
            })
            .finally(() => (this.processing = false));
        },
        hapus(id) {
            this.userID = id;
            Swal.fire({
                title: 'Danger',
                text: 'Are you sure? This Users will Delete Permanently!!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Delete It!!',
            })
            .then((result) => {
                if (result.isConfirmed) {
                    axios.delete('https://sub.mykavling.store/api/user/' + this.userID, {
                        headers: {
                            'Authorization': `Bearer ${Cookies.get('token')}`
                        }
                    })
                    .then((response) => {
                        Swal.fire({
                            icon: "info",
                            title: "Info",
                            title: "User " + response.data.data.email + " Berhasil dihapus",
                            showConfirmButton: false,
                            timer: 600
                        });
                        this.getUsers();
                    })
                    .catch(function (error) {
                        if (error.response.status == 401) {
                        Cookies.remove("email");
                        Cookies.remove("name");
                        Cookies.remove("role_id");
                        Cookies.remove("token");
                        Cookies.remove("image");
                        Cookies.remove("id");
                        router.push({ name: "login" });
                        }
                        console.log(error);
                        console.log("Error While Fetching Items");
                    })
                } else if(result.dismiss){
                    Swal.fire({
                        title: "Cancelled",
                        text: "Your Ordinary Items Are Safe!!!",
                        icon: "info",
                        showConfirmButton: false,
                        timer: 700
                    });
                }
            })
        },
        editModal(id) {
            this.userID = id;
            $('#modalUpdateUser').modal('show');
            this.processing2 = true
            axios.get('https://sub.mykavling.store/api/show/'+this.userID, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.userData = response.data.data;
                this.processing2 = false
            })
            .catch(function (error) {
                console.log(error);
            });
        },
        updateUser(id) {
            if(this.userData.name == '' || this.userData.email == '') {
                Swal.fire({
                    title: "Validation Error",
                    text: "Name & Email is Required",
                    icon: "error",
                });
                return;
            }
            let formData = new FormData();
            formData.append('name', this.userData.name);
            formData.append('email', this.userData.email);
            formData.append('password', this.password);
            formData.append("image_file", this.file);
            formData.append('_method', 'patch');
            this.processing = true;
            axios.post('https://sub.mykavling.store/api/user/'+id, formData, {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                Swal.fire({
                    title: 'Congratulation',
                    text: 'Berhasil Update User : ' + response.data.data.email,
                    icon: 'success',
                });
                this.file = ''
                this.name = ''
                this.email = ''
                this.password = ''
                this.file = ''
                this.getUsers()
                $('#modalUpdateUser').modal('hide');
            })
            .catch(function (error) {
                if (error.response.status == 401) {
                    Cookies.remove("name");
                    Cookies.remove("role_id");
                    Cookies.remove("token");
                    Cookies.remove("image");
                    Cookies.remove("id");
                    router.push({ name: "login" });
                }
                console.log(error);
                console.log("Error While Fetching Items");
            })
            .finally(() => (this.processing = false));
        },
        imageChanged(e) {
            let file = e.target.files[0];
            this.file = file;
        },
    },
}
</script>
<style>
    .table-enter-from {
        opacity:0;
        transform: scale(0.5);
    }
    .table-enter-to {
        opacity: 1;
        transform: scale(1);
    }
    .table-enter-active {
        transition: all 0.4s ease;
    }
    .table-leave-from {
        opacity: 1;
        transform: scale(1);
    }
    .table-leave-to {
        opacity:0;
        transform: scale(0.5);
    }
    .table-leave-active {
        transition: all 0.4s ease;
        position: absolute;
    }
    .table-move {
        transition: all 0.4s ease;
    }
</style>
