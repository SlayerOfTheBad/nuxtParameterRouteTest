<template>
  <div>
    <h1>The client component</h1>
    <NuxtChild />
  </div>
</template>

<script>
export default {
  name: 'Client',
  components: { Module3, Module2, Module1 },
};
</script>

<style scoped>

</style>
