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
            <b-nav-item><NuxtLink :to='roleLink' class="font-weight-bold text-white text-decoration-none">My Dashboard</NuxtLink></b-nav-item>
            <b-nav-item @click="Logout"><NuxtLink to='/' class="font-weight-bold nf-red">Logout</NuxtLink></b-nav-item>
          </b-navbar-nav>

          <!-- User NOT Logged In -->
          <b-navbar-nav v-else class="ml-auto">
            <b-nav-item v-for="(item2, index) in nav" :key="item2[index]" class="ml-auto">
              <b-button class="btn-outline-light"><NuxtLink :to='`/${item2.link}`' class="text-white text-decoration-none">{{item2.item}}</NuxtLink></b-button>
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
  created() {
    this.isLoggedIn = this.$store.state.session.companyid !== undefined || this.$store.state.session.adminid !== undefined || this.$store.state.session.devid !== undefined
    const role = this.$store.state.session.role
    if (role !== undefined) {
      this.roleLink = '/' + role.toLowerCase() + 'Dash'
    } else {
      this.roleLink = ''
    }
    
    this.$forceUpdate()
  },
  data() {
    return {
      isLoggedIn: false,
      roleLink: '',
      navloggedin: [
        {item:'Explore Jobs', link: ''},
        {item:'Explore Companies', link: 'companyListing'},
        {item:'Connect with Developers', link: 'developerListing'},
      ],
      nav: [
        {item:'Sign In (Company)', link: 'companyLogin'},
        {item:'Sign In (Developer)', link: 'developerLogin'},
        {item:'Join as Company', link: 'companyRegister'},
        {item:'Join as Developer', link: 'developerRegister'},
      ]
    }
  },
  methods: {
    async Logout() {
      await this.$axios
        .get('http://localhost:8000/logout')
        .then(() => {
          window.location.reload()
        }) 
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
