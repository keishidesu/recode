<template>
  <div>
    <b-navbar toggleable="lg" type="dark" class="bg-nf-primary">
      <b-container>
        <b-navbar-brand style="font-size: 1.5rem">notfiverr</b-navbar-brand>

        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

        <b-collapse id="nav-collapse" is-nav>
          <b-navbar-nav class="ml-auto">
            <b-nav-item><b-button class="btn-outline-light"><NuxtLink to="#" class="text-white text-decoration-none">Sign In</NuxtLink></b-button></b-nav-item>
            <b-nav-item><b-button class="btn-outline-light"><NuxtLink to="#" class="text-white text-decoration-none">Join as Company</NuxtLink></b-button></b-nav-item>
            <b-nav-item><b-button class="btn-outline-light"><NuxtLink to="#" class="text-white text-decoration-none">Join</NuxtLink></b-button></b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {

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
