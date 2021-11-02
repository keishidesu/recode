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
              <b-form @submit="onSubmit">
                <b-form-group id="input-dev-email" label-for="dinput-5">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-5"
                    v-model="form.email"
                    placeholder="Email address"
                    required
                  >
                  </b-form-input>
                </b-form-group>

                <b-form-group id="input-dev-pass" label-for="dinput-6">
                  <b-form-input
                    class="border-round-small"
                    id="dinput-6"
                    v-model="form.password"
                    placeholder="Password"
                    required
                  >
                  </b-form-input>
                </b-form-group>
                <div class="text-center">
                  <b-button type="Login" class="nf-button-secondary  w-100"
                    >Submit</b-button
                  >
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

      companyEmail: '',
      companyPassword: ''
    };
  },
  methods: {
    async companyLogin(e) {
      e.preventDefault()
      console.log(this.companyEmail, this.companyPassword);
      await this.$axios
        .post('http://localhost:8000/company/login', {
        email: this.companyEmail,
        password: this.companyPassword
      })
      .then((res) => {
        if (res.status == 200) {
          console.log(res)
          localStorage.setItem('company-id', res.data.company.companyID)
          this.$store.commit('session/auth', { companyid: res.data.company.companyID })
          this.makeToast('Logged in!', 'Welcome back company', 'success')
          this.$router.push('/companyDash')
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
