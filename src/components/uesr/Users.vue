<template>
    <div class=''>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>用户管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
              <el-row :gutter="20">
                <el-col :span="7">
                    <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加用户</el-button>
                </el-col>
              </el-row>

              <el-table
                :data="usersList"
                border
                style="width: 100%">
                <el-table-column
                  fixed
                  type="index"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="username"
                  label="姓名"
                  width="150">
                </el-table-column>
                <el-table-column
                  prop="email"
                  label="邮箱"
                  width="220">
                </el-table-column>
                <el-table-column
                  prop="mobile"
                  label="电话"
                  width="180">
                </el-table-column>
                <el-table-column
                  prop="role_name"
                  label="角色"
                  width="130">
                </el-table-column>

                <el-table-column
                  label="状态"
                  width="100">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.mg_state" @change="userStateChanged(scope.row)"></el-switch>
                    </template>
                </el-table-column>

                <el-table-column
                  fixed="right"
                  label="操作"
                  width="180">
                  <template slot-scope="scope">
                     <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                     <el-button type="danger" icon="el-icon-delete" size="mini" @click="deleteUser(scope.row)"></el-button>
                     <el-tooltip effect="dark" content="分配角色" placement="top" :enterable="false">
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="setRole(scope.row)"></el-button>
                    </el-tooltip>
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
                :total="toral">
              </el-pagination>

        </el-card>

        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible" width="50%" @close="addDialogClosed" :close-on-click-modal="false" :close-on-press-escape="false">

           <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名" prop="username">
                     <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                     <el-input v-model="addForm.password" type="password" ></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                     <el-input v-model="addForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                     <el-input v-model="addForm.mobile"></el-input>
                </el-form-item>

           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 修改用户的对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="updateDialogVisible" @close="editDialogClosed" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
           <el-form :model="updateForm" :rules="addFormRules" ref="addFormRef" label-width="70px">
                <el-form-item label="用户名">
                     <el-input v-model="updateForm.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                     <el-input v-model="updateForm.email"></el-input>
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                     <el-input v-model="updateForm.mobile"></el-input>
                </el-form-item>
           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="updateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUser">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配角色的对话框 -->
        <el-dialog title="分配角色" :visible.sync="setRoleDialogVisible" @close="roleDialogClosed" width="50%" :close-on-click-modal="false" :close-on-press-escape="false">
           <el-form :model="userInfo">
                <el-form-item label="用户名">
                     <el-input v-model="userInfo.username" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="当前的角色" prop="email">
                     <el-input v-model="userInfo.role_name" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="分配新角色" prop="mobile">
                    <template>
                        <el-select v-model="selectRoleId" placeholder="请选择">
                            <el-option v-for="item in roleInfo" :key="item.id" :label="item.roleName" :value="item.id"></el-option>
                        </el-select>
                    </template>
                </el-form-item>
           </el-form>

            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRoleDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editRole">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>
<script>
export default {
    name: '',
    data () {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            const regEmail = /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/
            if (regEmail.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }

         // 验证手机号码的规则
        var checkMobile = (rule, value, cb) => {
            const regMobile = /^[1][3,4,5,7,8][0-9]{9}$/
            if (regMobile.test(value)) {
                return cb()
            }
            cb(new Error('请输入合法的手机号码'))
        }

        return {
            queryInfo: {
                query: '',
                // 当前页数
                pagenum: 1,
                // 当前每页显示多少条数据
                pagesize: 10
            },
            // 用户数据信息
            usersList: [],
            // 总共有多少条数据
            toral: 0,
            addDialogVisible: false,
            updateDialogVisible: false,
            setRoleDialogVisible: false,
            addForm: {
                username: '',
                password: '',
                email: '',
                mobile: ''
            },
            updateForm: { },
            addFormRules: {
                username: [
                    { required: true, message: '请输入用户名', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
                 ],
                password: [
                    { required: true, message: '请输入密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                 ],
                email: [
                    { required: true, message: '请输入邮箱', trigger: 'blur' },
                    { validator: checkEmail, trigger: 'blur' }
                 ],
                mobile: [
                    { required: true, message: '请输入电话', trigger: 'blur' },
                    { validator: checkMobile, trigger: 'blur' }
                 ]
            },
            // 需要分配角色的用户信息
            userInfo: {},
            // 所有角色的数据
            roleInfo: [],
            // 新的角色数据
            selectRoleId: ''
        }
    },
    watch: {
    },
    created () {
        this.getUserList()
    },
    methods: {
        async getUserList () {
           const { data: res } = await this.$http.get('users', { params: this.queryInfo })
           if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
           this.usersList = res.data.users
           this.toral = res.data.total
        },
        // 用户状态改变
        async userStateChanged (userinfo) {
            const { data: res } = await this.$http.put(`users/${userinfo.id}/state/${userinfo.mg_state}`)
            if (res.meta.status !== 200) {
                userinfo.mg_state = !userinfo.mg_state
                return this.$message.error('更新用户信息失败!')
            }
            this.$message.success('更新用户信息成功!')
        },
        // 编辑用户
        async showEditDialog (id) {
            const { data: res } = await this.$http.get('users/' + id)
            if (res.meta.status !== 200) return this.$message.error('用户信息查询失败')
            this.updateForm = res.data
            this.updateDialogVisible = true
        },
        // 删除用户
        deleteUser (usreinfo) {
                this.$confirm(`确认删除"${usreinfo.username}"用户信息, 是否继续?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`users/${usreinfo.id}`)
                if (res.meta.status !== 200) return this.$message.error('用户删除失败!')
                this.getUserList()
                this.$message.success('用户删除成功!')
            }).catch(() => {
            this.$message.info('已取消删除!')
        })
        },
        // 打开用户角色对话框
        async setRole (userinfo) {
            this.userInfo = userinfo
            // 在展示对话框之前，获取所有角色的列表
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('获取角色失败')
            this.roleInfo = res.data
            this.setRoleDialogVisible = true
        },
        // 给用户分配角色
        async editRole () {
             const { data: res } = await this.$http.put(`users/${this.userInfo.id}/role`, { id: this.userInfo.id, rid: this.selectRoleId })
            if (res.meta.status !== 200) return this.$message.error('修改用户角色失败' + res.meta.msg)
            this.setRoleDialogVisible = false
            this.getUserList()
            this.$message.success('用修改用户角色成功!')
        },
        // 监听分配角色对话框的关闭事件
        roleDialogClosed () {
            this.roleInfo = []
            this.userInfo = []
            this.selectRoleId = ''
        },
        // 监听 pagesize 改变的事件
        handleSizeChange (newSize) {
            this.queryInfo.pagesize = newSize
            this.getUserList()
        },
        // 监听页码值改变事件
        handleCurrentChange (newPage) {
             this.queryInfo.pagenum = newPage
            this.getUserList()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed () {
            this.$refs.addFormRef.resetFields()
        },
        // 添加用户
        addUser () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.post('users', this.addForm)
                if (res.meta.status !== 201) return this.$message.error('用户添加失败')
                this.addDialogVisible = false
                this.getUserList()
                this.$message.success('用户添加成功!')
            })
        },
        editDialogClosed () {
            this.$refs.updateFormRef.resetFields()
        },
        editUser () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return
                const { data: res } = await this.$http.put(`users/${this.updateForm.id}`, this.updateForm)
                if (res.meta.status !== 200) return this.$message.error('用户修改失败')
                this.updateDialogVisible = false
                this.getUserList()
                this.$message.success('用户修改成功!')
            })
        }

    }
}
</script>

<style scoped>

</style>
