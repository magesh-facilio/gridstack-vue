<template>
<div class="grid-stack-item" :gs-id="id" :gs-x="x" :gs-y="y" :gs-w="w" :gs-h="h">
    <div class="grid-stack-item-content">
        <slot></slot>
    </div>
</div>
</template>
<script>
export default {
    props: ['index', 'x', 'y', 'w', 'h', 'id', 'sub'],
    inject: ['eventBus', 'layout', 'sublayout'],
    mounted() {
        console.log('added: ', this.$el, this.grid, this.layout.grid, this.sublayout)
        if (this.sublayout) {
            this.sublayout.grid.makeWidget(this.$el)
        }
        else if (this.layout.grid) {
            this.layout.grid.makeWidget(this.$el)
        }
    },
    beforeDestroy() {
        console.log('removing: ', this.$el, this.grid)
        if (this.sublayout) {
            this.sublayout.grid.removeWidget(this.$el)
        }
        else {
            this.layout.grid.removeWidget(this.$el)
        }
    }
}
</script>
