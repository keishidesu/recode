<template>
  <b-card class="mt-4 bg-nf-white border-0 border-round">
    <b-form @submit="onSubmit">

      <b-form-group id="input-company-name" label="Company Name:" label-for="companyinput-1">
        <b-form-input
          id="companyinput-1"
          v-model="form.companyname"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-company-username" label="Company Username:" label-for="companyinput-2">
        <b-form-input
          id="companyinput-2"
          v-model="form.username"
          placeholder="Enter username"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-company-email" label="Company Email:" label-for="companyinput-3">
        <b-form-input
          id="companyinput-3"
          v-model="form.companyemail"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-company-website" label="Company Website:" label-for="companyinput-4">
        <b-form-input
          id="companyinput-4"
          v-model="form.companywebsite"
          placeholder="Enter website link"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-company-tagline" label="Company Tagline:" label-for="companyinput-5">
        <b-form-textarea
          id="companyinput-5"
          rows="4"
          v-model="form.companytagline"
          placeholder="Enter description"
          required
        ></b-form-textarea>
      </b-form-group>

      <b-form-group id="input-company-desc" label="Company Description:" label-for="companyinput-6">
        <b-form-textarea
          id="companyinput-6"
          rows="8"
          v-model="form.companydescription"
          placeholder="Enter description"
          required
        ></b-form-textarea>
      </b-form-group>

      <div class="text-center">
        <b-button type="submit" class="nf-button-secondary w-100">Edit</b-button>
      </div>
    </b-form>
    <!-- <b-card class="mt-3" header="Form Data Result">
      <pre class="m-0">{{ form }}</pre>
    </b-card> -->
  </b-card>
</template>

<script>
export default {
    data() {
      return {
        form: {
          companyemail: '',
          companyname: '',
          companywebsite: '',
          companydescription: ''
        }
      }
    },
    methods: {
      onSubmit(event) {
        event.preventDefault()
        alert(JSON.stringify(this.form))
      }
    }
  }
</script>

<style>

</style>