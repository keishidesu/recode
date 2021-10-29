<template>
  <div>
    <Nav :class="bgcolor" />
    <PageHeader :header="header" :class="bgcolor" />
    <PageBody :body="body">
      <b-container class="text-center">
        <h3 class="mb-4">{{ developer.fname }} {{ developer.lname }}</h3>
        <p>
          {{ developer.desc }}
        </p>
        <p>Email: {{ developer.email }}</p>
        <p>Website: {{ developer.website }}</p>
        <!-- get pdf here -->
      </b-container>
    </PageBody>
  </div>
</template>

<script>
export default {
  data() {
    return {
      bgcolor: 'bg-nf-primary',
      header: {
        title: 'Explore Developers',
      },
      body: {
        title: ''
      },
      developer: {
        fname: 'John',
        lname: 'Doe',
        desc: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do   eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        email: 'johndoe@gmail.com',
        website: 'johndoe.io'
      }
    }
  }
}
</script>