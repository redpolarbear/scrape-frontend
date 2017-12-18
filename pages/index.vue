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
    <pre>
      {{ item }}
    </pre>
    <b-card>
      <b-row align-h="between">
        <b-col>{{ item.name }}</b-col>
      </b-row>
      <b-row fluid class="text-center">
        <b-col align-self="center" v-for="(img, index) in item.imgs" :key="index">
          <b-img thumbnail fluid :src="img" style="max-width: 128px; max-height: 128px;"/>
        </b-col>
      </b-row>
      <b-card v-for="(sku, indx) in item.skus" :key="indx">
        <b-media>
          <b-img slot="aside" :src="sku.colorImg" width="64" alt="placeholder" />
          <h5 class="mt-0">{{ sku.colorName }}</h5>
        </b-media>
      </b-card>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="DESCRIPTION" active>
            <div v-html="item.desc"></div>
          </b-tab>
        </b-tabs>
      </b-card>
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
