<template>
    <div>
        <div class="widget-header">Header  <button style="float: right" @click="$emit('remove')">X</button></div>
        <div class="widget-content">
            <slot></slot>
        </div>
    </div>
</template>