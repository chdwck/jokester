<script lang="ts" setup>
import { ref, watch, type Ref, onMounted } from 'vue';

const props = defineProps({
  url: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
})
const emit = defineEmits(['error']);

const placeholder: Ref<HTMLElement | null> = ref(null)

function loadImage(src: string) {
  if (placeholder?.value?.firstChild) {
    placeholder.value.removeChild(placeholder.value.firstChild);
  }
  const image = new Image(512, 512);
  image.src = src;
  image.alt = props.alt;
  image.onerror = () => emit('error')
  placeholder.value?.appendChild(image);
}

watch(() => props.url, (_url: string) => loadImage(_url));
onMounted(() => {
  loadImage(props.url);
});

</script>

<template>
  <figure>
    <div ref="placeholder" />
    <figcaption class="text-center">Image Generated with <a class="underline"
        href="https://platform.openai.com/docs/api-reference/images">Dall•E</a></figcaption>
  </figure>
</template>
