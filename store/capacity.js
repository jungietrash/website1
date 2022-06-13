import Vue from 'vue';

export const state = () => ({
  totalEvacuees: 0,
  evacuationCapacity: 0
})

export const mutations = {
  SET(state, capacity) {
    state.evacuationCapacity = capacity.evacuationCapacity;
    state.totalEvacuees = capacity.totalEvacuee;
  }
}
export const actions = {
    async findCapacity({commit, dispatch}, capacity) {
        let response = await this.$axios.get(`https://evacuationapp-fd914-default-rtdb.firebaseio.com/Capacity/${capacity.evacuationName}.json`);
        let newCapacity = response.data;
        commit('SET', newCapacity);
    
      },
  async edit({commit}, capacity) {
    let response = await this.$axios.put(`https://evacuationapp-fd914-default-rtdb.firebaseio.com/Capacity/${capacity.evacuationName}.json`, capacity);
    let newCapacity = response.data;
    commit('SET', newCapacity);
  },
}

export const getters = {
  get: state => id => {
    return state.evacuees.find(i => i.id === id) || {}
  }
}
