<template>
  <b-container>
    <form-wizard>
      <tab-content title="Personal details">
        My first tab content
        <b-form-group>
          <template slot="label">
            <b>Choose your flavours:</b><br>
            <b-form-checkbox 
              v-model="allSelected"
              :indeterminate="indeterminate"
              aria-describedby="imgs"
              aria-controls="imgs"
              @change="toggleAll">
              {{ allSelected ? 'Un-select All' : 'Select All' }}
            </b-form-checkbox>
          </template>
          <b-form-checkbox-group 
            id="imgs"
            stacked
            v-model="selected"
            name="imgs"
            class="ml-4"
            aria-label="Images" fluid>
            <b-form-checkbox v-for="(img, index) in item.imgs" :key="index" :value="img">
              <!-- {{ img }} -->
              <div style="display: inline-flex; align-items: center; justify-content: space-around;">
                <b-img :src="img" width="128"></b-img>
                <b-form-textarea id="textarea1"
                  placeholder="Enter something"
                  :rows="3"
                  :max-rows="6" readonly
                  style="resize: none; width: 600px;">
                </b-form-textarea>
              </div>
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
      flavours: ['Orange', 'Grape', 'Apple', 'Lime', 'Very Berry'],
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
    }
  },
  watch: {
    selected (newVal, oldVal) {
      // Handle changes in individual flavour checkboxes
      if (newVal.length === 0) {
        this.indeterminate = false
        this.allSelected = false
      } else if (newVal.length === this.flavours.length) {
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

<style>

</style>
