<script setup lang="ts">
import {createError} from "#app/composables/error"

throw createError({
  statusCode: 418,
  message: "I'm a teapot",
  fatal: true,
})
</script>