<template>
  <div>
    <Nav2 :class="bgcolor" />
    <div class="container">
      <div class="row text-center justify-content-md-center mt-5">
        <div class="col-md-6">
          <v-row align="center">
            <h2 class="font-weight-bold mt-5">
              Welcome Back Admin
            </h2>
            <b-card class="mt-4 border-0 border-round">
              <b-form @submit="adminLogin">
                <b-form-group>
                  <input v-model="adminEmail" type="email" class="border-round-small form-control" placeholder="Enter email" >
                </b-form-group>

                <b-form-group>
                  <input v-model="adminPassword" type="password" class="border-round-small form-control" placeholder="Password">
                </b-form-group>

                <div class="text-center">
                  <b-button type="submit" class="nf-button-secondary w-100">
                    Login as Admin
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

      adminEmail: '',
      adminPassword: ''
    };
  },
  methods: {
    async adminLogin(e) {
      e.preventDefault()
      console.log(this.adminEmail, this.adminPassword);
      await this.$axios
        .post('http://localhost:8000/admin/login', {
        email: this.adminEmail,
        password: this.adminPassword
      })
      .then((res) => {
        if (res.status == 200) {
          console.log(res)
          localStorage.setItem('admin-id', res.data.admin.adminID)
          this.$store.commit('session/auth', { companyid: res.data.admin.adminID })
          this.makeToast('Logged in!', 'Welcome back company', 'success')
          this.$router.push('/adminDash')
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
