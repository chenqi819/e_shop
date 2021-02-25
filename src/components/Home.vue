<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/img/shop.png" alt="">
                <span>信息管理平台</span>
            </div>
            <el-button type="primary" @click="logout">退出</el-button>
        </el-header>
        <!-- 页面主体区域 -->
        <el-container>
            <!-- 左边菜单栏 -->
            <el-aside :width="isCollapse ? '64px':'200px'">
                <div class="toggle-button" @click="toggleCollapse"> <i :class="collapseImage"></i></div>
                <!-- 侧边栏区域 -->
                <el-menu background-color="#333744"
                text-color="#fff"
                active-text-color="#409bff"
                :unique-opened="true"
                :collapse="isCollapse"
                :collapse-transition = "false"
                router
                :default-active="activePath"
                >
                    <!-- 一级菜单 -->
                    <el-submenu :index="'/'+item.path" v-for="item in menuList" :key="item.id" >
                        <template slot="title">
                            <i :class="iconsObj[item.id]"></i>
                            <span>{{item.authName}}</span>
                        </template>
                        <!-- 二级菜单 -->
                        <el-menu-item :index="'/'+subItem.path"  v-for="subItem in item.children" :key="subItem.id" @click="saveNavState('/'+subItem.path)">
                            <template slot="title">
                                <i class="el-icon-menu"></i>
                                <span slot="title">{{subItem.authName}}</span>
                            </template>
                        </el-menu-item>
                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 主画面 -->
            <el-main>
                <router-view></router-view>
            </el-main>
        </el-container>
    </el-container>
</template>
<script>
export default {
    name: 'Home',
    data () {
        return {
            menuList: [],
            iconsObj: {
                125: 'el-icon-user',
                103: 'el-icon-lock',
                101: 'el-icon-present',
                102: 'el-icon-shopping-cart-full',
                145: 'el-icon-pie-chart'
            },
            isCollapse: false,
            collapseImage: 'el-icon-s-fold',
            // 被激活的链接地址
            activePath: ''
        }
    },
    watch: {
    },
    created () {
        this.getMenuList()
        this.activePath = window.sessionStorage.getItem('activePath')
    },
    methods: {
        // 退出
        logout () {
            // 清空token
            window.sessionStorage.clear()
            this.$router.push('/login')
        },
        // 获取菜单项
        async getMenuList () {
            const { data: res } = await this.$http.get('menus')
            if (res.meta.status !== 200) return this.message.error(res.meta.msg)
            this.menuList = res.data
        },
        // 点击按钮 切换菜单的折叠与展开
        toggleCollapse () {
            this.isCollapse = !this.isCollapse
            if (this.isCollapse) this.collapseImage = 'el-icon-s-unfold'
             else this.collapseImage = 'el-icon-s-fold'
        },
        // 保存链接的激活状态
        saveNavState (activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = window.sessionStorage.getItem('activePath')
        }
    }
    }
</script>

<style scoped>
.home-container{
    height: 100%;
}
.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;
     padding-left: 0;
     align-items: center;   /* 按钮居中 */
     color: #fff;
     font-size: 20px;
  }

  .el-header img{
      width: 50px;
      height: 50px;

  }

  .el-header span {
          margin-left: 20px;
      }

.el-header div{
    display: flex;
    align-items: center;
  }

  .el-aside {
    background-color: #333744;
  }

  .el-menu{
      border-right: none;
  }

  .el-main {
    background-color: #eaedf1;
  }

  .toggle-button{
      background-color: #4a5064;
      font-size: 20px;
      line-height: 24px;
      color: #fff;
      text-align: center;
      cursor: pointer;
  }
</style>
