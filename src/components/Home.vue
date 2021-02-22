<template>
    <div class=''>
        <el-button type="primary" @click="logout">退出</el-button>
    </div>
</template>

<script>
export default {
    name: 'Home',
    data () {
        return {
        }
    },
    watch: {
    },
    created () {
    },
    methods: {
        logout () {
            // 清空token
            window.sessionStorage.clear()
            this.$router.push('/login')
        }
    }
    }
</script>

<style scoped>

</style>
