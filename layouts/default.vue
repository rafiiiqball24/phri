<template>
    <div class="app">
        <Navbar />
        <main class="app-main">
            <slot />
        </main>
        <Footer />
    </div>
</template>

<script setup lang="ts">
</script>

<style scoped>
.app {
    min-height: 100dvh;
    display: flex;
    flex-direction: column;
}

.app-main {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-height: 0;
}
</style>
