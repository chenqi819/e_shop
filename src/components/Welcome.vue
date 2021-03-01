<template>
    <div class=''>
        <el-calendar v-model="value">
        </el-calendar>
    </div>
</template>

<script>
export default {
    name: '',
    data() {
        return {
            value: new Date()
        }
    },
    watch: {
    },
    created() {
    },
    methods: {
    }
}
</script>

<style scoped>

</style>
