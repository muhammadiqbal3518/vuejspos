<template lang="">
    <div>
        <div class="container-fluid">
            <div class="row">
                <div class="col-12">
                    <div class="card">
                        <div class="card-body" style="overflow-y: auto; max-height: 700px;">
                            <div class="btn-group btn-group-sm mb-2">
                                <button type="button" @click="decrease()" class="btn btn-primary" :disabled="val == 1">Prev</button>
                                <p class="text-center mx-2">
                                    {{ val == 1 ? 'Januari' : val == 2 ? 'Februari' : val == 3 ? 'Maret' : val == 4 ? 'April' : val == 5 ? 'Mei' : val == 6 ? 'Juni' : val == 7 ? 'Juli' : val == 8 ? 'Agustus' : val == 9 ? 'September' : val == 10 ? 'Oktober' : val == 11 ? 'November' : val == 12 ? 'Desember' : '' }}
                                </p>
                                <button type="button" @click="increase()" class="btn btn-primary" :disabled="val == 12">Next</button>
                            </div>
                            <div class="row mb-3">
                                <div class="col-12 col-md-6 col-lg-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <p class="text-center">Order Count</p>
                                            <h1 class="text-center text-default">{{ data.orderCount ? data.orderCount : 0 }}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 col-lg-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <p class="text-center">Min Purchase</p>
                                            <h1 class="text-center text-default">Rp {{ formatCurrency(data.minPayment) }}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 col-lg-4">
                                    <div class="card">
                                        <div class="card-body">
                                            <p class="text-center">Max Purchase</p>
                                            <h1 class="text-center text-default">Rp {{ formatCurrency(data.maxPayment) }}</h1>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mt-2">
                                    <div class="card">
                                        <div class="card-body" style="width:100%; height:310px;">
                                            <h6 class="card-title">Order/date chart</h6>
                                            <canvas id="orderChart" width="400" height="150"></canvas>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-12 col-md-6 mt-2">
                                    <div class="card">
                                        <div class="card-body" style="width:100%; height:310px;">
                                            <h6 class="card-title">Order/datetime chart</h6>
                                            <canvas id="newChart" width="400" height="150"></canvas>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-12">
                                    <div class="card">
                                        <div class="card-header">
                                            <h6 class="card-title card-padding pb-0 text-center">
                                                Order List
                                            </h6>
                                        </div>
                                        <div class="card-body" style="overflow-y: auto; max-height: 600px;">
                                            <div class="table-responsive">
                                                <table class="table table-hoverable mb-5">
                                                    <thead>
                                                        <tr>
                                                            <th class="text-left">#</th>
                                                            <th class="text-left">Customer Name</th>
                                                            <th class="text-left">No Meja</th>
                                                            <th class="text-left">Order Date</th>
                                                            <th class="text-left">Order Time</th>
                                                            <th class="text-left">Total</th>
                                                            <th class="text-left">Status</th>
                                                            <th class="text-left">Waiters</th>
                                                            <th class="text-left">Cashier</th>
                                                        </tr>
                                                    </thead>
                                                    <tbody>
                                                        <tr v-for="(order, index) in orders" :key="index">
                                                            <td class="text-left">{{ index+1 }}</td>
                                                            <td class="text-left">{{ order.customer_name }}</td>
                                                            <td class="text-left">{{ order.table_no }}</td>
                                                            <td class="text-left">{{ order.order_date }}</td>
                                                            <td class="text-left">{{ order.order_time }}</td>
                                                            <td class="text-left">{{ order.total }}</td>
                                                            <td class="text-left">{{ order.status }}</td>
                                                            <td class="text-left">{{ order.waiters.name }}</td>
                                                            <td class="text-left">{{ order.cashier ? order.cashier.name : '' }}</td>
                                                        </tr>
                                                    </tbody>
                                                </table>
                                            </div>
                                        </div>
                                        <div class="card-footer"></div>
                                    </div>
                                </div>
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
import Chart from 'chart.js/auto';
import Cookies from 'js-cookie';
export default {
    data() {
        return {
            roleId: '',
            userID: '',
            orders: [],
            data: '',
            chart: null,
            barChart: null,
            selectedMonth: null,
            image: '',
            val: 0
        }
    },
    mounted(){
        document.title = "Report";
        this.roleId = Cookies.get('role_id')
        this.userID = Cookies.get('id')
        if(!this.userID){
            router.push({ name: 'login' })
        }
        if(this.roleId != 4){
            router.push({ name: 'home' })
        }
        this.updateChart()
        const months = [1,2,3,4,5,6,7,8,9,10,11,12];

        const currentDate = new Date();
        const currentMonthIndex = currentDate.getMonth();
        const currentMonthName = months[currentMonthIndex];
        this.val = currentMonthName
        this.getReport()
    },
    methods: {
        getReport() {
            // $("#loadingModal").modal("show");
            axios.get('https://sub.mykavling.store/api/order-report?month=' + this.val, {
                headers: {
                'Authorization': `Bearer ${Cookies.get('token')}`
                }
            })
            .then((response) => {
                this.orders = response.data.data.orders;
                this.data = response.data.data;
                this.updateChart();
            })
            .catch((error) => {
                if (error.response.status == 401) {
                    Cookies.remove('image');
                    Cookies.remove('id');
                    Cookies.remove('name');
                    Cookies.remove('role_id');
                    Cookies.remove('token');
                    this.$router.push({ name: 'login' });
                }
            }).finally(() => {
            // $("#loadingModal").modal("hide");
            });
        },
        updateChart() {
            const orderTotalsByDate = this.orders.reduce((acc, order) => {
                const date = order.order_date;
                if (!acc[date]) {
                acc[date] = 0;
                }
                acc[date] += order.total;
                return acc;
            }, {});
            const formatDate = (dateStr) => {
                const date = new Date(dateStr);
                const options = { day: '2-digit', month: 'long', year: 'numeric' };
                return date.toLocaleDateString('id-ID', options);
            };
            const getRandomColor = () => {
                const r = Math.floor(Math.random() * 255);
                const g = Math.floor(Math.random() * 255);
                const b = Math.floor(Math.random() * 255);
                return `rgba(${r}, ${g}, ${b}, 1)`;
            };
            const labels = Object.keys(orderTotalsByDate).map(formatDate);
            const data = Object.values(orderTotalsByDate);

            const label = this.orders.map(order => `date:${formatDate(order.order_date)} time:${order.order_time}`);
            const datas = this.orders.map(order => order.total);

            const ctx = document.getElementById('orderChart').getContext('2d');
            const cta = document.getElementById('newChart').getContext('2d');
            if (this.chart) {
                this.chart.destroy();
            }
            if (this.barChart) {
                this.barChart.destroy();
            }
            const backgroundColors = datas.map(() => getRandomColor());
            const borderColors = datas.map(() => getRandomColor());
            this.chart = new Chart(ctx, {
                type: 'bar',
                data: {
                labels: labels,
                datasets: [{
                    label: 'Bar Chart',
                    data: data,
                    borderColor: borderColors,
                    backgroundColor: backgroundColors,
                    borderWidth: 1
                }]
                },
                options: {
                    scales: {
                        y: {
                        beginAtZero: true
                        }
                    }
                }
            });

            this.barChart = new Chart(cta, {
                type: 'line',
                data: {
                    labels: label,
                    datasets: [{
                        label: 'Line Chart',
                        data: datas,
                        borderColor: borderColors,
                        backgroundColor: backgroundColors,
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                        beginAtZero: true
                        }
                    }
                }
            });
        },
        formatCurrency(value) {
        if (!value) return '';
        value = value.toString();
        return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
        },
        increase() {
            this.val ++
            this.getReport()
        },
        decrease() {
            this.val --
            this.getReport()
        }
    }
}
</script>
<style lang="">
    
</style>