<script lang="ts" setup>
import { computed, ref } from 'vue';
import JButton from '@/components/JButton.vue';

const props = defineProps({
    text: {
        type: String,
        required: true
    }
});

const showCopySuccess = ref(false);
const copyButtonEmoji = computed(() => showCopySuccess.value ? '✅' : '📋');

function handleCopyClick() {
    navigator.clipboard.writeText(props.text);
    showCopySuccess.value = true;
    setTimeout(() => {
        showCopySuccess.value = false;
    }, 2000);
}
</script>

<template>
    <JButton @click="handleCopyClick" button-type="primary" title="Copy to Clipboard">
        {{ copyButtonEmoji }}
    </JButton>
</template>