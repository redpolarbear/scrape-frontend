<template>
  <b-container>
    <form-wizard>
      <tab-content title="Upload Images" :before-change="onGetWeidianAttr">
        <b-form-group>
          <template slot="label">
            <b>Choose the images you'd like to upload:</b><br>
          </template>
          <b-button-toolbar>
            <b-button-group class="mx-1">
              <b-button class="btn-select-all" variant="success">
                <b-form-checkbox
                  v-model="allSelected"
                  :indeterminate="indeterminate"
                  @change="toggleAll">
                  <!-- {{ allSelected ? 'Unselect All' : 'Select All' }} -->
                  ALL
                </b-form-checkbox>
              </b-button>
            </b-button-group>
            <b-button-group class="mx-1">
              <b-btn variant="success" @click.stop="onImagesProcess(selected)" v-bind:disabled="selected.length === 0">Process</b-btn>
            </b-button-group>
          </b-button-toolbar>
          <b-form-checkbox-group id="imgs" stacked v-model="selected" name="imgs" class="ml-4">
            <b-form-checkbox v-for="(img, index) in item.imgs" :key="index" :value="img">
              <b-row align-v="start" align-h="between">
                <b-col cols="4" sm="auto">
                  <b-img :src="img.src" style="max-width: 200px; max-height: 200px;"></b-img>
                </b-col>
                <b-col>
                  <ul>
                    <li>{{ img.src }}</li>
                    <li>{{ img.local }}</li>
                    <li>{{ img.wdsrc }}</li>
                  </ul>
                </b-col>
                <b-col sm="auto">
                  <b-button @click.stop="onImageProcess(img, index)">
                    Process
                  </b-button>
                </b-col>
              </b-row>
            </b-form-checkbox>
          </b-form-checkbox-group>
        </b-form-group>
        <p>
          Selected: <strong>{{ selected }}</strong><br>
          All Selected: <strong>{{ allSelected }}</strong><br>
          Indeterminate: <strong>{{ indeterminate }}</strong><br>
        </p>
      </tab-content>
      <tab-content title="SKU">
        Setup the SKU
        <b-row align-v="end">
          <b-col sm="auto" v-for="(img, index) in item.imgs" :key="index" v-if="img.wdsrc">
            <drag style="cursor: move" :transfer-data="{ img: img.wdsrc }" effectAllowed="copy" dropEffect="copy">
              <b-img thumbnail :src="img.wdsrc" width="96"/>
            </drag>
          </b-col>
        </b-row>
        <hr>
        <b-button v-b-modal.attrListModal>Add Attributes</b-button>
        <b-button-group v-for="attrTitle in attrTitleChecked" :key="attrTitle.attr_title">
          <b-button variant="outline-success" size="sm">{{ attrTitle.attr_title }}</b-button>
          <b-button variant="outline-success" size="sm"><span>&times;</span></b-button>
        </b-button-group>
        <b-modal id="attrListModal" title="Attr Title List" @ok="selectAttrTitle">
          <b-row>
            <b-col sm="auto" v-for="attr in weidian.attr_list" :key="attr.attr_title">
              <b-card>
                <b-media no-body>
                  <b-media-body>
                    <b-form-group>
                      <b-form-checkbox-group v-model="attrTitleChecked">
                        <b-form-checkbox :value="{ attr_title: attr.attr_title }">{{attr.attr_title}}</b-form-checkbox>
                        <b-form-select :select-size="8" multiple v-model="attrValueSelected">
                          <option
                            v-for="attr_value in attr.attr_values"
                            :key="attr_value.attr_id"
                            :value="attr_value"
                            :disabled="true">
                            {{ attr_value.attr_value }}
                          </option>
                          <!-- :disabled="!!attrTitleChecked.attr_title ? attrTitleChecked.attr_title !== attr.attr_title : false"> -->
                        </b-form-select>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-media-body>
                </b-media>
              </b-card>
            </b-col>
          </b-row>
        </b-modal>
        <b-row fluid v-for="(sku, indx) in item.skus" :key="indx">
          <b-col sm="auto">
            <b-card>
              <b-media>
                <b-img v-if="sku.colorImg" slot="aside" :src="sku.colorImg" width="64" height="64" />
                <b-img v-else slot="aside" blank blank-color="#abc" width="64" height="64" />
                <p>Price: {{ sku.price }}</p>
                <p class="mt-0">Color: {{ sku.colorName }}</p>
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
          <b-col sm="auto">
            =>
          </b-col>
          <b-col sm="auto">
            <b-card>
              <b-media>
                <drop v-if="weidian.sku[indx].img === ''" slot="aside" style="padding: 30px; border: 1px solid black;" @drop="handleImageDrop(indx, ...arguments)">+</drop>
                <b-img v-else slot="aside" :src="weidian.sku[indx].img" width="96" style="height: 100%;"/>
                <b-row v-for="list in weidian.item.attr_list" :key="list.attr_title">
                  <b-button-group>
                    <b-button variant="outline-info" size="sm">{{ list.attr_title}}</b-button>
                    <b-button variant="outline-info" size="sm" @click="addAttrValues(indx, list.attr_title)">+</b-button>
                  </b-button-group>
                </b-row>
              </b-media>
            </b-card>
          </b-col>
        </b-row>
        <b-modal ref="attrValueModal" title="Attribution Values">
          <b-row>
            <b-col sm="auto" v-for="attr in selectedAttrList" :key="attr.attr_title">
              <b-card>
                <b-media no-body>
                  <b-media-body>
                    <b-form-group>
                      <b-form-checkbox-group v-model="attrTitleChecked">
                        <b-form-checkbox :value="{ attr_title: attr.attr_title }">{{attr.attr_title}}</b-form-checkbox>
                        <b-form-select :select-size="8" multiple v-model="attrValueSelected">
                          <option
                            v-for="attr_value in attr.attr_values"
                            :key="attr_value.attr_id"
                            :value="attr_value"
                            :disabled="false">
                            {{ attr_value.attr_value }}
                          </option>
                          <!-- :disabled="!!attrTitleChecked.attr_title ? attrTitleChecked.attr_title !== attr.attr_title : false"> -->
                        </b-form-select>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-media-body>
                </b-media>
              </b-card>
            </b-col>
          </b-row>
        </b-modal>
        <!-- <b-modal id="attrValueModal" title="Attribution Values">
          <b-row>
            <b-col>
              <b-card>
                <b-media no-body>
                  <b-media-body>
                    <b-form-group>
                      <b-form-checkbox-group v-model="attrTitleChecked">
                        <b-form-checkbox :value="{ attr_title: attr.attr_title }">{{attr.attr_title}}</b-form-checkbox>
                        <b-form-select :select-size="8" multiple v-model="attrValueSelected">
                          <option
                            v-for="attr_value in attr.attr_values"
                            :key="attr_value.attr_id"
                            :value="attr_value"
                            :disabled="true">
                            {{ attr_value.attr_value }}
                          </option>
                          <!-- :disabled="!!attrTitleChecked.attr_title ? attrTitleChecked.attr_title !== attr.attr_title : false"> -->
                        <!-- </b-form-select>
                      </b-form-checkbox-group>
                    </b-form-group>
                  </b-media-body>
                </b-media>
              </b-card>
            </b-col>
          </b-row>
        </b-modal> --> -->
      </tab-content>
      <tab-content title="Last step">
        Yuhuuu! This seems pretty damn simple
      </tab-content>
    </form-wizard>
  </b-container>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'wizard',
  data () {
    return {
      selected: [],
      allSelected: false,
      indeterminate: false,
      attrTitleChecked: [],
      attrValueSelected: [],
      seletedAttrTitle: ''
    }
  },
  computed: {
    ...mapGetters({
      item: 'GET_ITEM',
      weidian: 'GET_WEIDIAN',
      weidianItem: 'GET_WEIDIAN_ITEM',
      weidianSku: 'GET_WEIDIAN_SKU',
      weidianAttrList: 'GET_WEIDIAN_ATTR_LIST'
    }),
    selectedAttrList () {
      return this.$store.getters.GET_WEIDIAN_ATTR_LIST_BY_TITLE(this.seletedAttrTitle)
    }
  },
  methods: {
    toggleAll (checked) {
      this.selected = checked ? this.item.imgs.slice() : []
    },
    async onImageProcess (image, index) {
      const payload = {
        index,
        imageUrl: image.src
      }
      await this.$store.dispatch('SAVE_IMAGES_TO_LOCAL', payload)
    },
    async onImagesProcess (images) {
      for (let i = 0; i < images.length; ++i) {
        let index = this.item.imgs.findIndex(e => e === images[i])
        await this.onImageProcess(images[i], index)
      }
    },
    handleImageDrop (index, data, event) {
      this.$store.commit('SET_WEIDIAN_SKU_IMAGE', { index, img: data.img })
    },
    async onGetWeidianAttr () {
      await this.$store.dispatch('WEIDIAN_GET_ATTRIBUTE')
      return true
    },
    selectAttrTitle () {
      console.log(this.attrTitleChecked.length)
      if (this.attrTitleChecked.length > 0) {
        this.$store.commit('SELECT_WEIDIAN_ITEM_ATTR_LIST', this.attrTitleChecked)
      } else if (this.attrTitleChecked.length === 0) {
        this.$store.commit('REMOVE_WEIDIAN_ITEM_ATTR_LIST')
      }
    },
    addAttrValues (index, title) {
      console.log(index)
      console.log(title)
      this.seletedAttrTitle = title
      console.log(this.selectedAttrList)
      // const attrList = this.$store.getters.GET_WEIDIAN_ATTR_LIST_BY_TITLE(title)
      // console.log(attrList[0].attr_values)
      this.$refs.attrValueModal.show()
    }
  },
  watch: {
    selected (newVal, oldVal) {
      if (newVal.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newVal.length === this.item.imgs.length) {
        this.indeterminate = false
        this.allSelected = true
      } else {
        this.indeterminate = true
        this.allSelected = false
      }
    }
  }
}
</script>

<style scoped>
  .log-area {
    resize: none;
    width: 420px;
  }
  .btn-select-all > label {
    margin-right: 0;
    margin-bottom: 0;
  }
</style>
