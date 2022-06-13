import Vue from 'vue';

export const state = () => ({
  reliefgood: []
})

export const mutations = {
  SET(state, reliefgood) {
    const data=[];
    for(const key in reliefgood.data){
      data.push({...reliefgood.data[key],id:key})
    }
    state.reliefgood = data;
  },
  ADD(state, reliefgoods) {
    state.reliefgood = state.reliefgood.concat(reliefgoods);
  },
  DELETE(state, reliefgoodsID) {
    state.reliefgood = state.reliefgood.filter(i => i.id !== reliefgoodsID);
  },
  EDIT(state, newReliefGoods) {
    let iIndex = state.reliefgood.findIndex(i => i.id === newReliefGoods.id);
    Vue.set(state.reliefgood, iIndex, newEvacuee);
  }
}

export const actions = {
  async loadAllReliefGoods({commit, dispatch}, params) {
    let response = await this.$axios.get('https://evacuationapp-fd914-default-rtdb.firebaseio.com/reliefgoods.json', params);
    commit('SET', response);

  },
  async create({commit}, reliefgoods) {
    let response = await this.$axios.post('https://evacuationapp-fd914-default-rtdb.firebaseio.com/reliefgoods.json', reliefgoods);
    commit('ADD', {...reliefgoods,id:response.data.name});
  },
  async delete({commit}, reliefgoods) {
    let response = await this.$axios.delete(`https://evacuationapp-fd914-default-rtdb.firebaseio.com/reliefgoods/${reliefgoods.id}.json`);
    if (response && _.includes([200, 204], response.status)) {
      commit('DELETE', reliefgoods.id);
    }
  },
  async edit({commit}, reliefgoods) {
    let response = await this.$axios.put(`https://evacuationapp-fd914-default-rtdb.firebaseio.com/reliefgoods/${reliefgoods.id}.json`, reliefgoods);
    let newReliefGoods = response.data;
    commit('EDIT', newReliefGoods);
  },
}

export const getters = {
  get: state => id => {
    return state.reliefgood.find(i => i.id === id) || {}
  }
}
