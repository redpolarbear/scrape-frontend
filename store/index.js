import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state () {
      return {
        item: null,
        loading: false,
        error: null,
        weidian: {
          item: {
            price: '', // price
            stock: '', // stock
            itemName: '', // product name
            bigImgs: [], // Array[string], weidian https
            titles: [], // Array[string], desc for the images
            cate_id: '', // category id, separate by comma
            free_delivery: '', // delivery cost: 0 - cost, 1 - free
            remote_free_delivery: '' // remote delivery cost: 0 - free, 1 - cost
          },
          sku: [],
          attr_list: []
        }
      }
    },
    getters: {
      GET_ITEM: (state) => {
        return state.item
      },
      GET_LOADING: (state) => {
        return state.loading
      },
      GET_ERROR: (state) => {
        return state.error
      },
      GET_WEIDIAN: (state) => {
        return state.weidian
      },
      GET_WEIDIAN_ITEM: (state) => {
        return state.weidian.item
      },
      GET_WEIDIAN_ATTR_LIST: (state) => {
        return state.weidian.attr_list
      },
      GET_WEIDIAN_SKU: (state) => {
        return state.weidian.sku
      }
    },
    mutations: {
      SET_ITEM (state, payload) {
        state.item = payload
      },
      SET_LOADING (state, payload) {
        state.loading = payload
      },
      SET_ERROR (state, payload) {
        state.error = payload
      },
      SET_ITEM_IMG_INFO (state, payload) {
        state.item.imgs[payload.index][payload.key] = payload.value
      },
      COPY_TO_WEIDIAN_ITEM_STEP_1 (state, payload) {
        state.weidian.item.itemName = payload.name
      },
      INITIAL_SKU_IN_WEIDIAN_ITEM (state, payload) {
        state.weidian.sku = []
        for (let i = 0; i < payload.num; i++) {
          const sku = {
            title: '',
            stock: 1,
            price: '',
            sku_merchant_code: '',
            attr_ids: [],
            img: ''
          }
          state.weidian.sku.push(sku)
        }
      },
      SET_WEIDIAN_ITEM_ATTR_LIST (state, payload) {
        state.weidian.attr_list = payload.attr_list
      },
      SET_WEIDIAN_SKU_IMAGE (state, payload) {
        state.weidian.sku[payload.index].img = payload.img
      }
    },
    actions: {
      async SCRAPE_ITEM_BY_API ({commit}, payload) {
        commit('SET_LOADING', true)
        this.$axios.setHeader('Content-Type', 'application/x-www-form-urlencoded', ['post'])
        try {
          const item = await this.$axios.$post('/scrape', {
            url: payload.url
          })
          commit('SET_ITEM', item)
          commit('SET_LOADING', false)
        } catch (error) {
          let errorMessage = error.errorMessage
          commit('SET_LOADING', false)
          commit('SET_ERROR', errorMessage)
          console.log(errorMessage)
        }
      },
      async SAVE_IMAGES_TO_LOCAL ({commit}, payload) {
        try {
          const filename = await this.$axios.$get('/saveimage', {
            params: {
              imageUrl: payload.imageUrl
            }
          })
          commit('SET_ITEM_IMG_INFO', {index: payload.index, key: 'local', value: filename})
          const wdsrc = await this.$axios.$get('/uploadimage', {
            params: {
              filename
            }
          })
          commit('SET_ITEM_IMG_INFO', {index: payload.index, key: 'wdsrc', value: wdsrc})
        } catch (error) {
          console.log(error)
        }
      },
      async WEIDIAN_GET_ATTRIBUTE ({commit}, payload) {
        try {
          const attrList = await this.$axios.$get('/getattr')
          commit('SET_WEIDIAN_ITEM_ATTR_LIST', { attr_list: attrList.data.attr_list })
        } catch (error) {
          console.log(error)
        }
      }
    }
  })
}

export default createStore
