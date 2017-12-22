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
    <div v-if="item !== null">
      <b-card >
        <b-row>
          <b-col>
            <h5>{{ item.name }}</h5>
          </b-col>
        </b-row>
        <b-row fluid no-gutters>
          <b-col sm="auto" align-self="center" v-for="(img, index) in item.imgs" :key="index">
            <b-img fluid :src="img.src" style="max-width: 128px; max-height: 128px;"/>
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
      <b-row align-h="center">
        <b-col cols="auto">
          <b-button variant="info" to="/wizard" >Next Step</b-button>
        </b-col>
      </b-row>
    </div>

    <b-row>
      <b-col sm="auto">
        <drag style="cursor: move;" :transferData="{src: img.src}">
          <b-img :src="img.src" width="64"></b-img>
        </drag>
      </b-col>
      <b-col sm="auto">
        ->
      </b-col>
      <b-col sm="auto">
        <drop @drop="handleDrop">
          drop here
          <b-img :src="newimg.src" v-if="newimg.src" width="64"></b-img>
        </drop>
      </b-col>
    </b-row>
    <!-- <pre>
      {{ item }}
    </pre> -->
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'home',
  data () {
    return {
      url: '',
      img: {
        src: 'https://si.geilicdn.com/bj-open-801779656-1513981587413-1957917553_396_800.jpg?w=396&h=800'
      },
      newimg: {
        src: ''
      }
    }
  },
  computed: {
    ...mapGetters({
      item: 'GET_ITEM'
    })
  },
  methods: {
    async onSubmit (event) {
      event.preventDefault()
      this.$store.commit('SET_ITEM', null)
      this.$store.dispatch('SCRAPE_ITEM_BY_API', {url: this.url})
    },
    handleDrop (data, event) {
      this.newimg.src = data.src
    }
  }
}
</script>

<style>
  #imgs > label > span.custom-control-description {
    width: 100% !important;
  }
  .drag,
  .drop {
    font-family: sans-serif;
    display: inline-block;
    border-radius: 10px;
    background: #ccc;
    position: relative;
    padding: 30px;
    text-align: center;
    vertical-align: top;
  }

  .drag-img {
    /* color: #fff; */
    cursor: move;
    background: #777;
    /* border-right: 2px solid #555; */
    /* border-bottom: 2px solid #555; */
  }

  .drop {
    background: #eee;
    border-top: 2px solid #ccc;
    border-left: 2px solid #ccc;
  }

</style>
