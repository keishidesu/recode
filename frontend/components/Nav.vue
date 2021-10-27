<template>
  <div>
    <b-navbar toggleable="lg" type="dark" :class={bgcolor}>
      <b-container>
        <b-navbar-brand style="font-size: 1.5rem">re:code</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>

          <!-- User Logged In -->
          <b-navbar-nav v-if="isLoggedIn" class="ml-auto">
            <b-nav-item v-for="(item, index) in navloggedin" :key="item[index]" class="ml-auto">
              <NuxtLink :to='`/${item.link}`' class="font-weight-bold text-white text-decoration-none">{{item.item}}</NuxtLink>
            </b-nav-item>
            <b-nav-item><NuxtLink to='#' class="font-weight-bold nf-blue text-decoration-none">Post a Job</NuxtLink></b-nav-item>
          </b-navbar-nav>

          <!-- User NOT Logged In -->
          <b-navbar-nav v-else class="ml-auto">
            <b-nav-item v-for="(item, index) in nav" :key="item[index]" class="ml-auto">
              <b-button class="btn-outline-light"><NuxtLink to='`{item.link}`' class="text-white text-decoration-none">{{item.item}}</NuxtLink></b-button>
            </b-nav-item>
          </b-navbar-nav>
          
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {
  props: ['bgcolor'],
  data() {
    return {
      isLoggedIn: true,

      navloggedin: [
        {item:'Find a Job', link: ''},
        {item:'Find a Company', link: 'companyListing'},
        {item:'Connect with People', link: 'employeeListing'},
      ],
      nav: [
        {item:'Sign In', link: '#'},
        {item:'Join as Company', link: '#'},
        {item:'Join', link: '#'},
      ]
    }
  }
}
</script>

<style scoped>
  .btn-outline-light {
    background-color: #00000000;
    border-radius: 10px;
  }

  .btn-outline-light:hover {
    background-color: #444DA0;
  }
</style>
