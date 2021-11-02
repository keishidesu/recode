<template>
  <div>
    <Nav2 :class="bgcolor" />
    <div class="container">
      <div class="row text-center justify-content-md-center mt-5">
        <div class="col-md-6">
          <v-row align="center">
            <h2 class="font-weight-bold mt-5">
              Welcome Back
            </h2>
            <b-card class="mt-4 border-0 border-round">
              <b-form @submit="devLogin">
                <b-form-group>
                  <input v-model="devEmail" type="email" class="border-round-small form-control" placeholder="Enter email" >
                </b-form-group>

                <b-form-group>
                  <input v-model="devPassword" type="password" class="border-round-small form-control" placeholder="Password">
                </b-form-group>

                <div class="text-center">
                  <b-button type="submit" class="nf-button-secondary w-100">
                    Login as Developer
                  </b-button>
                </div>
              </b-form>
            </b-card>
          </v-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: "bg-nf-primary",

      devEmail: '',
      devPassword: ''
    };
  },
  methods: {
    async devLogin(e) {
      e.preventDefault()
      console.log(this.devEmail, this.devPassword);
      await this.$axios
        .post('http://localhost:8000/developer/login', {
        email: this.devEmail,
        password: this.devPassword
      })
      .then((res) => {
        if (res.status == 200) {
          console.log(res)
          localStorage.setItem('developer-id', res.data.developer.developerID)
          this.$store.commit('session/auth', { devid: res.data.developer.developerID })
          this.makeToast('Logged in!', 'Welcome back developer', 'success')
          this.$router.push('/developerDash')
        } else {
          this.makeToast('Cannot be Logged in!', 'Something is wrong', 'warning')
        }
      })
      .catch((err) => {
        console.log(err)
        this.makeToast('Cannot be Logged in!', err, 'warning')
      })
    },
    makeToast (title, message, variant) {
      this.$bvToast.toast(message, {
        title,
        variant,
        autoHideDelay: 2500,
        appendToast: true
      })
    }
  },
};
</script>
