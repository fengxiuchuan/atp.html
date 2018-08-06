<template>
    <section>
       <!--树形控件-->
            <el-input
                    placeholder="输入关键字进行过滤"
                    v-model="filterText">
            </el-input>
            <el-tree
                style="margin-top: 10px;"
                height="28px"
                :data="data2"
                :props="defaultProps"
                node-key="id"
                highlight-current
                default-expand-all
                :expand-on-click-node="false">
                <span class="custom-tree-node" style="margin:5px;height:20px;" slot-scope="{ node, data }">
                <span><el-input type="text" style="width:100px;heght:18px" size="small" :readonly="data.readOnly" v-model="data.name"  placeholder="请输入名称"></el-input></span>
                <span><el-input type="text" style="width:200px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.url" placeholder="url"></el-input></span>
                <span><el-input type="text" style="width:120px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.path" placeholder="path"></el-input></span>
                <span><el-input type="text" style="width:100px;heght:18px"  size="small" :readonly="data.readOnly" v-model="data.iconCls" placeholder="iconCls"></el-input></span>
                <span style="width:80px" >
                  
                    <el-switch
                      v-model="data.requireAuth"
                       active-text="授权"
                       inactive-text="开放"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value=""
                      inactive-value="0">
                    </el-switch>
                </span>
                <span style="width:30px" >
                    <el-switch
                      v-model="data.enabled"
                      active-text="有效"
                      inactive-text="无效"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      active-value=""
                      inactive-value="0">
                    </el-switch></span>
                  <span style="width:30px" >
                    <el-select   size="small"  v-model="data.menuType"  placeholder="请选择" >
                        <el-option
                        v-for="item in menuTypeArr"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value" >
                        </el-option>
                    </el-select>
                  </span>
                  <span style="width:30px" >
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => append(data)">
                      新增
                    </el-button>
                    <el-button
                      type="text"
                      size="mini"
                      @click="() => remove(node, data)">
                      删除
                    </el-button>
                    <el-button
                      v-if="data.id == -1"
                      type="text"
                      size="mini"
                      @click="() => saveNode(data)">
                      保存
                    </el-button>
                  </span>
                </span>
            </el-tree>
      
        
        
    </section>
</template>
<script>
import TreeRender from '../components/Tree_render'
export default {
    watch: {
      filterText(val) {
        this.$refs.tree2.filter(val);
      }
    },
    data:function() {
      const data2 =   [
        {
            id: 1,
            name:"一级",
            url:"/user/cc",
            path:"user",
            iconCls:"icon-user",
            requireAuth:"",
            requireAuth:true,
            enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
            parentId: '',
            children: [{
              id: 4,
              name:"二级-1级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
            },{
              id: 5,
              name:"二级 2-2级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
            }, {
              id: 6,
              name:"二级-1级",
              url:"/user/cc",
              path:"user",
              iconCls:"icon-user",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '1',
            },]
          }];

        const nodeObj = {
              id:"",
              name:"",
              url:"",
              path:"",
              iconCls:"",
              requireAuth:"",
              requireAuth:true,
              enabled:"",  //根据后台给的是否可删除节点，也可以根据当前的node节点自行判断
              parentId: '',
        }
      return {
        filterText: '',
        data2:JSON.parse(JSON.stringify(data2)),
        menuTypeArr:[
          {label:"菜单",value:"menu"},
          {label:"按钮",value:"btn"}
        ],
        defaultProps: {
          children: 'children',
          label: 'label'
        },
        /*新增事件弹窗的输入框数据*/
        addEventdialogVisible: false,
        addEventForm:{
            categoryName: '',
            categoryFlag: '',
        },
        addEventNodeRules:[]
      };
    },
    methods: {
      handleNodeClick(data) {
        console.log(data);
      },
      append(data) {
        const newChild = nodeObj;
        newChild.parentId = data.id;
        if (!data.children) {
          this.$set(data, 'children', []);
        }
        data.children.push(newChild);
      },

      remove(node, data) {
        const parent = node.parent;
        const children = parent.data.children || parent.data;
        const index = children.findIndex(d => d.id === data.id);
        children.splice(index, 1);
      },
      saveNode(data){

      }
    },
    components:{
      "TreeRender":TreeRender
    }
  };
</script>
