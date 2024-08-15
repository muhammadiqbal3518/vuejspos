<template lang="">
    <div>
        <div class="container-fluid" style="overflow-y: auto; max-height: 590px;">
            <div class="row">
                <div class="col-12 col-md-5 col-lg-4">
                    <div class="card">
                        <img v-if="data.image" :src="url + data.image" class="card-img-top" :alt="data.name" lazy>
                        <img v-else src="@/assets/image/default_image-1024.webp" class="card-img-top" alt="...">
                        <div class="card-body">
                            <div class="text-left">
                                <h5 class="title">Name : {{ data.name }}</h5>
                                <h5 class="title">Email : {{ data.email }}</h5>
                                <h5 class="title">Role : {{ data.role_id == 1 ? 'Waiters' : data.role_id == 2 ? 'Chef' : data.role_id == 3 ? 'Chasier' : data.role_id == 4 ? 'Manager' : '' }}</h5>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-md-7 col-lg-8">
                    <form @submit.prevent="updateProfile(userID)">
                        <div class="card">
                            <div class="card-header">
                                <h3 class="text-center">Update Profile</h3>
                            </div>
                            <div class="card-body">
                                <div class="mb-2">
                                    <label class="form-label" for="name">Name</label>
                                    <input type="text" class="form-control" v-model="name" id="name">
                                </div>
                                <div class="mb-2">
                                    <label class="form-label" for="email">Email</label>
                                    <input type="email" class="form-control" v-model="email" id="email">
                                </div>
                                <div class="mb-2">
                                    <label class="form-label" for="password">Password</label>
                                    <input type="password" class="form-control" v-model="password" id="password">
                                </div>
                                <div class="mb-2">
                                    <label class="form-label" for="img">User Image</label>
                                    <input type="file" class="form-control" id="img" @change="imageChanged($event)" accept="image/jpeg,image/png">
                                    <small class="text-danger">*Accepted file only JPG and PNG</small>
                                    <canvas ref="canvas" style="display:none;"></canvas>
                                </div>
                            </div>
                            <div class="card-footer">
                                <button type="submit" class="btn btn-primary" :disabled="!isFormChanged || processing">
                                    {{ processing == true ? "Saving ..." : "Submit" }}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import router from '@/router'
import Swal from "sweetalert2";
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            userID: '',
            roleId: '',
            role: [
                { value: 1, roles: 'Waiter' },
                { value: 2, roles: 'Chef' },
                { value: 3, roles: 'Cashier' },
                { value: 4, roles: 'Manager' },
            ],
            data: '',
            name: '',
            email: '',
            password: '',
            file: '',
            msgName: '',
            msgEmail: '',
            processing: false,
            url: 'https://sub.mykavling.store/public/public/users/',
            image: '',
            originalData: {}, // Tambahkan properti untuk menyimpan data asli
        }
    },
    mounted() {
        document.title = "Profile";
        this.userID = Cookies.get('id')
        if(!this.userID){
            router.push({ name: 'login' })
        }
        this.profile()
    },
    methods: {
        profile() {
            axios.get('https://sub.mykavling.store/api/profile', {
                headers: {
                    'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.userID = response.data.data.id
                this.data = response.data.data
                this.name = response.data.data.name
                this.email = response.data.data.email

                // Simpan data asli untuk perbandingan
                this.originalData = {
                    name: response.data.data.name,
                    email: response.data.data.email,
                    image: response.data.data.image,
                };
            })
        },
        updateProfile(id) {
            if (this.name == "") {
                this.msgName = 'Name Field is Required'
            }
            if (this.email == "") {
                this.msgEmail = 'Email Field is Required'
            }
            let formData = new FormData();
            formData.append('name', this.name);
            formData.append('email', this.email);
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
                this.image = response.data.data.image
                this.profile()
                Cookies.set('image', response.data.data.image)
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
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;
                img.onload = () => {
                    this.resizeImage(img);
                };
                };
                reader.readAsDataURL(file);
            }
        },
        resizeImage(img) {
            const canvas = this.$refs.canvas;
            const ctx = canvas.getContext('2d');

            const MAX_WIDTH = 600;
            const MAX_HEIGHT = 800;
            let width = img.width;
            let height = img.height;

            // Hitung rasio untuk mengubah ukuran
            if (width > height) {
                if (width > MAX_WIDTH) {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
                }
            } else {
                if (height > MAX_HEIGHT) {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
                }
            }

            // Set ukuran canvas dan gambar
            canvas.width = width;
            canvas.height = height;
            ctx.drawImage(img, 0, 0, width, height);

            // Dapatkan data URL dari canvas
            canvas.toBlob((blob) => {
                this.file = new File([blob], 'resized-image.jpg', { type: 'image/jpeg' }); // Simpan hasil resized ke this.file
            }, 'image/jpeg', 0.9); // Kualitas 90%
        },
    },
    computed: {
        isFormChanged() {
            return this.name !== this.originalData.name ||
                   this.email !== this.originalData.email ||
                   this.file !== '' ||
                   this.password !== '';
        }
    }
}
</script>

<style lang="">
    
</style>
