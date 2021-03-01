<template>
    <div class=''>
          <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
              <el-row>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加角色</el-button>
                </el-col>
              </el-row>
              <el-table
                :data="rolesList"
                border
                style="width: 100%">
                 <el-table-column  fixed type="expand">
                   <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 === 0?'bdtop':'']" v-for="(item1,i1) in scope.row.children" :key="item1.id">
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag @close="removeRightById(scope.row,item1.id)" closable>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二、三级权限 -->
                            <el-col :span="19">
                                <el-row :class="[i2 !== 0 ?'bdtop':'']" v-for="(item2,i2) in item1.children" :key="item2.id">
                                     <!-- 渲染二级权限 -->
                                    <el-col :span="6">
                                    <el-tag @close="removeRightById(scope.row,item2.id)" type="success" closable>{{item2.authName}}</el-tag>
                                    <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <!-- 渲染三级权限 -->
                                    <el-col :span="18">
                                       <el-tag @close="removeRightById(scope.row,item3.id)" v-for="item3 in item2.children" :key="item3.id" type="warning" closable>{{item3.authName}}</el-tag>
                                    </el-col>

                                </el-row>
                            </el-col>
                        </el-row>
                   </template>
                 </el-table-column>
                 <el-table-column
                  type="index"
                  width="80">
                </el-table-column>
                <el-table-column
                  prop="roleName"
                  label="角色名称">
                </el-table-column>
                <el-table-column
                  prop="roleDesc"
                  label="角色描述">
                </el-table-column>
                <el-table-column
                  fixed="right"
                  label="操作">
                  <template slot-scope="scope">
                     <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                     <el-button type="danger" icon="el-icon-delete" size="mini" >删除</el-button>
                     <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog(scope.row)">分配权限</el-button>
                  </template>
                </el-table-column>
              </el-table>
        </el-card>

        <!-- 修改用户的对话框 -->
        <el-dialog title="角色权限分配" :visible.sync="setRightDialogVisible" width="50%" @close="closeRightDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <el-tree ref="treeRef" show-checkbox :data="rightsList" :props="treeProps" node-key="id" default-expand-all :default-checked-keys="defKeys">
            </el-tree>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="allotRights">确 定</el-button>
            </span>
        </el-dialog>

    </div>
</template>

<script>
export default {
    name: '',
    data () {
        return {
            // 左右角色的数据
            rolesList: [],
            // 控制权限分配对话框的显示与隐藏
            setRightDialogVisible: false,
            // 所有权限数据
            rightsList: [],
            treeProps: {
                children: 'children',
                label: 'authName'
            },
            defKeys: [],
            roleId: 0
        }
    },
    watch: {

    },
    created () {
        this.getRolesTree()
    },
    methods: {
        // 获取所有角色列表
        async getRolesTree () {
            const { data: res } = await this.$http.get('roles')
            if (res.meta.status !== 200) return this.$message.error('角色列表获取错误')
            this.rolesList = res.data
        },
        // 根据Id删除对应的权限
        removeRightById (role, rightId) {
             this.$confirm('此操作将永久删除, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(async () => {
                const { data: res } = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)
                if (res.meta.status !== 200) return this.$message.error('权限删除失败!')
                role.children = res.data
                this.$message.success('权限删除成功!')
            }).catch(() => {
                this.$message.info('已取消删除!')
            })
        },
         // 展示分配权限的对话框
        async showSetRightDialog (role) {
            this.roleId = role.id
            const { data: res } = await this.$http.get('rights/tree')
            if (res.meta.status !== 200) return this.$message.error('获取权限列表失败')
            this.rightsList = res.data
            this.getLeafKeys(role, this.defKeys)
            this.setRightDialogVisible = true
        },
        // 通过递归的形式，获取角色先所有三级权限的id,并保存到defKeys中
        getLeafKeys (node, arr) {
            if (!node.children) {
                return arr.push(node.id)
            }
            node.children.forEach(item => this.getLeafKeys(item, arr))
        },
        closeRightDialog () {
            this.defKeys = []
        },
        // 权限分配
        async allotRights () {
            const keys = [...this.$refs.treeRef.getCheckedKeys(), ...this.$refs.treeRef.getHalfCheckedNodes()]
            const idStr = keys.join(',')
            const { data: res } = await this.$http.post(`roles/${this.roleId}/rights`, { rids: idStr })
           if (res.meta.status !== 200) return this.$message.error('权限分配失败!')
           this.setRightDialogVisible = false
           this.getRolesTree()
           this.$message.success('权限分配成功!')
        }
    }
}
</script>

<style scoped>
.el-tag{
    margin: 7px;
}

.bdtop{
    border-top: 1px solid #eee
}

.bdbottom{
    border-bottom: 1px solid #eee
}
</style>
