<template>
  <div>
    <Nav2 :class="bgcolor" />
    <div class="container">
      <div class="row text-center justify-content-md-center mt-5">
        <div class="col-md-6">
          <b-row>
            <h2 class="font-weight-bold mt-5">
              Let your company be known
            </h2>
            <b-card class="mt-4 border-0 border-round">
              <b-form @submit="companyRegister">
                <b-form-group>
                  <input v-model="companyEmail" type="email" class="border-round-small border form-control" placeholder="Enter email" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="companyName" type="text" class="border-round-small border form-control" placeholder="Enter Company Name" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="companyUsername" type="text" class="border-round-small border form-control" placeholder="Enter Company Username" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="companyWebsite" type="text" class="border-round-small border form-control" placeholder="Enter Company Website Link" required>
                </b-form-group>

                 <b-form-group>
                  <input v-model="companyTagline" type="text" class="border-round-small border form-control" placeholder="Enter Company Tagline" required>
                </b-form-group>

                 <b-form-group>
                  <input v-model="companyDescription" type="text" class="border-round-small border form-control" placeholder="Enter Company Description" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="companyPassword" type="password" class="border-round-small border form-control" placeholder="Password" required>
                </b-form-group>

                <b-form-group class="mt-3">
                  <input type="file" name="companyImage" @change="onFileChange" accept=".png, .jpeg, .jpg" required>
                  <label>Profile photo...</label>
                </b-form-group>

                <div class="text-center">
                  <b-button type="submit" class="nf-button-secondary w-100">
                    Register as Company
                  </b-button>
                </div>
              </b-form>
            </b-card>
          </b-row>
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
      companyName: '',
      companyUsername: '',
      companyWebsite: '',
      companyTagline: '',
      companyDescription: '',
      companyPassword: '',
      companyImage : '',
    };
  },
  methods: {
    onFileChange(e) {
      this.companyImage = e.target.files[0]
    },

    async companyRegister(e) {
      e.preventDefault()

      let formData = new FormData()
      formData.append('profilephoto', this.companyImage)

      await this.$axios
        .post('http://localhost:8000/company/register', {
          email: this.companyEmail,
          name: this.companyName,
          username: this.companyUsername,
          website: this.companyWebsite,
          tagline: this.companyTagline,
          description: this.companyDescription,
          password: this.companyPassword,
          formData
        })
        .then((res) => {
          if (res.status == 200) {
            console.log(res)
            this.makeToast('Registered!', 'Welcome company', 'success')
            this.$router.push('/companyLogin')
          } else {
            this.makeToast('Cannot be Registered!', 'Something is wrong', 'warning')
          }
        })
        .catch((err) => {
          console.log(err)
          this.makeToast('Cannot be Registered!', err, 'warning')
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
  }
};
</script>

<style scoped></style>
