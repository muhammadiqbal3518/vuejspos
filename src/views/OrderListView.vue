<template lang="">
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-header d-flex justify-content-between align-items-center card-padding pb-0">
                            <h3>
                                Order List
                            </h3>
                            <select class="form-control" style="max-width:200px" v-model="keyword" :onchange="searchOrder()">
                                <option class="text-center" value="ordered">Ordered</option>
                                <option class="text-center" value="done">Done</option>
                                <option class="text-center" value="paid">Paid</option>
                            </select>
                        </div>
                        <div class="card-body" style="overflow-y: auto; max-height: 650px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable">
                                    <thead>
                                        <tr>
                                            <th class="text-left">Customer Name</th>
                                            <th class="text-left">No Meja</th>
                                            <th class="text-left">Order Date</th>
                                            <th class="text-left">Order Time</th>
                                            <th class="text-left">Total</th>
                                            <th class="text-left">Status</th>
                                            <th class="text-left">Waiters</th>
                                            <th class="text-left">Cashier</th>
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
                                        <tr v-for="(order, index) in limitedOrders" :key="order.id" :data-index="index">
                                            <td class="text-left">{{ order.customer_name }}</td>
                                            <td class="text-left">{{ order.table_no }}</td>
                                            <td class="text-left">{{ order.order_date }}</td>
                                            <td class="text-left">{{ order.order_time }}</td>
                                            <td class="text-left">{{ order.total }}</td>
                                            <td class="text-left">{{ order.status }}</td>
                                            <td class="text-left">{{ order.waiters.name }}</td>
                                            <td class="text-left">{{ order.cashier ? order.cashier.name : '' }}</td>
                                            <td class="text-left">
                                                <RouterLink :to="{ name: 'orderdetail', params: {orderId: order.id }}" class="btn btn-outline-success btn-sm mx-1">
                                                Lihat Detail
                                                </RouterLink>
                                                <button class="btn btn-outline-danger btn-sm mx-1" @click="hapus(order.id)">
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                        <tr>
                                            <td colspan="10" class="text-right">
                                                <button @click="loadMore()" v-if="limit < orders.length" class="btn btn-primary">Load More</button>
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
    </div>
</template>
<script>
import axios from 'axios';
import router from '@/router';
import gsap from "gsap";
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';
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
            userID: '',
            orders: [],
            filteredOrders: [],
            keyword: '',
            image: '',
            processing: false,
            limit: 10,
            orderID: ''
        }
    },
    computed: {
        limitedOrders() {
            return this.filteredOrders.slice(0, this.limit);
        }
    },
    mounted(){
        document.title = "Order List";
        this.userID = Cookies.get('id')
        if(!this.userID){
            router.push({ name: 'login' })
        }
        this.getOrders()
    },
    methods: {
        getOrders() {
            axios.get('https://sub.mykavling.store/api/order', {
                headers: {
                    'Authorization' : `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.orders = response.data.data
                this.filteredOrders = this.orders
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
        searchOrder() {
            this.filteredOrders = this.orders.filter(order => order.status.toLowerCase().includes(this.keyword.toLowerCase()))
        },
        filterNumeric(event) {
            const input = event.target;
            input.value = input.value.replace(/\D/g, '');
            this.keyword = input.value;
        },
        loadMore() {
            this.limit += 10;
        },
        hapus(id) {
            this.orderID = id;
            Swal.fire({
                title: 'Danger',
                text: 'Are you sure? this Order will Deleted Permanently!!',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, Delete it!!!',
            })
            .then((result) => {
                if(result.isConfirmed) {
                    axios.delete('https://sub.mykavling.store/api/order/' + this.orderID, {
                        headers: {
                            'Authorization': `Bearer ${Cookies.get('token')}`
                        }
                    })
                    .then((response) => {
                        Swal.fire({
                            icon: "info",
                            title: "Info",
                            title: "Berhasil menghapus data order",
                            showConfirmButton: false,
                            timer: 600
                        });
                        this.getOrders();
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
        }
    },
}
</script>
<style lang="">
    
</style>