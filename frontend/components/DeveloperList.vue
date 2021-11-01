<template>
  <b-container>
    <b-row cols="1" cols-lg="4" class="mt-2">
      <b-col v-for="(developer, index) in developers" :key="`alldevelopers-${index}`">
        <!-- <NuxtLink :to='`/developer/${developer.developerUsername}`'> -->
        <b-card no-body class="text-center border-0 mt-3 rounded">
          <!-- <b-img :src="`${developer.developerProfilePhotoFilepath}`" class="w-75 mx-auto mb-2 rounded" fluid /> -->
          <b-img src="../assets/img/user.jpg" class="w-75 mx-auto mb-2 rounded" fluid />
          <p><b>{{developer.developerFirstName}} {{developer.developerLastName}}</b>
            <br>
            {{developer.developerProfessionalTitle}}
            <br>
            {{developer.developerEmail}}
          </p>
        </b-card>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
export default {
  data() {
    return {
      developers: ''
    }
  },
  async fetch() {
    const developers = await fetch('http://localhost:8000/developerlist')
    const res = await developers.json()
    this.developers = res
    console.log(res)
  }
}
</script>

