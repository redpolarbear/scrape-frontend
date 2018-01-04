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
                  <!-- <label class='mr-sm-2' for='sizeSelect'>Size: </label> -->
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
          <!-- <b-button variant="info" to="/wizard">Next Step</b-button> -->
          <b-button variant="info" @click="onNextStep">Next Step</b-button>
        </b-col>
      </b-row>
    </div>

    <!-- <b-row>
      <b-col sm='auto'>
        <drag style='cursor: move;' :transferData='{src: img.src}'>
          <b-img :src='img.src' width='64'></b-img>
        </drag>
      </b-col>
      <b-col sm='auto'>
        ->
      </b-col>
      <b-col sm='auto'>
        <drop @drop='handleDrop'>
          drop here
          <b-img :src='newimg.src' v-if='newimg.src' width='64'></b-img>
        </drop>
      </b-col>
    </b-row> -->
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
      url: ''
      // img: {
      //   src: 'https://si.geilicdn.com/bj-open-801779656-1513981587413-1957917553_396_800.jpg?w=396&h=800'
      // },
      // newimg: {
      //   src: ''
      // }
    }
  },
  computed: {
    ...mapGetters({
      item: 'GET_ITEM'
    })
  },
  methods: {
    // async onSubmit (event) { // production function
    //   event.preventDefault()
    //   this.$store.commit('SET_ITEM', null)
    //   this.$store.dispatch('SCRAPE_ITEM_BY_API', {url: this.url})
    // }
    onNextStep (event) {
      event.preventDefault()
      this.$store.commit('COPY_TO_WEIDIAN_ITEM_STEP_1', { name: this.item.name })
      this.$store.commit('INITIAL_SKU_IN_WEIDIAN_ITEM', { num: this.item.skus.length })
      this.$router.push('/wizard')
    },
    onSubmit (event) {
      event.preventDefault()
      const itemSample = {
        skus: [
          {
            colorImg: 'https://cdn.mec.ca/medias/sys_master/placeholder/placeholder/8912718921758/5043127-LIA01-SWATCH-placeholder.jpg',
            colorName: 'Liam Plaid',
            price: 69,
            sizes: ['XX-Large']
          },
          {
            colorImg: 'https://cdn.mec.ca/medias/sys_master/placeholder/placeholder/8912732291102/5043127-MDB20-SWATCH-placeholder.jpg',
            colorName: 'Midnight Blue Tom Plaid',
            price: 69,
            sizes: ['Small', 'Medium', 'XX-Large']
          },
          {
            colorImg: 'https://cdn.mec.ca/medias/sys_master/placeholder/placeholder/8912735272990/5043127-BK618-SWATCH-placeholder.jpg',
            colorName: 'Black Olive Tom Plaid',
            price: 69,
            sizes: ['Small', 'Medium', 'XX-Large']
          }
        ],
        desc: '<p>From gridlock to off the grid, a plaid shirt remains low-key. This one has a tailored fit to neaten things up a bit.</p><ul><li>Made of soft, comfortable organically grown cottona and recycled polyester.</li><li>Slim fit for a bit of tailored sophistication.</li><li>Chest pockets allow you to bring this and that.</li><li>Length at centre back is 30 inches.</li></ul>',
        imgs: [
          {
            local: '',
            src: 'https://cdn.mec.ca/medias/sys_master/high-res/high-res/8912717217822/5043127-LIA01.jpg',
            wdsrc: ''
          },
          {
            local: '',
            src: 'https://cdn.mec.ca/medias/sys_master/high-res/high-res/8912718331934/5043127-LIA01-ALT-BACK.jpg',
            wdsrc: ''
          },
          {
            local: '',
            src: 'https://cdn.mec.ca/medias/sys_master/high-res/high-res/8912732094494/5043127-MDB20.jpg',
            wdsrc: ''
          },
          {
            local: '',
            src: 'https://cdn.mec.ca/medias/sys_master/high-res/high-res/8912734781470/5043127-BK618.jpg',
            wdsrc: ''
          }
        ],
        name: 'MEC Lodging Shirt - Men\'s'
      }
      this.$store.commit('SET_ITEM', itemSample)
    }
  }
}
</script>

<style>
  #imgs > label > span.custom-control-description {
    width: 100% !important;
  }
</style>
