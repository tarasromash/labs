<template>
  <div class="p-6 max-w-xl">
    <NuxtLink to="/admin/blog/categories">
      ← Назад до категорій
    </NuxtLink>

    <h1 class="text-2xl font-bold my-4">
      Редагування категорії
    </h1>

    <div v-if="loading">
      Завантаження...
    </div>

    <UForm v-else :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Назва" name="title" required>
        <UInput v-model="state.title" class="w-full" />
      </UFormField>

      <UFormField label="Slug" name="slug">
        <UInput v-model="state.slug" class="w-full" />
      </UFormField>

      <UFormField label="Опис" name="description">
        <UTextarea v-model="state.description" class="w-full" />
      </UFormField>

      <UFormField label="Parent ID" name="parent_id" required>
        <UInputNumber v-model="state.parent_id" class="w-full" />
      </UFormField>

      <UButton type="submit">
        Зберегти
      </UButton>
    </UForm>
  </div>
</template>

<script setup lang="ts">
import * as z from 'zod'
import type { FormSubmitEvent } from '@nuxt/ui'

const route = useRoute()
const router = useRouter()

const loading = ref(true)

const schema = z.object({
  title: z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  slug: z.string().max(200, 'Максимум 200 символів').optional().or(z.literal('')),
  description: z.string().min(3, 'Мінімум 3 символи').max(500, 'Максимум 500 символів').optional().or(z.literal('')),
  parent_id: z.number().min(1, 'Вкажіть parent_id'),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  slug: '',
  description: '',
  parent_id: 1,
})

const getCategory = async () => {
  const response: any = await $fetch(`http://localhost/api/admin/blog/categories/${route.params.id}`)
  const category = response.data

  state.title = category.title
  state.slug = category.slug ?? ''
  state.description = category.description ?? ''
  state.parent_id = category.parent_id ?? 1

  loading.value = false
}

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch(`http://localhost/api/admin/blog/categories/${route.params.id}`, {
    method: 'PUT',
    body: event.data,
  })

  await router.push('/admin/blog/categories')
}

getCategory()
</script>
