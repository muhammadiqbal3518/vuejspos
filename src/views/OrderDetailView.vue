<template lang="">
    <div>
        <div class="container-fluid" style="overflow-y: auto; max-height: 750px;">
            <div class="row">
                <div class="col-12 text-left mb-2">
                    <RouterLink to="/order-list" class="btn btn-warning">Back</RouterLink>
                </div>
                <div class="col-lg-5 col-md-12">
                    <div class="card">
                        <div class="card-body" style="overflow-y: auto; max-height: 600px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable table-bordered">
                                    <tbody>
                                        <tr>
                                            <td class="text-left">Customer Name : {{ order.customer_name }}</td>
                                            <td class="text-left">Table No : {{ order.table_no }}</td>
                                        </tr>
                                        <tr>
                                            
                                            <td class="text-left">Tanggal Order : {{ order.order_date }}</td>
                                            <td class="text-left">Status Order : {{ order.status }}</td>
                                        </tr>
                                        <tr>
                                            <td class="text-left">Waiters : {{ order.waiters ? order.waiters.name : '-' }}</td>
                                            <td class="text-left">Cashier : {{ order.cashier ? order.cashier.name : '-' }}</td>
                                        </tr>
                                        <tr>
                                            
                                            <td class="text-left">Order Time : {{ order.order_time }}</td>
                                            <td class="text-left">Grand Total : Rp. {{ formatCurrency(order.total) }},00</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                            <div class="col-12">
                                <div class="py-3">
                                    <!-- jika status ordered dan user role chef -->
                                    <button v-if="order.status == 'ordered' && (roleId == 2)" type="button" class="btn btn-sm btn-primary" @click="setAsDone(order.id)">
                                        Set As Done
                                    </button>
                                    <!-- jika status done dan user role cashier / manager -->
                                    <button v-if="(order.status == 'done') && (roleId == 3 || roleId == 4)" type="button" class="btn btn-sm btn-primary" @click="setAsPaid(order.id)">
                                        Set As Paid
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-lg-7 col-md-12">
                    <div class="card">
                        <div class="card-body" style="overflow-y: auto; max-height: 600px;">
                            <div class="table-responsive">
                                <table class="table table-hoverable">
                                    <thead>
                                        <tr>
                                            <th class="text-left">#</th>
                                            <th class="text-left">Item Name</th>
                                            <th class="text-left">Qty</th>
                                            <th class="text-left">Price</th>
                                            <th class="text-left">Total/item</th>
                                        </tr>
                                    </thead>
                                    <tbody v-if="processing == false">
                                        <tr v-for="(loop, index) in order_details" :key="index">
                                            <td class="text-left">{{ index+1 }}</td>
                                            <td class="text-left">{{ loop.item.name }}</td>
                                            <td class="text-left">{{ loop.qty }}</td>
                                            <td class="text-left">Rp. {{ formatCurrency(loop.price) }},00</td>
                                            <td class="text-left">Rp. {{ formatCurrency(loop.price * loop.qty) }},00</td>
                                        </tr>
                                    </tbody>
                                    <tbody v-if="processing == true">
                                        <tr>
                                            <td colspan="5" class="text-center">
                                                <div class="spinner-border text-primary" role="status">
                                                    <span class="visually-hidden"></span>
                                                </div>
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
            userID: '',
            roleId: '',
            OrderID: '',
            order: '',
            order_details: [],
            processing: false,
        }
    },
    mounted(){
        document.title = "Order Detail";
        this.OrderID = this.$route.params.orderId
        this.userID = Cookies.get('id')
        this.roleId = Cookies.get('role_id')
        if(!this.userID){
            router.push({ name: 'login' })
        }
        this.getOrder()
    },
    methods: {
        getOrder() {
            axios.get('https://sub.mykavling.store/api/order/'+this.OrderID, {
                headers: {
                    'Authorization' : `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.order = response.data.data
                this.order_details = response.data.data.order_detail
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
        formatCurrency(value) {
            if (!value) return '';
            value = value.toString();
            return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        setAsDone(OrderID) {
            axios.get('https://sub.mykavling.store/api/order/'+this.OrderID+'/set-as-done', {
                headers: {
                    'Authorization' : `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                if(response.status == 200)
                {
                    Swal.fire({
                        title: 'Process Success',
                        text: 'Order Telah Selesai',
                        icon: 'success'
                    });
                    this.getOrder()
                }
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
                if(error.response.status == 403){
                    Swal.fire({
                        title: 'Access Denied',
                        text: 'Only Chef can set this Order to be Done',
                        icon: 'error'
                    });
                }
            })
        },
        setAsPaid(OrderID) {
            axios.get('https://sub.mykavling.store/api/order/'+this.OrderID+'/payment', {
                headers: {
                    'Authorization' : `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                if(response.status == 200)
                {
                    Swal.fire({
                        title: 'Congratulation',
                        text: 'Payment Success',
                        icon: 'success'
                    });
                    this.getOrder()
                }
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
                if(error.response.status == 403){
                    Swal.fire({
                        title: 'Access Denied',
                        text: 'Only Cashier & Manager can Paid the Order',
                        icon: 'error'
                    });
                }
                console.log(error);
            })
        }
    }
}
</script>
<style lang="">
    
</style>