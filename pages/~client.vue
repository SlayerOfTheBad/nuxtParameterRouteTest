<template>
  <div>
    <h1>The client component</h1>
    <NuxtChild />
  </div>
</template>

<script>
export default {
  name: 'Client',
  mounted () {
    console.log(this.$route.meta);
  },
};
</script>

<style scoped>

</style>
