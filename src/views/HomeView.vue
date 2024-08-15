<template lang="">
  <div>
    <div class="container-fluid">
      <div class="row mb-2">
        <div class="col-12">
          <div class="card">
            <div class="card-header">
              <h3 class="text-center">Most Popular Product</h3>
            </div>
            <div class="card-body" style="overflow-y: auto; max-height: 600px;">
              <div class="row">
                <div v-if="processing == true" class="col-12">
                  <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                      <span class="visually-hidden"></span>
                    </div>
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-3" v-for="(data, index) in item" :key="data.id" :data-index="index">
                  <div class="card mt-2">
                    <img :src="url + data.image" height="250px" class="card-img-top" alt="...">
                    <span v-if="data.total_qty == most" class="most-popular">Most Popular <span class="material-symbols-outlined text-primary">verified</span></span>
                    <div class="card-body">
                      <h5 class="card-title">{{ data.name }}</h5>
                      <p class="card-text">Rp. {{ formatCurrency(data.price) }}</p>
                      <p class="card-text">{{ data.total_qty }} Terjual</p>
                    </div>
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
import router from "@/router";
import Cookies from "js-cookie";
import axios from 'axios'

export default {
  data() {
    return {
      userID: '',
      item: [],
      most: '',
      url: 'https://sub.mykavling.store/public/public/items/',
      processing: false,
    }
  },
  mounted() {
    document.title = 'Home Page';
    this.userID = Cookies.get('id');
    if(!this.userID) {
      router.push({ name: 'login' });
    }
    this.get()
  },
  methods: {
    get() {
      this.processing = true
      axios.get('https://sub.mykavling.store/api/dashboard', {
        headers: {
          'Authorization': `Bearer ${Cookies.get('token')}`
        }
      })
      .then((response) => {
        this.processing = false
        this.item = response.data.data.item
        this.most = response.data.data.mostpopular
      })
      .catch((error) => {
        if (error.response.status == 401) {
          Cookies.remove('email');
          Cookies.remove('name');
          Cookies.remove('role_id');
          Cookies.remove('token');
          Cookies.remove('image');
          Cookies.remove('id');
          this.$router.push({ name: 'login' });
        }
      })
    },
    formatCurrency(value) {
      if (!value) return '';
      value = value.toString();
      return value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
}
</script>
<style>
.image-container {
    position: relative;
}

.most-popular {
    position: absolute;
    top: 10px;
    left: 10px;
    background-color: rgba(255, 255, 255, 0.613);
    backdrop-filter: blur(35%);
    padding: 5px;
    border-radius: 3px;
    z-index: 10;
}
</style>