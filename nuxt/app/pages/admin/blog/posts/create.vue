<template>
  <div class="p-6 max-w-2xl">
    <NuxtLink to="/admin/blog/posts">
      ← Назад до статей
    </NuxtLink>

    <h1 class="text-2xl font-bold my-4">
      Створення статті
    </h1>

    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
      <UFormField label="Заголовок" name="title" required>
        <UInput v-model="state.title" class="w-full" />
      </UFormField>

      <UFormField label="Slug" name="slug">
        <UInput v-model="state.slug" class="w-full" />
      </UFormField>

      <UFormField label="Короткий опис" name="excerpt">
        <UTextarea v-model="state.excerpt" class="w-full" />
      </UFormField>

      <UFormField label="Текст статті" name="content_raw" required>
        <UTextarea v-model="state.content_raw" class="w-full" :rows="6" />
      </UFormField>

      <UFormField label="Category ID" name="category_id" required>
        <UInputNumber v-model="state.category_id" class="w-full" />
      </UFormField>

      <UFormField label="Опубліковано" name="is_published">
        <UCheckbox v-model="state.is_published" label="Опублікувати" />
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

const router = useRouter()

const schema = z.object({
  title: z.string().min(5, 'Мінімум 5 символів').max(200, 'Максимум 200 символів'),
  slug: z.string().max(200, 'Максимум 200 символів').optional().or(z.literal('')),
  excerpt: z.string().max(500, 'Максимум 500 символів').optional().or(z.literal('')),
  content_raw: z.string().min(5, 'Мінімум 5 символів').max(10000, 'Максимум 10000 символів'),
  category_id: z.number().min(1, 'Вкажіть категорію'),
  is_published: z.boolean().optional(),
})

type Schema = z.output<typeof schema>

const state = reactive<Partial<Schema>>({
  title: '',
  slug: '',
  excerpt: '',
  content_raw: '',
  category_id: 1,
  is_published: true,
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
  await $fetch('http://localhost/api/admin/blog/posts', {
    method: 'POST',
    body: {
      ...event.data,
      is_published: event.data.is_published ? 1 : 0,
    },
  })

  await router.push('/admin/blog/posts')
}
</script>
