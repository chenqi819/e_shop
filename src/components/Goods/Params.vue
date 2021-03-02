<template>
    <div class=''>
           <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类参数</el-breadcrumb-item>
        </el-breadcrumb>
          <!-- 卡片视图区域 -->
        <el-card>
            <el-alert
               title="注意：只允许为第三级分类设置相关参数！" type="warning" show-icon :closable = "false">
            </el-alert>
            <el-row :gutter="2" class="cat_opt">
                <el-col :span="3">
                    <span>选择商品分类：</span>
                </el-col>
                <el-col :span="21">
                    <el-cascader v-model="selectdKeys"
                    :options="cateList"
                    :props="cateProps"
                    @change="getSelceCateId"
                     ></el-cascader>
                </el-col>
            </el-row>
            <!-- tab标签页 -->
            <el-tabs v-model="activeName" @tab-click="handleTabClick">
                <!-- 添加动态参数面板 -->
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" size="mini" @click="addParamsDialogVisible = true" :disabled="isBtnDisabled">添加参数</el-button>
                    <el-table
                        :data="manyTableData"
                        style="width: 100%" border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                                <el-tag closable v-for="(item,index) in scope.row.attr_vals" @close="tagClose(scope.row,index)" :key="index">{{item}}</el-tag>
                                <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index"  label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="参数名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <!-- 添加静态属性面板 -->
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" size="mini" @click="addParamsDialogVisible = true" :disabled="isBtnDisabled">添加属性</el-button>
                    <el-table
                        :data="anlyTableData"
                        style="width: 100%" border>
                        <el-table-column type="expand">
                            <template slot-scope="scope">
                              <el-tag closable v-for="(item,index) in scope.row.attr_vals" @close="tagClose(scope.row,index)" :key="index">{{item}}</el-tag>
                              <el-input
                                class="input-new-tag"
                                v-if="scope.row.inputVisible"
                                v-model="scope.row.inputValue"
                                ref="saveTagInput"
                                size="small"
                                @keyup.enter.native="handleInputConfirm(scope.row)"
                                @blur="handleInputConfirm(scope.row)"
                                >
                                </el-input>
                                <el-button v-else class="button-new-tag" size="small" @click="showInput(scope.row)">+ New Tag</el-button>
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#"></el-table-column>
                        <el-table-column prop="attr_name" label="属性名称"></el-table-column>
                        <el-table-column label="操作">
                            <template slot-scope="scope">
                                <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.attr_id)">修改</el-button>
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteParams(scope.row.attr_id)">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
            </el-tabs>
        </el-card>
        <!-- 添加的对话框 -->
        <el-dialog :title="'添加'+ titleText" :visible.sync="addParamsDialogVisible" width="50%" @close="addParamsDialogClosed" :close-on-click-modal="false" :close-on-press-escape="false">

           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" width="50%">
                <el-form-item :label="titleText" prop="attr_name" label-width="80px">
                     <el-input v-model="addForm.attr_name"></el-input>
                </el-form-item>
           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addParams">确 定</el-button>
            </span>
        </el-dialog>

         <!-- 编辑的对话框 -->
        <el-dialog :title="'修改'+ titleText" :visible.sync="editParamsDialogVisible" width="50%" @close="editParamsDialogClosed" :close-on-click-modal="false" :close-on-press-escape="false">

           <el-form :model="editForm" :rules="addFormRules" ref="editFormRef" width="50%">
                <el-form-item :label="titleText" prop="attr_name" label-width="80px">
                     <el-input v-model="editForm.attr_name"></el-input>
                </el-form-item>
           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="editParamsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editParams">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            // 商品分类列表
            cateList: [],
            // 级联选择框的配置信息
            cateProps: {
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
                expandTrigger: 'hover'
            },
            // 选中的商品ID
            selectdKeys: [],
            activeName: 'many',
            // 动态参数数据
            manyTableData: [],
            // 静态参数数据
            anlyTableData: [],
            // 添加参数对话框使能
            addParamsDialogVisible: false,
            // 编辑对话框使能
            editParamsDialogVisible: false,
            // 添加数据对象
            addForm: {
                attr_name: '',
                attr_sel: '',
                attr_vals: ''
            },
            addFormRules: {
                attr_name: [
                    { required: true, message: '请输入参数', trigger: 'blur' }
                ]
            },
            // 编辑数据对象
            editForm: {}

        }
    },
    watch: {
    },
    created () {
        // 获取所有的商品分类列表
        this.getCateList()
    },
    methods: {
        async getCateList () {
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品分类失败')
            }
            this.cateList = res.data
        },
        getSelceCateId () {
            this.getParmsData()
        },
        // Tab页签点击事件的响应
        handleTabClick () {
            this.getParmsData()
        },
        // 获取参数列表数据
        async getParmsData () {
            if (this.selectdKeys.length !== 3) {
                this.selectdKeys = []
                this.manyTableData = []
                this.anlyTableData = []
                return ''
            }
            if (this.CateId === null) return
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: this.activeName } })
            if (res.meta.status !== 200) {
                return this.$message.error('获取商品参数失败')
            }
            res.data.forEach(item => {
                item.attr_vals = item.attr_vals ? item.attr_vals.split(' ') : []
                // 控制文本框的显示与隐藏
                item.inputVisible = false
                // 文本框输入的内容
                item.inputValue = ''
            })

            if (this.activeName === 'many') {
                this.manyTableData = res.data
            } else {
                this.anlyTableData = res.data
            }
        },
        // 添加参数对话框关闭事件
        addParamsDialogClosed () {
            this.$refs.addFormRef.resetFields()
        },
        // 添加参数
        addParams () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post(`categories/${this.cateId}/attributes`, {
                    attr_name: this.addForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 201) return this.$message.error('添加参数失败')
                this.$message.success('参数添加成功')
                this.addParamsDialogVisible = false
                this.getParmsData()
            })
        },
        // 点击按钮，展示修改的对话框
        async showEditDialog (attrId) {
            const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes/${attrId}`, { params: { attr_sel: this.activeName } })
            if (res.meta.status !== 200) return this.$message.error('获取参数信息失败')
            this.editForm = res.data
            this.editParamsDialogVisible = true
        },
        // 关闭编辑对话框
        editParamsDialogClosed () {
            this.$refs.editFormRef.resetFields()
        },
        // 点击按钮修改参数
        editParams () {
              this.$refs.editFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${this.editForm.attr_id}`, {
                    attr_name: this.editForm.attr_name,
                    attr_sel: this.activeName
                })
                if (res.meta.status !== 200) return this.$message.error('修改参数失败')
                this.$message.success('修改参数成功')
                this.editParamsDialogVisible = false
                this.getParmsData()
            })
        },
        // 删除参数
        deleteParams (attrId) {
             this.$confirm('删除商品参数信息将无法撤回, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`categories/${this.cateId}/attributes/${attrId}`)
                if (res.meta.status !== 200) return this.$message.error('参数删除失败!')
                this.getParmsData()
                this.$message.success('参数删除成功!')
            }).catch(() => {
                this.$message.info('已取消删除!')
            })
        },
        // 文本框失去焦点或者按下了 Enter 都会触发
        async handleInputConfirm (row) {
            if (row.inputValue.trim().length === 0) {
                row.inputValue = ''
                row.inputVisible = false
                return ''
            }
            row.attr_vals.push(row.inputValue.trim())
            row.inputValue = ''
            row.inputVisible = false

            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) return this.$message.error('修改参数项失败!')
                this.getParmsData()
                this.$message.success('修改参数项成功!')
                this.getParmsData()
        },
        // 点击按钮显示文本输入框
        showInput (row) {
            row.inputVisible = true
            // $nextTick 当页面上的元素被重新渲染之后，才会执行回调函数中的代码
            this.$nextTick(_ => {
                this.$refs.saveTagInput.$refs.input.focus()
            })
        },
        // 删除参数点
        async tagClose (row, index) {
            row.attr_vals.splice(index, 1)
            const { data: res } = await this.$http.put(`categories/${this.cateId}/attributes/${row.attr_id}`,
                {
                    attr_name: row.attr_name,
                    attr_sel: row.attr_sel,
                    attr_vals: row.attr_vals.join(' ')
                })
                if (res.meta.status !== 200) return this.$message.error('删除参数项失败!')
                this.getParmsData()
                this.$message.success('删除参数项成功!')
                this.getParmsData()
        }
    },
    computed: {
        isBtnDisabled() {
            if (this.selectdKeys.length !== 3) {
                return true
            }
            return false
        },
        // 获取当选中的三级分类的Id
        cateId () {
            if (this.selectdKeys.length === 3) {
                return this.selectdKeys[2]
            }
            return null
        },
        // 动态获取标题名称
        titleText () {
            if (this.activeName === 'many') {
                return '动态参数'
            }
            return '静态参数'
        }
    }
}
</script>

<style scoped>
.cat_opt{
    margin: 15px 0;
}
.el-tag{
    margin: 0 5px;
}
.input-new-tag{
    width: 150px;
}
</style>
