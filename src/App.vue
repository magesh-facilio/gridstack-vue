<template>
  <div id="app">
    <button @click="addWidget">Add Widget</button>
    <button @click="addSection">Add Section</button>
    <button @click="saveWidget">Save</button>
    <GridStack ref="gridstack" :layout.sync="layout">
      <GridStackItem  v-for="(widget, i) in layout" :key="widget.id" :index="i" :id="widget.id" :w="widget.w" :h="widget.h" :x="widget.x" :y="widget.y">
        <GridStackSection :id="widget.id" :section="widget" v-if="widget.children">
          <GridStackItem v-for="(child, j) in widget.children" :key="child.id" :sub="true" :index="j" :id="child.id" :parentId="widget.id" :w="child.w" :h="child.h" :x="child.x" :y="child.y">
            <div>
              {{child.id}} <button @click="removeWidgetEntry(child.id, widget.id)">Remove</button>
            </div>
          </GridStackItem>
          {{widget.id}} <button @click="removeWidgetEntry(widget.id)">Remove</button>
        </GridStackSection>
        <div v-else>
          {{widget.id}} <button @click="removeWidgetEntry(widget.id)">Remove</button>
        </div>
      </GridStackItem>
    </GridStack>
    {{layout}}
  </div>
</template>
<script>
import GridStack from "./components/GridStack.vue"
import GridStackItem from "./components/GridStackItem.vue"
import GridStackSection from "./components/GridStackSection.vue"
export default {
  name: 'App',
  components: {GridStack, GridStackItem, GridStackSection},
  data() {
    return {
      data: 'A',
      layout: [ { "id": "1657767164721", "x": 0, "y": 2, "w": 12, "h": 2, "children": [ { "id": "1657767185305", "w": 1, "h": 2, "x": 2, "y": 3 }, { "id": "1657788343941", "w": 7, "h": 1, "x": 5, "y": 0 } ] }, { "id": "1657788332370", "x": 0, "y": 0, "w": 12, "h": 2, "children": [ { "id": "1657767175263", "w": 1, "h": 1, "x": 2, "y": 0 }, { "id": "1657788338182", "w": 1, "h": 1, "x": 6, "y": 0 } ] }, { "id": "1657767179851", "x": 2, "y": 4, "w": 1, "h": 1 }, { "id": "1657767170573", "w": 4, "h": 3, "x": 4, "y": 4 } ],
      layout1: [
        {id: '1657767164721', x: 0, y: 0, w: 12, h: 2, children: [
          {id: '1657767170573', x: 0, y: 0, w: 1, h: 1,},
          {id: '1657767175263', x: 1, y: 1, w: 1, h: 1,}
        ]},
        {id: '1657788332370', x: 0, y: 0, w: 12, h: 2, children: [
          {id: '1657788338182', x: 0, y: 0, w: 1, h: 1,},
          {id: '1657788343941', x: 1, y: 1, w: 1, h: 1,}
        ]},
        {id: '1657767179851', x: 2, y: 4, w: 1, h: 1},
        {id: '1657767185305', x: 3, y: 4, w: 1, h: 2}
      ]
    }
  },
  mounted() {
    let count = 0
    setInterval(() => {
      this.data += count
      count++
    }, 1000)
  },
  methods: {
    addWidget() {
      this.layout.push({id: Date.now() + '', x: 2, y: 1, w: 1, h: 1})
    },
    addSection() {
      this.layout.push({id: Date.now() + '', x: 2, y: 1, w: 12, h: 1, children: []})
    },
    saveWidget() {
      console.log(this.layout)
    },
    removeWidgetEntry(id, parentId) {
      this.$refs.gridstack.removeWidget(id, parentId)
    }
  }
}
</script>

<style>
.grid-stack-item {
  background: black;
  color: white;
  border: 1px solid white;
}
</style>
