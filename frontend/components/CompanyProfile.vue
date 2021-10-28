<template>
  <b-card class="mt-4 bg-nf-white border-0 border-round">
    <b-form @submit="onSubmit">
      <b-form-group id="input-group-1" label="Company Email:" label-for="input-1">
        <b-form-input
          id="input-1"
          v-model="form.companyemail"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-2" label="Company Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="form.companyname"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-3" label="Company Address:" label-for="input-3">
        <b-form-input
          id="input-3"
          v-model="form.companyaddress"
          placeholder="Enter address"
          required
        ></b-form-input>
      </b-form-group>

      <b-form-group id="input-group-4" label="Company Description:" label-for="input-4">
        <b-form-input
          id="input-4"
          class="py-5"
          v-model="form.companydescription"
          placeholder="Enter description"
          required
        ></b-form-input>
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
          companyaddress: '',
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