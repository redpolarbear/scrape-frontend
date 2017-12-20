import Vuex from 'vuex'

const createStore = () => {
  return new Vuex.Store({
    state () {
      return {
        item: null,
        loading: false,
        error: null
      }
    },
    getters: {
      GET_ITEM: (state) => {
        return state.item
      },
      GET_LOADING (state) {
        return state.loading
      },
      GET_ERROR (state) {
        return state.error
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
        // state.item.imgs[payload.index] = { ...state.item.imgs[payload.index] }
        state.item.imgs[payload.index][payload.key] = payload.value
        // const status = state.item.imgs[payload.index]['status'] + '\n\r' + payload.status
        // console.log(status)
        // console.log(state.item.imgs[payload.index]['status'])
        // state.item.imgs.slice(0, payload.index).concat([{ src: state.item.imgs[payload.index]['src'], status: status }]).concat(state.items.imgs.slice(payload.index + 1))
        // // state.item.imgs = [ ...state.items.imgs.slice(0, payload.index), { src: state.item.imgs[payload.index]['src'], status: status }, ...state.items.imgs.slice(payload.index + 1) ]
        // state.item = Object.assign({ ...state.item }, { imgs: {} })
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
        // var status = 'Saving the image to the local...'
        // commit('SET_ITEM_IMG_STATUS', {index: payload.index, status: status})
        const filename = await this.$axios.$get('/saveimage', {
          params: {
            imageUrl: payload.imageUrl
          }
        })
        commit('SET_ITEM_IMG_INFO', {index: payload.index, key: 'local', value: filename})
      }
    }
  })
}

export default createStore
