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
import { findIndex } from "../utils/helper"
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
    disableOneColumnMode: {
        type: Boolean,
        default: true
    }
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

    let gridOptions = Object.assign(this.gridOptions, {acceptWidgets: true})
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
        console.log('add event: ', id, layout, parentId, this.originalLayout)
        let widgetIndex = findIndex(this.originalLayout, id)
        let parentIndex = findIndex(this.originalLayout, parentId)

        if (parentId == null && widgetIndex[1] < 0) {
            // already this widget in parent only
            console.log('already this widget in parent only')
            return
        }
        else if (widgetIndex[0] == parentIndex[0]) {
            // widget exists in same parent
            console.log('widget exists in same parent')
            return
        }
        else if (parentId == null && widgetIndex[1] >= 0) {
            // widget moving from subgrid to parent
            console.log('widget moving from subgrid to parent')
            widgetIndex[2] = Object.assign(widgetIndex[2], layout)
            this.originalLayout[widgetIndex[0]].children.splice(widgetIndex[1], 1)
            this.originalLayout.push(widgetIndex[2])
        }
        else if (parentId != null && widgetIndex[1] < 0) {
            // widget moving from parent to subgrid
            console.log('widget moving from parent to subgrid')
            widgetIndex[2] = Object.assign(widgetIndex[2], layout)
            this.originalLayout.splice(widgetIndex[0], 1)
            this.originalLayout[parentIndex[0]].children.push(widgetIndex[2])
        }
        else {
            // widget moving between subgrids
            console.log('widget moving between subgrids')
            widgetIndex[2] = Object.assign(widgetIndex[2], layout)
            this.originalLayout[widgetIndex[0]].children.splice(widgetIndex[1], 1)
            this.originalLayout[parentIndex[0]].children.push(widgetIndex[2])
        }
        this.$emit('update:layout', this.originalLayout)
    })
    this.eventBus.$on('removed', (id) => {
        console.log('remove event: ', id)
        let widgetIndex = findIndex(this.originalLayout, id)
        if (widgetIndex[0] < 0 && widgetIndex[1] < 0) {
            return
        }
        if (widgetIndex[1] >= 0) {
            this.originalLayout[widgetIndex[0]].children.splice(widgetIndex[1], 1)
        }
        else {
            this.originalLayout.splice(widgetIndex[0], 1)
        }
        this.$emit('update:layout', this.originalLayout)
    })
    this.eventBus.$on('changed', (id, layout, parentId) => {
        let widgetIndex = findIndex(this.originalLayout, id)
        console.log('change event: ', id, layout, parentId, widgetIndex)
        if (widgetIndex[0] < 0 && widgetIndex[1] < 0) {
            return
        }
        if (widgetIndex[1] >= 0) {
            this.originalLayout[widgetIndex[0]].children[widgetIndex[1]] = Object.assign(this.originalLayout[widgetIndex[0]].children[widgetIndex[1]], layout)
        }
        else {
            this.originalLayout[widgetIndex[0]] = Object.assign(this.originalLayout[widgetIndex[0]], layout)
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