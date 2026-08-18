<script setup lang="ts">
const props = defineProps<{
    title: string;
    isRequired: boolean;
}>();
</script>

<template>
    <div class="input-container">
        <div>
            <span><span v-if="props.isRequired">*</span> {{ props.title }}</span>
        </div>
    </div>
</template>
