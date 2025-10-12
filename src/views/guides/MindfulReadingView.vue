<template>
  <div class="guide-container">
    <MainHeader />

    <main class="content py-3 py-sm-4 py-md-5 px-2 px-sm-3 px-md-4">
      <div class="container-fluid px-3">
        <div class="row justify-content-center">
          <div class="col-12 col-lg-10 col-xl-9">
            <div class="content-wrapper p-3 p-md-5">
              <!-- Header -->
              <div class="page-header text-center">
                <div class="header-icon mb-3">📖</div>
                <h1 class="page-title">Mindful Reading</h1>
                <p class="page-subtitle">
                  Discover peace and clarity through conscious reading practice
                </p>
              </div>

              <!-- Benefits Section -->
              <section class="benefits-section mb-5">
                <h2 class="section-title">Benefits of Mindful Reading</h2>
                <p class="section-description">
                  Mindful reading is more than just consuming words on a
                  page—it's a practice of being fully present with your reading
                  material. This intentional approach to reading can reduce
                  stress, improve focus and comprehension, enhance emotional
                  intelligence, and provide a peaceful escape from daily
                  pressures. By engaging deeply with books, you create a
                  meditative experience that calms the mind and nourishes the
                  soul.
                </p>
              </section>

              <!-- Book Recommendations Section -->
              <section class="books-section">
                <h2 class="section-title">
                  Recommended Books for Mindful Reading
                </h2>
                <p class="section-description mb-4">
                  Below is a curated collection of books perfect for mindful
                  reading practice. Each book has been selected for its ability
                  to engage, inspire, and provide meaningful reflection. Use the
                  search bar to find specific titles, authors, or genres, and
                  click on column headers to sort.
                </p>

                <!-- PrimeVue DataTable -->
                <DataTable
                  :value="books"
                  v-model:filters="filters"
                  filterDisplay="row"
                  :globalFilterFields="[
                    'title',
                    'author',
                    'genre',
                    'type',
                    'recommendedAge',
                  ]"
                  sortMode="multiple"
                  removableSort
                  tableStyle="min-width: 50rem"
                  class="books-table"
                  stripedRows
                  scrollable
                  scrollHeight="600px"
                >
                  <template #header>
                    <div class="table-header">
                      <InputText
                        v-model="filters['global'].value"
                        placeholder="Search books..."
                        class="search-input"
                      />
                    </div>
                  </template>

                  <Column
                    field="title"
                    header="Title"
                    sortable
                    style="min-width: 12rem"
                  >
                    <template #body="{ data }">
                      <strong>{{ data.title }}</strong>
                    </template>
                  </Column>

                  <Column
                    field="author"
                    header="Author"
                    sortable
                    style="min-width: 10rem"
                  ></Column>

                  <Column
                    field="genre"
                    header="Genre"
                    sortable
                    style="min-width: 10rem"
                  >
                    <template #body="{ data }">
                      <span class="genre-badge">{{ data.genre }}</span>
                    </template>
                  </Column>

                  <Column
                    field="type"
                    header="Type"
                    sortable
                    style="min-width: 8rem"
                  >
                    <template #body="{ data }">
                      <span
                        :class="[
                          'type-badge',
                          data.type === 'Fiction' ? 'fiction' : 'non-fiction',
                        ]"
                      >
                        {{ data.type }}
                      </span>
                    </template>
                  </Column>

                  <Column
                    field="recommendedAge"
                    header="Age"
                    sortable
                    style="min-width: 6rem"
                  ></Column>

                  <Column
                    field="published"
                    header="Published"
                    sortable
                    style="min-width: 8rem"
                  ></Column>

                  <template #empty>
                    <div class="no-results">
                      No books found. Try adjusting your search.
                    </div>
                  </template>
                </DataTable>
              </section>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import InputText from "primevue/inputtext";
import MainHeader from "../../components/MainHeader.vue";
import booksData from "../../json/MindfulBooks.json";

const router = useRouter();
const books = ref([]);

// Initialize filters
const filters = ref({
  global: { value: null, matchMode: "contains" },
});

onMounted(() => {
  books.value = booksData;
});
</script>

<style scoped>
.guide-container {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.content-wrapper {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
}

.page-header {
  margin-bottom: 3rem;
  padding-bottom: 2rem;
  border-bottom: 2px solid #e9ecef;
}

.header-icon {
  font-size: 4rem;
}

.page-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: #212529;
  margin-bottom: 1rem;
}

.page-subtitle {
  font-size: 1.2rem;
  color: #6c757d;
}

.section-title {
  font-size: 1.8rem;
  font-weight: 600;
  color: #212529;
  margin-bottom: 1rem;
}

.section-description {
  font-size: 1.1rem;
  line-height: 1.8;
  color: #495057;
}

.search-input {
  max-width: 400px;
  padding: 0.75rem 1rem;
  border: 2px solid #dee2e6;
  border-radius: 25px;
  transition: border-color 0.3s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.genre-badge,
.type-badge {
  display: inline-block;
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 500;
}

.genre-badge {
  background-color: #e3f0fd;
  color: #007bff;
}

.type-badge.fiction {
  background-color: #fff3cd;
  color: #856404;
}

.type-badge.non-fiction {
  background-color: #d4edda;
  color: #155724;
}

.no-results {
  text-align: center;
  padding: 3rem;
  color: #6c757d;
}
</style>

<style>
.books-table .p-datatable-header {
  background: transparent;
  border: none;
  padding: 0;
}

.books-table .p-datatable-thead > tr > th {
  background: #007bff;
  color: white;
  font-weight: 600;
  padding: 1rem;
  border: none;
}

.books-table .p-datatable-tbody > tr {
  transition: background-color 0.2s;
}

.books-table .p-datatable-tbody > tr:hover,
.books-table .p-sortable-column:hover {
  background: #0056b3 !important;
}

.books-table .p-datatable-tbody > tr:hover,
.books-table .p-datatable-tbody > tr:hover > td {
  color: white;
}

.books-table .p-datatable-tbody > tr:hover .genre-badge,
.books-table .p-datatable-tbody > tr:hover .type-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.books-table .p-datatable-tbody > tr > td {
  padding: 1rem;
  border-bottom: 1px solid #e9ecef;
}

.books-table .p-datatable-wrapper {
  border-radius: 8px;
  overflow: hidden;
}

.books-table .p-datatable-footer {
  display: none;
}

.books-table .p-sortable-column-icon {
  color: rgba(255, 255, 255, 0.7);
}

.books-table .p-sortable-column:hover .p-sortable-column-icon {
  color: rgba(255, 255, 255, 0.9);
}
</style>
