<template>
  <b-container>
    <b-form @submit="onSubmit" novalidate>
      <b-form-group
        id="scrapeInputGroup"
        description="Please copy/paste the url you'd like to scrape.">
        <b-form-input
          id="url-input"
          type="url"
          v-model="url"
          required
          placeholder="Enter url">
        </b-form-input>
      </b-form-group>
      <b-row class="justify-content-center">
        <b-button type="submit" variant="primary">Submit</b-button>
      </b-row>
    </b-form>
    <!-- <code>
      {{ item }}
    </code> -->
    <b-card>
      <b-row align-h="between">
        <b-col>{{ item.name }}</b-col>
      </b-row>
      <b-row class="text-center">
        <b-col align-self="center" v-for="(img, index) in item.imgs" :key="index">
          <b-img thumbnail :src="img" style="max-height:122px;"/>
        </b-col>
      </b-row>
      <div v-html="item.desc"></div>
    </b-card>

  </b-container>
</template>

<script>
export default {
  name: 'home',
  data () {
    return {
      url: '',
      item: {}
    }
  },
  methods: {
    async onSubmit (event) {
      event.preventDefault()
      this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', ['post'])
      this.item = await this.$axios.$post('/scrape', {
        url: this.url
      })
    }
  }
}
</script>

<style>

</style>
