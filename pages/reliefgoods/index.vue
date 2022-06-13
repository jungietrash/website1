<template>
  <v-container>
    <v-card>
      <v-card-title>
        Relief Goods
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="wizniche-blue" dark class="mb-2" v-on="on">New Relief Goods</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="valid">
                    <v-row>
                    <v-text-field
                      v-model="editedItem.addReliefGoodsDate"
                      label="Relief Goods Date"
                      :rules="[required('Relief Goods Date')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.addReliefGoodsEvacuationName"
                      :items="evacuations"
                      :search-input.sync="search"
                      item-text="evacuationName"
                      item-value="evacuationName"
                      label="Evacuation Center Name"
                      :rules="[required('Evacuation Center Name')]"
                    ></v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.addReliefGoodsFood"
                      label="Relief Goods Food"
                      :rules="[required('Relief Goods Food')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.addReliefGoodsOthers"
                      label="Others"
                      :rules="[required('Others')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.addReliefGoodsSponsor"
                      label="Relief Goods Sponsor"
                      :rules="[required('Relief Goods Sponsor')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.addReliefGoodsWater"
                      label="Relief Goods Water"
                      :rules="[required('Relief Goods Water')]"
                    ></v-text-field>
                  </v-row>
                </v-form>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="save" :disabled="!valid">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>

      </v-card-title>

      <v-data-table
        :headers="headers"
        :items="reliefgood"
        :search="search"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search Relief Goods"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:[`item.actions`]="{ item }">
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </template>
      </v-data-table>
    </v-card>
  </v-container>
</template>

<script>
import validations from "~/utils/validations";
import { mapState } from 'vuex';

export default {
  layout ({ layout }) {
    return layout;
  },
  data: () => ({
    value: null,
    valid: false,
    search: '',
    dialog: false,
    headers: [
      {
        text: 'Relief Goods Date',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsDate',
      },
      {
        text: 'Evacuation Center Name',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsEvacuationName',
      },
      {
        text: 'Relief Goods Food',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsFood',
      },
      {
        text: 'Others',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsOthers',
      },
      {
        text: 'Relief Goods Sponsor',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsSponsor',
      },
      {
        text: 'Relief Goods Water',
        align: 'start',
        sortable: false,
        value: 'addReliefGoodsWater',
      },
      { text: 'Actions', value: 'actions', sortable: false, width: '150' },
    ],
    editedIndex: -1,
    editedItem: {
      addReliefGoodsDate: '',
      addReliefGoodsEvacuationName: '',
      addReliefGoodsFood: '',
      addReliefGoodsOthers: '',
      addReliefGoodsSponsor: '',
      addReliefGoodsWater: ''
    },
    defaultItem: {
      addReliefGoodsDate: '',
      addReliefGoodsEvacuationName: '',
      addReliefGoodsFood: '',
      addReliefGoodsOthers: '',
      addReliefGoodsSponsor: '',
      addReliefGoodsWater: ''
    },
    ...validations
  }),
  async fetch({ store }) {
    try {
      await store.dispatch('reliefgoods/loadAllReliefGoods');
      await store.dispatch('evacuation/loadAllEvacuations');
    } catch (e) { }
  },
  computed: {
    ...mapState({
      reliefgood: state => state.reliefgoods.reliefgood,
      evacuations: state => state.evacuation.evacuations
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Relief Goods' : 'Edit Relief Goods'
    },
  },
  watch: {
    dialog (val) {
      val || this.close()
    },
  },
  created () {
  },
  methods: {
    editItem (item) {
      this.editedIndex = this.reliefgood.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
    async deleteItem (item) {
      try {
        confirm('Are you sure you want to delete this item?') && await this.$store.dispatch('reliefgoods/delete', item);
      } catch (e) { }
    },
    close () {
      this.dialog = false
      setTimeout(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      }, 300)
    },
    async save () {
      try {
        if (this.editedIndex > -1) {
          await this.$store.dispatch('reliefgoods/edit', this.editedItem);
        } else {
          await this.$store.dispatch('reliefgoods/create', this.editedItem);
        }
      } catch (e) { }
      this.close()
    },
  },
}
</script>
