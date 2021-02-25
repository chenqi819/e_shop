<template>
  <div class="login_container">
    <div class="login_box">
        <!-- 头像区 -->
        <div class="avatar_box">
            <img src="../assets/img/jhLogo.png" alt="">
        </div>
        <!-- 表单登录区域 -->
        <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" label-width="0px" class="login_form">
            <!-- 用户名 -->
            <el-form-item prop="username">
                <el-input v-model="loginForm.username" prefix-icon="iconfont icon-touxiang"></el-input>
            </el-form-item>
            <!-- 密码 -->
             <el-form-item prop="password">
                <el-input  v-model="loginForm.password" prefix-icon="iconfont icon-mima" type="password"></el-input>
            </el-form-item>
            <!-- 按钮区域 -->
            <el-form-item class="btns">
               <el-button type="primary" @click="login">登录</el-button>
               <el-button type="info" @click="resetLoginForm">重置</el-button>
            </el-form-item>
        </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data () {
    return {
        loginForm: {
            username: 'admin',
            password: '123456'
        },
        loginFormRules: {
         username: [
            { required: true, message: '请输入用户名', trigger: 'blur' },
            { min: 3, max: 10, message: '长度在 3 到 5 个字符', trigger: 'blur' }
          ],
          password: [
            { required: true, message: '请输入密码', trigger: 'blur' },
            { min: 6, message: '长度不少于6个字符', trigger: 'blur' }
          ]
  }
    }
  },
    watch: {
  },
    created () {
  },
    methods: {
        // 点击点击重置按钮
    resetLoginForm () {
      this.$refs.loginFormRef.resetFields()
    },
    login () {
      this.$refs.loginFormRef.validate(async valid => {
        // 表单预验证
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm)
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')
        // 将登录后的token,保存到客户端的 sessionStorage 中
        window.sessionStorage.setItem('token', res.data.token)
        // 通过编程式导航跳转到后台主页，路由地址是/home
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style scoped>
.login_container{
  background-color: #2b4b6b;
  height: 100%;
}
.login_box{
  width: 450px;
  height:300px;
  background-color: #FFF;
  border-radius:3px;   /* 圆角边框 */

  /* div居中 */
  position: absolute;
  top:50%;
  left:50%;
  transform: translate(-50%,-50%);   /* 横轴位移自身-50%，纵轴自身-50%*/

}
.avatar_box{
  width: 130px;
  height: 130px;
  border-radius: 50%;    /* 边框变成圆形 */
  border: 1px solid #eee;
  padding: 10px;
  box-shadow: 0 0 10px;  /* 边框加阴影 */
  position: absolute;
  left:50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
 }
.avatar_box img{
  width: 100%;
  height: 100%;
  border-radius: 50%;
  background-color: #eee;
}

.login_form{
    position: absolute;
    bottom: 0;
    width: 100%;
    padding: 20px;
    box-sizing:border-box;
}
.btns{
    display: flex;   /* 变成弹性盒模型 */
    justify-content:center;   /*中间对齐 */
}
</style>
