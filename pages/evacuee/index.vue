<template>
  <v-container>
    <v-card>
      <v-card-title>
        Evacuees
        <v-spacer></v-spacer>

        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on }">
            <v-btn color="wizniche-blue" dark class="mb-2" v-on="on">New Evacuee</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-form v-model="valid">
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.evacuationName"
                      :items="evacuations"
                      :search-input.sync="search"
                      v-on:change='findCapacity'
                      item-text="evacuationName"
                      item-value="evacuationName"
                      label="Evacuation Center Name"
                      :rules="[required('Evacuation Center Name')]"
                    ></v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.firstName"
                      label="First Name"
                      :rules="[required('First Name')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.middleName"
                      label="Middle Name"
                      :rules="[required('Middle Name')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.lastName"
                      label="Last Name"
                      :rules="[required('Last Name')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.contactInfo"
                      label="Evacuee Contact Number"
                      :rules="[required('Evacuee Contact Number')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.age"
                      label="Age"
                      :rules="[required('Age')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.ageautocomplete"
                      :items="items"
                      label="Age Category"
                      :rules="[required('Age Category')]"
                    ></v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.gender"
                      :items="genders"
                      label="Gender"
                      :rules="[required('Gender')]"
                    ></v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-autocomplete
                      v-model="editedItem.disability"
                      :items="disabilities"
                      label="Disability"
                      :rules="[required('Disability')]"
                    ></v-autocomplete>
                  </v-row>
                  <v-row>
                    <v-text-field
                      v-model="editedItem.state"
                      label="City"
                      :rules="[required('City')]"
                    ></v-text-field>
                  </v-row>
                  <v-row>
                      <GmapAutocomplete @place_changed="setPlace" />
                  </v-row>
                  <v-row>
                  <input type="file" accept="image/jpeg" @change="uploadImage">
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
        :items="evacuees"
        :search="search"
        sort-by="name"
        class="elevation-1"
      >
        <template v-slot:top>
          <v-toolbar flat>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="Search Evacuee"
              single-line
              hide-details
            ></v-text-field>
          </v-toolbar>
        </template>
        <template v-slot:[`item.image`]="{ item }">
         <img :src="item.image" width="25" height="25">
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
    items: ['Minor', 'Adult', 'Senior Citizen'],
    genders: ['Male', 'Female'],
    disabilities: ['Have', 'None'],
    value: null,
    valid: false,
    search: '',
    dialog: false,
    headers: [
      {
        text: 'Evacuation Center Name',
        align: 'start',
        sortable: false,
        value: 'evacuationName',
      },
      {
        text: 'First Name',
        align: 'start',
        sortable: false,
        value: 'firstName',
      },
      {
        text: 'Middle Name',
        align: 'start',
        sortable: false,
        value: 'middleName',
      },
      {
        text: 'Last Name',
        align: 'start',
        sortable: false,
        value: 'lastName',
      },
      {
        text: 'Evacuee Contact Number',
        align: 'start',
        sortable: false,
        value: 'contactInfo',
      },
      {
        text: 'Age',
        align: 'start',
        sortable: false,
        value: 'age',
      },
      {
        text: 'Age Category',
        align: 'start',
        sortable: false,
        value: 'ageautocomplete',
      },
      {
        text: 'Gender',
        align: 'start',
        sortable: false,
        value: 'gender',
      },
      {
        text: 'Disability',
        align: 'start',
        sortable: false,
        value: 'disability',
      },
      {
        text: 'City',
        align: 'start',
        sortable: false,
        value: 'state',
      },
      {
        text: 'Street Address',
        align: 'start',
        sortable: false,
        value: 'streetAddress',
      },
      { text: 'Actions', value: 'actions', sortable: false, width: '150' },
    ],
    editedIndex: -1,
    editedItem: {
      evacuationName: '',
      firstName: '',
      lastName: ''
    },
    defaultItem: {
      evacuationName: '',
      firstName: '',
      lastName: ''
    },
    capacity: {
      totalEvacuee: '',
      evacuationCapacity: ''
    },
    ...validations
  }),
  async fetch({ store }) {
    try {
      await store.dispatch('evacuee/loadAllEvacuees');
      await store.dispatch('evacuation/loadAllEvacuations');
    } catch (e) { }
  },
  computed: {
    ...mapState({
      evacuees: state => state.evacuee.evacuees,
      evacuations: state => state.evacuation.evacuations,
      totalEvacuees: state => state.capacity.totalEvacuees,
      evacuationCapacity: state => state.capacity.evacuationCapacity
    }),
    formTitle () {
      return this.editedIndex === -1 ? 'New Evacuee' : 'Edit Evacuee'
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
    async findCapacity () {
      this.capacity.evacuationName = this.editedItem.evacuationName;
      let response = await this.$store.dispatch('capacity/findCapacity', this.capacity);
      this.capacity.evacuationCapacity = this.evacuationCapacity;
    },
    editItem (item) {
      this.editedIndex = this.evacuees.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
      
    },
    async deleteItem (item) {
      try {
        this.capacity.totalEvacuee = ((parseInt(this.totalEvacuees) - 1) < 0) ? 0 : (parseInt(this.totalEvacuees) - 1);
        this.capacity.evacuationName = item.evacuationName;
        if (confirm('Are you sure you want to delete this item?') == true) {
          await this.$store.dispatch('evacuee/delete', item);
          await this.$store.dispatch('capacity/edit', this.capacity);
        }  
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
          await this.$store.dispatch('evacuee/edit', this.editedItem);
        } else {
          this.capacity.totalEvacuee = parseInt(this.totalEvacuees) + 1;
          this.capacity.evacuationName = this.editedItem.evacuationName;
          await this.$store.dispatch('evacuee/create', this.editedItem);
          await this.$store.dispatch('capacity/edit', this.capacity);
        }
      } catch (e) { }
      this.close()
    },
    setPlace(place) {
      this.currentPlace = place;
      this.editedItem.latitude = this.currentPlace.geometry.location.lat();
      this.editedItem.longitude = this.currentPlace.geometry.location.lng();
      this.editedItem.streetAddress = this.currentPlace.formatted_address;
    },
    addMarker() {
      if (this.currentPlace) {
        const marker = {
          lat: this.currentPlace.geometry.location.lat(),
          lng: this.currentPlace.geometry.location.lng(),
        };
        this.markers.push({ position: marker });
        this.center = marker;
        this.currentPlace = null;
      }
    },
    uploadImage(e){
        const image = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(image);
        reader.onload = e =>{
        this.previewImage = e.target.result;
        this.editedItem.image = this.previewImage.replace(/^data:image\/[a-z]+;base64,/, "");
      };
    },
  },
}
</script>
