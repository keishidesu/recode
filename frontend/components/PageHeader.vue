<template>
  <div class="text-center text-white" style="padding-top: 6rem; padding-bottom: 6rem">
    <p style="font-size: 2.5rem">{{header.title}}</p>
    <Searchbar />
    <span v-for="(nav, index) in header.navs" :key="nav[index]">
      <NuxtLink to='`{nav.link}`' class="text-white">{{nav.item}}</NuxtLink>
    </span>
  </div>
</template>

<script>
export default {
  props: ['header']
}
</script>

<style scoped>

</style>
