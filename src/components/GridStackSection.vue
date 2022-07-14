<template>
<div class="grid-stack grid-stack-nested">
    <slot v-if="grid"></slot>
</div>
</template>
<script>
import { GridStack } from 'gridstack';
export default {
    props: ['id', 'x', 'y', 'w', 'h', 'section'],
    inject: ['eventBus', 'layout'],
    data() {
        return {
            grid: null
        }
    },
    provide() {
        return {
            sublayout: this
        }
    },
    mounted() {
        console.log('section added: ', this.eventBus)
        if (this.layout.grid) {
            this.grid = GridStack.init({
                acceptWidgets: true,
                minRow: 2,
                resizable: {
                    handles: 'e,se,s,sw,w'
                }}, this.$el)
            this.grid.on('added', (event, items) => {
                console.log('widget added to sub grid', event.detail[0].id)
                items.forEach((item) => {
                    this.eventBus.$emit('added', item.id, {
                        id: item.id, 
                        w: item.w,
                        h: item.h,
                        x: item.x,
                        y: item.y
                    }, this.id)
                })
            })
            this.grid.on('removed', (event, items) => {
                console.log('widget removed from sub grid', event.detail[0].id)
                items.forEach((item) => {
                    this.eventBus.$emit('removed', item.id, this.id)
                })
            })
            this.grid.on('change', (event, items) => {
                console.log('widget changed from sub grid', event.detail[0].id)
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
                        }, this.id)
                    }
                })
            })
        }
    },
    beforeDestroy() {
        if (this.grid) {
            this.grid.destroy()
        }
    }
}
</script>
