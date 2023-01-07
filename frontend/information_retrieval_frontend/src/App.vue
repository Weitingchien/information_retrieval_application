<template>
  <v-app :theme="theme">
    <v-app-bar>
      <v-spacer></v-spacer>

      <v-btn
        :prepend-icon="
          theme === 'light' ? 'mdi-weather-sunny' : 'mdi-weather-night'
        "
        @click="onClick"
        >Toggle Theme</v-btn
      >
    </v-app-bar>

    <v-main>
      <v-container>
        <v-combobox
          v-model="select"
          label="Combobox"
          :items="filterMovieList"
          placeholder="Search"
        ></v-combobox>
        <v-row>
          <v-col
            v-for="(item, index) in movieList[0]"
            :key="item._source.index"
            cols="12"
            sm="4"
          >
            <v-card
              target="_blank"
              :href="item._source.link"
              class="mx-auto"
              max-width="344"
            >
              <v-card-text>
                <p class="text-h4 text--primary">{{ item._source.title }}</p>
                <div class="text--primary">
                  {{ item._source.time }}
                  <br />
                </div>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
import { reactive, ref, watch } from 'vue';
import axios from 'axios';

const theme = ref('light');
const movieListTemp = reactive([]);
const movieList = reactive([]);
const select = ref('');
const filterMovieList = reactive([]);

watch(select, (val, oldVal) => {
  movieList[0] = movieListTemp[0];
  const find = movieListTemp[0].find(item => {
    if (item._source.title === val) {
      return item;
    }
  });
  if (!find) return;
  if (val === find._source.title) {
    movieList[0] = movieList[0].filter(item => {
      if (val === item._source.title) {
        return item;
      }
    });
  } else {
    movieList[0] = movieListTemp[0];
  }
});

const onClick = () => {
  theme.value = theme.value === 'light' ? 'dark' : 'light';
};

const movies = async () => {
  try {
    const data = await axios.get('http://localhost:5000/api/search/all');
    console.log(data);
    movieList.push(data.data.hits.hits);
    movieListTemp.push(data.data.hits.hits);
    data.data.hits.hits.forEach(item => {
      filterMovieList.push(item._source.title);
    });
  } catch (err) {
    console.log(err);
  }
};

movies();
</script>

<style scoped>
.logo {
  height: 6em;
  padding: 1.5em;
  will-change: filter;
}
.logo:hover {
  filter: drop-shadow(0 0 2em #646cffaa);
}
.logo.vue:hover {
  filter: drop-shadow(0 0 2em #42b883aa);
}
</style>
