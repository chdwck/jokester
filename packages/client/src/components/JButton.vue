<script lang="ts" setup>
import { computed } from "vue";
type ButtonType = "primary" | "secondary"
const props = defineProps<{ buttonType: ButtonType }>();
const isPrimary = computed(() => props.buttonType === "primary");
</script>

<template>
    <button
        :class="{ 'bg-purple-300 text-black hover:bg-purple-200': !isPrimary, 'bg-opacity-40 hover:bg-opacity-100': isPrimary }"
        class="px-2 py-1 text-white bg-black border border-white rounded-md">
        <slot></slot>
    </button>
</template>