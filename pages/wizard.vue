<template>
  <b-container>
    <form-wizard>
      <tab-content title="Upload Images">
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
      <tab-content title="Additional Info">
          My second tab content
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
      indeterminate: false
    }
  },
  computed: {
    ...mapGetters({
      item: 'GET_ITEM'
    })
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
