<template>
    <span v-bind="$attrs" :style="computedStyle">
        <slot />
    </span>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";

export default defineComponent({
   name: 'HVisuallyHidden',
   props: {
       style: {
           type: [String, Object, Array]
       }
   },

   setup(props) {
       const computedStyle = computed(() => {
           return [
               props.style,
               {
                   position: 'absolute',
                   border: 0,
                   width: 1,
                   height: 1,
                   padding: 0,
                   margin: -1,
                   overflow: 'hidden',
                   clip: 'rect(0, 0, 0, 0)',
                   whiteSpace: 'nowrap',
                   wordWrap: 'normal'
               }
           ] as any
       });

       return { computedStyle };
   } 
});
</script>