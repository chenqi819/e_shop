<template>
    <div class=''>
          <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>
            <!-- 卡片视图区域 -->
        <el-card>
              <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="showAddCateDialog">添加分类</el-button>
                </el-col>
              </el-row>
              <tree-table class="tree-table" :data="cateList"
                          :columns="columns"
                          :selection-type ="false"
                          tree-type :expand-type="false"
                          show-index
                          border>
                    <template slot="isOk" slot-scope="scope">
                        <i v-if="scope.row.cat_deleted === false " class="el-icon-success" style="color : lightgreen"></i>
                        <i v-else class="el-icon-error" style="color : red"></i>
                    </template>
                    <template slot="tag" slot-scope="scope">
                        <el-tag size="mini" v-if="scope.row.cat_level === 0">一级</el-tag>
                        <el-tag size="mini" v-else-if="scope.row.cat_level === 1" type="warning">二级</el-tag>
                        <el-tag size="mini" v-else type="success">三级</el-tag>
                    </template>
                    <template slot="option" slot-scope="scope">
                        <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)">删除</el-button>
                    </template>
              </tree-table>
              <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="queryInfo.pagenum"
                :page-sizes="[5, 20, 30, 40]"
                :page-size="queryInfo.pagesize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="toral">
              </el-pagination>
        </el-card>
        <!-- 添加商品分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="50%" @close="addCateDialogClosed" :close-on-click-modal="false" :close-on-press-escape="false">
           <el-form :model="addCateInfo" :rules="addCateRules" ref="addCateRef">
                <el-form-item label="分类名称" prop="cat_name" label-width="80px">
                     <el-input v-model="addCateInfo.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类" label-width="80px">
                    <el-cascader width="50%" v-model="selectdKeys" clearable :options="cateData" @change="parpentCateChanged" :props="{ expandTrigger: 'hover', label:'cat_name', value: 'cat_id' }"></el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCate">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            queryInfo: {
                // [1,2,3]  值：1，2，3 分别表示显示一层二层三层分类列表
                type: 3,
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 5
            },
            // 商品分类列表
            cateList: [],
            // 总共有多少条数据
            toral: 0,
            // 为table指定列的定义
            columns: [{
                label: '分类名称',
                prop: 'cat_name'
                },
                {
                label: '是否有效',
                type: 'template',
                // 表示当前列使用的模板
                template: 'isOk'
                },
                {
                label: '排序',
                type: 'template',
                // 表示当前列使用的模板
                template: 'tag'
                },
                {
                label: '操作',
                type: 'template',
                // 表示当前列使用的模板
                template: 'option'
                }],
            addCateDialogVisible: false,
            // 添加的用户信息
            addCateInfo: {
                addCateInfo: '',
                cat_pid: 0,
                cat_level: 0
            },
            addCateRules: {
                cat_name: [
                    { required: true, message: '请输入分类名', trigger: 'blur' }
                 ]
            },
            cateData: [],
            //
            selectdKeys: []
        }
    },
    watch: {
    },
    created () {
        this.getCateList()
    },
    methods: {
        // 获取商品分类
        async getCateList () {
            const { data: res } = await this.$http.get('categories', { params: this.queryInfo })
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.cateList = res.data.result
            this.toral = res.data.total
        },
        // 监听 pagesize 改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getCateList()
        },
        // 监听页码值改变事件
        handleCurrentChange (newPage) {
            this.queryInfo.pagenum = newPage
            this.getCateList()
        },
        // 打开添加分类对话框
        async showAddCateDialog () {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.erroe('获取分类数据列表错误')
            this.cateData = res.data
            this.addCateDialogVisible = true
        },
        // 添加分类对话框关闭时清理缓存
        addCateDialogClosed () {
            this.selectdKeys = []
            this.$refs.addCateRef.resetFields()
            this.addCateInfo.cat_pid = 0
            this.addCateInfo.cat_level = 0
        },
        // 选择项发生变化触发
        parpentCateChanged () {
            if (this.selectdKeys.length > 0) {
                this.addCateInfo.cat_pid = this.selectdKeys[this.selectdKeys.length - 1]
                this.addCateInfo.cat_level = this.selectdKeys.length
            } else {
                this.addCateInfo.cat_pid = 0
                this.addCateInfo.cat_level = 0
            }
        },
        // 添加商品分类
        async addCate () {
            const { data: res } = await this.$http.post('categories', this.addCateInfo)
            if (res.meta.status !== 201) return this.$message.error('添加商品分类数据错误')
            this.$message.success('添加商品分类数据成功')
            this.getCateList()
             this.addCateDialogVisible = false
        }
    }
}
</script>

<style scoped>
.tree-table{
    margin-top: 15px;
}
.el-cascader{
    width: 100%;
}
</style>
