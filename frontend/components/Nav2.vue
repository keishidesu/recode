<template>
  <div>
    <b-navbar toggleable="lg" type="dark" :class="{ bgcolor }">
      <b-container>
        <b-navbar-brand style="font-size: 1.5rem">re:code</b-navbar-brand>
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav>
          <!-- User !Logged In -->
          <b-navbar-nav class="ml-auto">
            <b-nav-item
              v-for="(item, index) in navloggedin"
              :key="item[index]"
              class="ml-auto"
            >
              <NuxtLink
                :to="`/${item.link}`"
                class="font-weight-bold text-white text-decoration-none"
                >{{ item.item }}</NuxtLink
              >
            </b-nav-item>
          </b-navbar-nav>
        </b-collapse>
      </b-container>
    </b-navbar>
  </div>
</template>

<script>
export default {
  props: ["bgcolor"],
  data() {
    return {
      isEmployer: true,

      navloggedin: [
        { item: "Sign in", link: "" },
        { item: "Join", link: "Login" }
      ]
    };
  }
};
</script>

<style scoped>
.btn-outline-light {
  background-color: #00000000;
  border-radius: 10px;
}

.btn-outline-light:hover {
  background-color: #444da0;
}
</style>
