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
    <b-card>
      <b-row>
        <b-col>
          <h5>{{ item.name }}</h5>
        </b-col>
      </b-row>
      <b-row fluid no-gutters>
        <b-col align-self="center" v-for="(img, index) in item.imgs" :key="index">
          <b-img fluid :src="img" style="max-width: 128px; max-height: 128px;"/>
        </b-col>
      </b-row>
      <b-row fluid>
        <b-col cols="4" v-for="(sku, indx) in item.skus" :key="indx">
          <b-card>
            <b-media>
              <b-img v-if="sku.colorImg" slot="aside" :src="sku.colorImg" width="64" height="64" />
              <b-img v-else slot="aside" blank blank-color="#abc" width="64" height="64" />
              <p class="mt-0">Color: {{ sku.colorName }}</p>
              <p>Price: {{ sku.price }}</p>
              <b-form-group id="sizeSelectGroup" label="Size:" label-for="sizeSelect">
                <!-- <label class="mr-sm-2" for="sizeSelect">Size: </label> -->
                <b-form-select id="sizeSelect" v-if="sku.sizes" :select-size="4">
                  <option v-for="size in sku.sizes" :key="size" :value="size">{{ size }}</option>
                </b-form-select>
                <b-form-select id="sizeSelect" v-else>
                  <option value="One Size">One Size</option>
                </b-form-select>
              </b-form-group>
            </b-media>
          </b-card>
        </b-col>
      </b-row>
      <b-card no-body>
        <b-tabs card>
          <b-tab title="DESCRIPTION" active>
            <div v-html="item.desc"></div>
          </b-tab>
        </b-tabs>
      </b-card>
    </b-card>
    <!-- <pre>
      {{ item }}
    </pre> -->
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
