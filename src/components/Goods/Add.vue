<template>
    <div class=''>
         <!-- 面包屑导航区域 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>添加商品</el-breadcrumb-item>
        </el-breadcrumb>
        <el-card>
            <el-alert title="添加商品信息" type="info" center show-icon :closable="false"> </el-alert>
            <!-- 步骤条 -->
            <el-steps :active="activeIndex-0" finish-status="success" align-center>
                <el-step title="基本信息"></el-step>
                <el-step title="商品参数"></el-step>
                <el-step title="商品属性"></el-step>
                <el-step title="商品图片"></el-step>
                <el-step title="商品内容"></el-step>
                <el-step title="完成"></el-step>
            </el-steps>

            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef" label-width="100" label-position="top">
                <!-- 左边菜单栏 -->
                <el-tabs tab-position="left" v-model="activeIndex" :before-leave="beforeTabLeave" @tab-click="tabClicked">
                    <el-tab-pane label="基本信息" name="0">
                        <el-form-item label="商品名称" prop="goods_name">
                            <el-input v-model="addForm.goods_name"></el-input>
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goods_price">
                            <el-input v-model="addForm.goods_price" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goods_weight">
                            <el-input v-model="addForm.goods_weight" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goods_number" >
                            <el-input v-model="addForm.goods_number" type="number"></el-input>
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goods_cat">
                            <el-cascader v-model="addForm.goods_cat"
                                :options="cateList"
                                :props="cateProps"
                                @change="handleChange"
                            ></el-cascader>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品参数" name="1">
                        <el-form-item :label="item.attr_name" v-for="item in manyParams" :key="item.attr_id">
                            <el-checkbox-group v-model="item.attr_vals">
                                <el-checkbox border :label="cb" v-for="(cb,i) in item.attr_vals" :key="i"></el-checkbox>
                            </el-checkbox-group>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品属性" name="2">
                        <el-form-item :label="item.attr_name" v-for="item in onlyParams" :key="item.attr_id">
                           <el-input v-model="item.attr_vals"></el-input>
                        </el-form-item>
                    </el-tab-pane>
                    <el-tab-pane label="商品图片" name="3">
                        <!-- action 图片上传的后台路径 -->
                        <el-upload
                            :headers="headerObj"
                            :on-success="handleSuccess"
                            :action="uploadURL"
                            :on-preview="handlePreview"
                            :on-remove="handleRemove"
                            list-type="picture">
                            <el-button size="small" type="primary">点击上传</el-button>
                        </el-upload>
                    </el-tab-pane>
                    <el-tab-pane label="商品内容" name="4">
                        <!-- 富文本编辑器 -->
                         <quill-editor
                            ref="myQuillEditor"
                            v-model="addForm.goods_introduce"/>
                        <el-button type="primary" class="btnAdd" @click="addGoods">添加商品</el-button>
                    </el-tab-pane>
                </el-tabs>
            </el-form>
        </el-card>

        <!-- 图片预览 -->
        <el-dialog
            title="图片预览"
            :visible.sync="previewVisible"
            width="50%">
            <img :src="previewPath" class="previewImg">
        </el-dialog>
    </div>
</template>

<script>
import _ from 'lodash'

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
            // 商品分类列表
            selectdKeys: [],
            // 进度条
            activeIndex: '0',
            // 添加商品数据的表单数据
            addForm: {
                goods_name: '',
                goods_price: 0,
                goods_weight: 0,
                goods_number: 0,
                // 商品所在的分类数组
                goods_cat: [],
                // 上传的图片临时路径（对象）
                pics: [],
                // 商品详情描述
                goods_introduce: '',
                // 商品的参数（数组）
                attrs: []
            },
            addFormRules: {
                goods_name: [
                    { required: true, message: '请输入商品名称', trigger: 'blur' }
                ],
                goods_price: [
                    { required: true, message: '请输入商品价格', trigger: 'blur' }
                ],
                goods_weight: [
                    { required: true, message: '请输入商品重量', trigger: 'blur' }
                ],
                goods_number: [
                    { required: true, message: '请输入商品数量', trigger: 'blur' }
                ],
                goods_cat: [
                    { required: true, message: '请选择商品分类', trigger: 'blur' }
                ]
            },
            // 商品动态参数数据
            manyParams: [],
            // 商品静态属性数据
            onlyParams: [],
            // 图片上传的后台路径
            uploadURL: 'http://127.0.0.1:8888/api/private/v1/upload',
            // 图片上传组件的headers请求头对象
            headerObj: {
                Authorization: window.sessionStorage.getItem('token')
            },
            // 预览图片的地址
            previewPath: '',
            // 图片预览对话框使能
            previewVisible: false
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
            const { data: res } = await this.$http.get('categories')
            if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
            this.cateList = res.data
        },
        // 级联选择器选中项改变触发
        handleChange () {
            if (this.addForm.goods_cat.length !== 3) {
                this.addForm.goods_cat = []
            }
        },
        // 切换标签之前的钩子，若返回 false 或者返回 Promise 且被 reject，则阻止切换。
        beforeTabLeave (activeName, oldActiveName) {
            if (oldActiveName === '0' && this.addForm.goods_cat.length !== 3) {
                this.$message.error('请先选择商品分类')
                return false
            }
        },
        // tab 被选中时触发
        async tabClicked () {
            if (this.activeIndex === '1') {
                // 动态参数面板
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'many' } })
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                res.data.forEach(item => {
                    item.attr_vals = item.attr_vals.lenght === 0 ? [] : item.attr_vals.split(' ')
                })
                this.manyParams = res.data
            } else if (this.activeIndex === '2') {
                // 静态属性面板
                const { data: res } = await this.$http.get(`categories/${this.cateId}/attributes`, { params: { sel: 'only' } })
                if (res.meta.status !== 200) return this.$message.error(res.meta.msg)
                this.onlyParams = res.data
            }
        },
        // 处理图片预览效果
        handlePreview (file) {
            this.previewPath = file.response.data.url
            this.previewVisible = true
        },
        // 处理移除的图片操作
        handleRemove (file) {
            // 1 得到将要删除的图片的路径
            const filePath = file.response.data.tem_path
            // 2 从 pics的数组中,找到这个图片对应的索引值
            const index = this.addForm.pics.findIndex(x => x.pic === filePath)
            // 3 调用 splice 方法移除图片
            this.addForm.pics.splice(index, 1)
        },
        // 监听图片上传成功的事件
        handleSuccess (response) {
            // 1.拼接得到一个图片信息对象
            const picInfo = { pic: response.data.tem_path }
            // 2.将图片信息对象,push到pics数组
            this.addForm.pics.push(picInfo)
        },
        // 添加商品
        addGoods () {
            this.$refs.addFormRef.validate(async valid => {
                if (!valid) return this.$message.error('请填写必要的表单项!')
                    // 处理动态参数
                    this.manyParams.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals.join(' ') }
                        this.addForm.attrs.push(newInfo)
                    })
                    // 处理动态参数
                    this.onlyParams.forEach(item => {
                        const newInfo = { attr_id: item.attr_id, attr_value: item.attr_vals }
                        this.addForm.attrs.push(newInfo)
                    })
                // 深拷贝
                const form = _.cloneDeep(this.addForm)
                form.goods_cat = form.goods_cat.join(',')
                const { data: res } = await this.$http.post('goods', form)
                if (res.meta.status !== 201) return this.$message.error('商品添加失败')
                this.$message.success('商品添成功')
                this.$router.push('/goods')
            })
        }
    },
    computed: {
        cateId () {
            if (this.addForm.goods_cat.length !== 3) {
                return null
            }
            return this.addForm.goods_cat[2]
        }
    }
}
</script>

<style scoped>
.el-checkbox{
    margin: 0 5px 0 0 !important;
}
.previewImg{
    width: 100%;
}
.btnAdd{
    margin-top: 15px;
}

</style>
