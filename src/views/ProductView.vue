<template lang="">
    <div>
        <div class="container-fluid">
            <div class="row mb-2">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header">
                            <div class="d-flex justify-content-between align-items-center card-padding pb-0">
                                <button type="button" class="btn btn-success form-control" @click="showModal()"style="max-width: 200px;">
                                    Create
                                </button>
                                <input type="text" v-model="keyword" :onchange="searchItem()"placeholder="Search..."class="form-control"style="max-width: 200px;"/>
                            </div>
                        </div>
                        <div class="card-body pb-5" style="overflow-y: auto; max-height: 750px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable">
                                    <thead>
                                        <tr>
                                            <td class="text-left">Image</td>
                                            <td class="text-left">Name</td>
                                            <td class="text-left">Price</td>
                                            <td class="text-right">Action</td>
                                        </tr>
                                    </thead>
                                    <!-- gsap transition group -->
                                    <transition-group tag="tbody" appear
                                        @before-enter="beforeEnter"
                                        @enter="enter"
                                        @before-leave="beforeLeave"
                                        @leave="leave"
                                        @move="move"
                                    >
                                        <tr v-for="(item, index) in limitedItems" :key="item.id" :data-index="index">
                                            <td class="text-left">
                                                <img v-if="item.image"height="25px"width="25px":src="url+item.image"class="img"/>
                                                <img v-else height="25px"width="25px"src="@/assets/image/default_image-1024.webp"class="img"/>
                                            </td>
                                            <td class="text-left">{{ item.name }}</td>
                                            <td class="text-left">Rp {{ item.price }}</td>
                                            <td class="text-right">
                                                <button class="btn btn-sm btn-primary mx-1"type="button"@click="editModal(item.id)">
                                                    Edit
                                                </button>
                                                <button class="btn btn-sm btn-danger mx-1"type="button"@click="hapus(item.id)">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    </transition-group>
                                    <!-- gsap transition group -->
                                    <tbody>
                                        <tr>
                                            <td class="text-center" colspan="5">
                                                <button @click="loadMore()" v-if="limit < items.length" class="btn btn-primary">Load More</button>
                                            </td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade"id="exampleModal"tabindex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog">
                <form @submit.prevent="createProduct()">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Create Product</h5>
                            <button
                            type="button"
                            class="close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="productName" class="form-label">
                                            Product name
                                        </label>
                                        <input type="text"v-model="name"class="form-control"id="productName"/>
                                    </div>
                                    <div class="mb-3">
                                        <label for="productPrice" class="form-label">
                                            Product Price
                                        </label>
                                        <input type="number"v-model="price"class="form-control"id="productPrice"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="image">Product Image</label>
                                        <input type="file"@change="imageChanged($event)"class="form-control"id="image"accept="image/jpeg, image/png"/>
                                        <small class="text-danger">*Accepted file only JPG and PNG
                                        </small>
                                    </div>
                                    <canvas ref="canvas" style="display:none;"></canvas>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button
                            type="button"
                            class="btn btn-secondary"
                            data-bs-dismiss="modal"
                            >
                            Close
                            </button>
                            <button
                            type="submit"
                            class="btn btn-primary"
                            :disabled="processing"
                            >
                            {{ processing ? "Saving ..." : "Submit" }}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
        <div class="modal fade"id="updateModal"tabindex="-1"aria-labelledby="exampleModalLabel"aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <form @submit.prevent="updateProduct(itemData.id)">
                        <div class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel">Update Product</h5>
                            <button
                            type="button"
                            class="close"
                            data-bs-dismiss="modal"
                            aria-label="Close"
                            >
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                        <div class="modal-body">
                            <div class="row">
                                <div class="col-12">
                                    <div class="mb-3">
                                        <label for="productName" class="form-label">Product name</label>
                                        <input type="text"v-model="itemData.name"class="form-control"id="productName"/>
                                    </div>
                                    <div class="mb-3">
                                        <label for="productPrice" class="form-label">Product Price</label>
                                        <input type="number"v-model="itemData.price"class="form-control"id="productPrice"/>
                                    </div>
                                    <div class="mb-3">
                                        <label class="form-label" for="image">Product Image</label>
                                        <input type="file"@change="imageChanged($event)"class="form-control"id="image"accept="image/jpeg, image/png"/>
                                        <small class="text-danger">
                                            *Accepted file only JPG and PNG
                                        </small>
                                        <div class="mx-3 my-3">
                                            <p>Current Image</p>
                                            <img v-if="itemData.image"height="100px"width="100px"
                                            :src="url + itemData.image"class="img"/>
                                            <img v-else height="100px"width="100px"src="@/assets/image/default_image-1024.webp"class="form-control"/>
                                        </div>
                                        <canvas ref="canvas" style="display:none;"></canvas>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="modal-footer">
                            <button type="button"class="btn btn-secondary"data-bs-dismiss="modal">
                                Close
                            </button>
                            <button type="submit"class="btn btn-primary":disabled="processing">
                                {{ processing ? "Saving ..." : "Submit" }}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
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
                delay: el.dataset.index * 0.05
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
        userID: "",
        roleId: "",
        items: [],
        filteredItems: [],
        url: "https://sub.mykavling.store/public/public/items/",
        keyword: "",
        name: "",
        price: "",
        file: "",
        processing: false,
        productId: "",
        itemData: "",
        image: '',
        limit: 5,
        };
    },
    computed: {
        limitedItems() {
        return this.filteredItems.slice(0, this.limit);
        }
    },
    mounted() {
        document.title = "Product";
        this.userID = Cookies.get('id');
        this.roleId = Cookies.get('role_id');
        if (!this.userID) {
        router.push({ name: "login" });
        }
        if (this.roleId != 4) {
        router.push({ name: "home" });
        }
        this.getItems();
    },
    methods: {
        getItems() {
            axios.get("https://sub.mykavling.store/api/item", {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            })
            .then((response) => {
                this.items = response.data.data;
                this.filteredItems = this.items
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
                console.log("Error Fetch Items");
            })
        },
        loadMore() {
            this.limit += 5;
        },
        searchItem() {
            this.filteredItems = this.items.filter((item) =>
                item.name.toLowerCase().includes(this.keyword.toLowerCase())
            );
        },
        hapus(id){
            this.productId = id;
            Swal.fire({
                title: 'Danger',
                text: 'Are you sure? This Item will Delete Permanently!!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Delete It!!',
            })
            .then((result) => {
                if (result.isConfirmed){
                    this.items = this.items.filter(item => item.id !== id);
                    axios.delete('https://sub.mykavling.store/api/item/' + this.productId, {
                    headers: {
                        Authorization: `Bearer ${Cookies.get("token")}`
                    }
                })
                .then((response) => {
                    Swal.fire({
                        icon: "info",
                        title: "Info",
                        title: "Item berhasil dihapus",
                        showConfirmButton: false,
                        timer: 600
                    });
                    // this.getItems();
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
        this.productId = id;
        $("#updateModal").modal("show");
        axios
            .get("https://sub.mykavling.store/api/item/" + this.productId, {
            headers: {
                Authorization: `Bearer ${Cookies.get("token")}`,
            },
            })
            .then((response) => {
            this.itemData = response.data.data;
            })
            .catch(function (error) {
            console.log(error);
            });
        },
        updateProduct(id) {
            if (this.itemData.name == "" || this.itemData.price == "") {
                Swal.fire({
                title: "Validation Error",
                text: "Name & Price is Required",
                icon: "error",
                });
                return;
            }
            let formData = new FormData();
            formData.append("name", this.itemData.name);
            formData.append("price", this.itemData.price);
            formData.append("image_file", this.file);
            formData.append("_method", "patch");
            this.processing = true;
            axios
                .post("https://sub.mykavling.store/api/item/" + id, formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
                })
                .then((response) => {
                    // Perbarui data item di front-end
                    let updatedItem = response.data.data; // Asumsikan respons berisi data yang diperbarui
                    let index = this.items.findIndex(item => item.id === id);
                    if (index !== -1) {
                        this.items[index] = updatedItem;
                    }
                    router.push({ name: "product" });
                    Swal.fire({
                        title: "Process Success",
                        text: "Berhasil Update Data Product",
                        icon: "success",
                    });
                    this.file = "";
                    this.name = "";
                    this.price = "";
                    // this.getItems();
                    $("#updateModal").modal("hide");
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
        showModal() {
            $("#exampleModal").modal("show");
        },
        createProduct() {
            if (this.name == "" || this.price == "") {
                Swal.fire({
                title: "Validation Error",
                text: "Name & Price is Required",
                icon: "error",
            });
            return;
            }

            let formData = new FormData();
            formData.append("name", this.name);
            formData.append("price", this.price);
            formData.append("image_file", this.file);
            this.processing = true;

            axios.post("https://sub.mykavling.store/api/item", formData, {
                headers: {
                    Authorization: `Bearer ${Cookies.get("token")}`,
                },
            })
            .then((response) => {
                Swal.fire({
                    title: "Process Success",
                    text: "Berhasil Menambahkan Data Product",
                    icon: "success",
                });
                this.file = "";
                this.name = "";
                this.price = "";
                this.getItems();
                $("#exampleModal").modal("hide");
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
};
</script>
<style>
</style>