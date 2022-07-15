<template>
  <div id="app">
    <button @click="addWidget">Add Widget</button>
    <button @click="addSection">Add Section</button>
    <button @click="resizeWidget">Resize</button>
    <button @click="saveWidget">Save</button>
    <GridStack ref="gridstack" dragHandle=".widget-header" :layout.sync="layout">
      <GridStackItem  v-for="widget in layout" :key="widget.id" :id="widget.id" :w="widget.w" :h="widget.h" :x="widget.x" :y="widget.y">
      <SampleWidget v-if="widget.children" @remove="removeWidget(widget.id)">
        <GridStackSection :id="widget.id" :section="widget">
          <GridStackItem v-for="child in widget.children" :key="child.id" :id="child.id" :parentId="widget.id" :w="child.w" :h="child.h" :x="child.x" :y="child.y">
            <div>
              <SampleWidget @remove="removeWidget(child.id, widget.id)">Content</SampleWidget>
            </div>
          </GridStackItem>
        </GridStackSection>
        </SampleWidget>
        <div v-else>
          <SampleWidget @remove="removeWidget(widget.id)">Content</SampleWidget>
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
import SampleWidget from "./SampleWidget.vue"
export default {
  name: 'App',
  components: {GridStack, GridStackItem, GridStackSection, SampleWidget},
  data() {
    return {
      data: 'A',
      layout: [ { "id": "1657767164721", "x": 0, "y": 2, "w": 12, "h": 2, "data": {sample: 1}, "children": [ { "id": "1657767185305", "w": 1, "h": 2, "x": 2, "y": 3, "data": {sample: 2} }, { "id": "1657788343941", "w": 7, "h": 1, "x": 5, "y": 0, "data": {sample: 3} } ] }, { "id": "1657788332370", "x": 0, "y": 0, "w": 12, "h": 2, "data": {sample: 4}, "children": [ { "id": "1657767175263", "w": 1, "h": 1, "x": 2, "y": 0, "data": {sample: 5} }, { "id": "1657788338182", "w": 1, "h": 1, "x": 6, "y": 0, "data": {sample: 6} } ] }, { "id": "1657767179851", "x": 2, "y": 4, "w": 1, "h": 1, "data": {sample: 7} }, { "id": "1657767170573", "w": 4, "h": 3, "x": 4, "y": 4, "data": {sample: 8} } ],
      layout1: [
        {id: '1657767179851', x: 2, y: 4, w: 24, h: 1},
        {id: '1657767185305', x: 3, y: 4, w: 12, h: 2}
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
    removeWidget(id, parentId) {
      this.$refs.gridstack.removeWidget(id, parentId)
    },
    resizeWidget() {
      this.layout[0].children[0].h = 1
    }
  }
}
</script>

<style>
.grid-stack-item-content {
  background: black;
  color: white;
  border: 1px solid cornflowerblue;
}
.widget-header {
    height: 25px;
    background: cornflowerblue;
    color: black;
    cursor: move;
}
.widget-content {
  height: calc(100% - 25px);
}
</style>
