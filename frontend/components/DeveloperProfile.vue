<template>
  <b-card class="mt-4 bg-nf-white border-0 border-round">
    <b-form @submit="updateDeveloperProfile">

      <b-form-group>
        <b-form-input v-model="developerProftitle" placeholder="Enter Professional Title" />
      </b-form-group>

      <b-form-group>
        <b-form-input v-model="developerDescription" placeholder="Enter Description" />
      </b-form-group>

      <b-form-group>
        <b-form-select v-model="selectedCountry" :options="countries" placeholder="Select Country" />
      </b-form-group>

      <b-form-group>
        <b-form-input v-model="developerWebsite" placeholder="Enter Website" />
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Update Profile</b-button>
      </div>
    </b-form>
  </b-card>
</template>

<script>
export default {
    data() {
      return {
        developerProftitle: '',
        developerDescription: '',
        selectedCountry: '',
        countries: [],
        developerWebsite: ''
      }
    },

    created () {
      this.$axios.get('http://localhost:8000/developer/countries')
        .then((res) => {
          this.countries = res.data.countries.map((x) => { return { value: x.id, text: x.name }})
        })
    },

    methods: {
      async updateDeveloperProfile(e) {
        e.preventDefault()
        
        try {
          let res = await this.$axios
            .put('http://localhost:8000/developer/profile', {
            developerID: this.$store.state.session.devid,
            professional_title: this.developerProftitle,
            description: this.developerDescription,
            website: this.developerWebsite,
            countryID: this.selectedCountry
          })
          this.makeToast('Profile Updated!', 'Changes has been updated', 'success')
        } catch (err) {
          console.log(err)
          this.makeToast('Cannot Update Profile!', err, 'warning')
        }
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
  }
</script>

<style>

</style>