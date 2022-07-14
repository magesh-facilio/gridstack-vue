<template>
  <div class="grid-stack">
    <slot v-if="grid"></slot>
  </div>
</template>

<script>
import 'gridstack/dist/gridstack.min.css';
import { GridStack } from 'gridstack';
import 'gridstack/dist/h5/gridstack-dd-native';
import Vue from 'vue'
export default {
  name: 'App',
  props: {
    column: {
        type: Number,
        default: 12
    },
    rowHeight: {
        type: String,
        default: 'auto'
    },
    maxRows: {
        type: Number,
        default: 0
    },
    minRows: {
        type: Number,
        default: 0
    },
    margin: {
        default: function () {
            return 10;
        }
    },
    resizable: {
        default: function () {
            return {autoHide: true, handles: 'se'}
        }
    },
    layout: {
        type: Array,
        required: true,
    },
    static: {
        type: Boolean,
        default: false
    },
    alwaysShowResizeHandle: {
        type: Boolean,
        default: false
    },
    className: {
        type: String,
        default: ''
    },
    dragHandle: {
        type: String,
        default: '.grid-stack-item-content'
    }
  },
  data() {
    return {
        eventBus: new Vue(),
        grid: null,
        originalLayout: null
    }
  },
  provide() {
    return {
        eventBus: this.eventBus,
        layout: this,
        sublayout: null
    }
  },
  computed: {
    gridOptions() {
        return {
            column: this.column,
            cellHeight: this.rowHeight,
            margin: this.margin,
            maxRow: this.maxRows,
            minRow: this.minRows,
            resizable: this.resizable,
            staticGrid: this.static,
            alwaysShowResizeHandle: this.alwaysShowResizeHandle,
            class: this.className,
            handle: this.dragHandle
        }
    }
  },
  mounted() {   
    this.originalLayout = this.layout

    let gridOptions = Object.assign({acceptWidgets: true}, this.gridOptions)
    this.grid = GridStack.init(gridOptions);
    
    this.grid.on('added', (event, items) => {
        console.log('widget added to parent grid', event)
        items.forEach((item) => {
            this.eventBus.$emit('added', item.id, {
                id: item.id, 
                w: item.w,
                h: item.h,
                x: item.x,
                y: item.y
            })
        })
    })
    this.grid.on('removed', (event, items) => {
        console.log('widget removed from parent grid', event.detail[0].id)
        items.forEach((item) => {
            this.eventBus.$emit('removed', item.id)
        })
    })
    this.grid.on('change', (event, items) => {
        console.log('widget changed from parent grid', this.grid.save(false))
        let changedLayout = this.grid.save(false)
        items.forEach((item) => {
            let cw = changedLayout.find((c) => c.id == item.id)
            if (cw) {
                this.eventBus.$emit('changed', item.id, {
                    id: item.id, 
                    w: cw.w,
                    h: cw.h,
                    x: cw.x,
                    y: cw.y
                })
            }
        });
    })

    this.eventBus.$on('added', (id, layout, parentId) => {
        console.log('add event: ', id, layout, parentId)
        if (parentId != null) {
            let parent = this.originalLayout.find((w) => w.id == parentId)
            if (parent) {
                let ex = parent.children.find((w) => w.id == id)
                console.log('add event ex: ', ex)
                if (!ex) {
                    parent.children.push(layout)
                    this.$emit('update:layout', this.originalLayout)
                }
            }
        }
      else {
        let parent = this.originalLayout.find((w) => w.id == id)
        if (!parent) {
            this.originalLayout.push(layout)
            this.$emit('update:layout', this.originalLayout)
        }
      }
    })
    this.eventBus.$on('removed', (id) => {
        console.log('remove event: ', id)
        let parent = this.originalLayout.find((w) => w.id == id)
        if (parent) {
            let parentIndex = this.originalLayout.indexOf(parent)
            this.originalLayout.splice(parentIndex, 1)
        }
        else {
            this.originalLayout.forEach((w) => {
                if (w.children) {
                    let child = w.children.find((cw) => cw.id == id)
                    if (child) {
                        let childIndex = w.children.indexOf(child)
                        w.children.splice(childIndex, 1)
                    }
                }
            })
        }
        console.log('originalLayout: ', this.originalLayout)
        this.$emit('update:layout', this.originalLayout)
    })
    this.eventBus.$on('changed', (id, layout, parentId) => {
        console.log('change event: ', id, layout, parentId)
        if (parentId) {
            let parent = this.originalLayout.find((w) => w.id == parentId)
            if (parent) {
                let ex = parent.children.find((w) => w.id == id)
                if (ex) {
                    ex.x = layout.x
                    ex.y = layout.y
                    ex.w = layout.w
                    ex.h = layout.h
                }
            }
        }
        else {
            let ex = this.originalLayout.find((w) => w.id == id)
            if (ex) {
                ex.x = layout.x
                ex.y = layout.y
                ex.w = layout.w
                ex.h = layout.h
            }
        }
        this.$emit('update:layout', this.originalLayout)
    })
  },
  methods: {
    save() {
      return this.originalLayout
    },
    getGrid() {
        return this.grid
    },
    removeWidget(id, parentId) {
        this.eventBus.$emit('removed', id, parentId)
    }
  }
}
</script>