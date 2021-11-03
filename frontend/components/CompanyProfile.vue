<template>
  <b-card class="mt-4 bg-nf-white border-0 border-round">
    <b-form @submit="updateCompanyProfile">

      <b-form-group>
        <b-form-input v-model="companyTagline" placeholder="Enter Tagline" />
      </b-form-group>

      <b-form-group>
        <b-form-input v-model="companyDescription" placeholder="Enter Description" />
      </b-form-group>

      <b-form-group>
        <b-form-input v-model="companyWebsite" placeholder="Enter Website" />
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Update Company Profile</b-button>
      </div>
    </b-form>
  </b-card>
</template>

<script>
export default {
    data() {
      return {
        companyTagline: '',
        companyDescription: '',
        companyWebsite: '',
      }
    },

    methods: {
      async updateCompanyProfile(e) {
        e.preventDefault()
        
        try {
          let res = await this.$axios
            .put('http://localhost:8000/company/profile', {
            companyID: localStorage.getItem('companyid'),
            tagline: this.companyTagline,
            description: this.companyDescription,
            website: this.companyWebsite,
          })
          this.makeToast('Company Profile Updated!', 'Changes has been updated', 'success')
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