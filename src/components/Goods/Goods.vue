<template>
    <div class=''>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品列表</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodsList">
                        <el-button slot="append" icon="el-icon-search" @click="getGoodsList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="goAddpage">添加商品</el-button>
                </el-col>
            </el-row>

            <el-table
                :data="goodsList"
                border
                style="width: 100%">
                <el-table-column
                  fixed
                  type="index">
                </el-table-column>

                <el-table-column
                  prop="goods_name"
                  label="商品名称">
                </el-table-column>

                <el-table-column
                  prop="goods_price"
                  label="商品价格(元)"
                width="110">
                </el-table-column>

                <el-table-column
                  prop="goods_weight"
                  label="商品重量"
                  width="80">
                </el-table-column>

                <el-table-column
                  label="创建时间"
                  width="170">
                    <template slot-scope="scope">
                        {{scope.row.add_time | dateFormat}}
                    </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                     <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                     <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteGoods(scope.row)"></el-button>
                  </template>
                </el-table-column>
            </el-table>
            <el-pagination
                 @size-change="handleSizeChange"
                 @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[1, 2, 5, 10]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </el-card>
    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 5
            },
            // 数据条数
            total: 0,
            // 商品列表数据
            goodsList: []
        }
    },
    watch: {
    },
    created () {
        this.getGoodsList()
    },
    methods: {
        async getGoodsList () {
            const { data: res } = await this.$http.get('goods', { params: this.queryInfo })
            if (res.meta.status !== 200) {
                this.$message.error('获取商品列表失败')
            }
            this.total = res.data.total
            this.goodsList = res.data.goods
        },
        // 监听 pagesize 改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getGoodsList()
        },
        // 监听页码值改变事件
        handleCurrentChange (newPage) {
             this.queryInfo.pagenum = newPage
            this.getGoodsList()
        },
        // 删除商品
        deleteGoods (goods) {
             this.$confirm('确认删除商品信息，删除后将无法撤回, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`goods/${goods.goods_id}`)
                if (res.meta.status !== 200) return this.$message.error('商品删除失败!')
                this.getGoodsList()
                this.$message.success('商品删除成功!')
            }).catch(() => {
            this.$message.info('已取消删除!')
        })
        },
        goAddpage () {
            this.$router.push('/goods/add')
        }
    },
    computed: {

    }
}
</script>

<style scoped>

</style>
