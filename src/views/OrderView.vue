<template lang="">
    <div>
        <div class="container-fluid pb-5" style="overflow-y: auto; max-height: 700px;">
            <div class="row">
                <div class="col-12 col-lg-4">
                    <div class="card">
                        <div class="card-body">
                            <div class="mb-2">
                                <label class="form-label" for="customerName">Customer Name</label>
                                <input @change="hideNameError()" type="text" :class="eName ? 'form-control is-invalid' : 'form-control'" id="customerName" v-model="customerName" autocomplete="none">
                                <small class="text-danger">{{ eName }}</small>
                            </div>
                            <div class="mb-2">
                                <label class="form-label" for="tableNo">Table No.</label>
                                <input @change="hideTableError()" type="number" :class="eTable ? 'form-control is-invalid' : 'form-control'" id="tableNo" v-model="tableNo">
                                <small class="text-danger">{{ eTable }}</small>
                            </div>
                        </div>
                        <div class="card-footer">
                            <div class="mt-3">
                                <button @click="submitOrder()" :disabled=processing type="submit" class="btn btn-success form-control">
                                    <span v-if="processing == true">
                                        Sending...
                                        <lord-icon
                                            src="https://cdn.lordicon.com/odavpkmb.json"
                                            trigger="loop"
                                            style="width:25px;height:25px">
                                        </lord-icon>
                                    </span>
                                    <span v-if="processing == false">Submit</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-lg-8">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center card-padding pb-0" v-if="orders != ''">
                            <button class="btn btn-primary" @click="showProduct()" :disabled=processing>
                                Pilih Product
                            </button>
                            <p v-if="total">Grand Total : <span style="font-weight:bold;">{{'Rp' + formatCurrency(total) }}</span></p>
                        </div>
                        <div class="card-body" style="overflow-y: auto; max-height: 500px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Img</th>
                                            <th class="text-left">Name</th>
                                            <th class="text-left">Action</th>
                                            <th class="text-left">Price</th>
                                            <th class="text-left">Total</th>
                                        </tr>
                                    </thead>
                                    <transition-group tag="tbody" name="table" appear>
                                        <tr v-if="orders == ''">
                                            <td colspan="6" class="text-center">
                                                <span class="text-danger px-3">
                                                    0 Item Selected
                                                </span>
                                                <button type="button" class="btn btn-sm btn-primary" @click="showProduct()" :disabled=processing>
                                                    {{  processing ? 'Please Wait...' : 'Pilih Product' }}
                                                </button>
                                            </td>
                                        </tr>
                                        <tr v-for="(order) in orders" :key="order.id">
                                            <td class="text-left">
                                                <img width="35px" height="35px" :src="url + order.image" />
                                            </td>
                                            <td class="text-left">
                                                {{ order.name }} <span class="text-muted"> (x{{ order.qty }})</span>
                                            </td>
                                            <td class="text-left">
                                                <div class="btn-group btn-group-sm">
                                                    <button type="button" class="btn btn-outline-warning" @click="decreaseItemQty(order)">-</button>
                                                    <button type="button" class="btn btn-outline-primary" @click="increaseItemQty(order)">+</button>
                                                    <button type="button" class="btn btn-outline-danger" @click="deleteItem(order)">x</button>
                                                </div>
                                            </td>
                                            <td class="text-left">Rp {{ formatCurrency(order.eachPrice) }}</td>
                                            <td class="text-left">Rp {{ formatCurrency(order.price) }}</td>
                                        </tr>
                                    </transition-group>
                                </table>
                            </div>
                        </div>
                        <div class="card-footer mb-5"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="modal fade" id="productModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-xl modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header">
                        <input type="text" class="form-control" placeholder="Search" v-model="keyword" :onchange="searchItem()" style="max-width:350px">
                        <button type="button" class="close" data-bs-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <!-- gsap transition group -->
                            <transition-group appear
                                @before-enter="beforeEnter"
                                @enter="enter"
                                @before-leave="beforeLeave"
                                @leave="leave"
                                @move="move"
                            >
                                <div class="col-12">
                                    <div class="text-center text-danger" v-if="processing == true">Loading Data. Please Wait</div>
                                </div>
                                <div v-for="(item, index) in filteredItems" :key="item.id" class="col-12 col-sm-6 col-md-6 col-lg-3 mb-2" :data-index="index">
                                    <div class="card">
                                        <img v-if="item.image" style="max-height:200px; height:200px" :src="url+item.image" class="card-img-top object-fit-cover" alt="{{ item.image }}">
                                        <img v-else style="max-height:200px; height:200px" src="@/assets/image/default_image-1024.webp" class="card-img-top object-fit-cover" alt="{{ item.image }}">
                                        <div class="card-footer">
                                            <div class="row text-center">
                                                <div class="col-12">{{ item.name }}</div>
                                                <div class="col-12">Rp {{ formatCurrency(item.price) }}</div>
                                                <div class="col-12">
                                                    <button type="button" @click="orderItem(item.id)" class="btn btn-primary">
                                                        Order
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </transition-group>
                            <!-- gsap transition group -->
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
import gsap from "gsap";
import Cookies from 'js-cookie';
export default {
    setup() {
        // gsap animation
        const beforeEnter = (el) => {
            el.style.opacity = 0;
            el.style.transform = 'scale(0.5)';
            el.style.transform = 'translateY(100px)'
        }
        const enter = (el, done) => {
            gsap.to(el, {
                opacity: 1,
                scale: 1,
                translateY: 0,
                duration: 0.3,
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
            userID: '',
            roleId: '',
            items: [],
            filteredItems: [],
            keyword: '',
            url: 'https://sub.mykavling.store/public/public/items/',
            orders: [],
            total: 0,
            customerName: '',
            tableNo: '',
            processing: false,
            eName: '',
            eTable: '',
            eSelected: '',
            image: ''
        }
    },
    mounted() {
        document.title = "Order";
        this.userID = Cookies.get('id')
        this.roleId = Cookies.get('role_id')
        if (!this.userID) {
            router.push({ name: 'login' })
        }
        if (this.roleId != 4 && this.roleId != 1) {
            router.push({ name: 'home' })
        }
    },
    methods: {
        showProduct(){
            $('#productModal').modal('show')
            this.processing = true
            axios.get('https://sub.mykavling.store/api/item', {
                headers: {
                "Authorization" : `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.processing = false
                this.items = response.data.data
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
                console.log(error);
                console.log('Error Fetch Items')
            })
        },
        searchItem() {
            this.filteredItems = this.items.filter(item => item.name.toLowerCase().includes(this.keyword.toLowerCase()))
        },
        orderItem(id)
        {
            let item = this.filteredItems.filter(item => item.id == id)[0]
            let orderItem = Object.assign({}, item)
            orderItem.eachPrice = item.price
            let indexArrayItem = this.orders.map(e => e.id).indexOf(orderItem.id)

            if(indexArrayItem != -1)
            {
                this.orders[indexArrayItem].qty++
                this.orders[indexArrayItem].price = this.orders[indexArrayItem].eachPrice * this.orders[indexArrayItem].qty
            } else 
            {
                orderItem.qty = 1
                this.orders.push(orderItem)
            }
            let orderPrice = this.orders.map(order => order.price)
            let totalPrice = 0

            orderPrice.forEach(price => {
                totalPrice += price
            })
            this.total = totalPrice
        },
        decreaseItemQty(order){
            if(order.qty <= 1) {
                Swal.fire({
                    title: 'Warning!',
                    text: 'Qty Tidak Boleh Kurang Dari 1. Klik tombol hapus untuk membatalkan item ini',
                    icon: 'warning',
                    showConfirmButton: false,
                    timer: 600
                })
                return
            }
            let indexArrayItem = this.orders.map(e => e.id).indexOf(order.id)
            this.orders[indexArrayItem].qty--
            this.orders[indexArrayItem].price = this.orders[indexArrayItem].eachPrice * this.orders[indexArrayItem].qty
            let orderPrice = this.orders.map(order => order.price)
            let totalPrice = 0

            orderPrice.forEach(price => {
                totalPrice += price
            })
            this.total = totalPrice
        },
        increaseItemQty(order){
            let indexArrayItem = this.orders.map(e => e.id).indexOf(order.id)
            this.orders[indexArrayItem].qty++
            this.orders[indexArrayItem].price = this.orders[indexArrayItem].eachPrice * this.orders[indexArrayItem].qty
            let orderPrice = this.orders.map(order => order.price)
            let totalPrice = 0

            orderPrice.forEach(price => {
                totalPrice += price
            })
            this.total = totalPrice
        },
        deleteItem(order){
            Swal.fire({
                title: 'Warning',
                text: 'Apakah anda yakin ingin menghapus item ini dari order?',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Ya, Hapus!!',
            })
            .then((result) => {
                if (result.isConfirmed){
                    let indexArrayItem = this.orders.map(e => e.id).indexOf(order.id)
                    this.orders.splice(indexArrayItem, 1)

                    let orderPrice = this.orders.map(order => order.price)
                    let totalPrice = 0

                    orderPrice.forEach(price => {
                        totalPrice += price
                    })
                    this.total = totalPrice
                    Swal.fire({
                        icon: "info",
                        title: "Info",
                        title: "Item berhasil dihapus",
                        showConfirmButton: false,
                        timer: 600
                    });
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
        submitOrder(orders){
            if(this.customerName == ''){
                this.eName = 'Customer Name is Required'
            }
            if(this.tableNo == ''){
                this.eTable = 'Table is Required'
            }
            if(this.orders == ''){
                Swal.fire({
                    title: "Info",
                    text: "Belum ada item yang dipilih. Apakah anda ingin memilih item?",
                    icon: "info",
                    showCancelButton: true,
                    confirmButtonColor: '#3085d6',
                    cancelButtonColor: '#d33',
                    confirmButtonText: 'Yaa!!!',
                    cancelButtonText: 'Tidak',
                })
                .then((result) => {
                    if(result.isConfirmed) {
                        this.showProduct()
                    }
                })
                return
            }
            let item = this.orders.map(item => {
                return {
                    'id': item.id,
                    'qty': item.qty
                }
            })
            // Ubah status proses menjadi true. maka tombol submit akan disabled
            this.processing = true
            // lalu jalankan api axios untuk penyimpanan data
            axios.post('https://sub.mykavling.store/api/order', {
                'customer_name': this.customerName,
                'table_no': this.tableNo,
                'items': item
            }, {
                // panggil headers authorize untuk mengenali token user
                headers: {
                "Authorization" : `Bearer ${Cookies.get('token')}`
                }
            })
            // then jika proses selesai
            .then((response) => {
                // reset item orders
                this.orders = []
                this.customerName = ''
                this.tableNo = ''
                this.total = 0
                this.eName = ''
                this.eTable = ''
                this.eSelected = ''
                // berikan alert
                Swal.fire({
                    title: "Success",
                    text: "Your Order Successfully Sended",
                    icon: "success",
                    showConfirmButton: false,
                    timer: 1200
                });
            })
            // jika gagal berikan response error dan tampilkan di console
            .catch(function (error) {
                // jika status error sama dengan 401 / token Auth tidak dikenali
                if(error.response.status == 401){
                // maka hapus data name, role_id, dan token dari localstorage 
                Cookies.remove('name')
                Cookies.remove('role_id')
                Cookies.remove('token')
                Cookies.remove('image')
                Cookies.remove('id')
                // lalu paksa untuk pindah ke route login
                router.push({ name: 'login' })
                }
                console.log(error);
                console.log('Error Fetch Items')
            })
            .finally(() => this.processing = false);
        },
        formatCurrency(value) {
            if (!value) return '';
            value = value.toString();
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        hideNameError(e) {
            console.log(e)
            this.eName = ''
            if(this.customerName == ''){
                this.eName = 'Customer Name is Required'
            }
        },
        hideTableError(e) {
            console.log(e)
            this.eTable = ''
            if(this.tableNo == ''){
                this.eTable = 'Table is Required'
            }
        }
    }
}
</script>
<style>
    @media (max-width: 576px) {
        .sticky-small {
            position: sticky;
            top: 0;
        }
    }
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