<template>
  <div>
    <Nav :class="bgcolor" />
    <div class="container">
      <div class="row text-center justify-content-md-center mt-5">
        <div class="col-md-6">
          <b-row>
            <h2 class="font-weight-bold mt-5">
              Show the world who you are
            </h2>
            <b-card class="mt-4 border-0 border-round">
              <b-form @submit="developerRegister">
                <b-form-group>
                  <input v-model="developerEmail" type="email" class="border-round-small border form-control" placeholder="Enter email" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerFirstname" type="text" class="border-round-small border form-control" placeholder="Enter First Name" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerLastname" type="text" class="border-round-small border form-control" placeholder="Enter Last Name" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerUsername" type="text" class="border-round-small border form-control" placeholder="Enter Username" required>
                </b-form-group>
                <b-form-group>
                  <input v-model="developerContact" type="text" class="border-round-small border form-control" placeholder="Enter Contact Number" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerWebsite" type="text" class="border-round-small border form-control" placeholder="Enter Website Link" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerProftitle" type="text" class="border-round-small border form-control" placeholder="Enter Professional Title" required>
                </b-form-group>

                <b-form-select v-model="selectedCountry" :options="countries" class="border-round-small border form-control" />

                 <b-form-group>
                  <input v-model="developerDescription" type="text" class="mt-3 border-round-small border form-control" placeholder="Enter Description" required>
                </b-form-group>

                <b-form-group>
                  <input v-model="developerPassword" type="password" class="border-round-small border form-control" placeholder="Password" required>
                </b-form-group>

                <b-form-group class="mt-3">
                  <input type="file" name="developerImage" @change="onFileChangeImage" accept=".png, .jpeg, .jpg" required>
                  <label>Profile photo...</label>
                </b-form-group>

                <b-form-group class="mt-3">
                  <input type="file" name="developerResume" @change="onFileChangeResume" accept=".pdf" required>
                  <label>Resume (.pdf)...</label>
                </b-form-group>

                <div class="text-center">
                  <b-button type="submit" class="nf-button-secondary w-100">
                    Register as Developer
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
      countries: [],
      selectedCountry: '',
      developerEmail: '',
      developerFirstname: '',
      developerLastname: '',
      developerUsername: '',
      developerContact: '',
      developerWebsite: '',
      developerProftitle: '',
      developerCountry: '',
      developerDescription: '',
      developerPassword: '',
      developerImage : null,
      developerResume : null,
    };
  },

  created () {
    this.$axios.get('http://localhost:8000/developer/countries')
      .then((res) => {
        this.countries = res.data.countries.map((x) => { return { value: x.id, text: x.name }})
      })
  },

  methods: {

    onFileChangeImage(e) {
      this.developerImage = e.target.files[0]
    },

    onFileChangeResume(e) {
      this.developerResume = e.target.files[0]
    },

    async developerRegister(e) {
      e.preventDefault()

      const formData = new FormData()
      formData.append('email', this.developerEmail)
      formData.append('first_name', this.developerFirstname)
      formData.append('last_name', this.developerLastname)
      formData.append('username', this.developerUsername)
      formData.append('website', this.developerWebsite)
      formData.append('contact_number', this.developerContact)
      formData.append('professional_title', this.developerProftitle)
      formData.append('country', this.developerCountry)
      formData.append('description', this.developerDescription)
      formData.append('country_id', this.selectedCountry)
      formData.append('password', this.developerPassword)
      formData.append('profilephoto', this.developerImage, this.developerImage.name)
      formData.append('resume', this.developerResume, this.developerResume.name)

      await this.$axios
        .post('http://localhost:8000/developer/register', 
          formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
            }
          },
        )
        .then((res) => {
          if (res.status == 200) {
            console.log(res)
            this.makeToast('Registered!', 'Welcome developer', 'success')
            this.$router.push('/developerLogin')
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
